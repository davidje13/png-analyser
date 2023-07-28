import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   clli?: cLLiChunk,
 * }} cLLiState
 * @typedef {import('../registry.mjs').Chunk & {
 *   maxContentLightLevel?: number,
 *   maxFrameAvgLightLevel?: number,
 * }} cLLiChunk
 */

// https://w3c.github.io/PNG-spec/#cLLi-chunk

registerChunk('cLLi', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {cLLiChunk} */ chunk, /** @type {cLLiState} */ state, warnings) => {
  state.clli = chunk;
  if (chunk.data.byteLength !== 8) {
    warnings.push(`cLLi length ${chunk.data.byteLength} is not 8`);
  }
  chunk.maxContentLightLevel = chunk.data.getUint32(0) * 0.0001; // cd/m3
  chunk.maxFrameAvgLightLevel = chunk.data.getUint32(4) * 0.0001; // cd/m3
});
