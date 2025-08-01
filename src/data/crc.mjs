import { asBytes } from './utils.mjs';

// http://www.libpng.org/pub/png/spec/iso/index-noobject.html#D-CRCAppendix
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; ++n) {
  let c = n;
  for (let k = 0; k < 8; ++k) {
    c = ((c & 1) * 0xedb88320) ^ (c >>> 1);
  }
  CRC_TABLE[n] = c;
}

/**
 * @param {number} crc
 * @param {Uint8Array} bytes
 * @param {number} length
 * @param {number} start
 * @return {number}
 */
export function zlibCrc32(crc, bytes, length, start) {
  crc = ~crc;
  for (let n = start; n < start + length; ++n) {
    crc = CRC_TABLE[(crc ^ bytes[n]) & 0xff] ^ (crc >>> 8);
  }
  return (~crc) >>> 0;
}

export class CRC {
  constructor(crc = ~0) {
    /** @type {number} */ this.crc = crc;
    /** @type {number} */ this.length = 0;
  }

  /**
   * @param {ArrayBuffer | ArrayBufferView} data
   * @return {CRC}
   */
  update(data) {
    const bytes = asBytes(data);
    for (let n = 0; n < bytes.byteLength; ++n) {
      this.crc = CRC_TABLE[(this.crc ^ bytes[n]) & 0xff] ^ (this.crc >>> 8);
    }
    this.length += bytes.byteLength;
    return this;
  }

  /**
   * @param {number} v
   */
  updateByte(v) {
    this.crc = CRC_TABLE[(this.crc ^ v) & 0xff] ^ (this.crc >>> 8);
    ++this.length;
  }

  /**
   * @return {number}
   */
  get() {
    return ~this.crc >>> 0;
  }
}
