import { inflate } from '../../../../../data/inflate.mjs';
import { registerChunk } from '../../registry.mjs';
import { displayRawStructure } from './tree/display_raw.mjs';
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

registerChunk('mkTS', {}, async (/** @type {mkTSChunk} */ chunk, /** @type {mkTSState} */ state, warnings) => {
  try {
    const inflated = await inflate(chunk.data);
    chunk.raw = tokenise(inflated, warnings);
    state.mkts = chunk;
  } catch (e) {
    warnings.push(`mkTS compressed data is unreadable ${e}`);
  }
}, (state, warnings) => {
  if (state.mkts?.raw) {
    const baseID = 'mkts-raw';
    const raw = state.mkts.raw;
    const root = parse(null, raw, { mkbts: state.mkbts, warnings }, baseID);
    state.mkts.root = root;
    state.mkts.toString = () => root.toString();
    state.mkts.display = (summary, content) => {
      const parsed = document.createElement('div');
      parsed.className = 'parsed';
      root.display(parsed);
      content.append(parsed);

      displayRawStructure(content, raw, baseID, 'Raw node hierarchy');
    };
  }
});
