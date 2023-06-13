// http://www.libpng.org/pub/png/spec/iso/index-noobject.html

import { checkHeader } from './header.mjs';
import { readChunk, parseChunks } from './chunk.mjs';

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {{
 *   warnings: string[],
 *   chunks: import('./chunk.mjs').Chunk[],
 *   state: import('./chunk.mjs').State & import('./chunks/mandatory/IDAT.mjs').IDATState,
 * }}
 */
export function readPNG(data) {
  /** @type {string[]} */ const warnings = [];
  const body = checkHeader(data, warnings);
  if (!body.byteLength) {
    return { warnings, chunks: [], state: {} };
  }
  const chunks = [];
  for (let p = 0; p < body.byteLength;) {
    const chunk = readChunk(body, p, warnings);
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
