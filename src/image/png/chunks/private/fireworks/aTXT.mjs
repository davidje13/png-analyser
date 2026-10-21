import { findIndex, getLatin1, getUTF16BE } from '../../../../../data/utils.mjs';
import { registerChunk } from '../../registry.mjs';

registerChunk('aTXT', {}, async (chunk, state, warnings) => {
  const tokens = tokeniseATXT(chunk.data, warnings);
  const structure = parseATXT(tokens, warnings);
  chunk.toString = () => JSON.stringify(structure, undefined, 2);
  chunk.display = (summary, content, filename) => {
    content.append(JSON.stringify(structure, undefined, 2));
  };
});

/**
 * @typedef {(
 *   { type: '<' } |
 *   { type: '[' } |
 *   { type: '>' } |
 *   { type: ']' } |
 *   { type: 'v', value: string }
 * )} ATXTToken
 *
 * @typedef {{ [k: string]: ATXTValue }} ATXTObject
 * @typedef {ATXTValue[]} ATXTArray
 * @typedef {string | ATXTObject | ATXTArray} ATXTValue
 */

/**
 * @param {DataView} buf
 * @param {string[]} warnings
 * @return {ATXTToken[]}
 */
function tokeniseATXT(buf, warnings) {
  /** @type {ATXTToken[]} */ const tokens = [];
  for (let p = 0; p < buf.byteLength;) {
    const c = buf.getUint8(p);
    const c2 = p + 1 === buf.byteLength ? -1 : buf.getUint8(p + 1);
    switch (c) {
      case 0x20: // ' '
        ++p;
        break;
      case 0x2F: { // '/'
        ++p;
        let end = findIndex(buf, 0x20, p);
        if (end === -1) {
          end = buf.byteLength;
        }
        tokens.push({ type: 'v', value: getLatin1(buf, p, end, warnings) });
        p = end + 1;
        break;
      }
      case 0x3C: // '<'
        if (c2 === 0x3C) { // '<'
          tokens.push({ type: '<' });
          p += 2;
        } else {
          warnings.push('aTXT: "<" not part of "<<"');
          ++p;
        }
        break;
      case 0x3E: // '>'
        if (c2 === 0x3E) { // '>'
          tokens.push({ type: '>' });
          p += 2;
        } else {
          warnings.push('aTXT: ">" not part of ">>"');
          ++p;
        }
        break;
      case 0x5B: // '['
        if (c2 === -1 || c2 === 0x20) { // ' '
          tokens.push({ type: '[' });
          p += 2;
        } else {
          warnings.push('aTXT: "[" not part of "[ "');
          ++p;
        }
        break;
      case 0x5D: // ']'
        if (c2 === -1 || c2 === 0x20) { // ' '
          tokens.push({ type: ']' });
          p += 2;
        } else {
          warnings.push('aTXT: "]" not part of "] "');
          ++p;
        }
        break;
      case 0x28: // '{'
        // BOM
        if (p + 3 > buf.byteLength || c2 !== 0xfe || buf.getUint8(p + 2) !== 0xff) {
          warnings.push('aTXT: quoted string without 0xfeff BOM');
          ++p;
        } else {
          p += 3;
        }
        const begin = p;
        while (true) {
          if (p + 2 > buf.byteLength) {
            warnings.push('aTXT: unterminated quoted string');
            p = buf.byteLength;
            break;
          }
          if (buf.getUint8(p) === 0x29 && buf.getUint8(p + 1) === 0x20) { // ') '
            break;
          }
          p += 2;
        }
        tokens.push({ type: 'v', value: getUTF16BE(buf, begin, p, warnings) });
        ++p;
        break;
      default: {
        let end = findIndex(buf, 0x20, p);
        if (end === -1) {
          end = buf.byteLength;
        }
        tokens.push({ type: 'v', value: getLatin1(buf, p, end, warnings) });
        p = end + 1;
        break;
      }
    }
  }
  return tokens;
}

/**
 * @param {ATXTToken[]} tokens
 * @param {string[]} warnings
 */
function parseATXT(tokens, warnings) {
  /** @type {ATXTObject} */ const root = {};
  /** @type {(ATXTObject | ATXTArray)[]} */ const stack = [];
  /** @type {ATXTObject | ATXTArray} */ let cur = root;
  /** @type {string | null} */ let key = null;

  /** @param {ATXTValue} value */
  const add = (value) => {
    if (Array.isArray(cur)) {
      cur.push(value);
    } else if (key === null) {
      warnings.push(`aTXT: value without key: ${JSON.stringify(value)}`);
    } else {
      if (cur[key] !== undefined) {
        if (Object.prototype.hasOwnProperty.call(cur, key)) {
          warnings.push(`aTXT: multiple values for ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
        } else {
          Object.defineProperty(cur, key, { value });
        }
      } else {
        cur[key] = value;
      }
      key = null;
    }
  };

  for (const token of tokens) {
    switch (token.type) {
      case 'v':
        if (Array.isArray(cur)) {
          cur.push(token.value);
        } else if (key === null) {
          key = token.value;
        } else {
          add(token.value);
        }
        break;
      case '<': {
        /** @type {ATXTObject} */ const next = {};
        add(next);
        stack.push(cur);
        cur = next;
        break;
      }
      case '[': {
        /** @type {ATXTArray} */ const next = [];
        add(next);
        stack.push(cur);
        cur = next;
        break;
      }
      case '>': {
        if (Array.isArray(cur)) {
          warnings.push('aTXT: unterminated array');
          return root;
        }
        if (key) {
          warnings.push('aTXT: object ends with key without value');
          key = null;
        }
        const v = stack.pop();
        if (!v) {
          warnings.push('aTXT: unbalanced objects');
          return root;
        }
        cur = v;
        break;
      }
      case ']': {
        if (!Array.isArray(cur)) {
          warnings.push('aTXT: unterminated object');
          return root;
        }
        const v = stack.pop();
        if (!v) {
          warnings.push('aTXT: unbalanced array');
          return root;
        }
        cur = v;
        break;
      }
    }
  }
  if (stack.length) {
    warnings.push(`aTXT: unterminated entities: ${stack.length}`);
  }
  return root;
}
