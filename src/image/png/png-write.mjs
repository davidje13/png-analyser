import { deflateSync, constants } from 'node:zlib'; // https://www.ietf.org/rfc/rfc1950.txt / https://www.ietf.org/rfc/rfc1951.txt
import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeChunk } from './chunk.mjs';
import { getEncodingOptions } from './optimisation/encoding-options.mjs';

const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const VOID = new Uint8Array(0);

/**
 * @typedef {import('./optimisation/encoding-options.mjs').EncodingOption} EncodingOption
 * @typedef {{ id: string, level: number, memLevel: number, chunkSize: number, strategy: number }} ZLibOptions
 *
 * @typedef {{
 *   encoding: EncodingOption;
 *   compressed: ArrayBufferView;
 *   size: number;
 *   attemptNumber: number;
 *   zlibOptions: ZLibOptions;
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
export function writePNG(image, { preserveTransparentColour = false, allowMatteTransparency = true, compressionTimeAllotment = 2000 } = {}) {
  if (!image[0]?.length) {
    throw new Error('Cannot save empty image');
  }

  const { choice, totalAttempts, availableEncodings, idatCacheMisses } = pickOption(image, preserveTransparentColour, allowMatteTransparency, compressionTimeAllotment);
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
    zlibOptions: choice.zlibOptions,
    attemptNumber: choice.attemptNumber,
    totalAttempts,
    encoding: choice.encoding.id,
    availableEncodings,
    idatCacheMisses,
  };
}

/**
 * @param {number[][]} image
 * @param {boolean} preserveTransparentColour
 * @param {boolean} allowMatteTransparency
 * @param {number} compressionTimeAllotment
 */
function pickOption(image, preserveTransparentColour, allowMatteTransparency, compressionTimeAllotment) {
  const timeout = Date.now() + compressionTimeAllotment;

  const encodingOptions = getEncodingOptions(image, preserveTransparentColour, allowMatteTransparency);
  const encodingOptionIds = encodingOptions.map((encoding) => encoding.id);
  const options = encodingOptions.flatMap((encoding) =>
    FILTER_PICKERS.flatMap((filterPicker) =>
      ZLIB_OPTIONS.flatMap((zlibOptions) => ({
        encoding,
        filterPicker,
        zlibOptions,
        weight: encoding.weight * filterPicker.weight * zlibOptions.weight,
      }))
    )
  );
  if (Number.isFinite(compressionTimeAllotment)) {
    // sort by descending weight
    // (but only if we are capping the search - else it's more optimal to keep them in the default order)
    options.sort((a, b) => b.weight - a.weight);
  }

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
  for (const { encoding, filterPicker, zlibOptions } of options) {
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
    const o = compress(idat.toBytes(), encoding.plte, encoding.trns, zlibOptions);
    if (!choice || o.size < choice.size) {
      choice = {
        encoding,
        compressed: o.compressed,
        size: o.size,
        zlibOptions,
        filterPicker: filterPicker.id,
        attemptNumber: attempt,
      };
    }
    if (Date.now() >= timeout) {
      break;
    }
  }

  return {
    choice,
    totalAttempts: attempt,
    availableEncodings: encodingOptionIds,
    idatCacheMisses,
  };
}

/** @type {(ZLibOptions & { weight: number })[]} */ const ZLIB_OPTIONS = [
  { id: 'L9', level: 9, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_DEFAULT_STRATEGY, weight: 228 },
  { id: 'L8', level: 8, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_DEFAULT_STRATEGY, weight: 14 },
  { id: 'L7', level: 7, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_DEFAULT_STRATEGY, weight: 4 },
  { id: 'L6', level: 6, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_DEFAULT_STRATEGY, weight: 4 },
  { id: 'L5', level: 5, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_DEFAULT_STRATEGY, weight: 12 },
  { id: 'L4', level: 4, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_DEFAULT_STRATEGY, weight: 1 },

  { id: 'L9 filtered', level: 9, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_FILTERED, weight: 173 },
  { id: 'L8 filtered', level: 8, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_FILTERED, weight: 17 },
  { id: 'L7 filtered', level: 7, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_FILTERED, weight: 1 },
  { id: 'L6 filtered', level: 6, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_FILTERED, weight: 3 },
  { id: 'L5 filtered', level: 5, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_FILTERED, weight: 9 },
  { id: 'L4 filtered', level: 4, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_FILTERED, weight: 2 },

  { id: 'L9 RLE', level: 9, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_RLE, weight: 27 },
  { id: 'L9 huffman', level: 9, memLevel: 9, chunkSize: 16 * 1024, strategy: constants.Z_HUFFMAN_ONLY, weight: 16 },

  // non-16k chunk sizes never seem to be better
];

/**
 * @param {Uint8Array} idat
 * @param {ArrayBufferView | undefined} plte
 * @param {ArrayBufferView | undefined} trns
 * @param {ZLibOptions} zlibOptions
 */
function compress(idat, plte, trns, zlibOptions) {
  let windowBits = constants.Z_MIN_WINDOWBITS;
  while (windowBits < 15 && (1 << windowBits) < idat.byteLength) { // window size <= 32kB
    ++windowBits;
  }
  const compressed = deflateSync(idat, { // method=8, no dictionary
    windowBits,
    level: zlibOptions.level,
    memLevel: zlibOptions.memLevel,
    chunkSize: zlibOptions.chunkSize,
    strategy: zlibOptions.strategy,
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
  // http://www.libpng.org/pub/png/book/chapter09.html
  { id: 'min-sum-abs w=1', weight: 107, picker: filterPicker_minSumAbs(1) },
  { id: 'min-sum-abs w=0.9', weight: 23, picker: filterPicker_minSumAbs(0.9) },
  { id: 'min-sum-abs w=0.8', weight: 26, picker: filterPicker_minSumAbs(0.8) },

  { id: 'dynamic w=1', weight: 142, picker: filterPicker_dynamic(1) },
  { id: 'dynamic w=0.95', weight: 125, picker: filterPicker_dynamic(0.95) },

  { id: 'all 0', weight: 27, picker: filterPicker_static(0) },
  { id: 'all 1', weight: 28, picker: filterPicker_static(1) },
  { id: 'all 2', weight: 8, picker: filterPicker_static(2) },
  { id: 'all 3', weight: 1, picker: filterPicker_static(3) },
  { id: 'all 4', weight: 9, picker: filterPicker_static(4) },
];

/**
 * @param {number} filter
 * @return {FilterPicker}
 */
function filterPicker_static(filter) {
  return (rowBytes) => rowBytes.map(() => filter);
}

/**
 * @param {number} weighting
 * @return {FilterPicker}
 */
function filterPicker_minSumAbs(weighting) {
  return function(rowBytes, leftShift, filters) {
    if (!rowBytes.length) {
      return [];
    }

    const sz = rowBytes[0].length;
    let prevRow = new Uint8Array(sz);
    let prevF = -1;

    /** @type {number[]} */ const result = [];
    for (const row of rowBytes) {
      applyFilters(row, prevRow, leftShift, filters);

      let bestF = 0;
      let best = Number.POSITIVE_INFINITY;
      for (let f = 0; f < filters.length; ++f) {
        const filter = filters[f];

        let sum = 0;
        for (let i = 0; i < sz; ++i) {
          const v = filter[i];
          sum += (v >= 128) ? 256 - v : v; // abs(signed(v))
        }
        if (f === prevF) {
          sum *= weighting;
        }
        if (sum < best) {
          bestF = f;
          best = sum;
        }
      }
      prevF = bestF;
      result.push(bestF);
      prevRow = row;
    }
    return result;
  }
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
