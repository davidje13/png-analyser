import { svgEl } from '../../../../../../display/pretty.mjs';
import { lcm } from '../math.mjs';
import { GPLv } from '../nodes/GPLv.mjs';
import { GPTv } from '../nodes/GPTv.mjs';
import { registerEffect } from './registry.mjs';

/** @param {ReadonlyArray<GPTv>} points */
function makeCurveMapping(points) {
	const N = points.length;
	if (N < 2) {
		return [0, 1];
	}
	if (N === 2 && points[0].x === 0 && points[1].x === 255) {
		return [points[0].y / 255, points[1].y / 255];
	}
	/** @type {number[]} */ const r = [];
	let k = 0;
	for (let i = 0; i < 256; ++i) {
		if (k < N && i > points[k].x) {
			++k;
		}
		if (!k) {
			r.push(points[0].y / 255);
		} else if (k >= N) {
			r.push(points[N - 1].y / 255);
		} else {
			// TODO: this does not quite match with Fireworks' interpolation
			// https://en.wikipedia.org/wiki/Cubic_Hermite_spline
			const pL2 = points[k - 2]; // may not exist
			const pL = points[k - 1];
			const pR = points[k];
			const pR2 = points[k + 1]; // may not exist
			const w = (pR.x - pL.x);
			const t = (i - pL.x) / w;
			const g0 = (pR.y - pL.y) / w;

			// finite difference
			let gL = pL2 ? 0.5 * (g0 + (pL.y - pL2.y) / (pL.x - pL2.x)) : g0;
			let gR = pR2 ? 0.5 * (g0 + (pR2.y - pR.y) / (pR2.x - pR.x)) : g0;
			// cardinal
			//const c = 0.5;
			//let gL = pL2 ? (1 - c) * (pR.y - pL2.y) / (pR.x - pL2.x) : g0;
			//let gR = pR2 ? (1 - c) * (pR2.y - pL.y) / (pR2.x - pL.x) : g0;

			if (!pL2) {
				const yHalf = Math.max(0, Math.min(255, pR.y - gR * w * 0.5));
				gL = 2 * (yHalf - pL.y) / w;
				//gL = (2 * pR.y - 2 * pL.y - gR * w) / w;
			} else if (!pR2) {
				const yHalf = Math.max(0, Math.min(255, pL.y + gL * w * 0.5));
				gR = 2 * (pR.y - yHalf) / w;
				//gR = (2 * pR.y - 2 * pL.y - gL * w) / w;
			}
			const tt = t * t;
			const ttt = tt * t;
			const v = (
				(2 * ttt - 3 * tt + 1) * pL.y +
				(ttt - 2 * tt + t) * w * gL +
				(-2 * ttt + 3 * tt) * pR.y +
				(ttt - tt) * w * gR
			);
			r.push(Math.max(0, Math.min(1, v / 255)));
		}
	}
	//const test = makeCanvas(256, 256);
	//document.body.append(test.canvas);
	//test.canvas.style.imageRendering = 'pixelated';
	//test.canvas.style.margin = '10px';
	//test.ctx.fillStyle = '#FFFFFF';
	//test.ctx.fillRect(0, 0, 256, 256);
	//test.ctx.fillStyle = '#000000';
	//for (let i = 0; i < 256; ++i) {
	//	test.ctx.fillRect(i, 255 - Math.round(r[i] * 255), 1, 1);
	//}
	//test.ctx.fillStyle = '#ff0000';
	//for (const pt of points) {
	//	test.ctx.fillRect(pt.x - 1, 255 - pt.y - 1, 3, 3);
	//}
	return r;
}

registerEffect('{3439b08e-1923-11d3-9bde00e02910d580}', {
	name: 'Curves',
	apply: (globals, contents, data) => {
		const rgb = data['rgb_points'];
		const r = data['red_points'];
		const g = data['green_points'];
		const b = data['blue_points'];
		if (!(rgb instanceof GPLv) || !(r instanceof GPLv) || !(g instanceof GPLv) || !(b instanceof GPLv)) {
			return contents;
		}
		const cRGB = makeCurveMapping(rgb);

		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
			'data-type': 'curves',
		}, [
			svgEl('feComponentTransfer', {}, [
				makeColourTable('feFuncR', combineMappings(makeCurveMapping(r), cRGB)),
				makeColourTable('feFuncG', combineMappings(makeCurveMapping(g), cRGB)),
				makeColourTable('feFuncB', combineMappings(makeCurveMapping(b), cRGB)),
			]),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

/**
 * @param {number[]} table
 * @param {number} t
 */
function readTable(table, t) {
	if (t <= 0) {
		return table[0];
	}
	const p = t * (table.length - 1);
	const i = p|0;
	if (i >= table.length - 1) {
		return table[table.length - 1];
	}
	const f = p - i;
	return table[i] * (1 - f) + table[i + 1] * f;
}

/**
 * @param {number[]} a
 * @param {number[]} b
 */
function combineMappings(a, b) {
	const steps = lcm(a.length, b.length);
	const m = 1 / (steps - 1);
	/** @type {number[]} */ const r = [];
	for (let i = 0; i < steps; ++i) {
		r.push(readTable(b, readTable(a, i * m)));
	}
	return r;
}

/**
 * @param {keyof SVGElementTagNameMap} type
 * @param {number[]} mapping
 */
function makeColourTable(type, mapping) {
	if (mapping.length === 2 && mapping[0] === 0 && mapping[1] === 1) {
		return svgEl(type, { type: 'identity' });
	}
	return svgEl(type, {
		type: 'table',
		tableValues: mapping.map((p) => p <= 0 ? '0' : p >= 1 ? '1' : p.toFixed(3)).join(' '),
	});
}
