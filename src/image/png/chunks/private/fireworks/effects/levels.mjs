import { svgEl } from '../../../../../../display/pretty.mjs';
import { float } from './readers.mjs';
import { registerEffect } from './registry.mjs';

/**
 * @param {keyof SVGElementTagNameMap} type
 * @param {{ s0: number, s1: number, d0: number, d1: number, g: number }} config
 */
function makeGammaCurve(type, { s0, s1, d0, d1, g }) {
	// curve = amplitude * pow(input, exponent) + offset
	const p1 = Math.pow(s1 / 255, g);
	const amplitude = (d1 - d0) / (255 * (p1 - Math.pow(s0 / 255, g)));
	const offset = d1 / 255 - amplitude * p1;
	if (g === 1 && amplitude === 1 && offset === 0) {
		return svgEl(type, { type: 'identity' });
	}
	return svgEl(type, {
		type: 'gamma',
		exponent: g,
		amplitude,
		offset,
	});
}

/**
 * @param {keyof SVGElementTagNameMap} type
 * @param {{ d0: number, d1: number }} config
 */
function makeClamp(type, { d0, d1 }) {
	if (d0 <= 0 && d1 >= 255) {
		return svgEl(type, { type: 'identity' });
	}
	/** @type {string[]} */ const pts = [];
	for (let i = 0; i < 256; ++i) {
		pts.push((Math.max(d0, Math.min(d1, i)) / 255).toFixed(3));
	}
	return svgEl(type, {
		type: 'table',
		tableValues: pts.join(' '),
	});
}

/** @param {import('./registry.mjs').Data} data */
function gammaLevsls(data) {
	const rgb = {
		s0: float(data['source_low_rgb']) ?? 0,
		s1: float(data['source_high_rgb']) ?? 255,
		d0: float(data['dest_low_rgb']) ?? 0,
		d1: float(data['dest_high_rgb']) ?? 255,
		g: float(data['gamma_rgb']) ?? 1,
	};
	const r = {
		s0: float(data['source_low_r']) ?? 0,
		s1: float(data['source_high_r']) ?? 255,
		d0: float(data['dest_low_r']) ?? 0,
		d1: float(data['dest_high_r']) ?? 255,
		g: float(data['gamma_r']) ?? 1,
	};
	const g = {
		s0: float(data['source_low_g']) ?? 0,
		s1: float(data['source_high_g']) ?? 255,
		d0: float(data['dest_low_g']) ?? 0,
		d1: float(data['dest_high_g']) ?? 255,
		g: float(data['gamma_g']) ?? 1,
	};
	const b = {
		s0: float(data['source_low_b']) ?? 0,
		s1: float(data['source_high_b']) ?? 255,
		d0: float(data['dest_low_b']) ?? 0,
		d1: float(data['dest_high_b']) ?? 255,
		g: float(data['gamma_b']) ?? 1,
	};
	return [
		// TODO: maybe replace all these with a single operation using a table lookup (to perform both gammas and both clamps simultaneously)
		svgEl('feComponentTransfer', {}, [
			makeGammaCurve('feFuncR', r),
			makeGammaCurve('feFuncG', g),
			makeGammaCurve('feFuncB', b),
		]),
		svgEl('feComponentTransfer', {}, [
			makeClamp('feFuncR', r),
			makeClamp('feFuncG', g),
			makeClamp('feFuncB', b),
		]),
		svgEl('feComponentTransfer', {}, [
			makeGammaCurve('feFuncR', rgb),
			makeGammaCurve('feFuncG', rgb),
			makeGammaCurve('feFuncB', rgb),
		]),
		svgEl('feComponentTransfer', {}, [
			makeClamp('feFuncR', rgb),
			makeClamp('feFuncG', rgb),
			makeClamp('feFuncB', rgb),
		]),
	];
}

registerEffect('{d04ef8c1-71b4-11d1-8c8200a024cdc039}', {
	name: 'Auto Levels',
	apply: (globals, contents, data) => {
		// TODO: seems auto levels just stores identity values rather than the computed levelling
		// - need to analyse the image to find the levels to apply
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, gammaLevsls(data)));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{d04ef8c2-71b5-11d1-8c8200a024cdc039}', {
	name: 'Levels',
	apply: (globals, contents, data) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, gammaLevsls(data)));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
