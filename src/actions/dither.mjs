import { FLOYD_STEINBERG } from './diffusions.mjs';

/**
 * @typedef {[number, number, number, number]} ARGB
 */

/**
 * @param {number[][]} image
 * @param {number[]} palette
 * @param {{
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
export function quantise(image, palette, { dither } = {}) {
  if (!image.length) {
    return [];
  }
  const w = image[0].length;
  const h = image.length;

  const {
    gamma = 1.8,
    matte = 0x000000,
    diffusion = FLOYD_STEINBERG,
    serpentine = true,
    amount = 0,
  } = dither ?? {};

  const read = readARGB(gamma, matte);
  const paletteLookup = makePaletteLookup(palette, read);
  const incs = diffusion.map((o) => ({ ...o, v: o.v * amount }));

  const input = image.map((r) => r.map(read));
  /** @type {number[][]} */ const result = [];

  for (let y = 0; y < h; ++y) {
    /** @type {number[]} */ const resultRow = [];
    const dir = (serpentine && (y & 1)) ? -1 : 1;
    for (let i = 0; i < w; ++i) {
      const x = (dir === -1) ? w - 1 - i : i;
      const cin = input[y][x];
      const iout = paletteLookup.nearest(cin);
      resultRow[x] = palette[iout];

      const diff = diffARGB(cin, paletteLookup.values[iout]);
      for (const inc of incs) {
        incARGB(input[y + inc.y]?.[x + inc.x * dir], diff, inc.v);
      }
    }
    result.push(resultRow);
  }

  return result;
}

/**
 * @param {number} gamma
 * @param {number} matte
 * @return {(c: number) => ARGB}
 */
const readARGB = (gamma, matte) => {
  /** @type {number[]} */ const glookup = [];
  for (let i = 0; i < 256; ++i) {
    glookup[i] = Math.pow(i / 255, gamma) * 255;
  }

  const mr = (matte >>> 16) & 0xFF;
  const mg = (matte >>> 8) & 0xFF;
  const mb = matte & 0xFF;

  return (c) => {
    const a = c >>> 24;
    const ia = 255 - a;
    return [
      0xFF * a,
      glookup[(c >>> 16) & 0xFF] * a + mr * ia,
      glookup[(c >>> 8) & 0xFF] * a + mg * ia,
      glookup[c & 0xFF] * a + mb * ia,
    ];
  }
};

/**
 * @param {ARGB} a
 * @param {ARGB} b
 * @return {ARGB}
 */
const diffARGB = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];

/**
 * @param {ARGB | undefined} target
 * @param {ARGB} value
 * @param {number} mult
 */
const incARGB = (target, value, mult) => {
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
 * @return {{ nearest: (c: ARGB) => number, values: ARGB[] }}
 */
function makePaletteLookup(palette, read) {
  const values = palette.map(read);
  // TODO: could speed this up using a kd-tree (or at least buckets)
  return {
    values,
    nearest: (col) => {
      let bestD2 = Number.POSITIVE_INFINITY;
      let best = 0;
      for (let i = 0; i < values.length; ++i) {
        const p = values[i];
        const dA = p[0] - col[0];
        const dR = p[1] - col[1];
        const dG = p[2] - col[2];
        const dB = p[3] - col[3];
        const d2 = dA * dA + dR * dR + dG * dG + dB * dB;
        if (d2 < bestD2) {
          bestD2 = d2;
          best = i;
        }
      }
      return best;
    },
  };
}
