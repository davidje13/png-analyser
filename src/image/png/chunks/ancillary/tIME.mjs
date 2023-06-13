import { registerChunk } from '../registry.mjs';

/**
 * @typedef {import('../registry.mjs').State & {
 *   time?: tIMEChunk,
 * }} tIMEState
 * @typedef {import('../registry.mjs').Chunk & {
 *   year?: number,
 *   month?: number,
 *   day?: number,
 *   hour?: number,
 *   minute?: number,
 *   second?: number,
 * }} tIMEChunk
 */

registerChunk('tIME', { max: 1 }, (/** @type {tIMEChunk} */ chunk, /** @type {tIMEState} */ state, warnings) => {
  state.time = chunk;
  if (chunk.data.byteLength !== 7) {
    warnings.push(`tIME length ${chunk.data.byteLength} is not 7`);
  }
  chunk.year = chunk.data.getUint16(0);
  chunk.month = chunk.data.getUint8(2);
  chunk.day = chunk.data.getUint8(3);
  chunk.hour = chunk.data.getUint8(4);
  chunk.minute = chunk.data.getUint8(5);
  chunk.second = chunk.data.getUint8(6);

  if (chunk.month < 1 || chunk.month > 12) {
    warnings.push(`invalid month ${chunk.month} in tIME chunk`);
  }
  if (chunk.day < 1 || chunk.day > 31) {
    warnings.push(`invalid day ${chunk.day} in tIME chunk`);
  }
  if (chunk.hour > 23) {
    warnings.push(`invalid hour ${chunk.hour} in tIME chunk`);
  }
  if (chunk.minute > 59) {
    warnings.push(`invalid minute ${chunk.minute} in tIME chunk`);
  }
  if (chunk.second > 60) {
    warnings.push(`invalid second ${chunk.second} in tIME chunk`);
  }
});
