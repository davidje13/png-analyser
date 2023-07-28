import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 * }} skMfState
 * @typedef {import('../../registry.mjs').Chunk & {
 * }} skMfChunk
 */

registerChunk('skMf', { }, (/** @type {skMfChunk} */ chunk, /** @type {skMfState} */ state, warnings) => {
  // TODO
});
