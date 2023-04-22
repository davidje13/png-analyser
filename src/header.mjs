const PNG_HEADER = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export function checkHeader(data, warnings) {
  let exactMatch = true;
  for (let i = 0; i < PNG_HEADER.length; ++i) {
    if (data[i] !== PNG_HEADER[i]) {
      exactMatch = false;
      break;
    }
  }
  if (exactMatch) {
    return PNG_HEADER.length;
  }

  const begin = data.indexOf('IHDR', 'utf8');
  let escPos = data.indexOf(26);

  if (begin === 0) {
    warnings.push('Malformed header (missing)');
    return 0;
  }

  if (data[0] !== 137) {
    if (data[0] === 137 & 0x7F) {
      warnings.push('Malformed header (possibly sent via 7-bit channel)');
    } else {
      throw new Error('Not a PNG file!');
    }
  }
  if (data[1] !== 80 || data[2] !== 78 || data[3] !== 71) {
    warnings.push('Incorrect PNG header');
  }

  if (data[4] === 10) {
    if (data[5] === 13) {
      warnings.push('Malformed header (transfer error: CR-LF converted to LF-CR)');
    } else if (data[5] === 26) {
      warnings.push('Malformed header (transfer error: CR-LF converted to LF)');
    } else {
      warnings.push('Malformed header (transfer error: CR-LF converted to LF + ??)');
    }
  } else if (data[4] === 26) {
    warnings.push('Malformed header (transfer error: CR-LF removed)');
  } else if (data[4] !== 13) {
    warnings.push('Malformed header (transfer error: CR-LF converted to unknown symbol)');
  }
  if (escPos === -1 || escPos > 10) {
    warnings.push('Malformed header (transfer error: ESC removed)');
    escPos = 6;
  }
  let p = escPos;
  if (data[escPos + 1] === 13) {
    if (data[escPos + 2] === 10) {
      warnings.push('Malformed header (transfer error: LF converted to CR-LF)');
      p += 2;
    } else {
      warnings.push('Malformed header (transfer error: LF converted to CR)');
      p += 1;
    }
  } else if (data[escPos + 1] !== 10) {
    warnings.push('Malformed header (transfer error: LF removed)');
  }
  if (begin > PNG_HEADER.length && begin !== p) {
    warnings.push('Malformed header (extra data before chunks, or incorrect chunk order)');
  }
  return begin;
}
