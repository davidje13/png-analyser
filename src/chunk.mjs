import { inflateSync } from 'node:zlib';
import { CRC } from './crc.mjs';
import { getAllChunkTypes, getChunkInfo, ANY } from './chunks/registry.mjs';
import './chunks/index.mjs';

// http://www.libpng.org/pub/png/spec/iso/index-noobject.html
// http://www.libpng.org/pub/png/book/chapter11.html
// http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html
// https://worms2d.info/Colour_map#PNG_chunk
// https://doom.fandom.com/wiki/PNG

export function readChunk(data, pos, warnings) {
  const type = data.readUInt32BE(pos + 4);
  let name;
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

  const length = data.readUInt32BE(pos);
  if (length > 0x7FFFFFFF) {
    warnings.push(`${name} size exceeds limit`);
  }
  if (pos + length + 12 > data.length) {
    warnings.push(`${name} length exceeds available data (file truncated?)`);
  }
  const calcCrc = new CRC().update(data.subarray(pos + 4, pos + 8 + length)).get();
  const crc = data.readUInt32BE(pos + 8 + length);
  if (crc !== calcCrc) {
    warnings.push(`${name} reported CRC ${hex32(crc)} does not match calculated CRC ${hex32(calcCrc)} (corrupt data?)`);
  }

  return {
    type,
    name,
    data: data.subarray(pos + 8, pos + 8 + length),
    advance: 12 + length,
  };
}

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
    if (meta.notAfter) {
      const lastP = types.lastIndexOf(meta.type);
      for (const other of meta.notAfter) {
        if (other === ANY) {
          if (lastP !== 0) {
            warnings.push(`${name} must be first chunk`);
            break;
          }
        } else {
          const otherP = types.indexOf(other);
          if (otherP !== -1 && otherP < lastP) {
            warnings.push(`${name} cannot be before ${printType(other)}`);
            break;
          }
        }
      }
    }
    if (meta.notBefore) {
      const p = types.indexOf(meta.type);
      for (const other of meta.notBefore) {
        if (other === ANY) {
          if (p !== types.length - 1) {
            warnings.push(`${name} must be last chunk`);
            break;
          }
        } else if (types.lastIndexOf(other) > p) {
          warnings.push(`${name} cannot be after ${printType(other)}`);
          break;
        }
      }
    }
    if (meta.requires) {
      for (const requirement of meta.requires) {
        if (!types.includes(requirement)) {
          warnings.push(`${name} requires ${requirement}`);
        }
      }
    }
  }

  // TODO: fix ordering if incorrect

  const state = { idats: [] };
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

  try {
    const inflated = inflateSync(Buffer.concat(state.idats));
    return inflated;
  } catch (e) {
    warnings.push(`idat compressed data is unreadable ${e}`);
    return Buffer.alloc(0);
  }
}

const hex32 = (v) => v.toString(16).padStart(8, '0');

const TYPE_NAMES = new Map();
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
