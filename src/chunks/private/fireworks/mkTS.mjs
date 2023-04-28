import { inflate } from '../../../deflate.mjs';
import { registerChunk } from '../../registry.mjs';
import { readNested, simplifyNested } from './structure.mjs';

/**
 * @typedef {import('../../registry.mjs').Chunk & {
*   root?: import('./structure.mjs').Value,
* }} mkTSChunk
*/

registerChunk('mkTS', {}, (/** @type {mkTSChunk} */ chunk, state, warnings) => {
  try {
    const inflated = inflate(chunk.data);
    chunk.root = simplifyNested(readNested(inflated, warnings)).value;
    // TODO
  } catch (e) {
    warnings.push(`mkTS compressed data is unreadable ${e}`);
  }
});
