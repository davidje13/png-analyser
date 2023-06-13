import { registerChunk } from '../registry.mjs';

registerChunk('pCAL', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  // TODO
});
