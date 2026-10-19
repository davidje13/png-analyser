import { svgEl } from '../../../../../../display/pretty.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{fc7093f1-f95c-11d0-8be200a024cdc039}', {
	name: 'Find Edges',
	apply: (globals, contents) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 2,
				kernelUnitLength: 1,
				kernelMatrix: '0 2 2 -4',
				targetX: 0,
				targetY: 0,
				edgeMode: 'duplicate',
				preserveAlpha: 'true',
			}),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{d810e821-f86b-11d0-7371473173676544}', {
	name: 'Edges',
	apply: (globals, contents, data) => {
		return contents; // TODO
	},
});
