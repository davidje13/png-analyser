/**
 * @typedef {[Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]} FilterTargets
 */

/**
 * @param {number[][]} image
 * @return {FilterTargets}
 */
export function makeFilterTargets(image) {
  // allocate maximum possible row size (RGBA 8-bit)
  const size = 1 + image[0].length * 4;
  const FILTER_COUNT = 5;
  const all = new Uint8Array(size * FILTER_COUNT);
  const filters = [];
  for (let i = 0; i < FILTER_COUNT; ++i) {
    filters[i] = all.subarray(i * size, (i + 1) * size);
    filters[i][0] = i;
  }
  return /** @type {FilterTargets} */ (filters);
}

/**
 * @param {Uint8Array} row
 * @param {Uint8Array} prevRow
 * @param {number} leftShift
 * @param {FilterTargets} filtersOut
 */
export function applyFilters(row, prevRow, leftShift, filtersOut) {
  for (let i = 0; i < row.length; ++i) {
    const above = prevRow[i];
    const aboveLeft = prevRow[i - leftShift] ?? 0;
    const left = row[i - leftShift] ?? 0;
    const value = row[i];
    const base = left + above - aboveLeft;
    const dL = Math.abs(left - base);
    const dA = Math.abs(above - base);
    const dD = Math.abs(aboveLeft - base);
    const paeth = (dL <= dA && dL <= dD) ? left : (dA <= dD) ? above : aboveLeft;
    filtersOut[0][i + 1] = value;
    filtersOut[1][i + 1] = (value - left) & 0xFF;
    filtersOut[2][i + 1] = (value - above) & 0xFF;
    filtersOut[3][i + 1] = (value - ((left + above) >>> 1)) & 0xFF;
    filtersOut[4][i + 1] = (value - paeth) & 0xFF;
  }
}
