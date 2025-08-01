import { findIndex, getLatin1, subViewFrom } from '../../../../data/utils.mjs';
import { inflate } from '../../../../data/inflate.mjs';
import { registerChunk } from '../registry.mjs';
import { textDisplay, textWrite } from './shared_text.mjs';

registerChunk('zTXt', {}, async (
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
  chunk.keyword = getLatin1(chunk.data, 0, sep, null);
  if (sep < chunk.data.byteLength - 1) {
    chunk.compressionMethod = chunk.data.getUint8(sep + 1);
    if (chunk.compressionMethod !== 0) {
      warnings.push(`non-standard text compression method ${chunk.compressionMethod}`);
    }
    try {
      chunk.value = getLatin1(await inflate(subViewFrom(chunk.data, sep + 2)));
    } catch (e) {
      warnings.push(`zTXt compressed data is unreadable ${e}`);
      chunk.value = '';
    }
  }

  chunk.toString = () => textWrite(chunk);
  chunk.display = (summary, content) => textDisplay(chunk, summary, content);
});
