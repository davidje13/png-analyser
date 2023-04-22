import { registerChunk } from '../registry.mjs';

registerChunk('cHRM', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (chunk, state, warnings) => {
  state.chrm = chunk;
  if (chunk.data.length !== 32) {
    warnings.push(`cHRM length ${chunk.data.length} is not 32`);
  }
  chunk.whiteX = chunk.data.readUInt32BE(0);
  chunk.whiteY = chunk.data.readUInt32BE(4);
  chunk.redX = chunk.data.readUInt32BE(8);
  chunk.redY = chunk.data.readUInt32BE(12);
  chunk.greenX = chunk.data.readUInt32BE(16);
  chunk.greenY = chunk.data.readUInt32BE(20);
  chunk.blueX = chunk.data.readUInt32BE(24);
  chunk.blueY = chunk.data.readUInt32BE(28);
});
