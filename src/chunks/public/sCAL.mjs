import { registerChunk } from '../registry.mjs';

const UNITS = ['meter', 'radian'];

registerChunk('sCAL', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  if (chunk.data.length < 4) {
    warnings.push(`sCAL length ${chunk.data.length} is less than 4`);
    return;
  }
  let p = chunk.data.indexOf(0, 1);
  if (p === -1) {
    p = chunk.data.length;
  }
  const unit = chunk.data[0];
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
  chunk.width = Number.parseFloat(chunk.data.subarray(1, p).toString('latin1'));
  chunk.height = Number.parseFloat(chunk.data.subarray(p + 1).toString('latin1'));
  if (chunk.width <= 0) {
    warnings.push(`invalid physical scale width ${chunk.width}`);
  }
  if (chunk.height <= 0) {
    warnings.push(`invalid physical scale height ${chunk.height}`);
  }
});
