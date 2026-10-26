import { asDataView } from './utils.mjs';

/**
 * @param {ArrayBuffer | ArrayBufferView<ArrayBuffer>} data
 * @return {Promise<DataView>}
 */
export async function inflate(data) {
  return asDataView(await new Response(
    new Blob([data])
      .stream()
      .pipeThrough(new DecompressionStream('deflate')),
  ).bytes());
}

/**
 * @param {ArrayBuffer | ArrayBufferView<ArrayBuffer>} data
 * @return {Promise<DataView>}
 */
export async function inflateRaw(data) {
  return asDataView(await new Response(
    new Blob([data])
      .stream()
      .pipeThrough(new DecompressionStream('deflate-raw')),
  ).bytes());
}
