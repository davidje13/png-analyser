import { asBytes, findIndex, toLatin1 } from './data_utils.mjs';

const PNG_HEADER = [137, 80, 78, 71, 13, 10, 26, 10];

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {string[]} warnings
 * @returns {number}
 */
export function checkHeader(data, warnings) {
  const bytes = asBytes(data);
  let exactMatch = true;
  for (let i = 0; i < PNG_HEADER.length; ++i) {
    if (bytes[i] !== PNG_HEADER[i]) {
      exactMatch = false;
      break;
    }
  }
  if (exactMatch) {
    return PNG_HEADER.length;
  }

  const begin = findIndex(bytes, toLatin1('IHDR'));
  let escPos = findIndex(bytes, 26);

  if (begin === 0) {
    warnings.push('Malformed header (missing)');
    return 0;
  }

  if (bytes[0] !== 137) {
    if (bytes[0] === (137 & 0x7F)) {
      warnings.push('Malformed header (possibly sent via 7-bit channel)');
    } else {
      throw new Error('Not a PNG file!');
    }
  }
  if (bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) {
    warnings.push('Incorrect PNG header');
  }

  if (bytes[4] === 10) {
    if (bytes[5] === 13) {
      warnings.push('Malformed header (transfer error: CR-LF converted to LF-CR)');
    } else if (bytes[5] === 26) {
      warnings.push('Malformed header (transfer error: CR-LF converted to LF)');
    } else {
      warnings.push('Malformed header (transfer error: CR-LF converted to LF + ??)');
    }
  } else if (bytes[4] === 26) {
    warnings.push('Malformed header (transfer error: CR-LF removed)');
  } else if (bytes[4] !== 13) {
    warnings.push('Malformed header (transfer error: CR-LF converted to unknown symbol)');
  }
  if (escPos === -1 || escPos > 10) {
    warnings.push('Malformed header (transfer error: ESC removed)');
    escPos = 6;
  }
  let p = escPos;
  if (bytes[escPos + 1] === 13) {
    if (bytes[escPos + 2] === 10) {
      warnings.push('Malformed header (transfer error: LF converted to CR-LF)');
      p += 2;
    } else {
      warnings.push('Malformed header (transfer error: LF converted to CR)');
      p += 1;
    }
  } else if (bytes[escPos + 1] !== 10) {
    warnings.push('Malformed header (transfer error: LF removed)');
  }
  if (begin > PNG_HEADER.length && begin !== p) {
    warnings.push('Malformed header (extra data before chunks, or incorrect chunk order)');
  }
  return begin;
}
