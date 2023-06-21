import { ByteArrayBuilder } from '../../data/builder.mjs';
import { Dict } from './data_dict.mjs';
import { writeIndex } from './data_index.mjs';
import { CFFStrings } from './standard_strings.mjs';
import { opArray, opFixedInt, opNumber, opStringID, opType2Number, writeOperand, writeOperation } from './operations.mjs';
import { getCFFOp } from './cff_glyph.mjs';

/**
 * @typedef {import('../font.mjs').Font} Font
 * @typedef {import('./cff_glyph.mjs').CFFGlyph} CFFGlyph
 */

const OP_VERSION_STRING = { id: 0x00 };                  // SID
const OP_NOTICE_STRING = { id: 0x01 };                   // SID
const OP_FULL_NAME_STRING = { id: 0x02 };                // SID
const OP_FAMILY_NAME_STRING = { id: 0x03 };              // SID
const OP_WEIGHT = { id: 0x04 };                          // SID
const OP_FONT_BOUNDING_BOX = { id: 0x05 };               // array [0 0 0 0]
const OP_UNIQUE_ID = { id: 0x0D };                       // number
const OP_XUID = { id: 0x0E };                            // array
const OP_CHARSET_INDEX = { id: 0x0F };                   // file byte offset [0]
const OP_ENCODING_INDEX = { id: 0x10 };                  // file byte offset [0]
const OP_CHAR_STRINGS_INDEX = { id: 0x11 };              // file byte offset
const OP_PRIVATE_INDEX = { id: 0x12 };                   // number, file byte offset
const OP_COPYRIGHT = { id: 0x00, esc: true };            // SID
const OP_FIXED_PITCH = { id: 0x01, esc: true };          // boolean [false]
const OP_ITALIC_ANGLE = { id: 0x02, esc: true };         // number  [0]
const OP_UNDERLINE_POSITION = { id: 0x03, esc: true };   // number  [-100]
const OP_UNDERLINE_THICKNESS = { id: 0x04, esc: true };  // number  [50]
const OP_PAINT_TYPE = { id: 0x05, esc: true };           // number  [0]
const OP_CHARSTRING_TYPE = { id: 0x06, esc: true };      // number  [2]
const OP_FONT_MATRIX = { id: 0x07, esc: true };          // array   [0.001 0 0 0.001 0 0]
const OP_STROKE_WIDTH = { id: 0x08, esc: true };         // number  [0]
const OP_SYNTHETIC_BASE = { id: 0x14, esc: true };       // number (index)
const OP_POSTSCRIPT = { id: 0x15, esc: true };           // SID
const OP_BASE_FONT_NAME = { id: 0x16, esc: true };       // SID
const OP_BASE_FONT_BLEND = { id: 0x17, esc: true };      // delta

const OP_CID_REG_ORD_SUP = { id: 0x1E, esc: true };      // SID, SID, number
const OP_CID_FONT_VERSION = { id: 0x1F, esc: true };     // number [0]
const OP_CID_FONT_REVISION = { id: 0x20, esc: true };    // number [0]
const OP_CID_FONT_TYPE = { id: 0x21, esc: true };        // number [0]
const OP_CID_COUNT = { id: 0x22, esc: true };            // number [8720]
const OP_CID_UID_BASE = { id: 0x23, esc: true };         // number
const OP_CID_FONT_DICT_ARRAY = { id: 0x24, esc: true };  // file byte offset
const OP_CID_FONT_DICT_SELECT = { id: 0x25, esc: true }; // file byte offset
const OP_CID_FONT_NAME = { id: 0x26, esc: true };        // SID

const OP_PRIVATE_BLUE_VALUES = { id: 0x06 };             // delta
const OP_PRIVATE_OTHER_BLUES = { id: 0x07 };             // delta
const OP_PRIVATE_FAMILY_BLUES = { id: 0x08 };            // delta
const OP_PRIVATE_FAMILY_OTHER_BLUES = { id: 0x09 };      // delta
const OP_PRIVATE_STD_HW = { id: 0x0A };                  // number
const OP_PRIVATE_STD_VW = { id: 0x0B };                  // number
const OP_PRIVATE_SUBRS = { id: 0x13 };                   // byte offset from start of private dict
const OP_PRIVATE_DEFAULT_WIDTH_X = { id: 0x14 };         // number [0]
const OP_PRIVATE_NOMINAL_WIDTH_X = { id: 0x15 };         // number [0]
const OP_PRIVATE_BLUE_SCALE = { id: 0x09, esc: true };   // number [0.039625]
const OP_PRIVATE_BLUE_SHIFT = { id: 0x0A, esc: true };   // number [7]
const OP_PRIVATE_BLUE_FUZZ = { id: 0x0B, esc: true };    // number [1]
const OP_PRIVATE_FORCE_BOLD = { id: 0x0E, esc: true };   // boolean [false]
const OP_PRIVATE_LANG_GROUP = { id: 0x11, esc: true };   // number [0]
const OP_PRIVATE_EXP_FACTOR = { id: 0x12, esc: true };   // number [0.06]
const OP_PRIVATE_INIT_RANDOM_SEED = { id: 0x13, esc: true }; // number [0]

const CFF2_OP_VSTORE = { id: 0x18 };                     // file byte offset

const CFF1_OP_ENDCHAR = { id: 0x0E, esc: false };

const WEIGHT_STRINGS = [
  'Hairline',   // not a standard string
  'Extralight', // not a standard string
  'Light',
  'Regular',
  'Medium',
  'Semibold',
  'Bold',
  'Extrabold',  // not a standard string
  'Black',
];

export class CFF {
  /**
   * @param {Font[]} fonts
   */
  constructor(fonts) {
    /** @type {Font[]} */ this.fonts = [...fonts].sort((a, b) => (a.name < b.name) ? -1 : 1);
  }

  writeCFF() {
    // https://docs.microsoft.com/en-us/typography/opentype/spec/cff
    // https://wwwimages2.adobe.com/content/dam/acom/en/devnet/font/pdfs/5176.CFF.pdf

    const absOffsetSize = 2;

    const dataBuf = new ByteArrayBuilder();
    const baseOffset = { value: 0 }; // filled in later

    /** @type {Dict[]} */ const fontDicts = [];

    const strings = new CFFStrings();

    for (const font of this.fonts) {
      // Top Dict Index (written later)
      const dict = new Dict();

      const version = (
        font.majorVersion.toString().padStart(3, '0') + '.' +
        font.minorVersion.toString().padStart(3, '0')
      );
      const weight = WEIGHT_STRINGS[Math.round(font.weight / 100) - 1] ?? String(font.weight);

      dict.set(OP_VERSION_STRING, opStringID(strings.add(version)));
      dict.set(OP_FULL_NAME_STRING, opStringID(strings.add(`${font.name} ${weight}`)));
      dict.set(OP_FAMILY_NAME_STRING, opStringID(strings.add(font.name)));
      dict.set(OP_WEIGHT, opStringID(strings.add(weight)));
      dict.set(OP_UNIQUE_ID, opNumber(font.uniqueID));

      if (font.em !== 1000) {
        dict.set(OP_FONT_MATRIX, opArray([
          1 / font.em, 0, 0,
          1 / font.em, 0, 0,
        ]));
      }

      const bounds = font.aggNonEmptyBounds();
      dict.set(OP_FONT_BOUNDING_BOX, opArray([
        bounds.xmin, bounds.ymin,
        bounds.xmax, bounds.ymax,
      ]));

      if (font.isMono()) {
        dict.set(OP_FIXED_PITCH, opNumber(1));
      }

      // use default "standard" encoding (follows ASCII)
      //// Encodings
      //dict.set(OP_ENCODING_INDEX, opFixedInt(dataBuf.byteLength, baseOffset));
      //dataBuf.uint8(0); // format (0 = individual entries)
      //// 0 (.notdef) is not included in this index
      //dataBuf.uint8(font.glyphs.length - 1);
      //for (let i = 1; i < font.glyphs.length; ++i) {
      //  dataBuf.uint8(font.glyphs[i].charCode);
      //}

      // Charsets
      dict.set(OP_CHARSET_INDEX, opFixedInt(dataBuf.byteLength, baseOffset));
      dataBuf.uint8(0); // format (0 = individual entries)
      // 0 (.notdef) is not included in this index
      for (let i = 1; i < font.glyphs.length; ++i) {
        dataBuf.uint16BE(strings.add(font.glyphs[i].cff.name));
      }

      // No FDSelect (not CIDFonts)

      const widthInfo = getAdvanceWidthInfo(font.glyphs.map((g) => g.advanceWidth));

      // CharStrings Index
      dict.set(OP_CHAR_STRINGS_INDEX, opFixedInt(dataBuf.byteLength, baseOffset));
      writeIndex(dataBuf, 2, font.glyphs.map((glyph) => {
        const gbuf = new ByteArrayBuilder();
        const charw = glyph.advanceWidth;
        if (charw !== widthInfo.mode) {
          writeOperand(gbuf, opType2Number(charw - widthInfo.nominal));
        }
        for (const [op, ...data] of glyph.cff.data.instructions) {
          const operator = getCFFOp(op);
          if (!operator || operator.cff1 === false) {
            throw new Error(`Unknown CFF1 operator: ${op}`);
          }
          writeOperation(gbuf, operator, data.map(opType2Number));
        }
        writeOperation(gbuf, CFF1_OP_ENDCHAR, []);
        return gbuf;
      }));

      // No Font Dict Index (not CIDFonts)

      // Private Dict
      const privateDict = new Dict();
      //privateDict.set(OP_PRIVATE_BLUE_SCALE, opNumber(0.039625));
      //privateDict.set(OP_PRIVATE_BLUE_SHIFT, opNumber(7));
      //privateDict.set(OP_PRIVATE_BLUE_FUZZ, opNumber(1));
      //privateDict.set(OP_PRIVATE_FORCE_BOLD, opNumber(0));
      //privateDict.set(OP_PRIVATE_EXP_FACTOR, opNumber(0.06));
      privateDict.set(OP_PRIVATE_DEFAULT_WIDTH_X, opNumber(widthInfo.mode));
      if (!widthInfo.monospace) {
        privateDict.set(OP_PRIVATE_NOMINAL_WIDTH_X, opNumber(widthInfo.nominal));
      }

      const privateDictPos = dataBuf.byteLength;
      privateDict.write(dataBuf);
      dict.set(
        OP_PRIVATE_INDEX,
        opNumber(dataBuf.byteLength - privateDictPos),
        opFixedInt(privateDictPos, baseOffset),
      );

      // No Local Subroutine Index

      fontDicts.push(dict);
    }

    const buf = new ByteArrayBuilder();

    // Header
    buf.uint8(1); // major version
    buf.uint8(0); // minor version
    buf.uint8(4); // header size
    buf.uint8(absOffsetSize); // absolute offset size

    // Name Index
    writeIndex(buf, 2, this.fonts.map((f) => ByteArrayBuilder.latin1(f.name)));

    // Since the offsets recorded in the dictionaries depend on the size of the dictionary
    // and index, we have to perform 2 passes here: first with incorrect offsets (but fixed
    // sizes) to find the correct values, then a second time to record the actual values.
    // Yes it's very dumb, but it's how the file format works.

    // Top Dict Index (pass 1)
    const topDictBuf1 = new ByteArrayBuilder();
    writeIndex(topDictBuf1, 2, fontDicts.map((dict) => dict.toBytes()));

    // String Index
    const ssBuf = new ByteArrayBuilder();
    writeIndex(ssBuf, 2, strings.strings.map(ByteArrayBuilder.latin1));

    // Global Subroutine Index
    writeIndex(ssBuf, 2, []);

    baseOffset.value = buf.byteLength + topDictBuf1.byteLength + ssBuf.byteLength;

    // Top Dict Index (pass 2)
    writeIndex(buf, 2, fontDicts.map((dict) => dict.toBytes()));

    // String Index & Global Subroutine Index (unchanged by second pass)
    buf.append(ssBuf);

    if (buf.byteLength !== baseOffset.value) {
      throw new Error('dictionary size changed!');
    }

    // Rest of data (Encodings / Charsets / etc.)
    buf.append(dataBuf);

    return buf;
  }

  writeCFF2() {
    // https://learn.microsoft.com/en-us/typography/opentype/spec/cff2

    if (this.fonts.length !== 1) {
      throw new Error('Cannot generate CFF2 for multiple fonts');
    }
    const font = this.fonts[0];

    const dataBuf = new ByteArrayBuilder();
    const baseOffset = { value: 0 }; // filled in later

    // Top Dict Index (written later)
    const topDict = new Dict();

    if (font.em !== 1000) {
      topDict.set(OP_FONT_MATRIX, opArray([
        1 / font.em, 0, 0,
        1 / font.em, 0, 0,
      ]));
    }

    // CharStrings Index
    topDict.set(OP_CHAR_STRINGS_INDEX, opFixedInt(dataBuf.byteLength, baseOffset));
    writeIndex(dataBuf, 4, font.glyphs.map((glyph) => {
      const gbuf = new ByteArrayBuilder();
      for (const [op, ...data] of glyph.cff.data.instructions) {
        const operator = getCFFOp(op);
        if (!operator || operator.cff1 === false) {
          throw new Error(`Unknown CFF1 operator: ${op}`);
        }
        writeOperation(gbuf, operator, data.map(opType2Number));
      }
      return gbuf;
    }));

    // Private Dict
    const privateDict = new Dict();
    //privateDict.set(OP_PRIVATE_BLUE_SCALE, opNumber(0.039625));
    //privateDict.set(OP_PRIVATE_BLUE_SHIFT, opNumber(7));
    //privateDict.set(OP_PRIVATE_BLUE_FUZZ, opNumber(1));
    //privateDict.set(OP_PRIVATE_FORCE_BOLD, opNumber(0));
    //privateDict.set(OP_PRIVATE_EXP_FACTOR, opNumber(0.06));

    // Just one Font DICT - not currently supporting FDSelect
    const fontDicts = [new Dict()];

    const privateDictPos = dataBuf.byteLength;
    privateDict.write(dataBuf);
    fontDicts[0].set(
      OP_PRIVATE_INDEX,
      opNumber(dataBuf.byteLength - privateDictPos),
      opFixedInt(privateDictPos, baseOffset),
    );

    topDict.set(OP_CID_FONT_DICT_ARRAY, opFixedInt(dataBuf.byteLength, baseOffset));
    writeIndex(dataBuf, 4, fontDicts.map((dict) => dict.toBytes()));

    const buf = new ByteArrayBuilder();

    // Header
    buf.uint8(2); // major version
    buf.uint8(0); // minor version
    buf.uint8(5); // header size

    // CFF2 maintains the need to perform 2 passes to get correct indices:

    // Top Dict Index (pass 1)
    const topDictBuf1 = topDict.toBytes();
    buf.uint16BE(topDictBuf1.byteLength); // Top DICT size

    // Global Subroutine Index
    const sBuf = new ByteArrayBuilder();
    writeIndex(sBuf, 4, []);

    baseOffset.value = buf.byteLength + topDictBuf1.byteLength + sBuf.byteLength;

    // Top Dict Index (pass 2)
    buf.append(topDict.toBytes());
    buf.append(sBuf);

    if (buf.byteLength !== baseOffset.value) {
      throw new Error('dictionary size changed!');
    }

    // Rest of data (Encodings / Charsets / etc.)
    buf.append(dataBuf);

    return buf;
  }
}

/**
 * @param {number[]} advanceWidths
 * @return {{ monospace: boolean; mode: number; nominal: number }}
 */
function getAdvanceWidthInfo(advanceWidths) {
  const n = advanceWidths.length;
  if (!n) {
    return { monospace: true, mode: 0, nominal: 0 };
  }
  const widths = advanceWidths.sort((a, b) => a - b);
  if (widths[n - 1] === widths[0]) {
    return { monospace: true, mode: widths[0], nominal: widths[0] };
  }
  let maxVal = 0;
  let maxCount = 0;

  let count = 0;
  let cur = -1;
  for (let i = 0; i < n + 1; ++i) {
    if (widths[i] === cur) {
      ++count;
    } else {
      if (count > maxCount) {
        maxVal = cur;
        maxCount = count;
      }
      cur = widths[i];
      count = 1;
    }
  }
  // nominal should actually be chosen more carefully for best compression, but median seems like a good starting point
  return { monospace: false, mode: maxVal, nominal: widths[n >>> 1] };
}
