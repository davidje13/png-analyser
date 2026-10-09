import { rgba } from '../../../../../../../display/pretty.mjs';
import { getBasicValue, getChild, nodeBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

const EXCLUDE = ['FONs', 'PTSf', 'BOLb', 'ITLb', 'UNDb', 'LEDf', 'LDMi', 'FOTb', 'HSCf', 'RKNf', 'BLSf', 'JSTi', 'ATKb', 'TAAi', 'TA1i', 'TA2i', 'TOSi', /*'KRNf', 'PINf', 'PSBf', 'PSAf',*/ 'TFSv'];

const JUSTIFICATION = ['left', 'center', 'right', 'justify'];

const ANTIALIAS = [
  'smooth / none',
  'crisp',
  'strong',
  'system',
  'custom',
];

registerNode('TXTv', { // TeXT
  read: (target, value, state) => {
    const left = getBasicValue(value, 'LFTf') ?? 0;
    const top = getBasicValue(value, 'TOPf') ?? 0;
    const right = getBasicValue(value, 'RITf') ?? 0;
    const bottom = getBasicValue(value, 'BOTf') ?? 0;

    const pattern = getBasicValue(value, 'PATv') ?? [];
    const transform = /** @type {number[] | undefined} */ (getChild(value, 'MTXv')?.matrix);
    const img = getChild(value, 'IMGv');
    const brush = getChild(pattern, 'BPLv');
    const antialiasId = getBasicValue(value, 'TAAi');
    const antialias = ANTIALIAS[antialiasId ?? 0];
    if (!antialias) {
      state.warnings.push(`unknown antialias ID ${antialiasId}`);
    }
    const customAASamples = getBasicValue(value, 'TOSi');
    const customAASharpness = getBasicValue(value, 'TA1i');
    const customAAStrength = getBasicValue(value, 'TA2i');

    let aaInfo = antialias;
    if (antialiasId === 4) {
      aaInfo = `custom: samples=${customAASamples} sharpness=${customAASharpness} strength=${customAAStrength}`;
    }

    // TFT = 3 => text "in" path, 2 => follow path, 0 = no path
    // TAP->PTH contains the path to follow
    // TAP->TAM contains 0 = angle follows path / 1 = vertical / 2 = skew v / 3 = skew h

    const useFontStretch = false; // not supported by all fonts

    const fontState = {
      fillColour: getBasicValue(pattern, 'FCLi'),
      lineColour: getBasicValue(pattern, 'BCLi'),
      lineWidth: /** @type {number} */ (brush?.diameter ?? 0),
      fillOnTop: getBasicValue(value, 'FOTb') ?? false,
      font: getBasicValue(value, 'FONs'),
      pointSize: getBasicValue(value, 'PTSf'),
      bold: getBasicValue(value, 'BOLb'),
      italic: getBasicValue(value, 'ITLb'),
      underline: getBasicValue(value, 'UNDb'),
      hScale: getBasicValue(value, 'HSCf') ?? 1,
      KRN: getBasicValue(value, 'KRNf'),
      autoKern: getBasicValue(value, 'ATKb'),
      kerning: getBasicValue(value, 'RKNf') ?? 0,
      baselineShift: getBasicValue(value, 'BLSf'),
      lineHeight: getBasicValue(value, 'LEDf') ?? 1,
      lineHeightUnit: getBasicValue(value, 'LDMi'),
      justification: getBasicValue(value, 'JSTi'),
      PIN: getBasicValue(value, 'PINf'),
      PSB: getBasicValue(value, 'PSBf'),
      PSA: getBasicValue(value, 'PSAf'),
    };

    const parts = getBasicValue(value, 'TFSv') ?? [];
    /** @type {(typeof fontState & { text: string })[]} */ const strings = [];
    for (const part of parts) {
      switch (part.id) {
        case 'FCLi': fontState.fillColour = nodeBasicValue(part, 'FCLi'); break;
        //case 'FOTb': fontState.fillOnTop = nodeBasicValue(part, 'FOTb') ?? false; break;
        case 'FONs': fontState.font = nodeBasicValue(part, 'FONs'); break;
        case 'PTSf': fontState.pointSize = nodeBasicValue(part, 'PTSf'); break;
        case 'BOLb': fontState.bold = nodeBasicValue(part, 'BOLb'); break;
        case 'ITLb': fontState.italic = nodeBasicValue(part, 'ITLb'); break;
        case 'UNDb': fontState.underline = nodeBasicValue(part, 'UNDb'); break;
        case 'HSCf': fontState.hScale = nodeBasicValue(part, 'HSCf') ?? 1; break;
        //case 'KRNf': fontState.KRN = nodeBasicValue(part, 'KRNf'); break;
        case 'RKNf': fontState.kerning = nodeBasicValue(part, 'RKNf') ?? 0; break;
        case 'BLSf': fontState.baselineShift = nodeBasicValue(part, 'BLSf'); break;
        case 'LEDf': fontState.lineHeight = nodeBasicValue(part, 'LEDf') ?? 1; break;
        case 'LDMi': fontState.lineHeightUnit = nodeBasicValue(part, 'LDMi'); break;
        case 'JSTi': fontState.justification = nodeBasicValue(part, 'JSTi'); break;
        case 'PINf': fontState.PIN = nodeBasicValue(part, 'PINf'); break;
        case 'PSBf': fontState.PSB = nodeBasicValue(part, 'PSBf'); break;
        case 'PSAf': fontState.PSA = nodeBasicValue(part, 'PSAf'); break;
        case 'TRNs':
          strings.push({
            text: (nodeBasicValue(part, 'TRNs') ?? '').replace(/\r/g, '\n'),
            ...fontState,
          });
          break;
        default:
          state.warnings.push(`Unknown text formatter ${part.id}`);
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

    const displayNodes = value.filter(({ id }) => !EXCLUDE.includes(id));
    displayNodes.push({
      parent: target,
      id: 'TFSv',
      visited: true,
      toString: () => JSON.stringify(strings.map((s) => s.text).join('')),
      display: (summary, content) => {
        content.append(JSON.stringify(strings, undefined, 2) + '\n');
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
            if (frag.fillOnTop) {
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
          if (frag.lineHeightUnit === 0) { // fraction of font size
            oFrag.style.lineHeight = `${sz * frag.lineHeight}px`;
          } else if (frag.lineHeightUnit === 1) { // pixels
            oFrag.style.lineHeight = `${sz}px`;
          } else { // unknown
            state.warnings.push(`unknown line height unit ${frag.lineHeightUnit}`);
          }
          // this scale factor comes from trial-and-error
          // fireworks uses its own kerning algorithm, so it isn't possible to match the results exactly anyway
          oFrag.style.letterSpacing = `${frag.kerning * sz * 0.1}px`;

          oFrag.style.fontWeight = frag.bold ? 'bold' : 'normal';
          oFrag.style.fontStyle = frag.italic ? 'italic' : 'normal';
          oFrag.style.textDecoration = frag.underline ? 'underline' : 'none';
          oFrag.style.textAlign = JUSTIFICATION[frag.justification ?? 0];
          oFrag.style.verticalAlign = `${frag.baselineShift}px`;
          oFrag.style.fontKerning = frag.autoKern ? 'normal' : 'none';
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
      storage: {},
      toSVG: (parts) => {
        // TODO
      },
      hasSVG: () => true,
    });

    target.value = value;
    Object.assign(target, outputNodes(`Text (antialias ${aaInfo})`, displayNodes));
  },
});
