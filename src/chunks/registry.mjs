const CHUNK_META = [];
const CHUNK_META_LOOKUP = new Map();

export const getChunkInfo = (type) => CHUNK_META_LOOKUP.get(type);

export const getAllChunkTypes = () => CHUNK_META;

export function registerChunk(type, {
  min = 0,
  max = Number.POSITIVE_INFINITY,
  sequential = false,
  notBefore = [],
  notAfter = [],
  allowBeforeIHDR = false,
  allowAfterIEND = false,
  requires = [],
} = {}, read = () => {}, post = () => {}) {
  const data = {
    type: char32(type),
    min,
    max,
    sequential,
    notBefore: notBefore.map(char32),
    notAfter: notAfter.map(char32),
    requires: requires.map(char32),
    read,
    post,
  };
  if (!allowBeforeIHDR) {
    data.notBefore.push(char32('IHDR'));
  }
  if (!allowAfterIEND) {
    data.notAfter.push(char32('IEND'));
  }
  if (CHUNK_META_LOOKUP.has(data.type)) {
    throw new Error(`duplicate chunk type ${data.type}`);
  }
  CHUNK_META.push(data);
  CHUNK_META_LOOKUP.set(data.type, data);
}

const char32 = (name) => (name.charCodeAt(0) << 24) | (name.charCodeAt(1) << 16) | (name.charCodeAt(2) << 8) | name.charCodeAt(3);
