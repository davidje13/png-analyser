#!/usr/bin/env node

import { readFileSync } from 'fs';
import { readPNG } from './src/png.mjs';

const filterIn = [];
const filterOut = [];
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

function displayData({ warnings, chunks, state }) {
  for (const { name, type, data, advance, write, ...parsed } of chunks) {
    if (filterOut.includes(name)) {
      continue;
    }
    if (filterIn.length && !filterIn.includes(name)) {
      continue;
    }
    process.stdout.write(`${name} [${data.length}]: `);
    if (write) {
      process.stdout.write(write(printNice));
    } else {
      process.stdout.write(printNice(parsed));
    }
    process.stdout.write('\n');
  }

  for (const warning of warnings) {
    process.stdout.write(`WARN: ${warning}\n`);
  }
}

function printNice(v) {
  return JSON.stringify(v, niceBuffer, 2);
}

function niceBuffer(k, v) {
  if (typeof v === 'object' && v.type === 'Buffer') {
    let r = [];
    for (const b of v.data) {
      r.push(b.toString(16).padStart(2, '0'));
    }
    return `[${v.data.length}] ${r.join(' ')}`;
  }
  return v;
}
