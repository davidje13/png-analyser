/**
 * @param {unknown} v
 * @return {string}
 */
export function printNice(v) {
  return JSON.stringify(v, niceBuffer, 2);
}

/**
 * @param {string} k
 * @param {unknown} v
 * @return {unknown}
 */
function niceBuffer(k, v) {
  if (v instanceof DataView) {
    let r = [];
    for (let i = 0; i < v.byteLength; ++i) {
      r.push(v.getUint8(i).toString(16).padStart(2, '0'));
    }
    return `[${v.byteLength}] ${r.join(' ')}`;
  }
  return v;
}

/**
 * @param {number} top
 * @param {number} bottom
 * @return {number}
 */
export const mixColour = (top, bottom) => {
  const aT = top >>> 24;
  const rT = (top >>> 16) & 0xFF;
  const gT = (top >>> 8) & 0xFF;
  const bT = top & 0xFF;

  const aB = 255 - aT;
  const rB = (bottom >>> 16) & 0xFF;
  const gB = (bottom >>> 8) & 0xFF;
  const bB = bottom & 0xFF;
  const r = Math.round((aT * rT + aB * rB) / 255);
  const g = Math.round((aT * gT + aB * gB) / 255);
  const b = Math.round((aT * bT + aB * bB) / 255);
  return 0xFF000000 | (r << 16) | (g << 8) | b;
};

export const termReset = '\u001b[0m';

/**
 * @param {number} c
 * @return {string}
 */
export const termCol = (c) => `\u001b[48;2;${(c >> 16) & 0xFF};${(c >> 8) & 0xFF};${c & 0xFF}m`;

/**
 * @param {number[][]} image
 * @param {number=} background
 * @return {string}
 */
export function printImage(image, background = -1) {
  return image.map((row) => row.map((c) => {
    if (c < 0) {
      return `${termReset}!`;
    }
    const mixed = background < 0 ? c : mixColour(c, background);
    return `${termCol(mixed)} `;
  }).join('') + `${termReset}\n`).join('');
}

/**
 * @param {number[][]} image
 * @param {boolean} alpha
 * @return {Node}
 */
export function asCanvas(image, alpha) {
  if (!image.length || !image[0].length) {
    const info = document.createElement('span');
    info.innerText = `invalid image size (${image[0]?.length ?? 0}x${image.length})`;
    return info;
  }
  const w = image[0]?.length ?? 0;
  const h = image.length;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) {
    const info = document.createElement('span');
    info.innerText = 'getContext failed';
    return info;
  }
  const dat = ctx.createImageData(w, h);
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      const c = image[y][x];
      const p = (y * w + x) * 4;
      dat.data[p  ] = (c >>> 16) & 0xFF;
      dat.data[p+1] = (c >>> 8) & 0xFF;
      dat.data[p+2] = c & 0xFF;
      dat.data[p+3] = alpha ? c >>> 24 : 255;
    }
  }
  ctx.putImageData(dat, 0, 0);
  return c;
}
