import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   isAlpha?: boolean,
 * }} alPhState
 */

registerChunk('alPh', { max: 1, notAfter: ['IDAT'] }, (chunk, /** @type {alPhState} */ state, warnings) => {
  if (chunk.data.byteLength !== 0) {
    warnings.push(`alPh chunk has non-zero length ${chunk.data.byteLength}`);
  }
  state.isAlpha = true;
});
