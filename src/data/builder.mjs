export class ByteArrayBuilder {
  constructor(initialCapacity = 1024) {
    /** @type {DataView} */ this.view = new DataView(new ArrayBuffer(initialCapacity));
    /** @type {number} */ this.fullByteLength = 0;
    /** @type {number} */ this.bitsRemaining = 0;
  }

  get byteOffset() {
    return this.view.byteOffset;
  }

  get buffer() {
    return this.view.buffer;
  }

  get byteLength() {
    return this.fullByteLength + (this.bitsRemaining ? 1 : 0);
  }

  /**
   * @param {number} length
   */
  truncate(length) {
    if (length < 0 || length > this.byteLength) {
      throw new Error('invalid truncation length');
    }
    this.fullByteLength = length;
    this.bitsRemaining = 0;
  }

  toBytes() {
    return new Uint8Array(this.view.buffer, this.view.byteOffset, this.byteLength);
  }

  /**
   * @private
   * @param {number} bytes
   * @param {boolean} padToByte
   */
  _ensureCapacity(bytes, padToByte = true) {
    if (padToByte && this.bitsRemaining) {
      ++this.fullByteLength;
      this.bitsRemaining = 0;
    }
    const capacity = this.view.byteLength;
    const required = this.byteLength + bytes;
    if (capacity < required) {
      const newBuffer = new ArrayBuffer(Math.ceil(required / 1024) * 1024);
      new Uint8Array(newBuffer).set(new Uint8Array(this.view.buffer, this.view.byteOffset, this.byteLength));
      this.view = new DataView(newBuffer);
    }
  }

  /**
   * @param {ArrayBuffer | ArrayBufferView} b
   * @param {number=} offset
   * @param {(number | null)=} length
   */
  append(b, offset = 0, length = null) {
    if (b === this) {
      throw new Error('Cannot combine with self');
    }
    const size = length ?? b.byteLength;
    this._ensureCapacity(size);
    const src = (b instanceof ByteArrayBuilder || ArrayBuffer.isView(b))
      ? new Uint8Array(b.buffer, b.byteOffset + offset, size)
      : new Uint8Array(b, offset, size);
    new Uint8Array(this.view.buffer, this.view.byteOffset + this.fullByteLength, size)
      .set(src);
    this.fullByteLength += size;
  }

  /**
   * @param {number} bytePosition
   */
  padTo(bytePosition) {
    if (this.byteLength > bytePosition) {
      if (this.bitsRemaining) {
        throw new Error(`Already past position ${bytePosition} (at ${this.fullByteLength}.${8 - this.bitsRemaining})`);
      } else {
        throw new Error(`Already past position ${bytePosition} (at ${this.fullByteLength})`);
      }
    }
    if (this.bitsRemaining && bytePosition === this.fullByteLength + 1) {
      this.padToByte();
    } else {
      this.appendMutableBytes(bytePosition - this.fullByteLength);
    }
  }

  padToByte() {
    if (this.bitsRemaining) {
      ++this.fullByteLength;
      this.bitsRemaining = 0;
    }
  }

  /**
   * @param {number} length
   */
  appendMutableBytes(length) {
    this._ensureCapacity(length);
    const view = new Uint8Array(this.view.buffer, this.view.byteOffset + this.fullByteLength, length);
    view.fill(0);
    this.fullByteLength += length;
    return view;
  }

  /**
   * @param {number} v
   */
  uint8(v) {
    this._ensureCapacity(1);
    this.view.setUint8(this.fullByteLength, v);
    this.fullByteLength += 1;
  }

  /**
   * @param {number} v
   */
  int8(v) {
    this._ensureCapacity(1);
    this.view.setInt8(this.fullByteLength, v);
    this.fullByteLength += 1;
  }

  /**
   * @private
   * @param {number} pos
   * @param {number} length
   */
  _ensureExisting(pos, length) {
    if (pos + length > this.fullByteLength) {
      throw new Error('invalid replacement index');
    }
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceUint8(pos, v) {
    this._ensureExisting(pos, 1);
    this.view.setUint8(pos, v);
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceInt8(pos, v) {
    this._ensureExisting(pos, 1);
    this.view.setInt8(pos, v);
  }

  /**
   * @param {number} v
   */
  uint16BE(v) {
    this._ensureCapacity(2);
    this.view.setUint16(this.fullByteLength, v, false);
    this.fullByteLength += 2;
  }

  /**
   * @param {number} v
   */
  uint16LE(v) {
    this._ensureCapacity(2);
    this.view.setUint16(this.fullByteLength, v, true);
    this.fullByteLength += 2;
  }

  /**
   * @param {number} v
   */
  int16BE(v) {
    this._ensureCapacity(2);
    this.view.setInt16(this.fullByteLength, v, false);
    this.fullByteLength += 2;
  }

  /**
   * @param {number} v
   */
  int16LE(v) {
    this._ensureCapacity(2);
    this.view.setInt16(this.fullByteLength, v, true);
    this.fullByteLength += 2;
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceUint16BE(pos, v) {
    this._ensureExisting(pos, 2);
    this.view.setUint16(pos, v, false);
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceInt16BE(pos, v) {
    this._ensureExisting(pos, 2);
    this.view.setInt16(pos, v, false);
  }

  /**
   * @param {number} v
   */
  uint24BE(v) {
    this._ensureCapacity(3);
    this.view.setUint8(this.fullByteLength, v >>> 16);
    this.view.setUint8(this.fullByteLength + 1, (v >>> 8) & 0xFF);
    this.view.setUint8(this.fullByteLength + 2, v & 0xFF);
    this.fullByteLength += 3;
  }

  /**
   * @param {number} v
   */
  int24BE(v) {
    this._ensureCapacity(3);
    this.view.setInt8(this.fullByteLength, v >> 16);
    this.view.setUint8(this.fullByteLength + 1, (v >> 8) & 0xFF);
    this.view.setUint8(this.fullByteLength + 2, v & 0xFF);
    this.fullByteLength += 3;
  }

  /**
   * @param {number} v
   */
  uint32BE(v) {
    this._ensureCapacity(4);
    this.view.setUint32(this.fullByteLength, v, false);
    this.fullByteLength += 4;
  }

  /**
   * @param {number} v
   */
  uint32LE(v) {
    this._ensureCapacity(4);
    this.view.setUint32(this.fullByteLength, v, true);
    this.fullByteLength += 4;
  }

  /**
   * @param {number} v
   */
  int32BE(v) {
    this._ensureCapacity(4);
    this.view.setInt32(this.fullByteLength, v, false);
    this.fullByteLength += 4;
  }

  /**
   * @param {number} v
   */
  int32LE(v) {
    this._ensureCapacity(4);
    this.view.setInt32(this.fullByteLength, v, true);
    this.fullByteLength += 4;
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceUint32BE(pos, v) {
    this._ensureExisting(pos, 4);
    this.view.setUint32(pos, v, false);
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceUint32LE(pos, v) {
    this._ensureExisting(pos, 4);
    this.view.setUint32(pos, v, true);
  }

  /**
   * @param {number} pos
   * @param {number} v
   */
  replaceInt32BE(pos, v) {
    this._ensureExisting(pos, 4);
    this.view.setInt32(pos, v, false);
  }

  /**
   * @param {bigint} v
   */
  uint64BE(v) {
    this._ensureCapacity(8);
    this.view.setBigUint64(this.fullByteLength, v, false);
    this.fullByteLength += 8;
  }

  /**
   * @param {bigint} v
   */
  int64BE(v) {
    this._ensureCapacity(8);
    this.view.setBigInt64(this.fullByteLength, v, false);
    this.fullByteLength += 8;
  }

  /**
   * @param {number} bytes
   * @param {number} v
   */
  uintBE(bytes, v) {
    switch (bytes) {
      case 1: return this.uint8(v);
      case 2: return this.uint16BE(v);
      case 3: return this.uint24BE(v);
      case 4: return this.uint32BE(v);
      default: throw new Error(`unsupported byte length ${bytes}`);
    }
  }

  /**
   * @param {string} v
   */
  ascii7(v) {
    this._ensureCapacity(v.length);
    for (let i = 0; i < v.length; ++i) {
      const code = v.charCodeAt(i);
      if (code > 0x7F) {
        throw new Error(`String not representable in ASCII: '${v}'`);
      }
      this.view.setUint8(this.fullByteLength + i, code);
    }
    this.fullByteLength += v.length;
  }

  /**
   * @param {string} v
   */
  latin1(v) {
    this._ensureCapacity(v.length);
    for (let i = 0; i < v.length; ++i) {
      const code = v.charCodeAt(i);
      if (code > 0xFF) {
        throw new Error(`String not representable in latin1: '${v}'`);
      }
      this.view.setUint8(this.fullByteLength + i, code);
    }
    this.fullByteLength += v.length;
  }

  /**
   * @param {string} v
   */
  utf8(v) {
    this.append(new TextEncoder().encode(v));
  }

  /**
   * @param {string} v
   */
  utf16BE(v) {
    this._ensureCapacity(v.length * 2);
    for (let i = 0; i < v.length; ++i) {
      this.view.setUint16(this.fullByteLength + i * 2, v.charCodeAt(i), false);
    }
    this.fullByteLength += v.length * 2;
  }

  /**
   * Appends `bits` bits of `value`. The value will be appended to the lowest
   * available part of the current byte (i.e. if a value with 1 bit is pushed,
   * it will set the lowest bit index).
   * The value itself will be added as little endian.
   *
   * Note that this should not be mixed with calls to `pushHighBits*` unless the
   * content is known to be byte-aligned (e.g. a byte value has been added, or
   * `padToByte` has been called)
   *
   * @param {number} value
   * @param {number} bits
   */
  pushLowBitsLE(value, bits) {
    const advanceBytes = (bits - this.bitsRemaining + 7) >>> 3;
    this._ensureCapacity(advanceBytes + 1, false);
    if (value) {
      const rawBytes = new Uint8Array(this.view.buffer, this.view.byteOffset);
      if (this.bitsRemaining) {
        rawBytes[this.fullByteLength - 1] |= (value >>> (bits - this.bitsRemaining)) << (8 - this.bitsRemaining);
        bits -= this.bitsRemaining;
      }
      for (let i = 0; i * 8 <= bits; ++i) {
        rawBytes[this.fullByteLength + i] = (value >>> (i * 8)) & 0xFF;
      }
    }
    this.bitsRemaining = (this.bitsRemaining - bits) & 7;
    this.fullByteLength += advanceBytes;
  }

  /**
   * Appends `bits` bits of `value`. The value will be appended to the lowest
   * available part of the current byte (i.e. if a value with 1 bit is pushed,
   * it will set the lowest bit index).
   * The value itself will be added as big endian.
   *
   * Note that this should not be mixed with calls to `pushHighBits*` unless the
   * content is known to be byte-aligned (e.g. a byte value has been added, or
   * `padToByte` has been called)
   *
   * @param {number} value
   * @param {number} bits
   */
  pushLowBitsBE(value, bits) {
    if (bits > 1 && value) {
      return this.pushLowBitsLE(reverseBits(value, bits), bits);
    } else {
      return this.pushLowBitsLE(value, bits);
    }
  }
}

/**
 * @param {number} value
 */
function reverseBits32(value) {
  value = ((value & 0xAAAAAAAA) >>> 1) | ((value & 0x55555555) << 1);
  value = ((value & 0xCCCCCCCC) >>> 2) | ((value & 0x33333333) << 2);
  value = ((value & 0xF0F0F0F0) >>> 4) | ((value & 0x0F0F0F0F) << 4);
  value = ((value & 0xFF00FF00) >>> 8) | ((value & 0x00FF00FF) << 8);
  value = (value >>> 16) | ((value & 0x0000FFFF) << 16);
  return value >>> 0;
}

/**
 * @param {number} value
 * @param {number} bits
 */
function reverseBits(value, bits) {
  return reverseBits32(value) >>> (32 - bits);
}

/**
 * @param {string} v
 * @return {ByteArrayBuilder}
 */
ByteArrayBuilder.ascii7 = (v) => {
  const buf = new ByteArrayBuilder(v.length);
  buf.ascii7(v);
  return buf;
};

/**
 * @param {string} v
 * @return {ByteArrayBuilder}
 */
ByteArrayBuilder.latin1 = (v) => {
  const buf = new ByteArrayBuilder(v.length);
  buf.latin1(v);
  return buf;
};

/**
 * @param {string} v
 * @return {ByteArrayBuilder}
 */
ByteArrayBuilder.utf16BE = (v) => {
  const buf = new ByteArrayBuilder(v.length * 2);
  buf.utf16BE(v);
  return buf;
};
