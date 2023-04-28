import { subView, subViewLen } from '../../../data_utils.mjs';
import { inflate } from '../../../deflate.mjs';
import { asCanvas, printImage, printNice } from '../../../pretty.mjs';
import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   mkbts?: Map<number, mkBTChunk>,
 * }} mkBTState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   id?: number,
 *   isLuminosity?: boolean,
 *   img?: (w?: number, h?: number) => number[][],
 * }} mkBTChunk
 */

registerChunk('mkBT', {}, (/** @type {mkBTChunk} */ chunk, /** @type {mkBTState} */ state, warnings) => {
  const marker = chunk.data.getUint32(0);
  if (marker !== 0xFACECAFE) {
    warnings.push(`mkBT marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xFACECAFE (unknown format)`);
    return;
  }

  chunk.id = chunk.data.getUint32(4);

  state.mkbts ||= new Map();
  if (state.mkbts.has(chunk.id)) {
    warnings.push(`multiple mkBT chunks with ID ${chunk.id}`);
  }
  state.mkbts.set(chunk.id, chunk);

  chunk.isLuminosity = Boolean(chunk.data.getUint8(11));
  // 8-76 is all 0s except the grayscale flag

  try {
    const inflated = inflate(subView(chunk.data, 76));
    if (inflated.byteLength !== 65536) {
      warnings.push(`mkBT uncompressed length ${inflated.byteLength} is not 64kB`);
      return;
    }

    // Data contains:
    // a 128x128 raw bitmap. No control data (must be elsewhere)
    // block is filled right/bottom with transparent white (opposed to transparent black within "active" area, though this is not 100% guaranteed)
    // big-endian ARGB for each pixel

    if (chunk.isLuminosity) {
      chunk.img = (tw = 256, th = 256) => {
        /** @type {number[][]} */ const fullImg = [];
        for (let y = 0; y < th; ++y) {
          const row = [];
          for (let x = 0; x < tw; ++x) {
            const c = inflated.getUint8(y * tw + x);
            row.push((c * 0x010101) | 0xFF000000);
          }
          fullImg.push(row);
        }
        return fullImg;
      };
    } else {
      chunk.img = (tw = 128, th = 128) => {
        /** @type {number[][]} */ const fullImg = [];
        for (let y = 0; y < th; ++y) {
          const row = [];
          for (let x = 0; x < tw; ++x) {
            const c = inflated.getUint32((y * tw + x) * 4);
            row.push(c);
          }
          fullImg.push(row);
        }
        return fullImg;
      };
    }
  } catch (e) {
    warnings.push(`mkBT compressed data is unreadable ${e}`);
  }

  chunk.write = () => {
    const r = [`ID=${chunk.id?.toString(16).padStart(8, '0')}\n`];
    if (chunk.img) {
      r.push(printImage(cropImage(chunk.img()), 0xFF808080));
    } else {
      r.push('(failed to read texture data)\n');
    }
    return r.join('');
  };
  chunk.display = (summary, content) => {
    summary.append(`ID=${chunk.id?.toString(16).padStart(8, '0')}, ${chunk.isLuminosity ? 'luminosity' : 'rgba'}`);
    if (chunk.img) {
      content.append(asCanvas(chunk.img(), true));
    } else {
      content.append('(failed to read texture data)');
    }
  };
});

/**
 * @param {number[][]} image
 * @return {number[][]}
 */
function cropImage(image) {
  if (!image.length) {
    return image;
  }
  let maxX = 0;
  let maxY = 0;
  let minX = image[0].length;
  let minY = image.length;
  for (let y = 0; y < image.length; ++y) {
    for (let x = 0; x < image[0].length; ++x) {
      if (image[y][x] >>> 24) {
        if (x >= maxX) {
          maxX = x + 1;
        }
        if (x < minX) {
          minX = x;
        }
        if (y < minY) {
          minY = y;
        }
        maxY = y + 1;
      }
    }
  }
  if (minY >= maxY) {
    return [];
  }
  return image.slice(minY, maxY).map((v) => v.slice(minX, maxX));
}
