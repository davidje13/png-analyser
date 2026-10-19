import { svgEl } from '../../../../../../display/pretty.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{d2541291-70d6-11d1-8c8000a024cdc039}', {
	name: 'Invert',
	apply: (globals, contents) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'linear', slope: -1, intercept: 1 }),
				svgEl('feFuncG', { type: 'linear', slope: -1, intercept: 1 }),
				svgEl('feFuncB', { type: 'linear', slope: -1, intercept: 1 }),
			]),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
