import { registerChunk } from '../registry.mjs';

registerChunk('IEND', { min: 1, max: 1 }, (chunk, state, warnings) => {
  if (chunk.data.byteLength !== 0) {
    warnings.push(`IEND length ${chunk.data.byteLength} is not 0`);
  }
});
