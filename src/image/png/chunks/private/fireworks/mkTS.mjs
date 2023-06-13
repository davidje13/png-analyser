import { inflate } from '../../../../../data/deflate.mjs';
import { registerChunk } from '../../registry.mjs';
import { parse } from './tree/parser.mjs';
import { tokenise } from './tree/tokeniser.mjs';

/**
 * @typedef {import('./mkBT.mjs').mkBTState & {
 *   mkts?: mkTSChunk,
 * }} mkTSState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   raw?: import('./tree/tokeniser.mjs').NodeToken,
 *   root?: import('./tree/node_registry.mjs').ProcessedNode,
 * }} mkTSChunk
 */

registerChunk('mkTS', {}, (/** @type {mkTSChunk} */ chunk, /** @type {mkTSState} */ state, warnings) => {
  try {
    const inflated = inflate(chunk.data);
    chunk.raw = tokenise(inflated, warnings);
    state.mkts = chunk;
  } catch (e) {
    warnings.push(`mkTS compressed data is unreadable ${e}`);
  }
}, (state, warnings) => {
  if (state.mkts?.raw) {
    const root = parse(state.mkts.raw, { mkbts: state.mkbts, warnings });
    state.mkts.root = root;
    state.mkts.toString = () => root.toString();
    state.mkts.display = (summary, content) => root.display(summary, content);
  }
});
