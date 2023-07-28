import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 * }} cpAgState
 * @typedef {import('../../registry.mjs').Chunk & {
 * }} cpAgChunk
 */

registerChunk('cpAg', { }, (/** @type {cpAgChunk} */ chunk, /** @type {cpAgState} */ state, warnings) => {
  // Virtual Page information
  // TODO
});
