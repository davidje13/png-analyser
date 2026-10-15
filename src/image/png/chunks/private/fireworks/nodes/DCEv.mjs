import { GPLv } from './GPLv.mjs';

/** @typedef {import('./base/CoreNode.mjs').NodeToken} NodeToken */

/** @typedef {string | GPLv | { readonly [k: string]: CustomData }} CustomData */

export class CustomDataNode {
	/** @type {{ readonly [k: string]: CustomData }} */ data;

	/** @param {NodeToken[]} value */
	constructor(value) {
		this.data = Object.fromEntries(value.map(DCEv).filter((v) => v !== null));
	}
}

/**
 * @param {NodeToken} node
 * @return {[string, CustomData] | null}
 */
function DCEv(node) {
	if (node.id !== 'DCEv') {
		console.warn(`Unexpected non-DCEv node in data structure: ${node.id}`);
		return null;
	}
	if (node.value.length !== 2) {
		console.warn(`DCEv with unexpected number of child nodes: ${node.value.length}`);
		return null;
	}
	/** @type {string | undefined} */ let key = undefined;
	/** @type {CustomData | undefined} */ let value = undefined;
	for (const sub of node.value) {
		if (sub.id === 'DCKs') {
			if (key !== undefined) {
				console.warn('Multiple keys in DCEv');
				return null;
			}
			key = sub.value;
		} else {
			if (value !== undefined) {
				console.warn('Multiple values in DCEv');
				return null;
			}
			switch (sub.id) {
				case 'DCVs':
					value = sub.value;
					break;
				case 'GDTv':
					value = Object.fromEntries(sub.value.map(DCEv).filter((v) => v !== null));
					break;
				case 'GPLv':
					value = new GPLv(sub.value);
					break;
			}
		}
	}
	if (key === undefined) {
		console.warn('No key in DCEv');
		return null;
	}
	if (value === undefined) {
		console.warn('No value in DCEv');
		return null;
	}
	return [key, value];
}
