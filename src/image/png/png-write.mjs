import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeChunk } from './chunk.mjs';
import { RGBA_ENCODING, getEncodingOptions } from './optimisation/encoding-options.mjs';
import { FILTER_PICKER_OPTIONS } from './optimisation/filter-picker-options.mjs';
import { ZLIB_CONFIG_OPTIONS } from './optimisation/zlib-config-options.mjs';
import { findOptimalCompression } from './optimisation/brute.mjs';

const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const VOID = new Uint8Array(0);

/**
 * @typedef {import('./optimisation/encoding-options.mjs').EncodingOption} EncodingOption
 */

/**
 * @param {number[][]} image
 */
export function writePNG(image, {
  forceRGBA = false,
  preserveTransparentColour = false,
  allowMatteTransparency = true,
  compressionTimeAllotment = 2000,
} = {}) {
  if (!image[0]?.length) {
    throw new Error('Cannot save empty image');
  }

  const timeout = Date.now() + compressionTimeAllotment;

  const encodingOptions = forceRGBA ? [RGBA_ENCODING] : getEncodingOptions(image, {
    preserveTransparentColour,
    allowMatteTransparency,
  });
  const { choice, totalAttempts, idatCacheMisses } = findOptimalCompression(
    image,
    encodingOptions,
    FILTER_PICKER_OPTIONS,
    ZLIB_CONFIG_OPTIONS,
    timeout,
  );

  return {
    data: writeRawPNG({
      width: image[0].length,
      height: image.length,
      bitDepth: choice.encoding.bitDepth,
      colourType: choice.encoding.colourType,
      idats: [choice.compressed],
      plte: choice.encoding.plte,
      trns: choice.encoding.trns,
    }),
    filterPicker: choice.filterPicker,
    zlibConfig: choice.zlibConfig,
    attemptNumber: choice.attemptNumber,
    totalAttempts,
    encoding: choice.encoding.id,
    availableEncodings: encodingOptions.map((encoding) => encoding.id),
    idatCacheMisses,
  };
}

/**
 * @param {object} options
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} options.bitDepth
 * @param {number} options.colourType
 * @param {ArrayBufferView[]} options.idats
 * @param {({ start: number, height: number, idat: number }[] | undefined)=} options.idot
 * @param {(ArrayBufferView | undefined)=} options.plte
 * @param {(ArrayBufferView | undefined)=} options.trns
 * @param {boolean=} options.interlaced
 */
export function writeRawPNG({
  width,
  height,
  bitDepth,
  colourType,
  idats,
  idot,
  plte = undefined,
  trns = undefined,
  interlaced = false,
}) {
  const buf = new ByteArrayBuilder();
  buf.append(PNG_HEADER);

  const bIHDR = new ByteArrayBuilder();
  bIHDR.uint32BE(width);
  bIHDR.uint32BE(height);
  bIHDR.uint8(bitDepth);
  bIHDR.uint8(colourType);
  bIHDR.uint8(0); // compression method
  bIHDR.uint8(0); // filter method
  bIHDR.uint8(interlaced ? 1 : 0);
  writeChunk(buf, 'IHDR', bIHDR);

  if (plte?.byteLength) {
    writeChunk(buf, 'PLTE', plte);
  }
  if (trns?.byteLength) {
    writeChunk(buf, 'tRNS', trns);
  }
  if (idot?.length) {
    const biDOT = new ByteArrayBuilder();
    biDOT.uint32BE(idot.length);
    for (const segment of idot) {
      biDOT.uint32BE(segment.start);
      biDOT.uint32BE(segment.height);
      let offset = 4 + idot.length * 12 + 12; // size of iDOT
      for (let i = 0; i < segment.idat; ++i) {
        offset += 12 + idats[i].byteLength;
      }
      biDOT.uint32BE(offset);
    }
    writeChunk(buf, 'iDOT', biDOT);
  }
  for (const idat of idats) {
    writeChunk(buf, 'IDAT', idat);
  }
  writeChunk(buf, 'IEND', VOID);
  return buf;
}
