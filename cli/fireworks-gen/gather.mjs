#!/usr/bin/env node

import { hash } from 'node:crypto';
import { basename, join } from 'node:path';
import { readFile, rename } from 'node:fs/promises';
import { isPNG, readPNG } from '../../src/image/png/png.mjs';
import { recurFiles } from './common.mjs';

const [indir, outdir] = process.argv.slice(2);

if (!indir || !outdir) {
	process.stderr.write('usage: ./gather.mjs in-dir/ out-dir/\n');
	process.exit(1);
}

const seenHashes = new Set();

for await (const path of recurFiles(outdir)) {
	if (path.toLowerCase().endsWith('.png')) {
		seenHashes.add(hash('sha256', await readFile(path), { outputEncoding: 'hex' }));
	}
}

for await (const path of recurFiles(indir)) {
	if (!path.toLowerCase().endsWith('.png')) {
		continue;
	}
	const input = await readFile(path);
	const sha = hash('sha256', input, { outputEncoding: 'hex' });
	if (seenHashes.has(sha)) {
		continue;
	}
	seenHashes.add(sha);

	if (!isPNG(input)) {
		process.stderr.write(`skipping ${path}: not a PNG\n`);
		continue;
	}
	try {
		const png = await readPNG(input);
		if (!png.chunks.some((c) => c.name === 'mkBS')) {
			process.stderr.write(`skipping ${path}: not a Fireworks PNG\n`);
			continue;
		}
		const name = basename(path).replace(/\.png$/i, '');
		await rename(path, join(outdir, `${sha.substring(0, 8)}.${name}.png`));
	} catch (err) {
		process.stderr.write(`skipping ${path}: error while reading: ${err}\n`);
	}
}
