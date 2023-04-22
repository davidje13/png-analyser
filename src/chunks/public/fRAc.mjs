import { registerChunk } from '../registry.mjs';

registerChunk('fRAc', {}, (chunk, state, warnings) => {
  // fRAc is part of the standard but not defined
  warnings.push('fRAc chunk');
});
