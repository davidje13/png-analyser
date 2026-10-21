import { GPLv } from './GPLv.mjs';

/** @typedef {import('./base/CoreNode.mjs').NodeToken} NodeToken */

/** @typedef {string | GPLv | { readonly [k: string]: CustomData }[] | { readonly [k: string]: CustomData }} CustomData */

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
	if (node.value.length < 2) {
		console.warn(`DCEv with too few child nodes: ${node.value.length}`);
		return null;
	}
	/** @type {string | undefined} */ let key = undefined;
	/** @type {CustomData | undefined} */ let value = undefined;
	let isArray = false;
	for (const sub of node.value) {
		if (sub.id === 'DCKs') {
			if (key !== undefined) {
				console.warn('Multiple keys in DCEv');
				return null;
			}
			key = sub.value;
		} else {
			if (value !== undefined) {
				if (sub.id === 'GVRv' && typeof value === 'string') {
					// this is permitted; GVRv has a sibling "flattened" string value
				} else if (sub.id === 'DCVs' && isArray) {
					// this is permitted; GVRv has a sibling "flattened" string value
					continue;
				} else {
					console.warn('Multiple values in DCEv');
					return null;
				}
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
				case 'GVRv':
					isArray = true;
					value = sub.value.map((v) => {
						if (v.id !== 'GDTv') {
							console.warn('Unexpected non-GDTv in GVRv');
							return null;
						}
						return Object.fromEntries(v.value.map(DCEv).filter((v) => v !== null));
					}).filter((v) => v !== null);
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
