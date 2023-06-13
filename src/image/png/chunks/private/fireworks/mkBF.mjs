import { subView } from '../../../../../data/utils.mjs';
import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').Chunk & {
 *   testData?: ArrayBufferView,
 * }} mkBFChunk
 */

registerChunk('mkBF', {}, (/** @type {mkBFChunk} */ chunk, state, warnings) => {
  const marker = chunk.data.getUint32(0);
  //if (chunk.data.length !== 72) {
  //  warnings.push(`mkBF length ${chunk.data.length} is not 72`);
  //}
  if (marker !== 0xFADECAFE) {
    warnings.push(`mkBF marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xFADECAFE (unknown format)`);
    return;
  }
  chunk.testData = subView(chunk.data, 4); // debug
  // TODO: always seems to be 00000004 then all 0s ?
  // maybe relates to pages or animations?
});
