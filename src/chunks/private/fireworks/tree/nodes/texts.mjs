import { rgba } from '../../../../../pretty.mjs';
import { getBasicValue, getChild, nodeBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

const EXCLUDE = ['FONs', 'PTSf', 'BOLb', 'ITLb', 'UNDb', 'LEDf', 'FOTb', 'HSCf', 'RKNf', /*'KRNf', 'BLSf', 'LDMi', 'JSTi', 'PINf', 'PSBf', 'PSAf',*/ 'TFSv'];

registerNode('TXT', 'v', { // TeXT
  read: (target, value, state) => {
    const left = getBasicValue(value, 'LFT', 'f') ?? 0;
    const top = getBasicValue(value, 'TOP', 'f') ?? 0;
    const right = getBasicValue(value, 'RIT', 'f') ?? 0;
    const bottom = getBasicValue(value, 'BOT', 'f') ?? 0;

    const pattern = getBasicValue(value, 'PAT', 'v') ?? [];
    const transform = /** @type {number[] | undefined} */ (getChild(value, 'MTX', 'v')?.matrix);
    const img = getChild(value, 'IMG', 'v');
    const brush = getChild(pattern, 'BPL', 'v');

    const useFontStretch = false; // not supported by all fonts

    const fontState = {
      fillColour: getBasicValue(pattern, 'FCL', 'i'),
      lineColour: getBasicValue(pattern, 'BCL', 'i'),
      lineWidth: /** @type {number} */ (brush?.diameter ?? 0),
      fillOverStroke: getBasicValue(value, 'FOT', 'b') ?? false,
      font: getBasicValue(value, 'FON', 's'),
      pointSize: getBasicValue(value, 'PTS', 'f'),
      bold: getBasicValue(value, 'BOL', 'b'),
      italic: getBasicValue(value, 'ITL', 'b'),
      underline: getBasicValue(value, 'UND', 'b'),
      hScale: getBasicValue(value, 'HSC', 'f') ?? 1,
      KRN: getBasicValue(value, 'KRN', 'f'),
      kerning: getBasicValue(value, 'RKN', 'f') ?? 0,
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
        //case 'FOTb': fontState.fillOverStroke = nodeBasicValue(part, 'FOT', 'b') ?? false; break;
        case 'FONs': fontState.font = nodeBasicValue(part, 'FON', 's'); break;
        case 'FONs': fontState.font = nodeBasicValue(part, 'FON', 's'); break;
        case 'PTSf': fontState.pointSize = nodeBasicValue(part, 'PTS', 'f'); break;
        case 'BOLb': fontState.bold = nodeBasicValue(part, 'BOL', 'b'); break;
        case 'ITLb': fontState.italic = nodeBasicValue(part, 'ITL', 'b'); break;
        case 'UNDb': fontState.underline = nodeBasicValue(part, 'UND', 'b'); break;
        case 'HSCf': fontState.hScale = nodeBasicValue(part, 'HSC', 'f') ?? 1; break;
        //case 'KRNf': fontState.KRN = nodeBasicValue(part, 'KRN', 'f'); break;
        case 'RKNf': fontState.kerning = nodeBasicValue(part, 'RKN', 'f') ?? 0; break;
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

    let approxScale = 1;
    if (transform) {
      approxScale = Math.pow(
        (transform[0] * transform[0] + transform[3] * transform[3]) *
        (transform[1] * transform[1] + transform[4] * transform[4]),
        0.25,
      ) / transform[8];
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
          // also it is applied before transforming, but Fireworks applies it AFTER any transform
          if (frag.lineWidth) {
            const w = frag.lineWidth / (2 * approxScale);
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
              oFrag.style.webkitTextStroke = `${w * 2}px ${col}`;
            }
          }
          const sz = frag.pointSize ?? 12;
          oFrag.style.fontFamily = frag.font ?? '';
          if (frag.hScale === 1 || useFontStretch) {
            oFrag.style.fontSize = `${sz}px`;
            oFrag.style.fontStretch = frag.hScale.toString();
          } else {
            oFrag.style.fontSize = `${sz * frag.hScale}px`;
            oFrag.style.transform = `scaleY(${1 / frag.hScale})`;
            oFrag.style.display = 'inline-block'; // required for transform
          }
          oFrag.style.lineHeight = `${sz * frag.lineHeight}px`;
          // this scale factor comes from trial-and-error
          // fireworks uses its own kerning algorithm, so it isn't possible to match the results exactly anyway
          oFrag.style.letterSpacing = `${Math.floor(frag.kerning * sz * 0.32) * 0.25}px`;

          oFrag.style.fontWeight = frag.bold ? 'bold' : 'normal';
          oFrag.style.fontStyle = frag.italic ? 'italic' : 'normal';
          oFrag.style.textDecoration = frag.underline ? 'underline' : 'none';
          oFrag.append(frag.text);
          oStr.append(oFrag);
        }
        if (transform) {
          const imgX = img?.xLocation ?? 0;
          const imgY = img?.yLocation ?? 0;
          const imgW = img?.width ?? 0;
          const imgH = img?.height ?? 0;
          const hold = document.createElement('div');
          hold.style.width = `${imgW}px`;
          hold.style.height = `${imgH}px`;
          const cssMat = [
            transform[0], transform[1], 0, transform[2],
            transform[3], transform[4], 0, transform[5],
            0, 0, 1, 0,
            transform[6], transform[7], 0, transform[8],
          ];
          oStr.style.transform = `translate(${-imgX}px, ${-imgY}px) translate(${left}px, ${top}px) matrix3d(${cssMat.join(',')})`;
          oStr.style.transformOrigin = `${-left}px ${-top}px`;
          oStr.style.boxShadow = '0 0 0 1px black';
          hold.append(oStr);
          content.append(hold);
        } else {
          content.append(oStr);
        }
      },
    });

    target.value = value;
    Object.assign(target, outputNodes(target.name, displayNodes));
  },
});
