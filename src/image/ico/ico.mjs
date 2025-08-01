import { isPNG, readPNG } from '../png/png.mjs';
import { readBMP } from '../bmp/bmp.mjs';
import { asDataView, subViewLen } from '../../data/utils.mjs';

// https://en.wikipedia.org/wiki/ICO_(file_format)

/**
 * @typedef {{
 *   hotspot?: { x: number; y: number };
 *   paletteSize?: number;
 *   bitDepth: number;
 *   image: number[][];
 *   rawPNG?: import('../png/png.mjs').PNGResult;
 *   rawBMP?: import('../bmp/bmp.mjs').BMPResult;
 * }} IconSizeOut
 */

const TYPE_ICON = 1;
const TYPE_CURSOR = 2;

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isICO(data) {
  const dv = asDataView(data);
  if (dv.getUint16(0, true) !== 0) {
    return false;
  }
  const type = dv.getUint16(2, true);
  if (type !== TYPE_ICON && type !== TYPE_CURSOR) {
    return false;
  }
  return true;
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @return {Promise<{
 *   warnings: string[];
 *   images: IconSizeOut[];
 * }>}
 */
export async function readICO(data) {
  /** @type {string[]} */ const warnings = [];
  const dv = asDataView(data);
  if (dv.getUint16(0, true) !== 0) {
    warnings.push('file does not begin with 0x0000');
  }
  const type = dv.getUint16(2, true);
  if (type !== TYPE_ICON && type !== TYPE_CURSOR) {
    warnings.push(`unknown type ${type}`);
  }
  const count = dv.getUint16(4, true);
  /** @type {IconSizeOut[]} */ const images = [];

  for (let i = 0; i < count; ++i) {
    /** @type {IconSizeOut} */ const image = { image: [], bitDepth: 0 };
    const p = 6 + 16 * i;
    const w = dv.getUint8(p) || 256;
    const h = dv.getUint8(p + 1) || 256;
    const paletteSize = dv.getUint8(p + 2);
    if (paletteSize !== 0) {
      image.paletteSize = paletteSize;
    }
    const reserved = dv.getUint8(p + 3);
    if (reserved !== 0) {
      warnings.push(`image ${i + 1}: reserved header space has value ${reserved}`);
    }
    let bpp = paletteSize ? Math.ceil(Math.log2(paletteSize)) : 0;
    if (type === TYPE_CURSOR) {
      image.hotspot = {
        x: dv.getInt16(p + 4, true),
        y: dv.getInt16(p + 6, true),
      };
    } else {
      const planes = dv.getUint16(p + 4, true);
      bpp = dv.getUint16(p + 6, true);
      if (planes === 0) {
        warnings.push(`image ${i + 1}: colour planes is 0 (interpreting as 1)`);
      } else if (planes !== 1) {
        warnings.push(`image ${i + 1}: colour planes should be 1, got ${planes}`);
      }
      const paletteLog2 = bpp * Math.max(planes, 1);
      if (paletteLog2 < 8 && paletteSize !== 1 << paletteLog2) {
        warnings.push(`image ${i + 1}: palette size should be ${1 << paletteLog2} but got ${paletteSize}`);
      }
    }

    const byteLength = dv.getUint32(p + 8, true);
    const offset = dv.getUint32(p + 12, true);
    const imageData = subViewLen(dv, offset, byteLength, warnings);
    if (isPNG(imageData)) {
      const png = await readPNG(imageData);
      if (png.state.ihdr?.colourType !== 6 || png.state.ihdr?.bitDepth !== 8) {
        warnings.push(`image ${i + 1}: PNG not stored as 32-bit ARGB`);
      }
      if (png.state.ihdr?.interlaceMethod !== 0) {
        warnings.push(`image ${i + 1}: PNG is interlaced`);
      }
      warnings.push(...png.warnings.map((w) => `image ${i + 1}: ${w}`));
      image.image = png.state.idat?.image ?? [];
      image.bitDepth = png.bitDepth;
      image.rawPNG = png;
    } else {
      const bmp = readBMP(imageData, { expectHeader: false, andMask: true });
      warnings.push(...bmp.warnings.map((w) => `image ${i + 1}: ${w}`));
      image.image = bmp.image;
      image.bitDepth = bmp.bitDepth;
      image.rawBMP = bmp;
    }
    if (bpp !== 0 && image.bitDepth !== bpp) {
      warnings.push(`image ${i + 1}: icon bit depth is ${bpp} but image bit depth is ${image.bitDepth}`);
    }
    if (image.image.length !== h || (image.image[0]?.length ?? 0) !== w) {
      warnings.push(`image ${i + 1}: icon size is ${w}x${h} but image size is ${image.image[0]?.length ?? 0}x${image.image.length}`);
    }

    images.push(image);
  }

  return { warnings, images };
}
