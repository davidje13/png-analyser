/**
 * @typedef {{
 *   state: number,
 *   num: number,
 *   data: ArrayBufferView[],
 * }} Frame
 *
 * @typedef {import('../registry.mjs').State & {
 *   nextSequenceNumber?: number,
 *   apngCurrentFrame?: Frame,
 * }} apngState
 */
