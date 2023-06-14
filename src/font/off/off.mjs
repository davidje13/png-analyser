import { ByteArrayBuilder } from '../../data/builder.mjs';
import { CFF } from '../cff/cff.mjs';
import { Glyph } from '../cff/glyph.mjs';
import { UniqueStrings } from '../unique_strings.mjs';

/**
 * @typedef {import('../font.mjs').Font} Font
 *
 * @typedef {{
 *   tag: string;
 *   checksum: number;
 *   offset: number;
 *   length: number;
 *   buf: ByteArrayBuilder | ArrayBufferView;
 * }} Table
 */

const TABLE_DIRECTORY_HEADER_LENGTH = 12;
const TABLE_RECORD_LENGTH = 16;
const HEAD_CHECKSUM_ADJUSTMENT_INDEX = 8;

/**
 * @param {number[]} values
 * @return {number}
 */
function average(values) {
  const sum = values.reduce((a, b) => (a + b), 0);
  return sum / values.length;
}

/**
 * @param {string} v
 * @return {number}
 */
function tag(v) {
  if (v.length !== 4 || !/^[!-~]+ *$/.test(v)) {
    throw new Error(`Invalid tag: '${v}'`);
  }
  return (
    (v.charCodeAt(0) << 24) |
    (v.charCodeAt(1) << 16) |
    (v.charCodeAt(2) << 8) |
    v.charCodeAt(3)
  );
}

/**
 * @param {boolean[]} bits
 * @return {number}
 */
function flags(...bits) {
  if ((bits.length % 8) !== 0) {
    throw new Error('Bad number of entries in flags');
  }
  // bits are encoded little-to-big to match the documentation
  let v = 0;
  for (let i = 0; i < bits.length; ++i) {
    v |= (bits[i] ? (1 << i) : 0);
  }
  return v;
}

/**
 * @param {number} v
 */
function fixed_16_16(v) {
  if (v < -32768 || v >= 32768) {
    throw new Error(`Value out of range: ${v}`);
  }
  const i = Math.floor(v);
  const f = Math.floor((v - i) * 0x10000);
  return (i << 16) | f;
}

/**
 * @param {number} v
 */
function fixed_2_14(v) {
  if (v < -2 || v >= 2) {
    throw new Error(`Value out of range: ${v}`);
  }
  const i = Math.floor(v) & 0b11;
  const f = Math.floor((v - i) * 0b100000000000000);
  return (i << 14) | f;
}

/**
 * @param {ByteArrayBuilder | ArrayBufferView} buf
 */
function calculateChecksum(buf) {
  let checksum = 0;
  const bytes = buf.byteLength;
  const data = new DataView(buf.buffer, buf.byteOffset, bytes);
  let i = 0;
  for (; i + 3 < bytes; i += 4) {
    checksum = (checksum + data.getUint32(i, false)) & 0xFFFFFFFF;
  }
  let finalBlock = 0;
  for (let j = 0; j < 4; ++j) {
    finalBlock <<= 8;
    if (i + j < bytes) {
      finalBlock |= data.getUint8(i);
    }
  }
  return (checksum + finalBlock) & 0xFFFFFFFF;
}

/**
 * @param {ByteArrayBuilder} buf
 * @param {number} fontVersion
 * @param {Table[]} tables
 */
function writeTableDirectory(buf, fontVersion, tables) {
  buf.uint32BE(fontVersion);
  buf.uint16BE(tables.length);
  const entrySelector = Math.floor(Math.log2(tables.length));
  const searchRange = Math.pow(2, entrySelector);
  buf.uint16BE(searchRange * 16);
  buf.uint16BE(entrySelector);
  buf.uint16BE((tables.length - searchRange) * 16);

  for (const table of tables) {
    buf.uint32BE(tag(table.tag));
    buf.uint32BE(table.checksum);
    buf.uint32BE(table.offset);
    buf.uint32BE(table.length);
  }
}

/**
 * @param {(buf: ByteArrayBuilder) => void} fn
 */
function makeBuf(fn) {
  const buf = new ByteArrayBuilder();
  fn(buf);
  return buf;
}

/**
 * @param {Omit<Table, 'offset' | 'length' | 'checksum'>[]} tables
 * @return {Table[]}
 */
function normaliseTables(tables) {
  let curOffset = TABLE_DIRECTORY_HEADER_LENGTH + tables.length * TABLE_RECORD_LENGTH;
  return [...tables].sort((a, b) => (a.tag < b.tag) ? -1 : (a.tag > b.tag) ? 1 : 0).map((table) => {
    const length = table.buf.byteLength;
    curOffset = ((curOffset + 3) & ~3) + length;
    return {
      ...table,
      offset: curOffset - length,
      length,
      checksum: calculateChecksum(table.buf),
    };
  });
}

/**
 * @param {Glyph[]} glyphs
 */
function makeSegments(glyphs) {
  let curSegment = null;
  const segments = [];
  for (const glyph of glyphs) {
    if (glyph.charCode === -1) {
      curSegment = null;
    } else if (
      curSegment &&
      glyph.charCode === curSegment.endCharCode + 1 &&
      glyph.charCode + curSegment.delta === glyph.index
    ) {
      curSegment.endCharCode++;
    } else {
      if (glyph.index === undefined) {
        throw new Error('invalid glyph state');
      }
      curSegment = {
        startCharCode: glyph.charCode,
        endCharCode: glyph.charCode,
        delta: glyph.index - glyph.charCode,
      };
      segments.push(curSegment);
    }
  }
  if (!curSegment || curSegment.endCharCode < 0xFFFF) {
    // final entry required so that lookups of higher characters are able to terminate in old clients
    segments.push({ startCharCode: 0xFFFF, endCharCode: 0xFFFF, delta: 1 }); // 0xFFFF + 1 = 0 = missing glyph
  }
  return segments;
}

const PLATENC_UNI_BMP_ANY = { platformID: 0, encodingID: 4, languageTag: 0, encoder: ByteArrayBuilder.utf16BE };
const PLATENC_MAC_ROMAN_EN = { platformID: 1, encodingID: 0, languageTag: 0, encoder: ByteArrayBuilder.latin1 }; // for legacy software
const PLATENC_WIN_BMP_EN = { platformID: 3, encodingID: 1, languageTag: 0x0809, encoder: ByteArrayBuilder.utf16BE }; // also recommended for Mac now

/**
 * @type {<T extends { value: unknown }>(v: T) => v is T & { value: object }}
 */
const nonNullValue = (v) => Boolean(v.value);

/**
 * @param {Font} font
 * @return {{
 *   type: number;
 *   platformID: number;
 *   encodingID: number;
 *   languageTag: number | string;
 *   languageTagId?: number;
 *   encoder: (v: string) => ByteArrayBuilder;
 *   value: string;
 * }[]}
 */
function createNames(font) {
  const version = `${font.majorVersion}.${font.minorVersion}`;
  const name = font.name;
  const style = (font.weight > 400) ? 'Bold' : 'Regular';
  const psName = `${name}-${style}`;

  const names = [];

  // required
  names.push({ ...PLATENC_WIN_BMP_EN, type: 1, value: name }); // font family name
  names.push({ ...PLATENC_WIN_BMP_EN, type: 2, value: style }); // font style name
  names.push({ ...PLATENC_WIN_BMP_EN, type: 4, value: `${name} ${style}` }); // font full name
  names.push({ ...PLATENC_WIN_BMP_EN, type: 6, value: psName }); // postscript name
  names.push({ ...PLATENC_MAC_ROMAN_EN, type: 6, value: psName }); // postscript name

  // optional
  names.push({ ...PLATENC_WIN_BMP_EN, type: 0, value: font.copyright }); // copyright
  names.push({ ...PLATENC_WIN_BMP_EN, type: 3, value: `${name}:${style}:${version}` }); // font unique ID
  names.push({ ...PLATENC_WIN_BMP_EN, type: 5, value: `Version ${version}` }); // font version
  names.push({ ...PLATENC_WIN_BMP_EN, type: 8, value: font.manufacturer }); // manufacturer
  names.push({ ...PLATENC_WIN_BMP_EN, type: 9, value: font.designer }); // designer
  names.push({ ...PLATENC_WIN_BMP_EN, type: 11, value: font.manufacturerURL }); // manufacturer URL
  names.push({ ...PLATENC_WIN_BMP_EN, type: 12, value: font.designerURL }); // designer URL
  names.push({ ...PLATENC_WIN_BMP_EN, type: 16, value: name }); // typographic family name
  names.push({ ...PLATENC_WIN_BMP_EN, type: 17, value: style }); // typographic subfamily name
  names.push({ ...PLATENC_WIN_BMP_EN, type: 19, value: font.sampleText }); // sample text

  return names.filter(nonNullValue);
}

export class OpenTypeFont {
  // https://docs.microsoft.com/en-us/typography/opentype/spec/

  /**
   * @param {Font} font
   */
  constructor(font) {
    this.font = font;
  }

  writeOTF() {
    const em = this.font.em;

    this.font.glyphs.sort((a, b) => (a.charCode - b.charCode));
    let uniqueGlyphAdvanceWidths = 1;
    let lastAdvanceWidth = -1;
    for (let index = 0; index < this.font.glyphs.length; ++index) {
      const glyph = this.font.glyphs[index];
      glyph.index = index;
      if (glyph.advanceWidth != lastAdvanceWidth) {
        uniqueGlyphAdvanceWidths = index + 1;
        lastAdvanceWidth = glyph.advanceWidth;
      }
    }
    const segments = makeSegments(this.font.glyphs);
    const nonEmptyGlyphs = this.font.glyphs.filter((g) => !g.isEmpty());

    const names = createNames(this.font);

    const languageTags = new UniqueStrings();
    for (const name of names) {
      if (typeof name.languageTag === 'number') {
        name.languageTagId = name.languageTag;
      } else {
        name.languageTagId = 0x8000 + languageTags.add(name.languageTag);
      }
    }

    names.sort((a, b) => (
      (a.platformID - b.platformID) ||
      (a.encodingID - b.encodingID) ||
      ((a.languageTagId ?? err('missing language tag ID')) - (b.languageTagId ?? err('missing language tag ID'))) ||
      (a.type - b.type)
    ));

    const head = { tag: 'head', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/head
      buf.uint16BE(1); // major version
      buf.uint16BE(0); // minor version
      buf.uint16BE(this.font.majorVersion); // font revision major (see name.version_string)
      buf.uint16BE(this.font.minorVersion); // font revision minor (see name.version_string)
      buf.uint32BE(0); // checksum adjustment (filled in at end; see HEAD_CHECKSUM_ADJUSTMENT_INDEX)
      buf.uint32BE(0x5F0F3CF5); // "magic number"
      buf.uint16BE(flags(
        false, // 0: baseline for font at y=0
        false, // 1: left sidebearing point at x=0
        false, // 2: instructions may depend on font size
        false, // 3: force ppem to integer for all internal scalar math
        false, // 4: instructions may alter advance width
        false, // 5: unused
        false, false, false, false, false, // 6-10: unused
        false, // 11: "lossless"
        false, // 12: converted
        false, // 13: optimised for ClearType
        false, // 14: last resort font
        false, // 15: reserved
      ));
      buf.uint16BE(em); // units per em (16--16384)
      buf.uint64BE(0n); // created (seconds since 1904-01-01T00:00:00Z)
      buf.uint64BE(0n); // modified (seconds since 1904-01-01T00:00:00Z)
      const aggBounds = this.font.aggNonEmptyBounds();
      buf.uint16BE(aggBounds.xmin);
      buf.uint16BE(aggBounds.ymin);
      buf.uint16BE(aggBounds.xmax);
      buf.uint16BE(aggBounds.ymax);
      buf.uint16BE(flags( // mac style (see os2.fs_selection)
        false, // 0: bold
        false, // 1: italic
        false, // 2: underline
        false, // 3: outline
        false, // 4: shadow
        false, // 5: condensed
        false, // 6: extended
        false, false, false, false, false, false, false, false, false, // 7-15: reserved
      ));
      buf.uint16BE(5); // smallest readable size in pixels
      buf.uint16BE(2); // font direction hint (deprecated; fixed at 2)
      buf.uint16BE(0); // offsets are: 16bits (0) or 32bits (1)
      buf.uint16BE(0); // glyph data format
    }) };

    const name = { tag: 'name', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/name
      const headerLength = 6 + names.length * 12 + 2 + languageTags.length * 4;
      let curOffset = 0;
      buf.uint16BE(1); // version
      buf.uint16BE(names.length); // count
      buf.uint16BE(headerLength); // storage area offset
      /** @type {ByteArrayBuilder[]} */ const encodeds = [];
      for (const name of names) {
        const encoded = name.encoder(name.value);
        const length = encoded.byteLength;
        encodeds.push(encoded);
        buf.uint16BE(name.platformID); // platform ID
        buf.uint16BE(name.encodingID); // platform encoding ID
        buf.uint16BE(name.languageTagId ?? err('missing language tag ID')); // language ID
        buf.uint16BE(name.type); // name ID
        buf.uint16BE(length); // byte length
        buf.uint16BE(curOffset); // storage offset within storage area
        curOffset += length;
      }
      buf.uint16BE(languageTags.length); // count
      for (const languageTag of languageTags.strings) {
        const length = languageTag.length * 2;
        buf.uint16BE(length); // byte length
        buf.uint16BE(curOffset); // storage offset within storage area
        curOffset += length;
      }
      // data storage area
      for (const encoded of encodeds) {
        buf.append(encoded);
      }
      for (const languageTag of languageTags.strings) {
        buf.utf16BE(languageTag);
      }
    }) };

    const os2 = { tag: 'OS/2', buf: makeBuf((buf) => {
      const version = 5;
      // https://docs.microsoft.com/en-us/typography/opentype/spec/os2
      buf.uint16BE(version); // version
      buf.int16BE(Math.round(average(nonEmptyGlyphs.map((g) => (g.bounds.xmax - g.bounds.xmin))))); // average char width
      buf.uint16BE(this.font.weight); // us weight class
      buf.uint16BE(5); // us width class
      buf.uint16BE(flags( // fs type (licensing)
        false, // 0: reserved / deprecated
        false, // 1: [2] no embedding or sharing
        false, // 2: [4] non-permanent install for read-only preview & print embedding
        false, // 3: [8] non-permanent install for editable embedding
        false, false, false, false, // 4-7: reserved
        false, // 8: no subsetting
        false, // 9: bitmap embedding only
        false, false, false, false, false, false // 10-15: reserved
      ));
      buf.int16BE(em); // y subscript x size
      buf.int16BE(em); // y subscript y size
      buf.int16BE(0); // y subscript x offset
      buf.int16BE(em / 2); // y subscript y offset
      buf.int16BE(em); // y superscript x size
      buf.int16BE(em); // y superscript y size
      buf.int16BE(0); // y superscript x offset
      buf.int16BE(em / 2); // y superscript y offset
      buf.int16BE(this.font.strikeoutSize); // y strikeout size
      buf.int16BE(em / 2); // y strikeout position
      buf.int8(8); // s family class general [8 = sans-serif]
      buf.int8(9); // s family class specific [9 = typewriter]
      buf.uint8(2); // panose family type [2 = latin text] - https://monotype.github.io/panose/pan2.htm
      buf.uint8(0); // panose serif style
      buf.uint8(0); // panose weight
      buf.uint8(0); // panose proportion
      buf.uint8(0); // panose contrast
      buf.uint8(0); // panose stroke variation
      buf.uint8(0); // panose arm style
      buf.uint8(0); // panose letterform
      buf.uint8(0); // panose midline
      buf.uint8(0); // panose x height
      buf.uint32BE(0x00000001); // ul unicode range 1 [basic latin]
      if (version >= 1) {
        buf.uint32BE(0x00000000); // ul unicode range 2
        buf.uint32BE(0x00000000); // ul unicode range 3
        buf.uint32BE(0x00000000); // ul unicode range 4
      }
      buf.uint32BE(0); // ach vend id
      buf.uint16BE(flags( // fs selection (see head.mac_style)
        false, // 0: italic
        false, // 1: underscore
        false, // 2: negative
        false, // 3: outlined
        false, // 4: strikeout
        false, // 5: bold
        true, // 6: regular
        true, // 7: use typo metrics
        false, // 8: weight/width/slipe
        false, // 9: oblique
        false, false, false, false, false, false, // 10-15: reserved
      ));
      buf.uint16BE(Math.min(this.font.glyphs[1]?.charCode ?? 0xFFFF, 0xFFFF)); // us first char index
      buf.uint16BE(Math.min(this.font.glyphs[this.font.glyphs.length - 1].charCode, 0xFFFF)); // us last char index
      buf.int16BE(em); // s typo ascender
      buf.int16BE(0); // s typo descender
      buf.int16BE(0); // s typo line gap
      buf.uint16BE(em); // us win ascent
      buf.uint16BE(0); // us win descent
      if (version >= 1) {
        buf.uint32BE(0x00000001); // ul code page range 1
        buf.uint32BE(0x00000000); // ul code page range 2
      }
      if (version >= 2) {
        buf.int16BE(0); // sx height
        buf.int16BE(0); // s cap height
        buf.uint16BE(0); // us default char
        buf.uint16BE(' '.codePointAt(0) ?? err()); // us break char
        buf.uint16BE(1); // us max context
      }
      if (version >= 5) {
        buf.uint16BE(0); // us lower optical point size
        buf.uint16BE(0xFFFF); // us upper optical point size
      }
    }) };

    const hhea = { tag: 'hhea', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/hhea
      buf.uint16BE(1); // major version
      buf.uint16BE(0); // minor version
      buf.int16BE(em); // ascender
      buf.int16BE(0); // descender
      buf.int16BE(0); // line gap
      buf.uint16BE(Math.max(...this.font.glyphs.map((g) => g.advanceWidth))); // advance width max
      buf.int16BE(Math.min(...nonEmptyGlyphs.map((g) => g.bounds.xmin))); // min left side bearing
      buf.int16BE(Math.min(...nonEmptyGlyphs.map((g) => (g.advanceWidth - g.bounds.xmax)))); // min right side bearing
      buf.int16BE(Math.max(...this.font.glyphs.map((g) => g.bounds.xmax))); // x max extent
      buf.int16BE(1); // caret slope rise
      buf.int16BE(0); // caret slope run
      buf.int16BE(0); // caret offset
      buf.int16BE(0); // reserved
      buf.int16BE(0); // reserved
      buf.int16BE(0); // reserved
      buf.int16BE(0); // reserved
      buf.int16BE(0); // metric data format
      buf.uint16BE(uniqueGlyphAdvanceWidths); // count of hMetric entries in hmtx
    }) };

    const hmtx = { tag: 'hmtx', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/hmtx
      for (let i = 0; i < this.font.glyphs.length; ++i) {
        const glyph = this.font.glyphs[i];
        if (i < uniqueGlyphAdvanceWidths) {
          buf.uint16BE(glyph.advanceWidth); // advance width
        }
        buf.int16BE(glyph.bounds.xmin); // left side bearing
      }
    }) };

    const maxp = { tag: 'maxp', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/maxp
      buf.uint32BE(0x00005000); // version
      buf.uint16BE(this.font.glyphs.length); // glyph count
    }) };

    const post = { tag: 'post', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/post
      buf.uint16BE(0x0003); // major version
      buf.uint16BE(0x0000); // minor version
      buf.uint32BE(fixed_16_16(0)); // italic angle
      buf.uint16BE(0); // underline position
      buf.uint16BE(0); // underline thickness
      buf.uint32BE(this.font.isMono() ? 1 : 0); // fixed pitch flag
      buf.uint32BE(0); // optional memory management info
      buf.uint32BE(0); // optional memory management info
      buf.uint32BE(0); // optional memory management info
      buf.uint32BE(0); // optional memory management info
    }) };

    /**
     * @type {{
     *   platformID: number;
     *   encodingID: number;
     *   buf: ByteArrayBuilder | number;
     *   offset?: number;
     * }[]}
     */ const encodingRecords = [];
    encodingRecords.push({ platformID: 0, encodingID: 3, buf: makeBuf((buf) => { // Unicode BMP
      buf.uint16BE(4); // subtable format
      buf.uint16BE(0); // length (populated at end)
      buf.uint16BE(0); // language (must be 0 for non-mac platform)
      const entrySelector = Math.floor(Math.log2(segments.length));
      const searchRange = Math.pow(2, entrySelector);
      buf.uint16BE(segments.length * 2); // seg count * 2
      buf.uint16BE(searchRange * 2);
      buf.uint16BE(entrySelector);
      buf.uint16BE((segments.length - searchRange) * 2);
      for (const segment of segments) {
        buf.uint16BE(segment.endCharCode);
      }
      buf.uint16BE(0); // reserved
      for (const segment of segments) {
        buf.uint16BE(segment.startCharCode);
      }
      for (const segment of segments) {
        buf.int16BE(segment.delta);
      }
      for (const segment of segments) {
        buf.uint16BE(0); // range offset (0 for all; not using glyph ID array)
      }
      // not using glyph ID array

      buf.replaceUint16BE(2, buf.byteLength); // replace length
    }) });
    encodingRecords.push({ platformID: 3, encodingID: 1, buf: 0 }); // Windows BMP is same as Unicode BMP; share data

    const cmap = { tag: 'cmap', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/cmap
      buf.uint16BE(0); // version
      buf.uint16BE(encodingRecords.length); // encoding table count
      let curOffset = 4 + encodingRecords.length * 8;
      for (const encodingRecord of encodingRecords) {
        buf.uint16BE(encodingRecord.platformID); // platform ID
        buf.uint16BE(encodingRecord.encodingID); // platform encoding ID
        if (typeof encodingRecord.buf === 'number') {
          const target = encodingRecords[encodingRecord.buf];
          if (target.offset === undefined) {
            throw new Error('invalid cmap data order');
          }
          buf.uint32BE(target.offset); // offset
        } else {
          buf.uint32BE(curOffset); // offset
          encodingRecord.offset = curOffset;
          curOffset += encodingRecord.buf.byteLength;
        }
      }
      for (const encodingRecord of encodingRecords) {
        if (typeof encodingRecord.buf !== 'number') {
          buf.append(encodingRecord.buf);
        }
      }
    }) };

    const cff = { tag: 'CFF ', buf: new CFF([this.font]).writeCFF() };

    const buf = new ByteArrayBuilder();

    const tables = normaliseTables([head, name, os2, hhea, hmtx, maxp, post, cmap, cff]);
    writeTableDirectory(buf, tag('OTTO'), tables);

    for (const table of tables) {
      buf.padTo(table.offset);
      buf.append(table.buf);
    }

    const nHead = tables.find((t) => t.tag === 'head');
    if (!nHead) {
      throw new Error('no head table');
    }
    buf.replaceUint32BE(
      nHead.offset + HEAD_CHECKSUM_ADJUSTMENT_INDEX,
      (0xB1B0AFBA - calculateChecksum(buf)) & 0xFFFFFFFF
    );

    return buf;
  }
}

/**
 * @param {string=} msg
 * @return {never}
 */
function err(msg = 'missing value') {
  throw new Error(msg);
}