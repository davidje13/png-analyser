import { inflate } from '../../../../../data/inflate.mjs';
import { el } from '../../../../../display/pretty.mjs';
import { registerChunk } from '../../registry.mjs';
import { displayRawStructure, populatePaths } from './render/display-raw.mjs';
import { parseRoot } from './parser.mjs';
import { renderAllPages } from './render/document.mjs';
import { tokenise } from './tokeniser.mjs';

/**
 * @typedef {import('./mkBT.mjs').mkBTState & {
 *   mkts?: mkTSChunk,
 * }} mkTSState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   raw?: import('./tokeniser.mjs').NodeToken,
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
    const raw = state.mkts.raw;
    populatePaths(raw, 'mkts-raw');
    state.mkts.toString = () => '';
    state.mkts.display = (summary, content, filename) => {
      content.append(el('div', { class: 'parsed' }, [
        renderAllPages(
          parseRoot(raw, state.mkbts ?? new Map()),
          filename.replace(/\.[^.]+$/, ''),
        )
      ]));
      displayRawStructure(content, raw, 'Raw node hierarchy');
    };
  }
});
