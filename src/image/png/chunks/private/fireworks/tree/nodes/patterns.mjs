import { getBasicValue, getChild, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('TXBv', {
  read: (target, value) => {
    const name = getBasicValue(value, 'INMs');
    const mask = getChild(value, 'MSKv');

    Object.assign(target, outputNodes('Brush texture: ' + JSON.stringify(name), [mask]));
  },
});

registerNode('TXFv', {
  read: (target, value) => {
    const name = getBasicValue(value, 'INMs');
    const mask = getChild(value, 'MSKv');

    Object.assign(target, outputNodes('Fill texture: ' + JSON.stringify(name), [mask]));
  },
});

registerNode('PATv', { // PATtern (?)
  read: (target, value) => {
    const fill = getChild(value, 'FPLv');
    const fillCol = getChild(value, 'FCLi');
    const fillTex = getChild(value, 'TXFv');
    const fillAntialiasText = getChild(value, 'FETi');

    const brush = getChild(value, 'BPLv');
    const brushCol = getChild(value, 'BCLi');
    const brushTex = getChild(value, 'TXBv');

    target.value = value;

    Object.assign(target, outputNodes('Pattern', [
      fill,
      fill ? fillCol : undefined,
      fill?.usesTexture ? fillTex : undefined,
      fill ? fillAntialiasText : undefined,
      brush,
      brush ? brushCol : undefined,
      brush?.usesTexture ? brushTex : undefined,
    ]));

    if (target.parent) {
      const display = {
        fill: (
          fill?.storage?.category === 'fc_Solid'
            ? colToSVG(fillCol?.storage?.rgba)
            : null
        ) ?? 'none',
        stroke: colToSVG(brushCol?.storage?.rgba) ?? 'black',
        strokeWidth: brush?.storage?.diameter ?? 0,
      };
      target.parent.storage.svgPathDisplay = display;
    }
  },
});

/**
 * @param {[number, number, number, number] | null | undefined} v
 * @return {string | null}
 */
function colToSVG(v) {
  if (!v) {
    return null;
  }
  const [r, g, b, a] = v;
  if (!a) {
    return 'transparent';
  }
  if (a === 255) {
    return '#' + ((b << 16) | (g << 8) | r).toString(16).padStart(6, '0');
  }
  return `rgba(${r},${g},${b},${a})`;
}
