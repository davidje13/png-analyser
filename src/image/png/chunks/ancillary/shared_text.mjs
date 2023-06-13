/**
 * @typedef {import('../registry.mjs').State & {
 *   texts?: textChunk[],
 * }} textState
 *
 * @typedef {import('../registry.mjs').Chunk & {
 *   keyword?: string,
 *   isCompressed?: boolean,
 *   compressionMethod?: number,
 *   languageTag?: string,
 *   translatedKeyword?: string,
 *   value?: string,
 * }} textChunk
 */

/**
 * @param {textChunk} chunk
 * @return {string}
 */
function getSummary(chunk) {
  /** @type {string[]} */ const r = [];
  if (chunk.translatedKeyword) {
    r.push(`${chunk.translatedKeyword} [${chunk.keyword} ${chunk.languageTag}]`);
  } else if (chunk.languageTag) {
    r.push(`${chunk.keyword} ${chunk.languageTag}`);
  } else {
    r.push(chunk.keyword ?? '');
  }
  if (chunk.isCompressed) {
    r.push(' - compressed');
  }
  return r.join('');
}

/**
 * @param {textChunk} chunk
 * @return {string}
 */
export function textWrite(chunk) {
  return getSummary(chunk) + '\n' + (chunk.value ?? '');
}

/**
 * @param {textChunk} chunk
 * @param {HTMLElement} summary
 * @param {HTMLElement} content
 */
export function textDisplay(chunk, summary, content) {
  summary.append(getSummary(chunk));
  content.append(chunk.value ?? '');
}
