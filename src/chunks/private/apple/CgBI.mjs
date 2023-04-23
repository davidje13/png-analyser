import { registerChunk } from '../../registry.mjs';

// https://iphonedevwiki.net/index.php/CgBI_file_format

// channel order is BGRA (non-standard) and RGP are pre-multiplied by alpha
// idat is raw zlib data (no header / footer / crc)

registerChunk('CgBI', { max: 1, notAfter: ['IHDR'], allowBeforeIHDR: true }, (chunk, state, warnings) => {
  state.isApple = true;
  if (chunk.data.length !== 4) {
    warnings.push(`CgBI chunk length ${chunk.data.length} is not 4`);
  }
  const data = chunk.data.readUInt32BE(0);
  chunk.flags = data.toString(16).padStart(8, '0'); // TODO: proper handling of bits
  chunk.wasRGBA = chunk.data[3] === 2;
});
