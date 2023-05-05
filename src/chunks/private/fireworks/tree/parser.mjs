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

//KNOWN_KEYS.set('WID', {}); // WIDth
//KNOWN_KEYS.set('HIT', {}); // HeIghT
//KNOWN_KEYS.set('RES', {}); // RESolution (DPI)
//KNOWN_KEYS.set('BGC', {}); // BackGround Colour

//KNOWN_KEYS.set('PDC', {}); // Page ???
//KNOWN_KEYS.set('PGN', {}); // PaGe Name

//KNOWN_KEYS.set('LYL', listOf('LAY')); // LaYer List of LAYer
//KNOWN_KEYS.set('LNM', {}); // Layer NaMe
//KNOWN_KEYS.set('DIS', {}); // DISplay

//KNOWN_KEYS.set('XLC', {}); // X LoCation
//KNOWN_KEYS.set('YLC', {}); // Y LoCation
//KNOWN_KEYS.set('PRS', {}); // PReSsure
//KNOWN_KEYS.set('VEL', {}); // VELocity

//KNOWN_KEYS.set('PLL', listOf('BPL')); // ??? List
//KNOWN_KEYS.set('EFD', listOf('EFL')); // EFfect Definition(?) list of EFfect ???
//KNOWN_KEYS.set('FGI', { // Fill Gradient Index(?)
//  readV: ({ findChild }) => ({
//    position: findChild('FGP')?.value, // Fill Gradient Position
//    colour: findChild('FGC')?.value, // Fill Gradient Colour
//  }),
//});
//KNOWN_KEYS.set('CLL', listOf('CEL')); // CeLl List (?) of CELls (?)
//KNOWN_KEYS.set('PAT', {}); // PATtern
//KNOWN_KEYS.set('TXB', {}); // TeXture Background (?)
//KNOWN_KEYS.set('TXF', {}); // TeXture Foreground (?)
//KNOWN_KEYS.set('FON', {}); // FONt
