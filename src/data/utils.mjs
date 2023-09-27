/**
 * @param {string} text
 * @return {ArrayBufferView}
 */
export function toLatin1(text) {
  return new Uint8Array(text.split('').map((c) => c.charCodeAt(0)));
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {Uint8Array}
 */
export function asBytes(data) {
  if (data instanceof Uint8Array) {
    return data;
  } else if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  } else {
    return new Uint8Array(data);
  }
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {DataView}
 */
export function asDataView(data) {
  if (data instanceof DataView) {
    return data;
  } else if (ArrayBuffer.isView(data)) {
    return new DataView(data.buffer, data.byteOffset, data.byteLength);
  } else {
    return new DataView(data);
  }
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {number} from
 * @return {DataView}
 */
export function subViewFrom(data, from) {
  return subViewLen(data, from, data.byteLength - from, null);
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {number} from
 * @param {number} length
 * @param {string[] | null} warnings
 * @return {DataView}
 */
export function subViewLen(data, from, length, warnings) {
  if (from < 0 || from + length > data.byteLength || length < 0) {
    const msg = `sub-view range ${from} - ${from + length} cannot be satisfied (total data: ${data.byteLength})`;
    if (!warnings) {
      throw new Error(msg);
    }
    warnings.push(msg);
    length = Math.max(Math.min(from + length, data.byteLength) - Math.max(from, 0), 0);
    from = Math.max(Math.min(from, data.byteLength), 0);
  }

  if (ArrayBuffer.isView(data)) {
    return new DataView(data.buffer, data.byteOffset + from, length);
  } else {
    return new DataView(data, from, length);
  }
}

/**
 * @param {string} encoding
 * @return {(...params: [ArrayBuffer | ArrayBufferView] | [ArrayBuffer | ArrayBufferView, number, number, string[] | null]) => string}
 */
const makeDecoder = (encoding) => {
  const decoder = new TextDecoder(encoding);
  return (data, from = 0, to = data.byteLength, warnings = null) => decoder.decode(subViewLen(data, from, to - from, warnings));
};

export const getLatin1 = makeDecoder('latin1');
export const getUTF8 = makeDecoder('utf8');
export const getUTF16LE = makeDecoder('utf-16le');
export const getUTF16BE = makeDecoder('utf-16be');

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {ArrayBuffer | ArrayBufferView | number} search
 * @param {number=} from
 * @return {number}
 */
export function findIndex(data, search, from = 0) {
  const haystack = asBytes(data);
  if (typeof search === 'number') {
    return haystack.indexOf(search, from);
  }
  const needle = asBytes(search);
  const needleL = search.byteLength;
  const l = haystack.byteLength - needleL;
  const first = needle[0];
  for (let p = from - 1; (p = haystack.indexOf(first, p + 1)) !== -1 && p <= l;) {
    let match = true;
    for (let i = 1; i < needleL; ++i) {
      if (haystack[p + i] !== needle[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      return p;
    }
  }
  return -1;
}

/**
 * @param {(ArrayBuffer | ArrayBufferView)[]} datas
 * @return {DataView}
 */
export function concat(datas) {
  const l = datas.reduce((l, data) => l + data.byteLength, 0);
  const out = new Uint8Array(l);
  let p = 0;
  for (const data of datas) {
    out.set(asBytes(data), p);
    p += data.byteLength;
  }
  return new DataView(out.buffer);
}

/**
 * @param {number} v
 * @return {string}
 */
export const hex32 = (v) => v.toString(16).padStart(8, '0');

/**
 * @param {string} name
 * @return {number}
 */
export const char32 = (name) => (name.charCodeAt(0) << 24) | (name.charCodeAt(1) << 16) | (name.charCodeAt(2) << 8) | name.charCodeAt(3);

/** @type {Map<number, string>} */ const TYPE_NAMES = new Map();

/**
 * @param {number} type
 * @return {string}
 */
export function printTag(type) {
  let n = TYPE_NAMES.get(type);
  if (n) {
    return n;
  }
  for (let i = 0; i < 4; ++i) {
    const v = (type >>> (i * 8)) & 0xFF;
    if (v < 0x20 || v > 0x7E) {
      n = `0x${hex32(type)}`;
      TYPE_NAMES.set(type, n);
      return n;
    }
  }
  n = [
    String.fromCharCode(type >>> 24),
    String.fromCharCode((type >>> 16) & 0xFF),
    String.fromCharCode((type >>> 8) & 0xFF),
    String.fromCharCode(type & 0xFF),
  ].join('');
  TYPE_NAMES.set(type, n);
  return n;
}
