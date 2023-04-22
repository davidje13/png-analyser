import { registerChunk } from '../../registry.mjs';

// https://worms2d.info/Colour_map#PNG_chunk

function read(chunk, state, warnings) {
  state.wormsLevel = chunk;

  if (chunk.data.length < 40) {
    warnings.push(`waLV chunk length ${chunk.data.length} is less than 40`);
  }
  chunk.originalLandSeed = chunk.data.readUInt32BE(0);
  chunk.objectSeed = chunk.data.readUInt32BE(4);
  chunk.isCavern = Boolean(chunk.data.readUInt32BE(8));
  chunk.originalLandSeedStyle = chunk.data.readUInt32BE(12);
  chunk.indestructableBorders = !Boolean(chunk.data.readUInt32BE(16));
  chunk.objectPercentage = chunk.data.readUInt32BE(20);
  chunk.bridgePercentage = chunk.data.readUInt32BE(24);
  chunk.waterLevel = chunk.data.readUInt32BE(28);
  chunk.soilTextureIndex = chunk.data.readUInt16BE(32);
  chunk.soilTextureIndexVersion = chunk.data.readUInt16BE(34);
  chunk.waterColour = chunk.data.readUInt32BE(36);
  if (chunk.data.length === 41) {
    chunk.wormPlaces = chunk.data[40];
  } else if (chunk.data.length > 41) {
    chunk.wormPlaces = chunk.data.readUInt16BE(40);
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
