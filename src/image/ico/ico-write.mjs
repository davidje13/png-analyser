import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeBMP } from '../bmp/bmp.mjs';
import { writePNG } from '../png/png-write.mjs';

/**
 * @typedef {{
 *   cursorHotspot?: { x: number; y: number };
 *   andMask?: boolean | boolean[][];
 *   image: number[][];
 * }} IconSizeIn
 */

/**
 * @param {IconSizeIn[]} sizes
 */
export function writeICO(sizes, {
  cursor = false,
  allowPNG = true,
  compressionTimeAllotment = 2000,
} = {}) {
  const buf = new ByteArrayBuilder();
  buf.uint16LE(0); // reserved
  buf.uint16LE(cursor ? 2 : 1);
  buf.uint16LE(sizes.length);

  const imageDataBuf = new ByteArrayBuilder();
  const imageDataOffset = buf.byteLength + 16 * sizes.length;

  const countPossiblePNGs = sizes.filter((s) => !Array.isArray(s.andMask)).length;

  for (const { cursorHotspot, andMask = true, image } of sizes) {
    const bmp = writeBMP(image, { includeHeader: false, andMask: andMask || 'void', min8Bit: true });
    let img = bmp.data;
    let bitCount = bmp.bitCount;
    if (allowPNG && !Array.isArray(andMask)) {
      const png = writePNG(image, (m) => process.stderr.write(m), {
        forceRGBA: true,
        compressionTimeAllotment: compressionTimeAllotment / countPossiblePNGs,
      });
      if (png.data.byteLength < img.byteLength) {
        img = png.data;
        bitCount = 32;
      }
    }

    const planes = 1;
    const w = Math.min(image[0].length, 256);
    const h = Math.min(image.length, 256);
    buf.uint8(w & 255);
    buf.uint8(h & 255);
    const paletteLog2 = bitCount * planes;
    buf.uint8(paletteLog2 >= 8 ? 0 : (1 << paletteLog2)); // colour palette size
    buf.uint8(0); // reserved
    if (cursor) {
      buf.uint16LE(cursorHotspot?.x ?? 0);
      buf.uint16LE(cursorHotspot?.y ?? 0);
    } else {
      if (cursorHotspot) {
        throw new Error('Cannot set cursor hotspot on an icon');
      }
      buf.uint16LE(planes); // colour planes
      buf.uint16LE(bitCount); // bits per pixel
    }
    buf.uint32LE(img.byteLength); // image size (bytes)
    buf.uint32LE(imageDataOffset + imageDataBuf.byteLength); // image data offset
    imageDataBuf.append(img);
  }
  buf.append(imageDataBuf);

  return { data: buf };
}
