#!/usr/bin/env node

import { readFileSync } from 'fs';
import { readPNG } from './src/png.mjs';

const filterChunk = process.argv[2].length === 4 ? process.argv[2] : null;

for (let i = filterChunk ? 3 : 2; i < process.argv.length; ++i) {
  const path = process.argv[i];
  process.stdout.write(`--- ${path}\n`);
  const data = readFileSync(process.argv[i]);
  displayData(readPNG(data));
}

function displayData({ warnings, chunks }) {
  for (const { name, type, data, advance, write, ...parsed } of chunks) {
    if (filterChunk && name !== filterChunk) {
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
    console.log(`WARN: ${warning}`);
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
