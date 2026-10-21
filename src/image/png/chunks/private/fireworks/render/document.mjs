import { el, svgEl } from '../../../../../../display/pretty.mjs';
import { BaseAnimatedCanvas, MSTv } from '../nodes/MSTv.mjs';
import { PDCv } from '../nodes/PDCv.mjs';
import { rootv } from '../nodes/rootv.mjs';
import { renderLayer } from './element.mjs';

/** @typedef {import('./globals.mjs').ImageGlobals} ImageGlobals */

/**
 * @param {rootv} root
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderAllPages(root, baseFilename = 'image') {
	const hold = el('div');
	let symbolNum = 1;
	for (const symbol of root.document.symbolDefinitions) {
		hold.append(renderSymbol(root, symbol, `${baseFilename}-${symbol.name ?? `symbol${symbolNum}`}`));
		++symbolNum;
	}
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

const BUTTON_STATES = ['up', 'over', 'down', 'hit'];

/**
 * @param {rootv} root
 * @param {MSTv} symbol
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderSymbol(root, symbol, baseFilename = 'image') {
	const hold = el('div', {}, [internalLink('Symbol', symbol.getNodePath()), ':']);
	if (symbol.id) {
		hold.append(' ', internalLink(JSON.stringify(symbol.id), symbol.getChildNodePath('MSNi')));
	}
	if (symbol.name) {
		hold.append(' ', internalLink(JSON.stringify(symbol.name), symbol.getChildNodePath('UNMs')));
	}
	switch (symbol.type) {
		case 0:
			hold.append(' ', internalLink('<graphic>', symbol.getChildNodePath('MSYi')));
			break;
		case 1:
			hold.append(' ', internalLink('<button>', symbol.getChildNodePath('MSYi')));
			break;
		case 2:
			hold.append(' ', internalLink('<animation>', symbol.getChildNodePath('MSYi')));
			break;
	}
	if (symbol.lastUpdateTime) {
		hold.append(' last updated: ', internalLink(symbol.lastUpdateTime, symbol.getChildNodePath('LUTs')));
	}

	const frames = el('div', { class: 'horizontal' });
	hold.append(frames);
	for (let frame = 0; frame < symbol.frameCount; ++frame) {
		let frameFilename = baseFilename;
		let frameName = `Frame ${frame + 1}`;
		if (symbol.type === 1 && BUTTON_STATES[frame]) {
			frameFilename += `-${BUTTON_STATES[frame]}`;
			frameName = BUTTON_STATES[frame];
		} else if (symbol.frameCount > 1) {
			frameFilename += `-frame${frame + 1}`;
		}
		const bounds = symbol.nineSliceGuide?.nineSliceGuideShapeBounds;
		const width = bounds?.width ?? root.document.width;
		const height = bounds?.height ?? root.document.height;
		const svg = renderFrame(root, symbol, frame, {
			width,
			height,
			left: bounds?.left ?? width * -0.5,
			top: bounds?.top ?? height * -0.5,
			scale: 1,
		});

		frames.append(el('div', {}, [
			frameName,
			':',
			el('div', { class: 'image-canvas' }, [svg]),
			downloadSVGButton(svg, frameFilename),
		]));
	}
	return hold;
}

/**
 * @param {rootv} root
 * @param {PDCv} page
 * @param {string=} baseFilename
 * @return {HTMLElement}
 */
export function renderAllFramesInPage(root, page, baseFilename = 'image') {
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
	const left = page.viewX;
	const top = page.viewY;
	const width = page.width;
	const height = page.height;
	const scale = page.scaleAt72DPI;
	hold.append(
		el('br'),
		internalLink(width, page.getChildNodePath('WIDf')),
		' x ',
		internalLink(height, page.getChildNodePath('HITf')),
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
		const frameTarget = el('div');
		const frameInfo = page.exportOptions?.frameConfigurationList[frame];
		frameTarget.append(internalLink(`Frame ${frame + 1}`, frameInfo?.getNodePath()), ':');
		if (frameInfo) {
			if (frameInfo?.name) {
				frameTarget.append(
					' ',
					internalLink(JSON.stringify(frameInfo.name), frameInfo.getChildNodePath('OBNs')),
				);
			}
			frameTarget.append(
				' ',
				internalLink(frameInfo.duration.toFixed(2), frameInfo.getChildNodePath('FNDi')),
				's',
			);
		}

		const svg = renderFrame(root, page, frame, { width, height, left, top, scale });
		frameTarget.append(
			el('div', { class: 'image-canvas' }, [svg]),
			downloadSVGButton(svg, frameFilename),
		);
		frames.append(frameTarget);
	}
	return hold;
}

let globalID = 0;

/**
 * @param {rootv} root
 * @param {BaseAnimatedCanvas} canvas
 * @param {number} frame
 * @param {{
 *   width: number;
 *   height: number;
 *   left?: number;
 *   top?: number;
 *   scale?: number;
 * }} env
 * @return {SVGSVGElement}
 */
export function renderFrame(root, canvas, frame, { width, height, left = 0, top = 0, scale = 1 }) {
	const defs = svgEl('defs');
	const svg = svgEl('svg', {
		xmlns: 'http://www.w3.org/2000/svg',
		viewBox: `${left} ${top} ${width} ${height}`,
		width: width * scale,
		height: height * scale,
		fill: 'none',
		'stroke-linejoin': 'round',
		'stroke-linecap': 'round',
		'color-interpolation-filters': 'sRGB',
	}, [defs]);
	if (canvas.backgroundColour.a > 0) {
		svg.append(svgEl('rect', {
			x: left,
			y: top,
			width: width,
			height: height,
			fill: canvas.backgroundColour.toCSS(),
		}));
	}
	const selfID = globalID++; // avoid ID conflicts between images on the same page (e.g. multiple frames, pages, files)
	let idInc = 0;
	const nextID = () => `${selfID}-${idInc++}`;
	/** @type {Map<string, string>} */ const refs = new Map();
	/** @type {ImageGlobals} */ const imageGlobals = {
		root,
		frame,
		svg,
		left,
		top,
		width,
		height,
		nextID,
		addDef: (o, ref) => {
			const existing = ref && refs.get(ref);
			if (existing) {
				return existing;
			}
			const id = nextID();
			if (ref) {
				refs.set(ref, id);
			}
			if (typeof o === 'function') {
				defs.append(o(id));
			} else {
				o.setAttribute('id', id);
				defs.append(o);
			}
			return id;
		},
	};
	for (const layer of canvas.layerList) {
		svg.append(renderLayer(imageGlobals, layer) ?? '');
	}
	return svg;
}

/**
 * @param {SVGSVGElement} svg
 * @param {string} filename
 */
function downloadSVGButton(svg, filename) {
	const button = el('button', { type: 'button' }, ['Save as SVG']);
	button.addEventListener('click', () => {
		const source = '<?xml version="1.0" standalone="yes"?>' + svg.outerHTML;
		el('a', {
			href: `data:image/svg+xml;base64,${btoa(source)}`,
			download: filename.replaceAll(/[^a-zA-Z0-9._]+/g, '-') + '.svg',
		}).click();
	});
	return button;
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
