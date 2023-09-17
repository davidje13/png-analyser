import { ByteArrayBuilder } from '../../data/builder.mjs';
import { asDataView, getLatin1, subViewLen } from '../../data/utils.mjs';
import { getImageStats } from './optimisation/stats.mjs';

// https://en.wikipedia.org/wiki/BMP_file_format

export const BMP_WINDOWS = 'BM';
export const BMP_OS2 = 'BA';
export const BMP_OS2_COLOR_ICON = 'CI';
export const BMP_OS2_COLOR_POINTER = 'CP';
export const BMP_OS2_ICON = 'IC';
export const BMP_OS2_POINTER = 'PT';

export const BITMAPCOREHEADER = 1;
export const BITMAPINFOHEADER = 2;
export const OS22XBITMAPHEADER = 3;

const BI_RGB = 0;
const BI_RLE8 = 1;
const BI_RLE4 = 2;
const BI_BITFIELDS = 3;
const BI_JPEG = 4;
const BI_PNG = 5;
const BI_ALPHABITFIELDS = 6;
const BI_CMYK = 11;
const BI_CMYKRLE8 = 12;
const BI_CMYKRLE4 = 13;

/**
 * @typedef {{
 *   warnings: string[],
 *   hotspot?: { x: number, y: number },
 *   image: number[][],
 *   bitDepth: number;
 * }} BMPResult
 */

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isBMP(data) {
  const dv = asDataView(data);
  const type = getLatin1(dv, 0, 2, []);
  if (type !== BMP_WINDOWS && type !== BMP_OS2 && type !== BMP_OS2_COLOR_ICON && type !== BMP_OS2_COLOR_POINTER && type !== BMP_OS2_ICON && type !== BMP_OS2_POINTER) {
    return false;
  }
  const s0 = dv.getUint32(2, true);
  const s1 = dv.getUint32(14, true);
  if (s0 <= 14 || s1 >= s0) {
    return false;
  }
  return true;
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {BMPResult}
 */
export function readBMP(data, { expectHeader = true, andMask = false } = {}) {
  /** @type {BMPResult} */ const result = { warnings: [], image: [], bitDepth: 0 };
  const dv = asDataView(data);

  const type = getLatin1(dv, 0, 2, result.warnings);
  const s0 = dv.getUint32(2, true);
  const s1 = dv.getUint32(14, true);
  const hasHeader = s0 > 14 && s0 > s1;
  if (expectHeader && !hasHeader) {
    result.warnings.push('Missing bitmap header');
  } else if (!expectHeader && hasHeader) {
    result.warnings.push('Unexpected bitmap header present');
  }
  if (hasHeader) {
    const hotspot = {
      x: dv.getInt16(6, true),
      y: dv.getInt16(8, true),
    };
    if (hotspot.x !== 0 || hotspot.y !== 0) {
      result.warnings.push('Bitmap contains hotspot coordinate extension');
    }
    result.hotspot = hotspot;
  }
  const dibHeader = subViewLen(dv, (hasHeader ? 14 : 0) + 4, (hasHeader ? s1 : s0) - 4, result.warnings);

  result.bitDepth = 0; // TODO
  throw new Error('TODO');

  return result;
}

/**
 * @param {number[][]} image
 * @param {object} options
 * @param {boolean=} options.includeHeader
 * @param {(boolean | boolean[][] | 'void')=} options.andMask
 * @param {boolean=} options.preserveTransparentColour
 * @param {boolean=} options.allowNonPoTPalette
 * @param {boolean=} options.min8Bit
 * @param {string=} options.type
 * @param {number=} options.dib
 * @param {number=} options.ppmX
 * @param {number=} options.ppmY
 */
export function writeBMP(image, {
  includeHeader = true,
  andMask = false,
  preserveTransparentColour = false,
  allowNonPoTPalette = false,
  min8Bit = false,
  type = BMP_WINDOWS,
  dib = BITMAPINFOHEADER,
  ppmX = 72 / 0.0254,
  ppmY = ppmX,
} = {}) {
  if (!image[0]?.length) {
    throw new Error('Cannot save empty image');
  }
  const w = image[0].length;
  const h = image.length;

  const allow2Bit = false;
  const topToBottom = false;
  if (topToBottom && dib !== BITMAPINFOHEADER) {
    throw new Error('Cannot write top-to-bottom unless DIB is BITMAPINFOHEADER');
  }

  const rows = [];
  for (let y = 0; y < h; ++y) {
    rows.push(y);
  }
  if (!topToBottom) {
    rows.reverse();
  }

  const { colours, needsTrans, needsAlpha } = getImageStats(
    image,
    preserveTransparentColour,
    andMask === true,
  );
  const alphaChannel = needsAlpha || (needsTrans && andMask !== true);
  if (alphaChannel && dib === BITMAPCOREHEADER) {
    throw new Error('Cannot use alpha channel when DIB is BITMAPCOREHEADER');
  }

  const compressionMethod = BI_RGB; // TODO: support others? must be BI_RGB for icons
  const bitCount = Math.max(getBitCount(colours.size, alphaChannel, allow2Bit), min8Bit ? 8 : 0);
  const paletteSize = bitCount <= 8 ? allowNonPoTPalette ? colours.size : (1 << bitCount) : 0;
  const planes = 1;
  const importantPalette = (bitCount <= 8 && !allowNonPoTPalette) ? colours.size : 0; // 0 = all important
  const strideXOR = ((w * bitCount + 31) >>> 5) * 4;
  const strideAND = ((w + 31) >>> 5) * 4;

  const buf = new ByteArrayBuilder();

  if (includeHeader) {
    // bitmap file header
    if (type.length !== 2) {
      throw new Error('invalid type');
    }
    buf.latin1(type);
    buf.uint32LE(0); // total size (populated later)
    buf.uint16LE(0); // reserved
    buf.uint16LE(0); // reserved
    buf.uint32LE(0); // pixel data offset (populated later)
  }

  // DIB header
  const dibHeaderStart = buf.byteLength;
  buf.uint32LE(0); // size of header (populated later)
  switch (dib) {
    case BITMAPCOREHEADER:
      buf.int16LE(image[0].length);
      buf.int16LE(image.length * (andMask ? 2 : 1));
      buf.uint16LE(planes); // number of colour planes
      buf.uint16LE(bitCount); // bits per pixel
      break;
    case BITMAPINFOHEADER:
    case OS22XBITMAPHEADER:
      buf.int32LE(image[0].length);
      buf.int32LE(image.length * (topToBottom ? -1 : 1) * (andMask ? 2 : 1));
      buf.uint16LE(planes); // number of colour planes
      buf.uint16LE(bitCount); // bits per pixel
      buf.uint32LE(compressionMethod);
      // OS22XBITMAPHEADER can be truncated here (rest of values assumed 0)

      buf.uint32LE(strideXOR * h); // size of xor bitmap data
      buf.uint32LE(Math.round(ppmX)); // horizontal pixels-per-metre
      buf.uint32LE(Math.round(ppmY)); // vertical pixels-per-metre
      buf.uint32LE(paletteSize); // colour palette size
      buf.uint32LE(importantPalette); // number of "important" colours
      if (dib === OS22XBITMAPHEADER) {
        buf.uint16LE(0); // distance units for resolution (metre)
        buf.uint16LE(0); // padding
        buf.uint16LE(0); // lower-left, left-to-right, bottom-to-top
        buf.uint16LE(0); // half toning (none) (TODO: support others?)
        buf.uint32LE(0); // half toning param 1
        buf.uint32LE(0); // half toning param 2
        buf.uint32LE(0); // colour table encoding (RGB)
        buf.uint32LE(0); // application defined
      }
      break;
    default:
      throw new Error('Unsupported DIB Header format');
  }
  buf.replaceUint32LE(dibHeaderStart, buf.byteLength - dibHeaderStart); // size of header

  // Extra bit masks
  //if (dib === BITMAPINFOHEADER && compressionMethod === BI_BITFIELDS) {
  // TODO
  //} else if (dib === BITMAPINFOHEADER && compressionMethod === BI_ALPHABITFIELDS) {
  // TODO
  //}
  // Color table
  /** @type {Map<number, number>} */ const paletteLookup = new Map();
  if (bitCount <= 8) {
    let i = 0;
    for (const c of colours) {
      buf.uint8(c & 0xFF); // blue
      buf.uint8((c >>> 8) & 0xFF); // green
      buf.uint8((c >>> 16) & 0xFF); // red
      if (dib !== BITMAPCOREHEADER) {
        if (alphaChannel) {
          buf.uint8(c >>> 24); // alpha
        } else {
          buf.uint8(0x00); // unused
        }
      }
      paletteLookup.set(c, i);
      ++ i;
    }
    // pad to size
    for (; i < paletteSize; ++i) {
      buf.uint8(0); // blue
      buf.uint8(0); // green
      buf.uint8(0); // red
      if (dib !== BITMAPCOREHEADER) {
        buf.uint8(0x00); // unused
      }
    }
  }
  // pixel array ('xor' mask)
  if (includeHeader) {
    buf.replaceUint32LE(10, buf.byteLength); // pixel data offset
  }
  if (bitCount <= 8) { // palette (can be rle compressed or huffman compressed)
    // TODO: rle compression (see https://www.daubnet.com/en/file-format-bmp)
    for (const y of rows) {
      const rowBuf = buf.appendMutableBytes(strideXOR);
      for (let x = 0; x < w; ++x) {
        const c = image[y][x];
        const bit = x * bitCount;
        const p = (
          paletteLookup.get(c)
          ?? paletteLookup.get(0)
          ?? paletteLookup.get((c | 0xFF000000) >>> 0)
          ?? 0
        );
        rowBuf[bit >>> 3] |= p << (8 - bitCount - (bit & 7));
      }
    }
  } else if (bitCount === 16) { // custom bit counts per channel (cannot be compressed)
    // TODO
  } else if (bitCount === 24) { // bgr (can be rle compressed if BITMAPCOREHEADER2)
    for (const y of rows) {
      const rowBuf = buf.appendMutableBytes(strideXOR);
      for (let x = 0; x < w; ++x) {
        const c = image[y][x];
        rowBuf[x * 3] = c & 0xFF; // blue
        rowBuf[x * 3 + 1] = (c >>> 8) & 0xFF; // green
        rowBuf[x * 3 + 2] = (c >>> 16) & 0xFF; // red
      }
    }
  } else if (bitCount === 32) { // bgra, custom bit counts per channel (cannot be compressed)
    for (const y of rows) {
      const rowBuf = buf.appendMutableBytes(strideXOR);
      for (let x = 0; x < w; ++x) {
        const c = image[y][x];
        rowBuf[x * 4] = c & 0xFF; // blue
        rowBuf[x * 4 + 1] = (c >>> 8) & 0xFF; // green
        rowBuf[x * 4 + 2] = (c >>> 16) & 0xFF; // red
        rowBuf[x * 4 + 3] = c >>> 24; // alpha
      }
    }
  }
  if (andMask) {
    // 'and' mask
    if (!Array.isArray(andMask)) {
      andMask = image.map((r) => r.map((c) => (c >>> 24) < 128));
    }
    for (const y of rows) {
      const rowBuf = buf.appendMutableBytes(strideAND);
      for (let x = 0; x < w; ++x) {
        rowBuf[x >>> 3] |= (andMask[y][x] ? 1 : 0) << (7 - (x & 7));
      }
    }
  }
  // ICC color profile (TODO)

  if (includeHeader) {
    buf.replaceUint32LE(2, buf.byteLength); // total size
  }

  return { data: buf, bitCount, hasAlpha: alphaChannel };
}

/**
 * @param {number} colours
 * @param {boolean} alphaChannel
 * @param {boolean} allow2Bit
 */
function getBitCount(colours, alphaChannel, allow2Bit) {
  if (colours <= 2) {
    return 1;
  }
  if (colours <= 4 && allow2Bit) {
    return 2;
  }
  if (colours <= 16) {
    return 4;
  }
  if (colours <= 256) {
    return 8;
  }
  return alphaChannel ? 32 : 24;
}
