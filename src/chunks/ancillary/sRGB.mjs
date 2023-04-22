import { registerChunk } from '../registry.mjs';

registerChunk('sRGB', { max: 1, notAfter: ['iCCP', 'PLTE', 'IDAT'], notBefore: ['iCCP'] }, (chunk, state, warnings) => {
  if (chunk.data.length !== 1) {
    warnings.push(`sRGB length ${chunk.data.length} is not 1`);
  }
  state.srgb = chunk;
  chunk.renderingIntent = chunk.data[0];
});
