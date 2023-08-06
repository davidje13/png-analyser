import { inflate, inflateRaw } from '../../../../data/deflate.mjs';
import { asBytes, concat, subViewLen } from '../../../../data/utils.mjs';
import { registerChunk } from '../registry.mjs';
import { asCanvas, printImage } from '../../../../display/pretty.mjs';

/**
 * @typedef {{ image: number[][], filters: number[] }} SubImage
 *
 * @typedef {import('../registry.mjs').State & import('../apng/shared_state.mjs').apngState & {
 *   ihdr?: import('./IHDR.mjs').IHDRChunk,
 *   plte?: import('./PLTE.mjs').PLTEChunk,
 *   trns?: import('../ancillary/tRNS.mjs').tRNSChunk,
 *   sbit?: import('../ancillary/sBIT.mjs').sBITChunk,
 *   gama?: import('../ancillary/gAMA.mjs').gAMAChunk,
 *   idot?: import('../private/apple/iDOT.mjs').iDOTChunk,
 *   idat?: { raw: ArrayBufferView, image: number[][], levels: SubImage[] },
 *   idats?: import('../registry.mjs').Chunk[],
 *   isApple?: boolean,
 * }} IDATState
 */

const displayGamma = 1 / 2.2;
const displayMax = 255;

registerChunk('IDAT', { min: 1, sequential: true }, (chunk, /** @type {IDATState} */ state, warnings) => {
  state.idats ||= [];
  state.idats.push(chunk);

  if (state.apngCurrentFrame?.state === 1 || state.apngCurrentFrame?.state === 2) {
    state.apngCurrentFrame.data.push(chunk.data);
    state.apngCurrentFrame.state = 2;
  } else if (state.apngCurrentFrame?.state === 3) {
    warnings.push(`fdAT and IDAT chunks for frame ${state.apngCurrentFrame.num}`);
  }

  chunk.aggregate = () => ({
    toString: () => {
      if (!state.idat) {
        return 'no IDAT data';
      }
      return [
        `Inflated bytes: ${state.idat.raw.byteLength}`,
        `Interlace levels and row filters:\n${state.idat.levels.map((l) => `  ${imageSize(l.image)} ${l.filters.join(' ')}`).join('\n')}`,
        `${printImage(state.idat.image, 0xFF808080)}`,
      ].join('\n');
    },
    display: (summary, content) => {
      if (!state.idat) {
        content.append('no IDAT data');
        return;
      }
      const c = asCanvas(state.idat.image, true);
      c.style.minWidth = '200px';
      summary.append(imageSize(state.idat.image));
      content.append(
        `Inflated bytes: ${state.idat.raw.byteLength}\n`,
        `Interlace levels and row filters:\n${state.idat.levels.map((l) => `  ${imageSize(l.image)} ${l.filters.join(' ')}`).join('\n')}\n`,
        c,
      );
    },
  });
}, (state, warnings) => {
  if (!state.idats) {
    return;
  }
  if (state.ihdr?.compressionMethod ?? 0 !== 0) {
    warnings.push(`Compression method ${state.ihdr?.compressionMethod} is not supported`);
    return;
  }

  if (state.idot) {
    for (let s = 0; s < state.idot.segments.length; ++s) {
      const seg = state.idot.segments[s];
      const begin = state.idats.findIndex((c) => c.filePos === seg.idatChunkFilePos);
      if (begin === -1) {
        warnings.push(`Unable to find IDAT chunk for iDOT segment #${s + 1}`);
      } else {
        seg.idatIndex = begin;
      }
    }
  }

  let raw = new Uint8Array(0);
  try {
    if (state.isApple) {
      raw = asBytes(inflateRaw(concat(state.idats.map((c) => c.data))));
    } else {
      raw = asBytes(inflate(concat(state.idats.map((c) => c.data))));
    }
  } catch (e) {
    warnings.push(`idat compressed data is unreadable ${e}`);
  }

  if (!state.ihdr) {
    state.idat = { raw, image: [], levels: [] };
    return;
  }
  const width = state.ihdr.width ?? 0;
  const height = state.ihdr.height ?? 0;
  const bits = state.ihdr.bitDepth ?? 8;
  const filterMethod = state.ihdr.filterMethod ?? 0;
  const interlaceMethod = state.ihdr.interlaceMethod ?? 0;
  const indexed = state.ihdr.indexed ?? false;
  const rgb = state.ihdr.rgb ?? true;
  const alpha = state.ihdr.alpha ?? true;
  const gamma = displayGamma / (state.gama?.gamma ?? displayGamma);

  const colChannels = rgb ? 3 : 1;
  const channels = indexed ? 1 : (colChannels + (alpha ? 1 : 0));

  /** @type {number[][]} */ const lookupTables = [];
  for (let i = 0; i < colChannels + 1; ++i) {
    const colBits = indexed ? 8 : bits;
    const max = (1 << colBits) - 1;
    const originalMax = (1 << (state.sbit?.originalBits?.[i] ?? colBits)) - 1;
    const isAlpha = i === colChannels;
    /** @type {number[]} */ const table = [];
    for (let j = 0; j < (1 << colBits); ++j) {
      let v = j;
      v = (v * originalMax / max + 0.5)|0; // scale to original bit depth (and round)
      // scale to display bit depth and apply gamma correction
      if (!isAlpha && gamma !== 1) {
        v = Math.pow(v / originalMax, gamma) * displayMax;
      } else {
        v *= displayMax / originalMax;
      }
      table[j] = (v + 0.5)|0; // round
    }
    lookupTables.push(table);
  }

  /** @type {(c: number[]) => number} */ let lookup;

  if (indexed) {
    if (!state.plte?.entries) {
      warnings.push('Missing PLTE for indexed image');
      state.idat = { raw, image: [], levels: [] };
      return;
    }
    const paletteRGB = state.plte.entries;
    const paletteA = state.trns?.indexedAlpha ?? [];
    /** @type {number[]} */ const lookupPalette = [];
    for (let i = 0; i < paletteRGB.length; ++i) {
      const c = paletteRGB[i];
      lookupPalette.push(
        (lookupTables[3][paletteA[i] ?? 0xFF] << 24) |
        (lookupTables[0][c >>> 16] << 16) |
        (lookupTables[1][(c >>> 8) & 0xFF] << 8) |
        lookupTables[2][c & 0xFF]
      );
    }
    lookup = ([i]) => lookupPalette[i];
  } else if (rgb && alpha) {
    if (state.isApple) { // RGBA is flipped to BGRA and premultiplied by alpha
      const max = (1 << bits) - 1;
      lookup = ([b, g, r, a]) => {
        if (!a) {
          return 0;
        }
        const m = max / a;
        return (
          (lookupTables[3][a] << 24) |
          (lookupTables[0][(r * m)|0] << 16) |
          (lookupTables[1][(g * m)|0] << 8) |
          lookupTables[2][(b * m)|0]
        );
      };
    } else {
      lookup = ([r, g, b, a]) => (
        (lookupTables[3][a] << 24) |
        (lookupTables[0][r] << 16) |
        (lookupTables[1][g] << 8) |
        lookupTables[2][b]
      );
    }
  } else if (rgb) {
    let transR = -1;
    let transG = -1;
    let transB = -1;
    if (state.trns) {
      transR = state.trns.sampleRed ?? 0;
      transG = state.trns.sampleGreen ?? 0;
      transB = state.trns.sampleBlue ?? 0;
    }
    lookup = ([r, g, b]) => (r === transR && g === transG && b === transB) ? 0 : (
      0xFF000000 |
      (lookupTables[0][r] << 16) |
      (lookupTables[1][g] << 8) |
      lookupTables[2][b]
    );
  } else if (alpha) {
    lookup = ([l, a]) => (
      (lookupTables[1][a] << 24) |
      (lookupTables[0][l] * 0x010101)
    );
  } else {
    const trans = state.trns?.sampleGray ?? -1;
    lookup = ([l]) => l === trans ? 0 : (
      0xFF000000 |
      (lookupTables[0][l] * 0x010101)
    );
  }

  if (filterMethod !== 0) {
    warnings.push(`Filter method ${filterMethod} is not supported`);
    state.idat = { raw, image: [], levels: [] };
    return;
  }

  let p = 0;

  /**
   * @param {number} w
   * @param {number} h
   * @return {SubImage}
   */
  const readImagePart = (w, h) => {
    /** @type {number[]} */ const filters = [];
    /** @type {number[][]} */ const image = [];
    if (!w || !h) {
      return { image, filters };
    }
    const step = (w * channels * bits + 7) >>> 3;
    const leftShift = (channels * bits + 7) >>> 3;
    let unfiltered = new Uint8Array(step);
    let prevUnfiltered = new Uint8Array(step); // begin as 0s
    for (let y = 0; y < h; ++y) {
      const filter = raw[p];
      ++p;
      if (filter === 0) {
        unfiltered.set(asBytes(subViewLen(raw, p, step)), 0);
      } else {
        for (let i = 0; i < step; ++i) {
          const above = prevUnfiltered[i];
          const aboveLeft = prevUnfiltered[i - leftShift] ?? 0;
          const left = unfiltered[i - leftShift] ?? 0;
          const value = raw[p + i];
          let ref = 0;
          switch (filter) {
            case 1: ref = left; break;
            case 2: ref = above; break;
            case 3: ref = (left + above) >>> 1; break;
            case 4: // Paeth
              const base = left + above - aboveLeft;
              const dL = Math.abs(left - base);
              const dA = Math.abs(above - base);
              const dD = Math.abs(aboveLeft - base);
              ref = (dL <= dA && dL <= dD) ? left : (dA <= dD) ? above : aboveLeft;
              break;
          }
          unfiltered[i] = (ref + value) & 0xFF;
        }
      }
      /** @type {number[]} */ const row = [];
      if (bits >= 8) {
        // PNG avoids any bit sizes > 8 which are not multiples of 8
        const bytes = bits >>> 3;
        for (let x = 0; x < w; ++x) {
          const v = [];
          for (let c = 0; c < channels; ++c) {
            let vc = 0;
            for (let i = 0; i < bytes; ++i) {
              vc = (vc << 8) | unfiltered[(x * channels + c) * bytes + i];
            }
            v.push(vc);
          }
          row.push(lookup(v) >>> 0);
        }
      } else {
        const mask = (1 << bits) - 1;
        for (let x = 0; x < w; ++x) {
          const v = [];
          for (let c = 0; c < channels; ++c) {
            const pp = (x * channels + c) * bits;
            v.push((unfiltered[(pp >>> 3)] >>> (8 - bits - (pp & 7))) & mask);
          }
          row.push(lookup(v) >>> 0);
        }
      }
      p += step;
      filters.push(filter);
      image.push(row);
      [unfiltered, prevUnfiltered] = [prevUnfiltered, unfiltered];
    }
    return { image, filters };
  };

  switch (interlaceMethod) {
    case 0: // null
      const level = readImagePart(width, height);
      state.idat = { raw, image: level.image, levels: [level] };
      break;
    case 1: // Adam7
      const levels = ADAM_LEVELS.map(([ox, oy, sx, sy]) => readImagePart(
        (width + (1 << sx) - ox - 1) >>> sx,
        (height + (1 << sy) - oy - 1) >>> sy,
      ));
      const combinedImage = adam7(width, height, levels.map((i) => i.image));
      state.idat = { raw, image: combinedImage, levels };
      break;
    default:
      warnings.push(`Unsupported interlace method ${interlaceMethod}`);
      state.idat = { raw, image: [], levels: [] };
      return;
  }

  if (p !== raw.byteLength) {
    warnings.push(`Expected ${p} uncompressed bytes, got ${raw.byteLength}`);
  }
});

const ADAM_LOOKUP = [
  0, 5, 3, 5, 1, 5, 3, 5,
  6, 6, 6, 6, 6, 6, 6, 6,
  4, 5, 4, 5, 4, 5, 4, 5,
  6, 6, 6, 6, 6, 6, 6, 6,
  2, 5, 3, 5, 2, 5, 3, 5,
  6, 6, 6, 6, 6, 6, 6, 6,
  4, 5, 4, 5, 4, 5, 4, 5,
  6, 6, 6, 6, 6, 6, 6, 6,
];
const ADAM_LEVELS = [
  [0, 0, 3, 3],
  [4, 0, 3, 3],
  [0, 4, 2, 3],
  [2, 0, 2, 2],
  [0, 2, 1, 2],
  [1, 0, 1, 1],
  [0, 1, 0, 1],
];

/**
 * @param {number} w
 * @param {number} h
 * @param {number[][][]} levels
 * @return {number[][]}
 */
function adam7(w, h, levels) {
  /** @type {number[][]} */ const image = [];
  for (let y = 0; y < h; ++y) {
    /** @type {number[]} */ const row = [];
    for (let x = 0; x < w; ++x) {
      const l = ADAM_LOOKUP[(y & 7) * 8 + (x & 7)];
      const [ox, oy, sx, sy] = ADAM_LEVELS[l];
      row.push(levels[l][(y - oy) >>> sy][(x - ox) >>> sx]);
    }
    image.push(row);
  }
  return image;
}

/**
 * @param {number[][]} img
 * @return {string}
 */
const imageSize = (img) => {
  if (!img.length) {
    return '0x0';
  }
  return `${img[0].length}x${img.length}`;
};
