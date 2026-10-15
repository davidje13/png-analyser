import { MapNode } from './base/CoreNode.mjs';
import { LSEv } from './LSEv.mjs';
import { MKBv } from './MKBv.mjs';
import { MSTv } from './MSTv.mjs';
import { PDCv } from './PDCv.mjs';

export class rootv extends MapNode {
	document = this.required('MKBv', MKBv);
	pages = this.zeroOrMore('PDCv', PDCv);

	/** @type {Map<string, LSEv>} */ #layerLookup = new Map();
	/** @type {Map<number, MSTv>} */ #symbolLookup = new Map();
	/** @type {Map<string, PDCv>} */ #pageLookup = new Map();
	/** @type {Map<number, import('../mkBT.mjs').mkBTChunk>} */ #mkbts;

	/**
	 * @param {ReadonlyArray<import('../tokeniser.mjs').NodeToken>} value
	 * @param {Map<number, import('../mkBT.mjs').mkBTChunk>} mkbts
	 */
	constructor(value, mkbts) {
		super(value);
		this.#mkbts = mkbts;
		for (const v of this.document.crossPageLayerDefinitions) {
			this.#layerLookup.set(v.id, v);
		}
		for (const v of this.document.symbolDefinitions) {
			this.#symbolLookup.set(v.id, v);
		}
		for (const v of this.pages) {
			if (v.id) {
				this.#pageLookup.set(v.id, v);
			}
		}
	}

	get allPages() {
		return this.pages.length ? this.pages : this.document ? [this.document] : [];
	}

	/** @param {string} id */
	getPage(id) {
		return this.#pageLookup.get(id);
	}

	/** @param {string} id */
	getSharedLayer(id) {
		return this.#layerLookup.get(id);
	}

	/** @param {number} id */
	getSymbol(id) {
		return this.#symbolLookup.get(id);
	}

	/** @param {number} id */
	getTile(id) {
		return this.#mkbts.get(id);
	}
}
