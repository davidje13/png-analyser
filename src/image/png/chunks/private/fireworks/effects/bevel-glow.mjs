import { rgba, svgEl } from '../../../../../../display/pretty.mjs';
import { ierf } from '../math.mjs';
import { col, float, str } from './readers.mjs';
import { registerEffect } from './registry.mjs';

/**
 * @param {(x: number) => number} fn
 * @param {number} g0
 * @param {number} g1
 * @param {number} samples
 */
function makeTransfer(fn, g0, g1, samples) {
	const v0 = fn(0);
	/** @type {number[]} */ const rIn = [];
	for (let i = samples; i >= 0; --i) {
		rIn.push(Math.max(0, Math.min(1, (v0 - i * g0 / samples) * 0.5 + 0.5)));
	}
	for (let i = 1; i <= samples; ++i) {
		rIn.push(fn(i / samples) * 0.5 + 0.5);
	}
	const v1 = fn(1);
	/** @type {number[]} */ const rOut = [];
	for (let i = 0; i < samples; ++i) {
		rOut.push(fn(i / samples) * 0.5);
	}
	for (let i = 0; i <= samples; ++i) {
		rOut.push(Math.max(0, Math.min(1, (v1 + i * g1 / samples) * 0.5)));
	}
	return {
		transferInner: rIn.map((v) => v.toFixed(3)).join(' '),
		transferOuter: rOut.map((v) => v.toFixed(3)).join(' '),
		mult: 1 / Math.max(Math.abs(g0), Math.abs(g1)),
	};
}

/**
 * @param {number[]} values
 */
function makeTransferSegs(values) {
	const samples = values.length - 1;
	const v0 = values[0];
	const g0 = (values[1] - v0) * samples;
	/** @type {number[]} */ const rIn = [];
	for (let i = samples; i >= 0; --i) {
		rIn.push(Math.max(0, Math.min(1, (v0 - i * g0 / samples) * 0.5 + 0.5)));
	}
	for (let i = 1; i <= samples; ++i) {
		rIn.push(values[i] * 0.5 + 0.5);
	}
	const v1 = values[samples];
	const g1 = (v1 - values[samples - 1]) * samples;
	/** @type {number[]} */ const rOut = [];
	for (let i = 0; i < samples; ++i) {
		rOut.push(values[i] * 0.5);
	}
	for (let i = 0; i <= samples; ++i) {
		rOut.push(Math.max(0, Math.min(1, (v1 + i * g1 / samples) * 0.5)));
	}
	return {
		transferInner: rIn.map((v) => v.toFixed(3)).join(' '),
		transferOuter: rOut.map((v) => v.toFixed(3)).join(' '),
		mult: 1 / Math.max(Math.abs(g0), Math.abs(g1)),
	};
}

const GAUSSIAN_TO_LINEAR_SCALE = 2;
const GAUSSIAN_TO_LINEAR = (() => {
	const N = 20;
	/** @param {number} x */
	const fn = (x) => 0.5 - Math.SQRT2 * 0.25 * ierf(1 - 2 * x);
	/** @type {number[]} */ const r = [];
	r.push(fn(0.5 / N) * 2 - fn(1 / N));
	for (let i = 1; i <= N - 1; ++i) {
		r.push(fn(i / N));
	}
	r.push(fn((N - 0.5) / N) * 2 - fn((N - 1) / N));
	return r.map((v) => v.toFixed(3)).join(' ');
})();

const LINEAR = { mult: 1, transferInner: '0 1', transferOuter: '0 1' };
const BEVEL_SLOPE_TYPES = new Map([
	['0', LINEAR],
	['1', makeTransfer((x) => x * (2 - x), 2, 0, 9)],
	['2', makeTransfer((x) => x * x, 0, 2, 9)],
	['3', makeTransferSegs([0, 0.5, 1, 0.5])],
	['4', makeTransferSegs([0, 0.25, 0.5, 0.75, 1, 1, 1, 1, 0.75, 0.5, 0.25])],
	['5', makeTransfer((x) => Math.sin(x * Math.PI), Math.PI, -Math.PI, 4 * 2 + 1)],
	['6', makeTransfer((x) => Math.abs(Math.sin(x * Math.PI * 3)), Math.PI * 3, -Math.PI * 3, 3 * 6 + 1)],
]);

/** @param {number} angle */
function makeEdgeKernel(angle) {
	const lx = Math.cos(angle);
	const ly = Math.sin(angle);
	const kernel = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
	];
	/**
	 * @param {number} a
	 * @param {number} b
	 * @param {number} c
	 * @param {number} v
	 * @param {number} m
	 */
	const interp = (a, b, c, v, m) => {
		kernel[a] = Math.max(0, -v);
		kernel[b] = m - Math.abs(v);
		kernel[c] = Math.max(0, v);
		kernel[4] = -m;
	};
	if (Math.abs(lx) > Math.abs(ly)) {
		if (lx > 0) {
			interp(2, 5, 8, ly, lx);
		} else {
			interp(6, 3, 0, ly, -lx);
		}
	} else {
		if (ly > 0) {
			interp(8, 7, 6, lx, ly);
		} else {
			interp(0, 1, 2, lx, -ly);
		}
	}
	return kernel;
}

/** @param {import('./registry.mjs').Data} data */
function innerBevel(data) {
	const width = float(data['BevelWidth']) ?? 0;
	const contrast = (float(data['BevelContrast']) ?? 100) * 0.01;
	const threshold = float(data['EdgeThreshold']) ?? 0;
	const azimuth = -(float(data['LightAngle']) ?? 0) * Math.PI / 180;
	const slope = BEVEL_SLOPE_TYPES.get(str(data['SlopeType']) ?? '') ?? LINEAR;
	const slopeMultiplier = float(data['SlopeMultiplier']) ?? 1;
	const buttonState = str(data['ButtonState']) ?? '0';
	const maskSoftness = float(data['MaskSoftness']) ?? 0;
	//const angleSoftness = float(data['AngleSoftness']) ?? 0;
	//const lightDistance = float(data['LightDistance']) ?? 0;
	//const highlightCol = col(data['HiliteColor']); // always #ffffff ?
	//const shadowCol = col(data['ShadowColor']); // always #000000 ?

	const kernel1 = makeEdgeKernel(azimuth);
	const kernel2 = makeEdgeKernel(azimuth + Math.PI * 0.5);
	let scale = width * slopeMultiplier * contrast * slope.mult * 0.4; // TODO: 0.4 is tuned by eye; what is the actual scale?
	const lightAngleAdjust = -0.1;
	const darkStrength = 1;
	const lightStrength = 1.25;
	const smoothing = maskSoftness * 0.25 + 0.5;

	let blend = 0;
	switch (buttonState) {
		case '0': // up
			break;
		case '1': // over
			blend = col(data['HitBlendColor']) ?? 0;
			break;
		case '2': // down
			blend = col(data['DownBlendColor']) ?? 0;
			scale *= -1;
			break;
		case '3': // hit
			blend = col(data['HitBlendColor']) ?? 0;
			scale *= -1;
			break;
	}

	/** @type {SVGElement[]} */ const steps = [
		svgEl('feComponentTransfer', { in: 'SourceAlpha' }, [
			svgEl('feFuncA', { type: 'linear', slope: 512, intercept: -threshold * 511 }),
		]),
		svgEl('feGaussianBlur', { stdDeviation: width / GAUSSIAN_TO_LINEAR_SCALE }),
		svgEl('feComponentTransfer', { result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: GAUSSIAN_TO_LINEAR }),
		]),
	];

	if (slope.transferInner !== '0 1') {
		steps.push(svgEl('feComponentTransfer', { result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: slope.transferInner }),
		]));
	}

	if (lightAngleAdjust) {
		steps.push(
			svgEl('feConvolveMatrix', {
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: kernel2.join(' '),
				bias: 0.5,
				divisor: 0.5 / scale,
			}),
			svgEl('feComponentTransfer', { result: 'x' }, [
				svgEl('feFuncA', { type: 'table', tableValues: '1 0 1' }),
			]),
		);
	}

	steps.push(svgEl('feConvolveMatrix', {
		order: 3,
		kernelUnitLength: 1,
		kernelMatrix: kernel1.join(' '),
		bias: 0.5,
		divisor: 0.5 / scale,
		in: 'h',
	}));

	if (lightAngleAdjust) {
		steps.push(svgEl('feComposite', { operator: 'arithmetic', k2: 1, k3: lightAngleAdjust, in2: 'x' }));
	}

	if (smoothing > 0) {
		steps.push(svgEl('feGaussianBlur', { stdDeviation: smoothing, edgeMode: 'duplicate' }));
	}

	steps.push(
		svgEl('feColorMatrix', { type: 'matrix', values: [
			'0 0 0 257 -128',
			'0 0 0 257 -128',
			'0 0 0 257 -128',
			'0 0 0 1 0',
		].join(' ') }),
		svgEl('feComponentTransfer', {}, [
			svgEl('feFuncA', { type: 'table', tableValues: `${darkStrength} 0 ${lightStrength}` }),
		]),
		svgEl('feComposite', { operator: 'atop', in2: 'SourceGraphic', result: 'i' }),
	);

	if (blend) {
		steps.push(
			svgEl('feFlood', { 'flood-color': rgba(blend) }),
			svgEl('feComposite', { operator: 'atop', in2: 'i' }),
		);
	}

	return svgEl('filter', {
		// ideally this filter is 1 pixel larger than the shape in all directions
		x: '-1%',
		y: '-1%',
		width: '102%',
		height: '102%',
	}, steps);
}

/** @param {import('./registry.mjs').Data} data */
function outerBevel(data) {
	const width = float(data['BevelWidth']) ?? 0;
	const contrast = (float(data['BevelContrast']) ?? 100) * 0.01;
	const threshold = float(data['EdgeThreshold']) ?? 0;
	const azimuth = -(float(data['LightAngle']) ?? 0) * Math.PI / 180;
	const slope = BEVEL_SLOPE_TYPES.get(str(data['SlopeType']) ?? '') ?? LINEAR;
	const slopeMultiplier = float(data['SlopeMultiplier']) ?? 1;
	const maskSoftness = float(data['MaskSoftness']) ?? 0;
	const colour = col(data['OuterBevelColor']) ?? 0;
	//const angleSoftness = float(data['AngleSoftness']) ?? 0;
	//const lightDistance = float(data['LightDistance']) ?? 0;
	//const highlightCol = col(data['HiliteColor']); // always #ffffff ?
	//const shadowCol = col(data['ShadowColor']); // always #000000 ?

	const kernel1 = makeEdgeKernel(azimuth);
	const kernel2 = makeEdgeKernel(azimuth + Math.PI * 0.5);
	const scale = width * slopeMultiplier * contrast * slope.mult * 0.4; // TODO: 0.4 is tuned by eye; what is the actual scale?
	const lightAngleAdjust = -0.1;
	const darkStrength = 1;
	const lightStrength = 1.25;
	const smoothing = maskSoftness * 0.25 + 0.5;

	/** @type {SVGElement[]} */ const steps = [
		svgEl('feComponentTransfer', { in: 'SourceAlpha' }, [
			svgEl('feFuncA', { type: 'linear', slope: 512, intercept: -threshold * 511 }),
		]),
		svgEl('feGaussianBlur', { stdDeviation: width / GAUSSIAN_TO_LINEAR_SCALE, result: 'b' }),
		svgEl('feComponentTransfer', { result: 'c' }, [
			svgEl('feFuncA', { type: 'linear', slope: 128, intercept: -3 }),
		]),
		svgEl('feComponentTransfer', { in: 'b', result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: GAUSSIAN_TO_LINEAR }),
		]),
	];

	if (slope.transferOuter !== '0 1') {
		steps.push(svgEl('feComponentTransfer', { result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: slope.transferOuter }),
		]));
	}

	if (lightAngleAdjust) {
		steps.push(
			svgEl('feConvolveMatrix', {
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: kernel2.join(' '),
				bias: 0.5,
				divisor: 0.5 / scale,
			}),
			svgEl('feComponentTransfer', { result: 'x' }, [
				svgEl('feFuncA', { type: 'table', tableValues: '1 0 1' }),
			]),
		);
	}

	steps.push(svgEl('feConvolveMatrix', {
		order: 3,
		kernelUnitLength: 1,
		kernelMatrix: kernel1.join(' '),
		bias: 0.5,
		divisor: 0.5 / scale,
		in: 'h',
	}));

	if (lightAngleAdjust) {
		steps.push(svgEl('feComposite', { operator: 'arithmetic', k2: 1, k3: lightAngleAdjust, in2: 'x' }));
	}

	if (smoothing > 0) {
		steps.push(svgEl('feGaussianBlur', { stdDeviation: smoothing, edgeMode: 'duplicate' }));
	}

	steps.push(
		svgEl('feColorMatrix', { type: 'matrix', values: [
			'0 0 0 257 -128',
			'0 0 0 257 -128',
			'0 0 0 257 -128',
			'0 0 0 1 0',
		].join(' ') }),
		svgEl('feComponentTransfer', { result: 'l' }, [
			svgEl('feFuncA', { type: 'table', tableValues: `${darkStrength} 0 ${lightStrength}` }),
		]),
		svgEl('feFlood', { 'flood-color': rgba(colour) }),
		svgEl('feComposite', { operator: 'over', in: 'l' }),
		svgEl('feComposite', { operator: 'in', in2: 'c' }),
		svgEl('feComposite', { operator: 'over', in: 'SourceGraphic' }),
	);

	return svgEl('filter', {
		// TODO: extend bounds based on size (need to know what size the target is)
		x: '-30%',
		y: '-30%',
		width: '160%',
		height: '160%',
	}, steps);
}

/**
 * @param {import('./registry.mjs').Data} data
 * @param {number} depth
 */
function emboss(data, depth) {
	const width = float(data['BevelWidth']) ?? 0;
	const contrast = (float(data['BevelContrast']) ?? 100) * 0.01;
	const threshold = float(data['EdgeThreshold']) ?? 0;
	const azimuth = -(float(data['LightAngle']) ?? 0) * Math.PI / 180;
	const slope = BEVEL_SLOPE_TYPES.get(str(data['SlopeType']) ?? '') ?? LINEAR;
	const slopeMultiplier = float(data['SlopeMultiplier']) ?? 1;
	const maskSoftness = float(data['MaskSoftness']) ?? 0;
	const embossFaceCol = col(data['EmbossFaceColor']);
	const showObject = data['ShowObject'] === 'true';
	//const angleSoftness = float(data['AngleSoftness']) ?? 0;
	//const lightDistance = float(data['LightDistance']) ?? 0;
	//const highlightCol = col(data['HiliteColor']); // always #ffffff ?
	//const shadowCol = col(data['ShadowColor']); // always #000000 ?

	const kernel1 = makeEdgeKernel(azimuth);
	const kernel2 = makeEdgeKernel(azimuth + Math.PI * 0.5);
	const scale = width * slopeMultiplier * contrast * slope.mult * 0.4 * depth; // TODO: 0.4 is tuned by eye; what is the actual scale?
	const lightAngleAdjust = -0.1;
	const darkStrength = 1;
	const lightStrength = 1.25;
	const smoothing = maskSoftness * 0.25 + 0.5;

	/** @type {SVGElement[]} */ const steps = [
		svgEl('feComponentTransfer', { in: 'SourceAlpha' }, [
			svgEl('feFuncA', { type: 'linear', slope: 512, intercept: -threshold * 511 }),
		]),
		svgEl('feGaussianBlur', { stdDeviation: width / GAUSSIAN_TO_LINEAR_SCALE, result: 'b' }),
		svgEl('feComponentTransfer', { result: 'c' }, [
			svgEl('feFuncA', { type: 'linear', slope: 128, intercept: -3 }),
		]),
		svgEl('feComponentTransfer', { in: 'b', result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: GAUSSIAN_TO_LINEAR }),
		]),
	];

	if (slope.transferOuter !== '0 1') {
		steps.push(svgEl('feComponentTransfer', { result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: slope.transferOuter }),
		]));
	}

	if (lightAngleAdjust) {
		steps.push(
			svgEl('feConvolveMatrix', {
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: kernel2.join(' '),
				bias: 0.5,
				divisor: 0.5 / scale,
			}),
			svgEl('feComponentTransfer', { result: 'x' }, [
				svgEl('feFuncA', { type: 'table', tableValues: '1 0 1' }),
			]),
		);
	}

	steps.push(svgEl('feConvolveMatrix', {
		order: 3,
		kernelUnitLength: 1,
		kernelMatrix: kernel1.join(' '),
		bias: 0.5,
		divisor: 0.5 / scale,
		in: 'h',
	}));

	if (lightAngleAdjust) {
		steps.push(svgEl('feComposite', { operator: 'arithmetic', k2: 1, k3: lightAngleAdjust, in2: 'x' }));
	}

	steps.push(
		svgEl('feColorMatrix', { type: 'matrix', values: [
			'0 0 0 257 -128',
			'0 0 0 257 -128',
			'0 0 0 257 -128',
			'0 0 0 1 0',
		].join(' ') }),
		svgEl('feComponentTransfer', {}, [
			svgEl('feFuncA', { type: 'table', tableValues: `${darkStrength} 0 ${lightStrength}` }),
		]),
		svgEl('feComposite', { operator: 'in', in2: 'c' }),
	);

	if (smoothing > 0) {
		steps.push(svgEl('feGaussianBlur', { stdDeviation: smoothing }));
	}

	if (showObject) {
		steps.push(svgEl('feComposite', { operator: 'over', in: 'SourceGraphic' }));
	} else if (embossFaceCol) {
		steps.push(
			svgEl('feComposite', { operator: 'out', in2: 'SourceAlpha', result: 'e' }),
			svgEl('feFlood', { 'flood-color': rgba(embossFaceCol) }),
			svgEl('feComposite', { operator: 'in', in2: 'SourceAlpha' }),
			svgEl('feComposite', { operator: 'arithmetic', in: 'e', k2: 1, k3: 1 }),
		);
	}

	return svgEl('filter', {
		// TODO: extend bounds based on size (need to know what size the target is)
		x: '-30%',
		y: '-30%',
		width: '160%',
		height: '160%',
	}, steps);
}

function glow({
	threshold = 0,
	width = 0,
	distance = 0,
	transfer = '0 1 0',
	colour = 0,
	inside = false,
}) {
	if (width <= 0 || !colour) {
		return null;
	}

	const slope = Math.abs(distance) / width + 1;
	let bounds = { x: '0%', y: '0%', width: '100%', height: '100%' };
	if (!inside) {
		bounds = {
			// TODO: extend bounds based on distance + width (need to know what size the target is)
			x: '-30%',
			y: '-30%',
			width: '160%',
			height: '160%',
		};
	}

	return svgEl('filter', bounds, [
		svgEl('feComponentTransfer', { in: 'SourceAlpha' }, [
			svgEl('feFuncA', { type: 'linear', slope: 512, intercept: -threshold * 511 }),
		]),
		svgEl('feGaussianBlur', { stdDeviation: (Math.abs(distance) + width) / GAUSSIAN_TO_LINEAR_SCALE }),
		svgEl('feComponentTransfer', { result: 'h' }, [
			svgEl('feFuncA', { type: 'table', tableValues: GAUSSIAN_TO_LINEAR }),
		]),
		svgEl('feComponentTransfer', {}, [
			svgEl('feFuncA', { type: 'linear', slope, intercept: distance < 0 ? 1 - slope : 0 }),
		]),
		svgEl('feComponentTransfer', { result: 'b' }, [
			svgEl('feFuncA', { type: 'table', tableValues: transfer }),
		]),
		svgEl('feFlood', { 'flood-color': rgba(colour) }),
		svgEl('feComposite', { operator: 'in', in2: 'b' }),
		inside
			? svgEl('feComposite', { operator: 'atop', in2: 'SourceGraphic' })
			: svgEl('feComposite', { operator: 'over', in: 'SourceGraphic' }),
	]);
}

registerEffect('{7fe61102-6ce2-11d1-8c76000502701850}', {
	name: 'Bevel',
	apply: (globals, contents, data) => {
		const typeId = str(data['BevelType']) ?? '';
		/** @type {SVGElement | null} */ let filter = null;
		switch (typeId) {
			case '0':
				filter = innerBevel(data);
				break;
			case '1':
				filter = outerBevel(data);
				break;
			case '2':
				filter = emboss(data, 1);
				break;
			case '3':
				filter = emboss(data, -1);
				break;
			case '4': {
				const rawWidth = float(data['GlowWidth']) ?? 0;
				const rawDistance = float(data['GlowStartDistance']) ?? 0;
				// adjustments judged by eye to match Fireworks' behaviour
				const width = rawWidth * 3;
				let distance = rawDistance + width * 0.25;
				let transfer = '0 .1 .25 .4 .5 .4 .25 .1 0';
				if (!rawDistance) {
					// Fireworks uses a different behaviour if distance is 0
					transfer = '0 .1 .3 .7 .9 1 1 1 1 1 1';
					distance = 0;
				}
				filter = glow({
					threshold: float(data['EdgeThreshold']),
					width,
					distance,
					transfer,
					colour: col(data['OuterBevelColor'], data['BevelContrast'], 100),
				});
				break;
			}
			default:
				console.warn(`Unknown bevel type: ${typeId}`);
		}
		if (filter) {
			contents.setAttribute('filter', `url(#${encodeURIComponent(globals.addDef(filter))})`);
		}
		return contents;
	},
});

registerEffect('{2ba87123-8220-11d3-baad0000861f4d01}', {
	name: 'Inner Glow',
	apply: (globals, contents, data) => {
		const rawWidth = float(data['GlowWidth']) ?? 0;
		const rawDistance = float(data['GlowStartDistance']) ?? 0;
		// adjustments judged by eye to match Fireworks' behaviour
		let width = rawWidth * 1.5;
		let distance = -(rawDistance + rawWidth * 0.5);
		let transfer = '0 .2 .55 .75 .55 .2 0';
		if (!rawDistance) {
			// Fireworks uses a different behaviour if distance is 0
			width = rawWidth * 2;
			transfer = '1 1 1 1 1 1 .9 .7 .3 .1 0';
			distance = 0;
		}
		const filter = glow({
			threshold: 0,
			width,
			distance,
			transfer,
			colour: col(data['OuterBevelColor'], data['BevelContrast'], 100),
			inside: true,
		});
		if (filter) {
			contents.setAttribute('filter', `url(#${encodeURIComponent(globals.addDef(filter))})`);
		}
		return contents;
	},
});

registerEffect('{d810e821-f86b-11d0-656341346564694e}', {
	name: 'Bevel Boss',
	apply: (globals, contents, data) => {
		return contents; // TODO
	},
});
