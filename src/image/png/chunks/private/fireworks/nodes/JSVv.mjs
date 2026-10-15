import { SimpleList } from './base/CoreNode.mjs';

/** JavaScript Script */
export class JSVv {
	/** @type {string} */ script;

	/** @param {import('../tokeniser.mjs').NodeToken[]} value */
	constructor(value) {
		this.script = new InnerJSVv(value).join('');
	}
}

const InnerJSVv = SimpleList('JSSs');
