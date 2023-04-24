export function readNested(buf, warnings) {
  const root = [];
  const stack = [];
  let cur = root;
  for (let p = 0; p < buf.length;) {
    if (buf[p] === 0x7d) { // '}'
      if (!stack.length) {
        warnings.push('mkBS unexpected }');
      } else {
        cur = stack.pop();
      }
      ++p;
      continue;
    }
    const name = buf.subarray(p, p + 3).toString('latin1');
    const type = buf[p + 3];
    p += 4;
    if (buf[p] !== 0x7b) { // '{'
      warnings.push(`mkBS expected { after ${name}${String.fromCharCode(type)}`);
      continue;
    }
    p++;
    const target = cur;
    let value;
    switch (type) {
      case 0x76: // 'v' (vector)
        value = [];
        stack.push(cur);
        cur = value;
        break;
      case 0x73: { // 's' (string)
        const len = buf.readUInt16BE(p);
        const end = p + 2 + len * 2;
        value = buf.subarray(p + 2, end).swap16().toString('utf16le');
        if (buf[end] !== 0x7d) { // '}'
          warnings.push(`mkBS expected } after ${name}${String.fromCharCode(type)}`);
        }
        p = end + 1;
        break;
      }
      case 0x69: // 'i' (int)
      case 0x66: // 'f' (float)
      case 0x62: { // 'b' (boolean)
        let end = buf.indexOf(0x7d, p); // '}'
        if (end === -1) {
          warnings.push(`mkBS missing } for ${name}${String.fromCharCode(type)}`);
          end = buf.length;
        }
        value = buf.subarray(p, end).toString('latin1');
        switch (type) {
          case 0x69: // 'i' (int)
            value = Number.parseInt(value, '16');
            break;
          case 0x66: // 'f' (float)
            value = Number.parseFloat(value);
            break;
          case 0x62: // 'b' (boolean)
            value = value !== '0';
            break;
        }
        p = end + 1;
        break;
      }
      default:
        warnings.push(`mkBS unknown type ${name}${String.fromCharCode(type)}`);
    }
    target.push({ name, value });
  }
  if (stack.length) {
    warnings.push('mkBS missing }');
  }
  return root;
}
