#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readPNG } from '../src/image/png/png.mjs';
import { writePNG } from '../src/image/png/png-write.mjs';

let totalCount = 0;
let sumOut = 0;
let largerCount = 0;
/** @type {Map<string, number>} */ const filterPickers = new Map();
/** @type {Map<number, number>} */ const zlibLevels = new Map();
/** @type {Map<number, number>} */ const attemptNumbers = new Map();

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    recodeRecur(process.argv[i]);
  }
  process.stderr.write('Totals:\n');
  process.stderr.write(`  files:             ${align(totalCount)}\n`);
  process.stderr.write(`  larger than input: ${align(largerCount)} (${((largerCount * 100) / totalCount).toFixed(1)}%)\n`);
  process.stderr.write(`  output bytes:      ${align(sumOut)}\n`);
  printDist('filter pickers', filterPickers);
  printDist('zlib levels', zlibLevels);
  printDist('best attempts', attemptNumbers, true);
} else {
  try {
    const result = recode(process.stdin.fd, process.stdout.fd);
    process.stderr.write(`Input:  ${align(result.input.byteLength)}\n`);
    process.stderr.write(`Output: ${align(result.output.data.byteLength)}\n`);
    process.stderr.write(`Best filter picker: ${result.output.filterPicker}, zlib level: ${result.output.zlibLevel}\n`);
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
function recodeRecur(path) {
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path)) {
      recodeRecur(join(path, f));
    }
  } else if (path.endsWith('.png') && !path.endsWith('.recoded.png')) {
    const pathOut = path.replace(/\.png$/, '.recoded.png');
    process.stderr.write(`recoding: ${path} to ${pathOut}\n`);
    try {
      const result = recode(path, pathOut);
      process.stderr.write(`- in: ${result.input.byteLength}, out: ${result.output.data.byteLength}, cache misses: ${result.output.idatCacheMisses}\n`);
      ++totalCount;
      sumOut += result.output.data.byteLength;
      accumDist(filterPickers, result.output.filterPicker);
      accumDist(zlibLevels, result.output.zlibLevel);
      accumDist(attemptNumbers, result.output.attemptNumber);
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
function recode(inFile, outFile) {
  const input = readFileSync(inFile);
  const png = readPNG(input);
  for (const warning of png.warnings) {
    process.stderr.write(`WARN: ${warning}\n`);
  }
  const image = png.state.idat?.image;
  if (!image) {
    throw new Error('Failed to read PNG\n');
  }
  const output = writePNG(image, { preserveTransparentColour: false, compressionTimeAllotment: Number.POSITIVE_INFINITY });
  writeFileSync(outFile, output.data.toBytes());
  return { input, output };
}

/**
 * @template {unknown} T
 * @param {string} label
 * @param {Map<T, number>} dist
 * @param {boolean=} sortByValue
 */
function printDist(label, dist, sortByValue = false) {
  process.stderr.write(`  ${label}:\n`);
  for (const [name, n] of [...dist.entries()].sort(sortByValue ? ((a, b) => a[0] > b[0] ? 1 : -1) : ((a, b) => b[1] - a[1]))) {
    process.stderr.write(`  - ${String(name).padEnd(12, ' ')}: ${n.toString().padStart(5, ' ')} (${((n * 100) / totalCount).toFixed(1)}%)\n`);
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
