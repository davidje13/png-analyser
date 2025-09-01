import { constants } from '../../../third-party/pako-deflate.min.mjs';

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
  strategy: constants.Z_DEFAULT_STRATEGY,
  weight: 228,
};

/** @type {ZLibConfigOption[]} */ export const ZLIB_CONFIG_OPTIONS = [
  L9_ZLIB_CONFIG,
  { id: 'L8', level: 8, memLevel: 9, strategy: constants.Z_DEFAULT_STRATEGY, weight: 14 },
  { id: 'L7', level: 7, memLevel: 9, strategy: constants.Z_DEFAULT_STRATEGY, weight: 4 },
  { id: 'L6', level: 6, memLevel: 9, strategy: constants.Z_DEFAULT_STRATEGY, weight: 4 },
  { id: 'L5', level: 5, memLevel: 9, strategy: constants.Z_DEFAULT_STRATEGY, weight: 12 },
  { id: 'L4', level: 4, memLevel: 9, strategy: constants.Z_DEFAULT_STRATEGY, weight: 1 },

  { id: 'L9 filtered', level: 9, memLevel: 9, strategy: constants.Z_FILTERED, weight: 173 },
  { id: 'L8 filtered', level: 8, memLevel: 9, strategy: constants.Z_FILTERED, weight: 17 },
  { id: 'L7 filtered', level: 7, memLevel: 9, strategy: constants.Z_FILTERED, weight: 1 },
  { id: 'L6 filtered', level: 6, memLevel: 9, strategy: constants.Z_FILTERED, weight: 3 },
  { id: 'L5 filtered', level: 5, memLevel: 9, strategy: constants.Z_FILTERED, weight: 9 },
  { id: 'L4 filtered', level: 4, memLevel: 9, strategy: constants.Z_FILTERED, weight: 2 },

  { id: 'L9 RLE', level: 9, memLevel: 9, strategy: constants.Z_RLE, weight: 27 },
  { id: 'L9 huffman', level: 9, memLevel: 9, strategy: constants.Z_HUFFMAN_ONLY, weight: 16 },
];
