import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writePNG } from '../../image/png/png-write.mjs';
import { CFF } from '../cff/cff.mjs';
import { UniqueStrings } from '../unique_strings.mjs';

/**
 * @typedef {import('../font.mjs').Font} Font
 * @typedef {import('./off_glyph.mjs').OFFGlyph} OFFGlyph
 * @typedef {import('./off_glyph.mjs').CharactersSVGDocument} CharactersSVGDocument
 * @typedef {import('./off_glyph.mjs').Raster} Raster
 * @typedef {import('./off_glyph.mjs').SbixRaster} SbixRaster
 *
 * @typedef {{
 *   tag: string;
 *   checksum: number;
 *   offset: number;
 *   length: number;
 *   buf: ByteArrayBuilder | ArrayBufferView;
 * }} Table
 *
 * @typedef {Pick<Table, 'tag' | 'buf'>} TableDef
 *
 * @typedef {{ glyph: OFFGlyph; raster: Raster }[]} Strike
 * @typedef {{ glyph: OFFGlyph; raster: SbixRaster }[]} SbixStrike
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
 * @param {(TableDef | null)[]} tables
 * @return {Table[]}
 */
function normaliseTables(tables) {
  const t = tables.filter(notNull);
  let curOffset = TABLE_DIRECTORY_HEADER_LENGTH + t.length * TABLE_RECORD_LENGTH;
  return [...t].sort((a, b) => (a.tag < b.tag) ? -1 : (a.tag > b.tag) ? 1 : 0).map((table) => {
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
 * @param {OFFGlyph[]} glyphs
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

    /** @type {(TableDef | null)[]} */ const tableDefs = [];

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
    const nonEmptyGlyphs = this.font.nonEmptyGlyphs;

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

    tableDefs.push({ tag: 'head', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/head
      buf.uint16BE(1); // major version
      buf.uint16BE(0); // minor version
      buf.uint32BE(Math.round(( // font revision [16.16 fixed] (see CFF1 name.version_string)
        this.font.majorVersion + this.font.minorVersion * 0.001
      ) * 0x10000));
      buf.uint32BE(0); // checksum adjustment (filled in at end; see HEAD_CHECKSUM_ADJUSTMENT_INDEX)
      buf.uint32BE(0x5F0F3CF5); // "magic number"
      buf.uint16BE(flags(
        false, // 0: baseline for font at y=0
        nonEmptyGlyphs.every((g) => g.leftSideBearing === g.cff.data.bounds.xmin), // 1: left sidebearing point at x=0
        false, // 2: instructions may depend on font size
        this.font.forceInteger, // 3: force ppem to integer for all internal scalar math
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
    }) });

    tableDefs.push({ tag: 'name', buf: makeBuf((buf) => {
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
    }) });

    tableDefs.push({ tag: 'OS/2', buf: makeBuf((buf) => {
      const version = 5;
      // https://docs.microsoft.com/en-us/typography/opentype/spec/os2
      buf.uint16BE(version); // version
      buf.int16BE(Math.round(average(nonEmptyGlyphs.map((g) => g.advanceWidth)))); // average char width
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
      buf.int16BE(this.font.strikeoutPosition); // y strikeout position
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
        version >= 4 && true, // 7: use typo metrics
        version >= 4 && false, // 8: weight/width/slope
        version >= 4 && false, // 9: oblique
        false, false, false, false, false, false, // 10-15: reserved
      ));
      buf.uint16BE(Math.min(this.font.glyphs[1]?.charCode ?? 0xFFFF, 0xFFFF)); // us first char index
      buf.uint16BE(Math.min(this.font.glyphs[this.font.glyphs.length - 1].charCode, 0xFFFF)); // us last char index
      const asc = Math.max(...nonEmptyGlyphs.map((g) => g.cff.data.bounds.ymax));
      const desc = Math.min(...nonEmptyGlyphs.map((g) => g.cff.data.bounds.ymin));
      buf.int16BE(asc); // s typo ascender
      buf.int16BE(desc); // s typo descender
      buf.int16BE(Math.round(this.font.em * this.font.lineheight - (asc - desc))); // s typo line gap
      buf.uint16BE(asc); // us win ascent
      buf.uint16BE(-desc); // us win descent
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
        // superseded by STAT table
        buf.uint16BE(0); // us lower optical point size
        buf.uint16BE(0xFFFF); // us upper optical point size
      }
    }) });

    tableDefs.push({ tag: 'hhea', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/hhea
      buf.uint16BE(1); // major version
      buf.uint16BE(0); // minor version
      buf.int16BE(Math.max(0, ...nonEmptyGlyphs.map((g) => g.cff.data.bounds.ymax))); // ascender
      buf.int16BE(Math.min(0, ...nonEmptyGlyphs.map((g) => g.cff.data.bounds.ymin))); // descender // TODO: should sign be positive?
      buf.int16BE(0); // line gap
      buf.uint16BE(Math.max(...this.font.glyphs.map((g) => g.advanceWidth))); // advance width max
      buf.int16BE(Math.min(...nonEmptyGlyphs.map((g) => g.leftSideBearing))); // min left side bearing
      buf.int16BE(Math.min(...nonEmptyGlyphs.map((g) => g.rightSideBearing))); // min right side bearing
      buf.int16BE(Math.max(...nonEmptyGlyphs.map((g) => g.leftSideBearing + g.boundsWidth))); // x max extent
      buf.int16BE(1); // caret slope rise
      buf.int16BE(0); // caret slope run
      buf.int16BE(0); // caret offset
      buf.int16BE(0); // reserved
      buf.int16BE(0); // reserved
      buf.int16BE(0); // reserved
      buf.int16BE(0); // reserved
      buf.int16BE(0); // metric data format
      buf.uint16BE(uniqueGlyphAdvanceWidths); // count of hMetric entries in hmtx
    }) });

    tableDefs.push({ tag: 'hmtx', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/hmtx
      for (let i = 0; i < this.font.glyphs.length; ++i) {
        const glyph = this.font.glyphs[i];
        if (i < uniqueGlyphAdvanceWidths) {
          buf.uint16BE(glyph.advanceWidth); // advance width
        }
        buf.int16BE(glyph.leftSideBearing); // left side bearing
      }
    }) });

    tableDefs.push({ tag: 'maxp', buf: makeBuf((buf) => {
      // https://docs.microsoft.com/en-us/typography/opentype/spec/maxp
      buf.uint32BE(0x00005000); // version
      buf.uint16BE(this.font.glyphs.length); // glyph count
    }) });

    tableDefs.push({ tag: 'post', buf: makeBuf((buf) => {
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
    }) });

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

    tableDefs.push({ tag: 'cmap', buf: makeBuf((buf) => {
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
    }) });

    // gasp is for TrueType outlines
    //if (this.font.ttRendering.length) {
    //  tableDefs.push({ tag: 'gasp', buf: makeBuf((buf) => {
    //    buf.uint16BE(1); // version
    //    buf.uint16BE(this.font.ttRendering.length); // record count
    //    for (const r of this.font.ttRendering) {
    //      buf.uint16BE(r.emMaxPixels);
    //      buf.uint16BE(r.mode);
    //    }
    //  }) });
    //}

    const cff2 = false;

    // TODO: support bitmap-only font by not writing these tables
    if (cff2) {
      tableDefs.push({ tag: 'CFF2', buf: new CFF([this.font]).writeCFF2() });
    } else {
      tableDefs.push({ tag: 'CFF ', buf: new CFF([this.font]).writeCFF() });
    }

    /** @type {{ doc: string | CharactersSVGDocument; start: number; end: number }[]} */ const svgDocs = [];
    for (let i = 0; i <= this.font.glyphs.length; ++i) {
      const g = this.font.glyphs[i];
      const svg = g?.data?.svg;
      if (!svg) {
        continue;
      }
      const prev = svgDocs[svgDocs.length - 1];
      if (prev?.doc === svg.document && prev?.end === i - 1) {
        prev.end = i;
      } else {
        svgDocs.push({ doc: svg.document, start: i, end: i });
      }
    }

    if (svgDocs.length) {
      tableDefs.push({ tag: 'SVG ', buf: makeBuf((buf) => {
        // https://learn.microsoft.com/en-us/typography/opentype/spec/svg
        buf.uint16BE(0); // version
        buf.uint32BE(10); // svg documents index location (i.e. header size)
        buf.uint32BE(0); // reserved

        const dataBuf = new ByteArrayBuilder();

        // TODO: it is actually possible to reference the same document for multiple ranges,
        // so non-contiguous glyph ID ranges can reference a single document
        // (current code will duplicate the document for each range)

        const offset0 = 2 + svgDocs.length * 12;
        buf.uint16BE(svgDocs.length); // number of documents
        for (const { doc, start, end } of svgDocs) {
          let svgDocument = typeof doc === 'string' ? doc : `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>${(doc.defs ?? []).join('')}</defs>${doc.parts.join('')}</svg>`;
          for (let i = start; i <= end; ++i) {
            const oldID = this.font.glyphs[i].data.svg?.id ?? err();
            const newID = `glyph${i}`;
            const r = svgDocument.replace(`id="${oldID}"`, `id="${newID}"`);
            if (r === svgDocument) {
              throw new Error(`glyph ID ${oldID} not in SVG document`);
            }
            svgDocument = r;
          }
          const offset = dataBuf.byteLength;
          dataBuf.utf8(svgDocument.trim());
          buf.uint16BE(start); // start glyph ID
          buf.uint16BE(end); // end glyph ID
          buf.uint32BE(offset0 + offset); // offset
          buf.uint32BE(dataBuf.byteLength - offset); // length (bytes)
        }
        buf.append(dataBuf);
      }) });
    }

    /** @type {Strike[]} */ const strikes = [];
    for (const glyph of this.font.glyphs) {
      for (const raster of glyph.data.bitmaps ?? []) {
        let strike = strikes.find((s) => {
          const cmp = s[0].raster;
          return cmp.emPixels === raster.emPixels && cmp.bitsPerPixel === raster.bitsPerPixel;
        });
        if (!strike) {
          strike = [];
          strikes.push(strike);
        }
        // font.glyphs is already sorted by index, so these entries are pre-sorted
        strike.push({ glyph, raster });
      }
    }

    /** @type {SbixStrike[]} */ const sbixStrikes = [];
    for (const glyph of this.font.glyphs) {
      for (const raster of glyph.data.sbixBitmaps ?? []) {
        let strike = sbixStrikes.find((s) => {
          const cmp = s[0].raster;
          return cmp.emPixels === raster.emPixels && (cmp.pixelsPerInch ?? 72) === (raster.pixelsPerInch ?? 72);
        });
        if (!strike) {
          strike = [];
          sbixStrikes.push(strike);
        }
        // font.glyphs is already sorted by index, so these entries are pre-sorted
        strike.push({ glyph, raster });
      }
    }

    const greyStrikes = strikes.filter((s) => s[0].raster.bitsPerPixel !== 32);
    const rgbaStrikes = strikes.filter((s) => s[0].raster.bitsPerPixel === 32 || s[0].raster.forceColour);

    if (greyStrikes.length) {
      const { locationBuf, dataBuf } = makeBitmapTables(greyStrikes, 2);
      tableDefs.push({ tag: 'EBLC', buf: locationBuf });
      tableDefs.push({ tag: 'EBDT', buf: dataBuf });
    }

    if (rgbaStrikes.length) {
      const { locationBuf, dataBuf } = makeBitmapTables(strikes, 3);
      tableDefs.push({ tag: 'CBLC', buf: locationBuf });
      tableDefs.push({ tag: 'CBDT', buf: dataBuf });
    }

    if (sbixStrikes.length) {
      tableDefs.push({ tag: 'sbix', buf: makeBuf((buf) => {
        buf.uint16BE(1); // version
        buf.uint16BE(0b0000000000000001); // flags
        buf.uint32BE(sbixStrikes.length); // strike count
        writeIndexedData(
          buf,
          sbixStrikes,
          4,
          (dataBuf, strike) => {
            dataBuf.uint16BE(strike[0].raster.emPixels);
            dataBuf.uint16BE(strike[0].raster.pixelsPerInch ?? 72);
            writeIndexedData(
              dataBuf,
              [...this.font.glyphs, null],
              4,
              (glyphBuf, glyph) => {
                const data = strike.find((s) => s.glyph === glyph);
                if (!data) {
                  return; // glyph not defined for this strike
                }
                // these positions are somehow relative to the bottom left extent of the RENDERED glyph,
                // causing the position to look somewhat random. The image is also clipped within the bounds
                // of the rendered glyph in Chrome, so we cannot correct for the behaviour even with careful
                // choice of x and y offset here. To improve consistency, we render a bounding box around the
                // glyph if we have sbix data (on the assumption that all viewers will support at least one
                // of the other rendering methods)
                if (!data.glyph.cff.data.renderBounds) {
                  throw new Error('sbix data for glyph without renderBounds - positioning will probably be random');
                }
                glyphBuf.int16BE(0); // x offset
                glyphBuf.int16BE(0); // y offset
                glyphBuf.uint32BE(tag('png '));
                glyphBuf.append(writePNG(data.raster.bitmap));
              },
              (indexBuf, _, meta) => indexBuf.uint32BE(meta.data.indexOffset + 4),
            );
          },
          (indexBuf, _, meta) => indexBuf.uint32BE(meta.data.absoluteOffset),
        );
      }) });
    }

    //if (scaledStrikes.length) {
    //  tableDefs.push({ tag: 'EBSC', buf: makeBuf((buf) => {
    //    buf.uint16BE(2); // major version
    //    buf.uint16BE(0); // minor version
    //    buf.uint32BE(scaledStrikes.length); // number of sizes

    //    for (const strike of scaledStrikes) {
    //      buf.int8(); // h ascender
    //      buf.int8(); // h descender
    //      buf.uint8(); // h max width
    //      buf.int8(); // h caret slope numerator
    //      buf.int8(); // h caret slope denominator
    //      buf.int8(); // h caret offset
    //      buf.int8(); // h min origin sb
    //      buf.int8(); // h min advance sb
    //      buf.int8(); // h max before bl
    //      buf.int8(); // h min after bl
    //      buf.int8(0); // h pad 1
    //      buf.int8(0); // h pad 2

    //      buf.int8(); // v ascender
    //      buf.int8(); // v descender
    //      buf.uint8(); // v max width
    //      buf.int8(); // v caret slope numerator
    //      buf.int8(); // v caret slope denominator
    //      buf.int8(); // v caret offset
    //      buf.int8(); // v min origin sb
    //      buf.int8(); // v min advance sb
    //      buf.int8(); // v max before bl
    //      buf.int8(); // v min after bl
    //      buf.int8(0); // v pad 1
    //      buf.int8(0); // v pad 2

    //      buf.uint8(strike.em); // pixels per em x
    //      buf.uint8(strike.em); // pixels per em y
    //      buf.uint8(); // substitute pixels per em x
    //      buf.uint8(); // substitute pixels per em y
    //    }
    //  }) });
    //}

    const buf = new ByteArrayBuilder();

    const tables = normaliseTables(tableDefs);
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
 * @param {Strike[]} strikes
 * @param {number} version
 */
function makeBitmapTables(strikes, version) {
  const dataBuf = new ByteArrayBuilder();
  dataBuf.uint16BE(version); // major version
  dataBuf.uint16BE(0); // minor version

  const locationBuf = new ByteArrayBuilder();
  locationBuf.uint16BE(version); // major version
  locationBuf.uint16BE(0); // minor version
  locationBuf.uint32BE(strikes.length); // number of sizes

  // TODO: there is an issue with bounding boxes with these raster images:
  // Chrome uses a bounding box which imagines the raster's bottom edge matches the baseline.
  // The metrics listed here do not seem to help, so presumably there is another table of metrics which must be provided.

  writeIndexedData(
    locationBuf,
    strikes,
    48,
    (strikeDataBuf, strike) => {
      // TODO: pick subranges more intelligently for compression
      const subtables = divide(strike, (a, b) => b.glyph.index === (a.glyph.index ?? err()) + 1);
      const { indexByteLength } = writeIndexedData(
        strikeDataBuf,
        subtables,
        8,
        (entryDataBuf, subtable) => {
          const start = dataBuf.byteLength;

          const indexFormat = 1; // TODO: pick index format more intelligently for compression
          const imageFormat = 6; // TODO: pick image format more intelligently for compression
          entryDataBuf.uint16BE(indexFormat); // index format
          entryDataBuf.uint16BE(imageFormat); // image format
          entryDataBuf.uint32BE(start); // image data offset in **DT
          // index format 1:
          for (const { raster } of subtable) {
            entryDataBuf.uint32BE(dataBuf.byteLength - start);

            const h = raster.bitmap.length;
            const w = raster.bitmap[0].length;

            dataBuf.uint8(h); // height
            dataBuf.uint8(w); // width
            dataBuf.int8(raster.horizontalMetrics.tlOrigin.x); // horizontal bearing X
            dataBuf.int8(raster.horizontalMetrics.tlOrigin.y); // horizontal bearing Y
            dataBuf.uint8(raster.horizontalMetrics.advance); // horizontal advance
            dataBuf.int8(raster.verticalMetrics?.tlOrigin?.x ?? 0); // vertical bearing X
            dataBuf.int8(raster.verticalMetrics?.tlOrigin?.y ?? 0); // vertical bearing Y
            dataBuf.uint8(raster.verticalMetrics?.advance ?? 0); // vertical advance

            if (raster.bitsPerPixel === 8) {
              for (let y = 0; y < h; ++y) {
                for (let x = 0; x < w; ++x) {
                  dataBuf.uint8(raster.bitmap[y][x]);
                }
              }
            } else if (raster.bitsPerPixel === 32) {
              for (let y = 0; y < h; ++y) {
                for (let x = 0; x < w; ++x) {
                  const c = raster.bitmap[y][x]; // expects pre-multiplied
                  // RGBA -> BGRA
                  dataBuf.uint8((c >>> 8) & 0xFF);
                  dataBuf.uint8((c >>> 16) & 0xFF);
                  dataBuf.uint8((c >>> 24) & 0xFF);
                  dataBuf.uint8(c & 0xFF);
                }
              }
            } else {
              throw new Error('unsupported bit depth');
            }
          }
          // offset padding
          entryDataBuf.uint32BE(dataBuf.byteLength - start);
          entryDataBuf.uint32BE(0);
        },
        (indexBuf, subtable, meta) => {
          const startIndex = subtable[0].glyph.index ?? err();
          const endIndex = subtable[subtable.length - 1].glyph.index ?? err();
          indexBuf.uint16BE(startIndex); // start glyph index
          indexBuf.uint16BE(endIndex); // end glyph index
          indexBuf.uint32BE(meta.data.indexOffset);
        },
      );
      return { subtables, indexByteLength };
    },
    (indexBuf, strike, meta) => {
      indexBuf.uint32BE(meta.data.absoluteOffset);
      indexBuf.uint32BE(meta.data.byteLength);
      indexBuf.uint32BE(meta.dataResult.subtables.length);
      indexBuf.uint32BE(0); // color ref (unused / reserved)

      // TODO: check if calculation for these values is correct
      indexBuf.int8(Math.max(...strike.map((e) => e.raster.horizontalMetrics.tlOrigin.y))); // h ascender
      indexBuf.int8(Math.min(...strike.map((e) => e.raster.horizontalMetrics.tlOrigin.y - e.raster.bitmap.length))); // h descender
      indexBuf.uint8(Math.max(...strike.map((e) => e.raster.bitmap[0].length))); // h max width
      indexBuf.int8(0); // h caret slope numerator
      indexBuf.int8(1); // h caret slope denominator
      indexBuf.int8(0); // h caret offset
      indexBuf.int8(Math.min(...strike.map((e) => e.raster.horizontalMetrics.tlOrigin.x))); // h min origin sb
      indexBuf.int8(Math.min(...strike.map((e) => e.raster.horizontalMetrics.advance - e.raster.bitmap[0].length - e.raster.horizontalMetrics.tlOrigin.x))); // h min advance sb
      indexBuf.int8(Math.max(...strike.map((e) => e.raster.horizontalMetrics.tlOrigin.y - e.raster.bitmap.length))); // h max before bl
      indexBuf.int8(Math.min(...strike.map((e) => e.raster.horizontalMetrics.tlOrigin.y))); // h min after bl
      indexBuf.int8(0); // h pad 1
      indexBuf.int8(0); // h pad 2

      indexBuf.int8(0); // v ascender
      indexBuf.int8(0); // v descender
      indexBuf.uint8(0); // v max width
      indexBuf.int8(0); // v caret slope numerator
      indexBuf.int8(0); // v caret slope denominator
      indexBuf.int8(0); // v caret offset
      indexBuf.int8(0); // v min origin sb
      indexBuf.int8(0); // v min advance sb
      indexBuf.int8(0); // v max before bl
      indexBuf.int8(0); // v min after bl
      indexBuf.int8(0); // v pad 1
      indexBuf.int8(0); // v pad 2

      indexBuf.uint16BE(strike[0].glyph.index ?? err()); // start glyph index
      indexBuf.uint16BE(strike[strike.length - 1].glyph.index ?? err()); // end glyph index

      indexBuf.uint8(strike[0].raster.emPixels); // pixels per em x
      indexBuf.uint8(strike[0].raster.emPixels); // pixels per em y
      indexBuf.uint8(strike[0].raster.bitsPerPixel); // bit depth (1 / 2 / 4 / 8) / 32 for CB** tables
      indexBuf.uint8(0b00000001); // flags (0b00000001 = horizontal metrics, 0b00000010 = vertical) (unused since we are currently using bigmetrics for all characters)
    },
  );

  return { locationBuf, dataBuf };
}

/**
 * @type {<T>(x: T | null) => x is T}
 */
const notNull = (x) => x !== null;

/**
 * @template {unknown} T
 * @param {T[]} list
 * @param {(prev: T, next: T) => boolean} continuationFn
 * @return {T[][]}
 */
function divide(list, continuationFn) {
  /** @type {T[][]} */ const result = [];
  /** @type {T[]} */ let cur = [];
  for (let i = 0; i < list.length; ++i) {
    if (!i || !continuationFn(list[i - 1], list[i])) {
      cur = [];
      result.push(cur);
    }
    cur.push(list[i]);
  }
  return result;
}

/**
 * @template {unknown} T
 * @template {unknown} V
 * @param {ByteArrayBuilder} target
 * @param {T[]} entries
 * @param {number} indexEntrySize
 * @param {(
 *   target: ByteArrayBuilder,
 *   entry: T,
 *   meta: {
 *     i: number;
 *     data: {
 *       dataOffset: number;
 *       indexOffset: number;
 *       absoluteOffset: number;
 *     };
 *     index: {
 *       indexOffset: number;
 *       absoluteOffset: number;
 *     };
 *   },
 * ) => V} dataFn
 * @param {(
 *   target: ByteArrayBuilder,
 *   entry: T,
 *   meta: {
 *     i: number;
 *     data: {
 *       dataOffset: number;
 *       indexOffset: number;
 *       absoluteOffset: number;
 *       byteLength: number;
 *     };
 *     index: {
 *       indexOffset: number;
 *       absoluteOffset: number;
 *     };
 *     dataResult: V;
 *   },
 * ) => void} indexFn
 */
function writeIndexedData(target, entries, indexEntrySize, dataFn, indexFn) {
  const offset0 = target.byteLength;
  const indexByteLength = entries.length * indexEntrySize;
  const dataBuf = new ByteArrayBuilder();
  for (let i = 0; i < entries.length; ++i) {
    const entry = entries[i];
    const dataStart = dataBuf.byteLength;
    const dataResult = dataFn(dataBuf, entry, {
      i,
      data: {
        dataOffset: dataStart,
        indexOffset: indexByteLength + dataStart,
        absoluteOffset: offset0 + indexByteLength + dataStart,
      },
      index: {
        indexOffset: target.byteLength - offset0,
        absoluteOffset: target.byteLength,
      },
    });
    const dataEnd = dataBuf.byteLength;
    indexFn(target, entry, {
      i,
      data: {
        dataOffset: dataStart,
        indexOffset: indexByteLength + dataStart,
        absoluteOffset: offset0 + indexByteLength + dataStart,
        byteLength: dataEnd - dataStart,
      },
      index: {
        indexOffset: target.byteLength - offset0,
        absoluteOffset: target.byteLength,
      },
      dataResult,
    });
  }
  if (target.byteLength !== offset0 + indexByteLength) {
    throw new Error('index size mismatch');
  }
  target.append(dataBuf);

  return {
    indexByteLength,
    dataByteLength: dataBuf.byteLength,
  };
}

/**
 * @param {string=} msg
 * @return {never}
 */
function err(msg = 'missing value') {
  throw new Error(msg);
}
