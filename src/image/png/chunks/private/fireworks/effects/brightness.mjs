import { svgEl } from '../../../../../../display/pretty.mjs';
import { float } from './readers.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{3439b08c-1921-11d3-9bde00e02910d580}', {
	name: 'Brightness/Contrast',
	apply: (globals, contents, data) => {
		const brightness = (float(data['brightness_amount']) ?? 0) / 255;
		const contrast = (float(data['contrast_amount']) ?? 0) * 0.01 + 1;
		const mid = 112 / 255;
		const e1 = Math.log(0.5) / Math.log(mid);
		const e2 = 1 / e1;

		// slope = Math.tan(contrast * Math.PI * 0.25) would be nicer, but does not match fireworks
		const slope = (
			contrast <= 1 ? contrast :
			contrast <= 1.85 ? 1 / (2 - contrast) :
			contrast < 2 ? (0.0982 - 0.15) / (1.99 - 1.85) * (contrast - 1.85) + 0.15 :
			512 // discontinuity matches fireworks' behaviour
		);
		const intercept = 0.5 - slope * 0.5;

		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'linear', intercept: brightness }),
				svgEl('feFuncG', { type: 'linear', intercept: brightness }),
				svgEl('feFuncB', { type: 'linear', intercept: brightness }),
			]),
			svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'gamma', exponent: e1 }),
				svgEl('feFuncG', { type: 'gamma', exponent: e1 }),
				svgEl('feFuncB', { type: 'gamma', exponent: e1 }),
			]),
			svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'linear', slope, intercept }),
				svgEl('feFuncG', { type: 'linear', slope, intercept }),
				svgEl('feFuncB', { type: 'linear', slope, intercept }),
			]),
			svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'gamma', exponent: e2 }),
				svgEl('feFuncG', { type: 'gamma', exponent: e2 }),
				svgEl('feFuncB', { type: 'gamma', exponent: e2 }),
			]),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
