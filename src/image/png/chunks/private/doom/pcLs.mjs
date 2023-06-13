import { registerChunk } from '../../registry.mjs';

registerChunk('pcLs', { notBefore: ['IDAT'] }, (chunk, state, warnings) => {
  // TODO
});
