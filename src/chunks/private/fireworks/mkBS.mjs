import { inflate } from '../../../deflate.mjs';
import { registerChunk } from '../../registry.mjs';
import { readNested, simplifyNested } from './structure.mjs';

/**
 * @typedef {import('../../registry.mjs').Chunk & {
 *   root?: import('./structure.mjs').Value,
 * }} mkBSChunk
 */

registerChunk('mkBS', {}, (/** @type {mkBSChunk} */ chunk, state, warnings) => {
  try {
    const inflated = inflate(chunk.data);
    chunk.root = simplifyNested(readNested(inflated, warnings)).value;
    // TODO
  } catch (e) {
    warnings.push(`mkBS compressed data is unreadable ${e}`);
  }
});
