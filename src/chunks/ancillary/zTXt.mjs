import { inflateSync } from 'node:zlib';
import { registerChunk } from '../registry.mjs';

registerChunk('zTXt', {}, (chunk, state, warnings) => {
  state.texts ||= [];
  state.texts.push(chunk);
  let sep = chunk.data.indexOf(0);
  if (sep === -1) {
    warnings.push('zTXt does not contain null separator');
    sep = chunk.data.length;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid zTXt keyword length ${sep}`);
  }
  chunk.keyword = chunk.data.subarray(0, sep).toString('latin1');
  if (sep < chunk.data.length - 1) {
    chunk.compressionMethod = chunk.data[sep + 1];
    if (chunk.compressionMethod !== 0) {
      warnings.push(`non-standard text compression method ${chunk.compressionMethod}`);
    }
    try {
      chunk.value = inflateSync(chunk.data.subarray(sep + 2)).toString('latin1');
    } catch (e) {
      warnings.push(`zTXt compressed data is unreadable ${e}`);
      chunk.value = '';
    }
  }
});
