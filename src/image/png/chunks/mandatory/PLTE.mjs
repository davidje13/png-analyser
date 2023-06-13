import { asBytes } from '../../../../data/utils.mjs';
import { asColourDiv, termCol, termReset } from '../../../../display/pretty.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('./IHDR.mjs').IHDRChunk,
 *   plte?: PLTEChunk,
 * }} PLTEState
 * @typedef {import('../registry.mjs').Chunk & {
 *   paletteSize?: number,
 *   entries?: number[],
 * }} PLTEChunk
 */

registerChunk('PLTE', { max: 1, notAfter: ['IDAT'] }, (/** @type {PLTEChunk} */ chunk, /** @type {PLTEState} */ state, warnings) => {
  state.plte = chunk;
  if (state.ihdr && !state.ihdr.rgb && !state.ihdr.indexed) {
    warnings.push(`palette specified for greyscale colour type ${state.ihdr.colourType}`);
    return;
  }
  chunk.paletteSize = (chunk.data.byteLength / 3)|0;
  if (chunk.data.byteLength % 3 !== 0) {
    warnings.push(`palette length ${chunk.data.byteLength} is not a multiple of 3`);
  }
  if (chunk.paletteSize > 256) {
    warnings.push(`palette size ${chunk.paletteSize} exceeds 256`);
  }

  const bytes = asBytes(chunk.data);
  chunk.entries = [];
  for (let i = 0; i < chunk.paletteSize; ++i) {
    const r = bytes[i * 3];
    const g = bytes[i * 3 + 1];
    const b = bytes[i * 3 + 2];
    chunk.entries.push((r << 16) | (g << 8) | b);
  }

  chunk.toString = () => [
    `${chunk.paletteSize}-colour:`,
    ...(chunk.entries ?? []).map((c) => `${termCol(c)} ${c.toString(16).padStart(6, '0')} ${termReset}`),
  ].join('\n');

  chunk.display = (summary, content) => {
    summary.append(`${chunk.paletteSize}-colour`);
    for (const entry of chunk.entries ?? []) {
      content.append(asColourDiv(entry, false));
    }
  };
});
