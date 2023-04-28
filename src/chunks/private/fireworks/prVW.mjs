import { inflate } from '../../../deflate.mjs';
import { asCanvas, printImage, termCol, termReset } from '../../../pretty.mjs';
import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   prvw?: prVWChunk,
 * }} prVWState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   previewWidth?: number,
 *   previewHeight?: number,
 *   palette?: number[],
 *   image?: number[][],
 * }} prVWChunk
 */

registerChunk('prVW', { max: 1 }, (/** @type {prVWChunk} */ chunk, /** @type {prVWState} */ state, warnings) => {
  try {
    const inflated = inflate(chunk.data);
    const marker = inflated.getUint32(0);
    if (marker !== 0xCAFEBEEF) {
      warnings.push(`prVW marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xCAFEBEEF (unknown format)`);
      return;
    }
    state.prvw = chunk;
    chunk.previewWidth = inflated.getUint16(4);
    chunk.previewHeight = inflated.getUint16(6);
    /** @type {number[]} */ const palette = []
    let p = 8;
    for (; p + 2 < inflated.byteLength; p += 3) {
      const entry = (inflated.getUint8(p) << 16) | (inflated.getUint8(p + 1) << 8) | inflated.getUint8(p + 2);
      palette.push(entry);
      if (!entry) {
        break;
      }
    }
    chunk.palette = palette;

    const dataW = 128;
    const dataH = 128;

    const gridBegin = inflated.byteLength - dataW * dataH;
    //chunk.unknownData = inflated.subarray(p, gridBegin); // TODO: what is stored here? seems unlikely to be all random garbage

    /** @type {number[][]} */ const image = [];
    // data seems to contain unitialised garbage in the 128x128 grid outside the image area (likely random program memory)
    for (let y = 0; y < chunk.previewHeight; ++y) {
      const row = [];
      for (let x = 0; x < chunk.previewWidth; ++x) {
        const index = inflated.getUint8(gridBegin + y * dataW + x);
        row.push(palette[index] ?? -1);
      }
      image.push(row);
    }
    chunk.image = image;

    chunk.write = () => {
      const r = ['\npalette:\n'];
      for (let i = 0; i < palette.length; ++i) {
        const c = palette[i];
        r.push(`  ${termCol(c)} ${c.toString(16).padStart(6, '0')} ${termReset} ${i}\n`);
      }
      r.push(`\nimage (${chunk.previewWidth}x${chunk.previewHeight}):\n`);
      r.push(printImage(image));
      return r.join('');
    };
    chunk.display = (summary, content) => {
      summary.append(`(${chunk.previewWidth}x${chunk.previewHeight})`);
      content.append(asCanvas(image, false));
    };
  } catch (e) {
    warnings.push(`prVW compressed data is unreadable ${e}`);
  }
});
