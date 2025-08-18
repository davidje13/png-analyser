import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 *   isRawZlib?: boolean,
 *   customLookup?: (info: {
 *     bits: number,
 *     indexed: boolean,
 *     rgb: boolean,
 *     alpha: boolean,
 *     gammaLookupTables: number[][],
 *   }) => (((channels: number[]) => number) | null),
 * }} CgBIState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   flags?: string,
 *   rowFilters?: string,
 *   isRawZlib?: boolean,
 *   pixelFormat?: string,
 *   channels?: string,
 *   floatComponents?: boolean,
 *   alphaInfo?: string,
 * }} CgBIChunk
 */

// https://iphonedevwiki.net/index.php/CgBI_file_format

// channel order is non-standard and RGB may be pre-multiplied by alpha

const kCGBitmapFilterMask          = 0x60000000; // guesswork
const kCGBitmapFilterAny           = 0x00000000;
const kCGBitmapFilterSubOnly       = 0x20000000; // maybe: all row filters are '1' (Sub: relative to left pixel)
const kCGBitmapFilterNoneOnly      = 0x40000000; // maybe: all row filters are '0' (None: absolute values)
const kCGBitmapRawZlib             = 0x10000000; // idat is raw zlib data (no header / footer / crc)
const kCGImagePixelFormatMask      = 0x000F0000;
const kCGImagePixelFormatPacked    = 0x00000000;
const kCGImagePixelFormatRGB555    = 0x00010000;
const kCGImagePixelFormatRGB565    = 0x00020000;
const kCGImagePixelFormatRGB101010 = 0x00030000;
const kCGImagePixelFormatRGBCIF10  = 0x00040000;
const kCGBitmapByteOrderMask       = 0x00007000;
const kCGBitmapByteOrderDefault    = 0x00000000;
const kCGBitmapByteOrder16Little   = 0x00001000;
const kCGBitmapByteOrder32Little   = 0x00002000;
const kCGBitmapByteOrder16Big      = 0x00003000;
const kCGBitmapByteOrder32Big      = 0x00004000;
const kCGBitmapFloatInfoMask       = 0x00000F00;
const kCGBitmapFloatComponents     = 0x00000100;
const kCGBitmapAlphaInfoMask       = 0x0000001F;

const kCGImageAlphaNone               = 0x00; // There is no alpha channel.
const kCGImageAlphaPremultipliedLast  = 0x01; // The alpha component is stored in the least significant bits of each pixel and the color components have already been multiplied by this alpha value. For example, premultiplied RGBA.
const kCGImageAlphaPremultipliedFirst = 0x02; // The alpha component is stored in the most significant bits of each pixel and the color components have already been multiplied by this alpha value. For example, premultiplied ARGB.
const kCGImageAlphaLast               = 0x03; // The alpha component is stored in the least significant bits of each pixel. For example, non-premultiplied RGBA.
const kCGImageAlphaFirst              = 0x04; // The alpha component is stored in the most significant bits of each pixel. For example, non-premultiplied ARGB.
const kCGImageAlphaNoneSkipLast       = 0x05; // There is no alpha channel.
const kCGImageAlphaNoneSkipFirst      = 0x06; // There is no alpha channel. If the total size of the pixel is greater than the space required for the number of color components in the color space, the most significant bits are ignored.
const kCGImageAlphaOnly               = 0x07; // There is no color data, only an alpha channel.

registerChunk('CgBI', { max: 1, notAfter: ['IHDR'], allowBeforeIHDR: true }, (/** @type {CgBIChunk} */ chunk, /** @type {CgBIState} */ state, warnings) => {
  if (chunk.data.byteLength !== 4) {
    warnings.push(`CgBI chunk length ${chunk.data.byteLength} is not 4`);
  }

  const data = chunk.data.getUint32(0);
  chunk.flags = '0x' + data.toString(16).padStart(8, '0');

  const rowFilters = data & kCGBitmapFilterMask;
  switch (rowFilters) {
    case kCGBitmapFilterAny: chunk.rowFilters = 'any'; break;
    case kCGBitmapFilterSubOnly: chunk.rowFilters = '1 (Sub)'; break;
    case kCGBitmapFilterNoneOnly: chunk.rowFilters = '0 (None)'; break;
    default: chunk.rowFilters = `unknown (${rowFilters})`;
  }

  chunk.isRawZlib = Boolean(data & kCGBitmapRawZlib);

  const pixelFormat = data & kCGImagePixelFormatMask;
  switch (pixelFormat) {
    case kCGImagePixelFormatPacked: chunk.pixelFormat = 'packed'; break;
    case kCGImagePixelFormatRGB555: chunk.pixelFormat = 'rgba-5-5-5-1'; break;
    case kCGImagePixelFormatRGB565: chunk.pixelFormat = 'rgb-5-6-5'; break;
    case kCGImagePixelFormatRGB101010: chunk.pixelFormat = 'rgba-10-10-10-2'; break;
    case kCGImagePixelFormatRGBCIF10: chunk.pixelFormat = 'rgb-10-10-10'; break;
    default: chunk.pixelFormat = `unknown (${pixelFormat})`;
  }

  const byteOrder = data & kCGBitmapByteOrderMask;

  chunk.floatComponents = (data & kCGBitmapFloatInfoMask) === kCGBitmapFloatComponents;

  // https://developer.apple.com/documentation/coregraphics/cgimagealphainfo
  const alphaInfo = data & kCGBitmapAlphaInfoMask;

  const alphaType = (
    (
      alphaInfo === kCGImageAlphaPremultipliedLast ||
      alphaInfo === kCGImageAlphaPremultipliedFirst
    ) ? 'premultiplied' :
    (
      alphaInfo === kCGImageAlphaLast ||
      alphaInfo === kCGImageAlphaFirst
    ) ? 'non-premultiplied' :
    (
      alphaInfo === kCGImageAlphaNoneSkipLast ||
      alphaInfo === kCGImageAlphaNoneSkipFirst
    ) ? 'skip' :
    alphaInfo === kCGImageAlphaNone ? 'none' :
    alphaInfo === kCGImageAlphaOnly ? 'only' :
    `unknown (${alphaInfo})`
  );
  const alphaFirst = (
    alphaInfo === kCGImageAlphaPremultipliedFirst ||
    alphaInfo === kCGImageAlphaFirst ||
    alphaInfo === kCGImageAlphaNoneSkipFirst
  );
  const ac = (
    (
      alphaType === 'premultiplied' ||
      alphaType === 'non-premultiplied' ||
      alphaType === 'only'
    ) ? 'A' :
    alphaType === 'skip' ? 'X' :
    ''
  );

  /** @type {(channels: number[]) => { r: number, g: number, b: number, a: number }} */
  let readChannels;
  switch (byteOrder) {
    case kCGBitmapByteOrder16Little:
      readChannels = alphaFirst
        ? ([l, a]) => ({ r: l, g: l, b: l, a })
        : ([a, l]) => ({ r: l, g: l, b: l, a });
      chunk.channels = alphaFirst ? `L${ac}` : `${ac}L`;
      break;
    case kCGBitmapByteOrderDefault:
    case kCGBitmapByteOrder32Little:
      readChannels = alphaFirst
        ? ([b, g, r, a]) => ({ r, g, b, a })
        : ([a, b, g, r]) => ({ r, g, b, a });
      chunk.channels = alphaFirst ? `BGR${ac}` : `${ac}BGR`;
      if (byteOrder === kCGBitmapByteOrderDefault) {
        chunk.channels = 'platform dependent, assuming ' + chunk.channels;
      }
      break;
    case kCGBitmapByteOrder16Big:
      readChannels = alphaFirst
        ? ([a, l]) => ({ r: l, g: l, b: l, a })
        : ([l, a]) => ({ r: l, g: l, b: l, a });
      chunk.channels = alphaFirst ? `${ac}L` : `L${ac}`;
      break;
    case kCGBitmapByteOrder32Big:
      readChannels = alphaFirst
        ? ([a, r, g, b]) => ({ r, g, b, a })
        : ([r, g, b, a]) => ({ r, g, b, a });
      chunk.channels = alphaFirst ? `${ac}RGB` : `RGB${ac}`;
      break;
    default:
      readChannels = ([r, g, b, a]) => ({ r, g, b, a });
      chunk.channels = 'unknown';
  }

  switch (alphaType) {
    case 'premultiplied':
      chunk.channels += ' (premultiplied)';
      break;
    case 'only':
      chunk.channels = 'A';
      break;
  }

  state.isRawZlib = chunk.isRawZlib;
  state.customLookup = ({ bits, indexed, rgb, alpha, gammaLookupTables }) => {
    if (indexed || !rgb || !alpha || alphaType === '') {
      return null;
    }
    if (alphaType === 'only') {
      return ([a]) => gammaLookupTables[3][a] << 24;
    }
    const max = (1 << bits) - 1;
    return (channels) => {
      const { r, g, b, a } = readChannels(channels);
      if (alphaType === 'premultiplied') {
        if (!a) {
          return 0;
        }
        const m = max / a;
        return (
          (gammaLookupTables[3][a] << 24) |
          (gammaLookupTables[0][(r * m)|0] << 16) |
          (gammaLookupTables[1][(g * m)|0] << 8) |
          gammaLookupTables[2][(b * m)|0]
        );
      } else if (alphaType === 'non-premultiplied') {
        return (
          (gammaLookupTables[3][a] << 24) |
          (gammaLookupTables[0][r] << 16) |
          (gammaLookupTables[1][g] << 8) |
          gammaLookupTables[2][b]
        );
      } else {
        return (
          (gammaLookupTables[3][255] << 24) |
          (gammaLookupTables[0][r] << 16) |
          (gammaLookupTables[1][g] << 8) |
          gammaLookupTables[2][b]
        );
      }
    };
  };
});
