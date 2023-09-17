import { ByteArrayBuilder } from '../data/builder.mjs';
import { asDataView, getLatin1, subViewFrom, subViewLen } from '../data/utils.mjs';

// https://exiftool.org/TagNames/RIFF.html

/**
 * @typedef {{
 *   type: string;
 *   data: DataView;
 *   rawType: string;
 *   chunks?: RIFFChunkOut[];
 * }} RIFFChunkOut
 *
 * @typedef {{
 *   type: string;
 *   data?: ArrayBuffer | ArrayBufferView | ((buf: ByteArrayBuilder) => void);
 *   rawType?: string;
 *   chunks?: (RIFFChunkIn | null)[];
 * }} RIFFChunkIn
 *
 * @typedef {{
 *   warnings: string[];
 *   chunks: RIFFChunkOut[];
 * }} RIFFResult
 */

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 * @param {string=} type
 */
export function isRIFF(data, type) {
  const dv = asDataView(data);
  if (getLatin1(dv, 0, 4, []) !== 'RIFF') {
    return false;
  }
  if (dv.getUint32(4, true) < 4) {
    return false;
  }
  return !type || getLatin1(dv, 8, 12, []) === type;
}

/**
 * @param {DataView} data
 * @param {string[]} warnings
 */
function readRIFFChunks(data, warnings) {
  const chunks = [];
  let p = 0;
  while (p < data.byteLength) {
    const type = getLatin1(data, p, p + 4, warnings);
    /** @type {string[]} */ const localWarnings = [];
    const length = data.getUint32(p + 4, true);
    /** @type {RIFFChunkOut} */ const chunk = { type, rawType: type, data: subViewLen(data, p + 8, length, localWarnings) };
    if (type === 'RIFF' || type === 'LIST') {
      chunk.type = getLatin1(chunk.data, 0, 4, localWarnings);
      chunk.chunks = readRIFFChunks(subViewFrom(chunk.data, 4), localWarnings);
    }
    p += 8 + length;
    if (length & 1) {
      const pad = data.getUint8(p);
      if (pad !== 0) {
        localWarnings.push(`pad byte (${pad}) is not 0`);
      }
      ++p;
    }
    chunks.push(chunk);
    warnings.push(...localWarnings.map((w) => `${chunk.type}: ${w}`));
  }
  return chunks;
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function readRIFF(data) {
  /** @type {RIFFResult} */ const result = { warnings: [], chunks: [] };
  result.chunks = readRIFFChunks(asDataView(data), result.warnings);
  if (result.chunks.length === 0) {
    result.warnings.push('No RIFF chunk');
  } else if (result.chunks.length > 1) {
    result.warnings.push('Extra chunks after RIFF');
  } else if (result.chunks[0].rawType !== 'RIFF') {
    result.warnings.push('Root chunk is not RIFF');
  }
  return result;
}

/**
 * @param {ByteArrayBuilder} buf
 * @param {RIFFChunkIn} chunk
 */
function writeRIFFChunk(buf, chunk) {
  const type = chunk.rawType ?? (chunk.chunks ? 'LIST' : chunk.type);
  if (type.length !== 4) {
    throw new Error(`Invalid RIFF chunk type: ${type}`);
  }
  buf.latin1(type);
  let data = chunk.data ?? (() => null);
  if (chunk.chunks) {
    const cs = chunk.chunks;
    data = (buf) => {
      for (const subChunk of cs) {
        if (subChunk) {
          writeRIFFChunk(buf, subChunk);
        }
      }
    };
  }
  if (typeof data === 'function') {
    if (chunk.type.length !== 4) {
      throw new Error(`Invalid RIFF chunk container type: ${chunk.type}`);
    }
    buf.latin1(chunk.type);
    const lengthPos = buf.byteLength;
    buf.uint32LE(0); // length (populated later)
    data(buf);
    const length = buf.byteLength - lengthPos - 4;
    buf.replaceUint32LE(lengthPos, length);
    if (length & 1) {
      buf.uint8(0); // padding
    }
  } else {
    buf.uint32LE(data.byteLength);
    buf.append(data);
    if (data.byteLength & 1) {
      buf.uint8(0); // padding
    }
  }
}

/**
 * @param {string} type
 * @param {(RIFFChunkIn | null)[]} chunks
 */
export function writeRIFF(type, chunks) {
  const buf = new ByteArrayBuilder();
  writeRIFFChunk(buf, { rawType: 'RIFF', type, chunks });
  return { data: buf };
}
