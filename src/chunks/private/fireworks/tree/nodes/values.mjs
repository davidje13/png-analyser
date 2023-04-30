import { registerNode, getBasicValue } from '../node_registry.mjs';

registerNode('DCE', 'v', { // ??? Entity
  read: (target, value) => {
    const key = getBasicValue(value, 'DCK', 's');
    const val = getBasicValue(value, 'DCV', 's');

    target.toString = () => `${JSON.stringify(key)} = ${JSON.stringify(val)}`;
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
