#!/usr/bin/env node

// This generates a 0-9 font based on the Minesweeper game's digits

import { Font } from './font.mjs';
import { OpenTypeFont } from './off/off.mjs';
import { bytesToStream } from '../data/node/stream.mjs';

/**
 * @typedef {import('./cff/cff_glyph.mjs').Instruction} Instruction
 * @typedef {import('./off/off_glyph.mjs').OFFGlyphData} OFFGlyphData
 * @typedef {import('./off/off_glyph.mjs').CharactersSVGDocument} CharactersSVGDocument
 */

// https://www.w3.org/TR/WOFF2/

const font = new Font({
  name: '0123456789',
  manufacturer: 'davidje13',
  manufacturerURL: 'https://davidje13.com',
  sampleText: '-0123456789',
  em: 23,
  lineheight: 1,
  strikeoutSize: 1,
  forceInteger: true,
  ttRendering: [
    { emMaxPixels: 65535, mode: 0b00000000_00000001 },
  ],
});

// paths are defined counterclockwise to match Type1 requirements

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
  ['rmoveto', 12, 21],
  ['hlineto', -1, -1, -1, -1, -1, -5, 1, -1, 1, -1, 1],
  ['rmoveto', -12, -12],
];

/** @type {Instruction[]} */ const M = [
  ['rmoveto', 2, 12],
  ['vlineto', -1, 1, -1, 7, 1, 1, 1, -1, 1, -7, -1],
  ['rmoveto', -3, -12],
];

/** @type {Instruction[]} */ const BL = [
  ['rmoveto', 1, 2],
  ['hlineto', 1, 1, 1, 1, 1, 5, -1, 1, -1, 1, -1],
  ['rmoveto', -1, -11],
];

/** @type {Instruction[]} */ const BR = [
  ['rmoveto', 12, 11],
  ['hlineto', -1, -1, -1, -1, -1, -5, 1, -1, 1, -1, 1],
  ['rmoveto', -12, -2],
];

/** @type {Instruction[]} */ const B = [
  ['rmoveto', 11, 1],
  ['vlineto', 1, -1, 1, -1, 1, -5, -1, -1, -1, -1, -1],
  ['rmoveto', -2, -1],
];

/**
 * @param {Instruction[]} instructions
 * @return {string}
 */
function makeSVGPath(instructions) {
  /** @type {string[]} */ const r = [];
  for (const [cmd, ...args] of instructions) {
    switch (cmd) {
      case 'rmoveto':
        if (!r.length) {
          r.push(`M${args[0]},${-args[1]}`);
        } else {
          r.push('Z', `m${args[0]},${-args[1]}`);
        }
        break;
      case 'hlineto':
        for (let i = 0; i < args.length; ++i) {
          r.push('hv'[i & 1] + [1, -1][i & 1] * args[i]);
        }
        break;
      case 'vlineto':
        for (let i = 0; i < args.length; ++i) {
          r.push('vh'[i & 1] + [-1, 1][i & 1] * args[i]);
        }
        break;
    }
  }
  if (r[r.length - 1]?.startsWith('m')) {
    r.length = r.length - 1;
  }
  if (r[r.length - 1] !== 'Z') {
    r.push('Z');
  }
  return r.join('');
}

/**
 * @param {number} dx
 * @param {number} dy
 * @param {[number, number, number][]} ranges
 * @return {string}
 */
function makeSVGPixelsGrid(dx, dy, ranges) {
  /** @type {string[]} */ const r = [];
  for (const [x, y, n] of ranges) {
    r.push(`M${x},${y}h1v1h-1Z`);
    for (let i = 1; i < n; ++i) {
      r.push(`m${dx},${dy}h1v1h-1Z`);
    }
  }
  return r.join('');
}

/** @type {CharactersSVGDocument} */ const svgDocument = {
  defs: [
    `<g id="s00" opacity="0.5"><path d="${makeSVGPixelsGrid(2, 0, [[3, -22, 4], [4, -21, 3], [5, -20, 2]])}" /></g>`,
    `<g id="s10" opacity="0.5"><path d="${makeSVGPixelsGrid(0, 2, [[1, -21, 5], [2, -20, 4], [3, -19, 3]])}" /></g>`,
    `<g id="s20" opacity="0.5"><path d="${makeSVGPixelsGrid(0, 2, [[11, -21, 5], [10, -20, 4], [9, -19, 3]])}" /></g>`,
    `<g id="s30" opacity="0.5"><path d="${makeSVGPixelsGrid(2, 0, [[3, -12, 4], [4, -11, 3], [4, -13, 3]])}" /></g>`,
    `<g id="s40" opacity="0.5"><path d="${makeSVGPixelsGrid(0, 2, [[1, -11, 5], [2, -10, 4], [3, -9, 3]])}" /></g>`,
    `<g id="s50" opacity="0.5"><path d="${makeSVGPixelsGrid(0, 2, [[11, -11, 5], [10, -10, 4], [9, -9, 3]])}" /></g>`,
    `<g id="s60" opacity="0.5"><path d="${makeSVGPixelsGrid(2, 0, [[3, -2, 4], [4, -3, 3], [5, -4, 2]])}" /></g>`,

    `<g id="s01"><path d="${makeSVGPath(T)}" /></g>`,
    `<g id="s11"><path d="${makeSVGPath(TL)}" /></g>`,
    `<g id="s21"><path d="${makeSVGPath(TR)}" /></g>`,
    `<g id="s31"><path d="${makeSVGPath(M)}" /></g>`,
    `<g id="s41"><path d="${makeSVGPath(BL)}" /></g>`,
    `<g id="s51"><path d="${makeSVGPath(BR)}" /></g>`,
    `<g id="s61"><path d="${makeSVGPath(B)}" /></g>`,
  ],
  parts: [],
};

/**
 * @param {boolean | 0 | 1} top
 * @param {boolean | 0 | 1} tl
 * @param {boolean | 0 | 1} tr
 * @param {boolean | 0 | 1} mid
 * @param {boolean | 0 | 1} bl
 * @param {boolean | 0 | 1} br
 * @param {boolean | 0 | 1} base
 * @return {OFFGlyphData}
 */
function make7Seg(top, tl, tr, mid, bl, br, base) {
  const svgID = `g${svgDocument.parts.length}`;
  const svgSegs = [top, tl, tr, mid, bl, br, base].map((en, i) => `<use xlink:href="#s${i}${en ? '1' : '0'}"/>`);
  svgDocument.parts.push(`<g id="${svgID}">${svgSegs.join('')}</g>`);
  return {
    cff: {
      advanceWidth: 13,
      bounds: { xmin: 0, ymin: 0, xmax: 13, ymax: 23 },
      instructions: [
        ...(top ? T : []),
        ...(tl ? TL : []),
        ...(tr ? TR : []),
        ...(mid ? M : []),
        ...(bl ? BL : []),
        ...(br ? BR : []),
        ...(base ? B : []),
      ],
    },
    // SVG fonts are not supported by Chrome, but are supported by Firefox
    svg: {
      document: svgDocument,
      id: svgID,
    },
  };
}

font.setUnknownGlyph(make7Seg(1, 0, 1, 1, 1, 0, 0));
font.addGlyph('0', 'zero',  make7Seg(1, 1, 1, 0, 1, 1, 1));
font.addGlyph('1', 'one',   make7Seg(0, 0, 1, 0, 0, 1, 0));
font.addGlyph('2', 'two',   make7Seg(1, 0, 1, 1, 1, 0, 1));
font.addGlyph('3', 'three', make7Seg(1, 0, 1, 1, 0, 1, 1));
font.addGlyph('4', 'four',  make7Seg(0, 1, 1, 1, 0, 1, 0));
font.addGlyph('5', 'five',  make7Seg(1, 1, 0, 1, 0, 1, 1));
font.addGlyph('6', 'six',   make7Seg(1, 1, 0, 1, 1, 1, 1));
font.addGlyph('7', 'seven', make7Seg(1, 0, 1, 0, 0, 1, 0));
font.addGlyph('8', 'eight', make7Seg(1, 1, 1, 1, 1, 1, 1));
font.addGlyph('9', 'nine',  make7Seg(1, 1, 1, 1, 0, 1, 1));

font.addGlyph('-', 'minus',        make7Seg(0, 0, 0, 1, 0, 0, 0));
font.addGlyph('_', 'underscore',   make7Seg(0, 0, 0, 0, 0, 0, 1));
font.addGlyph(' ', 'space',        make7Seg(0, 0, 0, 0, 0, 0, 0));
font.addGlyph('=', 'equal',        make7Seg(0, 0, 0, 1, 0, 0, 1));
font.addGlyph('"', 'quotedbl',     make7Seg(0, 1, 1, 0, 0, 0, 0));
font.addGlyph('\'', 'quotesingle', make7Seg(0, 0, 1, 0, 0, 0, 0));

font.addGlyph('A', 'A', make7Seg(1, 1, 1, 1, 1, 1, 0));
font.addGlyph('b', 'b', make7Seg(0, 1, 0, 1, 1, 1, 1));
font.addGlyph('c', 'c', make7Seg(0, 0, 0, 1, 1, 0, 1));
font.addGlyph('C', 'C', make7Seg(1, 1, 0, 0, 1, 0, 1));
font.addGlyph('d', 'd', make7Seg(0, 0, 1, 1, 1, 1, 1));
font.addGlyph('e', 'e', make7Seg(1, 1, 1, 1, 1, 0, 1));
font.addGlyph('E', 'E', make7Seg(1, 1, 0, 1, 1, 0, 1));
font.addGlyph('F', 'F', make7Seg(1, 1, 0, 1, 1, 0, 0));
font.addGlyph('g', 'g', make7Seg(1, 1, 1, 1, 0, 1, 1));
font.addGlyph('G', 'G', make7Seg(1, 1, 0, 0, 1, 1, 1));
font.addGlyph('h', 'h', make7Seg(0, 1, 0, 1, 1, 1, 0));
font.addGlyph('H', 'H', make7Seg(0, 1, 1, 1, 1, 1, 0));
font.addGlyph('J', 'J', make7Seg(0, 0, 1, 0, 0, 1, 1));
font.addGlyph('L', 'L', make7Seg(0, 1, 0, 0, 1, 0, 1));
font.addGlyph('n', 'n', make7Seg(0, 0, 0, 1, 1, 1, 0));
font.addGlyph('o', 'o', make7Seg(0, 0, 0, 1, 1, 1, 1));
font.addGlyph('P', 'P', make7Seg(1, 1, 1, 1, 1, 0, 0));
font.addGlyph('q', 'q', make7Seg(1, 1, 1, 1, 0, 1, 0));
font.addGlyph('r', 'r', make7Seg(0, 0, 0, 1, 1, 0, 0));
font.addGlyph('t', 't', make7Seg(0, 1, 0, 1, 1, 0, 1));
font.addGlyph('u', 'u', make7Seg(0, 0, 0, 0, 1, 1, 1));
font.addGlyph('U', 'U', make7Seg(0, 1, 1, 0, 1, 1, 1));
font.addGlyph('y', 'y', make7Seg(0, 1, 1, 1, 0, 1, 1));

bytesToStream(new OpenTypeFont(font).writeOTF().toBytes()).pipe(process.stdout);
