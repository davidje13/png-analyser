/**
 * @typedef {[number, number, number, number]} ARGB
 */

/**
 * @template {unknown} T1
 * @template {unknown} T
 * @param {(value: T1) => T} stage1
 * @param {(((value: T) => T) | null)[]} stages
 * @return {(value: T1) => T}
 */
export const pipe = (stage1, ...stages) => {
  const filtered = /** @type {((value: T) => T)[]} */ (stages.filter((s) => s));
  return (value) => {
    let v = stage1(value);
    for (const s of filtered) {
      v = s(v);
    }
    return v;
  };
};

const SCALE = 1 / 255;

/**
 * @param {number} c
 * @return {ARGB}
 */
export const readARGB8 = (c) => {
  const a = (c >>> 24) * SCALE;
  return [
    a,
    ((c >>> 16) & 0xFF) * SCALE,
    ((c >>> 8) & 0xFF) * SCALE,
    (c & 0xFF) * SCALE,
  ];
};

/**
 * @param {Readonly<ARGB>} matte
 * @return {(c: Readonly<ARGB>) => ARGB}
 */
export const applyMatteARGB = (matte) => (c) => {
  const a = c[0];
  const ia = 1 - a;
  return [
    1,
    c[1] * a + matte[1] * ia,
    c[2] * a + matte[2] * ia,
    c[3] * a + matte[3] * ia,
  ];
};

/**
 * @param {number[]} red
 * @param {number[]=} green
 * @param {number[]=} blue
 * @return {(c: Readonly<ARGB>) => ARGB}
 */
export const applyCurvesARGB = (red, green = red, blue = red) => {
  const rR = red.length - 1;
  const rG = green.length - 1;
  const rB = blue.length - 1;
  return (c) => [
    c[0],
    red[(c[1] * rR) | 0],
    green[(c[2] * rG) | 0],
    blue[(c[3] * rB) | 0],
  ];
};

/**
 * @param {number} gamma
 * @param {number=} steps
 * @return {(c: Readonly<ARGB>) => ARGB}
 */
export const applyGammaARGB = (gamma, steps = 65535) => {
  const m = 1 / steps;
  /** @type {number[]} */ const lookup = [];
  for (let i = 0; i <= steps; ++i) {
    lookup[i] = Math.pow(i * m, gamma);
  }
  return applyCurvesARGB(lookup);
};

const sRGBGamma = (() => {
  /** @type {number[]} */ const lookup = [];
  const m1 = 1 / 258400;
  for (let i = 0; i < 810; ++i) { // up to 0.04045
    lookup[i] = i * m1;
  }
  const m2 = 1 / 21100;
  for (let i = 810; i <= 20000; ++i) {
    lookup[i] = Math.pow((i + 1100) * m2, 2.4);
  }
  return applyCurvesARGB(lookup);
})();

/**
 * @param {Readonly<ARGB>} c
 * @return {ARGB}
 */
export const sRGB_to_XYZ65 = (c) => {
  const [a, r, g, b] = sRGBGamma(c);
  return [
    a,
    r * 0.4124 + g * 0.3576 + b * 0.1805,
    r * 0.2126 + g * 0.7152 + b * 0.0722,
    r * 0.0193 + g * 0.1192 + b * 0.9505,
  ];
};

/**
 * @param {Readonly<ARGB>} c
 * @return {ARGB}
 */
export const XYZ65_to_XYY65 = ([a, X, Y, Z]) => {
  const n = 1 / ((X + Y + Z) || 1);
  return [
    a,
    X * n,
    Y * n,
    Y,
  ];
};

const labD = 6 / 29;
const labT = labD * labD * labD;
const labM = 1 / (3 * labD * labD);
const labO = 4 / 29;

/**
 * @param {number} t
 * @return {number}
 */
const labF = (t) => t > labT ? Math.cbrt(t) : (t * labM + labO);

const labFLookupSteps = 524288;
const labFLookup = (() => {
  /** @type {number[]} */ const lookup = [];
  for (let i = 0; i <= labFLookupSteps; ++i) {
    lookup[i] = labF(i / labFLookupSteps);
  }
  // add safety bound to avoid need to clamp values
  for (let i = labFLookupSteps; i < labFLookupSteps * 1.1; ++i) {
    lookup[i] = 1;
  }
  return lookup;
})();

/**
 * @param {Readonly<ARGB>} white
 * @return {(c: Readonly<ARGB>) => ARGB}
 */
export const XYZ_to_LAB = (white) => {
  const labX = labFLookupSteps / white[1];
  const labY = labFLookupSteps / white[2];
  const labZ = labFLookupSteps / white[3];

  return ([a, x, y, z]) => {
    const lx = labFLookup[(x * labX) | 0];
    const ly = labFLookup[(y * labY) | 0];
    const lz = labFLookup[(z * labZ) | 0];

    return [
      a,
      (116 * ly - 16) / 100,
      (500 * (lx - ly)) / 100,
      (200 * (ly - lz)) / 100,
    ];
  };
};

export const XYZ65_to_LAB = XYZ_to_LAB(sRGB_to_XYZ65([1, 1, 1, 1]));

export const COLOURSPACES = [
  { name: 'sRGB', fromSRGB: [] },
  { name: 'CIE 1931 XYZ (D65)', fromSRGB: [sRGB_to_XYZ65] },
  { name: 'CIE 1931 xyY (D65)', fromSRGB: [sRGB_to_XYZ65, XYZ65_to_XYY65] },
  { name: 'CIE 1976 L*a*b*', fromSRGB: [sRGB_to_XYZ65, XYZ65_to_LAB] },
];
