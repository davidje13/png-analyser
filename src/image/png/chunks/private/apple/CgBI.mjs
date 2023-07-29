import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   isApple?: boolean,
 * }} CgBIState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   flags?: string,
 *   wasRGBA?: boolean,
 * }} CgBIChunk
 */

// https://iphonedevwiki.net/index.php/CgBI_file_format

// channel order is BGRA (non-standard) and RGB are pre-multiplied by alpha
// idat is raw zlib data (no header / footer / crc)

registerChunk('CgBI', { max: 1, notAfter: ['IHDR'], allowBeforeIHDR: true }, (/** @type {CgBIChunk} */ chunk, /** @type {CgBIState} */ state, warnings) => {
  state.isApple = true;
  if (chunk.data.byteLength !== 4) {
    warnings.push(`CgBI chunk length ${chunk.data.byteLength} is not 4`);
  }
  const data = chunk.data.getUint32(0);
  chunk.flags = data.toString(16).padStart(8, '0'); // TODO: proper handling of bits
  chunk.wasRGBA = chunk.data.getUint8(3) === 2;
});
