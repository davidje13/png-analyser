import { makeCanvas, rgba, svgEl } from '../../../../../display/pretty.mjs';
import { EPSv } from './nodes/EPSv.mjs';
import { GPLv } from './nodes/GPLv.mjs';
import { GPTv } from './nodes/GPTv.mjs';

/**
 * @param {SVGElement} container
 * @param {SVGElement} target
 * @param {EPSv} epsv
 * @return {SVGElement}
 */
export function applyEffect(container, target, epsv) {
	const effect = KNOWN_EFFECTS.get(str(epsv.data['EffectMoaID']) ?? '')
	if (effect) {
		return effect.apply(container, target, epsv.data);
	}
	return target;
}

/**
 * @typedef {import('./nodes/DCEv.mjs').CustomData} CustomData
 * @typedef {{ readonly [k: string]: CustomData }} Data
 *
 * @typedef {{
 *   name: string,
 *   apply: (container: SVGElement, element: SVGElement, data: Data) => SVGElement,
 * }} EffectMeta
 */

/** @type {Map<string, EffectMeta>} */ const KNOWN_EFFECTS = new Map();

const BEVEL_TYPES = new Map([
	['0', { name: 'Inner Bevel' }],
	['1', { name: 'Outer Bevel' }],
	['2', { name: 'Raise Emboss' }],
	['3', { name: 'Inset Emboss' }],
	['4', { name: 'Glow Effect' }],
]);
const BEVEL_SLOPE_TYPES = new Map([
	['0', { name: 'flat', fn: (/** @type {number} */ v) => v }],
	['1', { name: 'smooth', fn: (/** @type {number} */ v) => v }], // TODO: equation
	['2', { name: 'smooth inverted', fn: (/** @type {number} */ v) => v }], // TODO: equation
	['3', { name: 'zigzag', fn: (/** @type {number} */ v) => v }], // TODO: equation
	['4', { name: 'zigzag 2', fn: (/** @type {number} */ v) => v }], // TODO: equation
	['5', { name: 'ring', fn: (/** @type {number} */ v) => Math.sin(v * Math.PI) }], // TODO: check eq
	['6', { name: 'ruffle', fn: (/** @type {number} */ v) => v }], // TODO: equation
]);
const BUTTON_STATES = new Map([
	['0', 'Up'],
	['1', 'Over'],
	['2', 'Down'],
	['3', 'Hit'],
]);

KNOWN_EFFECTS.set('{7fe61102-6ce2-11d1-8c76000502701850}', {
	name: 'Bevel',
	apply: (container, target, data) => {
		//const typeId = str(data['BevelType']) ?? '';
		//const type = BEVEL_TYPES.get(typeId);
		//if (!type) {
		//	console.warn(`Unknown bevel type: ${typeId}`);
		//}
		//const width = float(data['BevelWidth']) ?? 0;
		//const contrast = float(data['BevelContrast']) ?? 0;
		//const threshold = float(data['EdgeThreshold']) ?? 0;
		//const angleSoftness = float(data['AngleSoftness']) ?? 0;
		//const maskSoftness = float(data['MaskSoftness']) ?? 0;
		//const lightDistance = float(data['LightDistance']) ?? 0;
		//const lightAngle = float(data['LightAngle']) ?? 0;
		//const slopeTypeId = str(data['SlopeType']) ?? '';
		//const slope = BEVEL_SLOPE_TYPES.get(slopeTypeId);
		//if (!slope) {
		//	console.warn(`Unknown bevel slope type: ${slopeTypeId}`);
		//}
		//const slopeMultiplier = float(data['SlopeMultiplier']) ?? 0;
		//const outerBevelCol = col(data['OuterBevelColor']);
		//const downBlendCol = col(data['DownBlendColor']);
		//const hitBlendCol = col(data['HitBlendColor']);
		//const highlightCol = col(data['HiliteColor']);
		//const shadowCol = col(data['ShadowColor']);
		//const embossFaceCol = col(data['EmbossFaceColor']);
		//const showObject = data['ShowObject'] === 'true';
		//const buttonStateId = str(data['ButtonState']);
		//const buttonState = BUTTON_STATES.get(buttonStateId ?? '');
		//const glowStartDist = float(data['GlowStartDistance']) ?? 0;
		//const glowWidth = float(data['GlowWidth']) ?? 0;

		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{a7944db8-6ce2-11d1-8c76000502701850}', {
	name: 'Drop Shadow',
	apply: (container, target, data) => {
		const knockout = data['ShadowType'] === '1';
		const blur = float(data['ShadowBlur']) ?? 0;
		const dist = float(data['ShadowDistance']) ?? 0;
		const angle = -(float(data['ShadowAngle']) ?? 0) * Math.PI / 180;
		const shadowCol = col(data['ShadowColor']);
		if (!shadowCol) {
			if (knockout) {
				target.setAttribute('hidden', 'hidden');
			}
			return target;
		}

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);
		const stdDeviation = blur * 0.5;

		const filterID = crypto.randomUUID();
		if (knockout) {
			container.append(svgEl('filter', {
				id: filterID,
				// TODO: extend bounds based on blur amount (need to know what size the target is)
				x: '-30%',
				y: '-30%',
				width: '160%',
				height: '160%',
			}, [
				svgEl('feOffset', { dx: x, dy: y, in: 'SourceAlpha' }),
				svgEl('feGaussianBlur', { stdDeviation }),
				svgEl('feComposite', { operator: 'out', in2: 'SourceAlpha', result: 'b' }),
				svgEl('feFlood', { 'flood-color': rgba(shadowCol) }),
				svgEl('feComposite', { operator: 'in', in2: 'b' }),
			]));
		} else {
			container.append(svgEl('filter', {
				id: filterID,
				// TODO: extend bounds based on blur amount (need to know what size the target is)
				x: '-30%',
				y: '-30%',
				width: '160%',
				height: '160%',
			}, [
				svgEl('feDropShadow', {
					dx: x,
					dy: y,
					stdDeviation,
					'flood-color': rgba(shadowCol),
				}),
			]));
		}
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{5600f702-774c-11d3-baad0000861f4d01}', {
	name: 'Inner Shadow',
	apply: (container, target, data) => {
		const knockout = data['ShadowType'] === '1';
		const blur = float(data['ShadowBlur']) ?? 0;
		const dist = float(data['ShadowDistance']) ?? 0;
		const angle = -(float(data['ShadowAngle']) ?? 0) * Math.PI / 180;
		const shadowCol = col(data['ShadowColor']);
		if (!shadowCol) {
			return target;
		}

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);
		const stdDeviation = blur * 0.5;

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			// TODO: extend bounds based on translation distance (need to know what size the target is)
			x: x >= 0 ? '0%' : '-50%',
			y: y >= 0 ? '0%' : '-50%',
			width: '150%',
			height: '150%',
		}, [
			svgEl('feOffset', { dx: x, dy: y, in: 'SourceAlpha' }),
			svgEl('feGaussianBlur', { stdDeviation, result: 'b' }),
			svgEl('feFlood', { 'flood-color': rgba(shadowCol) }),
			svgEl('feComposite', { operator: 'out', in2: 'b' }),
			knockout
				? svgEl('feComposite', { operator: 'in', in: 'SourceAlpha' })
				: svgEl('feComposite', { operator: 'atop', in2: 'SourceGraphic' }),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{b90c950e-64df-11d8-aaf2000a9582f7d4}', {
	name: 'Solid Shadow',
	apply: (container, target, data) => {
		const dist = float(data['distance']) ?? 0;
		const angle = -(float(data['angle']) ?? 0) * Math.PI / 180;
		const shadowCol = col(data['color']) ?? 0;
		const useCol = data['usecolor'] !== 'false';

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);

		/** @type {SVGElement[]} */ const steps = [];
		// TODO: could make the blur higher quality using an initial or final feConvolveMatrix for sub-pixel blending
		let prev = 'SourceGraphic';
		if (useCol) {
			steps.push(
				svgEl('feFlood', { 'flood-color': rgba(shadowCol) }),
				svgEl('feComposite', { operator: 'in', in2: 'SourceAlpha', result: 'l0' }),
			);
			prev = 'l0';
		}
		const first = prev;
		let d = 0.5;
		let i = 0;
		const lim = Math.max(Math.abs(x), Math.abs(y));
		for (; d * 2 <= lim; d *= 2) {
			const next = `l${++i}`;
			steps.push(
				svgEl('feOffset', { dx: x * d / lim, dy: y * d / lim }),
				svgEl('feComposite', { operator: 'over', in: prev, result: next }),
			);
			prev = next
		}
		let j = 0;
		for (let dd = d; i && dd < lim; dd += d) {
			while (i && dd + d > lim) {
				d /= 2;
				--i;
			}
			const next = `b${++j}`;
			steps.push(
				svgEl('feOffset', { dx: x * dd / lim, dy: y * dd / lim, in: i ? `l${i}` : first }),
				svgEl('feComposite', { operator: 'over', in: prev, result: next }),
			);
			prev = next;
		}

		steps.push(
			svgEl('feOffset', { dx: x * 0.5 / lim, dy: y * 0.5 / lim }),
			svgEl('feComposite', { operator: 'over', in: 'SourceGraphic' }),
		);

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			// TODO: extend bounds based on translation distance (need to know what size the target is)
			x: x >= 0 ? '0%' : '-50%',
			y: y >= 0 ? '0%' : '-50%',
			width: '150%',
			height: '150%',
		}, steps));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{2ba87123-8220-11d3-baad0000861f4d01}', {
	name: 'Inner Glow',
	apply: (container, target, data) => {
		const maskSoftness = float(data['MaskSoftness']) ?? 0;
		const glowCol = col(data['OuterBevelColor'], data['BevelContrast'], 100);
		const glowStartDist = float(data['GlowStartDistance']) ?? 0;
		const glowWidth = float(data['GlowWidth']) ?? 0;
		if (!glowCol) {
			return target;
		}

		if (glowStartDist === 0) {
			const filterID = crypto.randomUUID();
			container.append(svgEl('filter', {
				id: filterID,
				x: '0%',
				y: '0%',
				width: '100%',
				height: '100%',
			}, [
				svgEl('feGaussianBlur', { stdDeviation: glowWidth }),
				svgEl('feComponentTransfer', { result: 'b' }, [
					svgEl('feFuncA', { type: 'linear', slope: 2, intercept: -1 }),
				]),
				svgEl('feFlood', { 'flood-color': rgba(glowCol) }),
				svgEl('feComposite', { operator: 'out', in2: 'b' }),
				svgEl('feComposite', { operator: 'atop', in2: 'SourceGraphic' }),
			]));
			target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
			return target;
		} else {
			return target; // TODO
		}
	},
});

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

KNOWN_EFFECTS.set('{dd54adc0-a279-11d3-b92a000502f3fdbe}', {
	name: 'Color Fill',
	apply: (container, target, data) => {
		const fillCol = col(data['Color'], data['Opacity'], 100) ?? 0;
		const blendMode = COLOR_FILL_BLEND.get(str(data['Blendmode']) ?? '0') ?? {};
		if (!fillCol) {
			return target;
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
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, steps));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

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

/** @param {Data} data */
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

KNOWN_EFFECTS.set('{d04ef8c1-71b4-11d1-8c8200a024cdc039}', {
	name: 'Auto Levels',
	apply: (container, target, data) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, gammaLevsls(data)));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{d04ef8c2-71b5-11d1-8c8200a024cdc039}', {
	name: 'Levels',
	apply: (container, target, data) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, gammaLevsls(data)));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

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

KNOWN_EFFECTS.set('{3439b08e-1923-11d3-9bde00e02910d580}', {
	name: 'Curves',
	apply: (container, target, data) => {
		const rgb = data['rgb_points'];
		const r = data['red_points'];
		const g = data['green_points'];
		const b = data['blue_points'];
		if (!(rgb instanceof GPLv) || !(r instanceof GPLv) || !(g instanceof GPLv) || !(b instanceof GPLv)) {
			return target;
		}
		const cRGB = makeCurveMapping(rgb);

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feComponentTransfer', {}, [
				makeColourTable('feFuncR', combineMappings(makeCurveMapping(r), cRGB)),
				makeColourTable('feFuncG', combineMappings(makeCurveMapping(g), cRGB)),
				makeColourTable('feFuncB', combineMappings(makeCurveMapping(b), cRGB)),
			]),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{3439b08d-1922-11d3-9bde00e02910d580}', {
	name: 'Hue/Saturation',
	apply: (container, target, data) => {
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
			return target;
		}

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, steps));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{3439b08c-1921-11d3-9bde00e02910d580}', {
	name: 'Brightness/Contrast',
	apply: (container, target, data) => {
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

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
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
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{d2541291-70d6-11d1-8c8000a024cdc039}', {
	name: 'Invert',
	apply: (container, target) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
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
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{2932d5a2-ca48-11d1-8561000502701850}', {
	name: 'Convert to Alpha',
	apply: (container, target) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feColorMatrix', {
				type: 'matrix',
				values: [
					'0 0 0 0 0',
					'0 0 0 0 0',
					'0 0 0 0 0',
					'-0.2126 -0.7152 -0.0722 1 0',
				].join(' '),
			}),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{fc7093f1-f95c-11d0-8be200a024cdc039}', {
	name: 'Find Edges',
	apply: (container, target) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
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
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{f1cfce41-718e-11d1-8c8200a024cdc039}', {
	name: 'Blur',
	apply: (container, target) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: '16 16 16 16 127 16 16 16 16',
				divisor: 255,
				edgeMode: 'duplicate',
			}),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{538016b6-ffd6-418f-a10c590e6ee841ae}', {
	name: 'Motion Blur',
	apply: (container, target, data) => {
		const dist = float(data['motion_blur_distance']) ?? 0;
		const angle = -(float(data['motion_blur_angle']) ?? 0) * Math.PI / 180;

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);

		/** @type {SVGElement[]} */ const steps = [];
		// TODO: could make the blur higher quality using an initial or final feConvolveMatrix for sub-pixel blending
		let prev = 'SourceGraphic';
		let d = 0.5;
		let i = 0;
		const lim = Math.max(Math.abs(x), Math.abs(y));
		for (; d * 2 <= lim + 1; d *= 2) {
			const next = `l${++i}`;
			steps.push(
				svgEl('feOffset', { dx: x * d / lim, dy: y * d / lim }),
				svgEl('feComposite', { operator: 'arithmetic', k2: 0.5, k3: 0.5, in: prev, result: next }),
			);
			prev = next
		}
		let j = 0;
		for (let dd = d; i && dd < lim + 1; dd += d) {
			while (i && dd + d > lim + 1) {
				d /= 2;
				--i;
			}
			const next = `b${++j}`;
			steps.push(
				svgEl('feOffset', { dx: x * dd / lim, dy: y * dd / lim, in: i ? `l${i}` : 'SourceGraphic' }),
				svgEl('feComposite', { operator: 'arithmetic', k2: dd / (dd + d), k3: d / (dd + d), in: prev, result: next }),
			);
			prev = next;
		}

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			// TODO: extend bounds based on translation distance (need to know what size the target is)
			x: x >= 0 ? '0%' : '-50%',
			y: y >= 0 ? '0%' : '-50%',
			width: '150%',
			height: '150%',
		}, steps));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{d1c33142-2ad8-4215-a39fc5d934c8fc0c}', {
	name: 'Radial Blur',
	apply: (container, target, data) => {
		const angle = (float(data['radial_blur_amount']) ?? 0) * 0.5;
		const n = Math.max(1, Math.min(180, Math.ceil((float(data['radial_blur_quality']) ?? 0) / 2)));

		const sourceID = crypto.randomUUID();
		const source = svgEl('g', { id: sourceID, opacity: 1 / (n * 2 + 1) });
		source.style.mixBlendMode = 'plus-lighter';
		target.style.isolation = 'isolate';
		target.append(source);
		for (let i = -n; i <= n; ++i) {
			if (i) {
				const sample = svgEl('use', { href: `#${encodeURIComponent(sourceID)}`, transform: `rotate(${angle * i / n})`, 'transform-origin': 'center' });
				sample.style.transformBox = 'fill-box'; // TODO: may be better to specify an explicit transform origin, but that requires knowing the object's bounds
				sample.style.mixBlendMode = 'plus-lighter';
				target.append(sample);
			}
		}
		return source;
	},
});

KNOWN_EFFECTS.set('{94dbd663-9b2e-44bf-8064ab6efdd2d327}', {
	name: 'Zoom Blur',
	apply: (container, target, data) => {
		const zoom = (float(data['zoom_blur_amount']) ?? 0) * 0.005;
		const n = Math.max(1, Math.min(100, Math.ceil((float(data['zoom_blur_quality']) ?? 0) / 2)));

		const sourceID = crypto.randomUUID();
		const source = svgEl('g', { id: sourceID, opacity: 1 / (n * 2 + 1) });
		source.style.mixBlendMode = 'plus-lighter';
		target.style.isolation = 'isolate';
		target.append(source);
		for (let i = -n; i <= n; ++i) {
			if (i) {
				const sample = svgEl('use', { href: `#${encodeURIComponent(sourceID)}`, transform: `scale(${(1 + zoom * i / n)})`, 'transform-origin': 'center' });
				sample.style.transformBox = 'fill-box'; // TODO: may be better to specify an explicit transform origin, but that requires knowing the object's bounds
				sample.style.mixBlendMode = 'plus-lighter';
				target.append(sample);
			}
		}
		return source;
	},
});

KNOWN_EFFECTS.set('{d04ef8c0-71b3-11d1-8c8200a024cdc039}', {
	name: 'Gaussian Blur',
	apply: (container, target, data) => {
		const blur = float(data['gaussian_blur_radius']) ?? 0;

		// match fireworks behaviour
		const stdDeviation = blur * 1.05;

		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			// TODO: extend bounds based on blur amount (need to know what size the target is)
			x: '-30%',
			y: '-30%',
			width: '160%',
			height: '160%',
		}, [
			svgEl('feGaussianBlur', { stdDeviation }),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{f1cfce42-718e-11d1-8c8200a024cdc039}', {
	name: 'Blur More',
	apply: (container, target, data) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: '21 21 21 21 87 21 21 21 21',
				divisor: 255,
				edgeMode: 'duplicate',
			}),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{f1cfce44-718e-11d1-8c8200a024cdc039}', {
	name: 'Unsharp Mask',
	apply: (container, target, data) => {
		//"unsharp_mask_radius" = "4.0999999999999996"
		//"unsharp_mask_amount" = "50"
		//"unsharp_mask_threshold" = "0"

		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{c20952b1-fc76-11d0-8be700a024cdc039}', {
	name: 'Sharpen',
	apply: (container, target) => {
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
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
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{1f2f2591-9db7-11d1-8cad00a024cdc039}', {
	name: 'Sharpen More',
	apply: (container, target) => {
		// actually the same as sharpen
		const filterID = crypto.randomUUID();
		container.append(svgEl('filter', {
			id: filterID,
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
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return target;
	},
});

KNOWN_EFFECTS.set('{e4c0f4bc-c0a3-4cb3-b3513822027e4d9f}', {
	name: 'Add Noise',
	apply: (container, target, data) => {
		//"add_noise_amount" = "50"
		//"add_noise_use_color" = "false"

		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{ff84d00c-4494-11d8-a072000a9582f7d4}', {
	name: 'Clouds',
	apply: (container, target, data) => {
		//"cloud_color" = "#999933"
		//"sky_color" = "#99ff99"

		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{d2e7769c-6349-11d8-b0e9000a9595f34e}', {
	name: 'Difference Clouds',
	apply: (container, target, data) => {
		//"cloud_color" = "#999933"
		//"sky_color" = "#99ff99"

		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-6563413465646d41}', {
	name: 'Marble',
	apply: (container, target, data) => {
		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-656341346564694e}', {
	name: 'Bevel Boss',
	apply: (container, target, data) => {
		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-6563413465646d54}', {
	name: 'Motion Trail',
	apply: (container, target, data) => {
		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-7371473173676544}', {
	name: 'Edges',
	apply: (container, target, data) => {
		return target; // TODO
	},
});

KNOWN_EFFECTS.set('{8eeadf50-9efe-11da-a7460800200c9a66}', {
	name: 'Photoshop Live Effects Special Fill',
	apply: (container, target, data) => {
		return target; // TODO
	},
});

/** @param {CustomData | undefined} v */
const str = (v) => typeof v === 'string' ? v : undefined;

/** @param {CustomData | undefined} v */
const float = (v) => typeof v === 'string' ? Number.parseFloat(v) : undefined;

/**
 * @param {CustomData | undefined} c
 * @param {CustomData | undefined=} alpha
 * @param {number=} alphaRange
 * @return {number | undefined}
 */
function col(c, alpha, alphaRange = 255) {
	if (!c || typeof c !== 'string') {
		return undefined;
	}
	if (c[0] === '#') {
		if (c.length === 7) {
			const a = float(alpha);
			let r = 0xFF000000;
			if (a !== undefined) {
				r = (Math.max(0, Math.min(255, Math.round((a / alphaRange) * 255))) << 24) >>> 0;
			}
			return (r | Number.parseInt(c.substring(1), 16)) >>> 0;
		}
		if (c.length === 9) {
			return (
				(Number.parseInt(c.substring(7), 16) << 24) |
				Number.parseInt(c.substring(1, 7), 16)
			) >>> 0;
		}
	}
	return undefined;
}

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

/**
 * @param {number} a
 * @param {number} b
 */
function lcm(a, b) {
	return a * (b / gcd(a, b));
}

/**
 * @param {number} a
 * @param {number} b
 */
function gcd(a, b) {
	while (b) {
		[a, b] = [b, a % b];
	}
	return a;
}
