import { svgEl } from '../../../../../../display/pretty.mjs';
import { registerEffect } from './registry.mjs';

/** @param {import('./registry.mjs').ImageGlobals} globals */
export function invertFilter(globals) {
	return globals.addDef(svgEl('filter', {
		x: '0%',
		y: '0%',
		width: '100%',
		height: '100%',
		'data-type': 'invert',
	}, [
		svgEl('feComponentTransfer', {}, [
			svgEl('feFuncR', { type: 'linear', slope: -1, intercept: 1 }),
			svgEl('feFuncG', { type: 'linear', slope: -1, intercept: 1 }),
			svgEl('feFuncB', { type: 'linear', slope: -1, intercept: 1 }),
		]),
	]), 'filter:invert');
}

registerEffect('{d2541291-70d6-11d1-8c8000a024cdc039}', {
	name: 'Invert',
	apply: (globals, contents) => {
		contents.setAttribute('filter', `url(#${encodeURIComponent(invertFilter(globals))})`);
		return contents;
	},
});
