import { registerChunk } from '../registry.mjs';

registerChunk('acTL', { max: 1, notAfter: ['IDAT'], requires: ['fcTL'] }, (chunk, state, warnings) => {
  state.actl = chunk;
  if (chunk.data.length !== 8) {
    warnings.push(`acTL length ${chunk.data.length} is not 8`);
  }
  chunk.numFrames = chunk.data.readUInt32BE(0);
  chunk.numPlays = chunk.data.readUInt32BE(4);
  if (chunk.numFrames === 0) {
    warnings.push('acTL frame count is 0');
  }
});
