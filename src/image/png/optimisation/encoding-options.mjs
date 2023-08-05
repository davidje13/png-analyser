import { getImageStats, NONE, MULTI } from './stats.mjs';

/**
 * @typedef {{
 *   id: string;
 *   bitDepth: number;
 *   colourType: number;
 *   rowMapper: (row: number[]) => Uint8Array;
 *   filterStep: number;
 *   plte?: ArrayBufferView | undefined;
 *   trns?: ArrayBufferView | undefined;
 *   weight: number;
 * }} EncodingOption
 */

/**
 * @param {number[][]} image
 * @param {boolean} preserveTransparentColour
 * @param {boolean} allowMatteTransparency
 */
export function getEncodingOptions(image, preserveTransparentColour, allowMatteTransparency) {
  const { colours, transparentColour, needsAlpha, allGreyscale } = getImageStats(image, preserveTransparentColour, allowMatteTransparency);
  const anyFullyTransparent = transparentColour !== NONE;

  /** @type {EncodingOption[]} */ const options = [];
  if (colours.size <= 256) {
    const palette = [...colours.values()].sort(sortPalette);
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
    for (const p of PALETTES) {
      if (palette.length <= (1 << p.bits)) {
        options.push({
          id: `palette-${p.bits}-bit`,
          bitDepth: p.bits,
          colourType: 3, // indexed
          rowMapper: mapPaletteRow(palette, p.bits),
          filterStep: 1,
          plte: paletteBytes,
          trns: trns,
          weight: p.weight,
        });
      }
    }
  }
  if (allGreyscale) {
    if (colours.size > 256 || needsAlpha) {
      options.push({
        id: 'grey+alpha',
        bitDepth: 8,
        colourType: 4, // Grey + Alpha
        rowMapper: mapGreyAlphaRow(),
        filterStep: 2,
        weight: 70,
      });
    } else {
      const visibleGreys = [...colours.values()]
        .filter((c) => preserveTransparentColour || (c >>> 24))
        .map((c) => c & 0xFF);
      const needsTransparent = !preserveTransparentColour && anyFullyTransparent;
      for (const grey of GREYS) {
        if (visibleGreys.length + (needsTransparent ? 1 : 0) <= grey.values.length && visibleGreys.every((v) => grey.values.includes(v))) {
          let tc = transparentColour;
          if (needsTransparent) {
            tc = (grey.values.find((v) => !visibleGreys.includes(v)) ?? 0) * 0x010101;
          }
          options.push({
            id: `grey-${grey.bits}-bit`,
            bitDepth: grey.bits,
            colourType: 0, // Grey
            rowMapper: mapGreyRow(tc, grey.bits),
            filterStep: 1,
            trns: anyFullyTransparent ? new Uint8Array([0, (tc & 0xFF) >> (8 - grey.bits)]) : undefined,
            weight: grey.weight,
          });
        }
      }
    }
  } else if (colours.size > 0x1000000 || needsAlpha) {
    options.push({
      id: 'rgba',
      bitDepth: 8,
      colourType: 6, // RGBA
      rowMapper: mapRGBARow(),
      filterStep: 4,
      weight: 74,
    });
  } else {
    let tc = transparentColour;
    if (anyFullyTransparent && !preserveTransparentColour) {
      if (transparentColour === MULTI || colours.has((transparentColour | 0xFF000000) >>> 0)) {
        for (let i = 0; i < 0x1000000; ++i) {
          if (!colours.has((0xFF000000 | i) >>> 0)) {
            tc = i;
            break;
          }
        }
      }
    }
    options.push({
      id: 'rgb',
      bitDepth: 8,
      colourType: 2, // RGB
      rowMapper: mapRGBRow(tc),
      filterStep: 3,
      trns: anyFullyTransparent ? new Uint8Array([
        0, (tc >>> 16) & 0xFF,
        0, (tc >>> 8) & 0xFF,
        0, tc & 0xFF,
      ]) : undefined,
      weight: 74,
    });
  }
  return options;
}

const PALETTES = [
  { bits: 1, weight: 16 },
  { bits: 2, weight: 6 },
  { bits: 4, weight: 5 },
  { bits: 8, weight: 30 },
];

const GREYS = [
  { bits: 1, weight: 96 },
  { bits: 2, weight: 6 },
  { bits: 4, weight: 5 },
  { bits: 8, weight: 62 },
].map(({ bits, weight }) => ({ bits, weight, values: makeScale(0, 255, 255 / ((1 << bits) - 1)) }));

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
 * @param {number} a
 * @param {number} b
 */
function sortPalette(a, b) {
  const alphaA = a >>> 24;
  const alphaB = b >>> 24;
  if (alphaA !== alphaB) {
    return alphaA - alphaB;
  }
  const lumA = ((a >>> 16) & 0xFF) + ((a >>> 8) & 0xFF) + (a & 0xFF);
  const lumB = ((b >>> 16) & 0xFF) + ((b >>> 8) & 0xFF) + (b & 0xFF);
  return (lumA - lumB) || (a - b);
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
