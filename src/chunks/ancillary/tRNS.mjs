import { asColourDiv, termCol, termReset } from '../../pretty.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   ihdr?: import('../mandatory/IHDR.mjs').IHDRChunk,
 *   plte?: import('../mandatory/PLTE.mjs').PLTEChunk,
 *   trns?: tRNSChunk,
 * }} tRNSState
 * @typedef {import('../registry.mjs').Chunk & {
 *   indexedAlpha?: number[],
 *   sampleRed?: number,
 *   sampleGreen?: number,
 *   sampleBlue?: number,
 *   sampleGray?: number,
 * }} tRNSChunk
 */

registerChunk('tRNS', { max: 1, notAfter: ['IDAT'], notBefore: ['PLTE'] }, (/** @type {tRNSChunk} */ chunk, /** @type {tRNSState} */ state, warnings) => {
  if (!state.ihdr) {
    warnings.push('cannot parse tRNS data unambiguously without IHDR');
    return;
  }
  if (state.ihdr.alpha) {
    warnings.push('tRNS chunk present in image with built-in alpha channel');
    return;
  }
  state.trns = chunk;
  if (state.ihdr.indexed) {
    if (chunk.data.byteLength > 256) {
      warnings.push(`transparency palette size ${chunk.data.byteLength} exceeds 256`);
    }
    chunk.indexedAlpha = [];
    for (let i = 0; i < chunk.data.byteLength; ++i) {
      chunk.indexedAlpha.push(chunk.data.getUint8(i));
    }
    const a = chunk.indexedAlpha;

    chunk.toString = () => a.map((c) => `${termCol(c)} ${c.toString(16).padStart(2, '0')} ${termReset}`).join('\n');

    chunk.display = (summary, content) => {
      summary.append('Indexed transparency');
      for (let i = 0; i < a.length; ++i) {
        const entry = a[i];
        const col = state.plte?.entries?.[i];
        if (col !== undefined) {
          content.append(asColourDiv(((entry << 24) | col) >>> 0, true, entry.toString(16).padStart(2, '0')));
        } else {
          content.append(asColourDiv(entry * 0x010101, false, entry.toString(16).padStart(2, '0')));
        }
      }
    };
  } else if (state.ihdr.rgb) {
    chunk.sampleRed = chunk.data.getUint16(0);
    chunk.sampleGreen = chunk.data.getUint16(2);
    chunk.sampleBlue = chunk.data.getUint16(4);
  } else {
    chunk.sampleGray = chunk.data.getUint16(0);
  }
});
