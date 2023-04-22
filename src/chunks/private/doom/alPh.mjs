import { registerChunk } from '../../registry.mjs';

registerChunk('alPh', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  if (chunk.data.length !== 0) {
    warnings.push(`alPh chunk has non-zero length ${chunk.data.length}`);
  }
  state.isAlpha = true;
});
