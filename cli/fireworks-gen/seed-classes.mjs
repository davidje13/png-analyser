#!/usr/bin/env node

import { createWriteStream } from 'node:fs';
import { NODE_INFO } from '../../src/image/png/chunks/private/fireworks/node-info.mjs';
import { processFiles } from './common.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @typedef {import('../../src/image/png/chunks/private/fireworks/node-info.mjs').NodeInfo} NodeInfo */
/** @typedef {import('./common.mjs').Observed} Observed */

const basedir = dirname(fileURLToPath(import.meta.url));
const { nodes } = await processFiles(process.argv.slice(2));

for (const [id, info] of nodes) {
	if (!/^[a-zA-Z0-9]+v$/.test(id)) {
		continue;
	}
	const extraInfo = NODE_INFO.get(id);

	/** @type {Map<string, Set<string>>} */ const imports = new Map();
	let definition = '';
	let isList = false;
	if (info.children?.size) {
		// crude heuristic to detect nodes which are actually lists
		let numMulti = 0;
		let allZero = true;
		for (const { min, max } of info.children.values()) {
			if (min > 0) {
				allZero = false;
			}
			if (max > 1) {
				++numMulti;
			}
		}
		if (info.children.size === 1) {
			isList = numMulti > 0;
		} else {
			isList = allZero && numMulti >= 2;
		}
	}
	if (info.children && isList) {
		imports.set('./base/CoreNode.mjs', new Set(['ListNode']));
		for (const [subID] of info.children ?? []) {
			if (/^[a-zA-Z0-9]+v$/.test(subID)) {
				imports.set(`./${subID}.mjs`, new Set([subID]));
			}
		}
		const items = [...info.children.keys()].map((subID) => {
			const plainID = simplifyID(subID);
			return subID === plainID && subID.endsWith('v') ? subID : `${plainID}: ${typeFor(plainID)}`;
		});
		definition = `export class ${id} extends ListNode({ ${items.join(', ')} }) {}`;
	} else {
		const coreImports = new Set(['MapNode']);
		imports.set('./base/CoreNode.mjs', coreImports);
		for (const [subID] of info.children ?? []) {
			if (/^[a-zA-Z0-9]+v$/.test(subID) && subID !== id) {
				imports.set(`./${subID}.mjs`, new Set([subID]));
			}
		}
		definition = `export class ${id} extends MapNode {\n`;
		for (const [subID, { min, max }] of info.children ?? []) {
			const plainID = simplifyID(subID);
			const subExtraInfo = NODE_INFO.get(subID);
			let propName = plainID;
			if (subExtraInfo?.name) {
				propName = subExtraInfo.name
					.replaceAll('**', '')
					.toLowerCase()
					.replaceAll(/[^a-zA-Z0-9]+(.|$)/g, (_, v) => v.toUpperCase());
			}
			if (/^[0-9]/.test(propName)) {
				propName = `v${propName}`;
			}
			const p2 = plainID.endsWith('v') ? `, ${subID}` : '';
			if (max > 1) {
				propName += 's';
				if (min) {
					definition += `\t${propName} = this.oneOrMore('${plainID}'${p2});\n`;
				} else {
					definition += `\t${propName} = this.zeroOrMore('${plainID}'${p2});\n`;
				}
			} else if (min) {
				definition += `\t${propName} = this.required('${plainID}'${p2});\n`;
			} else {
				definition += `\t${propName} = this.optional('${plainID}'${p2});\n`;
			}
		}
		definition += `}`;
	}

	const target = createWriteStream(join(basedir, '..', '..', 'src', 'image', 'png', 'chunks', 'private', 'fireworks', 'nodes', `${id}.mjs`));
	if (imports.size) {
		for (const [p, values] of [...imports].sort(importOrder)) {
			target.write(`import { ${[...values].sort().join(', ')} } from '${p}';\n`);
		}
		target.write('\n');
	}
	if (extraInfo?.name) {
		target.write(`/** ${extraInfo.name.replaceAll('**', '')} */\n`);
	}
	target.write(definition);
	target.write('\n');
	target.close();
}

/**
 * @param {string} id
 */
function typeFor(id) {
	if (id.endsWith('i') || id.endsWith('f')) {
		return 'Number';
	} else if (id.endsWith('b')) {
		return 'Boolean';
	} else if (id.endsWith('s')) {
		return 'String';
	} else {
		return id;
	}
}

/**
 * @param {string} id
 */
function simplifyID(id) {
	const parts = id.split('.');
	for (let i = parts.length; (i--) > 0; ) {
		if (parts[i].includes('"')) {
			continue;
		}
		return parts[i];
	}
	return 'unknown';
}

/**
 * @param {[string, unknown]} a
 * @param {[string, unknown]} b
 * @return {number}
 */
function importOrder([a], [b]) {
	const nA = a.split('/').length;
	const nB = b.split('/').length;
	return (nB - nA) || (a < b ? -1 : 1);
}
