import { isPNG, readPNG } from '../png/png.mjs';
import { asBytes, asDataView, char32, getLatin1, hex32, printTag, subViewFrom, subViewLen } from '../../data/utils.mjs';

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
 * @typedef {{ type: string, state: State }} SubIcons
 * @typedef {(state: State, data: DataView, warnings: string[]) => void} ChunkHandler
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

  /** @type {State} */ const state = { images: [], sub: [] };

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
      mode.handler(state, iconData, w);
      warnings.push(...w.map((warning) => `${printTag(iconType)}: ${warning}`));
    } else {
      warnings.push(`unknown icon type: ${printTag(iconType)}`);
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

registerChunk(char32('TOC '), (state, data, warnings) => {
  // Table of Contents
});

registerChunk(char32('icnV'), (state, data, warnings) => {
  // tooling version number
  if (data.byteLength !== 4) {
    warnings.push(`expected 4 bytes, got ${data.byteLength}`);
  }
  state.version = data.getFloat32(0);
});

registerChunk(char32('name'), (state, data, warnings) => {
  // 'icon' or 'template'
  state.name = getLatin1(data);
});

registerChunk(char32('info'), (state, data, warnings) => {
  // info binary plist with name property
});

/**
 * @param {string} type
 * @return {ChunkHandler}
 */
const SUBSET_HANDLER = (type) => (state, data, warnings) => {
  const sub = readICNS(data, { expectHeader: false });
  warnings.push(...sub.warnings.map((warning) => `${type} sub-icon: ${warning}`));
  state.sub.push({ type, state: sub.state });
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
 * @param {boolean=} options.prefix4Zeros
 * @param {boolean | 'unreliable'=} options.jpeg
 * @param {boolean | 'unreliable'=} options.png
 *
 * @return {ChunkHandler}
 */
const ICON_HANDLER = ({ size = 0, width = size, height = size, scale = 1, bits = 0, mask = 0, prefix4Zeros = false, jpeg = false, png = false }) => (state, data, warnings) => {
  if (isPNG(data)) {
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
      state.images.push({ bitDepth: 32, scale, image, rawPNG: p });
    }
    return;
  }
  let p = 0;
  if (prefix4Zeros) {
    const prefix = data.getUint32(0);
    if (prefix !== 0) {
      warnings.push(`expected 4x 0-bytes at start of data, got ${hex32(prefix)}`);
    }
    p = 4;
  }
  /** @type {number[][]} */ const image = [];
  const s = width * height;

  if (bits === 24) { // RGB
    const uncompressed = unpack(subViewFrom(data, p), s * 3, warnings);
    for (let y = 0; y < height; ++y) {
      /** @type {number[]} */ const row = [];
      for (let x = 0; x < width; ++x) {
        const p = y * width + x;
        row.push((0xFF000000 | (uncompressed[p] << 16) | (uncompressed[s + p] << 8) | (uncompressed[s * 2 + p])) >>> 0);
      }
      image.push(row);
    }
  } else if (bits === 32) { // ARGB
    const uncompressed = unpack(subViewFrom(data, p), s * 4, warnings);
    for (let y = 0; y < height; ++y) {
      /** @type {number[]} */ const row = [];
      for (let x = 0; x < width; ++x) {
        const p = y * width + x;
        row.push(((uncompressed[p] << 24) | (uncompressed[s + p] << 16) | (uncompressed[s * 2 + p] << 8) | (uncompressed[s * 3 + p])) >>> 0);
      }
      image.push(row);
    }
  } else {
    warnings.push('icon chunk type not yet supported (TODO)');
    return;
  }
  state.images.push({ bitDepth: bits, scale, image });
};

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

registerChunk(char32('ICON'), ICON_HANDLER({ size: 32, bits: 1, mask: 0 }));
registerChunk(char32('ICN#'), ICON_HANDLER({ size: 32, bits: 1, mask: 1 }));
registerChunk(char32('icm#'), ICON_HANDLER({ width: 16, height: 12, bits: 1, mask: 1 }));
registerChunk(char32('icm4'), ICON_HANDLER({ width: 16, height: 12, bits: 4, mask: 0 }));
registerChunk(char32('icm8'), ICON_HANDLER({ width: 16, height: 12, bits: 8, mask: 0 }));
registerChunk(char32('ics#'), ICON_HANDLER({ size: 16, bits: 1, mask: 1 }));
registerChunk(char32('ics4'), ICON_HANDLER({ size: 16, bits: 4, mask: 0 }));
registerChunk(char32('ics8'), ICON_HANDLER({ size: 16, bits: 8, mask: 0 }));
registerChunk(char32('is32'), ICON_HANDLER({ size: 16, bits: 24, mask: 0 }));
registerChunk(char32('s8mk'), ICON_HANDLER({ size: 16, bits: 0, mask: 8 }));
registerChunk(char32('icl4'), ICON_HANDLER({ size: 32, bits: 4, mask: 0 }));
registerChunk(char32('icl8'), ICON_HANDLER({ size: 32, bits: 8, mask: 0 }));
registerChunk(char32('il32'), ICON_HANDLER({ size: 32, bits: 24, mask: 0 }));
registerChunk(char32('l8mk'), ICON_HANDLER({ size: 32, bits: 0, mask: 8 }));
registerChunk(char32('ich#'), ICON_HANDLER({ size: 48, bits: 1, mask: 1 }));
registerChunk(char32('ich4'), ICON_HANDLER({ size: 48, bits: 4, mask: 0 }));
registerChunk(char32('ich8'), ICON_HANDLER({ size: 48, bits: 8, mask: 0 }));
registerChunk(char32('ih32'), ICON_HANDLER({ size: 48, bits: 24, mask: 0 }));
registerChunk(char32('h8mk'), ICON_HANDLER({ size: 48, bits: 0, mask: 8 }));
registerChunk(char32('it32'), ICON_HANDLER({ size: 128, bits: 24, mask: 0, prefix4Zeros: true }));
registerChunk(char32('t8mk'), ICON_HANDLER({ size: 128, bits: 0, mask: 8 }));
registerChunk(char32('icp4'), ICON_HANDLER({ size: 16, bits: 24, mask: 0, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('icp5'), ICON_HANDLER({ size: 32, bits: 24, mask: 0, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('icp6'), ICON_HANDLER({ size: 48, bits: 0, mask: 0, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('ic07'), ICON_HANDLER({ size: 128, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic08'), ICON_HANDLER({ size: 256, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic09'), ICON_HANDLER({ size: 512, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic10'), ICON_HANDLER({ size: 1024, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic11'), ICON_HANDLER({ size: 32, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic12'), ICON_HANDLER({ size: 64, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic13'), ICON_HANDLER({ size: 256, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic14'), ICON_HANDLER({ size: 512, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('ic04'), ICON_HANDLER({ size: 16, bits: 32, mask: 0, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('ic05'), ICON_HANDLER({ size: 32, scale: 2, bits: 32, mask: 0, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('icsb'), ICON_HANDLER({ size: 18, bits: 32, mask: 0, jpeg: 'unreliable', png: 'unreliable' }));
registerChunk(char32('icsB'), ICON_HANDLER({ size: 36, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('sb24'), ICON_HANDLER({ size: 24, bits: 0, mask: 0, jpeg: true, png: true }));
registerChunk(char32('SB24'), ICON_HANDLER({ size: 48, scale: 2, bits: 0, mask: 0, jpeg: true, png: true }));
