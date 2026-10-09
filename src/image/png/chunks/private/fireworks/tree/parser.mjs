// some details seem to be documented here:
// https://help.adobe.com/archive/en_US/fireworks/cs5/fireworks_cs5_extending.pdf
// (e.g. EffectMoaID values)

import { getTypeMeta } from './node_registry.mjs';
import './nodes/index.mjs';

/**
 * @typedef {import('./node_registry.mjs').ProcessedNode} ProcessedNode
 *
 * @param {ProcessedNode | null} parent
 * @param {import('./tokeniser.mjs').NodeToken} nodeToken
 * @param {import('./node_registry.mjs').NodeState} state
 * @param {string} rawID
 * @return {ProcessedNode}
 */
export function parse(parent, nodeToken, state, rawID = '') {
  const meta = getTypeMeta(nodeToken.id);

  /** @type {ProcessedNode} */ const processedNode = {
    parent,
    id: nodeToken.id,
    toString: () => `${processedNode.id}: ???`,
    display: (container) => container.append(processedNode.toString()),
    storage: {},
  };

  if (nodeToken.type === 'v') {
    /** @type {ProcessedNode[]} */ const value = [];
    const counters = new Map();
    for (const sub of nodeToken.value) {
      const count = counters.get(sub.id) ?? 0;
      counters.set(sub.id, count + 1);
      let subRawID = `${rawID}.${sub.id}`;
      if (count > 1) {
        subRawID += `-${count}`;
      }
      value.push(parse(processedNode, sub, state, subRawID));
    }
    meta.read(processedNode, value, state);
    const ds = processedNode.display.bind(processedNode);
    processedNode.display = (container) => {
      ds(container);
      const rawLink = document.createElement('a');
      rawLink.textContent = '[raw]';
      rawLink.setAttribute('href', `#${encodeURIComponent(rawID)}`);
      (container.querySelector('& > details > summary') ?? container).append(' ', rawLink);
    };
    if (!processedNode.toSVG) {
      processedNode.toSVG = (parts) => {
        for (let i = value.length; (i--) > 0;) {
          value[i].toSVG?.(parts);
        }
      };
      processedNode.hasSVG = () => value.some((n) => n.hasSVG?.());
    }
  } else {
    meta.read(processedNode, nodeToken.value, state);
  }
  if (processedNode.toSVG && !processedNode.hasSVG) {
    processedNode.hasSVG = () => true;
  }
  return processedNode;
}
