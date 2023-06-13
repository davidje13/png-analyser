import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('../mandatory/IHDR.mjs').IHDRChunk,
 *   ster?: sTERChunk,
 * }} sTERState
 * @typedef {import('../registry.mjs').Chunk & {
 *   mode?: string,
 *   padding?: number,
 *   subWidth?: number,
 * }} sTERChunk
 */

const MODE = ['rl', 'lr'];

registerChunk('sTER', { max: 1, notAfter: ['IDAT'] }, (/** @type {sTERChunk} */ chunk, /** @type {sTERState} */ state, warnings) => {
  state.ster = chunk;
  if (chunk.data.byteLength !== 1) {
    warnings.push(`sTER length ${chunk.data.byteLength} is not 1`);
  }
  const mode = chunk.data.getUint8(0);
  chunk.mode = MODE[mode];
  if (!chunk.mode) {
    warnings.push(`non-standard sTER mode ${mode}`);
  }
  if (state.ihdr?.width) {
    const w = state.ihdr.width;
    chunk.padding = 7 - (w - 1) % 8;
    if ((state.ihdr.width - chunk.padding) & 1) {
      warnings.push('left and right images have different widths');
    }
    chunk.subWidth = (state.ihdr.width - chunk.padding) / 2;
  }
});
