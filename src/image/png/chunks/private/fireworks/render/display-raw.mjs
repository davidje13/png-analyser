/** @typedef {import('../tokeniser.mjs').NodeToken} NodeToken */

import { disclosure, el } from '../../../../../../display/pretty.mjs';
import { makeID, NODE_INFO } from '../node-info.mjs';

/**
 * @param {HTMLElement} target
 * @param {NodeToken} node
 * @param {string | null} nameOverride
 * @param {NodeToken[]} path
 */
export function displayRawStructure(target, node, nameOverride = null, path = []) {
	const fullPath = [...path, node];
	let li = target;
	if (!nameOverride) {
		li = el('li');
		target.append(li);
	}
	if (node.id === 'DCEv') {
		try {
			li.append(printDCE(node, ''));
			return;
		} catch (e) {
			console.warn(e);
		}
	}

	/** @type {(HTMLElement | string)[]} */
	let name = [el('strong', {}, [nameOverride ?? node.id])];
	const info = NODE_INFO.get(makeID(fullPath));
	if (info?.name) {
		name.push(` ${info.name.replaceAll('**', '')}`);
	}

	/** @type {string} */ let v;
	switch (node.type) {
		case 'b':
			v = node.value ? 'true' : 'false';
			break;
		case 'i':
			if (info?.values?.has(node.value)) {
				v = `${node.value.toString(10)} [${info.values.get(node.value)}]`;
			} else if (node.value >= 0x80000000) {
				v = `0x${node.value.toString(16).padStart(8, '0')} / ${node.value.toString(10)} / ${(node.value >> 0).toString(10)}`;
			} else if (node.value >= 10) {
				v = `0x${node.value.toString(16).padStart(8, '0')} / ${node.value.toString(10)}`;
			} else {
				v = node.value.toString(10);
			}
			break;
		case 'f':
			v = FLOAT_FORMAT.format(node.value);
			break;
		case 's':
			v = JSON.stringify(node.value);
			break;
		case 'v':
			if (node.value.length) {
				const ul = el('ul', { id: node.path });
				const det = disclosure(name, ul);
				for (const sub of node.value) {
					displayRawStructure(ul, sub, null, fullPath);
				}
				li.append(det);
				return;
			}
			v = '[]';
			break;
	}
	if (node.path) {
		li.setAttribute('id', node.path);
	}
	li.append(...name, ': ', v);
}

const FLOAT_FORMAT = new Intl.NumberFormat(undefined, { minimumFractionDigits: 1, useGrouping: false });

/**
 * @param {NodeToken & { type: 'v' }} node
 * @param {string} indent
 * @return {string}
 */
function printDCE(node, indent) {
	/** @type {string | null} */ let key = null;
	/** @type {NodeToken | null} */ let value = null;
	for (const c of node.value) {
		if (c.id === 'DCKs') {
			if (key === null) {
				key = c.value;
			} else {
				throw new Error('Non-standard DCEv node: multiple DCKs');
			}
		} else if (value === null || (typeof value === 'string' && c.id === 'GVRv')) {
			value = c;
		} else if (value.id !== 'GVRv' || c.id !== 'DCVs') {
			throw new Error('Non-standard DCEv node: multiple values');
		}
	}
	/** @type {string} */ let v;
	if (value === null) {
		v = '(no value)';
	} else if (value.id === 'DCVs') {
		v = JSON.stringify(value.value);
	} else if (value.id === 'GDTv') {
		v = printGDT(value, indent);
	} else if (value.id === 'GPLv') {
		const items = [];
		for (const sub of value.value) {
			if (sub.id !== 'GPTv') {
				items.push(`(unknown item type: ${sub.id})`);
				continue;
			}
			const item = toSimpleMap(sub);
			if (item.size !== 2 || !item.has('XLCf') || !item.has('YLCf')) {
				items.push('(unknown item shape)');
			}
			items.push(`{ "x": ${item.get('XLCf')}, "y": ${item.get('YLCf')} }`);
		}
		v = `[${items.join(', ')}]`;
	} else if (value.id === 'GVRv') {
		const items = [];
		const subIndent = indent + '  ';
		for (const sub of value.value) {
			if (sub.id !== 'GDTv') {
				items.push(`(unknown item type: ${sub.id})`);
				continue;
			}
			items.push(printGDT(sub, subIndent));
		}
		v = `[${items.map((v) => `\n${subIndent}${v}`).join(',')}\n${indent}]`;
	} else {
		v = `(unknown type: ${value.id})`;
	}
	return `${indent}${JSON.stringify(key)}: ${v},`;
}

/**
 * @param {NodeToken & { type: 'v' }} node
 * @param {string} indent
 * @return {string}
 */
function printGDT(node, indent) {
	const subIndent = indent + '  ';
	const items = [];
	for (const sub of node.value) {
		if (sub.id === 'DCEv') {
			items.push(printDCE(sub, subIndent));
		} else {
			items.push(`${subIndent}(unknown item type: ${sub.id}),`);
		}
	}
	return items.length > 0 ? `{\n${items.join('\n')}\n${indent}}` : '{}';
}

/**
 * @param {NodeToken & { type: 'v' }} node
 */
function toSimpleMap(node) {
	const r = new Map();
	for (const c of node.value) {
		if (r.has(c.id)) {
			throw new Error('Node is not a simple map: duplicate entry');
		}
		r.set(c.id, c.value);
	}
	return r;
}

/**
 * @param {NodeToken} node
 * @param {string} path
 */
export function populatePaths(node, path) {
	node.path = path;
	if (node.type === 'v' && node.value.length) {
		const counters = new Map();
		for (const sub of node.value) {
			const count = (counters.get(sub.id) ?? 0) + 1;
			counters.set(sub.id, count);
			let subPath = `${path}.${sub.id}`;
			if (count > 1) {
				subPath += `-${count}`;
			}
			populatePaths(sub, subPath);
		}
	}
}
