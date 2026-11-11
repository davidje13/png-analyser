import { P3, sRGB, to, toGamut, XYZ_D65 } from 'colorjs.io/fn';
import { makeCanvas, svgEl } from './pretty.mjs';
import { SPECTRUM_xy } from '../colour/xyz.mjs';

/**
 * @param {{
 *   perimeter?: { x: number, y: number }[] | null | undefined,
 *   points?: [{ x: number, y: number } | null | undefined, string][],
 *   height?: number,
 * }} options
 */
export function visualiseColourSpace({ perimeter = null, points = [], height = 300 }) {
  const id = crypto.randomUUID();

	return svgEl('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 750 850`,
    width: height * 750 / 850,
    height: height,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    fill: 'none',
  }, [
    svgEl('defs', {}, [
      svgEl('path', { id: `${id}-p`, d: 'M' + SPECTRUM_xy.map(toPt).join('L'), 'vector-effect': 'non-scaling-stroke' }),
      perimeter ? svgEl('path', { id: `${id}-b`, d: 'M' + perimeter.map(({ x, y }) => toPt([x, y])).join('L') + 'Z', 'vector-effect': 'non-scaling-stroke' }) : null,
      svgEl('mask', { id: `${id}-m` }, [
        svgEl('use', { href: `#${id}-p`, fill: perimeter ? '#808080' : '#FFFFFF' }),
        perimeter ? svgEl('use', { href: `#${id}-b`, fill: '#FFFFFF' }) : null,
      ]),
    ]),
    svgEl('g', { transform: 'translate(0 850) scale(1 -1)' }, [
      svgEl('image', {
        href: (cachedXY ??= generateXYImage()),
        width: '750',
        height: '850',
        preserveAspectRatio: 'none',
        mask: `url(#${id}-m)`,
      }),
      svgEl('use', { href: `#${id}-p`, stroke: '#000000', 'stroke-width': 1.5 }),
      perimeter ? svgEl('use', { href: `#${id}-b`, stroke: '#000000' }) : null,
			...points.map(([p, c]) => p && (p.x > 0 || p.y > 0)
				? svgEl('circle', { cx: p.x * 1000, cy: p.y * 1000, r: 8, fill: c, stroke: '#000000', 'vector-effect': 'non-scaling-stroke' })
				: null
			),
    ]),
  ]);
}

/** @param {[number, number]} coord */
const toPt = ([x, y]) => `${(x * 1000).toFixed(0)} ${(y * 1000).toFixed(0)}`;

let cachedXY = null;

function generateXYImage() {
  const rx = 0.75;
  const ry = 0.85;
  const w = 100;
  const h = 100;
  const sx = rx / w;
  const sy = ry / h;

  const c = makeCanvas(w, h, { colorSpace: 'display-p3' });
  const dat = c.ctx.createImageData(w, h);
  const targetSpace = dat.colorSpace === 'display-p3' ? P3 : sRGB;
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      const p = (y * w + x) * 4;
      const xx = Math.max(x * sx, 0.0001);
      const yy = Math.max(y * sy, 0.0001);
      const c = toGamut(pNorm(to({
        space: XYZ_D65,
        coords: [xx / yy, 1, (1 - xx - yy) / yy],
      }, targetSpace), 10), { method: 'clip' }).coords;
      dat.data[p] = (c[0] ?? 0) * 255;
      dat.data[p + 1] = (c[1] ?? 0) * 255;
      dat.data[p + 2] = (c[2] ?? 0) * 255;
      dat.data[p + 3] = 255;
    }
  }
  c.ctx.putImageData(dat, 0, 0);
  return c.canvas.toDataURL('image/png');
}

/**
 * @param {import('colorjs.io/fn').PlainColorObject} c
 * @param {number} p
 * @return {import('colorjs.io/fn').PlainColorObject}
 */
function pNorm(c, p) {
  const n = Math.pow(
    Math.pow(c.coords[0] ?? 0, p) +
    Math.pow(c.coords[1] ?? 0, p) +
    Math.pow(c.coords[2] ?? 0, p),
    -1 / p
  );
  return { ...c, coords: [(c.coords[0] ?? 0) * n, (c.coords[1] ?? 0) * n, (c.coords[2] ?? 0) * n] };
}
