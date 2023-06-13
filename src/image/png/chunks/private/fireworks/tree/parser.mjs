// some details seem to be documented here:
// https://help.adobe.com/archive/en_US/fireworks/cs5/fireworks_cs5_extending.pdf
// (e.g. EffectMoaID values)

import { getTypeMeta } from './node_registry.mjs';
import { outputNodes } from './nodes/generic.mjs';
import './nodes/index.mjs';

/**
 * @typedef {import('./node_registry.mjs').ProcessedNode} ProcessedNode
 *
 * @param {import('./tokeniser.mjs').NodeToken} nodeToken
 * @param {import('./node_registry.mjs').NodeState} state
 * @return {ProcessedNode}
 */
export function parse(nodeToken, state) {
  const meta = getTypeMeta(nodeToken.name, nodeToken.type);

  /** @type {ProcessedNode} */ const processedNode = {
    name: nodeToken.name + nodeToken.type,
    visited: false,
    toString: () => `${processedNode.name}: ???`,
    display: (summary, content) => content.append(processedNode.toString()),
  };
  const fallbackDisplay = processedNode.display;

  if (nodeToken.type === 'v') {
    const value = nodeToken.value.map((child) => parse(child, state));
    meta.read(processedNode, value, state);
    const unvisited = value.filter((n) => !n.visited);
    if (unvisited.length) {
      const ts = processedNode.toString.bind(processedNode);
      const ds = processedNode.display;
      const dsb = ds.bind(processedNode);
      const out = outputNodes('Additional child nodes', unvisited);
      processedNode.toString = () => ts() + '\n' + out.toString();
      processedNode.display = (summary, content) => {
        if (ds === fallbackDisplay) {
          content.append(ts());
        } else {
          dsb(summary, content);
        }
        out.display(summary, content);
      };
    }
  } else {
    meta.read(processedNode, nodeToken.value, state);
  }
  return processedNode;
}
