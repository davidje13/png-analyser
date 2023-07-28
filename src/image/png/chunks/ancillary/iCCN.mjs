import { registerChunk } from '../registry.mjs';

// https://github.com/w3c/PNG-spec/issues/95

registerChunk('iCCN', { max: 1, notAfter: ['sRGB', 'PLTE', 'IDAT'], notBefore: ['sRGB'] }, (chunk, state, warnings) => {
  // iCCN was never adopted
  warnings.push('iCCN chunk');
});
