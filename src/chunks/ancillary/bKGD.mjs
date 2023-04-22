import { registerChunk } from '../registry.mjs';

registerChunk('bKGD', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'] }, (chunk, state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse tRNS data unambiguously without IHDR');
    return;
  }
  state.bkgd = chunk;
  if (state.ihdr.indexed) {
    if (chunk.data.length !== 1) {
      warnings.push(`bKGD length ${chunk.data.length} is not 1`);
    }
    chunk.backgroundIndex = chunk.data[0];
  } else if (state.ihdr.rgb) {
    chunk.backgroundR = chunk.data.readUInt16BE(0);
    chunk.backgroundG = chunk.data.readUInt16BE(2);
    chunk.backgroundB = chunk.data.readUInt16BE(4);
  } else {
    chunk.backgroundG = chunk.data.readUInt16BE(0);
  }
});
