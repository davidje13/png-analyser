import { inflate, inflateRaw } from '../../deflate.mjs';
import { asBytes, concat, subViewLen } from '../../data_utils.mjs';
import { registerChunk } from '../registry.mjs';
import { asCanvas, printImage } from '../../pretty.mjs';

/**
 * @typedef {import('../registry.mjs').State & import('../apng/shared_state.mjs').apngState & {
 *   ihdr?: import('./IHDR.mjs').IHDRChunk,
 *   plte?: import('./PLTE.mjs').PLTEChunk,
 *   trns?: import('../ancillary/tRNS.mjs').tRNSChunk,
 *   sbit?: import('../ancillary/sBIT.mjs').sBITChunk,
 *   gama?: import('../ancillary/gAMA.mjs').gAMAChunk,
 *   idat?: { raw: ArrayBufferView, filters: number[], image: number[][] },
 *   idats?: ArrayBufferView[],
 *   isApple?: boolean,
 * }} IDATState
 */

const displayGamma = 1 / 2.2;
const displayMax = 255;

registerChunk('IDAT', { min: 1, sequential: true }, (chunk, /** @type {IDATState} */ state, warnings) => {
  state.idats ||= [];
  state.idats.push(chunk.data);

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
        `Row filters: ${state.idat.filters.join(', ')}`,
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
      content.append(
        `Inflated bytes: ${state.idat.raw.byteLength}\n`,
        `Row filters: ${state.idat.filters.join(', ')}\n`,
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
  let raw = new Uint8Array(0);
  try {
    if (state.isApple) {
      raw = asBytes(inflateRaw(concat(state.idats)));
    } else {
      raw = asBytes(inflate(concat(state.idats)));
    }
  } catch (e) {
    warnings.push(`idat compressed data is unreadable ${e}`);
  }

  /** @type {number[]} */ const filters = [];
  /** @type {number[][]} */ const image = [];
  state.idat = { raw, filters, image };

  if (!state.ihdr) {
    return;
  }
  const w = state.ihdr.width ?? 0;
  const h = state.ihdr.height ?? 0;
  const bits = state.ihdr.bitDepth ?? 8;
  const filterMethod = state.ihdr.filterMethod ?? 0;
  const interlaceMethod = state.ihdr.interlaceMethod ?? 0;
  const indexed = state.ihdr.indexed ?? false;
  const rgb = state.ihdr.rgb ?? true;
  const alpha = state.ihdr.alpha ?? true;
  const gamma = displayGamma / (state.gama?.gamma ?? displayGamma);

  const channels = indexed ? 1 : ((rgb ? 3 : 1) + (alpha ? 1 : 0));

  /** @type {(c: number[]) => number} */ let lookup;

  if (indexed) {
    if (!state.plte?.entries) {
      warnings.push('Missing PLTE for indexed image');
      return;
    }
    const paletteRGB = state.plte.entries;
    // TODO: apply gamma to palette entries
    const paletteA = state.trns?.indexedAlpha ?? [];
    lookup = ([i]) => ((paletteA[i] ?? 0xFF) << 24) | paletteRGB[i];
  } else {
    const lim = 1 << bits;
    const mask = lim - 1;
    /** @type {number[][]} */ const lookupTables = [];
    for (let i = 0; i < channels; ++i) {
      const originalMax = (1 << (state.sbit?.originalBits?.[i] ?? bits)) - 1;
      const mult1 = originalMax / mask;
      const mult2 = displayMax / originalMax;
      const isAlpha = alpha && i === channels - 1;
      /** @type {number[]} */ const table = [];
      for (let j = 0; j < lim; ++j) {
        let v = j;
        v = (v * mult1 + 0.5)|0; // scale to original bit depth (and round)
        v = v * mult2; // scale to display bit depth (no rounding until after gamma correction)
        if (!isAlpha && gamma !== 1) { // apply gamma correction
          v = Math.pow(v / displayMax, gamma) * displayMax;
        }
        v = (v + 0.5)|0; // round
        table[j] = v;
      }
      lookupTables.push(table);
    }

    if (rgb && alpha) {
      if (state.isApple) { // RGBA is flipped to BGRA and premultiplied by alpha
        lookup = ([b, g, r, a]) => {
          if (!a) {
            return 0;
          }
          const m = mask / a;
          return (
            (lookupTables[3][a] << 24) |
            ((lookupTables[0][(r * m)|0]) << 16) |
            ((lookupTables[1][(g * m)|0]) << 8) |
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
  }

  if (filterMethod !== 0) {
    warnings.push(`Filter method ${filterMethod} is not supported`);
    return;
  }
  if (interlaceMethod !== 0) {
    warnings.push('Interlaced images are not yet supported'); // TODO
    return;
  }


  let p = 0;
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
  if (p !== raw.byteLength) {
    warnings.push(`Expected ${p} uncompressed bytes, got ${raw.byteLength}`);
  }
});
