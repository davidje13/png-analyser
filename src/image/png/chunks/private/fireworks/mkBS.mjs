import { inflate } from '../../../../../data/inflate.mjs';
import { el } from '../../../../../display/pretty.mjs';
import { registerChunk } from '../../registry.mjs';
import { displayRawStructure, populatePaths } from './display-raw.mjs';
import { parseRoot } from './parser.mjs';
import { renderAllPages } from './render.mjs';
import { tokenise } from './tokeniser.mjs';

/**
 * @typedef {import('./mkBT.mjs').mkBTState & {
 *   mkbs?: mkBSChunk,
 * }} mkBSState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   raw?: import('./tokeniser.mjs').NodeToken,
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
    const raw = state.mkbs.raw;
    populatePaths(raw, 'mkbs-raw');
    state.mkbs.toString = () => '';
    state.mkbs.display = (summary, content, filename) => {
      content.append(el('div', { class: 'parsed' }, [
        renderAllPages(
          parseRoot(raw, state.mkbts ?? new Map()),
          filename.replace(/\.[^.]+$/, '') + '-mkBS',
        )
      ]));

      displayRawStructure(content, raw, 'Raw node hierarchy');
    };
    state.mkbs.defaultCollapse = true;
  }
});
