import { deflateSync } from 'node:zlib';
import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeChunk } from './chunk.mjs';

const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const VOID = new Uint8Array(0);

/**
 * @param {number[][]} image
 */
export function writePNG32(image) {
  const h = image.length;
  const w = h ? image[0].length : 0;

  const idat = new ByteArrayBuilder();
  for (let y = 0; y < h; ++y) {
    idat.uint8(0); // row filter type
    for (let x = 0; x < w; ++x) {
      idat.uint32BE(image[y][x]);
    }
  }

  const ihdr = new ByteArrayBuilder();
  ihdr.uint32BE(w);
  ihdr.uint32BE(h);
  ihdr.uint8(8); // bit depth
  ihdr.uint8(6); // colour type (6 = RGBA)
  ihdr.uint8(0); // compression method
  ihdr.uint8(0); // filter method
  ihdr.uint8(0); // interlace method

  const buf = new ByteArrayBuilder();
  buf.append(PNG_HEADER);
  writeChunk(buf, 'IHDR', ihdr);
  writeChunk(buf, 'IDAT', deflateSync(idat.toBytes(), { level: 9 }));
  writeChunk(buf, 'IEND', VOID);
  return buf;
}
