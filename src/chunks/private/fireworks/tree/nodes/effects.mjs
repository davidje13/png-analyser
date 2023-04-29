import { getBasicValue, registerNode } from '../node_registry.mjs';

registerNode('DCE', 'v', { // ??? Entity
  read: (target, value) => {
    const key = getBasicValue(value, 'DCK', 's');
    const val = getBasicValue(value, 'DCV', 's');

    target.toString = () => `${JSON.stringify(key)} = ${JSON.stringify(val)}`;
  },
});
