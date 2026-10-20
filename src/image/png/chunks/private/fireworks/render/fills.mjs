import { el, svgEl } from '../../../../../../display/pretty.mjs';
import { PATv } from '../nodes/PATv.mjs';
import { makePattern } from './pattern.mjs';
import { makeTextureMask } from './texture.mjs';
import { makeTransformMatrix } from './transform.mjs';

/** @typedef {import('./globals.mjs').ImageGlobals} ImageGlobals */

/**
 * @param {ImageGlobals} globals
 * @param {SVGElement} target
 * @param {{
 *   pattern: PATv,
 *   textureOffset: { x: number, y: number },
 *   fillPoint1: { x: number, y: number },
 *   fillPoint2: { x: number, y: number },
 *   fillPoint3: { x: number, y: number },
 * }} details
 */
export function applyFill(globals, target, {
	pattern,
	textureOffset,
	fillPoint1,
	fillPoint2,
	fillPoint3,
}) {
	const props = pattern.fillPatternProperties;
	if (!props) {
		return target;
	}
	if (props.hardEdge) {
		target.setAttribute('shape-rendering', 'crispEdges');
	}
	/** @type {SVGElement | null} */ let maskToShape = null;
	if (props.feather > 0) {
		const filterID = globals.addDef(svgEl('filter', {
			// TODO: extend bounds based on blur amount (need to know what size the target is)
			x: '-30%',
			y: '-30%',
			width: '160%',
			height: '160%',
			'data-type': 'feather',
		}, [
			svgEl('feGaussianBlur', { stdDeviation: props.feather * 0.48 }),
		]));
		target.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		// if element ends up with both filter and mask, filter applies first
		// (this means we can take this shortcut without breaking textureFill below)
		if (props.shape !== 0) {
			maskToShape = target;
			target = svgEl('rect', { width: '100%', height: '100%' });
		}
	}
	if (pattern.textureFill && props.textureBlend > 0 && props.stampingMode === 2) { // mask to white
		maskToShape ??= target;
		target = svgEl('rect', { width: '100%', height: '100%' });
	}
	// shift fill points 1px to match fireworks rendering
	const fp1 = { x: fillPoint1.x, y: fillPoint1.y + 1 };
	const fp2 = { x: fillPoint2.x, y: fillPoint2.y + 1 };
	const fp3 = { x: fillPoint3.x, y: fillPoint3.y + 1 };
	const grad = props.gradient;
	switch (props.shape) {
		case 0: // solid
			target.setAttribute('fill', pattern.fillColour.toCSS());
			break;
		case 2: // linear
		case 12: // bars
			if (grad) {
				const gradID = globals.addDef(svgEl(
					'linearGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						x1: fp1.x,
						y1: fp1.y,
						x2: fp2.x,
						y2: fp2.y,
						spreadMethod: props.shape === 12 ? 'reflect' : undefined,
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 3: // radial
			if (grad) {
				const gradID = globals.addDef(svgEl(
					'radialGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						cx: fp1.x,
						cy: fp1.y,
						r: Math.sqrt((fp2.x - fp1.x) ** 2 + (fp2.y - fp1.y) ** 2),
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 4: // conical
			if (grad) {
				maskToShape ??= target;
				// SVG does not yet support conic gradients, so we must use a foreignObject to get it via CSS instead
				const div = el('div', { xmlns: 'http://www.w3.org/1999/xhtml' });
				div.style.height = `${globals.height}px`; // 100% works in Chrome & Firefox, but not Safari (would be nice to match the bounds of the shape anyway...)
				const angle = Math.atan2(fp2.x - fp1.x, fp1.y - fp2.y) * 180 / Math.PI;
				div.style.background = `conic-gradient(from ${angle.toFixed(2)}deg at ${fp1.x}px ${fp1.y}px in sRGB,${grad.toMirroredCSSStops()})`;
				target = svgEl('foreignObject', { width: '100%', height: '100%' }, [div]);
			}
			break;
		case 5: // satin
			if (grad) {
				// TODO: falling back to linear for now
				const gradID = globals.addDef(svgEl(
					'linearGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						x1: fp1.x,
						y1: fp1.y,
						x2: fp2.x,
						y2: fp2.y,
						spreadMethod: 'reflect',
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 7: // pinch
			if (grad) {
				// TODO: falling back to linear for now
				const gradID = globals.addDef(svgEl(
					'linearGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						x1: fp1.x,
						y1: fp1.y,
						x2: fp2.x,
						y2: fp2.y,
						spreadMethod: 'reflect',
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 8: // folds
			if (grad) {
				// TODO: falling back to linear for now
				const gradID = globals.addDef(svgEl(
					'linearGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						x1: fp1.x,
						y1: fp1.y,
						x2: fp2.x,
						y2: fp2.y,
						spreadMethod: 'reflect',
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 9: // elliptical
		case 13: // ripple
			if (grad) {
				const gradID = globals.addDef(svgEl(
					'radialGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						gradientTransform: makeTransformMatrix(100, 100, fp1, fp2, fp3),
						cx: 0,
						cy: 0,
						r: 100,
						spreadMethod: props.shape === 13 ? 'reflect' : undefined,
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${position * 100}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 10: // rectangular
			if (grad) {
				// TODO: falling back to elliptical for now
				const gradID = globals.addDef(svgEl(
					'radialGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						gradientTransform: makeTransformMatrix(100, 100, fp1, fp2, fp3),
						cx: 0,
						cy: 0,
						r: 100,
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${position * 100}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 14: // waves
			if (grad) {
				// TODO: falling back to linear for now
				const gradID = globals.addDef(svgEl(
					'linearGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						x1: fp1.x,
						y1: fp1.y,
						x2: fp2.x,
						y2: fp2.y,
						spreadMethod: 'reflect',
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 15: // pattern
			if (props.patternTile) {
				// TODO: SVG interpolates images assuming they are non-wrapping, so the
				// pattern looks slightly different compared to fireworks' rendering
				// (which also seems to have a bug the other way: doubling-up edge pixels)
				target.setAttribute('fill', `url(#${encodeURIComponent(makePattern(globals, props.patternTile.image, fp1, fp2, fp3))})`);
			}
			break;
		case 16: { // web dither
			const c1 = props.ditherTransparent ? 'none' : props.ditherColour1.toCSS();
			const c2 = props.ditherColour2.toCSS();
			const c3 = props.ditherColour3.toCSS();
			const c4 = props.ditherTransparent ? 'none' : props.ditherColour4.toCSS();
			const patternID = globals.addDef(svgEl('pattern', {
				viewBox: '0 0 2 2',
				width: 2,
				height: 2,
				patternUnits: 'userSpaceOnUse',
			}, [
				svgEl('rect', { width: 1, height: 1, fill: c1 }),
				svgEl('rect', { x: 1, width: 1, height: 1, fill: c2 }),
				svgEl('rect', { y: 1, width: 1, height: 1, fill: c3 }),
				svgEl('rect', { x: 1, y: 1, width: 1, height: 1, fill: c4 }),
			]), `dither:${c1}:${c2}:${c3}:${c4}`);
			target.setAttribute('fill', `url(#${encodeURIComponent(patternID)})`);
			break;
		}
		case 17: // contour grad
			if (grad) {
				// TODO: falling back to radial for now
				const gradID = globals.addDef(svgEl(
					'radialGradient',
					{
						gradientUnits: 'userSpaceOnUse',
						cx: fp1.x,
						cy: fp1.y,
						r: Math.sqrt((fp2.x - fp1.x) ** 2 + (fp2.y - fp1.y) ** 2),
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${(position * 100).toFixed(2)}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
	}
	if (pattern.textureFill && props.textureBlend > 0) {
		const textureID = makeTextureMask(globals, pattern.textureFill.mask, props.textureBlend, textureOffset);
		if (props.stampingMode === 2) {
			target.setAttribute('mask', `url(#${encodeURIComponent(textureID)})`);
			target = svgEl('g', {}, [svgEl('rect', { width: '100%', height: '100%', fill: '#ffffff' }), target]);
		} else {
			(maskToShape ?? target).setAttribute('mask', `url(#${encodeURIComponent(textureID)})`);
		}
	}
	if (maskToShape) {
		maskToShape.setAttribute('fill', '#000000');
		const maskID = globals.addDef(svgEl('mask', { 'mask-type': 'alpha' }, [maskToShape]));
		target.setAttribute('mask', `url(#${encodeURIComponent(maskID)})`);
	}
	return target;
}
