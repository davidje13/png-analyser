/** @param {import('./registry.mjs').CustomData | undefined} v */
export const str = (v) => typeof v === 'string' ? v : undefined;

/** @param {import('./registry.mjs').CustomData | undefined} v */
export const float = (v) => typeof v === 'string' ? Number.parseFloat(v) : undefined;

/**
 * @param {import('./registry.mjs').CustomData | undefined} c
 * @param {import('./registry.mjs').CustomData | undefined=} alpha
 * @param {number=} alphaRange
 * @return {number | undefined}
 */
export function col(c, alpha, alphaRange = 255) {
	if (!c || typeof c !== 'string') {
		return undefined;
	}
	if (c[0] === '#') {
		if (c.length === 7) {
			const a = float(alpha);
			let r = 0xFF000000;
			if (a !== undefined) {
				r = (Math.max(0, Math.min(255, Math.round((a / alphaRange) * 255))) << 24) >>> 0;
			}
			return (r | Number.parseInt(c.substring(1), 16)) >>> 0;
		}
		if (c.length === 9) {
			return (
				(Number.parseInt(c.substring(7), 16) << 24) |
				Number.parseInt(c.substring(1, 7), 16)
			) >>> 0;
		}
	}
	return undefined;
}
