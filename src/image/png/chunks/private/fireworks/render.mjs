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

/** @typedef {import('./nodes/globals.mjs').ImageGlobals} ImageGlobals */

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
		hold.append(renderAllFramesInPage(root.globals, page, pageFilename));
		++pageNum;
	}
	return hold;
}

/**
 * @param {ImageGlobals} globals
 * @param {PDCv} page
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderAllFramesInPage(globals, page, baseFilename) {
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
		frames.append(renderFrame(globals, page, frame, frameFilename));
	}
	return hold;
}

/**
 * @param {ImageGlobals} globals
 * @param {PDCv} page
 * @param {number} frame
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderFrame(globals, page, frame, baseFilename = 'image') {
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
	const svg = svgEl('svg', {
		xmlns: 'http://www.w3.org/2000/svg',
		viewBox: `0 0 ${page.width} ${page.height}`,
		width: page.width * scale,
		height: page.height * scale,
		fill: 'none',
		'stroke-linejoin': 'round',
		'stroke-linecap': 'round',
		'color-interpolation-filters': 'sRGB',
	}, []);
	if (page.backgroundColour.a > 0) {
		svg.append(svgEl('rect', {
			width: page.width,
			height: page.height,
			fill: page.backgroundColour.toCSS(),
		}));
	}
	target.append(el('div', { class: 'image-canvas' }, [svg]));
	renderLayers(svg, globals, page.layerList, frame);
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
 * @param {SVGElement} target
 * @param {ImageGlobals} globals
 * @param {number} frame
 * @param {LYLv} layerList
 */
export function renderLayers(target, globals, layerList, frame) {
	for (const layer of layerList) {
		const hold = svgEl('g');
		target.append(hold);
		switch (layer.type) {
			case 'MPLv': { // whole master page link
				const v = layer.value;
				const page = globals.pages.get(v.pageId);
				hold.dataset['name'] = v.name;
				hold.dataset['type'] = 'layer-master';
				if (page && v.visibleInFrame(frame)) {
					renderLayers(hold, globals, page.layerList, frame);
				}
				break;
			}
			case 'LSAv': { // "share across pages" layer
				const v = layer.value;
				const linked = globals.sharedLayerDefinitions.get(v.id);
				if (linked) {
					const linkedLayer = linked.layer;
					hold.dataset['name'] = linked.layer.name;
					hold.dataset['type'] = 'layer-shared';
					if (linkedLayer.visibleInFrame(frame)) {
						renderElements(hold, globals, frame, linkedLayer.contentInFrame(frame).elements);
					}
				}
				break;
			}
			case 'LAYv': { // regular layer
				const v = layer.value;
				hold.dataset['name'] = v.name;
				hold.dataset['type'] = 'layer';
				if (v.visibleInFrame(frame)) {
					renderElements(hold, globals, frame, v.contentInFrame(frame).elements);
				}
			}
		}
	}
}

/**
 * @param {SVGElement} target
 * @param {ImageGlobals} globals
 * @param {number} frame
 * @param {ELMv} elements
 */
export function renderElements(target, globals, frame, elements) {
	for (let i = elements.length; (i--) > 0;) {
		renderElement(target, globals, frame, elements[i]);
	}
}

/**
 * @param {SVGElement} target
 * @param {ImageGlobals} globals
 * @param {number} frame
 * @param {ELMv[number]} element
 */
export function renderElement(target, globals, frame, element) {
	const hold = svgEl('g');
	/** @type {SVGElement} */ let curTarget = hold;
	target.append(hold);
	const v = element.value;
	if (v instanceof BaseElement) {
		if (v.name) {
			hold.dataset['name'] = v.name;
		}
		if (!v.visible) {
			// TODO: should we include hidden elements but mark them hidden for the export?
			return;
		}
		if (v.opacity < 1) {
			hold.setAttribute('opacity', v.opacity.toFixed(3));
		}
		const blend = v.blendMode?.value?.css;
		if (blend) {
			hold.style.mixBlendMode = blend;
		}
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
		//	return; // TODO
		//}
		// do not apply effects to pre-rasterised images (they are already applied)
		for (const effect of v.effectList?.effectPropertiess ?? []) {
			if (effect.data['EffectIsVisible'] !== 'false') {
				curTarget = applyEffect(target, curTarget, effect);
			}
		}
	}
	const path = element.value.getNodePath();
	if (path) {
		curTarget.addEventListener('click', (e) => {
			e.stopPropagation();
			document.location.href = `#${encodeURIComponent(path)}`;
		});
	}
	RENDERERS.get(element.type)?.(curTarget, globals, frame, v);
}

/** @type {Map<string, (target: SVGElement, globals: ImageGlobals, frame: number, value: any) => void>} */
const RENDERERS = new Map();

RENDERERS.set('IMGv', (target, globals, _frame, /** @type {IMGv} */ imgv) => {
	imgv.cachedDataURL ??= rasterToDataURL(globals, imgv);
	target.append(svgEl('image', {
		href: imgv.cachedDataURL,
		x: imgv.x,
		y: imgv.y,
		width: imgv.width,
		height: imgv.height,
	}));
});
RENDERERS.set('PTHv', (target, globals, _frame, /** @type {PTHv} */ pthv) => {
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
			stroke.setAttribute('mask', `url(#${encodeURIComponent(makeTextureMask(target, globals, pthv.pattern.textureBrush.mask, pthv.textureOffset))})`);
		}
	}
	if (pthv.pattern.fillColour.a > 0) {
		fill = svgEl('path', {
			d,
			'fill-rule': pthv.evenOddFillRule ? 'evenodd' : undefined,
		});
		applyFill(target, globals, fill, pthv);
	}
	if (fill && stroke) {
		if (pthv.fillOnTop) {
			target.append(stroke, fill);
		} else {
			target.append(fill, stroke);
		}
	} else if (fill) {
		target.append(fill);
	} else if (stroke) {
		target.append(stroke);
	}
});
RENDERERS.set('TXTv', (target, globals, frame, /** @type {TXTv} */ txtv) => {
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
	const text = svgEl('text', {
		'paint-order': txtv.fillOnTop ? 'stroke' : undefined,
	});
	if (txtv.pattern.brushPropertyList?.diameter) {
    // TODO: this is an approximation of the stroke, as it does not use the chosen brush
    // also it is applied before transforming, but Fireworks applies it AFTER any transform
		text.setAttribute('stroke', txtv.pattern.brushColour.toCSS());
		text.setAttribute('stroke-width', String(txtv.pattern.brushPropertyList.diameter / approxScale));
	}
	if (txtv.autoEnlarge) {
		if (txtv.leftAnchor !== undefined) {
			text.setAttribute('x', String(txtv.leftAnchor));
		} else {
			switch (txtv.formattedString[0]?.justification) {
				case 0:
					text.setAttribute('x', String(txtv.left));
					break;
				case 1:
					text.setAttribute('x', String((txtv.left + txtv.right) * 0.5));
					break;
				case 2:
					text.setAttribute('x', String(txtv.right));
					break;
			}
		}
		text.setAttribute('y', String(txtv.top + line1MaxFont - 1));
		text.style.whiteSpace = 'pre';
	} else {
		switch (txtv.formattedString[0]?.justification) {
			case 0:
				text.setAttribute('x', String(txtv.left));
				break;
			case 1:
				text.setAttribute('x', String((txtv.left + txtv.right) * 0.5));
				break;
			case 2:
				text.setAttribute('x', String(txtv.right));
				break;
			case 3:
				text.setAttribute('x', String(txtv.left));
				text.setAttribute('textLength', String(txtv.right - txtv.left));
				break;
		}
		// TODO: what should this y position be? This works in some cases but not all
		text.setAttribute('y', String(txtv.top + line1MaxFont * 2 - line1MaxLineHeight - 1));
		// TODO: this does not work; probably need to do upfront line wrapping
		text.style.width = `${txtv.right - txtv.left}px`;
		text.style.whiteSpace = 'pre-wrap';
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
		text.append(tspan);
	}
	// TODO: follow path, fit inside shape
	//if (txtv.flow === 2 && txtv.path) {
	//	txtv.path.path;
	//}
	if (txtv.transformMatrix) {
		text.style.transform = txtv.transformMatrix.toCSS();
	}
	target.append(text);
});
RENDERERS.set('GRPv', (target, globals, frame, /** @type {GRPv} */ grpv) => {
	if (grpv.type === 0) {
		if (grpv.smartShape) {
			target.dataset['type'] = 'smart-shape';
		} else {
			target.dataset['type'] = 'group';
		}
		renderElements(target, globals, frame, grpv.elements);
	} else {
		const maskID = crypto.randomUUID();
		const mask = svgEl('mask', {
			id: maskID,
			'mask-type': grpv.type === 1 ? undefined : 'alpha',
		});
		if (grpv.showMask) {
			renderElement(target, globals, frame, grpv.elements[0]);
		}
		/** @type {SVGElement} */ let maskTarget = mask;
		if (grpv.type === 1) {
			// fireworks uses black for opaque and white for transparent,
			// so we must invert the mask to match SVG's behaviour
			const invertID = crypto.randomUUID();
			maskTarget = svgEl('g', { filter: `url(#${encodeURIComponent(invertID)})` });
			target.append(svgEl('filter', {
				id: invertID,
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
			mask.append(maskTarget);
		}
		renderElement(maskTarget, globals, frame, grpv.elements[0]);
		const masked = svgEl('g', { mask: `url(#${encodeURIComponent(maskID)})` });
		renderElements(masked, globals, frame, grpv.elements.slice(1));
		target.append(mask, masked);
	}
});
RENDERERS.set('LSLv', (target, globals, frame, /** @type {LSLv} */ lslv) => {
	if (lslv.visibleInFrame(frame)) {
		target.dataset['name'] = lslv.name;
		target.dataset['type'] = 'sublayer';
		renderElements(target, globals, frame, lslv.contentInFrame(frame).elements);
	}
});
RENDERERS.set('URLv', (target, globals, frame, /** @type {URLv} */ urlv) => {
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
		case 0: // rect
			target.append(svgEl('rect', {
				...commonProps,
				x: urlv.left,
				y: urlv.top,
				width: urlv.right - urlv.left,
				height: urlv.bottom - urlv.top,
			}));
			if (label) {
				target.append(svgEl('text', {
					...commonTextProps,
					x: urlv.left + 2,
					y: urlv.bottom - 3,
					//textLength: urlv.right - urlv.left - 4,
					//lengthAdjust: 'spacingAndGlyphs',
				}, [label]));
			}
			break;
		case 1: // ellipse
			target.append(svgEl('ellipse', {
				...commonProps,
				cx: (urlv.left + urlv.right) / 2,
				cy: (urlv.top + urlv.bottom) / 2,
				rx: (urlv.right - urlv.left) / 2,
				ry: (urlv.bottom - urlv.top) / 2,
			}));
			if (label) {
				target.append(svgEl('text', {
					...commonTextProps,
					x: (urlv.left + urlv.right) / 2,
					y: (urlv.top + urlv.bottom) / 2 + 4,
					'text-anchor': 'middle',
				}, [label]));
			}
			break;
		case 2: // path
			if (urlv.path) {
				target.append(svgEl('path', {
					...commonProps,
					d: contourToSVG(urlv.path),
				}));
			}
			break;
	}
});
RENDERERS.set('ALSv', (target, globals, frame, /** @type {ALSv} */ alsv) => {
	// TODO: symbols
});

/**
 * @param {SVGElement} container
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
function applyFill(container, globals, target, {
	pattern,
	textureOffset,
	fillPoint1,
	fillPoint2,
	fillPoint3,
}) {
	const props = pattern.fillPatternProperties;
	if (!props) {
		return;
	}
	if (props.hardEdge) {
		target.setAttribute('shape-rendering', 'crispEdges');
	}
	// shift fill points 1px to match fireworks rendering
	const fp1 = { x: fillPoint1.x, y: fillPoint1.y + 1 };
	const fp2 = { x: fillPoint2.x, y: fillPoint2.y + 1 };
	const fp3 = { x: fillPoint3.x, y: fillPoint3.y + 1 };
	const grad = props.gradient;
	const gradID = crypto.randomUUID();
	switch (props.shape) {
		case 0: // solid
			target.setAttribute('fill', pattern.fillColour.toCSS());
			break;
		case 2: // linear
		case 12: // bars
			if (grad) {
				container.append(svgEl(
					'linearGradient', {
						id: gradID,
						gradientUnits: 'userSpaceOnUse',
						x1: fp1.x,
						y1: fp1.y,
						x2: fp2.x,
						y2: fp2.y,
						spreadMethod: props.shape === 12 ? 'reflect' : undefined,
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${position * 100}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 3: // radial
			if (grad) {
				container.append(svgEl(
					'radialGradient', {
						id: gradID,
						gradientUnits: 'userSpaceOnUse',
						cx: fp1.x,
						cy: fp1.y,
						r: Math.sqrt((fp2.x - fp1.x) ** 2 + (fp2.y - fp1.y) ** 2),
					},
					grad.rgba.map(({ position, colour }) => svgEl('stop', {
						offset: `${position * 100}%`,
						'stop-color': colour.toCSS(),
					})),
				));
				target.setAttribute('fill', `url(#${encodeURIComponent(gradID)})`);
			}
			break;
		case 4: // conical
			// TODO (not supported by SVG, but is supported by CSS - could use a foreignObject)
			break;
		case 9: // elliptical
		case 13: // ripple
			if (grad) {
				container.append(svgEl(
					'radialGradient', {
						id: gradID,
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
				target.setAttribute('fill', `url(#${encodeURIComponent(makePattern(container, globals, props.patternTile.image, fp1, fp2, fp3))})`);
			}
			break;
		case 16: { // web dither
			const patternID = crypto.randomUUID();
			const pattern = svgEl('pattern', {
				id: patternID,
				viewBox: '0 0 2 2',
				width: 2,
				height: 2,
				patternUnits: 'userSpaceOnUse',
			});
			pattern.append(
				svgEl('rect', { width: 1, height: 1, fill: props.ditherTransparent ? 'none' : props.ditherColour1.toCSS() }),
				svgEl('rect', { x: 1, width: 1, height: 1, fill: props.ditherColour2.toCSS() }),
				svgEl('rect', { y: 1, width: 1, height: 1, fill: props.ditherColour3.toCSS() }),
				svgEl('rect', { x: 1, y: 1, width: 1, height: 1, fill: props.ditherTransparent ? 'none' : props.ditherColour4.toCSS() }),
			);
			container.append(pattern);
			target.setAttribute('fill', `url(#${encodeURIComponent(patternID)})`);
			break;
		}
	}
	if (pattern.textureFill && props.textureBlend > 0) {
		// TODO: props.stampingMode
		target.setAttribute('mask', `url(#${encodeURIComponent(makeTextureMask(container, globals, pattern.textureFill.mask, textureOffset))})`);
	}
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
 * @param {SVGElement} target
 * @param {ImageGlobals} globals
 * @param {IMGv | MSKv} img
 * @param {{ x: number, y: number }} center
 * @param {{ x: number, y: number }} u
 * @param {{ x: number, y: number }} v
 */
function makePattern(
	target,
	globals,
	img,
	center = { x: 0, y: 0 },
	u = { x: center.x + img.width, y: center.y },
	v = { x: center.x, y: center.y - img.height },
) {
	const transform = makeTransformMatrix(img.width, img.height, center, u, v);

	const patternID = crypto.randomUUID();
	const pattern = svgEl('pattern', {
		id: patternID,
		viewBox: `0 0 ${img.width} ${img.height}`,
		width: img.width,
		height: img.height,
		patternUnits: 'userSpaceOnUse',
		patternTransform: transform,
	});
	img.cachedDataURL ??= rasterToDataURL(globals, img);
	// TODO: share common images (<use>) rather than creating multiple times
	pattern.append(svgEl('image', {
		href: img.cachedDataURL,
		width: img.width,
		height: img.height,
	}));
	target.append(pattern);
	return patternID;
}

/**
 * @param {SVGElement} target
 * @param {ImageGlobals} globals
 * @param {MSKv} img
 * @param {{ x: number, y: number }} offset
 */
function makeTextureMask(target, globals, img, offset = { x: 0, y: 0 }) {
	const patternID = makePattern(target, globals, img, offset);
	const maskID = crypto.randomUUID();
	const mask = svgEl('mask', { id: maskID });
	mask.append(svgEl('rect', {
		fill: `url(#${encodeURIComponent(patternID)})`,
		width: '100%',
		height: '100%',
	}));
	target.append(mask);
	return maskID;
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
				const mkbt = globals.mkbts.get(tile.value);
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
