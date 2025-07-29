import { inflate } from '../../../../../data/deflate.mjs';
import { registerChunk } from '../../registry.mjs';
import { parse } from './tree/parser.mjs';
import { tokenise } from './tree/tokeniser.mjs';

/**
 * @typedef {import('./mkBT.mjs').mkBTState & {
 *   mkbs?: mkBSChunk,
 * }} mkBSState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   raw?: import('./tree/tokeniser.mjs').NodeToken,
 *   root?: import('./tree/node_registry.mjs').ProcessedNode,
 * }} mkBSChunk
 */

registerChunk('mkBS', {}, (/** @type {mkBSChunk} */ chunk, /** @type {mkBSState} */ state, warnings) => {
  try {
    const inflated = inflate(chunk.data);
    chunk.raw = tokenise(inflated, warnings);
    state.mkbs = chunk;
  } catch (e) {
    warnings.push(`mkBS compressed data is unreadable ${e}`);
  }
}, (state, warnings) => {
  if (state.mkbs?.raw) {
    const root = parse(null, state.mkbs.raw, { mkbts: state.mkbts, warnings });
    state.mkbs.root = root;
    state.mkbs.toString = () => root.toString();
    state.mkbs.display = (summary, content) => root.display(summary, content);
  }
});
