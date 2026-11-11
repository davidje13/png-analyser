import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   srgb?: sRGBChunk,
 * }} sRGBState
 * @typedef {import('../registry.mjs').Chunk & {
 *   renderingIntent?: number,
 * }} sRGBChunk
 */

registerChunk('sRGB', { max: 1, notAfter: ['iCCP', 'PLTE', 'IDAT'], notBefore: ['iCCP'] }, (/** @type {sRGBChunk} */ chunk, /** @type {sRGBState} */ state, warnings) => {
  if (chunk.data.byteLength !== 1) {
    warnings.push(`sRGB length ${chunk.data.byteLength} is not 1`);
  }
  state.srgb = chunk;
  const renderingIntent = chunk.data.getUint8(0);
  chunk.renderingIntent = renderingIntent;

  chunk.toString = () => `Rendering intent: ${RENDERING_INTENT.get(renderingIntent) ?? `unknown (${renderingIntent})`}`;
  chunk.display = (summary) => summary.append(chunk.toString());
});

const RENDERING_INTENT = new Map([
  [0, 'Perceptual'],
  [1, 'Relative colorimetric'],
  [2, 'Saturation'],
  [3, 'Absolute colorimetric'],
]);
