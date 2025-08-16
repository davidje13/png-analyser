import { makeCanvas } from '../../../../display/pretty.mjs';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   gama?: gAMAChunk,
 * }} gAMAState
 * @typedef {import('../registry.mjs').Chunk & {
 *   gamma?: number,
 * }} gAMAChunk
 */

registerChunk('gAMA', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {gAMAChunk} */ chunk, /** @type {gAMAState} */ state, warnings) => {
  if (chunk.data.byteLength !== 4) {
    warnings.push(`gAMA length ${chunk.data.byteLength} is not 4`);
    if (chunk.data.byteLength < 4) {
      return;
    }
  }
  const gamma = chunk.data.getUint32(0) * 0.00001;
  if (gamma === 0) {
    warnings.push('Gamma set to 0');
    return;
  }
  chunk.gamma = gamma;
  state.gama = chunk;

  chunk.toString = () => `Gamma: ${gamma}`;
  chunk.display = (summary, content) => {
    summary.append(`Gamma: ${gamma}`);
    content.append(
      drawChart(100, 100, 1, (v) => Math.pow(v, gamma)),
      drawChart(100, 100, 1, (v) => Math.pow(v, 1 / gamma)),
    );
  };
});

/**
 * @param {number} w
 * @param {number} h
 * @param {number} pad
 * @param {(input: number) => number} fn
 * @return {HTMLCanvasElement}
 */
function drawChart(w, h, pad, fn) {
  const chart = makeCanvas(w + pad * 2, h + pad * 2);
  chart.ctx.lineWidth = 1;
  chart.ctx.strokeStyle = '#000000';
  chart.ctx.beginPath();
  chart.ctx.moveTo(pad, (1 - fn(0)) * h + pad);
  for (let x = 1; x <= w; ++x) {
    chart.ctx.lineTo(x + pad, (1 - fn(x / w)) * h + pad);
  }
  chart.ctx.stroke();
  return chart.canvas;
}
