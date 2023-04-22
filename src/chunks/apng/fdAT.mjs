import { registerChunk } from '../registry.mjs';

registerChunk('fdAT', { requires: ['acTL'] }, (chunk, state, warnings) => {
  chunk.sequenceNumber = chunk.data.readUInt32BE(0);
  if (chunk.sequenceNumber !== (state.nextSequenceNumber ?? 0)) {
    warnings.push(`sequence mismatch for fdAT chunk ${chunk.sequenceNumber}`);
  }
  state.nextSequenceNumber = chunk.sequenceNumber + 1;

  if (state.apngState === 1 || state.apngState === 3) {
    state.apngState = 3;
    state.apngCurrentFrame.data.push(chunk.data.subarray(4));
  } else if (state.apngState === 2) {
    warnings.push(`IDAT and fdAT chunks for frame ${state.apngCurrentFrame.num}`);
  } else {
    warnings.push('fdAT chunk without fcTL');
  }
});
