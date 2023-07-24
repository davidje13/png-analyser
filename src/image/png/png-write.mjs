import { deflateSync } from 'node:zlib'; // https://www.ietf.org/rfc/rfc1950.txt / https://www.ietf.org/rfc/rfc1951.txt
import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeChunk } from './chunk.mjs';

const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const VOID = new Uint8Array(0);

/**
 * @typedef {{
 *   bitDepth: number;
 *   colourType: number;
 *   rowMapper: (row: number[]) => Uint8Array;
 *   filterStep: number;
 *   plte?: ArrayBufferView | undefined;
 *   trns?: ArrayBufferView | undefined;
 * }} EncodingOption
 *
 * @typedef {{
 *   option: EncodingOption;
 *   compressed: ArrayBufferView;
 *   size: number;
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
export function writePNG(image, { preserveTransparentColour = false } = {}) {
  if (!image[0]?.length) {
    throw new Error('Cannot save empty image');
  }

  const options = getEncodingOptions(image, preserveTransparentColour);

  /** @type {EncodingChoice | null} */ let choice = null;
  for (const option of options) {
    const leftShift = option.filterStep;
    const mapped = image.map(option.rowMapper);
    const sz = mapped[0].length;
    const filters = makeFilterTargets(sz);
    const rowFilters = pickFilters(mapped, leftShift, filters);

    const idat = new ByteArrayBuilder();
    let prev = new Uint8Array(sz);
    for (let r = 0; r < mapped.length; ++r) {
      const row = mapped[r];
      const rowFilterType = rowFilters[r];
      applyFilters(row, prev, leftShift, filters);
      idat.append(filters[rowFilterType]);
      prev = row;
    }
    let windowBits = 8;
    while (windowBits < 15 && (1 << windowBits) < idat.byteLength) {
      ++windowBits;
    }
    const compressed = deflateSync(idat.toBytes(), { // method=8, window size <= 32kB, no dictionary
      windowBits,
      level: 9,
      memLevel: 9,
      chunkSize: 16 * 1024,
    });
    const size = (
      compressed.byteLength +
      (option.plte?.byteLength ? 12 + option.plte.byteLength : 0) +
      (option.trns?.byteLength ? 12 + option.trns.byteLength : 0)
    );
    if (!choice || size < choice.size) {
      choice = { option, compressed, size };
    }
  }

  if (!choice) {
    throw new Error('Failed to encode image');
  }

  const ihdr = new ByteArrayBuilder();
  ihdr.uint32BE(image[0].length);
  ihdr.uint32BE(image.length);
  ihdr.uint8(choice.option.bitDepth);
  ihdr.uint8(choice.option.colourType);
  ihdr.uint8(0); // compression method
  ihdr.uint8(0); // filter method
  ihdr.uint8(0); // interlace method

  const buf = new ByteArrayBuilder();
  buf.append(PNG_HEADER);
  writeChunk(buf, 'IHDR', ihdr);
  if (choice.option.plte?.byteLength) {
    writeChunk(buf, 'PLTE', choice.option.plte);
  }
  if (choice.option.trns?.byteLength) {
    writeChunk(buf, 'tRNS', choice.option.trns);
  }
  writeChunk(buf, 'IDAT', choice.compressed);
  writeChunk(buf, 'IEND', VOID);
  return buf;
}

const NONE = -1;
const MULTI = -2;

const GREYS = [1, 2, 4, 8].map((bits) => ({ bits, values: makeScale(0, 255, 255 / ((1 << bits) - 1)) }));

/**
 * @param {number} min
 * @param {number} max
 * @param {number} step
 */
function makeScale(min, max, step) {
  const r = [];
  for (let i = min; i <= max; i += step) {
    r.push(i);
  }
  return r;
}

/**
 * @param {number[][]} image
 * @param {boolean} preserveTransparentColour
 */
function getEncodingOptions(image, preserveTransparentColour) {
  const colours = new Set();
  let transparentColour = NONE;
  let needsAlpha = false;
  let allGreyscale = true;
  for (const row of image) {
    for (const c of row) {
      const alpha = c >>> 24;
      colours.add((preserveTransparentColour || alpha) ? c : 0);
      if (!alpha) {
        if (transparentColour === NONE) {
          transparentColour = c;
        } else if (transparentColour !== c) {
          transparentColour = MULTI;
        }
      }
      if (alpha !== 255 && alpha !== 0) {
        needsAlpha = true;
      }
      if (allGreyscale && (preserveTransparentColour || alpha)) {
        const red = (c >>> 16) & 0xFF;
        const green = (c >>> 8) & 0xFF;
        const blue = c & 0xFF;
        if (red !== green || green !== blue) {
          allGreyscale = false;
        }
      }
    }
  }
  if (preserveTransparentColour) {
    if (transparentColour === MULTI || (transparentColour !== NONE && colours.has(transparentColour | 0xFF000000))) {
      needsAlpha = true;
    }
  }
  const anyFullyTransparent = transparentColour !== NONE;

  /** @type {EncodingOption[]} */ const options = [];
  if (colours.size <= 256) {
    const palette = [...colours.values()].sort((a, b) => (a >>> 24) - (b >>> 24));
    const bits = Math.ceil(Math.log2(palette.length));
    let bitDepth = bits > 4 ? 8 : bits > 2 ? 4 : bits > 1 ? 2 : 1;
    const paletteBytes = new Uint8Array(palette.length * 3);
    let maxAlpha = 0;
    for (let i = 0; i < palette.length; ++i) {
      const c = palette[i];
      paletteBytes[i * 3] = (c >>> 16) & 0xFF;
      paletteBytes[i * 3 + 1] = (c >>> 8) & 0xFF;
      paletteBytes[i * 3 + 2] = c & 0xFF;
      if ((c >>> 24) !== 255) {
        maxAlpha = i + 1;
      }
    }
    const trns = new Uint8Array(palette.slice(0, maxAlpha).map((c) => c >>> 24));
    for (; bitDepth <= 8; bitDepth *= 2) {
      options.push({
        bitDepth,
        colourType: 3, // indexed
        rowMapper: mapPaletteRow(palette, bitDepth),
        filterStep: 1,
        plte: paletteBytes,
        trns: trns,
      });
    }
  }
  if (allGreyscale) {
    if (colours.size > 256 || needsAlpha) {
      options.push({
        bitDepth: 8,
        colourType: 4, // Grey + Alpha
        rowMapper: mapGreyAlphaRow(),
        filterStep: 2,
      });
    } else {
      const visibleGreys = [...colours.values()]
        .filter((c) => preserveTransparentColour || (c >>> 24))
        .map((c) => c & 0xFF);
      const needsTransparent = !preserveTransparentColour && anyFullyTransparent;
      for (const grey of GREYS) {
        if (visibleGreys.length + (needsTransparent ? 1 : 0) <= grey.values.length && visibleGreys.every((v) => grey.values.includes(v))) {
          if (needsTransparent) {
            transparentColour = (grey.values.find((v) => !visibleGreys.includes(v)) ?? 0) * 0x010101;
          }
          options.push({
            bitDepth: grey.bits,
            colourType: 0, // Grey
            rowMapper: mapGreyRow(transparentColour, grey.bits),
            filterStep: 1,
            trns: anyFullyTransparent ? new Uint8Array([0, (transparentColour & 0xFF) >> (8 - grey.bits)]) : undefined,
          });
        }
      }
    }
  } else {
    if (colours.size > 0x1000000 || needsAlpha) {
      options.push({
        bitDepth: 8,
        colourType: 6, // RGBA
        rowMapper: mapRGBARow(),
        filterStep: 4,
      });
    } else {
      if (anyFullyTransparent && !preserveTransparentColour) {
        for (let i = 0; i < 0x1000000; ++i) {
          if (!colours.has(0xFF000000 | i)) {
            transparentColour = i;
            break;
          }
        }
      }
      options.push({
        bitDepth: 8,
        colourType: 2, // RGB
        rowMapper: mapRGBRow(transparentColour),
        filterStep: 3,
        trns: anyFullyTransparent ? new Uint8Array([
          0, (transparentColour >>> 16) & 0xFF,
          0, (transparentColour >>> 8) & 0xFF,
          0, transparentColour & 0xFF,
        ]) : undefined,
      });
    }
  }
  return options;
}

/**
 * @param {number[]} palette
 * @param {number} bitDepth
 * @return {(row: number[]) => Uint8Array}
 */
const mapPaletteRow = (palette, bitDepth) => {
  const lookup = new Map();
  for (let i = 0; i < palette.length; ++i) {
    lookup.set(palette[i], i);
  }
  return (row) => {
    const b = new Uint8Array((row.length * bitDepth + 7) >> 3);
    for (let x = 0; x < row.length; ++x) {
      const c = lookup.get(row[x]) ?? 0;
      const p = x * bitDepth;
      b[p >> 3] |= c << (8 - (p & 7) - bitDepth);
    }
    return b;
  };
};

/**
 * @param {number} transparent
 * @param {number} bitDepth
 * @return {(row: number[]) => Uint8Array}
 */
const mapGreyRow = (transparent, bitDepth) => (row) => {
  const b = new Uint8Array((row.length * bitDepth + 7) >> 3);
  for (let x = 0; x < row.length; ++x) {
    const p = x * bitDepth;
    const c = (row[x] >>> 24) ? row[x] : transparent;
    b[p >> 3] |= ((c & 0xFF) >>> (8 - bitDepth)) << (8 - (p & 7) - bitDepth);
  }
  return b;
};

/**
 * @return {(row: number[]) => Uint8Array}
 */
const mapGreyAlphaRow = () => (row) => {
  const b = new Uint8Array(row.length * 2);
  for (let x = 0; x < row.length; ++x) {
    const c = row[x];
    b[x * 2] = c & 0xFF; // R/G/B (grey)
    b[x * 2 + 1] = c >>> 24; // A
  }
  return b;
};

/**
 * @param {number} transparent
 * @return {(row: number[]) => Uint8Array}
 */
const mapRGBRow = (transparent) => (row) => {
  const b = new Uint8Array(row.length * 3);
  for (let x = 0; x < row.length; ++x) {
    const c = (row[x] >>> 24) ? row[x] : transparent;
    b[x * 3] = (c >>> 16) & 0xFF; // R
    b[x * 3 + 1] = (c >>> 8) & 0xFF; // G
    b[x * 3 + 2] = c & 0xFF; // B
  }
  return b;
};

/**
 * @return {(row: number[]) => Uint8Array}
 */
const mapRGBARow = () => (row) => {
  const b = new Uint8Array(row.length * 4);
  for (let x = 0; x < row.length; ++x) {
    const c = row[x];
    b[x * 4] = (c >>> 16) & 0xFF; // R
    b[x * 4 + 1] = (c >>> 8) & 0xFF; // G
    b[x * 4 + 2] = c & 0xFF; // B
    b[x * 4 + 3] = c >>> 24; // A
  }
  return b;
};

/**
 * @param {number} size
 */
function makeFilterTargets(size) {
  const filters = [];
  for (let i = 0; i < 5; ++i) {
    filters[i] = new Uint8Array(1 + size);
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
 * @param {Uint8Array[]} rowBytes
 * @param {number} leftShift
 * @param {Uint8Array[]} filters
 */
function pickFilters(rowBytes, leftShift, filters) {
  if (!rowBytes.length) {
    return [];
  }

  const sz = rowBytes[0].length;
  const maxDist = 16 * 1024;
  let prevRow = new Uint8Array(sz);
  /** @type {GraphNode[]} */ let prevNodes = [{ prev: null, cost: 0, filter: 0, tokenDistance: new Map() }];
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
