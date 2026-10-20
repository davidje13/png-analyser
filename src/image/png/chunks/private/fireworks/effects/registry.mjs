/**
 * @typedef {{
 *   nextID: () => string,
 *   addDef: (o: SVGElement | ((id: string) => SVGElement), ref?: string) => string;
 * }} ImageGlobals
 */

import { EPSv } from '../nodes/EPSv.mjs';
import { str } from './readers.mjs';

/**
 * @param {ImageGlobals} globals
 * @param {SVGElement} contents
 * @param {EPSv} epsv
 * @return {SVGElement}
 */
export function internalApplyEffect(globals, contents, epsv) {
	const effect = KNOWN_EFFECTS.get(str(epsv.data['EffectMoaID']) ?? '')
	return effect?.apply(globals, contents, epsv.data) ?? contents;
}

/**
 * @typedef {import('../nodes/DCEv.mjs').CustomData} CustomData
 * @typedef {{ readonly [k: string]: CustomData }} Data
 *
 * @typedef {{
 *   name: string,
 *   apply: (globals: ImageGlobals, contents: SVGElement, data: Data) => SVGElement,
 * }} EffectMeta
 */

/** @type {Map<string, EffectMeta>} */ const KNOWN_EFFECTS = new Map();

/**
 * @param {string} id
 * @param {EffectMeta} meta
 */
export function registerEffect(id, meta) {
	KNOWN_EFFECTS.set(id, meta);
}
