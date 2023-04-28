import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('./IHDR.mjs').IHDRChunk,
 *   plte?: PLTEChunk,
 * }} PLTEState
 * @typedef {import('../registry.mjs').Chunk & {
 *   paletteSize?: number,
 * }} PLTEChunk
 */

registerChunk('PLTE', { max: 1, notAfter: ['IDAT'] }, (/** @type {PLTEChunk} */ chunk, /** @type {PLTEState} */ state, warnings) => {
  state.plte = chunk;
  if (state.ihdr && !state.ihdr.rgb && !state.ihdr.indexed) {
    warnings.push(`palette specified for greyscale colour type ${state.ihdr.colourType}`);
  }
  chunk.paletteSize = (chunk.data.byteLength / 3)|0;
  if (chunk.data.byteLength % 3 !== 0) {
    warnings.push(`palette length ${chunk.data.byteLength} is not a multiple of 3`);
  }
  if (chunk.paletteSize > 256) {
    warnings.push(`palette size ${chunk.paletteSize} exceeds 256`);
  }
});
