import { inflate } from '../../../../../data/inflate.mjs';
import { registerChunk } from '../../registry.mjs';
import { displayRawStructure } from './tree/display_raw.mjs';
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

registerChunk('mkBS', {}, async (/** @type {mkBSChunk} */ chunk, /** @type {mkBSState} */ state, warnings) => {
  try {
    const inflated = await inflate(chunk.data);
    chunk.raw = tokenise(inflated, warnings);
    state.mkbs = chunk;
  } catch (e) {
    warnings.push(`mkBS compressed data is unreadable ${e}`);
  }
}, (state, warnings) => {
  if (state.mkbs?.raw) {
    const baseID = 'mkbs-raw';
    const raw = state.mkbs.raw;
    const root = parse(null, raw, { mkbts: state.mkbts, warnings }, baseID);
    state.mkbs.root = root;
    state.mkbs.toString = () => root.toString();
    state.mkbs.display = (summary, content) => {
      const parsed = document.createElement('div');
      parsed.className = 'parsed';
      root.display(parsed);
      content.append(parsed);

      displayRawStructure(content, raw, baseID, 'Raw node hierarchy');
    };
  }
});
