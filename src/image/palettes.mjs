export const BLACK_WHITE = [
  0xFF000000,
  0xFFFFFFFF,
];

/** @type {number[]} */ export const GREYSCALE = [];
for (let i = 0; i < 0x100; ++i) {
  GREYSCALE.push((0xFF000000 | (0x010101 * i)) >>> 0);
}

/**
 * @param {number} n
 * @param {number=} max
 * @return {number[]}
 */
const makeSteps = (n, max = 0xFF) => {
  /** @type {number[]} */ const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(Math.round((i * max) / (n - 1)));
  }
  return result;
}

/**
 * @param {number[]} steps
 * @param {number=} alpha
 * @return {number[]}
 */
const makeCube = (steps, alpha = 0xFF) => {
  /** @type {number[]} */ const result = [];
  for (const r of steps) {
    for (const g of steps) {
      for (const b of steps) {
        result.push(((alpha << 24) | (r << 16) | (g << 8) | b) >>> 0);
      }
    }
  }
  return result;
};

export const SATURATED = makeCube(makeSteps(2));
export const REGULAR_3 = makeCube(makeSteps(3));
export const REGULAR_4 = makeCube(makeSteps(4));
export const REGULAR_5 = makeCube(makeSteps(5));
export const WEBSAFE = makeCube(makeSteps(6));

export const REGULAR_5_ALPHA = [
  0,
  ...makeCube(makeSteps(2), 0x40),
  ...makeCube(makeSteps(3), 0x80),
  ...makeCube(makeSteps(4), 0xC0),
  ...makeCube(makeSteps(5)),
];

// https://en.wikipedia.org/wiki/List_of_software_palettes
export const OS2 = [
  0xFF000000,
  0xFF800000,
  0xFF008000,
  0xFF808000,
  0xFF000080,
  0xFF800080,
  0xFF008080,
  0xFFC0C0C0,
  0xFF808080,
  0xFFFF0000,
  0xFF00FF00,
  0xFFFFFF00,
  0xFF0000FF,
  0xFFFF00FF,
  0xFF00FFFF,
  0xFFFFFFFF,
];

export const WINDOWS = [
  ...OS2.slice(0, 8),
  0xFFC0DCC0,
  0xFFA6CAF0,
  0xFFFFFBF0,
  0xFFA0A0A4,
  ...OS2.slice(8),
];

export const MACINTOSH4 = [
  0xFFFFFFFF,
  0xFFFBF305,
  0xFFFF6403,
  0xFFDD0907,
  0xFFF20884,
  0xFF4700A5,
  0xFF0000D3,
  0xFF02ABEA,
  0xFF1FB714,
  0xFF006412,
  0xFF562C05,
  0xFF90713A,
  0xFFC0C0C0,
  0xFF808080,
  0xFF404040,
  0xFF000000,
];

// thanks, https://belkadan.com/blog/2018/01/Color-Palette-8/
/** @type {number[]} */ export const MACINTOSH8 = [];
for (let r = 6; (r --) > 0;) {
  for (let g = 6; (g --) > 0;) {
    for (let b = 6; (b --) > 0;) {
      MACINTOSH8.push((0xFF000000 | (r * 0x330000) | (g * 0x003300) | (b * 0x000033)) >>> 0);
    }
  }
}
MACINTOSH8.pop();
for (const m of [0x110000, 0x001100, 0x000011, 0x111111]) {
  for (let i = 15; (i --) > 1;) {
    if (i % 3) {
      MACINTOSH8.push((0xFF000000 | (i * m)) >>> 0);
    }
  }
}
MACINTOSH8.push(0xFF000000);

export const RISC = [
  0xFFFFFFFF,
  0xFFDDDDDD,
  0xFFBBBBBB,
  0xFF999999,
  0xFF777777,
  0xFF555555,
  0xFF333333,
  0xFF000000,
  0xFF004499,
  0xFFEEEE00,
  0xFF00CC00,
  0xFFDD0000,
  0xFFEEEEBB,
  0xFF558800,
  0xFFFFBB00,
  0xFF00BBFF,
];

/** @type {number[]} */ export const MSX2_SCREEN8 = [];
for (let r = 0; r < 8; ++r) {
  for (let g = 0; g < 8; ++g) {
    const rg = (
      (Math.round(r * 255 / 7) << 16) |
      (Math.round(g * 255 / 7) << 8)
    );
    for (let b = 0; b < 0x100; b += 85) {
      MSX2_SCREEN8.push((0xFF000000 | rg | b) >>> 0);
    }
  }
}

export const PALETTES = [
  { name: 'Black & White', value: BLACK_WHITE },
  { name: 'Greyscale', value: GREYSCALE },
  { name: 'Saturated', value: SATURATED },
  { name: 'Regular 3', value: REGULAR_3 },
  { name: 'Regular 4', value: REGULAR_4 },
  { name: 'Regular 5', value: REGULAR_5 },
  { name: 'Websafe', value: WEBSAFE },
  { name: 'Regular 5 + Alpha', value: REGULAR_5_ALPHA },
  { name: 'IBM OS/2', value: OS2 },
  { name: 'Windows', value: WINDOWS },
  { name: 'Macintosh 4', value: MACINTOSH4 },
  { name: 'Macintosh 8', value: MACINTOSH8 },
  { name: 'RISC OS', value: RISC },
  { name: 'MSX2 Screen 8', value: MSX2_SCREEN8 },
];

///**
// * @param {number[][]} image
// * @param {number} size
// * @return {number[]}
// */
//export function adaptivePalette(image, size) {
//  // TODO
//}
