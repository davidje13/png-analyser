#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { readPNG } from '../src/png.mjs';
import { printNice } from '../src/pretty.mjs';

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
  displayData(readPNG(data));
}

/**
 * @param {object} data
 * @param {string[]} data.warnings
 * @param {import('../src/chunks/registry.mjs').Chunk[]} data.chunks
 * @param {unknown} data.state
 */
function displayData({ warnings, chunks, state }) {
  for (const { name, type, data, advance, write, display, ...parsed } of chunks) {
    if (filterOut.includes(name)) {
      continue;
    }
    if (filterIn.length && !filterIn.includes(name)) {
      continue;
    }
    process.stdout.write(`${name} [${data.byteLength}]: `);
    if (write) {
      process.stdout.write(write());
    } else {
      process.stdout.write(printNice(parsed));
    }
    process.stdout.write('\n');
  }

  for (const warning of warnings) {
    process.stdout.write(`WARN: ${warning}\n`);
  }
}
