import { inflateSync, inflateRawSync } from 'node:zlib';
import { registerChunk } from '../registry.mjs';

registerChunk('IDAT', { min: 1, sequential: true }, (chunk, state, warnings) => {
  state.idats.push(chunk.data);

  if (state.apngState === 1 || state.apngState === 2) {
    state.apngCurrentFrame.data.push(chunk.data);
    state.apngState = 2;
  } else if (state.apngState === 3) {
    warnings.push(`fdAT and IDAT chunks for frame ${state.apngCurrentFrame.num}`);
  }
}, (state, warnings) => {
  try {
    if (state.isApple) {
      state.idat = inflateRawSync(Buffer.concat(state.idats));
    } else {
      state.idat = inflateSync(Buffer.concat(state.idats));
    }
  } catch (e) {
    warnings.push(`idat compressed data is unreadable ${e}`);
    state.idat = Buffer.alloc(0);
  }
});
