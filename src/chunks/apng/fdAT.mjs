import { subView } from '../../data_utils.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('./shared_state.mjs').apngState & {
 * }} fdATState
 * @typedef {import('../registry.mjs').Chunk & {
 *   sequenceNumber?: number;
 * }} fdATChunk
 */

registerChunk('fdAT', { requires: ['acTL'] }, (/** @type {fdATChunk} */ chunk, /** @type {fdATState} */ state, warnings) => {
  chunk.sequenceNumber = chunk.data.getUint32(0);
  if (chunk.sequenceNumber !== (state.nextSequenceNumber ?? 0)) {
    warnings.push(`sequence mismatch for fdAT chunk ${chunk.sequenceNumber}`);
  }
  state.nextSequenceNumber = chunk.sequenceNumber + 1;

  if (state.apngCurrentFrame?.state === 1 || state.apngCurrentFrame?.state === 3) {
    state.apngCurrentFrame.state = 3;
    state.apngCurrentFrame.data.push(subView(chunk.data, 4));
  } else if (state.apngCurrentFrame?.state === 2) {
    warnings.push(`IDAT and fdAT chunks for frame ${state.apngCurrentFrame.num}`);
  } else {
    warnings.push('fdAT chunk without fcTL');
  }
});
