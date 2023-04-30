import { rgba } from '../../../../../pretty.mjs';
import { getBasicValue, nodeBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

const EXCLUDE = ['FONs', 'PTSf', 'BOLb', 'ITLb', 'UNDb', 'LEDf', 'FOTb', /*'HSCf', 'KRNf', 'RKNf', 'BLSf', 'LDMi', 'JSTi', 'PINf', 'PSBf', 'PSAf',*/ 'TFSv'];

registerNode('TXT', 'v', { // TeXT
  read: (target, value, state) => {
    const left = getBasicValue(value, 'LFT', 'f') ?? 0;
    const top = getBasicValue(value, 'TOP', 'f') ?? 0;
    const right = getBasicValue(value, 'RIT', 'f') ?? 0;
    const bottom = getBasicValue(value, 'BOT', 'f') ?? 0;

    const pattern = getBasicValue(value, 'PAT', 'v') ?? [];

    const fontState = {
      fillColour: getBasicValue(pattern, 'FCL', 'i'),
      lineColour: getBasicValue(pattern, 'BCL', 'i'),
      outlined: getBasicValue(value, 'FOT', 'b') ?? false,
      lineWidth: 1,
      fillOverStroke: true,
      font: getBasicValue(value, 'FON', 's'),
      pointSize: getBasicValue(value, 'PTS', 'f'),
      bold: getBasicValue(value, 'BOL', 'b'),
      italic: getBasicValue(value, 'ITL', 'b'),
      underline: getBasicValue(value, 'UND', 'b'),
      HSC: getBasicValue(value, 'HSC', 'f'),
      KRN: getBasicValue(value, 'KRN', 'f'),
      RKN: getBasicValue(value, 'RKN', 'f'),
      BLS: getBasicValue(value, 'BLS', 'f'),
      lineHeight: getBasicValue(value, 'LED', 'f') ?? 1,
      LDM: getBasicValue(value, 'LDM', 'i'),
      JST: getBasicValue(value, 'JST', 'i'),
      PIN: getBasicValue(value, 'PIN', 'f'),
      PSB: getBasicValue(value, 'PSB', 'f'),
      PSA: getBasicValue(value, 'PSA', 'f'),
    };

    const parts = getBasicValue(value, 'TFS', 'v') ?? [];
    /** @type {(typeof fontState & { text: string })[]} */ const strings = [];
    for (const part of parts) {
      switch (part.name) {
        case 'FCLi': fontState.fillColour = nodeBasicValue(part, 'FCL', 'i'); break;
        //case 'FOTb': fontState.outlined = nodeBasicValue(part, 'FOT', 'b') ?? false; break;
        case 'FONs': fontState.font = nodeBasicValue(part, 'FON', 's'); break;
        case 'FONs': fontState.font = nodeBasicValue(part, 'FON', 's'); break;
        case 'PTSf': fontState.pointSize = nodeBasicValue(part, 'PTS', 'f'); break;
        case 'BOLb': fontState.bold = nodeBasicValue(part, 'BOL', 'b'); break;
        case 'ITLb': fontState.italic = nodeBasicValue(part, 'ITL', 'b'); break;
        case 'UNDb': fontState.underline = nodeBasicValue(part, 'UND', 'b'); break;
        case 'HSCf': fontState.HSC = nodeBasicValue(part, 'HSC', 'f'); break;
        //case 'KRNf': fontState.KRN = nodeBasicValue(part, 'KRN', 'f'); break;
        case 'RKNf': fontState.RKN = nodeBasicValue(part, 'RKN', 'f'); break;
        case 'BLSf': fontState.BLS = nodeBasicValue(part, 'BLS', 'f'); break;
        case 'LEDf': fontState.lineHeight = nodeBasicValue(part, 'LED', 'f') ?? 1; break;
        case 'LDMi': fontState.LDM = nodeBasicValue(part, 'LDM', 'i'); break;
        case 'JSTi': fontState.JST = nodeBasicValue(part, 'JST', 'i'); break;
        case 'PINf': fontState.PIN = nodeBasicValue(part, 'PIN', 'f'); break;
        case 'PSBf': fontState.PSB = nodeBasicValue(part, 'PSB', 'f'); break;
        case 'PSAf': fontState.PSA = nodeBasicValue(part, 'PSA', 'f'); break;
        case 'TRNs':
          strings.push({
            text: (nodeBasicValue(part, 'TRN', 's') ?? '').replace(/\r/g, '\n'),
            ...fontState,
          });
          break;
        default:
          state.warnings.push(`Unknown text formatter ${part.name}`);
      }
    }

    const displayNodes = value.filter(({ name }) => !EXCLUDE.includes(name));
    displayNodes.push({
      name: 'TFSv',
      toString: () => JSON.stringify(strings.map((s) => s.text).join('')),
      display: (summary, content) => {
        const oStr = document.createElement('div');
        oStr.style.width = `${right - left}px`;
        oStr.style.height = `${bottom - top}px`;
        oStr.style.lineHeight = '0';
        for (const frag of strings) {
          const oFrag = document.createElement('span');
          oFrag.style.color = rgba(frag.fillColour ?? 0);
          // TODO: this is an approximation of the stroke, as it does not use the chosen brush
          if (frag.outlined && frag.lineWidth) {
            const w = frag.lineWidth;
            const col = rgba(frag.lineColour ?? 0);
            if (frag.fillOverStroke) {
              const w2 = Math.SQRT1_2 * w;
              oFrag.style.textShadow = [
                `0 ${w}px ${col}`,
                `${w}px 0 ${col}`,
                `0 ${-w}px ${col}`,
                `${-w}px 0 ${col}`,
                `${w2}px ${w2}px ${col}`,
                `${w2}px ${-w2}px ${col}`,
                `${-w2}px ${-w2}px ${col}`,
                `${-w2}px ${w2}px ${col}`,
              ].join(',');
            } else {
              oFrag.style.webkitTextStroke = `${w}px ${col}`;
            }
          }
          oFrag.style.fontFamily = frag.font ?? '';
          oFrag.style.fontSize = `${frag.pointSize ?? 12}px`;
          oFrag.style.lineHeight = frag.lineHeight.toString();
          oFrag.style.fontWeight = frag.bold ? 'bold' : 'normal';
          oFrag.style.fontStyle = frag.italic ? 'italic' : 'normal';
          oFrag.style.textDecoration = frag.underline ? 'underline' : 'none';
          oFrag.append(frag.text);
          oStr.append(oFrag);
        }
        content.append(oStr);
      },
    });

    target.value = value;
    Object.assign(target, outputNodes(target.name, displayNodes));
  },
});
