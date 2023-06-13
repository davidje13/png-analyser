import { registerChunk } from '../../registry.mjs';

// https://worms2d.info/Colour_map#PNG_chunk

/**
 * @typedef {import('../../registry.mjs').State & {
 *   walv?: waLVChunk,
 * }} waLVState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   originalLandSeed?: number,
 *   objectSeed?: number,
 *   isCavern?: boolean,
 *   originalLandSeedStyle?: number,
 *   indestructableBorders?: boolean,
 *   objectPercentage?: number,
 *   bridgePercentage?: number,
 *   waterLevel?: number,
 *   soilTextureIndex?: number,
 *   soilTextureIndexVersion?: number,
 *   waterColour?: number,
 *   wormPlaces?: number,
 * }} waLVChunk
 */

/**
 * @param {waLVChunk} chunk
 * @param {waLVState} state
 * @param {string[]} warnings
 */
function read(chunk, state, warnings) {
  state.walv = chunk;

  if (chunk.data.byteLength < 40) {
    warnings.push(`waLV chunk length ${chunk.data.byteLength} is less than 40`);
  }
  chunk.originalLandSeed = chunk.data.getUint32(0);
  chunk.objectSeed = chunk.data.getUint32(4);
  chunk.isCavern = Boolean(chunk.data.getUint32(8));
  chunk.originalLandSeedStyle = chunk.data.getUint32(12);
  chunk.indestructableBorders = !Boolean(chunk.data.getUint32(16));
  chunk.objectPercentage = chunk.data.getUint32(20);
  chunk.bridgePercentage = chunk.data.getUint32(24);
  chunk.waterLevel = chunk.data.getUint32(28);
  chunk.soilTextureIndex = chunk.data.getUint16(32);
  chunk.soilTextureIndexVersion = chunk.data.getUint16(34);
  chunk.waterColour = chunk.data.getUint32(36);
  if (chunk.data.byteLength === 41) {
    chunk.wormPlaces = chunk.data.getUint8(40);
  } else if (chunk.data.byteLength > 41) {
    chunk.wormPlaces = chunk.data.getUint16(40);
  }

  if (chunk.objectPercentage > 100) {
    warnings.push(`waLV object percentage ${chunk.objectPercentage} is greater than 100`);
  }
  if (chunk.bridgePercentage > 100) {
    warnings.push(`waLV bridge percentage ${chunk.bridgePercentage} is greater than 100`);
  }
  if (chunk.waterLevel > 99) {
    warnings.push(`waLV water level ${chunk.waterLevel} is greater than 99`);
  }
  if (chunk.soilTextureIndex > 28) {
    warnings.push(`waLV soil texture index ${chunk.soilTextureIndex} is greater than 28`);
  }
  if (chunk.waterColour !== 0) {
    warnings.push(`waLV water colour ${chunk.waterColour} is not 0`);
  }
}

registerChunk('waLV', { max: 1, notBefore: ['w2lv'], notAfter: ['w2lv'] }, read);

// non-conforming earlier name for same chunk
registerChunk('w2lv', { max: 1, notBefore: ['waLV'], notAfter: ['waLV'] }, read);
