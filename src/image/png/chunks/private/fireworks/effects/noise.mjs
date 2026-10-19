import { svgEl } from '../../../../../../display/pretty.mjs';
import { float } from './readers.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{e4c0f4bc-c0a3-4cb3-b3513822027e4d9f}', {
	name: 'Add Noise',
	apply: (globals, contents, data) => {
		const amount = (float(data['add_noise_amount']) ?? 0) * 0.02;
		const colour = data['add_noise_use_color'] === 'true';

		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feComponentTransfer', { result: 'r' }, [ // unpremultiply alpha
				svgEl('feFuncA', { type: 'linear', slope: 0, intercept: 1 }),
			]),
			svgEl('feTurbulence', {
				numOctaves: 1,
				baseFrequency: 0.75,
				seed: 0,
				type: 'fractalNoise',
			}),
			colour
				? svgEl('feComponentTransfer', {}, [svgEl('feFuncA', { type: 'linear', slope: 0, intercept: 1 })])
				: svgEl('feColorMatrix', { type: 'matrix', values: [
					'1 0 0 0 0',
					'1 0 0 0 0',
					'1 0 0 0 0',
					'0 0 0 0 1',
				].join(' ') }),
			svgEl('feComposite', {
				operator: 'arithmetic',
				in2: 'r',
				k2: amount * 2,
				k3: 1,
				k4: -amount,
			}),
			svgEl('feComposite', { operator: 'in', in2: 'SourceAlpha' }), // re-multiply alpha
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{ff84d00c-4494-11d8-a072000a9582f7d4}', {
	name: 'Clouds',
	apply: (globals, contents, data) => {
		//"cloud_color" = "#999933"
		//"sky_color" = "#99ff99"

		return contents; // TODO
	},
});

registerEffect('{d2e7769c-6349-11d8-b0e9000a9595f34e}', {
	name: 'Difference Clouds',
	apply: (globals, contents, data) => {
		//"cloud_color" = "#999933"
		//"sky_color" = "#99ff99"

		return contents; // TODO
	},
});

registerEffect('{d810e821-f86b-11d0-6563413465646d41}', {
	name: 'Marble',
	apply: (globals, contents, data) => {
		return contents; // TODO
	},
});
