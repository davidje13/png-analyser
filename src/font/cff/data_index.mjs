/**
 * @typedef {import('../../data/builder.mjs').ByteArrayBuilder} ByteArrayBuilder
 */

/**
 * @param {ByteArrayBuilder} buf
 * @param {number} countBytes
 * @param {(ByteArrayBuilder | ArrayBufferView)[]} items
 */
export function writeIndex(buf, countBytes, items) {
  buf.uintBE(countBytes, items.length);
  if (!items.length) {
    return;
  }
  let offset = 1;
  for (const item of items) {
    offset += item.byteLength;
  }
  let v;
  if (offset < 0x100) {
    v = 1;
  } else if (offset < 0x10000) {
    v = 2;
  } else if (offset < 0x1000000) {
    v = 3;
  } else {
    v = 4;
  }

  buf.uint8(v);
  offset = 1;
  for (const item of items) {
    buf.uintBE(v, offset);
    offset += item.byteLength;
  }
  buf.uintBE(v, offset);
  for (const item of items) {
    buf.append(item);
  }
}
