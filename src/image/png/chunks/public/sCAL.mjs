import { findIndex, getLatin1 } from '../../../../data/utils.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   scal?: sCALChunk,
 * }} sCALState
 * @typedef {import('../registry.mjs').Chunk & {
 *   width?: number,
 *   height?: number,
 *   unit?: string,
 * }} sCALChunk
 */

const UNITS = ['meter', 'radian'];

registerChunk('sCAL', { max: 1, notAfter: ['IDAT'] }, (/** @type {sCALChunk} */ chunk, /** @type {sCALState} */ state, warnings) => {
  if (chunk.data.byteLength < 4) {
    warnings.push(`sCAL length ${chunk.data.byteLength} is less than 4`);
    return;
  }
  state.scal = chunk;
  let p = findIndex(chunk.data, 0x00, 1);
  if (p === -1) {
    p = chunk.data.byteLength;
  }
  const unit = chunk.data.getUint8(0);
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
  chunk.width = Number.parseFloat(getLatin1(chunk.data, 1, p));
  chunk.height = Number.parseFloat(getLatin1(chunk.data, p + 1));
  if (chunk.width <= 0) {
    warnings.push(`invalid physical scale width ${chunk.width}`);
  }
  if (chunk.height <= 0) {
    warnings.push(`invalid physical scale height ${chunk.height}`);
  }
});
