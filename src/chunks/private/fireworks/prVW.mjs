import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';

registerChunk('prVW', { max: 1 }, (chunk, state, warnings) => {
  try {
    const inflated = inflateSync(chunk.data);
    const marker = inflated.readUInt32BE(0);
    if (marker !== 0xCAFEBEEF) {
      warnings.push(`prVW marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xCAFEBEEF (unknown format)`);
      return;
    }
    state.prvw = chunk;
    chunk.testData = inflated.subarray(4, 100); // debug
    // TODO
  } catch (e) {
    warnings.push(`prVW compressed data is unreadable ${e}`);
  }
});
