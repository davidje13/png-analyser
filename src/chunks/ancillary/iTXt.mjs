import { findIndex, getLatin1, getUTF8, subView } from '../../data_utils.mjs';
import { inflate } from '../../deflate.mjs';
import { registerChunk } from '../registry.mjs';

registerChunk('iTXt', {}, (
  /** @type {import('./shared_text.mjs').textChunk} */ chunk,
  /** @type {import('./shared_text.mjs').textState} */ state,
  warnings,
) => {
  state.texts ||= [];
  state.texts.push(chunk);
  let sep = findIndex(chunk.data, 0x00);
  if (sep === -1) {
    warnings.push('iTXt does not contain null separator for keyword');
    sep = chunk.data.byteLength;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid iTXt keyword length ${sep}`);
  }
  chunk.keyword = getLatin1(chunk.data, 0, sep);
  if (sep >= chunk.data.byteLength - 1) {
    return;
  }
  chunk.isCompressed = Boolean(chunk.data.getUint8(sep + 1));
  chunk.compressionMethod = chunk.data.getUint8(sep + 2);
  if (chunk.compressionMethod !== 0) {
    warnings.push(`non-standard text compression method ${chunk.compressionMethod}`);
  }
  let sep2 = findIndex(chunk.data, 0x00, sep + 3);
  if (sep2 === -1) {
    warnings.push('iTXt does not contain null separator for language tag');
    sep2 = chunk.data.byteLength;
  }
  chunk.languageTag = getLatin1(chunk.data, sep + 3, sep2);
  let sep3 = findIndex(chunk.data, 0x00, sep2 + 1);
  if (sep3 === -1) {
    warnings.push('iTXt does not contain null separator for translated keyword');
    sep3 = chunk.data.byteLength;
  }
  chunk.translatedKeyword = getUTF8(chunk.data, sep2 + 1, sep3);
  const rawValue = subView(chunk.data, sep3 + 1);
  let uncompressedValue = rawValue;
  if (chunk.isCompressed) {
    try {
      uncompressedValue = inflate(rawValue);
    } catch (e) {
      warnings.push(`iTXt compressed data is unreadable ${e}`);
      uncompressedValue = new DataView(rawValue.buffer, 0, 0);
    }
  }
  chunk.value = getUTF8(uncompressedValue);
});
