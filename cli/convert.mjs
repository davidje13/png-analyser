#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { readPNG, isPNG } from '../src/image/png/png.mjs';
import { readANI, isANI } from '../src/image/ani/ani.mjs';
import { writeANI } from '../src/image/ani/ani-write.mjs';
import { writePNG } from '../src/image/png/png-write.mjs';
import { readBMP, writeBMP, isBMP } from '../src/image/bmp/bmp.mjs';
import { readICO, isICO } from '../src/image/ico/ico.mjs';
import { writeICO } from '../src/image/ico/ico-write.mjs';

/** @type {number[][][]} */ const images = [];
/** @type {import('node:fs').PathOrFileDescriptor} */ let outFile = process.stdout.fd;
/** @type {string[]} */ const flags = [];
process.stderr.write(`Reading input images\n`);
for (let i = 2; i < process.argv.length; ++i) {
  const p = process.argv[i];
  if (p === '--output') {
    outFile = process.argv[i + 1];
    ++i;
  } else if (p.startsWith('--')) {
    flags.push(p);
  } else {
    images.push(...readImage(p === '-' ? process.stdin.fd : p));
  }
}

process.stderr.write(`Found ${images.length} image${images.length === 1 ? '' : 's'}\n`);
if (!images.length) {
  process.exit(1);
}
let format = images.length > 1 ? 'ico' : 'png';
if (flags.includes('--png')) {
  format = 'png';
} else if (flags.includes('--bmp')) {
  format = 'bmp';
} else if (flags.includes('--ico')) {
  format = 'ico';
} else if (flags.includes('--cur')) {
  format = 'cur';
} else if (flags.includes('--ani')) {
  format = 'ani';
} else if (typeof outFile === 'string' && outFile.endsWith('.png')) {
  format = 'png';
} else if (typeof outFile === 'string' && outFile.endsWith('.bmp')) {
  format = 'bmp';
} else if (typeof outFile === 'string' && outFile.endsWith('.ico')) {
  format = 'ico';
} else if (typeof outFile === 'string' && outFile.endsWith('.cur')) {
  format = 'cur';
} else if (typeof outFile === 'string' && outFile.endsWith('.ani')) {
  format = 'ani';
}

process.stderr.write(`Writing converted image(s)\n`);
/** @type {Uint8Array[]} */ const results = [];
switch (format) {
  case 'png':
    for (const image of images) {
      const output = writePNG(image, { preserveTransparentColour: false, compressionTimeAllotment: Number.POSITIVE_INFINITY });
      results.push(output.data.toBytes());
    }
    break;
  case 'bmp':
    for (const image of images) {
      const output = writeBMP(image, { preserveTransparentColour: false });
      results.push(output.data.toBytes());
    }
    break;
  case 'ico':
  case 'cur':
    const ico = writeICO(images.map((image) => ({ image })), { cursor: format === 'cur', compressionTimeAllotment: Number.POSITIVE_INFINITY });
    results.push(ico.data.toBytes());
    break;
  case 'ani':
    const ani = writeANI(images.map((image) => ({ sizes: [{ image }], jiffies: 1 })), { cursor: true, compressionTimeAllotment: Number.POSITIVE_INFINITY });
    results.push(ani.data.toBytes());
    break;
}
for (let i = 0; i < results.length; ++i) {
  const path = results.length > 1 ? addIndex(outFile, i) : outFile;
  process.stderr.write(`- writing: ${path}\n`);
  writeFileSync(path, results[i]);
}

/**
 * @param {import('node:fs').PathOrFileDescriptor} path
 * @param {number} index
 */
function addIndex(path, index) {
  if (typeof path !== 'string') {
    return path;
  }
  const p = path.lastIndexOf('.');
  if (p === -1) {
    return `${path}-${index}`;
  } else {
    return `${path.substring(0, p)}-${index}${path.substring(p)}`;
  }
}

/**
 * @param {import('node:fs').PathOrFileDescriptor} path
 */
function readImage(path) {
  const input = readFileSync(path);
  if (isPNG(input)) {
    process.stderr.write(`- reading: ${path} as PNG\n`);
    const png = readPNG(input);
    for (const warning of png.warnings) {
      process.stderr.write(`  WARN: ${warning}\n`);
    }
    const image = png.state.idat?.image;
    if (!image) {
      throw new Error('  Failed to read PNG\n');
    }
    process.stderr.write(`  ${image[0]?.length ?? 0}x${image.length}@${png.state.ihdr?.bitDepth ?? 0}\n`);
    return [image];
  } else if (isANI(input)) {
    process.stderr.write(`- reading: ${path} as ANI\n`);
    const ani = readANI(input);
    for (const warning of ani.warnings) {
      process.stderr.write(`  WARN: ${warning}\n`);
    }
    // TODO
    //for (const frame of ico.frames) {
    //  process.stderr.write(`  ${frame.image[0]?.length ?? 0}x${frame.image.length}@${frame.bitDepth}\n`);
    //}
    return [];
  } else if (isICO(input)) {
    process.stderr.write(`- reading: ${path} as ICO / CUR\n`);
    const ico = readICO(input);
    for (const warning of ico.warnings) {
      process.stderr.write(`  WARN: ${warning}\n`);
    }
    for (const icon of ico.images) {
      process.stderr.write(`  ${icon.image[0]?.length ?? 0}x${icon.image.length}@${icon.bitDepth}\n`);
    }
    return ico.images.map((icon) => icon.image);
  } else if (isBMP(input)) {
    process.stderr.write(`- reading: ${path} as BMP\n`);
    const bmp = readBMP(input);
    for (const warning of bmp.warnings) {
      process.stderr.write(`  WARN: ${warning}\n`);
    }
    process.stderr.write(`  ${bmp.image[0]?.length ?? 0}x${bmp.image.length}@${bmp.bitDepth}\n`);
    return [bmp.image];
  } else {
    process.stderr.write(`- cannot read ${path}: unsupported format\n`);
    return [];
  }
}
