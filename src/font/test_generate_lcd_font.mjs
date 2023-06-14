#!/usr/bin/env node

// This generates a 0-9 font based on the Minesweeper game's digits

import { Font } from './font.mjs';
import { OpenTypeFont } from './off/off.mjs';
import { bytesToStream } from '../data/node/stream.mjs';

/**
 * @typedef {import('./cff/glyph.mjs').Instruction} Instruction
 */

// https://www.w3.org/TR/WOFF2/

const font = new Font({
  name: '0123456789',
  manufacturer: 'davidje13',
  manufacturerURL: 'https://davidje13.com',
  sampleText: '-0123456789',
  em: 23,
});

/** @type {Instruction[]} */ const T = [
  ['rmoveto', 2, 22],
  ['vlineto', -1, 1, -1, 1, -1, 5, 1, 1, 1, 1, 1],
  ['rmoveto', -11, -22],
];

/** @type {Instruction[]} */ const TL = [
  ['rmoveto', 1, 12],
  ['hlineto', 1, 1, 1, 1, 1, 5, -1, 1, -1, 1, -1],
  ['rmoveto', -1, -21],
];

/** @type {Instruction[]} */ const TR = [
  ['rmoveto', 12, 12],
  ['hlineto', -1, 1, -1, 1, -1, 5, 1, 1, 1, 1, 1],
  ['rmoveto', -12, -21],
];

/** @type {Instruction[]} */ const M = [
  ['rmoveto', 2, 11],
  ['vlineto', 1, 1, 1, 7, -1, 1, -1, -1, -1, -7, 1],
  ['rmoveto', -3, -11],
];

/** @type {Instruction[]} */ const BL = [
  ['rmoveto', 1, 2],
  ['hlineto', 1, 1, 1, 1, 1, 5, -1, 1, -1, 1, -1],
  ['rmoveto', -1, -11],
];

/** @type {Instruction[]} */ const BR = [
  ['rmoveto', 12, 2],
  ['hlineto', -1, 1, -1, 1, -1, 5, 1, 1, 1, 1, 1],
  ['rmoveto', -12, -11],
];

/** @type {Instruction[]} */ const B = [
  ['rmoveto', 2, 1],
  ['vlineto', 1, 1, 1, 1, 1, 5, -1, 1, -1, 1, -1],
  ['rmoveto', -11, -1],
];

const advanceWidth = 13;
const bounds = { xmin: 1, ymin: 1, xmax: 12, ymax: 22 };

font.setUnknownGlyph({ advanceWidth, bounds, instructions: [...T, ...TR, ...M, ...BL] });
font.addGlyph('0', 'zero', { advanceWidth, bounds, instructions: [...T, ...TL, ...TR, ...BL, ...BR, ...B] });
font.addGlyph('1', 'one', { advanceWidth, bounds, instructions: [...TR, ...BR] });
font.addGlyph('2', 'two', { advanceWidth, bounds, instructions: [...T, ...TR, ...M, ...BL, ...B] });
font.addGlyph('3', 'three', { advanceWidth, bounds, instructions: [...T, ...TR, ...M, ...BR, ...B] });
font.addGlyph('4', 'four', { advanceWidth, bounds, instructions: [...TL, ...TR, ...M, ...BR] });
font.addGlyph('5', 'five', { advanceWidth, bounds, instructions: [...T, ...TL, ...M, ...BR, ...B] });
font.addGlyph('6', 'six', { advanceWidth, bounds, instructions: [...T, ...TL, ...M, ...BL, ...BR, ...B] });
font.addGlyph('7', 'seven', { advanceWidth, bounds, instructions: [...T, ...TR, ...BR] });
font.addGlyph('8', 'eight', { advanceWidth, bounds, instructions: [...T, ...TL, ...TR, ...M, ...BL, ...BR, ...B] });
font.addGlyph('9', 'nine', { advanceWidth, bounds, instructions: [...T, ...TL, ...TR, ...M, ...BR, ...B] });
font.addGlyph('-', 'minus', { advanceWidth, bounds, instructions: [...M] });

bytesToStream(new OpenTypeFont(font).writeOTF().toBytes()).pipe(process.stdout);
