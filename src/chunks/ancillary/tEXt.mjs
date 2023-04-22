import { registerChunk } from '../registry.mjs';

registerChunk('tEXt', {}, (chunk, state, warnings) => {
  state.texts ||= [];
  state.texts.push(chunk);
  let sep = chunk.data.indexOf(0);
  if (sep === -1) {
    warnings.push('tEXt does not contain null separator');
    sep = chunk.data.length;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid tEXt keyword length ${sep}`);
  }
  chunk.keyword = chunk.data.subarray(0, sep).toString('latin1');
  chunk.value = chunk.data.subarray(sep + 1).toString('latin1');
});
