import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   chrm?: cHRMChunk,
 * }} cHRMState
 * @typedef {import('../registry.mjs').Chunk & {
 *   whiteX?: number,
 *   whiteY?: number,
 *   redX?: number,
 *   redY?: number,
 *   greenX?: number,
 *   greenY?: number,
 *   blueX?: number,
 *   blueY?: number,
 * }} cHRMChunk
 */

registerChunk('cHRM', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {cHRMChunk} */ chunk, /** @type {cHRMState} */ state, warnings) => {
  state.chrm = chunk;
  if (chunk.data.byteLength !== 32) {
    warnings.push(`cHRM length ${chunk.data.byteLength} is not 32`);
  }
  chunk.whiteX = chunk.data.getUint32(0);
  chunk.whiteY = chunk.data.getUint32(4);
  chunk.redX = chunk.data.getUint32(8);
  chunk.redY = chunk.data.getUint32(12);
  chunk.greenX = chunk.data.getUint32(16);
  chunk.greenY = chunk.data.getUint32(20);
  chunk.blueX = chunk.data.getUint32(24);
  chunk.blueY = chunk.data.getUint32(28);
});
