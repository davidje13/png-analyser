import { findIndex, getLatin1 } from '../../../../data/utils.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {{
 *   red: number,
 *   green: number,
 *   blue: number,
 *   alpha: number,
 *   frequency: number,
 * }} PaletteEntry
 * @typedef {import('../registry.mjs').State & {
 *   splt?: sPLTChunk[],
 * }} sPLTState
 * @typedef {import('../registry.mjs').Chunk & {
 *   sampleDepth?: number,
 *   sampleCount?: number,
 *   palette?: PaletteEntry[],
 * }} sPLTChunk
 */

registerChunk('sPLT', { notAfter: ['IDAT'] }, (/** @type {sPLTChunk} */ chunk, /** @type {sPLTState} */ state, warnings) => {
  const sep = findIndex(chunk.data, 0x00);
  if (sep === -1) {
    warnings.push('sPLT does not contain null separator');
    return;
  }
  state.splt ||= [];
  chunk.name = getLatin1(chunk.data, 0, sep);
  for (const existing of state.splt) {
    if (existing.name === chunk.name) {
      warnings.push(`duplicate sPLT chunks with name ${chunk.name}`);
    }
  }
  chunk.sampleDepth = chunk.data.getUint8(sep + 1);
  if (chunk.sampleDepth !== 8 && chunk.sampleDepth !== 16) {
    warnings.push(`non-standard sPLT sample depth ${chunk.sampleDepth}`);
  }
  chunk.sampleCount = (chunk.data.byteLength - sep - 2) / (chunk.sampleDepth === 16 ? 10 : 6);
  if ((chunk.sampleCount|0) !== chunk.sampleCount) {
    warnings.push('sPLT size is not a whole multiple of the item size');
    chunk.sampleCount = chunk.sampleCount|0;
  }
  chunk.palette = [];
  if (chunk.sampleDepth === 16) {
    for (let p = sep + 2; p + 10 <= chunk.data.byteLength; p += 10) {
      chunk.palette.push({
        red: chunk.data.getUint16(p),
        green: chunk.data.getUint16(p + 2),
        blue: chunk.data.getUint16(p + 4),
        alpha: chunk.data.getUint16(p + 6),
        frequency: chunk.data.getUint16(p + 8),
      });
    }
  } else {
    for (let p = sep + 2; p + 6 <= chunk.data.byteLength; p += 6) {
      chunk.palette.push({
        red: chunk.data.getUint8(p),
        green: chunk.data.getUint8(p + 1),
        blue: chunk.data.getUint8(p + 2),
        alpha: chunk.data.getUint8(p + 3),
        frequency: chunk.data.getUint16(p + 4),
      });
    }
  }
  state.splt.push(chunk);
});

// spAL: beta version of sPLT
