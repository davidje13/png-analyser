// http://www.libpng.org/pub/png/spec/iso/index-noobject.html#D-CRCAppendix
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; ++n) {
  let c = n;
  for (let k = 0; k < 8; ++k) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c >>>= 1;
    }
  }
  CRC_TABLE[n] = c;
}

export class CRC {
  constructor() {
    this.crc = ~0;
  }

  update(data) {
    for (let n = 0; n < data.length; ++n) {
      this.crc = CRC_TABLE[(this.crc ^ data[n]) & 0xff] ^ (this.crc >>> 8);
    }
    return this;
  }

  get() {
    return ~this.crc >>> 0;
  }
}
