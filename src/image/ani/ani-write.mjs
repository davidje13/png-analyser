import { writeRIFF } from '../../containers/riff.mjs';
import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeBMP } from '../bmp/bmp.mjs';
import { writeICO } from '../ico/ico-write.mjs';

// https://www.daubnet.com/en/file-format-ani

/**
 * @typedef {import('../ico/ico-write.mjs').IconSizeIn} IconSizeIn
 */

/**
 * @param {{
 *   sizes: IconSizeIn[];
 *   jiffies?: number;
 * }[]} steps
 */
export function writeANI(steps, {
  cursor = true,
  allowPNG = true,
  compressionTimeAllotment = 2000,
} = {}) {
  const r0 = steps[0].jiffies ?? 1;
  const allSameRate = steps.every((f) => (f.jiffies ?? 1) === r0);

  const frames = removeDuplicates(steps);
  const raw = false;

  const anih = new ByteArrayBuilder();
  anih.uint32LE(32); // header size
  anih.uint32LE(frames.length); // frame count
  anih.uint32LE(steps.length); // step count
  anih.uint32LE(0); // width (TODO)
  anih.uint32LE(0); // height (TODO)
  anih.uint32LE(0); // bits per pixel (TODO)
  anih.uint32LE(1); // planes
  anih.uint32LE(r0); // display rate (jiffies per frame)
  anih.uint32LE(((frames.length < steps.length) ? 0b10 : 0) | (raw ? 0 : 0b1)); // flags

  return writeRIFF('ACON', [
    { type: 'anih', data: anih },
    { type: 'fram', chunks: frames.map((icon) => ({
      type: 'icon',
      data: raw
        ? writeBMP(icon.sizes[0].image, { includeHeader: false }).data
        : writeICO(icon.sizes, { cursor, allowPNG, compressionTimeAllotment: compressionTimeAllotment / frames.length }).data,
    })) },
    (frames.length < steps.length) ? { type: 'seq ', data: (buf) => {
      for (const step of steps) {
        buf.uint32LE(frames.indexOf(step));
      }
    } } : null,
    allSameRate ? null : { type: 'rate', data: (buf) => {
      for (const step of steps) {
        buf.uint32LE(step.jiffies ?? 1);
      }
    } },
  ]);
}

/**
 * @param {{ sizes: IconSizeIn[] }[]} steps
 */
function removeDuplicates(steps) {
  const frames = [...steps];
  const seen = new Set();
  let del = 0;
  for (let i = 0; i < frames.length; ++i) {
    // TODO: smarter (non-identity-based) duplicate detection
    if (seen.has(frames[i].sizes)) {
      ++del;
    } else if (del) {
      frames[i - del] = frames[i];
    }
  }
  frames.length -= del;
  return frames;
}
