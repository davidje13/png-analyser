import { registerNode, getBasicValue, getChildren } from '../node_registry.mjs';

registerNode('DCE', 'v', { // ??? Entity
  read: (target, value) => {
    const key = getBasicValue(value, 'DCK', 's');
    const val = getBasicValue(value, 'DCV', 's');
    target.key = key;
    target.val = val;

    target.toString = () => `${JSON.stringify(key)} = ${JSON.stringify(val)}`;
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
