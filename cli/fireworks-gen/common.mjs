import { readFileSync } from 'node:fs';
import { isPNG, readPNG } from '../../src/image/png/png.mjs';
import { makeID } from '../../src/image/png/chunks/private/fireworks/node-info.mjs';

/** @typedef {import('../../src/image/png/chunks/private/fireworks/mkTS.mjs').mkTSChunk} mkTSChunk */
/** @typedef {import('../../src/image/png/chunks/private/fireworks/mkBS.mjs').mkBSChunk} mkBSChunk */
/** @typedef {import('../../src/image/png/chunks/private/fireworks/tokeniser.mjs').NodeToken} NodeToken */

/** @param {string[]} paths */
export async function processFiles(paths) {
	/** @type {{ path: string, mkts: NodeToken, mkbs?: NodeToken }[]} */ const files = [];

	for (const path of paths) {
		const input = readFileSync(path);
		if (!isPNG(input)) {
			process.stderr.write(`skipping ${path}: not a PNG\n`);
			continue;
		}
		const png = await readPNG(input);
		//const software = png.chunks.find((c) => c.name === 'tEXt' && c.keyword === 'Software')?.value ?? 'unknown';
		/** @type {mkTSChunk | undefined} */ const mkts = png.chunks.find((c) => c.name === 'mkTS');
		/** @type {mkBSChunk | undefined} */ const mkbs = png.chunks.find((c) => c.name === 'mkBS');
		if (!mkts?.raw) {
			process.stderr.write(`skipping ${path}: not a Fireworks PNG\n`);
			continue;
		}
		files?.push({ path, mkts: mkts.raw, mkbs: mkbs?.raw });
	}

	/** @type {Map<string, Observed>} */ const nodes = new Map();
	// mkBS seems to be the same in every file, so just process it once
	const anyFile = files.values().next().value;
	if (anyFile?.mkbs) {
		analyseNodes('', anyFile.mkbs, nodes);
	}
	for (const file of files) {
		process.stderr.write(`analysing ${file.path}...\n`);
		analyseNodes(file.path, file.mkts, nodes);
	}

	return { paths: files.map((f) => f.path), nodes };
}

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
	} else if (base.id === 'DCEv' && node.type === base.type) {
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
