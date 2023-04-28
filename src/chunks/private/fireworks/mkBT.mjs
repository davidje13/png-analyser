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
 *   unknownFlag?: number,
 *   unknownMeta?: ArrayBufferView,
 *   img?: number[][],
 *   visibleW: number,
 *   visibleH: number,
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

  // sometimes chunk.data[11] is 1, otherwise this always seems to be 0s
  chunk.unknownFlag = chunk.data.getUint32(8);
  chunk.unknownMeta = subViewLen(chunk.data, 8, 68);

  try {
    const inflated = inflate(subView(chunk.data, 8 + 68));
    if (inflated.byteLength !== 65536) {
      warnings.push(`mkBT uncompressed length ${inflated.byteLength} is not 64kB`);
      return;
    }

    // Data contains:
    // a 128x128 raw bitmap. No control data (must be elsewhere)
    // block is filled right/bottom with transparent white (opposed to transparent black within "active" area, though this is not 100% guaranteed)
    // big-endian ARGB for each pixel

    const tw = 128;
    const th = 128;

    let maxW = 0;
    let maxH = 0;
    /** @type {number[][]} */ const fullImg = [];
    for (let y = 0; y < th; ++y) {
      const row = [];
      for (let x = 0; x < tw; ++x) {
        const c = inflated.getUint32((y * tw + x) * 4);
        row.push(c);
        if (c >>> 24) {
          if (x >= maxW) {
            maxW = x + 1;
          }
          maxH = y + 1;
        }
      }
      fullImg.push(row);
    }
    chunk.visibleW = maxW;
    chunk.visibleH = maxH;
    chunk.img = fullImg;
  } catch (e) {
    warnings.push(`mkBT compressed data is unreadable ${e}`);
  }

  chunk.write = () => {
    const r = [`ID=${chunk.id?.toString(16).padStart(8, '0')}\n`];
    if (chunk.unknownFlag) {
      r.push(`meta ${printNice(chunk.unknownMeta)}\n`);
    }
    if (chunk.img) {
      r.push(printImage(chunk.img.slice(0, chunk.visibleH).map((v) => v.slice(0, chunk.visibleW)), 0xFF808080));
    } else {
      r.push('(failed to read texture data)\n');
    }
    return r.join('');
  };
  chunk.display = (summary, content) => {
    summary.append(` ID=${chunk.id?.toString(16).padStart(8, '0')}`);
    if (chunk.img) {
      content.append(asCanvas(chunk.img, true));
    } else {
      content.append('(failed to read texture data)');
    }
  };
});
