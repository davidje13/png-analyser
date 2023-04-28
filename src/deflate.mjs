import { inflate as pakoInflate, inflateRaw as pakoInflateRaw } from './zlib/pako_inflate.mjs';
import { asDataView, asBytes } from './data_utils.mjs';

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {DataView}
 */
export function inflate(data) {
  return asDataView(pakoInflate(asBytes(data)));
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {DataView}
 */
export function inflateRaw(data) {
  return asDataView(pakoInflateRaw(asBytes(data)));
}
