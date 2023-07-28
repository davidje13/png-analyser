import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 * }} orNTState
 * @typedef {import('../../registry.mjs').Chunk & {
 * }} orNTChunk
 */

registerChunk('orNT', { }, (/** @type {orNTChunk} */ chunk, /** @type {orNTState} */ state, warnings) => {
  // Image Orientation
  // TODO
});
