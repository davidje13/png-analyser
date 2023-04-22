import { registerChunk } from '../registry.mjs';

registerChunk('hIST', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'], requires: ['PLTE'] }, (chunk, state, warnings) => {
  state.hist = chunk;
  if (chunk.data.length & 1) {
    warnings.push(`invalid hIST length ${chunk.data.length} (not a multiple of 2)`);
  } else if (state.plte && chunk.data.length !== state.plte.paletteSize * 2) {
    warnings.push(`hIST size ${chunk.data.length / 2} does not match PLTE size`);
  }
  chunk.frequencies = [];
  for (let i = 0; i + 1 < chunk.data.length; i += 2) {
    chunk.frequencies.push(chunk.data.readUInt16BE(i));
  }
});
