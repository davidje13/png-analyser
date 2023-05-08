import { getBasicValue, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

const FORMATS = [
  'gif',
  'jpeg',
  'png',
  'bitmap / pict / tiff / wbmp',
  'animated gif',
];
const COLOURS = [
  'indexed',
  'rgb',
  'rgba',
];

registerNode('EXP', 'v', { // EXPort options
  read: (target, value, state) => {
    const formatId = getBasicValue(value, 'FMT', 'i');
    const format = FORMATS[formatId ?? -1];
    if (!format) {
      state.warnings.push(`unknown export format ${formatId}`);
    }
    const colourId = getBasicValue(value, 'CLR', 'i');
    const colour = COLOURS[colourId ?? -1];
    if (!colour) {
      state.warnings.push(`unknown export colour mode ${colourId}`);
    }
    const paletteId = getBasicValue(value, 'PLT', 'i'); // preset-palette index? 1 = adaptive, 3 = black&white
    //const palette = getBasicValue(value, 'PAL', 'v');
    const paletteSize = getBasicValue(value, 'PLN', 'i');
    const dither = getBasicValue(value, 'PLD', 'i'); // 0-100
    const formatMagicRaw = getBasicValue(value, 'MCT', 'i');
    const formatMagic = formatMagicRaw ? readStr32(formatMagicRaw) : '';
    const mccRaw = getBasicValue(value, 'MCC', 'i'); // set to "MKBY" ?
    const jpegQuality = getBasicValue(value, 'JPQ', 'i');
    const jpegSmoothing = getBasicValue(value, 'JPS', 'i'); // 0-8
    const jpegProgressive = getBasicValue(value, 'JPP', 'b');
    const jpegColourMode = getBasicValue(value, 'JPO', 'i'); // 0 = sharp, 1 = smooth colour edges

    const removeUnusedColours = getBasicValue(value, 'PLO', 'b');
    const interlaced = getBasicValue(value, 'GFI', 'b');

    const formatName = formatId === 3 ? `${formatMagic}` : format;
    const info = [`Export config ${formatName} (${colour})`];
    if (format === 'jpeg') {
      info.push(
        ` quality=${jpegQuality}`,
        ` smoothing=${jpegSmoothing}`,
        jpegProgressive ? ', progressive' : '',
        jpegColourMode === 0 ? ', sharp colour edges' : ', smooth colour edges',
      );
    } else {
      info.push(` dither=${dither}%`);
    }
    if (interlaced) {
      info.push(' [interlaced]');
    }
    if (removeUnusedColours) {
      info.push(' [remove unused colours]');
    }

    Object.assign(target, outputNodes(info.join(''), value, true));
  },
});

/**
 * @param {number} v
 * @return {string}
 */
function readStr32(v) {
  return (
    String.fromCharCode(v >>> 24) +
    String.fromCharCode((v >>> 16) & 0xFF) +
    String.fromCharCode((v >>> 8) & 0xFF) +
    String.fromCharCode(v & 0xFF)
  );
}
