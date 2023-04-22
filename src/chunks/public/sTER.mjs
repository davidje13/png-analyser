import { registerChunk } from '../registry.mjs';

const MODE = ['rl', 'lr'];

registerChunk('sTER', { max: 1, notAfter: ['IDAT'] }, (chunk, state, warnings) => {
  state.ster = chunk;
  if (chunk.data.length !== 1) {
    warnings.push(`sTER length ${chunk.data.length} is not 1`);
  }
  const mode = chunk.data[0];
  chunk.mode = MODE[mode];
  if (!chunk.mode) {
    warnings.push(`non-standard sTER mode ${mode}`);
  }
  if (state.ihdr) {
    const w = state.ihdr.width;
    chunk.padding = 7 - (w - 1) % 8;
    if ((state.ihdr.width - chunk.padding) & 1) {
      warnings.push('left and right images have different widths');
    }
    chunk.subWidth = (state.ihdr.width - chunk.padding) / 2;
  }
});
