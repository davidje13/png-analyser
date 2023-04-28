import { findIndex, getLatin1 } from '../../data_utils.mjs';
import { registerChunk } from '../registry.mjs';
import { textDisplay, textWrite } from './shared_text.mjs';

registerChunk('tEXt', {}, (
  /** @type {import('./shared_text.mjs').textChunk} */ chunk,
  /** @type {import('./shared_text.mjs').textState} */ state,
  warnings,
) => {
  state.texts ||= [];
  state.texts.push(chunk);
  let sep = findIndex(chunk.data, 0x00);
  if (sep === -1) {
    warnings.push('tEXt does not contain null separator');
    sep = chunk.data.byteLength;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid tEXt keyword length ${sep}`);
  }
  chunk.isCompressed = false;
  chunk.compressionMethod = 0;
  chunk.languageTag = '';
  chunk.translatedKeyword = '';
  chunk.keyword = getLatin1(chunk.data, 0, sep);
  chunk.value = getLatin1(chunk.data, sep + 1);

  chunk.write = () => textWrite(chunk);
  chunk.display = (summary, content) => textDisplay(chunk, summary, content);
});
