import { getBasicValue, registerNode } from '../node_registry.mjs';

registerNode('GRDv', { // GRiD
  read: (target, value, state) => {
    const offsetX = getBasicValue(value, 'GOXf') ?? 0;
    const offsetY = getBasicValue(value, 'GOYf') ?? 0;
    const sizeX = getBasicValue(value, 'GSXf') ?? 0;
    const sizeY = getBasicValue(value, 'GSYf') ?? 0;
    const col = getBasicValue(value, 'GCLi') ?? 0;

    target.toString = () => `grid: ${sizeX}x${sizeY} @${offsetX},${offsetY} (${col.toString(16).padStart(8, '0')})`;
  },
});

registerNode('GDSv', { // GuiDeS
  read: (target, value, state) => {
    const locked = getBasicValue(value, 'GDLb') ?? false;
    const col = getBasicValue(value, 'GDKi') ?? 0;
    const horiz = getBasicValue(value, 'GDHv') ?? [];
    const vert = getBasicValue(value, 'GDVv') ?? [];
    // TODO: extract guide positions

    target.toString = () => `guides: ${horiz.length} x ${vert.length} ${locked ? '[locked]' : '[not locked]'} (${col.toString(16).padStart(8, '0')})`;
  },
});
