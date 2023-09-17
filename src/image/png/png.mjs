// http://www.libpng.org/pub/png/spec/iso/index-noobject.html
// https://github.com/w3c/PNG-spec
// https://github.com/w3c/PNG-spec/blob/main/Third_Edition_Explainer.md

import { checkHeader, isPerfectPNGHeader } from './header.mjs';
import { readChunk, parseChunks } from './chunk.mjs';

export const isPNG = isPerfectPNGHeader;

/**
 * @typedef {{
 *   warnings: string[],
 *   chunks: import('./chunk.mjs').Chunk[],
 *   state: import('./chunk.mjs').State & import('./chunks/mandatory/IDAT.mjs').IDATState,
 *   bitDepth: number,
 * }} PNGResult
 */

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {PNGResult}
 */
export function readPNG(data) {
  /** @type {PNGResult} */ const result = { warnings: [], chunks: [], state: {}, bitDepth: 0 };
  const body = checkHeader(data, result.warnings);
  if (!body) {
    return result;
  }
  for (let p = 0; p < body.byteLength;) {
    const chunk = readChunk(body, p, p + 8, result.warnings);
    result.chunks.push(chunk);
    p += chunk.advance;
  }
  result.state = parseChunks(result.chunks, result.warnings);
  result.bitDepth = result.state.ihdr?.bitDepth ?? 0;

  return result;
}

//const npot = (v) => 1 << (32 - Math.clz32(v - 1));
//const deflateOptions = {
//  chunkSize: Math.max(256, Math.min(32768, npot(imageData.length))),
//  level: 9,
//};
