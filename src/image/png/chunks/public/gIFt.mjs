import { registerChunk } from '../registry.mjs';

registerChunk('gIFt', {}, (chunk, state, warnings) => {
  warnings.push('deprecated gIFt chunk');
  // TODO
});
