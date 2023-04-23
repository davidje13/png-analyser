import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';

registerChunk('prVW', { max: 1 }, (chunk, state, warnings) => {
  try {
    const inflated = inflateSync(chunk.data);
    const marker = inflated.readUInt32BE(0);
    if (marker !== 0xCAFEBEEF) {
      warnings.push(`prVW marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xCAFEBEEF (unknown format)`);
      return;
    }
    state.prvw = chunk;
    chunk.previewWidth = inflated.readInt16BE(4);
    chunk.previewHeight = inflated.readInt16BE(6);
    chunk.palette = [];
    let p = 8;
    for (; p + 2 < inflated.length; p += 3) {
      const entry = (inflated[p] << 16) | (inflated[p+1] << 8) | inflated[p+2];
      chunk.palette.push(entry);
      if (!entry) {
        break;
      }
    }

    const dataW = 128;
    const dataH = 128;

    const gridBegin = inflated.length - dataW * dataH;
    //chunk.unknownData = inflated.subarray(p, gridBegin); // TODO: what is stored here? seems unlikely to be all random garbage

    chunk.image = [];
    // data seems to contain unitialised garbage in the 128x128 grid outside the image area (likely random program memory)
    for (let y = 0; y < chunk.previewHeight; ++y) {
      const row = [];
      for (let x = 0; x < chunk.previewWidth; ++x) {
        const index = inflated[gridBegin + y * dataW + x];
        row.push(chunk.palette[index] ?? -1);
      }
      chunk.image.push(row);
    }

    chunk.write = () => {
      const r = ['\npalette:\n'];
      for (let i = 0; i < chunk.palette.length; ++i) {
        const c = chunk.palette[i];
        r.push(`  ${termCol(c)} ${c.toString(16).padStart(6, '0')} ${termReset} ${i}\n`);
      }
      r.push(`\nimage (${chunk.previewWidth}x${chunk.previewHeight}):\n`);
      for (const row of chunk.image) {
        r.push(row.map((c) => (c === -1) ? `${termReset}!` : `${termCol(c)} `).join('') + `${termReset}\n`);
      }
      return r.join('');
    };
  } catch (e) {
    warnings.push(`prVW compressed data is unreadable ${e}`);
  }
});

const termReset = '\u001b[0m';
const termCol = (c) => `\u001b[48;2;${c >> 16};${(c >> 8) & 0xFF};${c & 0xFF}m`;
