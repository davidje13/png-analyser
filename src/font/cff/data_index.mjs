/**
 * @typedef {import('../../data/builder.mjs').ByteArrayBuilder} ByteArrayBuilder
 */

/**
 * @param {ByteArrayBuilder} buf
 * @param {(ByteArrayBuilder | ArrayBufferView)[]} items
 */
export function writeIndex(buf, items) {
  buf.uint16BE(items.length);
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
    buf.uintBE(offset, v);
    offset += item.byteLength;
  }
  buf.uintBE(offset, v);
  for (const item of items) {
    buf.append(item);
  }
}
