import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';

registerChunk('mkBT', {}, (chunk, state, warnings) => {
  const marker = chunk.data.readUInt32BE(0);
  if (marker !== 0xFACECAFE) {
    warnings.push(`mkBT marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xFACECAFE (unknown format)`);
    return;
  }

  // some kind of non-uniformly incrementing number, presumably an identifier for the texture
  chunk.id = chunk.data.readUInt32BE(4);

  // sometimes chunk.data[11] is 1, otherwise this always seems to be 0s
  chunk.unknownFlag = chunk.data.readUInt32BE(8);
  chunk.unknownMeta = chunk.data.subarray(8, 8 + 68);

  try {
    const inflated = inflateSync(chunk.data.subarray(8 + 68));
    if (inflated.length !== 65536) {
      warnings.push(`mkBT uncompressed length ${inflated.length} is not 64kB`);
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
    const fullImg = [];
    for (let y = 0; y < th; ++y) {
      const row = [];
      for (let x = 0; x < tw; ++x) {
        const c = inflated.readUInt32BE((y * tw + x) * 4);
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
    chunk.img = fullImg.slice(0, maxH).map((v) => v.slice(0, maxW));
  } catch (e) {
    warnings.push(`mkBT compressed data is unreadable ${e}`);
  }

  chunk.write = (printNice) => {
    const r = [`ID=${chunk.id.toString(16).padStart(8, '0')}\n`];
    if (chunk.unknownFlag) {
      r.push(`meta ${printNice(chunk.unknownMeta)}\n`);
    }
    if (chunk.img) {
      for (const row of chunk.img) {
        r.push(row.map((c) => `${termCol(mix(c, 0xFF808080))} `).join('') + `${termReset}\n`);
      }
    } else {
      r.push('(failed to read texture data)\n');
    }
    return r.join('');
  };
});

const termReset = '\u001b[0m';
const termCol = (c) => `\u001b[48;2;${(c >> 16) & 0xFF};${(c >> 8) & 0xFF};${c & 0xFF}m`;

const mix = (top, bottom) => {
  const aT = top >>> 24;
  const rT = (top >>> 16) & 0xFF;
  const gT = (top >>> 8) & 0xFF;
  const bT = top & 0xFF;

  const aB = 255 - aT;
  const rB = (bottom >>> 16) & 0xFF;
  const gB = (bottom >>> 8) & 0xFF;
  const bB = bottom & 0xFF;
  const r = Math.round((aT * rT + aB * rB) / 255);
  const g = Math.round((aT * gT + aB * gB) / 255);
  const b = Math.round((aT * bT + aB * bB) / 255);
  return 0xFF000000 | (r << 16) | (g << 8) | b;
};
