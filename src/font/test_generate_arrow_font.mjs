#!/usr/bin/env node

// This generates up and down arrows

import { Readable } from 'node:stream';
import { Font } from './font.mjs';
import { OpenTypeFont } from './off/off.mjs';
import { makeType2CurvedPolygon } from './generation.mjs';

// https://www.w3.org/TR/WOFF2/

const font = new Font({
  name: 'atomic-symbols',
  manufacturer: 'davidje13',
  manufacturerURL: 'https://davidje13.com',
  sampleText: '\u2191\u2193',
  em: 23,
  lineheight: 1,
  strikeoutSize: 1,
  ttRendering: [
    { emMaxPixels: 65535, mode: 0b00000000_00000001 },
  ],
});

const width = 12;
const height = 24;
const baseline = 21;
const advanceWidth = width;
const bounds = { xmin: 0, ymin: baseline - height, xmax: width, ymax: baseline };
const headH1 = 4;
const headH2 = 7.5;
const headW = 6;
const radius = 0.5;
const arrowBend = 0.7;

const upPoints = [
  { x: width * 0.5, y: baseline - height, r: 0 },
  { x: width * 0.5 + radius, y: baseline - height, r: radius },
  { x: width * 0.5 + radius, y: baseline - headH1, r: 0 },
  { x: width * 0.5 + headW, y: baseline - headH2, r: 0.25 },
  { x: width * 0.5 + headW * 0.5 - arrowBend, y: baseline - headH2 * 0.5, r: 15 },
];
upPoints.push(
  { x: width * 0.5, y: baseline, r: 0.25 },
  ...upPoints.map((v) => ({ x: width - v.x, y: v.y, r: v.r })).reverse(),
);

font.setUnknownGlyph({ cff: { advanceWidth, bounds, instructions: [] } });
font.addGlyph('\u2191', 'up arrow', { cff: { advanceWidth, bounds, instructions: makeType2CurvedPolygon(upPoints) } });
font.addGlyph('\u2193', 'down arrow', { cff: { advanceWidth, bounds, instructions: makeType2CurvedPolygon(upPoints.map((p) => ({ x: p.x, y: 2 * baseline - height - p.y, r: p.r }))) } });
font.addGlyph(' ', 'space', { cff: { advanceWidth, bounds, instructions: [] } });

/**
 * @param {Uint8Array} bytes
 * @return {Readable}
 */
function bytesToStream(bytes) {
  const readable = new Readable();
  readable._read = () => {
    readable.push(bytes);
    readable.push(null);
  };
  return readable;
}

bytesToStream(new OpenTypeFont(font).writeOTF().toBytes()).pipe(process.stdout);
