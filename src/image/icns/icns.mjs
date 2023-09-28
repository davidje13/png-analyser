import { isPNG, readPNG } from '../png/png.mjs';
import { asBytes, asDataView, char32, getLatin1, hex32, printTag, subViewFrom, subViewLen } from '../../data/utils.mjs';
import { MACINTOSH4, MACINTOSH8 } from '../palettes.mjs';
import { isJPEG, isJPEG2000 } from '../jpeg/jpeg.mjs';

// https://en.wikipedia.org/wiki/Apple_Icon_Image_format

/**
 * @typedef {{
 *   bitDepth: number;
 *   scale: number;
 *   image: number[][];
 *   rawPNG?: import('../png/png.mjs').PNGResult;
 * }} IconSizeOut
 *
 * @typedef {{ images: IconSizeOut[], sub: SubIcons[], name?: string, version?: number }} State
 * @typedef {Omit<State, 'images'> & { images: (IconSizeOut & { type: number; maskType: number | null; used?: boolean })[] }} InnerState
 * @typedef {{ type: string, state: State }} SubIcons
 * @typedef {(state: InnerState, data: DataView, type: number, warnings: string[]) => void} ChunkHandler
 * @typedef {{ handler: ChunkHandler }} Chunk
 */

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isICNS(data) {
  if (data.byteLength < 8) {
    return false;
  }
  const dv = asDataView(data);
  const magic = dv.getUint32(0);
  return magic === ICNS_HEAD;
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {{
 *   state: State;
 *   warnings: string[];
 * }}
 */
export function readICNS(data, { expectHeader = true } = {}) {
  /** @type {string[]} */ const warnings = [];

  const dv = asDataView(data);
  const magic = dv.getUint32(0);
  const hasHeader = magic === ICNS_HEAD;
  if (hasHeader !== expectHeader) {
    if (hasHeader) {
      warnings.push('unexpected "icns" header');
    } else {
      warnings.push('file does not begin with "icns"; header may be missing');
    }
  }
  const size = hasHeader ? dv.getUint32(4) : dv.byteLength;
  if (dv.byteLength !== size) {
    warnings.push(`file size ${dv.byteLength} does not match expected size ${size}`);
  }

  /** @type {InnerState} */ const state = { images: [], sub: [] };

  let p = hasHeader ? 8 : 0;
  while (p < size) {
    const iconType = dv.getUint32(p);
    let length = dv.getUint32(p + 4);
    if (length < 8) {
      warnings.push(`${printTag(iconType)}: too short`);
      length = 8;
    }
    const iconData = subViewLen(dv, p + 8, length - 8, warnings);
    p += length;

    const mode = CHUNKS.get(iconType);
    if (mode) {
      /** @type {string[]} */ const w = [];
      mode.handler(state, iconData, iconType, w);
      warnings.push(...w.map((warning) => `${printTag(iconType)}: ${warning}`));
    } else {
      warnings.push(`unknown icon type: ${printTag(iconType)}`);
    }
  }

  for (const image of state.images) {
    if (image.maskType !== null) {
      const mask = state.images.find((i) => i.type === image.maskType);
      if (mask) {
        const w = image.image[0].length;
        const h = image.image.length;
        for (let y = 0; y < h; ++y) {
          for (let x = 0; x < w; ++x) {
            image.image[y][x] &= mask.image[y][x];
          }
        }
        mask.used = true;
      }
    }
  }
  for (let i = 0; i < state.images.length;) {
    if (state.images[i].used) {
      state.images.splice(i, 1);
    } else {
      ++i;
    }
  }

  return { state, warnings };
}

const ICNS_HEAD = char32('icns');

/** @type {Map<number, Chunk>} */ const CHUNKS = new Map();

/**
 * @param {number} tag
 * @param {ChunkHandler} handler
 */
function registerChunk(tag, handler) {
  CHUNKS.set(tag, { handler });
}

registerChunk(char32('TOC '), (state, data, type, warnings) => {
  // Table of Contents
});

registerChunk(char32('icnV'), (state, data, type, warnings) => {
  // tooling version number
  if (data.byteLength !== 4) {
    warnings.push(`expected 4 bytes, got ${data.byteLength}`);
  }
  state.version = data.getFloat32(0);
});

registerChunk(char32('name'), (state, data, type, warnings) => {
  // 'icon' or 'template'
  state.name = getLatin1(data);
});

registerChunk(char32('info'), (state, data, type, warnings) => {
  // info binary plist with name property
});

/**
 * @param {string} identifier
 * @return {ChunkHandler}
 */
const SUBSET_HANDLER = (identifier) => (state, data, type, warnings) => {
  const sub = readICNS(data, { expectHeader: false });
  warnings.push(...sub.warnings.map((warning) => `${identifier} sub-icon: ${warning}`));
  state.sub.push({ type: identifier, state: sub.state });
};

registerChunk(char32('sbtp'), SUBSET_HANDLER('template'));
registerChunk(char32('slct'), SUBSET_HANDLER('selected'));
registerChunk(0xFDD92FA8, SUBSET_HANDLER('dark'));

/**
 * @param {object} options
 * @param {number=} options.size
 * @param {number=} options.width
 * @param {number=} options.height
 * @param {number=} options.scale
 * @param {number=} options.bits
 * @param {number=} options.mask
 * @param {number | null=} options.maskRef
 * @param {boolean=} options.prefix4Zeros
 * @param {boolean | 'unreliable'=} options.jpeg
 * @param {boolean | 'unreliable'=} options.png
 *
 * @return {ChunkHandler}
 */
const ICON_HANDLER = ({ size = 0, width = size, height = size, scale = 1, bits = 0, mask = 0, maskRef = null, prefix4Zeros = false, jpeg = false, png = false }) => (state, data, type, warnings) => {
  if ((png || jpeg || prefix4Zeros) && isPNG(data)) {
    if (!png) {
      warnings.push('unexpected PNG data');
    } else if (png === 'unreliable') {
      warnings.push('PNG format being used in a chunk which does not reliably support PNG');
    }
    const p = readPNG(data);
    warnings.push(...p.warnings);
    const image = p.state.idat?.image;
    if (image) {
      if (image.length !== height || image[0]?.length !== width) {
        warnings.push(`PNG has unexpected size: expected ${width}x${height}, got ${image[0]?.length ?? 0}x${image.length}`);
      }
      state.images.push({ type, maskType: null, bitDepth: 32, scale, image, rawPNG: p });
    }
    return;
  }
  if ((png || jpeg || prefix4Zeros) && (isJPEG(data) || isJPEG2000(data))) {
    if (!jpeg) {
      warnings.push('unexpected JPEG data');
    } else if (jpeg === 'unreliable') {
      warnings.push('JPEG format being used in a chunk which does not reliably support JPEG');
    }
    warnings.push('JPEG compression is not supported (TODO)');
    return;
  }
  if (prefix4Zeros) {
    const prefix = data.getUint32(0);
    if (prefix !== 0) {
      warnings.push(`expected 4x 0-bytes at start of data, got ${hex32(prefix)}`);
    }
    data = subViewFrom(data, 4);
  }
  /** @type {number[][]} */ const image = [];
  const s = width * height;

  if (!bits && !mask) { // invalid
    warnings.push(`expected embedded graphic, got ${data.byteLength} bytes beginning ${hex32(data.getUint32(0))} ${hex32(data.getUint32(4))} ${hex32(data.getUint32(8))} ${hex32(data.getUint32(12))}`);
    return;
  }

  if (bits === 32) { // ARGB
    const prefix = data.getUint32(0);
    if (prefix === char32('ARGB')) {
      data = subViewFrom(data, 4);
    } else {
      warnings.push(`expected ARGB data to begin with 'ARGB', got ${hex32(prefix)}`);
    }
    const uncompressed = unpack(data, s * 4, warnings);
    for (let y = 0; y < height; ++y) {
      /** @type {number[]} */ const row = [];
      for (let x = 0; x < width; ++x) {
        const p = y * width + x;
        row.push(((uncompressed[p] << 24) | (uncompressed[s + p] << 16) | (uncompressed[s * 2 + p] << 8) | (uncompressed[s * 3 + p])) >>> 0);
      }
      image.push(row);
    }
  } else if (bits === 24) { // RGB
    const uncompressed = unpack(data, s * 3, warnings);
    for (let y = 0; y < height; ++y) {
      /** @type {number[]} */ const row = [];
      for (let x = 0; x < width; ++x) {
        const p = y * width + x;
        row.push((0xFF000000 | (uncompressed[p] << 16) | (uncompressed[s + p] << 8) | (uncompressed[s * 2 + p])) >>> 0);
      }
      image.push(row);
    }
  } else { // palette and/or mask
    const palette = PALETTES.get(bits);
    if (!palette) {
      throw new Error(`missing palette for bit depth ${bits}`);
    }
    const paletteIndices = bits ? readBitArray(data, s, bits, warnings) : null;
    const alpha = mask ? readBitArray(subViewFrom(data, (s * bits + 7) >>> 3), s, mask, warnings) : null;
    const alphaM = 255 / ((1 << mask) - 1);
    const alphaConv = [];
    for (let i = 0; i < (1 << mask); ++i) {
      alphaConv[i] = (Math.round(i * alphaM) << 24) >>> 0;
    }
    for (let y = 0; y < height; ++y) {
      /** @type {number[]} */ const row = [];
      for (let x = 0; x < width; ++x) {
        const p = y * width + x;
        const c = paletteIndices ? palette[paletteIndices[p]] & 0xFFFFFF : 0xFFFFFF;
        const a = alpha ? alphaConv[alpha[p]] : 0xFF000000;
        row.push((a | c) >>> 0);
      }
      image.push(row);
    }
  }
  state.images.push({ type, maskType: maskRef, bitDepth: bits, scale, image });
};

const PALETTES = new Map([
  [0, []],
  [1, [0xFFFFFFFF, 0xFF000000]],
  [4, MACINTOSH4],
  [8, MACINTOSH8],
]);

/**
 * @param {DataView} data
 * @param {number} outputLength
 * @param {string[]} warnings
 * @return {Uint8Array}
 */
function unpack(data, outputLength, warnings) {
  const bytes = asBytes(data);
  const result = new Uint8Array(outputLength);
  let p = 0;
  let q = 0;
  while (p < bytes.byteLength) {
    const control = bytes[p];
    if (control < 0x80) {
      let n = control + 1;
      if (q + n > outputLength) {
        warnings.push('compressed data exceeds expected size');
        n = outputLength - q;
      }
      if (p + 1 + n > bytes.byteLength) {
        warnings.push('compressed data unexpectedly cut short');
        n = bytes.byteLength - p - 1;
      }
      result.set(bytes.subarray(p + 1, p + 1 + n), q);
      p += n + 1;
      q += n;
    } else {
      let n = control - 0x80 + 3;
      if (q + n > outputLength) {
        warnings.push('compressed data exceeds expected size');
        n = outputLength - q;
      }
      if (p + 1 > bytes.byteLength) {
        warnings.push('compressed data unexpectedly cut short');
      } else {
        result.fill(bytes[p + 1], q, q + n);
      }
      p += 2;
      q += n;
    }
  }

  return result;
}

/**
 * @param {DataView} data
 * @param {number} count
 * @param {number} bits
 * @param {string[]} warnings
 * @return {Uint8Array}
 */
function readBitArray(data, count, bits, warnings) {
  const bytes = asBytes(data);
  const result = new Uint8Array(count);
  if (data.byteLength < (count * bits + 7) >>> 3) {
    warnings.push('bit-packed data is too short');
  }
  const mask = (1 << bits) - 1;
  for (let i = 0; i < count; ++i) {
    const p = i * bits;
    result[i] = (bytes[p >>> 3] >>> (8 - bits - (p & 7))) & mask;
  }
  return result;
}

registerChunk(char32('icm#'), ICON_HANDLER({ width: 16, height: 12, bits: 1, mask: 1 }));
registerChunk(char32('icm4'), ICON_HANDLER({ width: 16, height: 12, bits: 4 }));
registerChunk(char32('icm8'), ICON_HANDLER({ width: 16, height: 12, bits: 8 }));

registerChunk(char32('ics#'), ICON_HANDLER({ size: 16, bits: 1, mask: 1 }));
registerChunk(char32('ics4'), ICON_HANDLER({ size: 16, bits: 4 }));
registerChunk(char32('ics8'), ICON_HANDLER({ size: 16, bits: 8 }));
registerChunk(char32('is32'), ICON_HANDLER({ size: 16, bits: 24, maskRef: char32('s8mk') }));
registerChunk(char32('icp4'), ICON_HANDLER({ size: 16, bits: 24, jpeg: 'unreliable', png: 'unreliable', maskRef: char32('s8mk') }));
registerChunk(char32('ic04'), ICON_HANDLER({ size: 16, bits: 32, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('s8mk'), ICON_HANDLER({ size: 16, mask: 8 }));

registerChunk(char32('icsb'), ICON_HANDLER({ size: 18, bits: 32, jpeg: 'unreliable', png: 'unreliable' }));

registerChunk(char32('sb24'), ICON_HANDLER({ size: 24, jpeg: true, png: true }));

registerChunk(char32('ICON'), ICON_HANDLER({ size: 32, bits: 1 }));
registerChunk(char32('ICN#'), ICON_HANDLER({ size: 32, bits: 1, mask: 1 }));
registerChunk(char32('icl4'), ICON_HANDLER({ size: 32, bits: 4 }));
registerChunk(char32('icl8'), ICON_HANDLER({ size: 32, bits: 8 }));
registerChunk(char32('il32'), ICON_HANDLER({ size: 32, bits: 24, maskRef: char32('l8mk') }));
registerChunk(char32('icp5'), ICON_HANDLER({ size: 32, bits: 24, jpeg: 'unreliable', png: 'unreliable', maskRef: char32('l8mk') }));
registerChunk(char32('l8mk'), ICON_HANDLER({ size: 32, mask: 8 }));

registerChunk(char32('ich#'), ICON_HANDLER({ size: 48, bits: 1, mask: 1 }));
registerChunk(char32('ich4'), ICON_HANDLER({ size: 48, bits: 4 }));
registerChunk(char32('ich8'), ICON_HANDLER({ size: 48, bits: 8 }));
registerChunk(char32('ih32'), ICON_HANDLER({ size: 48, bits: 24, maskRef: char32('h8mk') }));
registerChunk(char32('icp6'), ICON_HANDLER({ size: 48, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('h8mk'), ICON_HANDLER({ size: 48, mask: 8 }));

registerChunk(char32('it32'), ICON_HANDLER({ size: 128, bits: 24, prefix4Zeros: true, maskRef: char32('t8mk')}));
registerChunk(char32('ic07'), ICON_HANDLER({ size: 128, jpeg: true, png: true }));
registerChunk(char32('t8mk'), ICON_HANDLER({ size: 128, mask: 8 }));

registerChunk(char32('ic08'), ICON_HANDLER({ size: 256, jpeg: true, png: true }));

registerChunk(char32('ic09'), ICON_HANDLER({ size: 512, jpeg: true, png: true }));

registerChunk(char32('ic11'), ICON_HANDLER({ size: 32, scale: 2, jpeg: true, png: true }));
registerChunk(char32('ic05'), ICON_HANDLER({ size: 32, scale: 2, bits: 32, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('icsB'), ICON_HANDLER({ size: 36, scale: 2, jpeg: true, png: true }));
registerChunk(char32('SB24'), ICON_HANDLER({ size: 48, scale: 2, jpeg: true, png: true }));
registerChunk(char32('ic12'), ICON_HANDLER({ size: 64, scale: 2, jpeg: true, png: true }));
registerChunk(char32('ic13'), ICON_HANDLER({ size: 256, scale: 2, jpeg: true, png: true }));
registerChunk(char32('ic14'), ICON_HANDLER({ size: 512, scale: 2, jpeg: true, png: true }));
registerChunk(char32('ic10'), ICON_HANDLER({ size: 1024, scale: 2, jpeg: true, png: true }));
