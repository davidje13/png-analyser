import { registerChunk } from '../registry.mjs';

registerChunk('sPLT', { notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  const sep = chunk.data.indexOf(0);
  if (sep === -1) {
    warnings.push('sPLT does not contain null separator');
    return;
  }
  state.splt ||= [];
  chunk.name = chunk.data.subarray(0, sep).toString('latin1');
  for (const existing of state.splt) {
    if (existing.name === chunk.name) {
      warnings.push(`duplicate sPLT chunks with name ${chunk.name}`);
    }
  }
  chunk.sampleDepth = chunk.data[sep + 1];
  if (chunk.sampleDepth !== 8 && chunk.sampleDepth !== 16) {
    warnings.push(`non-standard sPLT sample depth ${chunk.sampleDepth}`);
  }
  chunk.sampleCount = (chunk.data.length - sep - 2) / (chunk.sampleDepth === 16 ? 10 : 6);
  if (chunk.sampleCount|0 !== chunk.sampleCount) {
    warnings.push('sPLT size is not a whole multiple of the item size');
    chunk.sampleCount = chunk.sampleCount|0;
  }
  chunk.palette = [];
  if (chunk.sampleDepth === 16) {
    for (let p = sep + 2; p + 10 <= chunk.data.length; p += 10) {
      chunk.palette.push({
        red: chunk.data.readUInt16BE(p),
        green: chunk.data.readUInt16BE(p + 2),
        blue: chunk.data.readUInt16BE(p + 4),
        alpha: chunk.data.readUInt16BE(p + 6),
        frequency: chunk.data.readUInt16BE(p + 8),
      });
    }
  } else {
    for (let p = sep + 2; p + 6 <= chunk.data.length; p += 6) {
      chunk.palette.push({
        red: chunk.data[p],
        green: chunk.data[p + 1],
        blue: chunk.data[p + 2],
        alpha: chunk.data[p + 3],
        frequency: chunk.data.readUInt16BE(p + 4),
      });
    }
  }
  state.splt.push(chunk);
});
