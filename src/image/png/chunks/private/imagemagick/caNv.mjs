import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 * }} caNvState
 * @typedef {import('../../registry.mjs').Chunk & {
 * }} caNvChunk
 */

registerChunk('caNv', { }, (/** @type {caNvChunk} */ chunk, /** @type {caNvState} */ state, warnings) => {
  // Canvas
  // TODO
});
