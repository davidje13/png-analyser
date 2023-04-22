// http://www.libpng.org/pub/png/spec/iso/index-noobject.html

import { isTypedArray } from 'node:util/types';
import { checkHeader } from './header.mjs';
import { readChunk, parseChunks } from './chunk.mjs';

export function readPNG(data) {
  const warnings = [];
  const begin = checkHeader(data, warnings);
  const chunks = [];
  for (let p = begin; p < data.length;) {
    const chunk = readChunk(data, p, warnings);
    chunks.push(chunk);
    p += chunk.advance;
  }
  const imageData = parseChunks(chunks, warnings);

  for (const warning of warnings) {
    console.log(`WARN: ${warning}`);
  }
  for (const { name, type, data, advance, ...parsed } of chunks) {
    console.log(`${name} [${data.length}]: ${JSON.stringify(parsed, niceBuffer, 2)}`);
  }
  //console.log(`IMAGE: ${imageData}`);
}
function niceBuffer(k, v) {
  if (typeof v === 'object' && v.type === 'Buffer') {
    let r = [];
    for (const b of v.data) {
      r.push(b.toString(16).padStart(2, '0'));
    }
    return r.join(' ');
  }
  return v;
}


//const npot = (v) => 1 << (32 - Math.clz32(v - 1));
//const deflateOptions = {
//  chunkSize: Math.max(256, Math.min(32768, npot(imageData.length))),
//  level: 9,
//};
