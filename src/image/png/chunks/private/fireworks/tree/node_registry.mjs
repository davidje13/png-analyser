/**
 * @typedef {{
 *   's': string,
 *   'i': number,
 *   'f': number,
 *   'b': boolean,
 *   'v': ProcessedNode[],
 * }} NodeTypes
 *
 * @typedef {`${string}${keyof NodeTypes}`} NodeID
 *
 * @typedef {{
 *   element: SVGElement,
 *   bounds: {
 *     minX: number,
 *     minY: number,
 *     maxX: number,
 *     maxY: number,
 *   },
 * }} SVGPart
 *
 * @typedef {Record<string, unknown> & {
 *   id: string,
 *   toString: () => string,
 *   display: (container: HTMLElement) => void,
 *   toSVG?: (target: SVGPart[]) => void,
 *   hasSVG?: () => boolean,
 *   parent: ProcessedNode | null,
 *   storage: Record<string, any>,
 * }} ProcessedNode
 *
 * @typedef {{
 *   mkbts?: Map<number, import('../mkBT.mjs').mkBTChunk>,
 *   warnings: string[],
 * }} NodeState
 */

/**
 * @template {NodeID} T
 * @typedef {(
 *   T extends `${string}s` ? string :
 *   T extends `${string}i` ? number :
 *   T extends `${string}f` ? number :
 *   T extends `${string}b` ? boolean :
 *   T extends `${string}v` ? ProcessedNode[] :
 *   never
 * )} ValueType
 */

/**
 * @template V
 * @typedef {{
 *   read: (target: ProcessedNode, value: V, state: NodeState) => void,
 * }} NodeMeta
 */

/** @type {Map<string, NodeMeta<any>>} */ const KNOWN_NODES = new Map();
/** @type {Map<string, NodeMeta<any>>} */ const KNOWN_TYPES = new Map();
/** @type {NodeMeta<any>} */ let GENERIC = { read: () => null };

/**
 * @type {(
 *   ((id: `${string}s`, meta: NodeMeta<NodeTypes['s']>) => void) &
 *   ((id: `${string}i`, meta: NodeMeta<NodeTypes['i']>) => void) &
 *   ((id: `${string}f`, meta: NodeMeta<NodeTypes['f']>) => void) &
 *   ((id: `${string}b`, meta: NodeMeta<NodeTypes['b']>) => void) &
 *   ((id: `${string}v`, meta: NodeMeta<NodeTypes['v']>) => void)
 * )}
 */
export const registerNode = (id, meta) => {
  if (KNOWN_NODES.has(id)) {
    throw new Error(`duplicate config for ${id}`);
  }
  KNOWN_NODES.set(id, meta);
};

/**
 * @type {(
 *   ((type: 's', meta: NodeMeta<NodeTypes['s']>) => void) &
 *   ((type: 'i', meta: NodeMeta<NodeTypes['i']>) => void) &
 *   ((type: 'f', meta: NodeMeta<NodeTypes['f']>) => void) &
 *   ((type: 'b', meta: NodeMeta<NodeTypes['b']>) => void) &
 *   ((type: 'v', meta: NodeMeta<NodeTypes['v']>) => void) &
 *   ((type: null, meta: NodeMeta<NodeTypes[keyof NodeTypes]>) => void)
 * )}
 */
export const registerType = (type, meta) => {
  if (!type) {
    GENERIC = meta;
    return;
  }
  if (KNOWN_TYPES.has(type)) {
    throw new Error(`duplicate config for ${type}`);
  }
  KNOWN_TYPES.set(type, meta);
};

/**
 * @template {NodeID} T
 * @param {T} id
 * @return {NodeMeta<ValueType<T>>}
 */
export function getTypeMeta(id) {
  let meta = KNOWN_NODES.get(id);
  if (meta) {
    return meta;
  }
  meta = KNOWN_TYPES.get(id[id.length - 1]);
  return meta ?? GENERIC;
}

/**
 * @param {ProcessedNode[]} list
 * @param {string} id
 * @return {ProcessedNode[]}
 */
export function getChildren(list, id) {
  return list.filter((n) => n.id === id);
}

/**
 * @template {NodeID} T
 * @param {ProcessedNode | undefined} node
 * @param {T} id
 * @return {ValueType<T> | undefined}
 */
export function nodeBasicValue(node, id) {
  if (node?.id !== id) {
    return undefined;
  }
  return /** @type {any} */ (node.value);
}

/**
 * @template {NodeID} T
 * @param {ProcessedNode[]} list
 * @param {T} id
 * @return {ValueType<T>[]}
 */
export function getBasicValues(list, id) {
  return /** @type {any[]} */ (getChildren(list, id).map((n) => n.value));
}

/**
 * @template {NodeID} T
 * @param {ProcessedNode[]} list
 * @param {T} id
 * @return {ValueType<T> | undefined}
 */
export function getBasicValue(list, id) {
  const values = getBasicValues(list, id);
  if (values.length > 1) {
    throw new Error(`multiple values for ${id}`);
  }
  return values[0];
}

/**
 * @param {ProcessedNode[]} list
 * @param {NodeID} id
 * @return {ProcessedNode | undefined}
 */
export function getChild(list, id) {
  const values = getChildren(list, id);
  if (values.length > 1) {
    throw new Error(`multiple values for ${id}`);
  }
  return values[0];
}
