import { registerChunk } from '../../registry.mjs';

registerChunk('mkBF', {}, (chunk, state, warnings) => {
  const marker = chunk.data.readUInt32BE(0);
  if (marker !== 0xFADECAFE) {
    warnings.push(`mkBF marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xFADECAFE (unknown format)`);
    return;
  }
  chunk.testData = chunk.data.subarray(4); // debug
  // TODO
});
