import { getLatin1 } from '../../../../../data/utils.mjs';
import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').Chunk & {
 *   version?: string,
 *   value?: number,
 * }} tpNGChunk
 */

registerChunk('tpNG', { max: 1 }, (/** @type {tpNGChunk} */ chunk, state, warnings) => {
  if (chunk.data.byteLength !== 8) {
    warnings.push(`tpNG chunk length ${chunk.data.byteLength} is not 8`);
  }
  chunk.version = getLatin1(chunk.data, 0, 4, warnings);
  if (chunk.version !== 'GLD3') {
    warnings.push(`unrecognised tpNG magic value ${chunk.version}`);
  }
  chunk.value = chunk.data.getUint32(4);
});
