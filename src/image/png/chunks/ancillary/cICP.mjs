import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   cicp?: cICPChunk,
 * }} cICPState
 * @typedef {import('../registry.mjs').Chunk & {
 *   primaries?: number,
 *   transferFunction?: number,
 *   fullRange?: boolean,
 * }} cICPChunk
 */

// https://w3c.github.io/PNG-spec/#cICP-chunk

registerChunk('cICP', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {cICPChunk} */ chunk, /** @type {cICPState} */ state, warnings) => {
  state.cicp = chunk;
  if (chunk.data.byteLength !== 4) {
    warnings.push(`cICP length ${chunk.data.byteLength} is not 4`);
  }
  chunk.primaries = chunk.data.getUint8(0);
  chunk.transferFunction = chunk.data.getUint8(1);
  if (chunk.data.getUint8(2) !== 0) {
    warnings.push(`cICP matrix coefficients (${chunk.data.getUint8(2)}) is not 0`);
  }
  const fr = chunk.data.getUint8(3);
  if (fr > 1) {
    warnings.push(`cICP full range flag (${fr}) is not 0 or 1`);
  }
  chunk.fullRange = fr !== 0;
});
