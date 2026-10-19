import { svgEl } from '../../../../../../display/pretty.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{c20952b1-fc76-11d0-8be700a024cdc039}', {
	name: 'Sharpen',
	apply: (globals, contents) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: '-24 -24 -24 -24 447 -24 -24 -24 -24',
				divisor: 255,
				edgeMode: 'duplicate',
			}),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{1f2f2591-9db7-11d1-8cad00a024cdc039}', {
	name: 'Sharpen More',
	apply: (globals, contents) => {
		// actually the same as sharpen
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: '-24 -24 -24 -24 447 -24 -24 -24 -24',
				divisor: 255,
				edgeMode: 'duplicate',
			}),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{f1cfce44-718e-11d1-8c8200a024cdc039}', {
	name: 'Unsharp Mask',
	apply: (globals, contents, data) => {
		//"unsharp_mask_radius" = "4.0999999999999996"
		//"unsharp_mask_amount" = "50"
		//"unsharp_mask_threshold" = "0"

		return contents; // TODO
	},
});
