export const BLACK_WHITE = [
  0xFF000000,
  0xFFFFFFFF,
];

/** @type {number[]} */ export const GREYSCALE = [];
for (let i = 0; i < 0x100; ++i) {
  GREYSCALE.push((0xFF000000 | (0x010101 * i)) >>> 0);
}

export const SATURATED = [
  0xFF000000,
  0xFFFF0000,
  0xFF00FF00,
  0xFF0000FF,
  0xFFFFFF00,
  0xFF00FFFF,
  0xFFFF00FF,
  0xFFFFFFFF,
];

/** @type {number[]} */ export const WEBSAFE = [];
for (let r = 0; r < 0x100; r += 0x33) {
  for (let g = 0; g < 0x100; g += 0x33) {
    for (let b = 0; b < 0x100; b += 0x33) {
      WEBSAFE.push((0xFF000000 | (r << 16) | (g << 8) | b) >>> 0);
    }
  }
}

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

export const MACINTOSH = [
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
  { name: 'Websafe', value: WEBSAFE },
  { name: 'IBM OS/2', value: OS2 },
  { name: 'Windows', value: WINDOWS },
  { name: 'Macintosh', value: MACINTOSH },
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
