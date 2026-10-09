import { getBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('GRPv', { // GRouP
  read: (target, value, state) => {
    const groupType = getBasicValue(value, 'GRTi') ?? 0; // 0 = regular, 2 = mask (first element = mask, second = masked)
    const elements = getBasicValue(value, 'ELMv') ?? [];
    //const DTA = getBasicValue(value, 'DTAv') ?? [];
    // TODO: apparently can contain smart shape code too

    Object.assign(target, outputNodes(`group [type ${groupType}]`, elements));
  },
});
