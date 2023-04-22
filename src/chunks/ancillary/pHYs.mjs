import { registerChunk } from '../registry.mjs';

const UNITS = ['-', 'per meter'];

registerChunk('pHYs', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  if (chunk.data.length !== 9) {
    warnings.push(`pHYs length ${chunk.data.length} is not 9`);
    return;
  }
  state.phys = chunk;
  chunk.ppx = chunk.data.readUInt32BE(0);
  chunk.ppy = chunk.data.readUInt32BE(4);
  chunk.aspect = chunk.ppy / chunk.ppx; // = width/height (ppx/ppy are reciprocal)
  const unit = chunk.data[8];
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
});
