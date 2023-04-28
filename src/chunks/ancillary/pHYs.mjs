import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   phys?: pHYsChunk,
 * }} pHYsState
 * @typedef {import('../registry.mjs').Chunk & {
 *   ppx?: number,
 *   ppy?: number,
 *   aspect?: number,
 *   unit?: string,
 * }} pHYsChunk
 */

const UNITS = ['-', 'per meter'];

registerChunk('pHYs', { max: 1, notAfter: ['IDAT'] }, (/** @type {pHYsChunk} */ chunk, /** @type {pHYsState} */ state, warnings) => {
  if (chunk.data.byteLength !== 9) {
    warnings.push(`pHYs length ${chunk.data.byteLength} is not 9`);
    return;
  }
  state.phys = chunk;
  chunk.ppx = chunk.data.getUint32(0);
  chunk.ppy = chunk.data.getUint32(4);
  chunk.aspect = chunk.ppy / chunk.ppx; // = width/height (ppx/ppy are reciprocal)
  const unit = chunk.data.getUint8(8);
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
  chunk.write = () => {
    if (unit) {
      return `x = ${chunk.ppx} pixels ${chunk.unit}, y = ${chunk.ppy} pixels ${chunk.unit}`;
    } else {
      return `aspect = ${chunk.ppx} : ${chunk.ppy}`;
    }
  };
  chunk.display = (summary, content) => {
    summary.append(chunk.write?.() ?? '');
  };
});
