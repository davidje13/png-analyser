import { registerNode, getBasicValue, getChildren } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('DCE', 'v', { // ??? Entity
  read: (target, value) => {
    const key = getBasicValue(value, 'DCK', 's');
    target.key = key;

    const val1 = getBasicValue(value, 'DCV', 's');
    const val2 = getBasicValue(value, 'GPL', 'v');
    const val3 = getBasicValue(value, 'GDT', 'v');

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

registerNode('GPT', 'v', {
  read: (target, value) => {
    const x = getBasicValue(value, 'XLC', 'f') ?? 0;
    const y = getBasicValue(value, 'YLC', 'f') ?? 0;
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
  const values = getChildren(list, 'DCE', 'v').filter((n) => n.key === key);
  if (values.length > 1) {
    throw new Error(`multiple values for ${key}`);
  }
  return /** @type {string | undefined} */ (values[0]?.val);
}

registerNode('MTX', 'v', { // MaTriX
  read: (target, value) => {
    const m00 = getBasicValue(value, 'M00', 'f') ?? 1;
    const m01 = getBasicValue(value, 'M01', 'f') ?? 0;
    const m02 = getBasicValue(value, 'M02', 'f') ?? 0;
    const m10 = getBasicValue(value, 'M10', 'f') ?? 0;
    const m11 = getBasicValue(value, 'M11', 'f') ?? 1;
    const m12 = getBasicValue(value, 'M12', 'f') ?? 0;
    const m20 = getBasicValue(value, 'M20', 'f') ?? 0;
    const m21 = getBasicValue(value, 'M21', 'f') ?? 0;
    const m22 = getBasicValue(value, 'M22', 'f') ?? 1;

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

registerNode('LCK', 'b', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => value ? 'locked' : 'not locked';
  },
});

registerNode('VIS', 'b', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => value ? 'visible' : 'hidden';
  },
});

registerNode('OPA', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `opacity ${(value * 0.1).toFixed(1)}%`;
  },
});

registerNode('BCL', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `brush colour: ${value.toString(16).padStart(8, '0')}`;
  },
});

registerNode('FCL', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill colour: ${value.toString(16).padStart(8, '0')}`;
  },
});

registerNode('FOT', 'b', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill on top: ${value}`;
  },
});

registerNode('BRP', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `brush placement: ${value}`;
  },
});

registerNode('TOX', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `texture offset X: ${value}`;
  },
});

registerNode('TOY', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `texture offset Y: ${value}`;
  },
});

registerNode('PSX', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 1 (S) X: ${value}`;
  },
});

registerNode('PSY', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 1 (S) Y: ${value}`;
  },
});

registerNode('PEX', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 2 (E) X: ${value}`;
  },
});

registerNode('PEY', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 2 (E) Y: ${value}`;
  },
});

registerNode('PFX', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 3 (F) X: ${value}`;
  },
});

registerNode('PFY', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `fill handle 3 (F) Y: ${value}`;
  },
});

registerNode('RND', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `random seed: ${value.toString(16).padStart(6, '0')}`;
  },
});

registerNode('LFT', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `left: ${value}`;
  },
});

registerNode('TOP', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `top: ${value}`;
  },
});

registerNode('RIT', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `right: ${value}`;
  },
});

registerNode('BOT', 'f', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `bottom: ${value}`;
  },
});

registerNode('OBN', 's', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `object name: ${value}`;
  },
});

registerNode('ORI', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `orientation: ${value}`;
  },
});

// frames seem to be stored as one CELv per frame inside CLLv blocks, with VIFv containing one VISb per frame too (both live in LAYv).
registerNode('FRC', 'i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `frame count: ${value}`;
  },
});

registerNode('JSS', 's', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `script:\n${value}`;
  },
});
