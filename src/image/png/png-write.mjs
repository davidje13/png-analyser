import { deflateSync } from 'node:zlib'; // https://www.ietf.org/rfc/rfc1950.txt / https://www.ietf.org/rfc/rfc1951.txt
import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeChunk } from './chunk.mjs';
import { getEncodingOptions } from './optimisation/encoding-options.mjs';

const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const VOID = new Uint8Array(0);

/**
 * @typedef {import('./optimisation/encoding-options.mjs').EncodingOption} EncodingOption
 *
 * @typedef {{
 *   encoding: EncodingOption;
 *   compressed: ArrayBufferView;
 *   size: number;
 *   attemptNumber: number;
 *   zlibLevel: number;
 *   filterPicker: string;
 * }} EncodingChoice
 *
 * @typedef {{
 *   prev: GraphNode | null;
 *   cost: number;
 *   filter: number;
 *   tokenDistance: Map<number, number>;
 * }} GraphNode
 */

/**
 * @param {number[][]} image
 */
export function writePNG(image, { preserveTransparentColour = false, compressionTimeAllotment = 2000 } = {}) {
  if (!image[0]?.length) {
    throw new Error('Cannot save empty image');
  }

  const { choice, totalAttempts, idatCacheMisses } = pickOption(image, preserveTransparentColour, compressionTimeAllotment);
  if (!choice) {
    throw new Error('Failed to encode image');
  }

  const ihdr = new ByteArrayBuilder();
  ihdr.uint32BE(image[0].length);
  ihdr.uint32BE(image.length);
  ihdr.uint8(choice.encoding.bitDepth);
  ihdr.uint8(choice.encoding.colourType);
  ihdr.uint8(0); // compression method
  ihdr.uint8(0); // filter method
  ihdr.uint8(0); // interlace method

  const buf = new ByteArrayBuilder();
  buf.append(PNG_HEADER);
  writeChunk(buf, 'IHDR', ihdr);
  if (choice.encoding.plte?.byteLength) {
    writeChunk(buf, 'PLTE', choice.encoding.plte);
  }
  if (choice.encoding.trns?.byteLength) {
    writeChunk(buf, 'tRNS', choice.encoding.trns);
  }
  writeChunk(buf, 'IDAT', choice.compressed);
  writeChunk(buf, 'IEND', VOID);

  return {
    data: buf,
    filterPicker: choice.filterPicker,
    zlibLevel: choice.zlibLevel,
    attemptNumber: choice.attemptNumber,
    totalAttempts,
    idatCacheMisses,
  };
}

/**
 * @param {number[][]} image
 * @param {boolean} preserveTransparentColour
 * @param {number} compressionTimeAllotment
 */
function pickOption(image, preserveTransparentColour, compressionTimeAllotment) {
  const timeout = Date.now() + compressionTimeAllotment;

  const options = getEncodingOptions(image, preserveTransparentColour).flatMap((encoding) =>
    FILTER_PICKERS.flatMap((filterPicker) =>
      ZLIB_COMPRESSION_LEVELS.flatMap((zlibLevel) => ({
        encoding,
        filterPicker,
        zlibLevel,
        weight: encoding.weight * filterPicker.weight * zlibLevel.weight,
      }))
    )
  ).sort((a, b) => b.weight - a.weight); // sort by descending weight

  const IDAT_CACHE_MAX_SIZE = 20;
  let idatCacheMisses = 0;
  let idatID = 0;
  const filters = makeFilterTargets(image);
  const VOID_ROW = new Uint8Array(filters[0].length);

  /**
   * @typedef {{
   *   mapped: Uint8Array[],
   *   attemptedRowFilters: number[][],
   *   filterCache: Map<string, { rowFilters: number[], idatID: number } | false>,
   * }} EncodingState
   */
  /** @type {Map<EncodingOption, EncodingState>} */ const encodingCache = new Map();
  /** @type {Map<number, ByteArrayBuilder>} */ const idatCache = new Map();

  let attempt = 0;
  /** @type {EncodingChoice | null} */ let choice = null;
  for (const { encoding, filterPicker, zlibLevel } of options) {
    let encState = encodingCache.get(encoding);
    if (!encState) {
      const mapped = image.map(encoding.rowMapper);
      encState = { mapped, attemptedRowFilters: [], filterCache: new Map() };
      encodingCache.set(encoding, encState);
    }
    const leftShift = encoding.filterStep;

    let filterState = encState.filterCache.get(filterPicker.id);
    if (!filterState) {
      if (filterState === false) {
        continue;
      }
      const rowFilters = filterPicker.picker(encState.mapped, leftShift, filters);
      if (encState.attemptedRowFilters.some((row) => row.every((v, i) => rowFilters[i] === v))) {
        encState.filterCache.set(filterPicker.id, false);
        continue; // already tried this set of filters
      }
      encState.attemptedRowFilters.push(rowFilters);

      ++idatID;
      filterState = { rowFilters, idatID };
      encState.filterCache.set(filterPicker.id, filterState);
    }

    const sz = encState.mapped[0].length;

    let idat = idatCache.get(filterState.idatID);
    if (!idat) {
      if (filterState.idatID !== idatID) {
        ++idatCacheMisses;
      }

      if (idatCache.size > IDAT_CACHE_MAX_SIZE) {
        const oldestKey = idatCache.keys().next().value;
        idat = idatCache.get(oldestKey) ?? new ByteArrayBuilder();
        idat.truncate(0);
        idatCache.delete(oldestKey);
      } else {
        idat = new ByteArrayBuilder();
      }

      let prev = VOID_ROW;
      for (let r = 0; r < encState.mapped.length; ++r) {
        const row = encState.mapped[r];
        const rowFilterType = filterState.rowFilters[r];
        applyFilters(row, prev, leftShift, filters);
        idat.append(filters[rowFilterType], 0, sz + 1);
        prev = row;
      }

      idatCache.set(filterState.idatID, idat);
    }

    ++attempt;
    const o = compress(idat.toBytes(), encoding.plte, encoding.trns, zlibLevel.level);
    if (!choice || o.size < choice.size) {
      choice = {
        encoding,
        compressed: o.compressed,
        size: o.size,
        zlibLevel: zlibLevel.level,
        filterPicker: filterPicker.id,
        attemptNumber: attempt,
      };
    }
    if (Date.now() >= timeout) {
      return { choice, totalAttempts: attempt, idatCacheMisses };
    }
  }
  return { choice, totalAttempts: attempt, idatCacheMisses };
}

// experimentally: 9 is best 74% of the time, then 5 (18%), 8 (5%), 7/4/6 (3% combined)
const ZLIB_COMPRESSION_LEVELS = [
  { level: 9, weight: 380 },
  { level: 8, weight: 25 },
  { level: 7, weight: 5 },
  { level: 6, weight: 5 },
  { level: 5, weight: 92 },
  { level: 4, weight: 3 },
];

/**
 * @param {Uint8Array} idat
 * @param {ArrayBufferView | undefined} plte
 * @param {ArrayBufferView | undefined} trns
 * @param {number} zlibLevel
 */
function compress(idat, plte, trns, zlibLevel) {
  let windowBits = 8;
  while (windowBits < 15 && (1 << windowBits) < idat.byteLength) { // window size <= 32kB
    ++windowBits;
  }
  const compressed = deflateSync(idat, { // method=8, no dictionary
    windowBits,
    level: zlibLevel,
    memLevel: 9,
    chunkSize: 16 * 1024,
  });
  const size = (
    compressed.byteLength +
    (plte?.byteLength ? 12 + plte.byteLength : 0) +
    (trns?.byteLength ? 12 + trns.byteLength : 0)
  );
  return { compressed, size };
}

/**
 * @param {number[][]} image
 */
function makeFilterTargets(image) {
  // allocate maximum possible row size (RGBA 8-bit)
  const size = 1 + image[0].length * 4;
  const FILTER_COUNT = 5;
  const all = new Uint8Array(size * FILTER_COUNT);
  const filters = [];
  for (let i = 0; i < FILTER_COUNT; ++i) {
    filters[i] = all.subarray(i * size, (i + 1) * size);
    filters[i][0] = i;
  }
  return filters;
}

/**
 * @param {Uint8Array} row
 * @param {Uint8Array} prevRow
 * @param {number} leftShift
 * @param {Uint8Array[]} filtersOut
 */
function applyFilters(row, prevRow, leftShift, filtersOut) {
  for (let i = 0; i < row.length; ++i) {
    const above = prevRow[i];
    const aboveLeft = prevRow[i - leftShift] ?? 0;
    const left = row[i - leftShift] ?? 0;
    const value = row[i];
    const base = left + above - aboveLeft;
    const dL = Math.abs(left - base);
    const dA = Math.abs(above - base);
    const dD = Math.abs(aboveLeft - base);
    const paeth = (dL <= dA && dL <= dD) ? left : (dA <= dD) ? above : aboveLeft;
    filtersOut[0][i + 1] = value;
    filtersOut[1][i + 1] = (value - left) & 0xFF;
    filtersOut[2][i + 1] = (value - above) & 0xFF;
    filtersOut[3][i + 1] = (value - ((left + above) >>> 1)) & 0xFF;
    filtersOut[4][i + 1] = (value - paeth) & 0xFF;
  }
}

/**
 * @typedef {(rowBytes: Uint8Array[], leftShift: number, filters: Uint8Array[]) => number[]} FilterPicker
 * @type {{ id: string, weight: number, picker: FilterPicker }[]}
 */
const FILTER_PICKERS = [
  { id: 'dynamic 1', weight: 200, picker: filterPicker_dynamic(1) },
  { id: 'dynamic 0.95', weight: 171, picker: filterPicker_dynamic(0.95) },
  { id: 'dynamic 0.9', weight: 20, picker: filterPicker_dynamic(0.9) },
  { id: 'all 0', weight: 34, picker: filterPicker_static(0) },
  { id: 'all 1', weight: 38, picker: filterPicker_static(1) },
  { id: 'all 2', weight: 10, picker: filterPicker_static(2) },
  { id: 'all 3', weight: 4, picker: filterPicker_static(3) },
  { id: 'all 4', weight: 33, picker: filterPicker_static(4) },
];

/**
 * @param {number} filter
 * @return {FilterPicker}
 */
function filterPicker_static(filter) {
  return (rowBytes) => rowBytes.map(() => filter);
}

/**
 * @param {number} hysteresisMult
 * @return {FilterPicker}
 */
function filterPicker_dynamic(hysteresisMult) {
  return function(rowBytes, leftShift, filters) {
    if (!rowBytes.length) {
      return [];
    }

    const sz = rowBytes[0].length;
    const maxDist = 16 * 1024;
    let prevRow = new Uint8Array(sz);
    /** @type {GraphNode[]} */ let prevNodes = [{ prev: null, cost: 0, filter: -1, tokenDistance: new Map() }];
    for (const row of rowBytes) {
      applyFilters(row, prevRow, leftShift, filters);

      /** @type {GraphNode[]} */ const curNodes = [];
      for (let f = 0; f < filters.length; ++f) {
        const filter = filters[f];

        /** @type {Map<number, number>} */ const tokenFrequency = new Map();
        /** @type {Map<number, number>} */ const tokenDistance = new Map();
        for (let i = 0; i < sz - 2; ++i) {
          const token = filter[i] | (filter[i + 1] << 8) | (filter[i + 2] << 16);
          tokenFrequency.set(token, (tokenFrequency.get(token) ?? 0) + 1);
          tokenDistance.set(token, sz - i);
        }

        let best = prevNodes[0];
        let bestCost = Number.POSITIVE_INFINITY;
        for (const prev of prevNodes) {
          let joinCost = 0;
          for (const [v, freq] of tokenFrequency) {
            const distance = prev.tokenDistance.get(v) ?? maxDist;
            if (distance >= maxDist) {
              joinCost += 24;
            } else {
              joinCost += 4 + (Math.log2(distance)|0);
            }
            joinCost += (freq - 1) * 7;
          }
          if (prev.filter === f) {
            joinCost *= hysteresisMult;
          }
          if (joinCost < bestCost) {
            best = prev;
            bestCost = joinCost;
          }
        }
        for (const [v, dist] of best.tokenDistance) {
          if (dist + sz < maxDist && !tokenDistance.has(v)) {
            tokenDistance.set(v, dist + sz);
          }
        }
        curNodes.push({ prev: best, cost: best.cost + bestCost, filter: f, tokenDistance: tokenDistance });
      }
      for (const prev of prevNodes) {
        // remove old token values to reduce RAM usage
        /** @type {any} */ (prev.tokenDistance) = null;
      }
      prevNodes = curNodes;
      prevRow = row;
    }

    let best = prevNodes[0];
    for (const prev of prevNodes) {
      if (prev.cost < best.cost) {
        best = prev;
      }
    }
    const filterChoices = [];
    while (best.prev) {
      filterChoices.push(best.filter);
      best = best.prev;
    }
    filterChoices.reverse();
    return filterChoices;
  }
}
