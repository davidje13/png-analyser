import { registerChunk } from '../registry.mjs';

registerChunk('gAMA', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (chunk, state, warnings) => {
  if (chunk.data.length !== 4) {
    warnings.push(`gAMA length ${chunk.data.length} is not 4`);
    if (chunk.data.length < 4) {
      return;
    }
  }
  chunk.gama = chunk.data.readUInt32BE(0);
  state.gama = chunk;
});
