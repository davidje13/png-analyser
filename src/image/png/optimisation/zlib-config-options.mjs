// constants from https://github.com/nodeca/pako/blob/c43cab1a618613011c6bdbd9af8b9fd825ff55ba/src/zlib/constants.mjs#L52
// see https://github.com/nodeca/pako/issues/326
const Z_FILTERED =               1;
const Z_HUFFMAN_ONLY =           2;
const Z_RLE =                    3;
const Z_FIXED =                  4;
const Z_DEFAULT_STRATEGY =       0;

/**
 * @typedef {{
 *   id: string,
 *   level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
 *   raw?: boolean,
 *   memLevel: number,
 *   strategy: number,
 *   weight: number,
 * }} ZLibConfigOption
 */

/** @type {ZLibConfigOption} */ export const L9_ZLIB_CONFIG = {
  id: 'L9',
  level: 9,
  memLevel: 9,
  strategy: Z_DEFAULT_STRATEGY,
  weight: 228,
};

/** @type {ZLibConfigOption[]} */ export const ZLIB_CONFIG_OPTIONS = [
  L9_ZLIB_CONFIG,
  { id: 'L8', level: 8, memLevel: 9, strategy: Z_DEFAULT_STRATEGY, weight: 14 },
  { id: 'L7', level: 7, memLevel: 9, strategy: Z_DEFAULT_STRATEGY, weight: 4 },
  { id: 'L6', level: 6, memLevel: 9, strategy: Z_DEFAULT_STRATEGY, weight: 4 },
  { id: 'L5', level: 5, memLevel: 9, strategy: Z_DEFAULT_STRATEGY, weight: 12 },
  { id: 'L4', level: 4, memLevel: 9, strategy: Z_DEFAULT_STRATEGY, weight: 1 },

  { id: 'L9 filtered', level: 9, memLevel: 9, strategy: Z_FILTERED, weight: 173 },
  { id: 'L8 filtered', level: 8, memLevel: 9, strategy: Z_FILTERED, weight: 17 },
  { id: 'L7 filtered', level: 7, memLevel: 9, strategy: Z_FILTERED, weight: 1 },
  { id: 'L6 filtered', level: 6, memLevel: 9, strategy: Z_FILTERED, weight: 3 },
  { id: 'L5 filtered', level: 5, memLevel: 9, strategy: Z_FILTERED, weight: 9 },
  { id: 'L4 filtered', level: 4, memLevel: 9, strategy: Z_FILTERED, weight: 2 },

  { id: 'L9 RLE', level: 9, memLevel: 9, strategy: Z_RLE, weight: 27 },
  { id: 'L9 huffman', level: 9, memLevel: 9, strategy: Z_HUFFMAN_ONLY, weight: 16 },
];
