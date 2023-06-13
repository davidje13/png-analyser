import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('../mandatory/IHDR.mjs').IHDRChunk,
 *   sbit?: sBITChunk,
 * }} sBITState
 * @typedef {import('../registry.mjs').Chunk & {
 *   originalBits?: number[],
 * }} sBITChunk
 */

registerChunk('sBIT', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {sBITChunk} */ chunk, /** @type {sBITState} */ state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse sBIT data unambiguously without IHDR');
    return;
  }
  const channels = state.ihdr.channels ?? [];
  if (chunk.data.byteLength !== channels.length) {
    warnings.push(`significant bits size ${chunk.data.byteLength} does not match image channels ${channels}`);
    return;
  }
  state.sbit = chunk;
  /** @type {number[]} */ const originalBits = [];
  for (let i = 0; i < channels.length; ++i) {
    originalBits.push(chunk.data.getUint8(i));
  }
  chunk.originalBits = originalBits;

  chunk.display = (summary, content) => {
    summary.append(channels.map((c, i) => `${c} = ${originalBits[i]}-bit`).join(', '));
  };
});
