import { registerChunk } from '../registry.mjs';
import { getPrimariesXYZ } from '../../../../colour/xyz.mjs';
import { el } from '../../../../display/pretty.mjs';
import { visualiseColourSpace } from '../../../../display/colour.mjs';

/**
 * @typedef {import('../../../../colour/xyz.mjs').FullXYZ} FullXYZ
 * @typedef {import('../registry.mjs').State & {
 *   chrm?: cHRMChunk,
 * }} cHRMState
 * @typedef {import('../registry.mjs').Chunk & {
 *   white?: FullXYZ,
 *   red?: FullXYZ,
 *   green?: FullXYZ,
 *   blue?: FullXYZ,
 * }} cHRMChunk
 */

registerChunk('cHRM', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {cHRMChunk} */ chunk, /** @type {cHRMState} */ state, warnings) => {
  state.chrm = chunk;
  if (chunk.data.byteLength !== 32) {
    warnings.push(`cHRM length ${chunk.data.byteLength} is not 32`);
  }
  const { white, red, green, blue } = getPrimariesXYZ({
    white: { x: chunk.data.getUint32(0) * 0.00001, y: chunk.data.getUint32(4) * 0.00001, Y: 1 },
    red: { x: chunk.data.getUint32(8) * 0.00001, y: chunk.data.getUint32(12) * 0.00001 },
    green: { x: chunk.data.getUint32(16) * 0.00001, y: chunk.data.getUint32(20) * 0.00001 },
    blue: { x: chunk.data.getUint32(24) * 0.00001, y: chunk.data.getUint32(28) * 0.00001 },
  });

  chunk.white = white;
  chunk.red = red;
  chunk.green = green;
  chunk.blue = blue;

  chunk.toString = () => [
    `White: xy(${white.x.toFixed(5)}, ${white.y.toFixed(5)}) -> XYZ(${white.X.toFixed(7)}, ${white.Y.toFixed(7)}, ${white.Z.toFixed(7)}) [Y = 1]`,
    `Red:   xy(${red.x.toFixed(5)}, ${red.y.toFixed(5)}) -> XYZ(${red.X.toFixed(7)}, ${red.Y.toFixed(7)}, ${red.Z.toFixed(7)})`,
    `Green: xy(${green.x.toFixed(5)}, ${green.y.toFixed(5)}) -> XYZ(${green.X.toFixed(7)}, ${green.Y.toFixed(7)}, ${green.Z.toFixed(7)})`,
    `Blue:  xy(${blue.x.toFixed(5)}, ${blue.y.toFixed(5)}) -> XYZ(${blue.X.toFixed(7)}, ${blue.Y.toFixed(7)}, ${blue.Z.toFixed(7)})`,
  ].join('\n');

  chunk.display = (_, content) => content.append(
    chunk.toString(),
    el('br'),
    visualiseColourSpace({
      perimeter: [red, green, blue],
      points: [
        [red, '#FF0000'],
        [green, '#00FF00'],
        [blue, '#0000FF'],
        [white, '#FFFFFF'],
      ],
    }),
  );
});
