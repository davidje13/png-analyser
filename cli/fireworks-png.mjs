#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { isPNG, readPNG } from '../src/image/png/png.mjs';
import { makeID, NODE_INFO } from '../src/image/png/chunks/private/fireworks/tree/node_info.mjs';

const includeDebugFilePaths = Boolean(process.env['FILE_PATHS']);

/** @typedef {import('../src/image/png/chunks/private/fireworks/mkTS.mjs').mkTSChunk} mkTSChunk */
/** @typedef {import('../src/image/png/chunks/private/fireworks/mkBS.mjs').mkBSChunk} mkBSChunk */
/** @typedef {import('../src/image/png/chunks/private/fireworks/tree/tokeniser.mjs').NodeToken} NodeToken */
/** @typedef {import('../src/image/png/chunks/private/fireworks/tree/node_info.mjs').NodeInfo} NodeInfo */

/** @type {Map<string, { file: string, mkts: NodeToken }[]>} */ const files = new Map();

for (let i = 2; i < process.argv.length; ++i) {
	const file = process.argv[i];
	const input = readFileSync(file);
	if (!isPNG(input)) {
		process.stderr.write(`skipping ${file}: not a PNG\n`);
		continue;
	}
	const png = await readPNG(input);
	// @ts-ignore
	const software = 'any'; // png.chunks.find((c) => c.name === 'tEXt' && c.keyword === 'Software')?.value ?? 'unknown';
	/** @type {mkTSChunk | undefined} */ const mkts = png.chunks.find((c) => c.name === 'mkTS');
	if (!mkts?.raw) {
		process.stderr.write(`skipping ${file}: not a Fireworks PNG\n`);
		continue;
	}
	if (!files.has(software)) {
		files.set(software, []);
	}
	files.get(software)?.push({ file, mkts: mkts.raw });
}

for (const [software, items] of files) {
	process.stderr.write(`\n\nsoftware: ${software}:\n`);

	/** @type {Map<string, Observed>} */ const mktsNodes = new Map();
	for (const item of items) {
		process.stderr.write(`analysing ${item.file}...\n`);
		analyseNodes(item.file, item.mkts, mktsNodes);
	}

	process.stdout.write([
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
	printInfo(mktsNodes, items.map((f) => f.file), includeDebugFilePaths);
}
process.stdout.write('[`mkBT`]: ./Fireworks.md#mkbt\n');

/**
 * @typedef {{
 *   id: string;
 *   parents: Set<string>;
 * } & ({
 *   type: 'v';
 *   values?: Map<string, Set<string>> | undefined;
 *   children: Map<string, { min: number, max: number }>;
 * } | {
 *   type: 'i' | 'f';
 *   values: Map<number, Set<string>>;
 *   children?: never;
 * } | {
 *   type: 'b';
 *   values: Map<boolean, Set<string>>;
 *   children?: never;
 * } | {
 *   type: 's';
 *   values: Map<string, Set<string>>;
 *   children?: never;
 * })} Observed
 */

/**
 * @param {string} fileID
 * @param {NodeToken} base
 * @param {Map<string, Observed>} output
 * @param {NodeToken[]} path
 * @return {Observed}
 */
function analyseNodes(fileID, base, output, path = []) {
	const fullPath = [...path, base];
	const id = makeID(fullPath);
	/** @type {Map<string, number>} */ const curChildren = new Map();
	if (base.type === 'v') {
		for (const c of base.value) {
			const sub = analyseNodes(fileID, c, output, fullPath);
			curChildren.set(sub.id, (curChildren.get(sub.id) ?? 0) + 1);
			sub.parents.add(id);
		}
	}
	let node = output.get(id);
	if (!node) {
		if (base.type === 'v') {
			node = {
				id,
				type: base.type,
				parents: new Set(),
				children: new Map([...curChildren].map(([subID, c]) => [subID, { min: c, max: c }])),
			};
		} else {
			node = /** @type {Observed} */ ({
				id,
				type: base.type,
				parents: new Set(),
				values: new Map(),
			});
		}
		output.set(id, node);
	} else if (node.children) {
		for (const [subID, counts] of node.children) {
			if (!curChildren.has(subID)) {
				counts.min = 0;
			}
		}
		for (const [subID, c] of curChildren) {
			const sub = node.children.get(subID);
			if (!sub) {
				node.children.set(subID, { min: 0, max: c });
			} else {
				sub.min = Math.min(sub.min, c);
				sub.max = Math.max(sub.max, c);
			}
		}
	}
	if ((base.type === 'i' || base.type === 'f') && node.type === base.type) {
		accum(node.values, base.value, fileID);
	} else if (base.type === 's' && node.type === base.type) {
		accum(node.values, base.value, fileID);
	} else if (base.type === 'b' && node.type === base.type) {
		accum(node.values, base.value, fileID);
	} else if (base.name === 'DCE' && base.type === 'v' && node.type === base.type) {
		const v = getDCEStringValue(base);
		if (v !== null) {
			node.values ??= new Map();
			accum(node.values, v, fileID);
		}
	}
	return node;
}

/**
 * @template {number | string | boolean} K
 * @param {Map<K, Set<string>>} target
 * @param {K} key
 * @param {string} item
 */
function accum(target, key, item) {
	let l = target.get(key);
	if (!l) {
		l = new Set();
		target.set(key, l);
	}
	l.add(item);
}

/**
 * @param {NodeToken & { type: 'v' }} node
 */
function getDCEStringValue(node) {
	for (const c of node.value) {
		if (c.name === 'DCV' && c.type === 's') {
			return c.value;
		}
	}
	return null;
}

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
 * @param {Map<string, Observed>} nodes
 * @param {string[]} allFiles
 * @param {boolean} includeTODOFilePaths
 */
function printInfo(nodes, allFiles, includeTODOFilePaths) {
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
				printHeading(dcev, extraInfo?.name, 2);
				if (extraInfo?.description) {
					process.stdout.write(`${extraInfo.description}\n\n`);
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
		printHeading(id, extraInfo?.name, headingLevel);
		if (info.parents.size) {
			process.stdout.write(`Parent: ${[...info.parents].sort().map(idToLink).join(' / ')}\n\n`);
		}
		if (extraInfo?.description) {
			process.stdout.write(`${extraInfo.description}\n\n`);
		}
		if (extraInfo?.range === false) {
		} else if (typeof extraInfo?.range === 'string') {
			process.stdout.write(`Value range: ${extraInfo.range}\n\n`);
		} else if (info.values) {
			if (!extraInfo?.values && (info.values.size > 50 || extraInfo?.range) && (info.type === 'i' || info.type === 'f')) {
				const min = Math.min(...info.values.keys());
				const max = Math.max(...info.values.keys());
				if (info.type === 'i' && min >= 0) {
					process.stdout.write(`Observed value range: \`0x${min.toString(16).padStart(8, '0')}\`..\`0x${max.toString(16).padStart(8, '0')}\` (\`${min}\`..\`${max}\`)\n\n`);
				} else {
					process.stdout.write(`Observed value range: \`${min}\`..\`${max}\`\n\n`);
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
				process.stdout.write(`Observed value range: \`${min}\`..\`${max}\`\n\n`);
				if (remaining.length > 0) {
					process.stdout.write(`Also observed non-numeric values:\n\n`);
					printObservedValues(remaining, info.values, extraInfo, allFiles, includeTODOFilePaths);
					process.stdout.write('\n');
				}
			} else {
				process.stdout.write('Values:\n\n');
				/** @type {Map<string | number | boolean, Set<string>>} */ const observed = info.values;
				const allValues = new Set(observed.keys());
				if (extraInfo?.values) {
					for (const k of extraInfo.values.keys()) {
						allValues.add(k);
					}
				}
				printObservedValues([...allValues], info.values, extraInfo, allFiles, includeTODOFilePaths);
				process.stdout.write('\n');
			}
		}
		if (info.children?.size) {
			process.stdout.write('Contains:\n\n');
			printChildren(info);
			process.stdout.write('\n');
		} else if (info.type === 'v') {
			process.stdout.write('No observed child nodes.\n\n');
		}
	}
	for (const id of NODE_INFO.keys()) {
		if (!seenNodes.has(id)) {
			process.stderr.write(`Did not see node: ${id}\n`);
		}
	}
}

/**
 * @param {string} id
 * @param {string | undefined} name
 * @param {number} level
 */
function printHeading(id, name, level) {
	let fullHeading = formatID(id);
	if (name) {
		fullHeading += ` ${name}`;
	}
	const headingAnchor = fullHeading.replaceAll('*', '')
		.replaceAll(/[^a-zA-Z0-9]+/g, ' ')
		.trim()
		.replaceAll(' ', '-')
		.toLowerCase();
	process.stdout.write(`${'#'.repeat(level)} ${fullHeading}\n\n`);
	process.stdout.write(`${idToLink(id)}: #${headingAnchor}\n\n`);
}

/**
 * @param {Observed & { type: 'v' }} info
 */
function printChildren(info) {
	for (const [subID, c] of info.children) {
		process.stdout.write(`- ${idToLink(subID)}`);
		if (c.min === 1 && c.max === 1) {
			// exactly one (no annotation)
		} else if (c.min === 0 && c.max === 1) {
			process.stdout.write('?');
		} else if (c.min === c.max) {
			process.stdout.write(` (x${c.min})`);
		} else if (c.min === 0) {
			process.stdout.write('\\*');
		} else if (c.min === 2) {
			process.stdout.write(' (x2 +)');
		} else {
			process.stdout.write('+');
		}
		const subExtraInfo = NODE_INFO.get(subID);
		if (subExtraInfo?.name) {
			process.stdout.write(` ${subExtraInfo.name.replaceAll('*', '')}`);
		}
		process.stdout.write('\n');
	}
}

/**
 * @param {(string | number | boolean)[]} allValues
 * @param {Map<string | number | boolean, Set<string>>} observedValues
 * @param {NodeInfo | undefined} extraInfo
 * @param {string[]} allFiles
 * @param {boolean} includeTODOFilePaths
 */
function printObservedValues(allValues, observedValues, extraInfo, allFiles, includeTODOFilePaths) {
	for (const v of allValues.sort(byHuman)) {
		const details = extraInfo?.values?.get(v);
		if (details !== undefined) {
			process.stdout.write(`- \`${v}\`: ${details}\n`);
		} else if (extraInfo?.noValueDetails) {
			process.stdout.write(`- \`${v}\`\n`);
		} else {
			const files = observedValues.get(v);
			if (files?.size === allFiles.length) {
				process.stdout.write(`- \`${v}\`: unknown - TODO - observed in all files\n`);
			} else if (!includeTODOFilePaths || !files?.size) {
				process.stdout.write(`- \`${v}\`: unknown - TODO\n`);
			} else if (files.size > allFiles.length / 2) {
				process.stdout.write(`- \`${v}\`: unknown - TODO - observed in all files EXCEPT ${allFiles.filter((f) => !files.has(f)).join(' / ')}\n`);
			} else {
				process.stdout.write(`- \`${v}\`: unknown - TODO - observed in ${[...files].join(' / ')}\n`);
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
		.map((v) => v.startsWith('"') ? `"\`${v.substring(1, v.length - 1)}\`"` : `\`${v}\``)
		.join('.')
		.replace('`."`', '` "`');
}
