import { readICCProfile } from '../../../../colour/icc/ICCProfile.mjs';
import { inflate } from '../../../../data/inflate.mjs';
import { findIndex, getLatin1, subViewFrom } from '../../../../data/utils.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   iccp?: iCCPChunk,
 * }} iCCPState
 * @typedef {import('../registry.mjs').Chunk & {
 *   profileName?: string,
 *   compressionMethod?: number,
 *   value?: import('../../../../colour/icc/ICCProfile.mjs').ICCProfile | null,
 * }} iCCPChunk
 */

registerChunk('iCCP', { max: 1, notAfter: ['sRGB', 'PLTE', 'IDAT'], notBefore: ['sRGB'] }, async (
  /** @type {iCCPChunk} */ chunk,
  /** @type {iCCPState} */ state,
  warnings,
) => {
  let sep = findIndex(chunk.data, 0x00);
  if (sep === -1) {
    warnings.push('iCCP does not contain null separator');
    sep = chunk.data.byteLength;
  } else if (sep === 0 || sep > 79) {
    warnings.push(`invalid iCCP profile name length ${sep}`);
  }
  chunk.profileName = getLatin1(chunk.data, 0, sep, null);
  if (sep < chunk.data.byteLength - 1) {
    chunk.compressionMethod = chunk.data.getUint8(sep + 1);
    if (chunk.compressionMethod !== 0) {
      warnings.push(`non-standard iCCP compression method ${chunk.compressionMethod}`);
    }
    try {
      chunk.value = readICCProfile(await inflate(subViewFrom(chunk.data, sep + 2)), warnings);
    } catch (e) {
      warnings.push(`iCCP compressed data is unreadable ${e}`);
      chunk.value = null;
    }
  }

  chunk.display = (summary, content) => {
    summary.append(chunk.profileName || 'unnamed profile');
    chunk.value?.display(content);
  };
});
