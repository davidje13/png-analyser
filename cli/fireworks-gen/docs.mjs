#!/usr/bin/env node

/*
 * This script regenerates docs/FireworksNodes.md from an input set of sample
 * PNG images, which are analysed to identify the possible node structures
 * and values. It combines this with manually-entered data from:
 * src/image/png/chunks/private/fireworks/node-info.mjs
 */

import { Writable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { NODE_INFO } from '../../src/image/png/chunks/private/fireworks/node-info.mjs';
import { ORDERED_VERSIONS, processFiles } from './common.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @typedef {import('../../src/image/png/chunks/private/fireworks/node-info.mjs').NodeInfo} NodeInfo */
/** @typedef {import('./common.mjs').Observed} Observed */

const basedir = dirname(fileURLToPath(import.meta.url));
const includeDebugFilePaths = Boolean(process.env['FILE_PATHS']);
const { paths, nodes } = await processFiles(process.argv.slice(2));

const target = createWriteStream(join(basedir, '..', '..', 'docs', 'FireworksNodes.md'));
target.write([
	'# Fireworks Node Types',
	'',
	'See [Fireworks.md](./Fireworks.md) for an introduction to the data',
	'structure used here.',
	'',
	'Children of vector nodes are shown here with a suffix to indicate the',
	'number of times they may appear: `*` means 0 or more; `+` means 1 or more;',
	'`?` means 0 or 1 (i.e. optional); `(x2)` means exactly 2 (etc.); `(x2 +)`',
	'means 2 or more. No suffix means it has always been observed to appear',
	'exactly once.',
].join('\n') + '\n\n');
printInfo(target, nodes, paths, includeDebugFilePaths);
target.write('[`mkBT`]: ./Fireworks.md#mkbt\n');
target.close();

/**
 * @param {[string, unknown]} a
 * @param {[string, unknown]} b
 */
function byKey(a, b) {
	return a[0] === 'rootv' ? -1 : b[0] === 'rootv' ? 1 : (a[0] > b[0]) ? 1 : -1;
}

/**
 * @param {string | number | boolean} a
 * @param {string | number | boolean} b
 */
function byHuman(a, b) {
	if (typeof a === 'string' && typeof b === 'string') {
		const va = Number.parseFloat(a);
		const vb = Number.parseFloat(b);
		if (!Number.isNaN(va) && !Number.isNaN(vb) && va !== vb) {
			return va - vb;
		}
	}
	return a < b ? -1 : 1;
}

/**
 * @param {Writable} target
 * @param {Map<string, Observed>} nodes
 * @param {string[]} allFiles
 * @param {boolean} includeTODOFilePaths
 */
function printInfo(target, nodes, allFiles, includeTODOFilePaths) {
	const sortedNodes = [...nodes].sort(byKey);
	const seenNodes = new Set();
	let hasDCEv = false;
	for (const [id, info] of sortedNodes) {
		let headingLevel = 2
		if (id.startsWith('DCEv.')) {
			if (!hasDCEv) {
				const dcev = 'DCEv';
				seenNodes.add(dcev);
				const extraInfo = NODE_INFO.get(dcev);
				if (!extraInfo) {
					process.stderr.write(`Node with no info: ${dcev}\n`);
				}
				printHeading(target, dcev, extraInfo?.name, 2);
				if (extraInfo?.description) {
					target.write(`${extraInfo.description}\n\n`);
				}
				hasDCEv = true;
			}
			headingLevel = 3;
		}
		const extraInfo = NODE_INFO.get(id);
		seenNodes.add(id);
		if (!extraInfo) {
			process.stderr.write(`Node with no info: ${id}\n`);
		}
		printHeading(target, id, extraInfo?.name, headingLevel);
		if (id === 'DCKs' || id === 'DCVs' || id === 'GDTv') {
			target.write('Parent: [`DCEv`]\n\n'); // avoid useless large list for this node
		} else if (info.parents.size && !id.startsWith('DCEV.')) {
			target.write(`Parent: ${[...info.parents].sort().map(idToLink).join(' / ')}\n\n`);
		}
		if (!id.startsWith('DCEv.')) {
			const versions = [...info.software].map((v) => ORDERED_VERSIONS.indexOf(v));
			const minVersion = Math.min(...versions);
			const maxVersion = Math.max(...versions);
			if (minVersion > 0 || maxVersion < ORDERED_VERSIONS.length - 1) {
				if (minVersion === maxVersion) {
					target.write(`Observed in version: ${ORDERED_VERSIONS[minVersion] ?? 'unknown'}\n\n`);
				} else {
					target.write(`Observed in versions: ${ORDERED_VERSIONS[minVersion] ?? 'unknown'} - ${ORDERED_VERSIONS[maxVersion]}\n\n`);
				}
			}
		}
		if (extraInfo?.description) {
			target.write(`${extraInfo.description}\n\n`);
		}
		if (extraInfo?.range === false) {
		} else if (typeof extraInfo?.range === 'string') {
			target.write(`Value range: ${extraInfo.range}\n\n`);
		} else if (info.values) {
			if (!extraInfo?.values && (
				info.type === 'f' ||
				(info.type === 'i' && (info.values.size > 50 || extraInfo?.range))
			)) {
				const min = Math.min(...info.values.keys());
				const max = Math.max(...info.values.keys());
				if (info.type === 'i' && min >= 0) {
					target.write(`Observed value range: \`0x${min.toString(16).padStart(8, '0')}\`..\`0x${max.toString(16).padStart(8, '0')}\` (\`${min}\`..\`${max}\`)\n\n`);
				} else {
					target.write(`Observed value range: \`${min}\`..\`${max}\`\n\n`);
				}
			} else if (extraInfo?.range && info.type === 'v') {
				/** @type {number[]} */ const nums = [];
				/** @type {string[]} */ const remaining = [];
				for (const k of info.values.keys()) {
					const v = /^\s*\-?(\d+(\.\d*)?|\.\d+)([eE][+\-]?\d+)?\s*$/.test(k) ? Number.parseFloat(k) : null;
					if (v === null || Number.isNaN(v)) {
						remaining.push(k);
					} else {
						nums.push(v);
					}
				}
				const min = Math.min(...nums);
				const max = Math.max(...nums);
				target.write(`Observed value range: \`${min}\`..\`${max}\`\n\n`);
				if (remaining.length > 0) {
					target.write(`Also observed non-numeric values:\n\n`);
					printObservedValues(target, remaining, info.values, extraInfo, allFiles, includeTODOFilePaths);
					target.write('\n');
				}
			} else {
				target.write('Values:\n\n');
				/** @type {Map<string | number | boolean, Set<string>>} */ const observed = info.values;
				const allValues = new Set(observed.keys());
				if (extraInfo?.values) {
					for (const k of extraInfo.values.keys()) {
						allValues.add(k);
					}
				}
				printObservedValues(target, [...allValues], info.values, extraInfo, allFiles, includeTODOFilePaths);
				target.write('\n');
			}
		}
		if (id.startsWith('DCEv.') && info.children) {
			const dataTypes = new Set(info.children.keys());
			dataTypes.delete('DCKs');
			if (dataTypes.has('GVRv')) {
				target.write(`Data Type: ${idToLink('GVRv')}\n\n`);
			} else {
				target.write(`Data Type: ${[...dataTypes].sort().map((id) => idToLink(id)).join(' / ')}\n\n`);
			}
		} else if (info.children?.size) {
			target.write('Contains:\n\n');
			printChildren(target, info);
			target.write('\n');
		} else if (info.type === 'v') {
			target.write('No observed child nodes.\n\n');
		}
	}
	for (const id of NODE_INFO.keys()) {
		if (!seenNodes.has(id)) {
			process.stderr.write(`Did not see node: ${id}\n`);
		}
	}
}

/**
 * @param {Writable} target
 * @param {string} id
 * @param {string | undefined} name
 * @param {number} level
 */
function printHeading(target, id, name, level) {
	let fullHeading = formatID(id);
	if (name) {
		fullHeading += ` ${name}`;
	}
	// match "github-style" heading IDs
	const headingAnchor = fullHeading.replaceAll('*', '')
		.toLowerCase()
		.replaceAll(/[^\p{L}\p{N}_\- ]+/gu, '')
		.trim()
		.replaceAll(' ', '-');
	target.write(`${'#'.repeat(level)} ${fullHeading}\n\n`);
	target.write(`${idToLink(id)}: #${headingAnchor}\n\n`);
}

/**
 * @param {Writable} target
 * @param {Observed & { type: 'v' }} info
 */
function printChildren(target, info) {
	for (const [subID, c] of [...info.children].sort(childOrder)) {
		target.write(`- ${idToLink(subID)}`);
		if (c.min === 1 && c.max === 1) {
			// exactly one (no annotation)
		} else if (c.min === 0 && c.max === 1) {
			target.write('?');
		} else if (c.min === c.max) {
			target.write(` (x${c.min})`);
		} else if (c.min === 0) {
			target.write('\\*');
		} else if (c.min === 2) {
			target.write(' (x2 +)');
		} else {
			target.write('+');
		}
		const subExtraInfo = NODE_INFO.get(subID);
		if (subExtraInfo?.name) {
			target.write(` ${subExtraInfo.name.replaceAll('*', '')}`);
		}
		target.write('\n');
	}
}

/**
 * @param {[string, { min: number }]} a
 * @param {[string, { min: number }]} b
 */
function childOrder(a, b) {
	const az = !a[1].min;
	const bz = !b[1].min;
	if (az !== bz) {
		return az ? 1 : -1;
	}
	return a[0] > b[0] ? 1 : -1;
}

/**
 * @param {Writable} target
 * @param {(string | number | boolean)[]} allValues
 * @param {Map<string | number | boolean, Set<string>>} observedValues
 * @param {NodeInfo | undefined} extraInfo
 * @param {string[]} allFiles
 * @param {boolean} includeTODOFilePaths
 */
function printObservedValues(target, allValues, observedValues, extraInfo, allFiles, includeTODOFilePaths) {
	for (const v of allValues.sort(byHuman)) {
		const details = extraInfo?.values?.get(v);
		if (details !== undefined) {
			target.write(`- \`${v}\`: ${details}\n`);
		} else if (extraInfo?.noValueDetails) {
			target.write(`- \`${v}\`\n`);
		} else {
			const files = observedValues.get(v);
			if (files?.size === allFiles.length) {
				target.write(`- \`${v}\`: unknown - TODO - observed in all files\n`);
			} else if (!includeTODOFilePaths || !files?.size) {
				target.write(`- \`${v}\`: unknown - TODO\n`);
			} else if (files.size > allFiles.length / 2) {
				target.write(`- \`${v}\`: unknown - TODO - observed in all files EXCEPT ${allFiles.filter((f) => !files.has(f)).join(' / ')}\n`);
			} else {
				target.write(`- \`${v}\`: unknown - TODO - observed in ${[...files].join(' / ')}\n`);
			}
		}
	}
}

/**
 * @param {string} id
 */
function idToLink(id) {
	return `[${formatID(id)}]`;
}

/**
 * @param {string} id
 */
function formatID(id) {
	if (id === 'rootv') {
		return 'Root';
	}
	return id
		.split('.')
		.map((v) => v === '0' ? '\\[\\]' : v.startsWith('"') ? `"\`${v.substring(1, v.length - 1)}\`"` : `\`${v}\``)
		.join('.')
		.replaceAll('`."`', '` "`')
		.replaceAll('.\\[\\]', '\\[\\]');
}
