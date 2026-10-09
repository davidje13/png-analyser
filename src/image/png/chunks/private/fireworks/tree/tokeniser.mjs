import { findIndex, getLatin1, getUTF16BE } from '../../../../../../data/utils.mjs';

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
 *   id: `${string}s`,
 *   type: 's',
 *   value: string,
 * } | {
 *   id: `${string}i`,
 *   type: 'i',
 *   value: number,
 * } | {
 *   id: `${string}f`,
 *   type: 'f',
 *   value: number,
 * } | {
 *   id: `${string}b`,
 *   type: 'b',
 *   value: boolean,
 * } | {
 *   id: `${string}v`,
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
    const full = getLatin1(buf, p, p + 4, warnings);
    p += 4;
    if (buf.getUint8(p) !== 0x7b) { // '{'
      warnings.push(`mkBS expected { after ${full}`);
      continue;
    }
    p++;
    const target = cur;
    switch (full[3]) {
      case 'v': // vector
        stack.push(cur);
        cur = [];
        target.push({
          id: /** @type {`${string}v`} */ (full),
          type: 'v',
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
          id: /** @type {`${string}s`} */ (full),
          type: 's',
          value: getUTF16BE(buf, p + 2, end, warnings),
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
        const value = getLatin1(buf, p, end, warnings);
        switch (full[3]) {
          case 'i': // int
            target.push({
              id: /** @type {`${string}i`} */ (full),
              type: 'i',
              value: Number.parseInt(value, 16),
            });
            break;
          case 'f': // float
            target.push({
              id: /** @type {`${string}f`} */ (full),
              type: 'f',
              value: Number.parseFloat(value),
            });
            break;
          case 'b': // boolean
            target.push({
              id: /** @type {`${string}b`} */ (full),
              type: 'b',
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
  return { id: 'rootv', type: 'v', value: root };
}
