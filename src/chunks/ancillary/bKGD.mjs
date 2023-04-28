import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('../mandatory/IHDR.mjs').IHDRChunk,
 *   bkgd?: bKGDChunk,
 * }} bKGDState
 * @typedef {import('../registry.mjs').Chunk & {
 *   backgroundIndex?: number,
 *   backgroundR?: number,
 *   backgroundG?: number,
 *   backgroundB?: number,
 * }} bKGDChunk
 */

registerChunk('bKGD', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'] }, (/** @type {bKGDChunk} */ chunk, /** @type {bKGDState} */ state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse bKGD data unambiguously without IHDR');
    return;
  }
  state.bkgd = chunk;
  if (state.ihdr.indexed) {
    if (chunk.data.byteLength !== 1) {
      warnings.push(`bKGD length ${chunk.data.byteLength} is not 1`);
    }
    chunk.backgroundIndex = chunk.data.getUint8(0);
  } else if (state.ihdr.rgb) {
    chunk.backgroundR = chunk.data.getUint16(0);
    chunk.backgroundG = chunk.data.getUint16(2);
    chunk.backgroundB = chunk.data.getUint16(4);
  } else {
    chunk.backgroundG = chunk.data.getUint16(0);
  }
});
