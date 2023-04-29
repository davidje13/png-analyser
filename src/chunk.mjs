import { CRC } from './crc.mjs';
import { getAllChunkTypes, getChunkInfo } from './chunks/registry.mjs';
import { asDataView, subViewLen } from './data_utils.mjs';
import { printNice } from './pretty.mjs';
import './chunks/index.mjs';

// http://www.libpng.org/pub/png/spec/iso/index-noobject.html
// http://www.libpng.org/pub/png/book/chapter11.html
// http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html
// https://worms2d.info/Colour_map#PNG_chunk
// https://doom.fandom.com/wiki/PNG

/**
 * @typedef {import('./chunks/registry.mjs').Chunk} Chunk
 * @typedef {import('./chunks/registry.mjs').State} State
 */

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {number} pos
 * @param {string[]} warnings
 * @return {Chunk}
 */
export function readChunk(data, pos, warnings) {
  const d = asDataView(data);
  const type = d.getUint32(pos + 4);
  let name = '';
  let validType = true;
  for (let i = 0; i < 4; ++i) {
    const v = (type >>> (i * 8)) & 0xFF;
    if (v < 65 || (v > 90 && v < 97) || v > 122) {
      validType = false;
      name = '0x' + hex32(type);
      warnings.push(`chunk type ${name} is invalid`);
      break;
    }
  }
  if (validType) {
    name = printType(type);
  }

  const length = d.getUint32(pos);
  if (length > 0x7FFFFFFF) {
    warnings.push(`${name} size exceeds limit`);
  }
  if (pos + length + 12 > d.byteLength) {
    warnings.push(`${name} length exceeds available data (file truncated?)`);
  }
  const calcCrc = new CRC().update(subViewLen(d, pos + 4, length + 4)).get();
  const crc = d.getUint32(pos + 8 + length);
  if (crc !== calcCrc) {
    warnings.push(`${name} reported CRC ${hex32(crc)} does not match calculated CRC ${hex32(calcCrc)} (corrupt data?)`);
  }

  return {
    type,
    name,
    data: subViewLen(d, pos + 8, length),
    advance: 12 + length,
    toString() {
      const { name, type, data, advance, display, ...rest } = this;
      return printNice(rest);
    },
    display(summary, content) {
      const v = this.toString();
      if (v && v !== '{}') {
        content.append(v);
      }
    },
  };
}

/**
 * @param {Chunk[]} chunks
 * @param {string[]} warnings
 * @return {State}
 */
export function parseChunks(chunks, warnings) {
  const types = chunks.map((chunk) => chunk.type);

  for (const meta of getAllChunkTypes()) {
    const name = printType(meta.type);
    const count = types.filter((v) => v === meta.type).length;
    if (count < meta.min) {
      warnings.push(`missing mandatory chunk ${name}`);
      continue;
    } else if (meta.max && count > meta.max) {
      warnings.push(`too many ${name} chunks (found ${count})`);
      continue;
    }
    if (count === 0) {
      continue;
    }
    if (meta.sequential) {
      let state = 0;
      for (const type of types) {
        const match = type === meta.type;
        if (state === 0 && match) {
          state = 1;
        } else if (state === 1 && !match) {
          state = 2;
        } else if (state === 2 && match) {
          warnings.push(`${name} chunks are not sequential`);
          break;
        }
      }
    }
    const p = types.indexOf(meta.type);
    const lastP = types.lastIndexOf(meta.type);
    for (const other of meta.notAfter) {
      const otherP = types.indexOf(other);
      if (otherP !== -1 && otherP < lastP) {
        warnings.push(`${name} cannot be before ${printType(other)}`);
        break;
      }
    }
    for (const other of meta.notBefore) {
      if (types.lastIndexOf(other) > p) {
        warnings.push(`${name} cannot be after ${printType(other)}`);
        break;
      }
    }
    for (const requirement of meta.requires) {
      if (!types.includes(requirement)) {
        warnings.push(`${name} requires ${requirement}`);
      }
    }
  }

  // TODO: fix ordering if incorrect

  /** @type {State} */ const state = {};
  for (const chunk of chunks) {
    const name = printType(chunk.type);
    const meta = getChunkInfo(chunk.type);
    if (!meta) {
      if (chunk.type & 0x20000000) {
        warnings.push(`unknown ancillary chunk ${name}`);
      } else {
        warnings.push(`unknown critical chunk ${name}`);
      }
    } else {
      meta.read(chunk, state, warnings);
    }
  }
  for (const meta of getAllChunkTypes()) {
    meta.post(state, warnings);
  }

  return state;
}

/**
 * @param {number} v
 * @return {string}
 */
const hex32 = (v) => v.toString(16).padStart(8, '0');

/** @type {Map<number, string>} */ const TYPE_NAMES = new Map();

/**
 * @param {number} type
 * @return {string}
 */
const printType = (type) => {
  let n = TYPE_NAMES.get(type);
  if (!n) {
    n = [
      String.fromCharCode(type >>> 24),
      String.fromCharCode((type >>> 16) & 0xFF),
      String.fromCharCode((type >>> 8) & 0xFF),
      String.fromCharCode(type & 0xFF),
    ].join('');
    TYPE_NAMES.set(type, n);
  }
  return n;
};
