import { getBasicValue, registerNode } from '../node_registry.mjs';

registerNode('GRD', 'v', { // GRiD
  read: (target, value, state) => {
    const offsetX = getBasicValue(value, 'GOX', 'f') ?? 0;
    const offsetY = getBasicValue(value, 'GOY', 'f') ?? 0;
    const sizeX = getBasicValue(value, 'GSX', 'f') ?? 0;
    const sizeY = getBasicValue(value, 'GSY', 'f') ?? 0;
    const col = getBasicValue(value, 'GCL', 'i') ?? 0;

    target.toString = () => `grid: ${sizeX}x${sizeY} @${offsetX},${offsetY} (${col.toString(16).padStart(8, '0')})`;
  },
});

registerNode('GDS', 'v', { // GuiDeS
  read: (target, value, state) => {
    const locked = getBasicValue(value, 'GDL', 'b') ?? false;
    const col = getBasicValue(value, 'GDK', 'i') ?? 0;
    const horiz = getBasicValue(value, 'GDH', 'v') ?? [];
    const vert = getBasicValue(value, 'GDV', 'v') ?? [];
    // TODO: extract guide positions

    target.toString = () => `guides: ${horiz.length} x ${vert.length} ${locked ? '[locked]' : '[not locked]'} (${col.toString(16).padStart(8, '0')})`;
  },
});
