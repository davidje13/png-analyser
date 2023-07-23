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
 */

/**
 * @param {number[][]} image
 */
export function writePNG(image) {
  const h = image.length;
  const w = h ? image[0].length : 0;

  const options = getEncodingOptions(image);

  let chosenOption;
  let bestCompressed;
  let bestSize = Number.POSITIVE_INFINITY;
  for (const option of options) {
    const idat = new ByteArrayBuilder();
    // TODO: compression optimisation:
    // - each row can be calculated independently, using all possible filters
    // - compression is likely to be better if there are fewer unique symbols across the file
    // - deflate uses a 3-byte lookup table to find previous matches - we can do the same to minimise differences
    // - for each filter type for each row, compute the 3-byte lookup table
    // - for each sequential pair of rows, calculate the combined (unioned) 3-byte lookup table size (number of distinct entries)
    // - create a graph linking each filter type of a row with each filter type of the row below, using the value above as the cost of the vertex
    // - add a start and end node with links of cost 0 to all possible filter values of the start/end row
    // - find the least-cost path from top to bottom. Use these filter values for the rows.
    for (const row of image.map(option.rowMapper)) {
      idat.uint8(0); // row filter type
      idat.append(row);
    }
    const compressed = deflateSync(idat.toBytes(), { level: 9 }); // method=8, window size <= 32kB, no dictionary
    const size = (
      compressed.byteLength +
      (option.plte?.byteLength ? 12 + option.plte.byteLength : 0) +
      (option.trns?.byteLength ? 12 + option.trns.byteLength : 0)
    );
    if (size < bestSize) {
      chosenOption = option;
      bestCompressed = compressed;
      bestSize = size;
    }
  }

  if (!chosenOption || !bestCompressed) {
    throw new Error();
  }

  const ihdr = new ByteArrayBuilder();
  ihdr.uint32BE(w);
  ihdr.uint32BE(h);
  ihdr.uint8(chosenOption.bitDepth);
  ihdr.uint8(chosenOption.colourType);
  ihdr.uint8(0); // compression method
  ihdr.uint8(0); // filter method
  ihdr.uint8(0); // interlace method

  const buf = new ByteArrayBuilder();
  buf.append(PNG_HEADER);
  writeChunk(buf, 'IHDR', ihdr);
  if (chosenOption.plte?.byteLength) {
    writeChunk(buf, 'PLTE', chosenOption.plte);
  }
  if (chosenOption.trns?.byteLength) {
    writeChunk(buf, 'tRNS', chosenOption.trns);
  }
  writeChunk(buf, 'IDAT', bestCompressed);
  writeChunk(buf, 'IEND', VOID);
  return buf;
}

/**
 * @param {number[][]} image
 */
function getEncodingOptions(image) {
  const colours = new Set();
  let needsAlpha = false;
  let allOpaque = true;
  let allGreyscale = true;
  for (const row of image) {
    for (const c of row) {
      if (colours.size <= 256) {
        colours.add(c);
      }
      if (!needsAlpha) {
        const alpha = c >>> 24;
        if (alpha !== 255) {
          allOpaque = false;
          if (alpha !== 0) {
            needsAlpha = true;
          }
        }
      }
      if (allGreyscale) {
        const red = (c >>> 16) & 0xFF;
        const green = (c >>> 8) & 0xFF;
        const blue = c & 0xFF;
        if (red !== green || green !== blue) {
          allGreyscale = false;
        }
      }
    }
    if (colours.size > 256 && needsAlpha && !allGreyscale) {
      break;
    }
  }

  /** @type {EncodingOption[]} */ const options = [];
  if (colours.size <= 256) {
    const palette = [...colours.values()].sort((a, b) => (a >>> 24) - (b >>> 24));
    const bits = Math.ceil(Math.log2(palette.length));
    const bitDepth = bits > 4 ? 8 : bits > 2 ? 4 : bits > 1 ? 2 : 1;
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
    options.push({
      bitDepth,
      colourType: 3, // indexed
      rowMapper: mapPaletteRow(palette, bitDepth),
      filterStep: 1,
      plte: paletteBytes,
      trns: new Uint8Array(palette.slice(0, maxAlpha).map((c) => c >>> 24)),
    });
  }
  if (allGreyscale) {
    const greys = [...colours.values()].filter((c) => c >>> 24).map((c) => c & 0xFF);
    const hasMidGreys = greys.some((v) => v !== 0 && v !== 255);
    if (colours.size > 256 || needsAlpha) {
      options.push({
        bitDepth: 8,
        colourType: 4, // Grey + Alpha
        rowMapper: mapGreyAlphaRow(),
        filterStep: 2,
      });
    } else if (!hasMidGreys && (allOpaque || greys.length < 2)) {
      const transparent = greys.includes(0) ? 0xFF : 0x00;
      options.push({
        bitDepth: 1,
        colourType: 0, // Grey
        rowMapper: mapBlackWhiteRow(transparent),
        filterStep: 1,
        trns: allOpaque ? undefined : new Uint16Array([transparent]),
      });
    } else {
      let transparent = 0;
      if (!allOpaque) {
        const greySet = new Set(greys);
        for (let i = 0; i < 256; ++i) {
          if (!greySet.has(i)) {
            transparent = i;
            break;
          }
        }
      }
      options.push({
        bitDepth: 8, // TODO: allow 2/4? (sample range upscaling is not precisely defined)
        colourType: 0, // Grey
        rowMapper: mapGreyRow(transparent),
        filterStep: 1,
        trns: allOpaque ? undefined : new Uint16Array([transparent]),
      });
    }
  } else {
    let transparent = 0;
    if (!allOpaque && !needsAlpha) {
      colours.clear();
      for (const row of image) {
        for (const c of row) {
          colours.add(c & 0xFFFFFF);
        }
      }
      if (colours.size >= 0x1000000) {
        needsAlpha = true;
      }
      for (let i = 0; i < 0x1000000; ++i) {
        if (!colours.has(i)) {
          transparent = i;
          break;
        }
      }
    }
    if (needsAlpha) {
      options.push({
        bitDepth: 8,
        colourType: 6, // RGBA
        rowMapper: mapRGBARow(),
        filterStep: 4,
      });
    } else {
      options.push({
        bitDepth: 8,
        colourType: 2, // RGB
        rowMapper: mapRGBRow(transparent),
        filterStep: 3,
        trns: allOpaque ? undefined : new Uint16Array([
          (transparent >>> 16) & 0xFF,
          (transparent >>> 8) & 0xFF,
          transparent & 0xFF,
        ]),
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
      const c = lookup.get(row[x]);
      const p = x * bitDepth;
      b[p >> 3] |= c << (8 - (p & 7) - bitDepth);
    }
    return b;
  };
};

/**
 * @param {number} transparent
 * @return {(row: number[]) => Uint8Array}
 */
const mapBlackWhiteRow = (transparent) => {
  return (row) => {
    const b = new Uint8Array((row.length + 7) >> 3);
    for (let x = 0; x < row.length; ++x) {
      const c = (row[x] >>> 24) ? (row[x] & 0xFF) : transparent;
      b[x >> 3] |= (c ? 1 : 0) << (7 - (x & 7));
    }
    return b;
  };
};

/**
 * @param {number} transparent
 * @return {(row: number[]) => Uint8Array}
 */
const mapGreyRow = (transparent) => (row) => {
  const b = new Uint8Array(row.length);
  for (let x = 0; x < row.length; ++x) {
    const c = row[x];
    b[x] = (c >>> 24) ? (c & 0xFF) : transparent;
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
