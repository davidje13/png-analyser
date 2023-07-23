#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { readPNG } from '../src/image/png/png.mjs';
import { writePNG } from '../src/image/png/png-write.mjs';

const data = readFileSync(process.stdin.fd);
const png = readPNG(data);
for (const warning of png.warnings) {
  process.stderr.write(`WARN: ${warning}\n`);
}
const image = png.state.idat?.image;
if (!image) {
  process.stderr.write('Failed to read PNG\n');
  process.exit(1);
}
const recodedBuf = writePNG(image).toBytes();
process.stderr.write(`Input:  ${data.byteLength}\nOutput: ${recodedBuf.byteLength}\n`);
process.stdout.write(recodedBuf);
