import { inflate, inflateRaw } from '../../deflate.mjs';
import { asBytes, concat, subView, subViewLen } from '../../data_utils.mjs';
import { registerChunk } from '../registry.mjs';
import { asCanvas, printImage } from '../../pretty.mjs';

/**
 * @typedef {import('../registry.mjs').State & import('../apng/shared_state.mjs').apngState & {
 *   ihdr?: import('./IHDR.mjs').IHDRChunk,
 *   plte?: import('./PLTE.mjs').PLTEChunk,
 *   trns?: import('../ancillary/tRNS.mjs').tRNSChunk,
 *   idat?: { raw: ArrayBufferView, filters: number[], image: number[][] },
 *   idats?: ArrayBufferView[],
 *   isApple?: boolean,
 * }} IDATState
 */

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

  const channels = indexed ? 1 : ((rgb ? 3 : 1) + (alpha ? 1 : 0));

  if (bits > 8) {
    warnings.push('16-bit images are not yet supported'); // TODO
    return;
  }

  let pixelStepBits = 0;
  /** @type {(c: number) => number} */ let lookup;

  if (indexed) {
    if (!state.plte?.entries) {
      warnings.push('Missing PLTE for indexed image');
      return;
    }
    const paletteRGB = state.plte.entries;
    const paletteA = state.trns?.indexedAlpha ?? [];
    pixelStepBits = bits;
    lookup = (i) => ((paletteA[i] ?? 0xFF) << 24) | paletteRGB[i];
  } else {
    pixelStepBits = channels * bits;
    if (bits === 8) {
      if (rgb && alpha) {
        if (state.isApple) { // ARGB is flipped to BGRA and premultiplied by alpha
          lookup = (c) => {
            const a = c & 0xFF;
            if (!a) {
              return 0;
            }
            const m = 255 / a;
            const b = (c >>> 24) & 0xFF;
            const g = (c >>> 16) & 0xFF;
            const r = (c >>> 8) & 0xFF;
            return (a << 24) | ((r * m) << 16) | ((g * m) << 8) | (b * m);
          };
        } else { // stored as RGBA
          lookup = (c) => (c >>> 8) | ((c & 0xFF) << 24);
        }
      } else if (rgb) {
        lookup = (c) => c | 0xFF000000;
      } else if (alpha) {
        lookup = (c) => ((c & 0xFF) << 24) | ((c >>> 8) * 0x010101);
      } else {
        lookup = (c) => 0xFF000000 | ((c & 0xFF) * 0x010101);
      }
    } else {
      warnings.push('non-8-bit unindexed images are not yet supported');
      return;
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
  const step = (w * pixelStepBits + 7) >>> 3;
  const leftShift = (pixelStepBits + 7) >>> 3;
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
    if (pixelStepBits >= 8) {
      // PNG avoids any bit sizes > 8 which are not multiples of 8
      const pixelStepBytes = pixelStepBits >>> 3;
      for (let x = 0; x < w; ++x) {
        let c = 0;
        for (let i = 0; i < pixelStepBytes; ++i) {
          c = (c << 8) | unfiltered[x * pixelStepBytes + i];
        }
        row.push(lookup(c));
      }
    } else {
      const mask = 0xFF >>> (8 - pixelStepBits);
      for (let x = 0; x < w; ++x) {
        const pp = x * pixelStepBits;
        const v = (unfiltered[(pp >>> 3)] >>> (8 - pixelStepBits - (pp & 7))) & mask;
        row.push(lookup(v));
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
