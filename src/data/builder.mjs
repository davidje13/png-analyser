export class ByteArrayBuilder {
  constructor(initialCapacity = 1024) {
    /** @type {DataView} */ this.view = new DataView(new ArrayBuffer(initialCapacity));
    /** @type {number} */ this.byteLength = 0;
  }

  get byteOffset() {
    return this.view.byteOffset;
  }

  get buffer() {
    return this.view.buffer;
  }

  /**
   * @param {number} length
   */
  truncate(length) {
    if (length < 0 || length > this.byteLength) {
      throw new Error('invalid truncation length');
    }
    this.byteLength = length;
  }

  toBytes() {
    return new Uint8Array(this.view.buffer, this.view.byteOffset, this.byteLength);
  }

  /**
   * @private
   * @param {number} bytes
   */
  _ensureCapacity(bytes) {
    const capacity = this.view.byteLength;
    const required = this.byteLength + bytes;
    if (capacity < required) {
      const newBuffer = new ArrayBuffer(Math.ceil(required / 1024) * 1024);
      new Uint8Array(newBuffer).set(new Uint8Array(this.view.buffer, this.view.byteOffset, this.byteLength));
      this.view = new DataView(newBuffer);
    }
  }

  /**
   * @param {ByteArrayBuilder | ArrayBufferView} b
   * @param {number=} offset
   * @param {(number | null)=} length
   */
  append(b, offset = 0, length = null) {
    if (b === this) {
      throw new Error('Cannot combine with self');
    }
    const size = length ?? b.byteLength;
    this._ensureCapacity(size);
    new Uint8Array(this.view.buffer, this.view.byteOffset + this.byteLength, size)
      .set(new Uint8Array(b.buffer, b.byteOffset + offset, size));
    this.byteLength += size;
  }

  /**
   * @param {number} bytePosition
   */
  padTo(bytePosition) {
    if (this.byteLength > bytePosition) {
      throw new Error(`Already past position ${bytePosition} (at ${this.byteLength})`);
    }
    this._ensureCapacity(bytePosition - this.byteLength);
    while (this.byteLength < bytePosition) {
      this.view.setUint8(this.byteLength, 0);
      this.byteLength += 1;
    }
  }

  /**
   * @param {number} v
   */
  uint8(v) {
    this._ensureCapacity(1);
    this.view.setUint8(this.byteLength, v);
    this.byteLength += 1;
  }

  /**
   * @param {number} v
   */
  int8(v) {
    this._ensureCapacity(1);
    this.view.setInt8(this.byteLength, v);
    this.byteLength += 1;
  }

  /**
   * @private
   * @param {number} pos
   * @param {number} length
   */
  _ensureExisting(pos, length) {
    if (pos + length > this.byteLength) {
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
    this.view.setUint16(this.byteLength, v, false);
    this.byteLength += 2;
  }

  /**
   * @param {number} v
   */
  int16BE(v) {
    this._ensureCapacity(2);
    this.view.setInt16(this.byteLength, v, false);
    this.byteLength += 2;
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
    this.view.setUint8(this.byteLength, v >>> 16);
    this.view.setUint8(this.byteLength + 1, (v >>> 8) & 0xFF);
    this.view.setUint8(this.byteLength + 2, v & 0xFF);
    this.byteLength += 3;
  }

  /**
   * @param {number} v
   */
  int24BE(v) {
    this._ensureCapacity(3);
    this.view.setInt8(this.byteLength, v >> 16);
    this.view.setUint8(this.byteLength + 1, (v >> 8) & 0xFF);
    this.view.setUint8(this.byteLength + 2, v & 0xFF);
    this.byteLength += 3;
  }

  /**
   * @param {number} v
   */
  uint32BE(v) {
    this._ensureCapacity(4);
    this.view.setUint32(this.byteLength, v, false);
    this.byteLength += 4;
  }

  /**
   * @param {number} v
   */
  int32BE(v) {
    this._ensureCapacity(4);
    this.view.setInt32(this.byteLength, v, false);
    this.byteLength += 4;
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
  replaceInt32BE(pos, v) {
    this._ensureExisting(pos, 4);
    this.view.setInt32(pos, v, false);
  }

  /**
   * @param {bigint} v
   */
  uint64BE(v) {
    this._ensureCapacity(8);
    this.view.setBigUint64(this.byteLength, v, false);
    this.byteLength += 8;
  }

  /**
   * @param {bigint} v
   */
  int64BE(v) {
    this._ensureCapacity(8);
    this.view.setBigInt64(this.byteLength, v, false);
    this.byteLength += 8;
  }

  /**
   * @param {number} v
   * @param {number} bytes
   */
  uintBE(v, bytes) {
    switch (bytes) {
      case 1: return this.uint8(v);
      case 2: return this.uint16BE(v);
      case 3: return this.uint24BE(v);
      case 4: return this.uint32BE(v);
      default: throw new Error('unsupported byte length');
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
      this.view.setUint8(this.byteLength + i, code);
    }
    this.byteLength += v.length;
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
      this.view.setUint8(this.byteLength + i, code);
    }
    this.byteLength += v.length;
  }

  /**
   * @param {string} v
   */
  utf16BE(v) {
    this._ensureCapacity(v.length * 2);
    for (let i = 0; i < v.length; ++i) {
      this.view.setUint16(this.byteLength + i * 2, v.charCodeAt(i), false);
    }
    this.byteLength += v.length * 2;
  }
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
