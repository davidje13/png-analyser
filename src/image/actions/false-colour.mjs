export const SPECTRUM_WIDE = [
	...grad(0xFF000000, 0xFFFF0000, 256),
	...grad(0xFFFF0000, 0xFFFFFF00, 256),
	...grad(0xFFFFFF00, 0xFF00FF00, 256),
	...grad(0xFF00FF00, 0xFF00FFFF, 256),
	...grad(0xFF00FFFF, 0xFF0000FF, 256),
	...grad(0xFF0000FF, 0xFFFF00FF, 256),
	...grad(0xFFFF00FF, 0xFFFFFFFF, 256),
	0xFFFFFF,
];

export const SPECTRUM_BLACK_WHITE = [
	...grad(0xFF000000, 0xFFFFFFFF, 256),
	0xFFFFFFFF,
];

export const SPECTRUM_RED = [
	...grad(0xFF000000, 0xFFFF0000, 256),
	...grad(0xFFFF0000, 0xFFFFFFFF, 256),
	0xFFFFFFFF,
];

/**
 * @param {number[][]} image
 * @param {number[]} spectrum
 * @param {number} min
 * @param {number} max
 * @return {number[][]}
 */
export function falseColour(image, spectrum, min, max) {
	const count = spectrum.length;
	const scale = count / (max - min);
	return image.map((row) => row.map((v) => {
		const p = ((v - min) * scale)|0;
		return spectrum[p < 0 ? 0 : p >= count ? count - 1 : p];
	}));
}

/**
 * @param {number} from
 * @param {number} to
 * @param {number} count
 * @return {number[]}
 */
function grad(from, to, count) {
	const c1 = splitARGB(from);
	const c2 = splitARGB(to);
	c1.r *= c1.a;
	c1.g *= c1.a;
	c1.b *= c1.a;
	c2.r *= c2.a;
	c2.g *= c2.a;
	c2.b *= c2.a;
	/** @type {number[]} */ const out = [];
	for (let i = 0; i < count; ++i) {
		const p = i / count;
		const p2 = 1 - p;
		let r = c1.r * p2 + c2.r * p;
		let g = c1.g * p2 + c2.g * p;
		let b = c1.b * p2 + c2.b * p;
		const a = c1.a * p2 + c2.a * p;
		if (a) {
			r /= a;
			g /= a;
			b /= a;
		}
		out.push(((Math.round(a) << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)) >>> 0);
	}
	return out;
}

/**
 * @param {number} col
 */
function splitARGB(col) {
  return {
    a: col >>> 24,
    r: (col >>> 16) & 0xFF,
    g: (col >>> 8) & 0xFF,
    b: col & 0xFF,
  };
}
