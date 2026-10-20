import { svgEl } from '../../../../../../display/pretty.mjs';
import { invertFilter } from '../effects/invert.mjs';
import { applyEffect } from '../effects/index.mjs';
import { ALSv } from '../nodes/ALSv.mjs';
import { ELMv } from '../nodes/ELMv.mjs';
import { GRPv } from '../nodes/GRPv.mjs';
import { BaseElement, IMGv } from '../nodes/IMGv.mjs';
import { LSLv } from '../nodes/LSLv.mjs';
import { PTHv } from '../nodes/PTHv.mjs';
import { TXTv } from '../nodes/TXTv.mjs';
import { URLv } from '../nodes/URLv.mjs';
import { applyFill } from './fills.mjs';
import { rasterToDataURL } from './image.mjs';
import { contourToSVG } from './path.mjs';
import { makeTextureMask } from './texture.mjs';

/** @typedef {import('./globals.mjs').ImageGlobals} ImageGlobals */

/**
 * @param {ImageGlobals} globals
 * @param {ELMv} elements
 */
export function renderElements(globals, elements) {
	/** @type {SVGElement[]} */ const r = [];
	for (let i = elements.length; (i--) > 0;) {
		const o = renderElement(globals, elements[i]);
		if (o) {
			r.push(o);
		}
	}
	return r;
}

/**
 * @param {ImageGlobals} globals
 * @param {ELMv[number]} element
 * @return {SVGElement | null}
 */
export function renderElement(globals, { type, value }) {
	const rendered = RENDERERS.get(type)?.(globals, value) ?? [];
	if (Array.isArray(rendered) && !rendered.length) {
		return null;
	}
	/** @type {SVGElement | undefined} */ let grouped;
	const mustGroup = () => Array.isArray(rendered) ? svgEl('g', {}, rendered) : rendered;
	const noGroup = () => Array.isArray(rendered) ? rendered.length === 1 ? rendered[0] : svgEl('g', {}, rendered) : rendered;

	if (value instanceof BaseElement) {
		// TODO: automatically fall-back to rasterised content if we detect we cannot
		// render something accurately (e.g. it contains text, or uses an effect which
		// is not fully supported yet)
		// - maybe offer a way to include both in the exported SVG
		//if (v.image) {
		//	v.image.cachedDataURL ??= rasterToDataURL(globals, v.image);
		//	hold.append(svgEl('image', {
		//		href: v.image.cachedDataURL,
		//		x: v.image.x,
		//		y: v.image.y,
		//		width: v.image.width,
		//		height: v.image.height,
		//	}));
		//}

		// note: do not apply effects to pre-rasterised images (they are already applied)
		for (const effect of value.effectList?.effectPropertiess ?? []) {
			if (effect.data['EffectIsVisible'] !== 'false') {
				// each effect gets its own group so that the effects can stack
				if (grouped) {
					grouped = svgEl('g', {}, [grouped]);
				} else {
					grouped = mustGroup();
				}
				grouped = applyEffect(globals, grouped, effect);
			}
		}

		const blend = value.blendMode?.value?.css;
		if (blend) {
			grouped ??= mustGroup();
			grouped.style.mixBlendMode = blend;
		}

		grouped ??= noGroup();
		if (value.name) {
			grouped.dataset['name'] = value.name;
		}
		if (!value.visible || !value.opacity) {
			grouped.setAttribute('display', 'none');
		} else if (value.blendMode?.value?.name === 'average') {
			grouped.setAttribute('opacity', (value.opacity / 2).toFixed(3));
		} else if (value.opacity < 1) {
			grouped.setAttribute('opacity', value.opacity.toFixed(3));
		}
	}
	grouped ??= noGroup();
	const path = value.getNodePath();
	if (path) {
		grouped.addEventListener('click', (e) => {
			e.stopPropagation();
			document.location.href = `#${encodeURIComponent(path)}`;
		});
	}
	return grouped;
}

/** @type {Map<string, (globals: ImageGlobals, value: any) => SVGElement | SVGElement[]>} */
const RENDERERS = new Map();

RENDERERS.set('IMGv', (globals, /** @type {IMGv} */ imgv) => svgEl('image', {
	href: imgv.cachedDataURL ??= rasterToDataURL(globals, imgv),
	x: imgv.x,
	y: imgv.y,
	width: imgv.width,
	height: imgv.height,
}));
RENDERERS.set('PTHv', (globals, /** @type {PTHv} */ pthv) => {
	const d = pthv.bezierPoints.map(contourToSVG).join('');
	/** @type {SVGElement | null} */ let stroke = null;
	/** @type {SVGElement | null} */ let fill = null;
	if (
		pthv.pattern.brushColour.a > 0 &&
		pthv.pattern.brushPropertyList &&
		pthv.pattern.brushPropertyList.diameter > 0
	) {
		//pthv.brushPlacement - TODO: not supported by SVG; could achieve with masks
		stroke = svgEl('path', {
			d,
			stroke: pthv.pattern.brushColour.toCSS(),
			'stroke-width': pthv.pattern.brushPropertyList.diameter,
			'paint-order': pthv.fillOnTop ? 'stroke' : undefined,
			'shape-rendering': pthv.pattern.brushPropertyList.isAntiAliased ? undefined : 'crispEdges',
			'stroke-dasharray': pthv.pattern.brushPropertyList.dashArray.join(' ') || undefined,
		});
		if (
			pthv.pattern.textureBrush && (
				pthv.pattern.brushPropertyList.textureBlend > 0 ||
				pthv.pattern.brushPropertyList.textureEdge > 0 // TODO
			)
		) {
			stroke.setAttribute('mask', `url(#${encodeURIComponent(makeTextureMask(globals, pthv.pattern.textureBrush.mask, pthv.pattern.brushPropertyList.textureBlend, pthv.textureOffset))})`);
		}
	}
	if (pthv.pattern.fillColour.a > 0) {
		fill = svgEl('path', {
			d,
			'fill-rule': pthv.evenOddFillRule ? 'evenodd' : undefined,
		});
		fill = applyFill(globals, fill, pthv);
	}
	if (fill && stroke) {
		if (pthv.fillOnTop) {
			return [stroke, fill];
		} else {
			return [fill, stroke];
		}
	} else if (fill) {
		return [fill];
	} else if (stroke) {
		return [stroke];
	} else {
		return [];
	}
});
RENDERERS.set('TXTv', (globals, /** @type {TXTv} */ txtv) => {
	let line1MaxFont = 0;
	let line1MaxLineHeight = 0;
	for (const f of txtv.formattedString) {
		const sz = f.pointSize;
		line1MaxFont = Math.max(line1MaxFont, sz);
		line1MaxLineHeight = Math.max(line1MaxLineHeight, f.lineHeight * (f.lineHeightUnit === 0 ? sz : 1));
		if (f.text.includes('\n')) {
			break;
		}
	}
	const approxScale = txtv.transformMatrix?.approximateScale ?? 1;
	const hold = svgEl('text', {
		'paint-order': txtv.fillOnTop ? 'stroke' : undefined,
	});
	if (txtv.pattern.brushPropertyList?.diameter) {
		// TODO: this is an approximation of the stroke, as it does not use the chosen brush
		// also it is applied before transforming, but Fireworks applies it AFTER any transform
		hold.setAttribute('stroke', txtv.pattern.brushColour.toCSS());
		hold.setAttribute('stroke-width', String(txtv.pattern.brushPropertyList.diameter / approxScale));
	}
	/** @type {SVGElement} */ let target = hold;
	if (txtv.flow === 2 && txtv.path) {
		target = svgEl('textPath', {
			href: '#' + globals.addDef(svgEl('path', {
				d: txtv.path.path.bezierPoints.map(contourToSVG).join(''),
			})),
			startOffset: txtv.path.characterOffset || undefined,
		});
		hold.append(target);
	} else if (txtv.autoEnlarge) {
		if (txtv.leftAnchor !== undefined) {
			hold.setAttribute('x', String(txtv.leftAnchor));
		} else {
			switch (txtv.formattedString[0]?.justification) {
				case 0:
					hold.setAttribute('x', String(txtv.left));
					break;
				case 1:
					hold.setAttribute('x', String((txtv.left + txtv.right) * 0.5));
					break;
				case 2:
					hold.setAttribute('x', String(txtv.right));
					break;
			}
		}
		hold.setAttribute('y', String(txtv.top + line1MaxFont - 1));
		hold.style.whiteSpace = 'pre'; // this does not work in Chrome; could use `<tspan x="0" dy="<line height>">` instead of literal newlines
	} else {
		switch (txtv.formattedString[0]?.justification) {
			case 0:
				hold.setAttribute('x', String(txtv.left));
				break;
			case 1:
				hold.setAttribute('x', String((txtv.left + txtv.right) * 0.5));
				break;
			case 2:
				hold.setAttribute('x', String(txtv.right));
				break;
			case 3:
				hold.setAttribute('x', String(txtv.left));
				hold.setAttribute('textLength', String(txtv.right - txtv.left));
				break;
		}
		// TODO: what should this y position be? This works in some cases but not all
		hold.setAttribute('y', String(txtv.top + line1MaxFont * 2 - line1MaxLineHeight - 1));
		// TODO: this does not work; probably need to do upfront line wrapping
		hold.style.width = `${txtv.right - txtv.left}px`;
		hold.style.whiteSpace = 'pre-wrap';
	}
	for (const f of txtv.formattedString) {
		const sz = f.pointSize;
		const tspan = svgEl('tspan', {
			// TODO: set as much as possible on the root <text> and only apply diffs on tspans
			fill: f.fillColour.toCSS(),
			'font-family': `${f.font},sans-serif`,
			'font-size': sz,
			'font-weight': f.bold ? 'bold' : undefined,
			'font-style': f.italic ? 'italic' : undefined,
			'text-decoration': f.underline ? 'underline' : undefined,
			// this scale factor comes from trial-and-error
			// fireworks uses its own kerning algorithm, so it isn't possible to match the results exactly anyway
			'letter-spacing': f.kerning ? `${f.kerning * sz * 0.1}` : undefined,
			'lengthAdjust': f.horizontalScale === 1 ? undefined : 'spacingAndGlyphs',
			'textLength': f.horizontalScale === 1 ? undefined : `${f.horizontalScale * 100}%`, // note: not supported on tspan in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=890692
			'text-anchor': TEXT_JUSTIFICATION[f.justification],
			'dy': -f.baselineShift || undefined,
		}, [f.text]);
		tspan.style.lineHeight = `${f.lineHeight * (f.lineHeightUnit === 0 ? sz : 1)}px`;
		if (!f.autoKern) {
			tspan.style.fontKerning = 'none';
		}
		target.append(tspan);
	}
	if (txtv.transformMatrix) {
		// TODO: this works in Firefox but not Chrome or Safari - they seem to use a different default origin
		hold.style.transform = txtv.transformMatrix.toCSS();
		return [hold];
	}
	return hold;
});
RENDERERS.set('GRPv', (globals, /** @type {GRPv} */ grpv) => {
	if (grpv.type === 0) {
		return svgEl('g', {
			'data-type': grpv.smartShape ? 'smart-shape' : 'group',
		}, renderElements(globals, grpv.elements));
	}
	/** @type {string} */ let maskID;
	if (grpv.type === 1) {
		// fireworks uses black for opaque and white for transparent,
		// so we must invert the mask to match SVG's behaviour
		maskID = globals.addDef(svgEl('mask', {}, [
			svgEl('g', {
				filter: `url(#${encodeURIComponent(invertFilter(globals))})`,
			}, renderElements(globals, grpv.elements.slice(0, 1))),
		]));
	} else {
		maskID = globals.addDef(svgEl('mask', {
			'mask-type': 'alpha',
		}, renderElements(globals, grpv.elements.slice(0, 1))));
	}
	const masked = svgEl('g', {
		mask: `url(#${encodeURIComponent(maskID)})`,
		'data-type': 'masked',
	}, renderElements(globals, grpv.elements.slice(1)));
	if (grpv.showMask) {
		return [...renderElements(globals, grpv.elements.slice(0, 1)), masked];
	} else {
		return [masked];
	}
});
RENDERERS.set('LSLv', (globals, /** @type {LSLv} */ lslv) => {
	if (lslv.visibleInFrame(globals.frame)) {
		return svgEl('g', {
			'data-name': lslv.name,
			'data-type': 'sublayer',
		}, renderElements(globals, lslv.contentInFrame(globals.frame).elements));
	}
	return [];
});
RENDERERS.set('URLv', (globals, /** @type {URLv} */ urlv) => {
	const label = urlv.label ?? urlv.name;
	const commonProps = {
		fill: urlv.fillColour.withAlpha(64).toCSS(),
		stroke: urlv.fillColour.toCSS(),
		'stroke-width': 1,
		'data-name': urlv.name,
		'data-label': urlv.label,
		'data-href': urlv.href,
		'data-linktarget': urlv.linkTarget,
		'data-alt': urlv.altText,
	};
	const commonTextProps = {
		'font-family': 'sans-serif',
		'font-size': 8,
		fill: '#00000080',
	};
	switch (urlv.shape) {
		case 0: { // rect
			/** @type {SVGElement[]} */ const r = [svgEl('rect', {
				...commonProps,
				x: urlv.left,
				y: urlv.top,
				width: urlv.right - urlv.left,
				height: urlv.bottom - urlv.top,
			})];
			if (label) {
				r.push(svgEl('text', {
					...commonTextProps,
					x: urlv.left + 2,
					y: urlv.bottom - 3,
					//textLength: urlv.right - urlv.left - 4,
					//lengthAdjust: 'spacingAndGlyphs',
				}, [label]));
			}
			return r;
		}
		case 1: { // ellipse
			/** @type {SVGElement[]} */ const r = [svgEl('ellipse', {
				...commonProps,
				cx: (urlv.left + urlv.right) / 2,
				cy: (urlv.top + urlv.bottom) / 2,
				rx: (urlv.right - urlv.left) / 2,
				ry: (urlv.bottom - urlv.top) / 2,
			})];
			if (label) {
				r.push(svgEl('text', {
					...commonTextProps,
					x: (urlv.left + urlv.right) / 2,
					y: (urlv.top + urlv.bottom) / 2 + 4,
					'text-anchor': 'middle',
				}, [label]));
			}
			return r;
		}
		case 2: // path
			return [svgEl('path', {
				...commonProps,
				d: urlv.path ? contourToSVG(urlv.path) : '',
			})];
		default:
			return [];
	}
});
RENDERERS.set('ALSv', (globals, /** @type {ALSv} */ alsv) => {
	return []; // TODO: symbols
});

const TEXT_JUSTIFICATION = ['start', 'middle', 'end', 'start'];
