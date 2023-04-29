/**
 * @typedef {{
 *   's': string,
 *   'i': number,
 *   'f': number,
 *   'b': boolean,
 *   'v': ProcessedNode[],
 * }} NodeTypes
 *
 * @typedef {Record<string, unknown> & {
 *   name: string,
 *   toString: () => string,
 *   display: (summary: HTMLElement, content: HTMLElement) => void,
 * }} ProcessedNode
 *
 * @typedef {{
 *   mkbts?: Map<number, import('../mkBT.mjs').mkBTChunk>,
 *   warnings: string[],
 * }} NodeState
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
 *   ((name: string, type: 's', meta: NodeMeta<NodeTypes['s']>) => void) &
 *   ((name: string, type: 'i', meta: NodeMeta<NodeTypes['i']>) => void) &
 *   ((name: string, type: 'f', meta: NodeMeta<NodeTypes['f']>) => void) &
 *   ((name: string, type: 'b', meta: NodeMeta<NodeTypes['b']>) => void) &
 *   ((name: string, type: 'v', meta: NodeMeta<NodeTypes['v']>) => void)
 * )}
 */
export const registerNode = (name, type, meta) => {
  if (KNOWN_NODES.has(name + type)) {
    throw new Error(`duplicate config for ${name}${type}`);
  }
  KNOWN_NODES.set(name + type, meta);
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
 * @template {keyof NodeTypes} T
 * @param {string} name
 * @param {T} type
 * @return {NodeMeta<NodeTypes[T]>}
 */
export function getTypeMeta(name, type) {
  let meta = KNOWN_NODES.get(name + type);
  if (meta) {
    return meta;
  }
  meta = KNOWN_TYPES.get(type);
  return meta ?? GENERIC;
}

/**
 * @param {ProcessedNode[]} list
 * @param {string} name
 * @param {string} type
 * @return {ProcessedNode[]}
 */
export function getChildren(list, name, type) {
  const lookup = name + type;
  return list.filter((n) => n.name === lookup);
}

/**
 * @template {keyof NodeTypes} T
 * @param {ProcessedNode | undefined} node
 * @param {string} name
 * @param {T} type
 * @return {NodeTypes[T] | undefined}
 */
export function nodeBasicValue(node, name, type) {
  if (node?.name !== name + type) {
    return undefined;
  }
  return /** @type {any} */ (node.value);
}

/**
 * @template {keyof NodeTypes} T
 * @param {ProcessedNode[]} list
 * @param {string} name
 * @param {T} type
 * @return {NodeTypes[T][]}
 */
export function getBasicValues(list, name, type) {
  return /** @type {any[]} */ (getChildren(list, name, type).map((n) => n.value));
}

/**
 * @template {keyof NodeTypes} T
 * @param {ProcessedNode[]} list
 * @param {string} name
 * @param {T} type
 * @return {NodeTypes[T] | undefined}
 */
export function getBasicValue(list, name, type) {
  const values = getBasicValues(list, name, type);
  if (values.length > 1) {
    throw new Error(`multiple values for ${name}${type}`);
  }
  return values[0];
}
