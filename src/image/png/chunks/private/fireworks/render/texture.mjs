import { svgEl } from '../../../../../../display/pretty.mjs';
import { MSKv } from '../nodes/MSKv.mjs';
import { makePattern } from './pattern.mjs';

/** @typedef {import('./globals.mjs').ImageGlobals} ImageGlobals */

/**
 * @param {ImageGlobals} globals
 * @param {MSKv} img
 * @param {number} opacity
 * @param {{ x: number, y: number }} offset
 */
export function makeTextureMask(globals, img, opacity = 1, offset = { x: 0, y: 0 }) {
	const patternID = makePattern(globals, img, offset);
	return globals.addDef(svgEl('mask', {}, [
		opacity < 1 ? svgEl('rect', {
			fill: '#ffffff',
			x: globals.left || undefined,
			y: globals.top || undefined,
			width: '100%',
			height: '100%',
		}) : null,
		svgEl('rect', {
			fill: `url(#${encodeURIComponent(patternID)})`,
			x: globals.left || undefined,
			y: globals.top || undefined,
			width: '100%',
			height: '100%',
			opacity,
		}),
	]), `texture:${patternID}:${opacity}`);
}
