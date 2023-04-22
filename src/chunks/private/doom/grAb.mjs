import { registerChunk } from '../../registry.mjs';

registerChunk('grAb', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  if (chunk.data.length !== 8) {
    warnings.push(`grAb chunk length ${chunk.data.length} is not 8`);
    if (chunk.data.length < 8) {
      return;
    }
  }
  state.grab = chunk;
  chunk.xOffset = chunk.data.readInt32BE(0);
  chunk.yOffset = chunk.data.readInt32BE(4);
});
