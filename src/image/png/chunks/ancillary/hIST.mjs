import { asDataView } from '../../../../data/utils.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   plte?: import('../mandatory/PLTE.mjs').PLTEChunk,
 *   hist?: hISTChunk,
 * }} hISTState
 * @typedef {import('../registry.mjs').Chunk & {
 *   frequencies?: number[],
 * }} hISTChunk
 */

registerChunk('hIST', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'], requires: ['PLTE'] }, (/** @type {hISTChunk} */ chunk, /** @type {hISTState} */ state, warnings) => {
  const d = asDataView(chunk.data);

  state.hist = chunk;
  if (d.byteLength & 1) {
    warnings.push(`invalid hIST length ${d.byteLength} (not a multiple of 2)`);
  } else if (state.plte?.paletteSize && d.byteLength !== state.plte.paletteSize * 2) {
    warnings.push(`hIST size ${d.byteLength / 2} does not match PLTE size`);
  }
  chunk.frequencies = [];
  for (let i = 0; i + 1 < d.byteLength; i += 2) {
    chunk.frequencies.push(d.getUint16(i));
  }
});
