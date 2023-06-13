import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   grab?: grAbChunk,
 * }} grAbState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   xOffset?: number,
 *   yOffset?: number,
 * }} grAbChunk
 */

registerChunk('grAb', { max: 1, notAfter: ['IDAT'] }, (/** @type {grAbChunk} */ chunk, /** @type {grAbState} */ state, warnings) => {
  if (chunk.data.byteLength !== 8) {
    warnings.push(`grAb chunk length ${chunk.data.byteLength} is not 8`);
    if (chunk.data.byteLength < 8) {
      return;
    }
  }
  state.grab = chunk;
  chunk.xOffset = chunk.data.getInt32(0);
  chunk.yOffset = chunk.data.getInt32(4);
});
