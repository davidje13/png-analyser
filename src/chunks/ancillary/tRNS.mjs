import { registerChunk } from '../registry.mjs';

registerChunk('tRNS', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'] }, (chunk, state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse tRNS data unambiguously without IHDR');
    return;
  }
  if (state.ihdr.alpha) {
    warnings.push('tRNS chunk present in image with built-in alpha channel');
    return;
  }
  state.trns = chunk;
  if (state.ihdr.indexed) {
    if (chunk.data.length > 256) {
      warnings.push(`transparency palette size ${chunk.data.length} exceeds 256`);
    }
    chunk.indexedAlpha = chunk.data;
  } else if (state.ihdr.rgb) {
    chunk.sampleR = chunk.data.readUInt16BE(0);
    chunk.sampleG = chunk.data.readUInt16BE(2);
    chunk.sampleB = chunk.data.readUInt16BE(4);
  } else {
    chunk.sampleG = chunk.data.readUInt16BE(0);
  }
});
