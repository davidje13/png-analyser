import { svgEl } from '../../../../../../display/pretty.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{2932d5a2-ca48-11d1-8561000502701850}', {
	name: 'Convert to Alpha',
	apply: (globals, contents) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feColorMatrix', { type: 'matrix', values: [
				'0 0 0 0 0',
				'0 0 0 0 0',
				'0 0 0 0 0',
				'-0.2125 -0.7154 -0.0721 1 0',
			].join(' ') }),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
