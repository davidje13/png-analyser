import { inflateSync } from 'node:zlib';
import { registerChunk } from '../registry.mjs';

registerChunk('iTXt', {}, (chunk, state, warnings) => {
  state.texts ||= [];
  state.texts.push(chunk);
  let sep = chunk.data.indexOf(0);
  if (sep === -1) {
    warnings.push('iTXt does not contain null separator for keyword');
    sep = chunk.data.length;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid iTXt keyword length ${sep}`);
  }
  chunk.keyword = chunk.data.subarray(0, sep).toString('latin1');
  if (sep >= chunk.data.length - 1) {
    return;
  }
  chunk.isCompressed = chunk.data[sep + 1];
  chunk.compressionMethod = chunk.data[sep + 2];
  if (chunk.compressionMethod !== 0) {
    warnings.push(`non-standard text compression method ${chunk.compressionMethod}`);
  }
  let sep2 = chunk.data.indexOf(0, sep + 3);
  if (sep2 === -1) {
    warnings.push('iTXt does not contain null separator for language tag');
    sep2 = chunk.data.length;
  }
  chunk.languageTag = chunk.data.subarray(sep + 3, sep2).toString('latin1');
  let sep3 = chunk.data.indexOf(0, sep2 + 1);
  if (sep3 === -1) {
    warnings.push('iTXt does not contain null separator for translated keyword');
    sep3 = chunk.data.length;
  }
  chunk.translatedKeyword = chunk.data.subarray(sep2 + 1, sep3).toString('utf8');
  const rawValue = chunk.data.subarray(sep3 + 1);
  let uncompressedValue = rawValue;
  if (chunk.isCompressed) {
    try {
      uncompressedValue = inflateSync(rawValue);
    } catch (e) {
      warnings.push(`iTXt compressed data is unreadable ${e}`);
      uncompressedValue = Buffer.alloc(0);
    }
  }
  chunk.value = uncompressedValue.toString('utf8');
});
