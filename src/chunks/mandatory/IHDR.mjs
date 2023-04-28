import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: IHDRChunk,
 * }} IHDRState
 * @typedef {import('../registry.mjs').Chunk & {
 *   width?: number,
 *   height?: number,
 *   bitDepth?: number,
 *   colourType?: number,
 *   compressionMethod?: number,
 *   filterMethod?: number,
 *   interlaceMethod?: number,
 *   indexed?: boolean,
 *   rgb?: boolean,
 *   alpha?: boolean,
 * }} IHDRChunk
 */

registerChunk('IHDR', { min: 1, max: 1 }, (/** @type {IHDRChunk} */ chunk, /** @type {IHDRState} */ state, warnings) => {
  state.ihdr = chunk;
  if (chunk.data.byteLength !== 13) {
    warnings.push('IHDR length should be 13');
  }

  chunk.width = chunk.data.getUint32(0);
  chunk.height = chunk.data.getUint32(4);
  chunk.bitDepth = chunk.data.getUint8(8);
  chunk.colourType = chunk.data.getUint8(9);
  chunk.compressionMethod = chunk.data.getUint8(10);
  chunk.filterMethod = chunk.data.getUint8(11);
  chunk.interlaceMethod = chunk.data.getUint8(12);

  chunk.indexed = Boolean(chunk.colourType & 1);
  chunk.rgb = Boolean(chunk.colourType & 2);
  chunk.alpha = Boolean(chunk.colourType & 4);

  if (chunk.width === 0) {
    warnings.push('image width is 0');
  } else if (chunk.width > 0x7FFFFFFF) {
    warnings.push(`image width ${chunk.width} exceeds limit`);
  }
  if (chunk.height === 0) {
    warnings.push('image height is 0');
  } else if (chunk.height > 0x7FFFFFFF) {
    warnings.push(`image height ${chunk.height} exceeds limit`);
  }
  if (chunk.compressionMethod !== 0) {
    warnings.push(`non-standard compression method ${chunk.compressionMethod}`);
  }
  if (chunk.filterMethod !== 0) {
    warnings.push(`non-standard filter method ${chunk.filterMethod}`);
  }
  if (chunk.interlaceMethod !== 0 && chunk.interlaceMethod !== 1) {
    warnings.push(`non-standard interlace method ${chunk.interlaceMethod}`);
  }
  const mode = PERMITTED_MODES.find((m) => m.col === chunk.colourType);
  if (!mode) {
    warnings.push(`non-standard colour type ${chunk.colourType}`);
    if (chunk.indexed && chunk.bitDepth > 8) {
      warnings.push(`invalid bit depth ${chunk.bitDepth} for indexed colour image`);
    }
  } else if (!mode.bits.includes(chunk.bitDepth)) {
    warnings.push(`non-standard bit depth ${chunk.bitDepth} for colour type ${chunk.colourType} (can use ${mode.bits.join(' / ')})`);
  }
});

const PERMITTED_MODES = [
  { col: 0, bits: [1, 2, 4, 8, 16] },
  { col: 2, bits: [8, 16] },
  { col: 3, bits: [1, 2, 4, 8] },
  { col: 4, bits: [8, 16] },
  { col: 6, bits: [8, 16] },
];
