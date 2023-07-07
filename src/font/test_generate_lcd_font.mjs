#!/usr/bin/env node

// This generates a 0-9 font based on the Minesweeper game's digits

import { Font } from './font.mjs';
import { OpenTypeFont } from './off/off.mjs';
import { bytesToStream } from '../data/node/stream.mjs';
import { vectorisePixelated } from '../image/actions/vectorise.mjs';
import { bitmapOr, extractValue, toSVGPath, toType2Instructions, translate, scale, upscaleBitmap } from './generation.mjs';

/**
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

const SEGMENTATION = `
-------------
--AaAaAaAaA--
-b-AaAaAaA-c-
-Bb-AaAaA-cC-
-bBb-----cCc-
-BbB-----CcC-
-bBb-----cCc-
-BbB-----CcC-
-bBb-----cCc-
-Bb-------cC-
-b-DdDdDdD-c-
--DdDdDdDdD--
-e-DdDdDdD-f-
-Ee-------fF-
-eEe-----fFf-
-EeE-----FfF-
-eEe-----fFf-
-EeE-----FfF-
-eEe-----fFf-
-Ee-GgGgG-fF-
-e-GgGgGgG-f-
--GgGgGgGgG--
-------------
`.trim().split('\n').map((ln) => ln.split(''));

const baseline = 21;
const advanceWidth = 13;

/**
 * @template {unknown} T
 * @param {T[][]} bitmap
 * @param {T} vOn
 * @param {T} vOff
 */
function extractSegment(bitmap, vOn, vOff) {
  const bitmapOff = extractValue(bitmap, vOff, 128, 0);
  const bitmapOn = bitmapOr(extractValue(bitmap, vOn, 255, 0), extractValue(bitmap, vOff, 255, 0));
  return {
    bitmapOn,
    bitmapOff,
    vectorOn: vectorisePixelated(bitmapOn).map(translate(0, -baseline)),
    vectorOff: vectorisePixelated(bitmapOff).map(translate(0, -baseline)),
  };
}

const SEGMENTS = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg'].map((s) => extractSegment(SEGMENTATION, s[0], s[1]));

/** @type {CharactersSVGDocument} */ const svgDocument = {
  // For now these have hard-coded fill=red, as Safari otherwise always uses black (firefox correctly uses current text colour as the default)
  defs: [
    ...SEGMENTS.map((seg, i) => `<g id="s${i}0" opacity="0.5"><path d="${toSVGPath(seg.vectorOff)}" fill="red" /></g>`),
    ...SEGMENTS.map((seg, i) => `<g id="s${i}1"><path d="${toSVGPath(seg.vectorOn)}" fill="red" /></g>`),
  ],
  parts: [],
};

/**
 * @param {(boolean | 0 | 1)[]} segments
 * @return {OFFGlyphData}
 */
function make7Seg(...segments) {
  const svgID = `g${svgDocument.parts.length}`;
  const svgSegs = segments.map((en, i) => `<use xlink:href="#s${i}${en ? '1' : '0'}"/>`);
  svgDocument.parts.push(`<g id="${svgID}">${svgSegs.join('')}</g>`);

  const outline = SEGMENTS.flatMap((seg, i) => segments[i] ? seg.vectorOn : []);
  const bitmap = SEGMENTS.map((seg, i) => segments[i] ? seg.bitmapOn : seg.bitmapOff).reduce(bitmapOr);
  const rgbaBitmap = bitmap.map((ln) => ln.map((v) => (v * 0x00000001) | 0xFF000000));

  return {
    cff: {
      advanceWidth,
      bounds: {
        xmin: 0,
        ymin: baseline - SEGMENTATION.length,
        xmax: SEGMENTATION[0].length,
        ymax: baseline,
      },
      renderBounds: true,
      instructions: toType2Instructions(outline.map(scale(1, -1))),
    },
    //bitmaps: [
    //  {
    //    emPixels: bitmap.length,
    //    bitsPerPixel: 8,
    //    forceColour: true,
    //    horizontalMetrics: {
    //      tlOrigin: { x: 0, y: baseline },
    //      advance: advanceWidth,
    //    },
    //    bitmap,
    //  },
    //],
    sbixBitmaps: [1, 2, 3].map((bitmapScale) => ({
      emPixels: bitmap.length,
      pixelsPerInch: 72 * bitmapScale,
      bitmap: upscaleBitmap(rgbaBitmap, bitmapScale),
    })),
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
//font.addGlyph('_', 'underscore',   make7Seg(0, 0, 0, 0, 0, 0, 1));
font.addGlyph(' ', 'space',        make7Seg(0, 0, 0, 0, 0, 0, 0));
//font.addGlyph('=', 'equal',        make7Seg(0, 0, 0, 1, 0, 0, 1));
//font.addGlyph('"', 'quotedbl',     make7Seg(0, 1, 1, 0, 0, 0, 0));
//font.addGlyph('\'', 'quotesingle', make7Seg(0, 0, 1, 0, 0, 0, 0));

//font.addGlyph('A', 'A', make7Seg(1, 1, 1, 1, 1, 1, 0));
//font.addGlyph('b', 'b', make7Seg(0, 1, 0, 1, 1, 1, 1));
//font.addGlyph('c', 'c', make7Seg(0, 0, 0, 1, 1, 0, 1));
//font.addGlyph('C', 'C', make7Seg(1, 1, 0, 0, 1, 0, 1));
//font.addGlyph('d', 'd', make7Seg(0, 0, 1, 1, 1, 1, 1));
//font.addGlyph('e', 'e', make7Seg(1, 1, 1, 1, 1, 0, 1));
//font.addGlyph('E', 'E', make7Seg(1, 1, 0, 1, 1, 0, 1));
//font.addGlyph('F', 'F', make7Seg(1, 1, 0, 1, 1, 0, 0));
//font.addGlyph('G', 'G', make7Seg(1, 1, 0, 0, 1, 1, 1));
//font.addGlyph('h', 'h', make7Seg(0, 1, 0, 1, 1, 1, 0));
//font.addGlyph('H', 'H', make7Seg(0, 1, 1, 1, 1, 1, 0));
//font.addGlyph('i', 'i', make7Seg(0, 0, 0, 0, 0, 1, 0));
//font.addGlyph('J', 'J', make7Seg(0, 0, 1, 0, 0, 1, 1));
//font.addGlyph('L', 'L', make7Seg(0, 1, 0, 0, 1, 0, 1));
//font.addGlyph('n', 'n', make7Seg(0, 0, 0, 1, 1, 1, 0));
//font.addGlyph('o', 'o', make7Seg(0, 0, 0, 1, 1, 1, 1));
//font.addGlyph('P', 'P', make7Seg(1, 1, 1, 1, 1, 0, 0));
//font.addGlyph('q', 'q', make7Seg(1, 1, 1, 1, 0, 1, 0));
//font.addGlyph('r', 'r', make7Seg(0, 0, 0, 1, 1, 0, 0));
//font.addGlyph('t', 't', make7Seg(0, 1, 0, 1, 1, 0, 1));
//font.addGlyph('u', 'u', make7Seg(0, 0, 0, 0, 1, 1, 1));
//font.addGlyph('U', 'U', make7Seg(0, 1, 1, 0, 1, 1, 1));
//font.addGlyph('y', 'y', make7Seg(0, 1, 1, 1, 0, 1, 1));

bytesToStream(new OpenTypeFont(font).writeOTF().toBytes()).pipe(process.stdout);
