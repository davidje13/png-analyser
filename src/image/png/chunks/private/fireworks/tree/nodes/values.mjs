import { asColourDiv, disclosure, termCol, termReset } from '../../../../../../../display/pretty.mjs';
import { registerNode, getBasicValue, getChildren } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('DCEv', { // ??? Entity
  read: (target, value) => {
    const key = getBasicValue(value, 'DCKs');
    target.key = key;

    const val1 = getBasicValue(value, 'DCVs');
    const val2 = getBasicValue(value, 'GPLv');
    const val3 = getBasicValue(value, 'GDTv');

    if (val1) {
      target.val = val1;
      target.toString = () => `${JSON.stringify(key)} = ${JSON.stringify(val1)}`;
    } else if (val2) {
      target.val = val2;
      Object.assign(target, outputNodes(JSON.stringify(key), val2));
    } else if (val3) {
      target.val = val3;
      Object.assign(target, outputNodes(JSON.stringify(key), val3));
    } else {
      target.val = undefined;
      target.toString = () => `${JSON.stringify(key)} = -`;
    }
  },
});

registerNode('GPTv', {
  read: (target, value) => {
    const x = getBasicValue(value, 'XLCf') ?? 0;
    const y = getBasicValue(value, 'YLCf') ?? 0;
    target.x = x;
    target.y = y;
    target.toString = () => `${x}, ${y}`;
  },
});

/**
 * @param {import('../node_registry.mjs').ProcessedNode[]} list
 * @param {string} key
 * @return {string | undefined}
 */
export function getEntityValue(list, key) {
  const values = getChildren(list, 'DCEv').filter((n) => n.key === key);
  if (values.length > 1) {
    throw new Error(`multiple values for ${key}`);
  }
  return /** @type {string | undefined} */ (values[0]?.val);
}

registerNode('MTXv', { // MaTriX
  read: (target, value) => {
    const m00 = getBasicValue(value, 'M00f') ?? 1;
    const m01 = getBasicValue(value, 'M01f') ?? 0;
    const m02 = getBasicValue(value, 'M02f') ?? 0;
    const m10 = getBasicValue(value, 'M10f') ?? 0;
    const m11 = getBasicValue(value, 'M11f') ?? 1;
    const m12 = getBasicValue(value, 'M12f') ?? 0;
    const m20 = getBasicValue(value, 'M20f') ?? 0;
    const m21 = getBasicValue(value, 'M21f') ?? 0;
    const m22 = getBasicValue(value, 'M22f') ?? 1;

    const mat = [
      m00, m01, m02,
      m10, m11, m12,
      m20, m21, m22,
    ];
    //const mat = [
    //  m00, m10, m20,
    //  m01, m11, m21,
    //  m02, m12, m22,
    //];
    target.matrix = mat;

    target.toString = () => [
      '3x3 Matrix:',
      `${mat[0].toFixed(5).padStart(10, ' ')} ${mat[1].toFixed(5).padStart(10, ' ')} ${mat[2].toFixed(5).padStart(10, ' ')}`,
      `${mat[3].toFixed(5).padStart(10, ' ')} ${mat[4].toFixed(5).padStart(10, ' ')} ${mat[5].toFixed(5).padStart(10, ' ')}`,
      `${mat[6].toFixed(5).padStart(10, ' ')} ${mat[7].toFixed(5).padStart(10, ' ')} ${mat[8].toFixed(5).padStart(10, ' ')}`,
    ].join('\n');
  },
});

registerNode('LCKb', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => value ? 'locked' : 'not locked';
  },
});

registerNode('VISb', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => value ? 'visible' : 'hidden';
  },
});

// TODO
const BLEND_MODES = [
  'normal', // 0
  '',
  '',
  '',
  '',
  '',
  '',
  'disolve',
  '',
  '',
  '', // 10
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 20
  '',
  '',
  '',
  '',
  'erase',
  '',
  '',
  '',
  '',
  'average', // 30
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 40
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'xor', // 50
];

registerNode('BLDi', { // omitted = 0
  read: (target, value) => {
    target.value = value;
    target.toString = () => `blend mode: ${BLEND_MODES[value] || `unknown (${value})`}`;
  },
});

registerNode('DISb', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => value ? 'not collapsed' : 'collapsed';
  },
});

// MKBv = "master" page (contains layers shared between pages, and also a copy of page 1?)
// -> LSMv contains "shared" layers (LSEv)
// -> LYLv contains LSAv for referencing shared layers using UIDs
// PDCv = page (one per page)

// sub-layers appear inside ELMv (alongside elements)

registerNode('OPAi', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `opacity ${(value * 0.1).toFixed(1)}%`;
  },
});

registerNode('BCLi', { // Brush CoLour
  read: (target, value) => {
    const r = value & 0xFF;
    const g = (value >>> 8) & 0xFF;
    const b = (value >>> 16) & 0xFF;
    const a = (value >>> 24) & 0xFF;
    target.value = value;
    target.storage.rgba = [r, g, b, a];
    target.toString = () => `brush colour: ${value.toString(16).padStart(8, '0')}`;
  },
});

registerNode('FCLi', { // Fill CoLour
  read: (target, value) => {
    const r = value & 0xFF;
    const g = (value >>> 8) & 0xFF;
    const b = (value >>> 16) & 0xFF;
    const a = (value >>> 24) & 0xFF;
    target.value = value;
    target.storage.rgba = [r, g, b, a];
    target.toString = () => `fill colour: ${value.toString(16).padStart(8, '0')}`;
  },
});

registerNode('BGCi', { // BackGround Colour
  read: (target, value) => {
    target.toString = () => `Background: ${termCol(value)} ${value.toString(16).padStart(8, '0')} ${termReset}`;

    target.display = (container) => container.append(disclosure('Background', asColourDiv(value, true), true));
  },
});

registerNode('FETi', { // TODO
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill text antialiasing: ${['none', 'antialias'][value] || `unknown ${value}`}`;
  },
});

registerNode('FOTb', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill on top: ${value}`;
  },
});

registerNode('EOFb', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill rule: ${value ? 'even-odd' : 'nonzero'}`;
  },
});

const PLACEMENTS = [
  'inside',
  'middle',
  'outside',
];

registerNode('BRPi', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `brush placement: ${PLACEMENTS[value] || `unknown ${value}`}`;
  },
});

registerNode('TOXf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `texture offset X: ${value}`;
  },
});

registerNode('TOYf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `texture offset Y: ${value}`;
  },
});

registerNode('PSXf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 1 (S) X: ${value}`;
  },
});

registerNode('PSYf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 1 (S) Y: ${value}`;
  },
});

registerNode('PEXf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 2 (E) X: ${value}`;
  },
});

registerNode('PEYf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 2 (E) Y: ${value}`;
  },
});

registerNode('PFXf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 3 (F) X: ${value}`;
  },
});

registerNode('PFYf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 3 (F) Y: ${value}`;
  },
});

registerNode('RNDi', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `random seed: ${value.toString(16).padStart(6, '0')}`;
  },
});

registerNode('LFTf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `left: ${value}`;
  },
});

registerNode('TOPf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `top: ${value}`;
  },
});

registerNode('RITf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `right: ${value}`;
  },
});

registerNode('BOTf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `bottom: ${value}`;
  },
});

registerNode('OBNs', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `object name: ${value}`;
  },
});

registerNode('ORIi', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `orientation: ${value}`;
  },
});

// frames seem to be stored as one CELv per frame inside CLLv blocks, with VIFv containing one VISb per frame too (both live in LAYv).
registerNode('FRCi', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `frame count: ${value}`;
  },
});

registerNode('JSSs', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `script:\n${value}`;
  },
});

registerNode('WIDf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `width: ${value}`;
  },
});

registerNode('HITf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `height: ${value}`;
  },
});

registerNode('RESf', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `resolution: ${value}`;
  },
});

registerNode('RSUi', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => 'resolution units: ' + (value === 0 ? 'pixels per inch' : 'pixels per cm');
  },
});

registerNode('LNMs', { // Layer NaMe
  read: (target, value) => {
    target.toString = () => `layer name: ${JSON.stringify(value)}`;
  },
});

registerNode('PIDs', { // Page ID
  read: (target, value) => {
    target.toString = () => `page ID: ${JSON.stringify(value)}`;
  },
});

registerNode('PGNs', { // PaGe Name
  read: (target, value) => {
    target.toString = () => `page name: ${JSON.stringify(value)}`;
  },
});

registerNode('ISPb', { // IS Primary
  read: (target, value) => {
    target.toString = () => value ? 'primary' : 'not primary';
  },
});
