import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('./shared_state.mjs').apngState & {
 *   ihdr?: import('../mandatory/IHDR.mjs').IHDRChunk,
 *   apngFrames?: import('./shared_state.mjs').Frame[],
 * }} fcTLState
 * @typedef {import('../registry.mjs').Chunk & {
 *   sequenceNumber?: number,
 *   width?: number,
 *   height?: number,
 *   xOffset?: number,
 *   yOffset?: number,
 *   delay?: number,
 *   disposalType?: number,
 *   blendType?: number,
 * }} fcTLChunk
 */

registerChunk('fcTL', { requires: ['acTL'] }, (/** @type {fcTLChunk} */ chunk, /** @type {fcTLState} */ state, warnings) => {
  chunk.sequenceNumber = chunk.data.getUint32(0);
  if (chunk.sequenceNumber !== (state.nextSequenceNumber ?? 0)) {
    warnings.push(`sequence mismatch for fcTL chunk ${chunk.sequenceNumber}`);
  }
  state.nextSequenceNumber = chunk.sequenceNumber + 1;

  chunk.width = chunk.data.getUint32(4);
  chunk.height = chunk.data.getUint32(8);
  chunk.xOffset = chunk.data.getUint32(12);
  chunk.yOffset = chunk.data.getUint32(16);
  chunk.delay = chunk.data.getUint16(20) / (chunk.data.getUint16(22) || 100);
  chunk.disposalType = chunk.data.getUint8(24);
  chunk.blendType = chunk.data.getUint8(25);

  if (chunk.width === 0) {
    warnings.push('fcTL width is 0');
  }
  if (chunk.height === 0) {
    warnings.push('fcTL height is 0');
  }
  if (state.ihdr?.width && chunk.xOffset + chunk.width > state.ihdr.width) {
    warnings.push('fcTL exceeds image boundary (x)');
  }
  if (state.ihdr?.height && chunk.yOffset + chunk.height > state.ihdr.height) {
    warnings.push('fcTL exceeds image boundary (y)');
  }
  if (chunk.disposalType > 2) {
    warnings.push(`invalid fcTL disposal type ${chunk.disposalType}`);
  }
  if (chunk.blendType > 1) {
    warnings.push(`invalid fcTL blend type ${chunk.blendType}`);
  }

  if (state.apngCurrentFrame?.state === 1) {
    warnings.push(`sequential fcTL chunks at frame ${state.apngCurrentFrame.num}`);
  }
  state.apngCurrentFrame = {
    state: 1,
    num: (state.apngCurrentFrame?.num ?? 0) + 1,
    data: [],
  };
  state.apngFrames ||= [];
  state.apngFrames.push(state.apngCurrentFrame);
});
