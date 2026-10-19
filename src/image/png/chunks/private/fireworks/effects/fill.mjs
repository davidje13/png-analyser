import { rgba, svgEl } from '../../../../../../display/pretty.mjs';
import { col, str } from './readers.mjs';
import { registerEffect } from './registry.mjs';

/** @type {Map<string, { blend?: string, composite?: string, in?: string, in2?: string, k1?: number, k2?: number, k3?: number, k4?: number }>} */
const COLOR_FILL_BLEND = new Map([
	// TODO: match these against Fireworks' actual behaviour
	['0', {}],
	['2', { blend: 'color-burn' }],
	['3', { blend: 'luminosity' }],
	['4', { blend: 'hard-light' }],
	//['5', { blend: 'inverse color dodge' }],
	['8', { blend: 'lighten' }],
	['9', { blend: 'multiply' }],
	['10', { blend: 'color-dodge' }],
	//['12', { blend: 'reflect' }],
	//['13', { blend: 'glow' }],
	//['14', { blend: 'freeze' }],
	['18', { blend: 'soft-light' }],
	//['19', { blend: 'negation' }],
	['21', { blend: 'hue' }],
	['22', { blend: 'saturation' }],
	['30', { composite: 'arithmetic', k1: 0, k2: 0.5, k3: 0.5, k4: 0 }], // average
	//['31', { blend: 'green' }],
	//['32', { blend: 'red' }],
	['33', { blend: 'exclusion' }],
	['35', { blend: 'difference' }],
	//['36', { blend: 'soft dodge' }],
	//['37', { blend: 'inverse color burn' }],
	//['39', { blend: 'soft burn' }],
	['40', { blend: 'overlay' }],
	['42', { composite: 'arithmetic', k1: 0, k2: -1, k3: 1, k4: 0 }], // subtract
	//['43', { blend: 'interpolation' }],
	//['44', { blend: 'stamp' }],
	//['45', { blend: 'xor' }],
	['46', { composite: 'arithmetic', k1: 0, k2: -1, k3: 0, k4: 1 }], // invert
	//['47', { blend: 'tint' }],
	['48', { composite: 'out', in: 'SourceGraphic' }], // erase
	//['51', { blend: 'heat' }],
	['53', { composite: 'lighter' }],
]);

registerEffect('{dd54adc0-a279-11d3-b92a000502f3fdbe}', {
	name: 'Color Fill',
	apply: (globals, contents, data) => {
		const fillCol = col(data['Color'], data['Opacity'], 100) ?? 0;
		const blendMode = COLOR_FILL_BLEND.get(str(data['Blendmode']) ?? '0') ?? {};
		if (!fillCol) {
			return contents;
		}

		/** @type {SVGElement[]} */ const steps = [
			svgEl('feFlood', { 'flood-color': rgba(fillCol) }),
		];
		if (!blendMode.blend) {
			steps.push(svgEl('feComposite', {
				operator: blendMode.composite ?? 'atop',
				in2: 'SourceGraphic',
			}));
		} else {
			steps.push(
				svgEl('feBlend', { mode: blendMode.blend, in: 'SourceGraphic' }),
				svgEl('feComposite', {
					operator: blendMode.composite ?? 'in',
					in: blendMode.in,
					in2: blendMode.in2 ?? (blendMode.in ? undefined : 'SourceGraphic'),
					k1: blendMode.k1,
					k2: blendMode.k2,
					k3: blendMode.k3,
					k4: blendMode.k4,
				}),
			);
		}
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, steps));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
