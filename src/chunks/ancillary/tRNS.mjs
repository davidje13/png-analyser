import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('../mandatory/IHDR.mjs').IHDRChunk,
 *   trns?: tRNSChunk,
 * }} tRNSState
 * @typedef {import('../registry.mjs').Chunk & {
 *   indexedAlpha?: number[],
 *   sampleR?: number,
 *   sampleG?: number,
 *   sampleB?: number,
 * }} tRNSChunk
 */

registerChunk('tRNS', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'] }, (/** @type {tRNSChunk} */ chunk, /** @type {tRNSState} */ state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse tRNS data unambiguously without IHDR');
    return;
  }
  if (state.ihdr.alpha) {
    warnings.push('tRNS chunk present in image with built-in alpha channel');
    return;
  }
  state.trns = chunk;
  if (state.ihdr.indexed) {
    if (chunk.data.byteLength > 256) {
      warnings.push(`transparency palette size ${chunk.data.byteLength} exceeds 256`);
    }
    chunk.indexedAlpha = [];
    for (let i = 0; i < chunk.data.byteLength; ++i) {
      chunk.indexedAlpha.push(chunk.data.getUint8(i));
    }
  } else if (state.ihdr.rgb) {
    chunk.sampleR = chunk.data.getUint16(0);
    chunk.sampleG = chunk.data.getUint16(2);
    chunk.sampleB = chunk.data.getUint16(4);
  } else {
    chunk.sampleG = chunk.data.getUint16(0);
  }
});
