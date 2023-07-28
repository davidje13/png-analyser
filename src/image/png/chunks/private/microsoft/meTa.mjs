import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 * }} meTaState
 * @typedef {import('../../registry.mjs').Chunk & {
 * }} meTaChunk
 */

registerChunk('meTa', { }, (/** @type {meTaChunk} */ chunk, /** @type {meTaState} */ state, warnings) => {
  // TODO
});
