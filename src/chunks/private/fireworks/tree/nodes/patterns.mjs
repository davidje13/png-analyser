import { getBasicValue, getChild, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('TXB', 'v', {
  read: (target, value) => {
    const name = getBasicValue(value, 'INM', 's');
    const mask = getChild(value, 'MSK', 'v');

    Object.assign(target, outputNodes('Brush texture: ' + JSON.stringify(name), [mask]));
  },
});

registerNode('TXF', 'v', {
  read: (target, value) => {
    const name = getBasicValue(value, 'INM', 's');
    const mask = getChild(value, 'MSK', 'v');

    Object.assign(target, outputNodes('Fill texture: ' + JSON.stringify(name), [mask]));
  },
});

registerNode('PAT', 'v', { // PATtern (?)
  read: (target, value) => {
    const fill = getChild(value, 'FPL', 'v');
    const fillCol = getChild(value, 'FCL', 'i');
    const fillTex = getChild(value, 'TXF', 'v');
    const fillAntialiasText = getChild(value, 'FET', 'i');

    const brush = getChild(value, 'BPL', 'v');
    const brushCol = getChild(value, 'BCL', 'i');
    const brushTex = getChild(value, 'TXB', 'v');

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
  },
});
