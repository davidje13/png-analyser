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

const NEWLINE = /\n/g;

/**
 * @param {string} s
 * @param {string} prefix
 * @param {string=} firstPrefix
 * @return {string}
 */
export function indent(s, prefix, firstPrefix = prefix) {
  return firstPrefix + s.replace(NEWLINE, '\n' + prefix);
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
 * @return {ImageData}
 */
export function asImageData(image, alpha) {
  if (!image.length || !image[0].length) {
    return new ImageData(0, 0);
  }
  const w = image[0]?.length ?? 0;
  const h = image.length;
  const dat = new ImageData(w, h);
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
  return dat;
}

/**
 * @param {number} w
 * @param {number} h
 * @return {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }}
 */
export function makeCanvas(w, h) {
  if (w < 0 || h < 0) {
    throw new Error(`Invalid canvas size ${w} x ${h}`);
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  return { canvas, ctx };
}

/**
 * @param {number[][]} image
 * @param {boolean} alpha
 * @return {HTMLCanvasElement}
 */
export function asCanvas(image, alpha) {
  const c = makeCanvas(image[0]?.length ?? 0, image.length);
  c.ctx.putImageData(asImageData(image, alpha), 0, 0);
  return c.canvas;
}

/**
 * @param {number} c
 * @return {string}
 */
export const rgba = (c) => `rgba(${(c >>> 16) & 0xFF}, ${(c >>> 8) & 0xFF}, ${c & 0xFF}, ${(c >>> 24) / 255})`;

/**
 * @param {number} c
 * @return {string}
 */
export const rgb = (c) => `rgb(${(c >>> 16) & 0xFF}, ${(c >>> 8) & 0xFF}, ${c & 0xFF})`;

/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   tiles: (
 *     { type: 'c', x: number, y: number, value: number, w: number, h: number } |
 *     { type: 'i', x: number, y: number, value: number[][] }
 *   )[],
 * }} TileData
 */

/**
 * @param {TileData} tileData
 * @return {HTMLCanvasElement}
 */
export function tilesAsCanvas({ width, height, tiles }) {
  const c = makeCanvas(width, height);
  for (const tile of tiles) {
    switch (tile.type) {
      case 'i':
        c.ctx.putImageData(asImageData(tile.value, true), tile.x, tile.y);
        break;
      case 'c':
        c.ctx.fillStyle = rgba(tile.value);
        c.ctx.fillRect(tile.x, tile.y, tile.w, tile.h);
        break;
    }
  }
  return c.canvas;
}

/**
 * @typedef {{ position: number, colour: number }[]} Gradient
 */

const backgroundGrad = 'repeating-linear-gradient(to bottom,#FFFFFF 0px 10px,#CCCCCC 10px 20px)';

/**
 * @param {Gradient} gradient
 * @param {boolean=} alphaToLum
 * @return {HTMLElement}
 */
export function asGradientDiv(gradient, alphaToLum = false) {
  const stops = gradient.map((stop) => `${rgba(alphaToLum ? a2l(stop.colour) : stop.colour)} ${stop.position * 100}%`);
  const preview = document.createElement('div');
  preview.classList.add('gradient-preview');
  preview.style.backgroundImage = `linear-gradient(to right,${stops.join(',')}),${backgroundGrad}`;
  return preview;
}

/**
 * @param {number} c
 * @return {number}
 */
const a2l = (c) => ((c >>> 24) * 0x010101) | 0xFF000000;
