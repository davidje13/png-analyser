// some details seem to be documented here:
// https://help.adobe.com/archive/en_US/fireworks/cs5/fireworks_cs5_extending.pdf
// (e.g. EffectMoaID values)

import { getTypeMeta } from './node_registry.mjs';
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
    toString: () => `${processedNode.name}: ???`,
    display: (summary, content) => content.append(processedNode.toString()),
  };

  if (nodeToken.type === 'v') {
    meta.read(processedNode, nodeToken.value.map((child) => parse(child, state)), state);
  } else {
    meta.read(processedNode, nodeToken.value, state);
  }
  return processedNode;
}

//const listOf = (childTag) => ({
//  readV: ({ name, value, findChildren }) => {
//    const items = findChildren(childTag);
//    if (items.length !== value.length) {
//      const mismatch = value.map((v) => v.name).filter((name) => name !== childTag);
//      throw new Error(`Unexpected non-${childTag} in ${name}: ${mismatch.join(', ')}`);
//    }
//    return items.map((o) => o.value);
//  },
//});

//const sizedListOf = (lengthTag, childTag) => ({
//  readV: ({ name, value, findChild, findChildren }) => {
//    const count = findChild(lengthTag);
//    const items = findChildren(childTag);
//    if (!count) {
//      throw new Error(`Missing ${lengthTag} in ${name}`);
//    }
//    if (items.length + 1 !== value.length) {
//      throw new Error(`Unexpected non-${childTag} in ${name}`);
//    }
//    if (count.value !== items.length) {
//      throw new Error(`${name} length in ${lengthTag} does not match count of ${childTag}`);
//    }
//    return items.map((o) => o.value);
//  },
//});

//KNOWN_KEYS.set('GRD', {}); // GRiD
//KNOWN_KEYS.set('GOX', {}); // Grid Offset X
//KNOWN_KEYS.set('GOY', {}); // Grid Offset Y
//KNOWN_KEYS.set('GSX', {}); // Grid Size X
//KNOWN_KEYS.set('GSY', {}); // Grid Size Y
//KNOWN_KEYS.set('GCL', {}); // Grid CoLour

//KNOWN_KEYS.set('WID', {}); // WIDth
//KNOWN_KEYS.set('HIT', {}); // HeIghT
//KNOWN_KEYS.set('RES', {}); // RESolution (DPI)
//KNOWN_KEYS.set('BGC', {}); // BackGround Colour

//KNOWN_KEYS.set('PDC', {}); // Page ???
//KNOWN_KEYS.set('PGN', {}); // PaGe Name

//KNOWN_KEYS.set('LYL', listOf('LAY')); // LaYer List of LAYer
//KNOWN_KEYS.set('LNM', {}); // Layer NaMe
//KNOWN_KEYS.set('DIS', {}); // DISplay

//KNOWN_KEYS.set('GRP', {}); // GRouP

//KNOWN_KEYS.set('PTH', {}); // PaTH
//KNOWN_KEYS.set('PBL', listOf('PBP')); // Path Boundary(?) List of Path Boundary(?) ??
//KNOWN_KEYS.set('PBT', {}); // Path Boundary(?) Point
//KNOWN_KEYS.set('PCL', {}); // ???
////KNOWN_KEYS.set('PBP', sizedListOf('PPC', 'PBP', ['ISC', 'BSL'])); // ???
////KNOWN_KEYS.set('PPL', sizedListOf('PPC', 'PPT', ['ISC'])); // Path Point List
//KNOWN_KEYS.set('PPT', {}); // Path PoinT
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
//KNOWN_KEYS.set('FGV', sizedListOf('FNC', 'FGI')); // Fill Gradient ????
//KNOWN_KEYS.set('FG0', sizedListOf('FNC', 'FGI')); // Fill Gradient 0
//KNOWN_KEYS.set('FG1', sizedListOf('FNC', 'FGI')); // Fill Gradient 1
//KNOWN_KEYS.set('CLL', listOf('CEL')); // CeLl List (?) of CELls (?)
//KNOWN_KEYS.set('PAT', {}); // PATtern
//KNOWN_KEYS.set('BCL', {}); // Background CoLour
//KNOWN_KEYS.set('FCL', {}); // Foreground CoLour
//KNOWN_KEYS.set('FPL', {}); // ??
//KNOWN_KEYS.set('TXB', {}); // TeXture Background (?)
//KNOWN_KEYS.set('TXF', {}); // TeXture Foreground (?)
//KNOWN_KEYS.set('INM', {}); // ???
//KNOWN_KEYS.set('LFT', {}); // LeFT
//KNOWN_KEYS.set('TOP', {}); // TOP
//KNOWN_KEYS.set('RIT', {}); // RIghT
//KNOWN_KEYS.set('BOT', {}); // BOTtom
//KNOWN_KEYS.set('XLC', {}); // X ???
//KNOWN_KEYS.set('YLC', {}); // Y ???
//KNOWN_KEYS.set('LFA', {}); // ???
//KNOWN_KEYS.set('TOA', {}); // ???
//KNOWN_KEYS.set('RIA', {}); // ???
//KNOWN_KEYS.set('BOA', {}); // ???
//KNOWN_KEYS.set('TFT', {}); // ???
//KNOWN_KEYS.set('FOA', {}); // ???
//KNOWN_KEYS.set('LCK', {}); // LoCKed
//KNOWN_KEYS.set('FON', {}); // FONt
//KNOWN_KEYS.set('TRN', {}); // ??? (text content)
