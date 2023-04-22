import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';

registerChunk('mkTS', {}, (chunk, state, warnings) => {
  try {
    const inflated = inflateSync(chunk.data);
    chunk.testData = inflated.subarray(0, 40); // debug
    // TODO
  } catch (e) {
    warnings.push(`mkTS compressed data is unreadable ${e}`);
  }
});
