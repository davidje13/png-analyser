import { deflate as deflatePako, deflateRaw as deflateRawPako } from '../../../third-party/pako-deflate.min.mjs';
import { applyFilters, makeFilterTargets } from './filters.mjs';
import { ByteArrayBuilder } from '../../../data/builder.mjs';

/**
 * @typedef {{
 *   level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
 *   windowBits?: number | undefined;
 *   memLevel?: number | undefined;
 *   strategy?: number | undefined;
 * }} DeflateFunctionOptions
 *
 * @typedef {(data: Uint8Array, opts: DeflateFunctionOptions) => (ArrayBufferView | undefined)} DeflateFn
 */

/** @type {DeflateFn} */ let deflate = deflatePako;
/** @type {DeflateFn} */ let deflateRaw = deflateRawPako;

if (typeof process !== 'undefined') {
  const { deflateSync, deflateRawSync } = await import('node:zlib');
  deflate = deflateSync;
  deflateRaw = deflateRawSync;
}

/**
 * @typedef {import('./encoding-options.mjs').EncodingOption} EncodingOption
 * @typedef {import('./filter-picker-options.mjs').FilterPickerOption} FilterPickerOption
 * @typedef {import('./zlib-config-options.mjs').ZLibConfigOption} ZLibConfigOption
 *
 * @typedef {{
 *   encoding: EncodingOption;
 *   compressed: ArrayBufferView;
 *   size: number;
 *   attemptNumber: number;
 *   zlibConfig: string;
 *   filterPicker: string;
 * }} EncodingChoice
 */

/**
 * @param {number[][]} image
 * @param {EncodingOption[]} encodingOptions
 * @param {FilterPickerOption[]} filterPickerOptions
 * @param {ZLibConfigOption[]} zlibConfigOptions
 * @param {number=} timeout
 *
 * @return {{ choice: EncodingChoice, totalAttempts: number, idatCacheMisses: number }}
 */
export function findOptimalCompression(image, encodingOptions, filterPickerOptions, zlibConfigOptions, timeout = Number.POSITIVE_INFINITY) {
  const options = encodingOptions.flatMap((encoding) =>
    filterPickerOptions.flatMap((filterPicker) =>
      zlibConfigOptions.flatMap((zlibConfig) => ({
        encoding,
        filterPicker,
        zlibConfig,
        weight: encoding.weight * filterPicker.weight * zlibConfig.weight,
      }))
    )
  );
  if (Number.isFinite(timeout)) {
    // sort by descending weight
    // (but only if we are capping the search - else it's more optimal to keep them in the default order)
    options.sort((a, b) => b.weight - a.weight);
  }

  const IDAT_CACHE_MAX_SIZE = 20;
  let idatCacheMisses = 0;
  let idatID = 0;
  const filters = makeFilterTargets(image);
  const VOID_ROW = new Uint8Array(filters[0].length);

  /**
   * @typedef {{
   *   mapped: Uint8Array[],
   *   attemptedRowFilters: number[][],
   *   filterCache: Map<string, { rowFilters: number[], idatID: number } | false>,
   * }} EncodingState
   */

  /** @type {Map<EncodingOption, EncodingState>} */ const encodingCache = new Map();
  /** @type {Map<number, ByteArrayBuilder>} */ const idatCache = new Map();

  let attempt = 0;
  /** @type {EncodingChoice | null} */ let choice = null;
  for (const { encoding, filterPicker, zlibConfig } of options) {
    let encState = encodingCache.get(encoding);
    if (!encState) {
      const mapped = image.map(encoding.rowMapper);
      encState = { mapped, attemptedRowFilters: [], filterCache: new Map() };
      encodingCache.set(encoding, encState);
    }

    let filterState = encState.filterCache.get(filterPicker.id);
    if (!filterState) {
      if (filterState === false) {
        continue;
      }
      const rowFilters = filterPicker.picker(encState.mapped, encoding.filterStep, filters);
      if (encState.attemptedRowFilters.some((row) => row.every((v, i) => rowFilters[i] === v))) {
        encState.filterCache.set(filterPicker.id, false);
        continue; // already tried this set of filters
      }
      encState.attemptedRowFilters.push(rowFilters);

      ++idatID;
      filterState = { rowFilters, idatID };
      encState.filterCache.set(filterPicker.id, filterState);
    }

    const sz = encState.mapped[0].length;

    let idat = idatCache.get(filterState.idatID);
    if (!idat) {
      if (filterState.idatID !== idatID) {
        ++idatCacheMisses;
      }

      if (idatCache.size > IDAT_CACHE_MAX_SIZE) {
        const oldestKey = idatCache.keys().next().value ?? Number.NEGATIVE_INFINITY;
        idat = idatCache.get(oldestKey) ?? new ByteArrayBuilder();
        idat.truncate(0);
        idatCache.delete(oldestKey);
      } else {
        idat = new ByteArrayBuilder();
      }

      /** @type {Uint8Array} */ let prev = VOID_ROW;
      for (let r = 0; r < encState.mapped.length; ++r) {
        const row = encState.mapped[r];
        const rowFilterType = filterState.rowFilters[r];
        applyFilters(row, prev, encoding.filterStep, filters);
        idat.append(filters[rowFilterType], 0, sz + 1);
        prev = row;
      }

      idatCache.set(filterState.idatID, idat);
    }

    ++attempt;
    const o = compress(idat.toBytes(), encoding.plte, encoding.trns, zlibConfig);
    if (!choice || o.size < choice.size) {
      choice = {
        encoding,
        compressed: o.compressed,
        size: o.size,
        zlibConfig: zlibConfig.id,
        filterPicker: filterPicker.id,
        attemptNumber: attempt,
      };
    }
    if (Date.now() >= timeout) {
      break;
    }
  }

  if (!choice) {
    throw new Error('Failed to encode image');
  }

  return {
    choice,
    totalAttempts: attempt,
    idatCacheMisses,
  };
}

/**
 * @param {Uint8Array} idat
 * @param {ArrayBufferView | undefined} plte
 * @param {ArrayBufferView | undefined} trns
 * @param {ZLibConfigOption} zlibConfig
 * @return {{ compressed: ArrayBufferView, size: number }}
 */
function compress(idat, plte, trns, zlibConfig) {
  let windowBits = 8; // Z_MIN_WINDOWBITS
  while (windowBits < 15 && (1 << windowBits) < idat.byteLength) { // window size <= 32kB
    ++windowBits;
  }
  const compressor = zlibConfig.raw ? deflateRaw : deflate;
  const compressed = compressor(idat, { // method=8, no dictionary
    windowBits,
    level: zlibConfig.level,
    memLevel: zlibConfig.memLevel,
    strategy: zlibConfig.strategy,
  });
  if (!compressed) {
    throw new Error('unable to compress');
  }
  const size = (
    compressed.byteLength +
    (plte?.byteLength ? 12 + plte.byteLength : 0) +
    (trns?.byteLength ? 12 + trns.byteLength : 0)
  );
  return { compressed, size };
}
