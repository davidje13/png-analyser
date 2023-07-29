import 'lean-test';
import { writePNG } from './png-write.mjs';
import { readPNG } from './png.mjs';

describe('writePNG', () => {
  it('picks an appropriate colour mode without losing data', { parameters: /** @type {RoundTripParams[]} */ [
    {
      name: 'black and white',
      image: [
        [0xFFFFFFFF, 0xFF000000],
        [0xFF000000, 0xFFFFFFFF],
      ],
      expectBitDepth: 1,
      expectChannels: ['luminosity'],
    },

    {
      name: 'black, white, and transparent',
      image: [
        [0xFFFFFFFF, 0xFF000000],
        [0x00000000, 0x00FFFFFF],
      ],
      preserveTransparentColour: false,
      expectBitDepth: 2,
      expectChannels: ['luminosity'],
    },

    {
      name: 'white and transparent black, preserving colour',
      image: [
        [0xFFFFFFFF, 0x00000000],
        [0x00000000, 0xFFFFFFFF],
      ],
      preserveTransparentColour: true,
      expectBitDepth: 1,
      expectChannels: ['luminosity'],
    },

    {
      name: 'white and transparent white, preserving colour',
      image: [
        [0xFFFFFFFF, 0x00FFFFFF],
        [0x00FFFFFF, 0xFFFFFFFF],
      ],
      preserveTransparentColour: true,
      expectBitDepth: 8,
      expectChannels: ['luminosity', 'alpha'],
    },

    {
      name: 'black, white, and transparent, preserving colour',
      image: [
        [0xFFFFFFFF, 0xFF000000],
        [0x00000000, 0x00FFFFFF],
      ],
      preserveTransparentColour: true,
      expectBitDepth: 8,
      expectChannels: ['luminosity', 'alpha'],
    },

    {
      name: '2-bit greyscale',
      image: [
        [0xFF000000, 0xFF555555],
        [0xFFAAAAAA, 0xFFFFFFFF],
      ],
      expectBitDepth: 2,
      expectChannels: ['luminosity'],
    },

    {
      name: '3-color 2-bit greyscale and transparent',
      image: [
        [0xFF000000, 0xFF555555, 0xFFFFFFFF],
        [0x00000000, 0x00555555, 0x00FFFFFF],
      ],
      preserveTransparentColour: false,
      expectBitDepth: 2,
      expectChannels: ['luminosity'],
    },

    {
      name: '2-bit greyscale and transparent',
      image: [
        [0xFF000000, 0xFF555555, 0xFFAAAAAA, 0xFFFFFFFF],
        [0x00000000, 0x00555555, 0x00AAAAAA, 0x00FFFFFF],
      ],
      preserveTransparentColour: false,
      expectBitDepth: 4,
      expectChannels: ['luminosity'],
    },

    {
      name: '2-bit greyscale and transparent, preserving colour',
      image: [
        [0xFF000000, 0xFF555555, 0xFFAAAAAA, 0xFFFFFFFF],
        [0x00000000, 0x00555555, 0x00AAAAAA, 0x00FFFFFF],
      ],
      preserveTransparentColour: true,
      expectBitDepth: 8,
      expectChannels: ['luminosity', 'alpha'],
    },

    {
      name: 'indexed colour',
      image: [
        // random colour choices; should be random enough to prevent truecolour compressing better
        [c1, c2, c3, c4, c2, c4, c1, c3, c4, c3, c2, c1, c3, c1, c4, c3],
        [c2, c2, c4, c1, c3, c3, c1, c4, c2, c3, c1, c3, c4, c1, c2, c2],
        [c1, c3, c4, c3, c2, c1, c2, c3, c4, c2, c4, c1, c3, c1, c4, c3],
        [c2, c2, c4, c1, c3, c3, c1, c4, c1, c2, c2, c2, c3, c1, c3, c4],
      ],
      expectIndexed: true,
      expectBitDepth: 2,
      expectChannels: ['red', 'green', 'blue'],
    },

    {
      name: 'indexed colour with alpha',
      image: [
        // random colour choices; should be random enough to prevent truecolour compressing better
        [c1, c2, c3, cT, c2, cT, c1, c3, cT, c3, c2, c1, c3, c1, cT, c3],
        [c2, c2, cT, c1, c3, c3, c1, cT, c2, c3, c1, c3, cT, c1, c2, c2],
        [c1, c3, cT, c3, c2, c1, c2, c3, cT, c2, cT, c1, c3, c1, cT, c3],
        [c2, c2, cT, c1, c3, c3, c1, cT, c1, c2, c2, c2, c3, c1, c3, cT],
      ],
      expectIndexed: true,
      expectBitDepth: 2,
      expectChannels: ['red', 'green', 'blue'],
    },

    {
      name: '24-bit RGB',
      image: [
        [c1, c1, c1, c1, c2, c2, c2, c2],
        [c1, c1, c1, c1, c2, c2, c2, c2],
        [c1, c1, c1, c1, c2, c2, c2, c2],
        [c1, c1, c1, c1, c2, c2, c2, c2],
      ],
      expectBitDepth: 8,
      expectChannels: ['red', 'green', 'blue'],
    },

    {
      name: '32-bit RGBA',
      image: [
        [c1, c1, c1, c1, cT, cT, cT, cT],
        [c1, c1, c1, c1, cT, cT, cT, cT],
        [c1, c1, c1, c1, cT, cT, cT, cT],
        [c1, c1, c1, c1, cT, cT, cT, cT],
      ],
      expectBitDepth: 8,
      expectChannels: ['red', 'green', 'blue', 'alpha'],
    },
  ] }, (/** @type {any} */ params) => {
    const {
      image,
      preserveTransparentColour = false,
      expectIndexed = false,
      expectBitDepth,
      expectChannels,
    } = /** @type {RoundTripParams} */ (params);

    const png = writePNG(image, { preserveTransparentColour }).toBytes();

    const roundtrip = readPNG(png);
    expect(roundtrip.warnings).isEmpty();

    expect(roundtrip.state.ihdr?.indexed).toEqual(expectIndexed);
    expect(roundtrip.state.ihdr?.bitDepth).toEqual(expectBitDepth);
    expect(roundtrip.state.ihdr?.channels).toEqual(expectChannels);

    if (preserveTransparentColour) {
      expect(roundtrip.state.idat?.image).toEqual(image);
    } else {
      expect(ignoreTransparent(roundtrip.state.idat?.image)).toEqual(ignoreTransparent(image));
    }
  });
});

const c1 = 0xFF123456;
const c2 = 0xFF654321;
const c3 = 0xFFABCDEF;
const c4 = 0xFFFEDCBA;
const cT = 0x80123456;

/**
 * @typedef {{
 *   image: number[][],
 *   preserveTransparentColour?: boolean,
 *   expectIndexed?: boolean,
 *   expectBitDepth: number,
 *   expectChannels: string[],
 * }} RoundTripParams
 */

/**
 * @param {number[][] | undefined} image
 */
const ignoreTransparent = (image) => image?.map((row) => row.map((c) => (c >>> 24) ? c : 0));
