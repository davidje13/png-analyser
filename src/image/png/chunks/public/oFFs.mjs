import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   offs?: oFFsChunk,
 * }} oFFsState
 * @typedef {import('../registry.mjs').Chunk & {
 *   ppx?: number,
 *   ppy?: number,
 *   unit?: string,
 * }} oFFsChunk
 */

const UNITS = ['pixel', 'micrometer'];

registerChunk('oFFs', { max: 1, notAfter: ['IDAT'] }, (/** @type {oFFsChunk} */ chunk, /** @type {oFFsState} */ state, warnings) => {
  if (chunk.data.byteLength !== 9) {
    warnings.push(`oFFs length ${chunk.data.byteLength} is not 9`);
    return;
  }
  state.offs = chunk;
  chunk.ppx = chunk.data.getUint32(0);
  chunk.ppy = chunk.data.getUint32(4);
  const unit = chunk.data.getUint8(8);
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
});
