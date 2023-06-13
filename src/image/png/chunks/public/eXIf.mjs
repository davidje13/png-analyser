import { asBytes } from '../../../../data/utils.mjs';
import { debugWrite } from '../../../../display/pretty.mjs';
import { registerChunk } from '../registry.mjs';

registerChunk('eXIf', { max: 1 }, (chunk, state, warnings) => {
  const bytes = asBytes(chunk.data);
  let littleEndian = false;
  if (bytes[0] === 73 && bytes[1] === 73) {
    littleEndian = true; // 16-bit little endian
  } else if (bytes[0] === 77 && bytes[1] === 77) {
    // 16-bit big endian
  } else {
    warnings.push('Unknown endianness of eXIf data');
    return;
  }
  // TODO
  chunk.toString = () => debugWrite(bytes);
});
