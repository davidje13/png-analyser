import { registerChunk } from '../registry.mjs';

registerChunk('PLTE', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  state.plte = chunk;
  if (state.ihdr && !state.ihdr.rgb && !state.ihdr.indexed) {
    warnings.push(`palette specified for greyscale colour type ${state.ihdr.colourType}`);
  }
  chunk.paletteSize = (chunk.data.length / 3)|0;
  if (chunk.data.length % 3 !== 0) {
    warnings.push(`palette length ${chunk.data.length} is not a multiple of 3`);
  }
  if (chunk.paletteSize > 256) {
    warnings.push(`palette size ${chunk.paletteSize} exceeds 256`);
  }
});
