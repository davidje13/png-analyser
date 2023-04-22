import { registerChunk } from '../registry.mjs';

registerChunk('fcTL', { requires: ['acTL'] }, (chunk, state, warnings) => {
  chunk.sequenceNumber = chunk.data.readUInt32BE(0);
  if (chunk.sequenceNumber !== (state.nextSequenceNumber ?? 0)) {
    warnings.push(`sequence mismatch for fcTL chunk ${chunk.sequenceNumber}`);
  }
  state.nextSequenceNumber = chunk.sequenceNumber + 1;

  chunk.width = chunk.data.readUInt32BE(4);
  chunk.height = chunk.data.readUInt32BE(8);
  chunk.xOffset = chunk.data.readUInt32BE(12);
  chunk.yOffset = chunk.data.readUInt32BE(16);
  chunk.delay = chunk.data.readUInt16BE(20) / (chunk.data.readUInt16BE(22) || 100);
  chunk.disposalType = chunk.data[24];
  chunk.blendType = chunk.data[25];

  if (chunk.width === 0) {
    warnings.push('fcTL width is 0');
  }
  if (chunk.height === 0) {
    warnings.push('fcTL height is 0');
  }
  if (state.ihdr && chunk.xOffset + chunk.width > state.ihdr.width) {
    warnings.push('fcTL exceeds image boundary (x)');
  }
  if (state.ihdr && chunk.yOffset + chunk.height > state.ihdr.height) {
    warnings.push('fcTL exceeds image boundary (y)');
  }
  if (chunk.disposalType > 2) {
    warnings.push(`invalid fcTL disposal type ${chunk.disposalType}`);
  }
  if (chunk.blendType > 1) {
    warnings.push(`invalid fcTL blend type ${chunk.blendType}`);
  }

  if (state.apngState === 1) {
    warnings.push(`sequential fcTL chunks at frame ${state.apngCurrentFrame.num}`);
  }
  state.apngState = 1;
  state.apngCurrentFrame = {
    num: (state.apngCurrentFrame?.num ?? 0) + 1,
    data: [],
  };
  state.apngFrames ||= [];
  state.apngFrames.push(state.apngCurrentFrame);
});
