import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   idot?: iDOTChunk
 * }} iDOTState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   segments: { startRow: number, rows: number, idatChunkFilePos: number, idatIndex?: number }[],
 * }} iDOTChunk
 */

// divides the compressed data into chunks for parallel decoding on limited hardware (mobile devices)
// https://www.hackerfactor.com/blog/index.php?/archives/895-Connecting-the-iDOTs.html

// This is generated e.g. by the screenshot tool on Mac

registerChunk('iDOT', { max: 1 }, (/** @type {iDOTChunk} */ chunk, /** @type {iDOTState} */ state, warnings) => {
  state.idot = chunk;
  if (chunk.data.byteLength < 16) {
    warnings.push('incorrect iDOT chunk size');
  }
  const segments = chunk.data.getUint32(0);

  if (chunk.data.byteLength !== 4 + segments * 12) {
    warnings.push('incorrect iDOT chunk size');
  }

  // data offsets are relative to beginning of iDOT chunk (add 8 + <len> + 4 to get to end of iDOT

  chunk.segments = [];
  for (let i = 0; i < segments; ++i) {
    const startRow = chunk.data.getUint32(4 + i * 12);
    const rows = chunk.data.getUint32(4 + i * 12 + 4);
    const idatChunkFilePos = chunk.filePos + chunk.data.getUint32(4 + i * 12 + 8);
    chunk.segments.push({ startRow, rows, idatChunkFilePos });
  }

  chunk.toString = () => {
    return [
      `Parallel segments: ${chunk.segments.length}`,
      ...chunk.segments.flatMap((s, i) => [
        `#${i + 1}:`,
        `  rows [${s.startRow} - ${s.startRow + s.rows - 1}]`,
        `  begins at IDAT ${s.idatIndex ?? '[unknown]'} (file offset ${s.idatChunkFilePos})`,
      ]),
    ].join('\n');
  };
});
