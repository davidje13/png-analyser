import { ColorSpace, XYZ_D50 } from 'colorjs.io/fn';
import { getBinaryCodedDecimal, getLatin1, getUTF8, subViewFrom, subViewLen } from '../../data/utils.mjs';
import { visualiseColourSpace } from '../../display/colour.mjs';
import { makeCanvas } from '../../display/pretty.mjs';
import { project_XYZ_xy } from '../xyz.mjs';

/**
 * @typedef {import('../xyz.mjs').XYZ} XYZ
 * @typedef {import('../xyz.mjs').FullXYZ} FullXYZ
 *
 * @typedef {{ type: string, dataType: string, value: unknown }} ICCTag
 *
 * @typedef {(v: number) => v} Transfer
 *
 * @typedef {{
 *   version: string,
 *   created: Date,
 *   cmmType: string,
 *   profileClass: string,
 *   colourSpace: string,
 *   pcs: string,
 *   platformSignature: string,
 *   flags: number,
 *   deviceManufacturer: string,
 *   deviceModel: string,
 *   standardDeviceAttributes: number,
 *   vendorDeviceAttributes: number,
 *   renderingIntent: number,
 *   illuminant: { x: number, y: number, z: number },
 *   creatorSignature: string,
 *   profileID: DataView<ArrayBuffer>,
 *   tags: ICCTag[],
 *   illuminantColourSpace: ColorSpace,
 *   transfer: [Transfer, Transfer, Transfer],
 *   primaries: { white: XYZ | undefined, red: XYZ | undefined, green: XYZ | undefined, blue: XYZ | undefined },
 *   display(target: HTMLElement): void,
 * }} ICCProfile
 */

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {string[]} warnings
 * @return {ICCProfile}
 */
export function readICCProfile(data, warnings) {
  if (data.byteLength < 128) {
    throw new Error(`ICC Profile header is truncated ${data.byteLength}`);
  }
  const profileSize = data.getUint32(0, false);
  if (profileSize !== data.byteLength) {
    warnings.push(`ICC Profile size in header does not match content ${profileSize} != ${data.byteLength}`);
  }
  const cmmType = getLatin1(data, 4, 8, warnings); // https://registry.color.org/cmm-signatures/
  const vMajor = getBinaryCodedDecimal(data, 2, 8);
  const vMinor = getBinaryCodedDecimal(data, 1, 9);
  const vSub1 = getBinaryCodedDecimal(data, 1, 9, true);
  const vSub2 = getBinaryCodedDecimal(data, 4, 10);

  const profileClass = getLatin1(data, 12, 16, warnings);
  // "scnr": Input device profile
  // "mntr": Display device profile
  // "prtr": Output device profile
  // "link": DeviceLink profile
  // "spac": ColorSpace profile
  // "abst": Abstract profile
  // "nmcl": NamedColor profile

  const colourSpace = getLatin1(data, 16, 20, warnings);
  // "XYZ ": nCIEXYZ or PCSXYZa [depending on context]
  // "Lab ": CIELAB or PCSLABb [depending on context]
  // "Luv ": CIELUV
  // "YCbr": YCbCr
  // "Yxy ": CIEYxy
  // "RGB ": RGB
  // "GRAY": Gray
  // "HSV ": HSV
  // "HLS ": HLS
  // "CMYK": CMYK
  // "CMY ": CMY
  // "2CLR": 2 colour
  // "3CLR": 3 colour (other than those listed above)
  // "4CLR": 4 colour (other than CMYK)
  // "5CLR": 5 colour
  // "6CLR": 6 colour
  // "7CLR": 7 colour
  // "8CLR": 8 colour
  // "9CLR": 9 colour
  // "ACLR": 10 colour
  // "BCLR": 11 colour
  // "CCLR": 12 colour
  // "DCLR": 13 colour
  // "ECLR": 14 colour
  // "FCLR": 15 colour

  const pcs = getLatin1(data, 20, 24, warnings);
  const created = new Date(Date.UTC(
    data.getUint16(24, false),
    data.getUint16(26, false),
    data.getUint16(28, false),
    data.getUint16(30, false),
    data.getUint16(32, false),
    data.getUint16(34, false),
  ));
  if (getLatin1(data, 36, 40, warnings) !== 'acsp') {
    warnings.push(`Incorrect ICC Profile file signature: ${data.getUint32(36, false)}`);
  }

  const platformSignature = getLatin1(data, 40, 44, warnings);
  // 0x00000000 = unspecified
  // "APPL": Apple Computer, Inc.
  // "MSFT": Microsoft Corporation
  // "SGI ": Silicon Graphics, Inc.
  // "SUNW": Sun Microsystems, Inc.

  const flags = data.getUint32(44, false);
  const deviceManufacturer = getLatin1(data, 48, 52, warnings); // https://registry.color.org/manufacturer-signatures/
  const deviceModel = getLatin1(data, 52, 56, warnings); // https://registry.color.org/device-signatures/
  const standardDeviceAttributes = data.getUint32(56, false);
  const vendorDeviceAttributes = data.getUint32(60, false);
  const renderingIntent = data.getUint32(64, false);
  // 0: Perceptual
  // 1: Media-relative colorimetric
  // 2: Saturation
  // 3: ICC-absolute colorimetric
  const illuminant = {
    x: getS15Fixed16(data, 68),
    y: getS15Fixed16(data, 72),
    z: getS15Fixed16(data, 76),
  };
  let illuminantColourSpace = XYZ_D50;
  if (
    illuminant.x.toFixed(4) !== '0.9642' ||
    illuminant.y.toFixed(4) !== '1.0000' ||
    illuminant.z.toFixed(4) !== '0.8249'
  ) {
    warnings.push('ICC Profile illuminant is not D50');
  }
  const creatorSignature = getLatin1(data, 80, 84, warnings);
  const profileID = subViewLen(data, 84, 16, warnings);
  const reserved = subViewLen(data, 100, 28, warnings);

  const tagCount = data.getUint32(128, false);
  /** @type {ICCTag[]} */ const tags = [];
  for (let p = 0; p < tagCount; ++p) {
    const type = getLatin1(data, 132 + p * 12, 132 + p * 12 + 4, warnings);
    const pos = data.getUint32(132 + p * 12 + 4);
    const dataType = getLatin1(data, pos, pos + 4, warnings);
    const tagData = subViewLen(
      data,
      pos + 8,
      data.getUint32(132 + p * 12 + 8) - 8,
      warnings,
    );
    /** @type {unknown} */ let value = tagData;
    try {
      switch (dataType) {
        case 'chrm':
          // TODO
          break;
        case 'cicp':
          // TODO
          break;
        case 'clro':
          // TODO
          break;
        case 'clrt':
          // TODO
          break;
        case 'curv': {
          const datapoints = tagData.getUint32(0, false);
          if (datapoints === 0) {
            value = { type: 'identity' };
          } else if (datapoints === 1) {
            value = { type: 'gamma', g: getU8Fixed8(tagData, 4) };
          } else {
            const points = [];
            for (let n = 0; n < datapoints; ++n) {
              points.push(tagData.getUint16(n * 2 + 4, false) / 0xFFFF);
            }
            value = { type: 'table', points };
          }
          break;
        }
        case 'desc': {
          let p = 0;
          const asciiLength = tagData.getUint32(p, false);
          p += 4;
          if (asciiLength < 2) {
            warnings.push(`iCCP ${type} tag: ASCII text must contain at least one character`);
          }
          const ascii = asciiLength > 1 ? getLatin1(tagData, p, p + asciiLength - 1, warnings) : '';
          if (tagData.getUint8(p + asciiLength - 1) !== 0) {
            warnings.push(`iCCP ${type} tag: ASCII text not null-terminated`);
          }
          p += asciiLength;
          const language = tagData.getUint32(p, false);
          p += 4;
          const unicodeLength = tagData.getUint32(p, false);
          p += 4;
          const unicode = getUTF8(tagData, p, p + unicodeLength, warnings);
          p += unicodeLength;
          const scriptCodeCode = tagData.getUint16(p, false);
          p += 2;
          const scriptCodeLength = tagData.getUint8(p);
          p += 1;
          const scriptCode = getLatin1(tagData, p, p + scriptCodeLength, warnings);
          value = {
            ascii,
            unicode: {
              language,
              value: unicode,
            },
            scriptCode: {
              code: scriptCodeCode,
              value: scriptCode,
              unused: getLatin1(tagData, p + scriptCodeLength, p + 67, warnings),
            }
          };
          break;
        }
        case 'data': {
          const type = tagData.getUint32(0, false);
          if (type === 0) {
            value = getLatin1(tagData, 4, tagData.byteLength - 1, warnings);
            if (tagData.getUint8(tagData.byteLength - 1) !== 0) {
              warnings.push(`iCCP ${type} tag: ASCII text not null-terminated`);
            }
          } else {
            value = subViewFrom(tagData, 4);
          }
          break;
        }
        case 'dtim':
          value = new Date(Date.UTC(
            tagData.getUint16(0, false),
            tagData.getUint16(2, false),
            tagData.getUint16(4, false),
            tagData.getUint16(6, false),
            tagData.getUint16(8, false),
            tagData.getUint16(10, false),
          ));
          break;
        case 'dict':
          // TODO
          break;
        case 'mft2':
          // TODO
          break;
        case 'mft1':
          // TODO
          break;
        case 'mAB ':
          // TODO
          break;
        case 'mBA ':
          // TODO
          break;
        case 'meas':
          // TODO
          break;
        case 'mluc': //
          // TODO
          break;
        case 'mpet':
          // TODO
          break;
        case 'curf':
          // TODO
          break;
        case 'samf':
          // TODO
          break;
        case 'matf':
          // TODO
          break;
        case 'clut':
          // TODO
          break;
        case 'bACS':
          // TODO
          break;
        case 'ncl2':
          // TODO
          break;
        case 'para': {
          const params = [];
          for (let i = 4; i + 4 <= tagData.byteLength; i += 4) {
            params.push(getS15Fixed16(tagData, i));
          }
          value = { type: 'parametric', fn: tagData.getUint16(0), params };
          break;
        }
        case 'pseq':
          // TODO
          break;
        case 'psid':
          // TODO
          break;
        case 'rcs2':
          // TODO
          break;
        case 'sf32': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; i += 4) {
            values.push(getS15Fixed16(tagData, i));
          }
          value = values;
          break;
        }
        case 'sig ':
          value = getLatin1(tagData, 0, 4, warnings);
          break;
        case 'text':
          value = getLatin1(tagData, 0, tagData.byteLength - 1, warnings);
          if (tagData.getUint8(tagData.byteLength - 1) !== 0) {
            warnings.push(`iCCP ${type} tag: ASCII text not null-terminated`);
          }
          break;
        case 'uf32': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; i += 4) {
            values.push(getU16Fixed16(tagData, i));
          }
          value = values;
          break;
        }
        case 'ui16': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; i += 2) {
            values.push(tagData.getUint16(i, false));
          }
          value = values;
          break;
        }
        case 'ui32': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; i += 4) {
            values.push(tagData.getUint32(i, false));
          }
          value = values;
          break;
        }
        case 'ui64': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; i += 8) {
            values.push(tagData.getBigUint64(i, false));
          }
          value = values;
          break;
        }
        case 'ui08': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; ++i) {
            values.push(tagData.getUint8(i));
          }
          value = values;
          break;
        }
        case 'view':
          // TODO
          break;
        case 'XYZ ': {
          const values = [];
          for (let i = 0; i < tagData.byteLength; i += 12) {
            values.push({
              X: getS15Fixed16(tagData, i),
              Y: getS15Fixed16(tagData, i + 4),
              Z: getS15Fixed16(tagData, i + 8),
            });
          }
          value = values;
          break;
        }
        default:
          warnings.push(`iCCP unknown data type ${dataType}`);
      }
    } catch (err) {
      warnings.push(`iCCP failed to read tag ${type} of type ${dataType}: ${err}`);
    }
    tags.push({ type, dataType, value });
  }

  let desc = '';
  let license = '';
  /** @type {XYZ | undefined} */ let white;
  /** @type {XYZ | undefined} */ let red;
  /** @type {XYZ | undefined} */ let green;
  /** @type {XYZ | undefined} */ let blue;
  /** @type {(v: number) => number} */ let redTr = (v) => v;
  /** @type {(v: number) => number} */ let greenTr = (v) => v;
  /** @type {(v: number) => number} */ let blueTr = (v) => v;
  /** @type {XYZ} */ let black = { X: 0, Y: 0, Z: 0 };

  for (const tag of tags) {
    const v = /** @type {any} */ (tag.value);
    if (tag.type === 'wtpt' && tag.dataType === 'XYZ ' && v.length === 1) {
      white = v[0];
    } else if (tag.type === 'bkpt' && tag.dataType === 'XYZ ' && v.length === 1) {
      black = v[0];
    } else if (tag.type === 'rXYZ' && tag.dataType === 'XYZ ' && v.length === 1) {
      red = v[0];
    } else if (tag.type === 'gXYZ' && tag.dataType === 'XYZ ' && v.length === 1) {
      green = v[0];
    } else if (tag.type === 'bXYZ' && tag.dataType === 'XYZ ' && v.length === 1) {
      blue = v[0];
    } else if (tag.type === 'rTRC' && (tag.dataType === 'curv' || tag.dataType === 'para')) {
      redTr = getTransferFunction(v, warnings);
    } else if (tag.type === 'gTRC' && (tag.dataType === 'curv' || tag.dataType === 'para')) {
      greenTr = getTransferFunction(v, warnings);
    } else if (tag.type === 'bTRC' && (tag.dataType === 'curv' || tag.dataType === 'para')) {
      blueTr = getTransferFunction(v, warnings);
    } else if (tag.type === 'desc' && tag.dataType === 'desc') {
      desc = v.unicode?.value || v.ascii;
    } else if (tag.type === 'cprt' && tag.dataType === 'text') {
      license = v;
    }
  }

  return {
    version: `${vMajor}.${vMinor}.${vSub1}.${vSub2}`,
    created,
    cmmType,
    profileClass,
    colourSpace,
    pcs,
    platformSignature,
    flags,
    deviceManufacturer,
    deviceModel,
    standardDeviceAttributes,
    vendorDeviceAttributes,
    renderingIntent,
    illuminant,
    creatorSignature,
    profileID,
    tags,

    illuminantColourSpace,
    primaries: { white, red, green, blue },
    transfer: [redTr, greenTr, blueTr],

    display(content) {
      content.append(
        `ICC Profile v${vMajor}.${vMinor}.${vSub1}.${vSub2}\n`,
        `Description:              ${desc || '-'}\n`,
        `License:                  ${license || '-'}\n`,
        `Created:                  ${created.toISOString()}\n`,
        `CMM Type:                 ${cmmType} (see https://registry.color.org/cmm-signatures/)\n`,
        `Profile Class:            ${profileClass}\n`,
        `Colour Space:             ${colourSpace}\n`,
        `pcs:                      ${pcs}\n`,
        `Platform:                 ${platformSignature}\n`,
        `Flags:                    ${flags.toString(2).padStart(32, '0')}\n`,
        `Device Manufacturer:      ${deviceManufacturer} (see https://registry.color.org/manufacturer-signatures/)\n`,
        `Device Model:             ${deviceManufacturer} (see https://registry.color.org/device-signatures/)\n`,
        `Device Attributes:        ${standardDeviceAttributes.toString(2).padStart(32, '0')}\n`,
        `Vendor Device Attributes: ${vendorDeviceAttributes.toString(2).padStart(32, '0')}\n`,
        `Rendering Intent:         ${renderingIntent}\n`,
        `Creator:                  ${creatorSignature}\n`,
      );
      if (red || green || blue || white) {
        const r = red && project_XYZ_xy(red);
        const g = green && project_XYZ_xy(green);
        const b = blue && project_XYZ_xy(blue);
        const w = white && project_XYZ_xy(white);
        const k = black && project_XYZ_xy(black);
        content.append(visualiseColourSpace({
          space: illuminantColourSpace,
          perimeter: r && g && b ? [r, g, b] : null,
          points: [
            [illuminant, '#FFFF00'],
            [k, '#000000'],
            [r, '#FF0000'],
            [g, '#00FF00'],
            [b, '#0000FF'],
            [w, '#FFFFFF'],
          ],
        }));
      }

      content.append(drawTransferFunctions(200, 200, 1, [
        [redTr, '#FF0000'],
        [greenTr, '#00FF00'],
        [blueTr, '#0000FF'],
      ]));

      for (const tag of tags) {
        content.append(`\n- '${tag.type}': [${tag.dataType}] ${JSON.stringify(tag.value)}`);
      }
    },
  };
}

/**
 * @param {(
 *   | { type: 'identity', g?: 0 }
 *   | { type: 'gamma', g: number }
 *   | { type: 'table', points: number[] }
 *   | { type: 'parametric', fn: number, params: number[] }
 * )} transfer
 * @param {string[]} warnings
 * @return {(v: number) => number}
 */
function getTransferFunction(transfer, warnings) {
  if (
    !transfer ||
    transfer.type === 'identity' ||
    (transfer.type === 'gamma' && transfer.g === 1)
  ) {
    return (v) => v;
  }
  if (transfer.type === 'table') {
    const pts = transfer.points;
    const N = pts.length - 1;
    return (v) => {
      const x = v * N;
      const xi = x | 0;
      const l = pts[xi];
      const r = pts[xi + 1] ?? l;
      return l + (r - l) * (x - xi);
    };
  }
  if (transfer.type === 'gamma') {
    return (v) => Math.pow(v, transfer.g);
  }

  switch (transfer.fn) {
    case 0: {
      const [g = 0] = transfer.params;
      return (v) => Math.pow(v, g);
    }
    case 1: {
      const [g = 0, a = 1, b = 0] = transfer.params;
      const t = -b / a;
      return (v) => v > t ? Math.pow(v * a + b, g) : 0;
    }
    case 2: {
      const [g = 0, a = 1, b = 0, c = 0] = transfer.params;
      const t = -b / a;
      return (v) => clamp((v > t ? Math.pow(v * a + b, g) : 0) + c);
    }
    case 3: {
      const [g = 0, a = 1, b = 0, c = 0, d = 0] = transfer.params;
      return (v) => v >= d ? Math.pow(v * a + b, g) : clamp(c * v);
    }
    case 4: {
      const [g = 0, a = 1, b = 0, c = 0, d = 0, e = 0, f = 0] = transfer.params;
      return (v) => clamp(v >= d ? Math.pow(v * a + b, g) + e : (c * v + f));
    }
    default:
      warnings.push(`ICC Profile: unknown parametric transfer function ${transfer.fn}`);
      return (v) => v;
  }
}

/** @param {number} v */
const clamp = (v) => v > 0 ? v < 1 ? v : 1 : 0;

/**
 * @param {number} w
 * @param {number} h
 * @param {number} pad
 * @param {[(v: number) => number, string][]} lines
 * @return {HTMLCanvasElement}
 */
function drawTransferFunctions(w, h, pad, lines) {
  const chart = makeCanvas(w + pad * 2, h + pad * 2);
  chart.ctx.fillStyle = '#FFFFFF';
  chart.ctx.fillRect(0, 0, w + pad * 2, h + pad * 2);
  chart.ctx.lineWidth = 1;
  chart.ctx.globalCompositeOperation = 'darken';
  for (const [fn, c] of lines) {
    chart.ctx.strokeStyle = c;
    chart.ctx.beginPath();
    chart.ctx.moveTo(pad, (1 - fn(0)) * h + pad);
    for (let x = 1; x <= w; ++x) {
      chart.ctx.lineTo(x + pad, (1 - fn(x / w)) * h + pad);
    }
    chart.ctx.stroke();
  }
  return chart.canvas;
}

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {number} pos
 * @return {number}
 */
function getS15Fixed16(data, pos) {
  return data.getInt32(pos, false) / 0x10000;
}

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {number} pos
 * @return {number}
 */
function getU16Fixed16(data, pos) {
  return data.getUint32(pos, false) / 0x10000;
}

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {number} pos
 * @return {number}
 */
function getU8Fixed8(data, pos) {
  return data.getUint16(pos, false) / 0x100;
}
