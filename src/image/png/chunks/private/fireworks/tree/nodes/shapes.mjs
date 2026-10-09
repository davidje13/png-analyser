import { getBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('PRIv', { // PRImitive (?)
  read: (target, value, state) => {
    Object.assign(target, outputNodes('Primitive', value));
  },
});

registerNode('RCTv', { // ReCTangle
  read: (target, value, state) => {
    const top = getBasicValue(value, 'TOPf');
    const left = getBasicValue(value, 'LFTf');
    const right = getBasicValue(value, 'RITf');
    const bottom = getBasicValue(value, 'BOTf');
    const cornerRad = getBasicValue(value, 'RDSf') ?? 0;

    target.toString = () => `Rectangle: ${left}, ${top} - ${right}, ${bottom}. Radius = ${cornerRad * 100}%`;
  },
});

registerNode('RDMb', { // ???
  read: (target, value) => {
    // RDS always denotes a percentage, but if "px" is selected in the UI, this
    // flag is set to true and the percentage value will be recalculated when
    // the shape size changes to maintain the same pixel size.
    target.toString = () => value ? 'fixed radius' : 'radius scales with shape';
  },
});
