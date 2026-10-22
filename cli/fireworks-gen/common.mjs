import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { findChunk, isPNG, readPNG } from '../../src/image/png/png.mjs';
import { makeID } from '../../src/image/png/chunks/private/fireworks/node-info.mjs';

/** @typedef {import('../../src/image/png/chunks/ancillary/shared_text.mjs').textChunk} textChunk */
/** @typedef {import('../../src/image/png/chunks/private/fireworks/mkTS.mjs').mkTSChunk} mkTSChunk */
/** @typedef {import('../../src/image/png/chunks/private/fireworks/mkBS.mjs').mkBSChunk} mkBSChunk */
/** @typedef {import('../../src/image/png/chunks/private/fireworks/tokeniser.mjs').NodeToken} NodeToken */

export const ORDERED_VERSIONS = [
	'Macromedia Fireworks 4.0',
	'Macromedia Fireworks MX',
	'Macromedia Fireworks MX 2004',
	'Macromedia Fireworks MX 2005',
	'Macromedia Fireworks 8',
	'Adobe Fireworks',
	'Adobe Fireworks 9',
	'Adobe Fireworks CS3',
	'Adobe Fireworks CS4',
	'Adobe Fireworks CS5',
	'Adobe Fireworks CS5.1',
	'Adobe Fireworks CS6',
];

/** @param {string[]} inputs */
export async function processFiles(inputs) {
	/** @type {string[]} */ const filteredPaths = [];
	/** @type {Map<string, Observed>} */ const nodes = new Map();
	/** @type {Set<string>} */ const allSoftware = new Set();

	for await (const path of allInputFiles(inputs)) {
		if (!path.toLowerCase().endsWith('.png')) {
			continue;
		}
		const input = await readFile(path);
		if (!isPNG(input)) {
			process.stderr.write(`skipping ${path}: not a PNG\n`);
			continue;
		}
		const png = await readPNG(input);
		/** @type {mkTSChunk | undefined} */ const mkts = findChunk(png, 'mkTS');
		/** @type {mkBSChunk | undefined} */ const mkbs = findChunk(png, 'mkBS');
		if (!mkts && !mkbs) {
			process.stderr.write(`skipping ${path}: not a Fireworks PNG\n`);
			continue;
		}

		process.stderr.write(`analysing ${path}...\n`);
		filteredPaths.push(path);

		const software = findChunk(png, 'tEXt', (/** @type {textChunk} */ c) => c.keyword === 'Software')?.value;
		if (!software) {
			process.stderr.write(`software version missing in ${path}\n`);
		} else if (!ORDERED_VERSIONS.includes(software)) {
			process.stderr.write(`software version unknown in ${path}: ${software}\n`);
		}
		if (software) {
			allSoftware.add(software);
		}
		if (mkbs?.raw) {
			analyseNodes(software, '', mkbs.raw, nodes);
		}
		if (mkts?.raw) {
			analyseNodes(software, path, mkts.raw, nodes);
		}
	}

	return { paths: filteredPaths, nodes, allSoftware };
}

/**
 * @param {string[]} inputs
 */
export async function* allInputFiles(inputs) {
	for (const input of inputs) {
		const st = await stat(input);
		if (st.isDirectory()) {
			yield* recurFiles(input);
		} else if (st.isFile()) {
			yield input;
		}
	}
}

/**
 * @param {string} dir
 * @return {AsyncGenerator<string>}
 */
export async function* recurFiles(dir) {
	for (const sub of await readdir(dir, { encoding: 'utf-8', withFileTypes: true })) {
		if (sub.isDirectory()) {
			yield* recurFiles(join(dir, sub.name));
		} else if (sub.isFile()) {
			yield join(dir, sub.name);
		}
	}
}

/**
 * @typedef {{
 *   id: string;
 *   parents: Set<string>;
 *   software: Set<string>;
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
 * @param {string | undefined} software
 * @param {string} fileID
 * @param {NodeToken} base
 * @param {Map<string, Observed>} output
 * @param {NodeToken[]} path
 * @return {Observed}
 */
function analyseNodes(software, fileID, base, output, path = []) {
	const fullPath = [...path, base];
	const id = makeID(fullPath);
	/** @type {Map<string, number>} */ const curChildren = new Map();
	if (base.type === 'v') {
		for (const c of base.value) {
			const sub = analyseNodes(software, fileID, c, output, fullPath);
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
				software: new Set(),
			};
		} else {
			node = /** @type {Observed} */ ({
				id,
				type: base.type,
				parents: new Set(),
				values: new Map(),
				software: new Set(),
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
	} else if (base.id === 'DCEv' && node.type === base.type) {
		const v = getDCEStringValue(base);
		if (v !== null) {
			node.values ??= new Map();
			accum(node.values, v, fileID);
		}
	}
	if (software) {
		node.software.add(software);
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
	if (!item) {
		return;
	}
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
		if (c.id === 'DCVs') {
			return c.value;
		}
	}
	return null;
}
