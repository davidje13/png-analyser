import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & import('../../mandatory/IDAT.mjs').IDATState & {
 *   ihdr?: import('../../mandatory/IHDR.mjs').IHDRChunk,
 *   nptc?: npTcChunk,
 * }} npTcState
 * @typedef {import('../../registry.mjs').Chunk & {
 *   wasDeserialised: boolean;
 *   xguides: number[];
 *   yguides: number[];
 *   padL: number;
 *   padR: number;
 *   padT: number;
 *   padB: number;
 *   solidColours: (number | null)[];
 * }} npTcChunk
 */

// https://android.googlesource.com/platform/frameworks/base/+/56a2301/include/androidfw/ResourceTypes.h

registerChunk('npTc', { max: 1, requiresPost: ['IDAT'] }, (/** @type {npTcChunk} */ chunk, /** @type {npTcState} */ state, warnings) => {
  state.nptc = chunk;
  if (chunk.data.byteLength < 20) {
    warnings.push(`npTc chunk length ${chunk.data.byteLength} is too small`);
  }
  chunk.wasDeserialised = chunk.data.getUint8(0) !== 0;
  const nx = chunk.data.getUint8(1);
  const ny = chunk.data.getUint8(2);
  const nc = chunk.data.getUint8(3);
  if (nc !== (nx + 1) * (ny + 1)) {
    warnings.push(`npTc defines incorrect number of colours (${nc} != ${nx + 1} * ${ny + 1})`);
  }
  const expectedSize = 20 + nx * 4 + ny * 4 + nc * 4;
  if (chunk.data.byteLength !== expectedSize) {
    warnings.push(`npTc chunk length ${chunk.data.byteLength} does not match expectation ${expectedSize}`);
  }
  let p = 4;

  chunk.xguides = [0];
  for (let x = 0; x < nx; ++x) {
    chunk.xguides.push(chunk.data.getUint32(p));
    p += 4;
  }

  chunk.padL = chunk.data.getUint32(p);
  chunk.padR = chunk.data.getUint32(p + 4);
  chunk.padT = chunk.data.getUint32(p + 8);
  chunk.padB = chunk.data.getUint32(p + 12);
  p += 16;

  chunk.yguides = [0];
  for (let y = 0; y < ny; ++y) {
    chunk.yguides.push(chunk.data.getUint32(p));
    p += 4;
  }

  chunk.solidColours = [];
  for (let n = 0; n < nc; ++n) {
    const c = chunk.data.getUint32(p);
    chunk.solidColours.push((c === 1) ? null : c);
    p += 4;
  }
}, (state, warnings) => {
  const c = state.nptc;
  const img = state.idat?.image;
  if (!c || !img) {
    return;
  }
  const w = state.ihdr?.width ?? 0;
  const h = state.ihdr?.height ?? 0;
  c.xguides.push(w);
  c.yguides.push(h);

  const nx = c.xguides.length - 1;
  const ny = c.yguides.length - 1;
  for (let y = 0; y < ny; ++y) {
    const y0 = c.yguides[y];
    const y1 = c.yguides[y + 1];
    if (y1 > h) {
      warnings.push(`npTc y guide out of bounds: ${y1}`);
      break;
    }
    for (let x = 0; x < nx; ++x) {
      const x0 = c.xguides[x];
      const x1 = c.xguides[x + 1];
      if (x1 > w) {
        warnings.push(`npTc x guide out of bounds: ${y1}`);
        break;
      }
      if (y1 === y0 || x1 === x0) {
        continue;
      }
      const col = c.solidColours[y * nx + x];
      if (col === null) {
        continue;
      }
      outer: for (let yy = y0; yy < y1; ++yy) {
        for (let xx = x0; xx < x1; ++xx) {
          if (img[yy][xx] !== col) {
            warnings.push(`npTc defines solid colour for region ${x}, ${y}, but image does not match`);
            break outer;
          }
        }
      }
    }
  }
});
