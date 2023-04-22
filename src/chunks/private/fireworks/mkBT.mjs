import { inflateSync } from 'node:zlib';
import { registerChunk } from '../../registry.mjs';

registerChunk('mkBT', {}, (chunk, state, warnings) => {
  const marker = chunk.data.readUInt32BE(0);
  if (marker !== 0xFACECAFE) {
    warnings.push(`mkBT marker 0x${marker.toString(16).padStart(8, '0')} does not match 0xFACECAFE (unknown format)`);
    return;
  }

  chunk.unknown1 = chunk.data.subarray(4, 8);
  let anyNonZero = false;
  for (let i = 8; i < 8 + 68; ++i) {
    if (chunk.data[i] !== 0) {
      anyNonZero = true;
      break;
    }
  }
  if (anyNonZero) {
    chunk.unknown2 = chunk.data.subarray(8, 8 + 68);
  }

  try {
    const inflated = inflateSync(chunk.data.subarray(8 + 68));
    chunk.testData = inflated.subarray(0, 40); // debug
    // TODO
  } catch (e) {
    warnings.push(`mkBT compressed data is unreadable ${e}`);
  }
});
