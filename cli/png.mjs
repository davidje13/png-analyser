#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { readPNG } from '../src/image/png/png.mjs';

/** @type {string[]} */ const filterIn = [];
/** @type {string[]} */ const filterOut = [];
const paths = [];
for (let i = 2; i < process.argv.length; ++i) {
  const arg = process.argv[i];
  if (arg[0] === '+') {
    filterIn.push(arg.substring(1));
  } else if(arg[0] === '-') {
    filterOut.push(arg.substring(1));
  } else {
    paths.push(arg);
  }
}

for (const path of paths) {
  process.stdout.write(`--- ${path}\n`);
  const data = readFileSync(path);
  displayData(await readPNG(data));
}

/**
 * @param {object} data
 * @param {string[]} data.warnings
 * @param {import('../src/image/png/chunks/registry.mjs').Chunk[]} data.chunks
 * @param {unknown} data.state
 */
function displayData({ warnings, chunks, state }) {
  /** @type {Set<string>} */ const seen = new Set();
  for (const chunk of chunks) {
    if (filterOut.includes(chunk.name)) {
      continue;
    }
    if (filterIn.length && !filterIn.includes(chunk.name)) {
      continue;
    }
    if (chunk.aggregate) {
      if (!seen.has(chunk.name)) {
        seen.add(chunk.name);
        process.stdout.write(`${chunk.name} [${chunk.data.byteLength}]: ${chunk.aggregate()}\n`);
      }
    } else {
      process.stdout.write(`${chunk.name} [${chunk.data.byteLength}]: ${chunk}\n`);
    }
  }

  for (const warning of warnings) {
    process.stdout.write(`WARN: ${warning}\n`);
  }
}
