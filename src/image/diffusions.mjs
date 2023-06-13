/**
 * @typedef {{ x: number, y: number, v: number }[]} Diffusion
 */

/** @type {Diffusion} */ export const NONE = [];

// https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
/** @type {Diffusion} */ export const FLOYD_STEINBERG = [
  { x: 1, y: 0, v: 7 / 16 },
  { x: -1, y: 1, v: 3 / 16 },
  { x: 0, y: 1, v: 5 / 16 },
  { x: 1, y: 1, v: 1 / 16 },
];

// https://en.wikipedia.org/wiki/Atkinson_dithering
// amount = 0.75 corresponds to true Atkinson dithering
/** @type {Diffusion} */ export const ATKINSON = [
  { x: 1, y: 0, v: 1 / 6 },
  { x: 2, y: 0, v: 1 / 6 },
  { x: -1, y: 1, v: 1 / 6 },
  { x: 0, y: 1, v: 1 / 6 },
  { x: 1, y: 1, v: 1 / 6 },
  { x: 0, y: 2, v: 1 / 6 },
];

// https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html#jarvis-judice-and-ninke-dithering
/** @type {Diffusion} */ export const JARVIS_JUDICE_NINKE = [
  { x: 1, y: 0, v: 7 / 48 },
  { x: 2, y: 0, v: 5 / 48 },
  { x: -2, y: 1, v: 3 / 48 },
  { x: -1, y: 1, v: 5 / 48 },
  { x: 0, y: 1, v: 7 / 48 },
  { x: 1, y: 1, v: 5 / 48 },
  { x: 2, y: 1, v: 3 / 48 },
  { x: -2, y: 2, v: 1 / 48 },
  { x: -1, y: 2, v: 3 / 48 },
  { x: 0, y: 2, v: 5 / 48 },
  { x: 1, y: 2, v: 3 / 48 },
  { x: 2, y: 2, v: 1 / 48 },
];

// https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html#stucki-dithering
/** @type {Diffusion} */ export const STUCKI = [
  { x: 1, y: 0, v: 8 / 42 },
  { x: 2, y: 0, v: 4 / 42 },
  { x: -2, y: 1, v: 2 / 42 },
  { x: -1, y: 1, v: 4 / 42 },
  { x: 0, y: 1, v: 8 / 42 },
  { x: 1, y: 1, v: 4 / 42 },
  { x: 2, y: 1, v: 2 / 42 },
  { x: -2, y: 2, v: 1 / 42 },
  { x: -1, y: 2, v: 2 / 42 },
  { x: 0, y: 2, v: 4 / 42 },
  { x: 1, y: 2, v: 2 / 42 },
  { x: 2, y: 2, v: 1 / 42 },
];

// https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html#burkes-dithering
/** @type {Diffusion} */ export const BURKES = [
  { x: 1, y: 0, v: 8 / 32 },
  { x: 2, y: 0, v: 4 / 32 },
  { x: -2, y: 1, v: 2 / 32 },
  { x: -1, y: 1, v: 4 / 32 },
  { x: 0, y: 1, v: 8 / 32 },
  { x: 1, y: 1, v: 4 / 32 },
  { x: 2, y: 1, v: 2 / 32 },
];

// https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html#sierra-dithering
/** @type {Diffusion} */ export const SIERRA_2 = [
  { x: 1, y: 0, v: 5 / 32 },
  { x: 2, y: 0, v: 3 / 32 },
  { x: -2, y: 1, v: 2 / 32 },
  { x: -1, y: 1, v: 4 / 32 },
  { x: 0, y: 1, v: 5 / 32 },
  { x: 1, y: 1, v: 4 / 32 },
  { x: 2, y: 1, v: 2 / 32 },
  { x: -1, y: 2, v: 2 / 32 },
  { x: 0, y: 2, v: 3 / 32 },
  { x: 1, y: 2, v: 2 / 32 },
];

/** @type {Diffusion} */ export const SIERRA_1 = [
  { x: 1, y: 0, v: 4 / 16 },
  { x: 2, y: 0, v: 3 / 16 },
  { x: -2, y: 1, v: 1 / 16 },
  { x: -1, y: 1, v: 2 / 16 },
  { x: 0, y: 1, v: 3 / 16 },
  { x: 1, y: 1, v: 2 / 16 },
  { x: 2, y: 1, v: 1 / 16 },
];

/** @type {Diffusion} */ export const SIERRA_LITE = [
  { x: 1, y: 0, v: 2 / 4 },
  { x: -1, y: 1, v: 1 / 4 },
  { x: 0, y: 1, v: 1 / 4 },
];

export const DIFFUSION_TYPES = [
  { name: 'None', value: NONE },
  { name: 'Floyd-Steinberg', value: FLOYD_STEINBERG },
  { name: 'Atkinson', value: ATKINSON },
  { name: 'Jarvis-Judice-Ninke', value: JARVIS_JUDICE_NINKE },
  { name: 'Stucki', value: STUCKI },
  { name: 'Burkes', value: BURKES },
  { name: 'Sierra 2', value: SIERRA_2 },
  { name: 'Sierra 1', value: SIERRA_1 },
  { name: 'Sierra Lite', value: SIERRA_LITE },
];
