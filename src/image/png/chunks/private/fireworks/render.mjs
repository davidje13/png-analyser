import { el, svgEl, tilesAsCanvas } from '../../../../../display/pretty.mjs';
import { applyEffect } from './effects.mjs';
import { ALSv } from './nodes/ALSv.mjs';
import { ELMv } from './nodes/ELMv.mjs';
import { GRPv } from './nodes/GRPv.mjs';
import { BaseElement, IMGv } from './nodes/IMGv.mjs';
import { LSLv } from './nodes/LSLv.mjs';
import { LYLv } from './nodes/LYLv.mjs';
import { MSKv } from './nodes/MSKv.mjs';
import { PATv } from './nodes/PATv.mjs';
import { PBPv } from './nodes/PBPv.mjs';
import { PDCv } from './nodes/PDCv.mjs';
import { PTHv } from './nodes/PTHv.mjs';
import { rootv } from './nodes/rootv.mjs';
import { TXTv } from './nodes/TXTv.mjs';
import { URLv } from './nodes/URLv.mjs';

/**
 * @typedef {{
 *   root: rootv;
 *   page: PDCv;
 *   frame: number;
 *   svg: SVGSVGElement;
 *   width: number;
 *   height: number;
 *   nextID: () => string,
 *   addDef: (o: SVGElement) => string;
 * }} ImageGlobals
 */

/**
 * @param {rootv} root
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderAllPages(root, baseFilename = 'image') {
	const hold = el('div');
	let pageNum = 1;
	for (const page of root.allPages) {
		let pageFilename = baseFilename;
		if (root.allPages.length > 1) {
			pageFilename += `-${page.name ?? `page${pageNum}`}`;
		}
		hold.append(renderAllFramesInPage(root, page, pageFilename));
		++pageNum;
	}
	return hold;
}

/**
 * @param {rootv} root
 * @param {PDCv} page
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderAllFramesInPage(root, page, baseFilename) {
	const hold = el('div', {}, [internalLink('Page', page.getNodePath()), ':']);
	if (page.id) {
		hold.append(' ', internalLink(JSON.stringify(page.id), page.getChildNodePath('PIDs')));
	}
	if (page.name) {
		hold.append(' ', internalLink(JSON.stringify(page.name), page.getChildNodePath('PGNs')));
	}
	if (page.masterPage) {
		hold.append(' ', internalLink('<master page>', page.getChildNodePath('IMPb')));
	} else if (page.linkedToMaster) {
		hold.append(' ', internalLink('<linked to master page>', page.getChildNodePath('PILb')));
	}
	hold.append(
		el('br'),
		internalLink(page.width, page.getChildNodePath('WIDf')),
		' x ',
		internalLink(page.height, page.getChildNodePath('HITf')),
		' @',
		internalLink(page.resolution, page.getChildNodePath('RESf')),
		' ',
		internalLink(page.resolutionUnit.name ?? '[unknown unit]', page.getChildNodePath('RSUi')),
		', frames: ',
		internalLink(page.frameCount, page.getChildNodePath('FRCi')),
	);
	const frames = el('div', { class: 'horizontal' });
	hold.append(frames);
	for (let frame = 0; frame < page.frameCount; ++frame) {
		let frameFilename = baseFilename;
		if (page.frameCount > 1) {
			frameFilename += `-${page.exportOptions?.frameConfigurationList[frame]?.name ?? `frame${frame + 1}`}`;
		}
		frames.append(renderFrame(root, page, frame, frameFilename));
	}
	return hold;
}

let globalID = 0;

/**
 * @param {rootv} root
 * @param {PDCv} page
 * @param {number} frame
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderFrame(root, page, frame, baseFilename = 'image') {
	const target = el('div');
	const frameInfo = page.exportOptions?.frameConfigurationList[frame];
	target.append(internalLink(`Frame ${frame + 1}`, frameInfo?.getNodePath()), ':');
	if (frameInfo) {
		if (frameInfo?.name) {
			target.append(
				' ',
				internalLink(JSON.stringify(frameInfo.name), frameInfo.getChildNodePath('OBNs')),
			);
		}
		target.append(
			' ',
			internalLink(frameInfo.duration.toFixed(2), frameInfo.getChildNodePath('FNDi')),
			's',
		);
	}
	const scale = page.scaleAt72DPI;
	const defs = svgEl('defs');
	const svg = svgEl('svg', {
		xmlns: 'http://www.w3.org/2000/svg',
		viewBox: `0 0 ${page.width} ${page.height}`,
		width: page.width * scale,
		height: page.height * scale,
		fill: 'none',
		'stroke-linejoin': 'round',
		'stroke-linecap': 'round',
		'color-interpolation-filters': 'sRGB',
	}, [defs]);
	if (page.backgroundColour.a > 0) {
		svg.append(svgEl('rect', {
			width: page.width,
			height: page.height,
			fill: page.backgroundColour.toCSS(),
		}));
	}
	const selfID = globalID++; // avoid ID conflicts between images on the same page (e.g. multiple frames, pages, files)
	let idInc = 0;
	const nextID = () => `${selfID}-${idInc++}`;
	/** @type {ImageGlobals} */ const imageGlobals = {
		root,
		page,
		frame,
		svg,
		width: page.width,
		height: page.height,
		nextID,
		addDef: (o) => {
			const id = nextID();
			o.setAttribute('id', id);
			defs.append(o);
			return id;
		},
	};
	target.append(el('div', { class: 'image-canvas' }, [svg]));
	for (const layer of page.layerList) {
		svg.append(renderLayer(imageGlobals, layer) ?? '');
	}
	const saveSVG = el('button', { type: 'button' }, ['Save as SVG']);
	target.append(saveSVG);
	saveSVG.addEventListener('click', () => {
		const source = '<?xml version="1.0" standalone="yes"?>' + svg.outerHTML;
		const filename = baseFilename.replaceAll(/[^a-zA-Z0-9._]+/g, '-') + '.svg';
		el('a', { href: `data:image/svg+xml;base64,${btoa(source)}`, download: filename }).click();
	});
	return target;
}

/**
 * @param {ImageGlobals} globals
 * @param {LYLv[number]} layer
 * @return {SVGElement | null}
 */
export function renderLayer(globals, layer) {
	switch (layer.type) {
		case 'MPLv': { // whole master page link
			const v = layer.value;
			const page = globals.root.getPage(v.pageId);
			if (page && v.visibleInFrame(globals.frame)) {
				return svgEl('g', {
					'data-name': v.name,
					'data-type': 'layer-master',
				}, page.layerList.map((subLayer) => renderLayer(globals, subLayer)));
			}
			break;
		}
		case 'LSAv': { // "share across pages" layer
			const v = layer.value;
			const linked = globals.root.getSharedLayer(v.id);
			if (linked) {
				const linkedLayer = linked.layer;
				if (linkedLayer.visibleInFrame(globals.frame)) {
					return svgEl('g', {
						'data-name': linked.layer.name,
						'data-type': 'layer-shared',
					}, renderElements(globals, linkedLayer.contentInFrame(globals.frame).elements));
				}
			}
			break;
		}
		case 'LAYv': { // regular layer
			const v = layer.value;
			if (v.visibleInFrame(globals.frame)) {
				return svgEl('g', {
					'data-name': v.name,
					'data-type': 'layer',
				}, renderElements(globals, v.contentInFrame(globals.frame).elements));
			}
		}
	}
	return null;
}

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
				grouped = applyEffect(globals, grouped ?? mustGroup(), effect);
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
		if (!value.visible) {
			grouped.setAttribute('display', 'none');
		}
		if (value.blendMode?.value?.name === 'average') {
			grouped.setAttribute('opacity', ((value.opacity ?? 1) / 2).toFixed(3));
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
		const invertID = globals.addDef(svgEl('filter', { x: '0%', y: '0%', width: '100%', height: '100%' }, [
			svgEl('feComponentTransfer', {}, [
				svgEl('feFuncR', { type: 'linear', slope: -1, intercept: 1 }),
				svgEl('feFuncG', { type: 'linear', slope: -1, intercept: 1 }),
				svgEl('feFuncB', { type: 'linear', slope: -1, intercept: 1 }),
			]),
		]));
		maskID = globals.addDef(svgEl('mask', {}, [
			svgEl('g', { filter: `url(#${encodeURIComponent(invertID)})` }, renderElements(globals, grpv.elements.slice(0, 1))),
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
function applyFill(globals, target, {
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
		case 15: // pattern
			if (props.patternTile) {
				// TODO: SVG interpolates images assuming they are non-wrapping, so the
				// pattern looks slightly different compared to fireworks' rendering
				// (which also seems to have a bug the other way: doubling-up edge pixels)
				target.setAttribute('fill', `url(#${encodeURIComponent(makePattern(globals, props.patternTile.image, fp1, fp2, fp3))})`);
			}
			break;
		case 16: { // web dither
			const patternID = globals.addDef(svgEl('pattern', {
				viewBox: '0 0 2 2',
				width: 2,
				height: 2,
				patternUnits: 'userSpaceOnUse',
			}, [
				svgEl('rect', { width: 1, height: 1, fill: props.ditherTransparent ? 'none' : props.ditherColour1.toCSS() }),
				svgEl('rect', { x: 1, width: 1, height: 1, fill: props.ditherColour2.toCSS() }),
				svgEl('rect', { y: 1, width: 1, height: 1, fill: props.ditherColour3.toCSS() }),
				svgEl('rect', { x: 1, y: 1, width: 1, height: 1, fill: props.ditherTransparent ? 'none' : props.ditherColour4.toCSS() }),
			]));
			target.setAttribute('fill', `url(#${encodeURIComponent(patternID)})`);
			break;
		}
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

const TEXT_JUSTIFICATION = ['start', 'middle', 'end', 'start'];

/**
 * @param {number} w
 * @param {number} h
 * @param {{ x: number, y: number }} center
 * @param {{ x: number, y: number }} u
 * @param {{ x: number, y: number }} v
 */
function makeTransformMatrix(w, h, center, u, v) {
	if (center.x === 0 && center.y === 0 && u.x === w && u.y === 0 && v.x === 0 && v.y === -h) {
		return undefined;
	}
	const iu = 1 / w;
	const iv = 1 / h;
	return `matrix(${(u.x - center.x) * iu} ${(u.y - center.y) * iu} ${(center.x - v.x) * iv} ${(center.y - v.y) * iv} ${center.x} ${center.y})`;
}

/**
 * @param {ImageGlobals} globals
 * @param {IMGv | MSKv} img
 * @param {{ x: number, y: number }} center
 * @param {{ x: number, y: number }} u
 * @param {{ x: number, y: number }} v
 */
function makePattern(
	globals,
	img,
	center = { x: 0, y: 0 },
	u = { x: center.x + img.width, y: center.y },
	v = { x: center.x, y: center.y - img.height },
) {
	const transform = makeTransformMatrix(img.width, img.height, center, u, v);

	return globals.addDef(svgEl('pattern', {
		viewBox: `0 0 ${img.width} ${img.height}`,
		width: img.width,
		height: img.height,
		patternUnits: 'userSpaceOnUse',
		patternTransform: transform,
	}, [
		// TODO: share common images (<use>) rather than creating multiple times
		svgEl('image', {
			href: img.cachedDataURL ??= rasterToDataURL(globals, img),
			width: img.width,
			height: img.height,
		}),
	]));
}

/**
 * @param {ImageGlobals} globals
 * @param {MSKv} img
 * @param {number} opacity
 * @param {{ x: number, y: number }} offset
 */
function makeTextureMask(globals, img, opacity = 1, offset = { x: 0, y: 0 }) {
	return globals.addDef(svgEl('mask', {}, [
		opacity < 1 ? svgEl('rect', {
			fill: '#ffffff',
			width: '100%',
			height: '100%',
		}) : null,
		svgEl('rect', {
			fill: `url(#${encodeURIComponent(makePattern(globals, img, offset))})`,
			width: '100%',
			height: '100%',
			opacity,
		}),
	]));
}

/**
 * @param {ImageGlobals} globals
 * @param {IMGv | MSKv} o
 */
function rasterToDataURL(globals, o) {
	const width = o.width;
	const height = o.height;
	const tileSize = o.tileSize;
	const tiles = o.tiles;

	const nx = Math.ceil(width / tileSize);
	const ny = Math.ceil(height / tileSize);
	if (tiles.length !== nx * ny) {
		console.warn(`expected ${nx * ny} tiles, got ${tiles.length}`);
	}

	/** @type {import('../../../../../display/pretty.mjs').TileData} */
	const r = { width, height, tiles: [] };
	for (let y = 0; y < ny; ++y) {
		for (let x = 0; x < nx; ++x) {
			const px = x * tileSize;
			const py = y * tileSize;
			const tile = tiles[y * nx + x];
			if (tile?.type === 'TIDi') {
				const mkbt = globals.root.getTile(tile.value);
				if (mkbt?.img) {
					r.tiles.push({ type: 'i', x: px, y: py, value: mkbt.img() });
					continue;
				}
			}
			const tmci = (tile?.type === 'TMCi' ? tile.value.argb32 : null) ?? 0xFFFF0000;
			r.tiles.push({ type: 'c', x: px, y: py, value: tmci, w: tileSize, h: tileSize });
		}
	}
	return tilesAsCanvas(r).toDataURL();
}

/**
 * @param {PBPv} contour
 * @return {string}
 */
function contourToSVG(contour) {
	const begin = contour.points[0];
	if (!begin) {
		return '';
	}
	let r = `M${begin.x} ${begin.y}`;
	for (let i = 1; i < contour.points.length; ++i) {
		const ptA = contour.points[i - 1];
		const pt = contour.points[i];
		r += `C${ptA.xC2} ${ptA.yC2} ${pt.xC1} ${pt.yC1} ${pt.x} ${pt.y}`;
	}
	if (contour.isClosed) {
		const ptA = contour.points[contour.points.length - 1];
		const pt = contour.points[0];
		r += `C${ptA.xC2} ${ptA.yC2} ${pt.xC1} ${pt.yC1} ${pt.x} ${pt.y}Z`;
	}
	return r;
}

/**
 * @param {HTMLElement | number | string} content
 * @param {string | undefined} target
 * @return {HTMLElement | string}
 */
function internalLink(content, target) {
	const inner = typeof content === 'number' ? String(content) : content;
	if (!target) {
		return inner;
	}
	return el('a', { href: `#${encodeURIComponent(target)}` }, [inner]);
}
