// http://www.libpng.org/pub/png/spec/iso/index-noobject.html

import { checkHeader } from './header.mjs';
import { readChunk, parseChunks } from './chunk.mjs';

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {{
 *   warnings: string[],
 *   chunks: import('./chunk.mjs').Chunk[],
 *   state: import('./chunk.mjs').State,
 * }}
 */
export function readPNG(data) {
  /** @type {string[]} */ const warnings = [];
  const begin = checkHeader(data, warnings);
  if (warnings.length) {
    return { warnings, chunks: [], state: {} };
  }
  const chunks = [];
  for (let p = begin; p < data.byteLength;) {
    const chunk = readChunk(data, p, warnings);
    chunks.push(chunk);
    p += chunk.advance;
  }
  const state = parseChunks(chunks, warnings);

  return { warnings, chunks, state };
}

//const npot = (v) => 1 << (32 - Math.clz32(v - 1));
//const deflateOptions = {
//  chunkSize: Math.max(256, Math.min(32768, npot(imageData.length))),
//  level: 9,
//};
