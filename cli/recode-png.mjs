#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readPNG } from '../src/image/png/png.mjs';
import { writePNG } from '../src/image/png/png-write.mjs';

let totalCount = 0;
let sumOut = 0;
let largerCount = 0;
/** @type {Map<string, number>} */ const filterPickers = new Map();
/** @type {Map<string, number>} */ const zlibConfigs = new Map();
/** @type {Map<number, number>} */ const attemptNumbers = new Map();
/** @type {Map<string, number>} */ const encodingPossible = new Map();
/** @type {Map<string, number>} */ const encodingChosen = new Map();

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    await recodeRecur(process.argv[i]);
  }
  process.stderr.write('Totals:\n');
  process.stderr.write(`  files:             ${align(totalCount)}\n`);
  process.stderr.write(`  larger than input: ${align(largerCount)} (${((largerCount * 100) / totalCount).toFixed(1)}%)\n`);
  process.stderr.write(`  output bytes:      ${align(sumOut)}\n`);
  printRatioDist('encoding', encodingChosen, encodingPossible);
  printDist('filter pickers', filterPickers);
  printDist('zlib configurations', zlibConfigs);
  printAttemptsDist('best attempts', attemptNumbers);
} else {
  try {
    const result = await recode(process.stdin.fd, process.stdout.fd);
    process.stderr.write(`Input:  ${align(result.input.byteLength)}\n`);
    process.stderr.write(`Output: ${align(result.output.data.byteLength)}\n`);
    process.stderr.write(`Best encoding: ${result.output.encoding}, filter picker: ${result.output.filterPicker}, zlib configuration: ${result.output.zlibConfig}\n`);
    process.stderr.write(`Attempts: ${result.output.totalAttempts} (found best on attempt ${result.output.attemptNumber})\n`);
    process.stderr.write(`IDAT cache misses: ${result.output.idatCacheMisses}\n`);
  } catch (e) {
    process.stderr.write(`Failed to recode PNG: ${e}\n`);
    process.exit(1);
  }
}

/**
 * @param {string} path
 */
async function recodeRecur(path) {
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path)) {
      await recodeRecur(join(path, f));
    }
  } else if (path.endsWith('.png') && !path.endsWith('.recoded.png')) {
    const pathOut = path.replace(/\.png$/, '.recoded.png');
    process.stderr.write(`recoding: ${path} to ${pathOut}\n`);
    try {
      const result = await recode(path, pathOut);
      process.stderr.write(`- in: ${result.input.byteLength}, out: ${result.output.data.byteLength}, encoding: ${result.output.encoding}, filter picker: ${result.output.filterPicker}, zlib configuration: ${result.output.zlibConfig}, cache misses: ${result.output.idatCacheMisses}\n`);
      ++totalCount;
      sumOut += result.output.data.byteLength;
      accumDist(filterPickers, result.output.filterPicker);
      accumDist(zlibConfigs, result.output.zlibConfig);
      accumDist(attemptNumbers, result.output.attemptNumber);
      accumDist(encodingChosen, result.output.encoding);
      result.output.availableEncodings.forEach((e) => accumDist(encodingPossible, e));
      if (result.output.data.byteLength > result.input.byteLength) {
        process.stderr.write(`! Failed to compress\n`);
        ++largerCount;
      }
    } catch (e) {
      process.stderr.write(`Failed to recode PNG: ${e}\n`);
    }
  }
}

/**
 * @param {import('node:fs').PathOrFileDescriptor} inFile
 * @param {import('node:fs').PathOrFileDescriptor} outFile
 */
async function recode(inFile, outFile) {
  const input = readFileSync(inFile);
  const png = await readPNG(input);
  for (const warning of png.warnings) {
    process.stderr.write(`WARN: ${warning}\n`);
  }
  const image = png.state.idat?.image;
  if (!image) {
    throw new Error('Failed to read PNG\n');
  }
  const output = writePNG(image, (m) => process.stderr.write(m), {
    preserveTransparentColour: false,
    compressionTimeAllotment: Number.POSITIVE_INFINITY,
  });
  writeFileSync(outFile, output.data.toBytes());
  return { input, output };
}

/**
 * @template {unknown} T
 * @param {string} label
 * @param {Map<T, number>} dist
 */
function printDist(label, dist) {
  process.stderr.write(`  ${label}:\n`);
  const maxLen = Math.max(...[...dist].map(([name]) => String(name).length));
  for (const [name, n] of [...dist].sort((a, b) => b[1] - a[1])) {
    process.stderr.write(`  - ${String(name).padEnd(maxLen, ' ')}: ${n.toString().padStart(5, ' ')} (${((n * 100) / totalCount).toFixed(1).padStart(4, ' ')}%)\n`);
  }
}

/**
 * @template {unknown} T
 * @param {string} label
 * @param {Map<T, number>} dist
 * @param {Map<T, number>} totals
 */
function printRatioDist(label, dist, totals) {
  process.stderr.write(`  ${label}:\n`);
  const values = [...totals.entries()].map(([id, n]) => ({ id, ratio: (dist.get(id) ?? 0) / n, overall: (dist.get(id) ?? 0) / totalCount }));
  const maxLen = Math.max(...values.map(({ id }) => String(id).length));
  for (const { id, ratio, overall } of values.sort((a, b) => b.ratio - a.ratio)) {
    process.stderr.write(`  - ${String(id).padEnd(maxLen, ' ')}: ${(ratio * 100).toFixed(1).padStart(5, ' ')}% (${(overall * 100).toFixed(1).padStart(5, ' ')}% of all)\n`);
  }
}

/**
 * @param {string} label
 * @param {Map<number, number>} dist
 */
function printAttemptsDist(label, dist) {
  process.stderr.write(`  ${label}:\n`);
  let sum = 0;
  const maxLen = Math.max(...[...dist].map(([name]) => String(name).length));
  for (const [name, n] of [...dist].sort((a, b) => a[0] > b[0] ? 1 : -1)) {
    sum += n;
    process.stderr.write(`  - ${String(name).padStart(maxLen, ' ')}: ${n.toString().padStart(5, ' ')} (${((n * 100) / totalCount).toFixed(1).padStart(4, ' ')}%) ${((sum * 100) / totalCount).toFixed(1).padStart(5, ' ')}%\n`);
  }
}

/**
 * @template {unknown} T
 * @param {Map<T, number>} dist
 * @param {T} id
 */
function accumDist(dist, id) {
  dist.set(id, (dist.get(id) ?? 0) + 1);
}

/**
 * @param {string | number} x
 */
function align(x) {
  return x.toString().padStart(10, ' ');
}
