import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';

registerChunk('mkBS', {}, (chunk, state, warnings) => {
  try {
    const inflated = inflateSync(chunk.data);
    chunk.testData = inflated; // debug
    // TODO
  } catch (e) {
    warnings.push(`mkBS compressed data is unreadable ${e}`);
  }
});
