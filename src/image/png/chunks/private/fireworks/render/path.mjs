import { PBPv } from '../nodes/PBPv.mjs';

/**
 * @param {PBPv} contour
 * @return {string}
 */
export function contourToSVG(contour) {
	const begin = contour.points[0];
	if (!begin) {
		return '';
	}
	let r = `M${begin.x} ${begin.y}`;
	for (let i = 1; i < contour.points.length; ++i) {
		const ptA = contour.points[i - 1];
		const pt = contour.points[i];
		r += `C${ptA.xC2} ${ptA.yC2} ${pt.xC1} ${pt.yC1} ${pt.x} ${pt.y}`;
	}
	if (contour.isClosed) {
		const ptA = contour.points[contour.points.length - 1];
		const pt = contour.points[0];
		r += `C${ptA.xC2} ${ptA.yC2} ${pt.xC1} ${pt.yC1} ${pt.x} ${pt.y}Z`;
	}
	return r;
}
