import { svgEl } from '../../../../../../display/pretty.mjs';
import { float } from './readers.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{3439b08d-1922-11d3-9bde00e02910d580}', {
	name: 'Hue/Saturation',
	apply: (globals, contents, data) => {
		const hue = float(data['hue_amount']) ?? 0;
		const saturation = (float(data['saturation_amount']) ?? 0) * 0.01;
		const lightness = (float(data['lightness_amount']) ?? 0) * 0.01;
		const colourise = data['hls_colorize'] === '1';

		/** @type {SVGElement[]} */ const steps = [];
		if (colourise) {
			let r = 0;
			let g = 0;
			let b = 0;
			const h = (((hue / 60) % 6) + 6) % 6;
			if (h < 1) {
				r = 1;
				g = h;
			} else if (h < 2) {
				r = 2 - h;
				g = 1;
			} else if (h < 3) {
				g = 1;
				b = h - 2;
			} else if (h < 4) {
				g = 4 - h;
				b = 1;
			} else if (h < 5) {
				b = 1;
				r = h - 4;
			} else {
				b = 6 - h;
				r = 1;
			}
			r = (r * 2 - 1) * saturation;
			g = (g * 2 - 1) * saturation;
			b = (b * 2 - 1) * saturation;
			steps.push(
				// fireworks uses (lightest + darkest) / 2 as the base luminosity for colourising
				svgEl('feColorMatrix', { type: 'matrix', values: [
					'1 0 0 0 0',
					'-1 0 0 0 1',
					'0 0 0 0 0',
					'0 0 0 1 0',
				].join(' '), result: 'r' }),
				svgEl('feColorMatrix', { type: 'matrix', in: 'SourceGraphic', values: [
					'0 1 0 0 0',
					'0 -1 0 0 1',
					'0 0 0 0 0',
					'0 0 0 1 0',
				].join(' ') }),
				svgEl('feBlend', { mode: 'lighten', in2: 'r', result: 'g' }),
				svgEl('feColorMatrix', { type: 'matrix', in: 'SourceGraphic', values: [
					'0 0 1 0 0',
					'0 0 -1 0 1',
					'0 0 0 0 0',
					'0 0 0 1 0',
				].join(' ') }),
				svgEl('feBlend', { mode: 'lighten', in2: 'g' }),
				svgEl('feColorMatrix', { type: 'matrix', values: [
					'.5 -.5 0 0 .5',
					'.5 -.5 0 0 .5',
					'.5 -.5 0 0 .5',
					'0 0 0 1 0',
				].join(' ') }),
				// apply colourise to grayscale
				svgEl('feComponentTransfer', {}, [
					svgEl('feFuncR', { type: 'linear', slope: Math.abs(r) + 1, intercept: Math.min(r, 0) }),
					svgEl('feFuncG', { type: 'linear', slope: Math.abs(g) + 1, intercept: Math.min(g, 0) }),
					svgEl('feFuncB', { type: 'linear', slope: Math.abs(b) + 1, intercept: Math.min(b, 0) }),
				]),
			);
		} else {
			if (hue) {
				// TODO: Fireworks' hue rotation is not a linear transform, so this is a poor approximation
				steps.push(svgEl('feColorMatrix', { type: 'hueRotate', values: hue }));
			}
			if (saturation) {
				steps.push(svgEl('feColorMatrix', { type: 'saturate', values: saturation + 1 }));
			}
		}
		if (lightness) {
			const slope = 1 - Math.abs(lightness);
			const intercept = Math.max(lightness, 0);
			steps.push(svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'linear', slope, intercept }),
				svgEl('feFuncG', { type: 'linear', slope, intercept }),
				svgEl('feFuncB', { type: 'linear', slope, intercept }),
			]));
		}

		if (!steps.length) {
			return contents;
		}

		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
			'data-type': 'hue-saturation',
		}, steps), `filter:huesat:${hue}:${saturation}:${lightness}:${colourise}`);
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
