import { registerChunk } from '../registry.mjs';

const UNITS = ['pixel', 'micrometer'];

registerChunk('oFFs', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  if (chunk.data.length !== 9) {
    warnings.push(`oFFs length ${chunk.data.length} is not 9`);
    return;
  }
  state.offs = chunk;
  chunk.ppx = chunk.data.readUInt32BE(0);
  chunk.ppy = chunk.data.readUInt32BE(4);
  const unit = chunk.data[8];
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
});
