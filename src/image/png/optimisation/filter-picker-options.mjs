import { applyFilters } from './filters.mjs';

/**
 * @typedef {import("./filters.mjs").FilterTargets} FilterTargets
 *
 * @typedef {(rowBytes: Uint8Array[], leftShift: number, filters: FilterTargets) => number[]} FilterPicker
 * @typedef {{
 *   id: string,
 *   weight: number,
 *   picker: FilterPicker,
 * }} FilterPickerOption
 */

/** @type {FilterPickerOption} */ export const FILTER_PICKER_0 = { id: 'all 0', weight: 27, picker: filterPicker_static(0) };
/** @type {FilterPickerOption} */ export const FILTER_PICKER_1 = { id: 'all 1', weight: 28, picker: filterPicker_static(1) };

/** @type {FilterPickerOption[]} */ export const FILTER_PICKER_OPTIONS = [
  // http://www.libpng.org/pub/png/book/chapter09.html
  { id: 'min-sum-abs w=1', weight: 107, picker: filterPicker_minSumAbs(1) },
  { id: 'min-sum-abs w=0.9', weight: 23, picker: filterPicker_minSumAbs(0.9) },
  { id: 'min-sum-abs w=0.8', weight: 26, picker: filterPicker_minSumAbs(0.8) },

  { id: 'dynamic w=1', weight: 142, picker: filterPicker_dynamic(1) },
  { id: 'dynamic w=0.95', weight: 125, picker: filterPicker_dynamic(0.95) },

  FILTER_PICKER_0,
  FILTER_PICKER_1,
  { id: 'all 2', weight: 8, picker: filterPicker_static(2) },
  { id: 'all 3', weight: 1, picker: filterPicker_static(3) },
  { id: 'all 4', weight: 9, picker: filterPicker_static(4) },
];

/**
 * @param {number} filter
 * @return {FilterPicker}
 */
function filterPicker_static(filter) {
  return (rowBytes) => rowBytes.map(() => filter);
}

/**
 * @param {number} weighting
 * @return {FilterPicker}
 */
function filterPicker_minSumAbs(weighting) {
  return function(rowBytes, leftShift, filters) {
    if (!rowBytes.length) {
      return [];
    }

    const sz = rowBytes[0].length;
    let prevRow = new Uint8Array(sz);
    let prevF = -1;

    /** @type {number[]} */ const result = [];
    for (const row of rowBytes) {
      applyFilters(row, prevRow, leftShift, filters);

      let bestF = 0;
      let best = Number.POSITIVE_INFINITY;
      for (let f = 0; f < filters.length; ++f) {
        const filter = filters[f];

        let sum = 0;
        for (let i = 0; i < sz; ++i) {
          const v = filter[i];
          sum += (v >= 128) ? 256 - v : v; // abs(signed(v))
        }
        if (f === prevF) {
          sum *= weighting;
        }
        if (sum < best) {
          bestF = f;
          best = sum;
        }
      }
      prevF = bestF;
      result.push(bestF);
      prevRow = row;
    }
    return result;
  }
}

/**
 * @param {number} hysteresisMult
 * @return {FilterPicker}
 */
function filterPicker_dynamic(hysteresisMult) {
  return function(rowBytes, leftShift, filters) {
    if (!rowBytes.length) {
      return [];
    }

    /**
     * @typedef {{
     *   prev: GraphNode | null;
     *   cost: number;
     *   filter: number;
     *   tokenDistance: Map<number, number>;
     * }} GraphNode
     */

    const sz = rowBytes[0].length;
    const maxDist = 16 * 1024;
    let prevRow = new Uint8Array(sz);
    /** @type {GraphNode[]} */ let prevNodes = [{ prev: null, cost: 0, filter: -1, tokenDistance: new Map() }];
    for (const row of rowBytes) {
      applyFilters(row, prevRow, leftShift, filters);

      /** @type {GraphNode[]} */ const curNodes = [];
      for (let f = 0; f < filters.length; ++f) {
        const filter = filters[f];

        /** @type {Map<number, number>} */ const tokenFrequency = new Map();
        /** @type {Map<number, number>} */ const tokenDistance = new Map();
        for (let i = 0; i < sz - 2; ++i) {
          const token = filter[i] | (filter[i + 1] << 8) | (filter[i + 2] << 16);
          tokenFrequency.set(token, (tokenFrequency.get(token) ?? 0) + 1);
          tokenDistance.set(token, sz - i);
        }

        let best = prevNodes[0];
        let bestCost = Number.POSITIVE_INFINITY;
        for (const prev of prevNodes) {
          let joinCost = 0;
          for (const [v, freq] of tokenFrequency) {
            const distance = prev.tokenDistance.get(v) ?? maxDist;
            if (distance >= maxDist) {
              joinCost += 24;
            } else {
              joinCost += 4 + (Math.log2(distance)|0);
            }
            joinCost += (freq - 1) * 7;
          }
          if (prev.filter === f) {
            joinCost *= hysteresisMult;
          }
          if (joinCost < bestCost) {
            best = prev;
            bestCost = joinCost;
          }
        }
        for (const [v, dist] of best.tokenDistance) {
          if (dist + sz < maxDist && !tokenDistance.has(v)) {
            tokenDistance.set(v, dist + sz);
          }
        }
        curNodes.push({ prev: best, cost: best.cost + bestCost, filter: f, tokenDistance: tokenDistance });
      }
      for (const prev of prevNodes) {
        // remove old token values to reduce RAM usage
        /** @type {any} */ (prev.tokenDistance) = null;
      }
      prevNodes = curNodes;
      prevRow = row;
    }

    let best = prevNodes[0];
    for (const prev of prevNodes) {
      if (prev.cost < best.cost) {
        best = prev;
      }
    }
    const filterChoices = [];
    while (best.prev) {
      filterChoices.push(best.filter);
      best = best.prev;
    }
    filterChoices.reverse();
    return filterChoices;
  }
}
