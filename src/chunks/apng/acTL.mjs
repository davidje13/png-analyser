import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   actl?: acTLChunk,
 * }} acTLState
 * @typedef {import('../registry.mjs').Chunk & {
 *   numFrames?: number,
 *   numPlays?: number,
 * }} acTLChunk
 */

registerChunk('acTL', { max: 1, notAfter: ['IDAT'], requires: ['fcTL'] }, (/** @type {acTLChunk} */ chunk, /** @type {acTLState} */ state, warnings) => {
  state.actl = chunk;
  if (chunk.data.byteLength !== 8) {
    warnings.push(`acTL length ${chunk.data.byteLength} is not 8`);
  }
  chunk.numFrames = chunk.data.getUint32(0);
  chunk.numPlays = chunk.data.getUint32(4);
  if (chunk.numFrames === 0) {
    warnings.push('acTL frame count is 0');
  }
});
