import { applyGammaARGB, applyMatteARGB, pipe, readARGB8 } from './colour.mjs';
import { NONE } from './diffusions.mjs';

// TODO: ordered dithering? https://en.wikipedia.org/wiki/Ordered_dithering
// TODO: spatial quantisation?
//   https://web.archive.org/web/20160426135306/www.cs.berkeley.edu/~dcoetzee/downloads/scolorq/
//   https://web.archive.org/web/20061231102533/http://www-dbv.informatik.uni-bonn.de/quant/

/**
 * @typedef {import('./colour.mjs').ARGB} ARGB
 * @typedef {[...ARGB, number]} ARGBM
 */

/**
 * @param {number[][]} image
 * @param {number[]} palette
 * @param {{
 *   colourspaceConversion?: ((c: ARGB) => ARGB)[],
 *   dither?: {
 *     gamma?: number,
 *     matte?: number,
 *     diffusion?: import("./diffusions.mjs").Diffusion,
 *     serpentine?: boolean,
 *     amount: number,
 *   },
 * }=} options
 * @return {number[][]}
 */
export function quantise(image, palette, { colourspaceConversion = [], dither } = {}) {
  if (!image.length) {
    return [];
  }
  const w = image[0].length;
  const h = image.length;

  const {
    gamma = 1.8,
    matte = -1,
    diffusion = NONE,
    serpentine = true,
    amount = 0,
  } = dither ?? {};

  const paletteLookup = makePaletteLookup(palette, read(-1, gamma, colourspaceConversion));
  const incs = diffusion.map((o) => ({ ...o, v: o.v * amount }));

  const reader = read(matte, gamma, colourspaceConversion);
  const input = image.map((r) => r.map(reader).map(toARGBM));
  /** @type {number[][]} */ const result = [];

  for (let y = 0; y < h; ++y) {
    /** @type {number[]} */ const resultRow = [];
    const dir = (serpentine && (y & 1)) ? -1 : 1;
    for (let i = 0; i < w; ++i) {
      const x = (dir === -1) ? w - 1 - i : i;
      const cin = input[y][x];
      const iout = paletteLookup.nearest(cin);
      resultRow[x] = palette[iout];

      const cout = paletteLookup.values[iout];
      const m = cin[4];
      /** @type {ARGB} */ const diff = [
        cin[0] - cout[0],
        (cin[1] - cout[1]) * m,
        (cin[2] - cout[2]) * m,
        (cin[3] - cout[3]) * m,
      ];
      for (const inc of incs) {
        incARGBM(input[y + inc.y]?.[x + inc.x * dir], diff, inc.v);
      }
    }
    result.push(resultRow);
  }

  return result;
}

/**
 * @param {number} matte
 * @param {number} gamma
 * @param {((c: ARGB) => ARGB)[]} colourspace
 * @return {(value: number) => ARGB}
 */
const read = (matte, gamma, colourspace) => pipe(
  readARGB8,
  matte === -1 ? null : applyMatteARGB(readARGB8(matte)),
  gamma === 1 ? null : applyGammaARGB(gamma),
  ...colourspace,
);

/**
 * @param {Readonly<ARGB>} c
 * @return {ARGBM}
 */
const toARGBM = (c) => [...c, c[0]];

/**
 * @param {ARGBM | undefined} target
 * @param {Readonly<ARGB>} value
 * @param {number} mult
 */
const incARGBM = (target, value, mult) => {
  if (target) {
    target[0] += value[0] * mult;
    target[1] += value[1] * mult;
    target[2] += value[2] * mult;
    target[3] += value[3] * mult;
  }
};

/**
 * @param {number[]} palette
 * @param {(c: number) => ARGB} read
 * @return {{ nearest: (c: Readonly<[...ARGB, ...unknown[]]>) => number, values: ARGB[] }}
 */
function makePaletteLookup(palette, read) {
  const values = palette.map(read);
  // TODO: could speed this up using a kd-tree (or at least buckets)
  return {
    values,
    nearest: (col) => {
      let bestD2 = Number.POSITIVE_INFINITY;
      let best = 0;
      const m = col[0] * col[0];
      for (let i = 0; i < values.length; ++i) {
        const p = values[i];
        const dA = p[0] - col[0];
        const dR = p[1] - col[1];
        const dG = p[2] - col[2];
        const dB = p[3] - col[3];
        const d2 = dA * dA + (dR * dR + dG * dG + dB * dB) * m;
        if (d2 < bestD2) {
          bestD2 = d2;
          best = i;
        }
      }
      return best;
    },
  };
}
