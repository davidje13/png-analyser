import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   mdcv?: mDCvChunk,
 * }} mDCvState
 * @typedef {import('../registry.mjs').Chunk & {
 *   primaryR?: number,
 *   primaryG?: number,
 *   primaryB?: number,
 *   maxLum?: number,
 *   minLum?: number,
 * }} mDCvChunk
 */

// https://w3c.github.io/PNG-spec/#mDCv-chunk

registerChunk('mDCv', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {mDCvChunk} */ chunk, /** @type {mDCvState} */ state, warnings) => {
  state.mdcv = chunk;
  if (chunk.data.byteLength !== 24) {
    warnings.push(`mDCv length ${chunk.data.byteLength} is not 24`);
  }
  chunk.primaryR = chunk.data.getUint32(0) * 0.00002;
  chunk.primaryG = chunk.data.getUint32(4) * 0.00002;
  chunk.primaryB = chunk.data.getUint32(8) * 0.00002;
  chunk.maxLum = chunk.data.getUint32(12) * 0.0001; // cd/m3
  chunk.minLum = chunk.data.getUint32(16) * 0.0001; // cd/m3
});
