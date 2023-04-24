import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';
import { readNested, simplifyNested } from './structure.mjs';

registerChunk('mkBS', {}, (chunk, state, warnings) => {
  try {
    const inflated = inflateSync(chunk.data);
    chunk.root = simplifyNested(readNested(inflated, warnings));
    // TODO
  } catch (e) {
    warnings.push(`mkBS compressed data is unreadable ${e}`);
  }
});
