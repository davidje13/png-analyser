/** @typedef {import('./tokeniser.mjs').NodeToken} NodeToken */

import { disclosure } from '../../../../../../display/pretty.mjs';
import { makeID, NODE_INFO } from './node_info.mjs';

/**
 * @param {HTMLElement} target
 * @param {NodeToken} node
 * @param {string} id
 * @param {string | null} nameOverride
 * @param {NodeToken[]} path
 */
export function displayRawStructure(target, node, id, nameOverride = null, path = []) {
	const fullPath = [...path, node];
	let li = target;
	if (!nameOverride) {
		li = document.createElement('li');
		li.setAttribute('id', id);
		target.append(li);
	}
	if (node.id === 'DCEv') {
		try {
			li.append(printDCE(node, ''));
			return;
		} catch {}
	}

	const boldName = document.createElement('strong');
	boldName.textContent = nameOverride ?? node.id;
	/** @type {(HTMLElement | string)[]} */ let name = [boldName];
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
      if (node.value >= 0x80000000) {
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
				const ul = document.createElement('ul');
				const det = disclosure(name, ul);
				const counters = new Map();
				for (const sub of node.value) {
					const count = counters.get(sub.id) ?? 0;
					counters.set(sub.id, count + 1);
					let subID = `${id}.${sub.id}`;
					if (count > 1) {
						subID += `-${count}`;
					}
					displayRawStructure(ul, sub, subID, null, fullPath);
				}
				li.append(det);
				return;
			}
			v = '[]';
			break;
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
			if (key !== null) {
				throw new Error('Non-standard DCEv node: multiple DCKs');
			}
			key = c.value;
		} else {
			if (value !== null) {
				throw new Error('Non-standard DCEv node: multiple values');
			}
			value = c;
		}
	}
	if (key === null || value === null) {
		throw new Error('Non-standard DCEv node: missing DCKs or value');
	}
	/** @type {string} */ let v;
	if (value.id === 'DCVs') {
		v = JSON.stringify(value.value);
	} else if (value.id === 'GDTv') {
		const subIndent = indent + '  ';
		const items = [];
		for (const sub of value.value) {
			if (sub.id !== 'DCEv') {
				throw new Error('Non-standard GDTv node: contains non-DCEv value');
			}
			items.push(printDCE(sub, subIndent));
		}
		v = items.length > 0 ? `{\n${items.join('\n')}\n${indent}}` : '{}';
	} else if (value.id === 'GPLv') {
		const items = [];
		for (const sub of value.value) {
			if (sub.id !== 'GPTv') {
				throw new Error('Non-standard GPLv node: contains non-GPTv value');
			}
			const item = toSimpleMap(sub);
			if (item.size !== 2 || !item.has('XLCf') || !item.has('YLCf')) {
				throw new Error('Non-standard GPTv node: unexpected shape');
			}
			items.push(`{ "x": ${item.get('XLCf')}, "y": ${item.get('YLCf')} }`);
		}
		v = `[${items.join(', ')}]`;
	} else {
		throw new Error('Non-standard DCEv node: unknown value type');
	}
	return `${indent}${JSON.stringify(key)}: ${v},`;
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
