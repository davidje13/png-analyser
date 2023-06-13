import { getBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('PRI', 'v', { // PRImitive (?)
  read: (target, value, state) => {
    Object.assign(target, outputNodes('Primitive', value));
  },
});

registerNode('RCT', 'v', { // ReCTangle
  read: (target, value, state) => {
    const top = getBasicValue(value, 'TOP', 'f');
    const left = getBasicValue(value, 'LFT', 'f');
    const right = getBasicValue(value, 'RIT', 'f');
    const bottom = getBasicValue(value, 'BOT', 'f');
    const cornerRad = getBasicValue(value, 'RDS', 'f') ?? 0;

    target.toString = () => `Rectangle: ${left}, ${top} - ${right}, ${bottom}. Radius = ${cornerRad * 100}%`;
  },
});

registerNode('RDM', 'b', { // ???
  read: (target, value) => {
    // RDS always denotes a percentage, but if "px" is selected in the UI, this
    // flag is set to true and the percentage value will be recalculated when
    // the shape size changes to maintain the same pixel size.
    target.toString = () => value ? 'fixed radius' : 'radius scales with shape';
  },
});
