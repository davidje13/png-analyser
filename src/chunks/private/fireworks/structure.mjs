// mkTS and mkBS contain content like:

import { findIndex, getLatin1, getUTF16BE } from '../../../data_utils.mjs';

// MKBv{FRCi{1}XLCi{0}LYLv{LAYv{BKGb{0}}}}

// 3-char node names, 1-char node types, {}-wrapped node content
// i = int (base 16, encoded as ASCII text)
// f = float (base 10, encoded as ASCII text)
// b = boolean (0 or 1, encoded as ASCII text)
// s = string (2-byte big-endian number-of-characters, then text encoded as utf16-BE)
// v = vector (contains other nodes)

// some details seem to be documented here:
// https://help.adobe.com/archive/en_US/fireworks/cs5/fireworks_cs5_extending.pdf
// (e.g. EffectMoaID values)

// TID seems to reference tiles from mkBT
// TIL combines TID tiles

/**
 * @typedef {string | number | boolean | Node[] | undefined} Value
 *
 * @typedef {{
 *   name: string,
 *   value: Value,
 * }} Node
 */

/**
 * @param {DataView} buf
 * @param {string[]} warnings
 * @return {Node}
 */
export function readNested(buf, warnings) {
  /** @type {Node[]} */ const root = [];
  /** @type {Node[][]} */ const stack = [];
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
    const name = getLatin1(buf, p, p + 3);
    const type = buf.getUint8(p + 3);
    p += 4;
    if (buf.getUint8(p) !== 0x7b) { // '{'
      warnings.push(`mkBS expected { after ${name}${String.fromCharCode(type)}`);
      continue;
    }
    p++;
    const target = cur;
    /** @type {Value} */ let value = undefined;
    switch (type) {
      case 0x76: // 'v' (vector)
        value = [];
        stack.push(cur);
        cur = value;
        break;
      case 0x73: { // 's' (string)
        const len = buf.getUint16(p);
        const end = p + 2 + len * 2;
        value = getUTF16BE(buf, p + 2, end);
        if (buf.getUint8(end) !== 0x7d) { // '}'
          warnings.push(`mkBS expected } after ${name}${String.fromCharCode(type)}`);
        }
        p = end + 1;
        break;
      }
      case 0x69: // 'i' (int)
      case 0x66: // 'f' (float)
      case 0x62: { // 'b' (boolean)
        let end = findIndex(buf, 0x7d, p); // '}'
        if (end === -1) {
          warnings.push(`mkBS missing } for ${name}${String.fromCharCode(type)}`);
          end = buf.byteLength;
        }
        value = getLatin1(buf, p, end);
        switch (type) {
          case 0x69: // 'i' (int)
            value = Number.parseInt(value, 16);
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
  return { name: '', value: root };
}

const KNOWN_KEYS = new Map();

/**
 * @param {Node} node
 */
const DEFAULT_READ_V = ({ value }) => {
  if (!Array.isArray(value)) {
    return value;
  }
  const data = new Map();
  for (const o of value) {
    let key = o.name;
    let value = o.value;
    if (o.name === 'DCE') {
      key = o.value.DCK;
      value = o.value.DCV;
    }
    let v = data.get(key);
    if (!v) {
      v = [];
      data.set(key, v);
    }
    v.push(value);
  }
  for (const k of data.keys()) {
    const v = data.get(k);
    if (v.length === 1) {
      data.set(k, v[0]);
    }
  }
  return mapToDict(data);
};

const listOf = (childTag) => ({
  readV: ({ name, value, findChildren }) => {
    const items = findChildren(childTag);
    if (items.length !== value.length) {
      const mismatch = value.map((v) => v.name).filter((name) => name !== childTag);
      throw new Error(`Unexpected non-${childTag} in ${name}: ${mismatch.join(', ')}`);
    }
    return items.map((o) => o.value);
  },
});

const sizedListOf = (lengthTag, childTag) => ({
  readV: ({ name, value, findChild, findChildren }) => {
    const count = findChild(lengthTag);
    const items = findChildren(childTag);
    if (!count) {
      throw new Error(`Missing ${lengthTag} in ${name}`);
    }
    if (items.length + 1 !== value.length) {
      throw new Error(`Unexpected non-${childTag} in ${name}`);
    }
    if (count.value !== items.length) {
      throw new Error(`${name} length in ${lengthTag} does not match count of ${childTag}`);
    }
    return items.map((o) => o.value);
  },
});

KNOWN_KEYS.set('GRD', {}); // GRiD
KNOWN_KEYS.set('GOX', {}); // Grid Offset X
KNOWN_KEYS.set('GOY', {}); // Grid Offset Y
KNOWN_KEYS.set('GSX', {}); // Grid Size X
KNOWN_KEYS.set('GSY', {}); // Grid Size Y
KNOWN_KEYS.set('GCL', {}); // Grid CoLour

KNOWN_KEYS.set('WID', {}); // WIDth
KNOWN_KEYS.set('HIT', {}); // HeIghT
KNOWN_KEYS.set('RES', {}); // RESolution (DPI)
KNOWN_KEYS.set('BGC', {}); // BackGround Colour

KNOWN_KEYS.set('PDC', {}); // Page ???
KNOWN_KEYS.set('PGN', {}); // PaGe Name

KNOWN_KEYS.set('LYL', listOf('LAY')); // LaYer List of LAYer
KNOWN_KEYS.set('LNM', {}); // Layer NaMe
KNOWN_KEYS.set('DIS', {}); // DISplay

KNOWN_KEYS.set('GRP', {}); // GRouP

KNOWN_KEYS.set('PTH', {}); // PaTH
KNOWN_KEYS.set('PBL', listOf('PBP')); // Path Boundary(?) List of Path Boundary(?) ??
KNOWN_KEYS.set('PBT', {}); // Path Boundary(?) Point
KNOWN_KEYS.set('PCL', {}); // ???
//KNOWN_KEYS.set('PBP', sizedListOf('PPC', 'PBP', ['ISC', 'BSL'])); // ???
//KNOWN_KEYS.set('PPL', sizedListOf('PPC', 'PPT', ['ISC'])); // Path Point List
KNOWN_KEYS.set('PPT', {}); // Path PoinT
KNOWN_KEYS.set('XLC', {}); // X LoCation
KNOWN_KEYS.set('YLC', {}); // Y LoCation
KNOWN_KEYS.set('PRS', {}); // PReSsure
KNOWN_KEYS.set('VEL', {}); // VELocity

KNOWN_KEYS.set('PLL', listOf('BPL')); // ??? List
KNOWN_KEYS.set('EFD', listOf('EFL')); // EFfect Definition(?) list of EFfect ???
KNOWN_KEYS.set('FGI', { // Fill Gradient Index(?)
  readV: ({ findChild }) => ({
    position: findChild('FGP')?.value, // Fill Gradient Position
    colour: findChild('FGC')?.value, // Fill Gradient Colour
  }),
});
KNOWN_KEYS.set('FGV', sizedListOf('FNC', 'FGI')); // Fill Gradient ????
KNOWN_KEYS.set('FG0', sizedListOf('FNC', 'FGI')); // Fill Gradient 0
KNOWN_KEYS.set('FG1', sizedListOf('FNC', 'FGI')); // Fill Gradient 1
KNOWN_KEYS.set('TIL', {}); // Tile Id List of Tile Ids (can contain TID or TMC)
KNOWN_KEYS.set('CLL', listOf('CEL')); // CeLl List (?) of CELls (?)
KNOWN_KEYS.set('TSZ', {}); // Tile SiZe (?)
KNOWN_KEYS.set('WPX', {}); // Width PiXels
KNOWN_KEYS.set('HPX', {}); // Height PiXels
KNOWN_KEYS.set('PAT', {}); // PATtern
KNOWN_KEYS.set('BCL', {}); // Background CoLour
KNOWN_KEYS.set('FCL', {}); // Foreground CoLour
KNOWN_KEYS.set('FPL', {}); // ??
KNOWN_KEYS.set('TXB', {}); // TeXture Background (?)
KNOWN_KEYS.set('TXF', {}); // TeXture Foreground (?)
KNOWN_KEYS.set('INM', {}); // ???
KNOWN_KEYS.set('MSK', {}); // MaSK (?)
KNOWN_KEYS.set('TID', {}); // Tile Id
KNOWN_KEYS.set('LFT', {}); // LeFT
KNOWN_KEYS.set('TOP', {}); // TOP
KNOWN_KEYS.set('RIT', {}); // RIghT
KNOWN_KEYS.set('BOT', {}); // BOTtom
KNOWN_KEYS.set('XOF', {}); // X OFfset
KNOWN_KEYS.set('YOF', {}); // Y OFfset
KNOWN_KEYS.set('XLC', {}); // X ???
KNOWN_KEYS.set('YLC', {}); // Y ???
KNOWN_KEYS.set('LFA', {}); // ???
KNOWN_KEYS.set('TOA', {}); // ???
KNOWN_KEYS.set('RIA', {}); // ???
KNOWN_KEYS.set('BOA', {}); // ???
KNOWN_KEYS.set('TFT', {}); // ???
KNOWN_KEYS.set('FOA', {}); // ???
KNOWN_KEYS.set('LCK', {}); // LoCKed
KNOWN_KEYS.set('FON', {}); // FONt
KNOWN_KEYS.set('TRN', {}); // ??? (text content)

/**
 * @param {Node} doc
 * @return {Node}
 */
export function simplifyNested(doc) {
  const meta = KNOWN_KEYS.get(doc.name);
  if (Array.isArray(doc.value)) {
    const c = doc.value.map(simplifyNested);
    const read = meta?.readV ?? DEFAULT_READ_V;
    return {
      name: doc.name,
      value: read({
        name: doc.name,
        value: c,
        findChild: (name) => c.find((o) => o.name === name),
        findChildren: (name) => c.filter((o) => o.name === name),
      }),
    };
  }
  if (meta?.readS) {
    return {
      name: doc.name,
      value: meta.readS({
        name: doc.name,
        value: doc.value,
      }),
    };
  }
  return doc;
}

/**
 * @param {Map<string, unknown>} m
 * @return {Record<string, unknown>}
 */
function mapToDict(m) {
  /** @type {Record<string, unknown>} */ const r = {};
  for (const [k, v] of m.entries()) {
    Object.defineProperty(r, k, { value: v, enumerable: true });
  }
  return r;
}
