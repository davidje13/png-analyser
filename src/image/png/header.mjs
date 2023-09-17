import { asBytes, asDataView, findIndex, subViewFrom, toLatin1 } from '../../data/utils.mjs';

const PNG_HEADER            = [137, 80, 78, 71, 13, 10, 26, 10];
const PNG_HEADER_LF_TO_CRLF = [137, 80, 78, 71, 13, 13, 10, 26, 13, 10];

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isPerfectPNGHeader(data) {
  return checkMatch(asBytes(data), PNG_HEADER);
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {string[]} warnings
 * @returns {DataView | null}
 */
export function checkHeader(data, warnings) {
  const bytes = asBytes(data);
  if (checkMatch(bytes, PNG_HEADER)) {
    return subViewFrom(data, PNG_HEADER.length);
  }
  if (checkMatch(bytes, PNG_HEADER_LF_TO_CRLF)) {
    warnings.push('Malformed header (transfer error: LF converted to CR-LF) - auto-patching');
    const headLength = PNG_HEADER_LF_TO_CRLF.length;
    // this corruption is reversible
    let count = 0;
    for (let i = headLength; i < bytes.byteLength - 1; ++i) {
      if (bytes[i] === 13 && bytes[i + 1] === 10) {
        ++count;
      }
    }
    const patched = new Uint8Array(bytes.byteLength - headLength - count);
    for (let i = headLength, j = 0; i < bytes.byteLength; ++i, ++j) {
      if (bytes[i] === 13 && bytes[i + 1] === 10) {
        patched[j] = 10;
        ++i;
      } else {
        patched[j] = bytes[i];
      }
    }
    return asDataView(patched);
  }

  const begin = findIndex(bytes, toLatin1('IHDR'));
  let escPos = findIndex(bytes, 26);

  if (begin === 0) {
    warnings.push('Malformed header (missing)');
    return asDataView(data);
  }

  if (bytes[0] !== 137) {
    if (bytes[0] === (137 & 0x7F)) {
      warnings.push('Malformed header (possibly sent via 7-bit channel)');
    } else {
      warnings.push('Not a PNG file!');
      return null;
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
    warnings.push('Malformed header (transfer error: LF converted to CR)');
    p += 1;
  } else if (bytes[escPos + 1] !== 10) {
    warnings.push('Malformed header (transfer error: LF removed)');
  }
  if (begin > PNG_HEADER.length && begin !== p) {
    warnings.push('Malformed header (extra data before chunks, or incorrect chunk order)');
  }
  return null;
}

/**
 * @param {Uint8Array} bytes
 * @param {number[]} compare
 * @returns {boolean}
 */
function checkMatch(bytes, compare) {
  for (let i = 0; i < compare.length; ++i) {
    if (bytes[i] !== compare[i]) {
      return false;
    }
  }
  return true;
}
