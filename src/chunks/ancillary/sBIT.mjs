import { registerChunk } from '../registry.mjs';

registerChunk('sBIT', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (chunk, state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse sBIT data unambiguously without IHDR');
    return;
  }
  const channels = (state.ihdr.rgb ? 3 : 1) + (state.ihdr.alpha ? 1 : 0);
  if (chunk.data.length !== channels) {
    warnings.push(`significant bits size ${chunk.data.length} does not match image channels ${channels}`);
    return;
  }
  state.sbit = chunk;
  chunk.originalBits = [...chunk.data];
});
