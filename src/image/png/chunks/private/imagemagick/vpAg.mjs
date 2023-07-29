import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   vpag?: vpAgChunk,
 * }} vpAgState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   width?: number,
 *   height?: number,
 *   unit?: string,
 * }} vpAgChunk
 */

// Virtual Page information
// https://github.com/ImageMagick/png/blob/801dedd0fb7bec71f09aac6d3212757280658d93/pngtest.c#L737

const UNITS = ['pixel', 'micrometer'];

registerChunk('vpAg', { max: 1 }, (/** @type {vpAgChunk} */ chunk, /** @type {vpAgState} */ state, warnings) => {
  if (chunk.data.byteLength !== 9) {
    warnings.push(`vpAg chunk length ${chunk.data.byteLength} is not 9`);
  }

  chunk.width = chunk.data.getUint32(0);
  chunk.height = chunk.data.getUint32(4);
  const unit = chunk.data.getUint8(8);
  chunk.unit = UNITS[unit];
  if (!chunk.unit) {
    warnings.push(`non-standard unit ${unit}`);
  }
});
