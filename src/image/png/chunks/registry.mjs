/**
 * @typedef {{
 *   type: number,
 *   min: number,
 *   max: number,
 *   sequential: boolean,
 *   notBefore: number[],
 *   notAfter: number[],
 *   requires: number[],
 *   requiresPost: number[],
 *   read: (chunk: Chunk,
 *   state: State,
 *   warnings: string[]) => void,
 *   post: (state: State,
 *   warnings: string[]) => void,
 * }} ChunkMeta
 *
 * @typedef {{
 *   toString: () => string,
 *   display: (summaryTarget: HTMLElement, contentTarget: HTMLElement) => void,
 * }} ChunkAggregate
 *
 * @typedef {{
 *   type: number,
 *   name: string,
 *   data: DataView,
 *   filePos: number,
 *   advance: number,
 *   toString: () => string,
 *   display: (summaryTarget: HTMLElement, contentTarget: HTMLElement) => void,
 *   aggregate?: () => ChunkAggregate,
 *   defaultCollapse?: boolean,
 * }} Chunk
 *
 * @typedef {{}} State
 */

/** @type {ChunkMeta[]} */ const CHUNK_META = [];
/** @type {ChunkMeta[] | null} */ let ORDERED_CHUNK_META = null;
/** @type {Map<number, ChunkMeta>} */ const CHUNK_META_LOOKUP = new Map();

/**
 * @param {number} type
 * @return {ChunkMeta | undefined}
 */
export const getChunkInfo = (type) => CHUNK_META_LOOKUP.get(type);

function orderChunks() {
  /** @type {ChunkMeta[]} */ const result = [];
  /** @type {Set<number>} */ const visited = new Set();
  /** @type {(type: number) => void} */ const add = (type) => {
    const meta = CHUNK_META_LOOKUP.get(type);
    if (meta && !visited.has(type)) {
      visited.add(type);
      meta.requiresPost.forEach(add);
      result.push(meta);
    }
  };
  for (const meta of CHUNK_META) {
    add(meta.type);
  }
  return result;
}

/**
 * @return {ChunkMeta[]}
 */
export const getAllChunkTypes = () => {
  if (ORDERED_CHUNK_META === null) {
    ORDERED_CHUNK_META = orderChunks();
  }
  return ORDERED_CHUNK_META;
};

/**
 * @template {Chunk} C
 * @template {State} S
 * @param {string} type
 * @param {object} options
 * @param {number=} options.min
 * @param {number=} options.max
 * @param {boolean=} options.sequential
 * @param {string[]=} options.notBefore
 * @param {string[]=} options.notAfter
 * @param {boolean=} options.allowBeforeIHDR
 * @param {boolean=} options.allowAfterIEND
 * @param {string[]=} options.requires
 * @param {string[]=} options.requiresPost
 * @param {(chunk: C, state: S, warnings: string[]) => void} read
 * @param {(state: S, warnings: string[]) => void} post
 */
export function registerChunk(type, {
  min = 0,
  max = Number.POSITIVE_INFINITY,
  sequential = false,
  notBefore = [],
  notAfter = [],
  allowBeforeIHDR = false,
  allowAfterIEND = false,
  requires = [],
  requiresPost = [],
} = {}, read = () => {}, post = () => {}) {
  const data = {
    type: char32(type),
    min,
    max,
    sequential,
    notBefore: notBefore.map(char32),
    notAfter: notAfter.map(char32),
    requires: requires.map(char32),
    requiresPost: requiresPost.map(char32),
    read: /** @type {(chunk: Chunk, state: State, warnings: string[]) => void} */ (read),
    post: /** @type {(state: State, warnings: string[]) => void} */ (post),
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

/**
 * @param {string} name
 * @return {number}
 */
const char32 = (name) => (name.charCodeAt(0) << 24) | (name.charCodeAt(1) << 16) | (name.charCodeAt(2) << 8) | name.charCodeAt(3);
