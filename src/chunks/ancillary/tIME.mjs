import { registerChunk } from '../registry.mjs';

registerChunk('tIME', { max: 1 }, (chunk, state, warnings) => {
  state.time = chunk;
  if (chunk.data.length !== 7) {
    warnings.push(`tIME length ${chunk.data.length} is not 7`);
  }
  chunk.year = chunk.data.readUInt16BE(0);
  chunk.month = chunk.data[2];
  chunk.day = chunk.data[3];
  chunk.hour = chunk.data[4];
  chunk.minute = chunk.data[5];
  chunk.second = chunk.data[6];

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
