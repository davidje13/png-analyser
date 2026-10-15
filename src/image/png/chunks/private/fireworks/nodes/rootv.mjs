import { MapNode } from './base/CoreNode.mjs';
import { MKBv } from './MKBv.mjs';
import { PDCv } from './PDCv.mjs';

export class rootv extends MapNode {
	document = this.required('MKBv', MKBv);
	pages = this.zeroOrMore('PDCv', PDCv);
	/** @type {import('./globals.mjs').ImageGlobals} */ globals;

	/**
	 * @param {ReadonlyArray<import('../tokeniser.mjs').NodeToken>} value
	 * @param {Map<number, import('../mkBT.mjs').mkBTChunk>} mkbts
	 */
	constructor(value, mkbts) {
		super(value);
		this.globals = {
			sharedLayerDefinitions: new Map(),
			symbolDefinitions: new Map(),
			pages: new Map(),
			mkbts,
		};
		for (const v of this.document.crossPageLayerDefinitions) {
			this.globals.sharedLayerDefinitions.set(v.id, v);
		}
		for (const v of this.document.symbolDefinitions) {
			this.globals.symbolDefinitions.set(v.id, v);
		}
		for (const v of this.pages) {
			if (v.id) {
				this.globals.pages.set(v.id, v);
			}
		}
	}

	get allPages() {
		return this.pages.length ? this.pages : this.document ? [this.document] : [];
	}
}
