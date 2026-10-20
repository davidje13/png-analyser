/**
 * @param {number} w
 * @param {number} h
 * @param {{ x: number, y: number }} center
 * @param {{ x: number, y: number }} u
 * @param {{ x: number, y: number }} v
 */
export function makeTransformMatrix(w, h, center, u, v) {
	if (center.x === 0 && center.y === 0 && u.x === w && u.y === 0 && v.x === 0 && v.y === -h) {
		return undefined;
	}
	const iu = 1 / w;
	const iv = 1 / h;
	return `matrix(${(u.x - center.x) * iu} ${(u.y - center.y) * iu} ${(center.x - v.x) * iv} ${(center.y - v.y) * iv} ${center.x} ${center.y})`;
}
