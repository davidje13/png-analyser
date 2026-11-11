import { inv, multiply_v3_m3x3 } from 'colorjs.io/src/util.js';
import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   chrm?: cHRMChunk,
 * }} cHRMState
 * @typedef {import('../registry.mjs').Chunk & {
 *   white?: { x: number, y: number, z: number, X: number, Y: number, Z: number },
 *   red?: { x: number, y: number, z: number, X: number, Y: number, Z: number },
 *   green?: { x: number, y: number, z: number, X: number, Y: number, Z: number },
 *   blue?: { x: number, y: number, z: number, X: number, Y: number, Z: number },
 * }} cHRMChunk
 */

registerChunk('cHRM', { max: 1, notAfter: ['PLTE', 'IDAT'] }, (/** @type {cHRMChunk} */ chunk, /** @type {cHRMState} */ state, warnings) => {
  state.chrm = chunk;
  if (chunk.data.byteLength !== 32) {
    warnings.push(`cHRM length ${chunk.data.byteLength} is not 32`);
  }
  const white = project_xyY_XYZ(
    chunk.data.getUint32(0) * 0.00001,
    chunk.data.getUint32(4) * 0.00001,
    1,
  );
  const rx = chunk.data.getUint32(8) * 0.00001;
  const ry = chunk.data.getUint32(12) * 0.00001;
  const rz = 1 - rx - ry;
  const gx = chunk.data.getUint32(16) * 0.00001;
  const gy = chunk.data.getUint32(20) * 0.00001;
  const gz = 1 - gx - gy;
  const bx = chunk.data.getUint32(24) * 0.00001;
  const by = chunk.data.getUint32(28) * 0.00001;
  const bz = 1 - bx - by;
  const T = [
    [rx, gx, bx],
    [ry, gy, by],
    [rz, gz, bz],
  ];
  const Ti = /** @type {import('colorjs.io/src/types.js').Matrix3x3} */ (inv(T));
  const [rs, gs, bs] = multiply_v3_m3x3([white.X, white.Y, white.Z], Ti);
  const red = { x: rx, y: ry, z: rz, X: rx * rs, Y: ry * rs, Z: rz * rs };
  const green = { x: gx, y: gy, z: gz, X: gx * gs, Y: gy * gs, Z: gz * gs };
  const blue = { x: bx, y: by, z: bz, X: bx * bs, Y: by * bs, Z: bz * bs };

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
});

/**
 * @param {number} x
 * @param {number} y
 * @param {number} Y
 */
function project_xyY_XYZ(x, y, Y) {
  const z = 1 - x - y;
  return { x, y, z, X: Y * x / y, Y, Z: Y * z / y };
}
