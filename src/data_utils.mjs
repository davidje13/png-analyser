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
 * @param {number=} from
 * @param {number=} to
 * @return {DataView}
 */
export function subView(data, from = 0, to = undefined) {
  return subViewLen(data, from, (to ?? data.byteLength) - from);
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {number} from
 * @param {number} length
 * @return {DataView}
 */
export function subViewLen(data, from, length) {
  if (ArrayBuffer.isView(data)) {
    return new DataView(
      data.buffer,
      data.byteOffset + from,
      length ?? (data.byteLength - from),
    );
  } else {
    return new DataView(data, from, length);
  }
}

/**
 * @param {string} encoding
 * @return {(data: ArrayBuffer | ArrayBufferView, from?: number, to?: number) => string}
 */
const makeDecoder = (encoding) => {
  const decoder = new TextDecoder(encoding);
  return (data, from, to) => decoder.decode(subView(data, from, to));
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
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {string}
 */
export function debugWrite(data) {
  const bytes = asBytes(data);
  const all = [''];
  for (let i = 0; i < bytes.byteLength; i += 16) {
    const rowN = [];
    const rowC = [];
    for (let j = 0; j < 16 && i + j < bytes.byteLength; ++j) {
      const c = bytes[i + j];
      rowN.push(c.toString(16).padStart(2, '0'));
      if (c >= 0x20 && c < 0x7F) {
        rowC.push(String.fromCharCode(c));
      } else {
        rowC.push('.');
      }
    }
    all.push(rowN.join(' ') + '   ' + rowC.join(''));
  }
  return all.join('\n') + '\n';
}
