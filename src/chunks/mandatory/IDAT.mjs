import { inflate, inflateRaw } from '../../deflate.mjs';
import { concat } from '../../data_utils.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & import('../apng/shared_state.mjs').apngState & {
 *   idat?: ArrayBufferView,
 *   idats?: ArrayBufferView[],
 *   isApple?: boolean,
 * }} IDATState
 */

registerChunk('IDAT', { min: 1, sequential: true }, (chunk, /** @type {IDATState} */ state, warnings) => {
  state.idats ||= [];
  state.idats.push(chunk.data);

  if (state.apngCurrentFrame?.state === 1 || state.apngCurrentFrame?.state === 2) {
    state.apngCurrentFrame.data.push(chunk.data);
    state.apngCurrentFrame.state = 2;
  } else if (state.apngCurrentFrame?.state === 3) {
    warnings.push(`fdAT and IDAT chunks for frame ${state.apngCurrentFrame.num}`);
  }
}, (state, warnings) => {
  if (!state.idats) {
    return;
  }
  try {
    if (state.isApple) {
      state.idat = inflateRaw(concat(state.idats));
    } else {
      state.idat = inflate(concat(state.idats));
    }
  } catch (e) {
    warnings.push(`idat compressed data is unreadable ${e}`);
    state.idat = new Uint8Array(0);
  }
});
