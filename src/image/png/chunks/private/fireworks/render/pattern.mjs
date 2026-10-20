import { svgEl } from '../../../../../../display/pretty.mjs';
import { IMGv } from '../nodes/IMGv.mjs';
import { MSKv } from '../nodes/MSKv.mjs';
import { rasterToDataURL } from './image.mjs';
import { makeTransformMatrix } from './transform.mjs';

/** @typedef {import('./globals.mjs').ImageGlobals} ImageGlobals */

/**
 * @param {ImageGlobals} globals
 * @param {IMGv | MSKv} img
 * @param {{ x: number, y: number }} center
 * @param {{ x: number, y: number }} u
 * @param {{ x: number, y: number }} v
 */
export function makePattern(
	globals,
	img,
	center = { x: 0, y: 0 },
	u = { x: center.x + img.width, y: center.y },
	v = { x: center.x, y: center.y - img.height },
) {
	const transform = makeTransformMatrix(img.width, img.height, center, u, v);

	const imgID = globals.addDef((id) => svgEl('image', {
		id,
		href: img.cachedDataURL ??= rasterToDataURL(globals, img),
		width: img.width,
		height: img.height,
	}), uniqueImageID(img));

	return globals.addDef(svgEl('pattern', {
		viewBox: `0 0 ${img.width} ${img.height}`,
		width: img.width,
		height: img.height,
		patternUnits: 'userSpaceOnUse',
		patternTransform: transform,
	}, [svgEl('use', { href: `#${encodeURIComponent(imgID)}` })]), `pattern:${imgID}:${transform}`);
}

/** @param {IMGv | MSKv} img */
function uniqueImageID(img) {
	return `img:${img.width}:${img.height}:${img.tileSize}:${img.tiles.map((t) => `${t.type}=${t.value}`).join(':')}`
}
