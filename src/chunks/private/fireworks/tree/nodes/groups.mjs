import { getBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('GRP', 'v', { // GRouP
  read: (target, value, state) => {
    const groupType = getBasicValue(value, 'GRT', 'i') ?? 0; // 0 = regular, 2 = mask (first element = mask, second = masked)
    const elements = getBasicValue(value, 'ELM', 'v') ?? [];
    //const DTA = getBasicValue(value, 'DTA', 'v') ?? [];
    // TODO: apparently can contain smart shape code too

    Object.assign(target, outputNodes(`group [type ${groupType}]`, elements));
  },
});
