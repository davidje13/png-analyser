import { findIndex, getLatin1, subView } from '../../data_utils.mjs';
import { inflate } from '../../deflate.mjs';
import { registerChunk } from '../registry.mjs';

registerChunk('zTXt', {}, (
  /** @type {import('./shared_text.mjs').textChunk} */ chunk,
  /** @type {import('./shared_text.mjs').textState} */ state,
  warnings,
) => {
  state.texts ||= [];
  state.texts.push(chunk);
  let sep = findIndex(chunk.data, 0x00);
  if (sep === -1) {
    warnings.push('zTXt does not contain null separator');
    sep = chunk.data.byteLength;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid zTXt keyword length ${sep}`);
  }
  chunk.isCompressed = true;
  chunk.languageTag = '';
  chunk.translatedKeyword = '';
  chunk.keyword = getLatin1(chunk.data, 0, sep);
  if (sep < chunk.data.byteLength - 1) {
    chunk.compressionMethod = chunk.data.getUint8(sep + 1);
    if (chunk.compressionMethod !== 0) {
      warnings.push(`non-standard text compression method ${chunk.compressionMethod}`);
    }
    try {
      chunk.value = getLatin1(inflate(subView(chunk.data, sep + 2)));
    } catch (e) {
      warnings.push(`zTXt compressed data is unreadable ${e}`);
      chunk.value = '';
    }
  }
});
