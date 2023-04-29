import { findIndex, getLatin1, getUTF16BE } from '../../../../data_utils.mjs';

// mkTS and mkBS contain content like:
// MKBv{FRCi{1}XLCi{0}LYLv{LAYv{BKGb{0}}}}

// 3-char node names, 1-char node types, {}-wrapped node content
// i = int (base 16, encoded as ASCII text)
// f = float (base 10, encoded as ASCII text)
// b = boolean (0 or 1, encoded as ASCII text)
// s = string (2-byte big-endian number-of-characters, then text encoded as utf16-BE)
// v = vector (contains other nodes)

/**
 * @typedef {{
 *   name: string,
 *   type: 's',
 *   value: string,
 * } | {
 *   name: string,
 *   type: 'i',
 *   value: number,
 * } | {
 *   name: string,
 *   type: 'f',
 *   value: number,
 * } | {
 *   name: string,
 *   type: 'b',
 *   value: boolean,
 * } | {
 *   name: string,
 *   type: 'v',
 *   value: NodeToken[],
 * }} NodeToken
 */

/**
 * @param {DataView} buf
 * @param {string[]} warnings
 * @return {NodeToken}
 */
export function tokenise(buf, warnings) {
  /** @type {NodeToken[]} */ const root = [];
  /** @type {NodeToken[][]} */ const stack = [];
  let cur = root;
  for (let p = 0; p < buf.byteLength;) {
    if (buf.getUint8(p) === 0x7d) { // '}'
      const c = stack.pop();
      if (!c) {
        warnings.push('mkBS unexpected }');
      } else {
        cur = c;
      }
      ++p;
      continue;
    }
    const full = getLatin1(buf, p, p + 4);
    const name = full.substring(0, 3);
    const type = full[3];
    p += 4;
    if (buf.getUint8(p) !== 0x7b) { // '{'
      warnings.push(`mkBS expected { after ${full}`);
      continue;
    }
    p++;
    const target = cur;
    switch (type) {
      case 'v': // vector
        stack.push(cur);
        cur = [];
        target.push({
          name,
          type,
          value: cur,
        });
        break;
      case 's': { // string
        const len = buf.getUint16(p);
        const end = p + 2 + len * 2;
        if (buf.getUint8(end) !== 0x7d) { // '}'
          warnings.push(`mkBS expected } after ${full}`);
        }
        target.push({
          name,
          type,
          value: getUTF16BE(buf, p + 2, end),
        });
        p = end + 1;
        break;
      }
      default: {
        let end = findIndex(buf, 0x7d, p); // '}'
        if (end === -1) {
          warnings.push(`mkBS missing } for ${full}`);
          end = buf.byteLength;
        }
        const value = getLatin1(buf, p, end);
        switch (type) {
          case 'i': // int
            target.push({
              name,
              type,
              value: Number.parseInt(value, 16),
            });
            break;
          case 'f': // float
            target.push({
              name,
              type,
              value: Number.parseFloat(value),
            });
            break;
          case 'b': // boolean
            target.push({
              name,
              type,
              value: value !== '0',
            });
            break;
          default:
            warnings.push(`mkBS unknown type ${full}`);
        }
        p = end + 1;
        break;
      }
    }
  }
  if (stack.length) {
    warnings.push('mkBS missing }');
  }
  return { name: 'root', type: 'v', value: root };
}
