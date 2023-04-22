import { registerChunk } from '../registry.mjs';

registerChunk('iCCP', { max: 1, notAfter: ['sRGB', 'PLTE', 'IDAT'], notBefore: ['sRGB'] }, (chunk, state, warnings) => {
  // TODO
});
