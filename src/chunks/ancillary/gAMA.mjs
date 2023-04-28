import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   gama?: gAMAChunk,
 * }} gAMAState
 * @typedef {import('../registry.mjs').Chunk & {
 *   gama?: number,
 * }} gAMAChunk
 */

registerChunk('gAMA', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {gAMAChunk} */ chunk, /** @type {gAMAState} */ state, warnings) => {
  if (chunk.data.byteLength !== 4) {
    warnings.push(`gAMA length ${chunk.data.byteLength} is not 4`);
    if (chunk.data.byteLength < 4) {
      return;
    }
  }
  chunk.gama = chunk.data.getUint32(0);
  state.gama = chunk;
});
