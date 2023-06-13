import { getBasicValue, registerNode } from '../node_registry.mjs';

registerNode('URL', 'v', { // ???
  read: (target, value, state) => {
    //const foregroundCol = getBasicValue(value, 'FCL', 'i');
    const left = getBasicValue(value, 'LFT', 'f') ?? 0;
    const top = getBasicValue(value, 'TOP', 'f') ?? 0;
    const right = getBasicValue(value, 'RIT', 'f') ?? 0;
    const bottom = getBasicValue(value, 'BOT', 'f') ?? 0;
    const name = getBasicValue(value, 'FIL', 's') ?? '';
    const tdTagText = getBasicValue(value, 'TDT', 's') ?? '';
    const TSL = getBasicValue(value, 'TSL', 'i') ?? 0;
    const MSN = getBasicValue(value, 'MSN', 'i') ?? 0;
    const DTA = getBasicValue(value, 'DTA', 'v') ?? [];
    const locked = getBasicValue(value, 'LCK', 'b') ?? false;

    target.toString = () => `${left}, ${top} - ${right}, ${bottom} ${JSON.stringify(name)}`;
  },
});
