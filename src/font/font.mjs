import { CFFGlyph } from './cff/cff_glyph.mjs';
import { OFFGlyph } from './off/off_glyph.mjs';

/**
 * @typedef {import('./cff/cff_glyph.mjs').CFFGlyphData} CFFGlyphData
 * @typedef {import('./off/off_glyph.mjs').OFFGlyphData} OFFGlyphData
 * @typedef {import('./cff/cff_glyph.mjs').Bounds} Bounds
 *
 * TODO: abstract 'mode'
 * @typedef {{ emMaxPixels: number, mode: number }} TTRenderModeRange
 */

/** @type {Bounds} */ const ZERO_BOUNDS = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 };

export class Font {
  /**
   * @param {object} options
   * @param {string} options.name
   * @param {number=} options.majorVersion
   * @param {number=} options.minorVersion
   * @param {number=} options.em
   * @param {number=} options.lineheight
   * @param {number=} options.weight
   * @param {number=} options.strikeoutSize
   * @param {number=} options.strikeoutPosition
   * @param {number=} options.uniqueID
   * @param {string=} options.copyright
   * @param {string=} options.manufacturer
   * @param {string=} options.manufacturerURL
   * @param {string=} options.designer
   * @param {string=} options.designerURL
   * @param {string=} options.sampleText
   * @param {boolean=} options.forceInteger
   * @param {TTRenderModeRange[]=} options.ttRendering
   */
  constructor({
    name,
    majorVersion = 1,
    minorVersion = 0,
    em = 1000,
    lineheight = 1.4,
    weight = 400,
    strikeoutSize = 50,
    strikeoutPosition = (em - strikeoutSize) >> 1,
    uniqueID = Math.round(Math.random() * 0x10000),
    copyright,
    manufacturer,
    manufacturerURL,
    designer,
    designerURL,
    sampleText,
    forceInteger = false,
    ttRendering = [],
  }) {
    /** @type {string} */ this.name = name;
    /** @type {number} */ this.majorVersion = majorVersion;
    /** @type {number} */ this.minorVersion = minorVersion;
    /** @type {number} */ this.em = em;
    /** @type {number} */ this.lineheight = lineheight;
    /** @type {number} */ this.weight = weight;
    /** @type {number} */ this.strikeoutSize = strikeoutSize;
    /** @type {number} */ this.strikeoutPosition = strikeoutPosition;
    /** @type {number} */ this.uniqueID = uniqueID;
    /** @type {string | undefined} */ this.copyright = copyright;
    /** @type {string | undefined} */ this.manufacturer = manufacturer;
    /** @type {string | undefined} */ this.manufacturerURL = manufacturerURL;
    /** @type {string | undefined} */ this.designer = designer;
    /** @type {string | undefined} */ this.designerURL = designerURL;
    /** @type {string | undefined} */ this.sampleText = sampleText;
    /** @type {boolean} */ this.forceInteger = forceInteger;
    /** @type {TTRenderModeRange[]} */ this.ttRendering = ttRendering;
    /** @type {OFFGlyph[]} */ this.glyphs = [];
    this.setUnknownGlyph({
      cff: {
        advanceWidth: 0,
        bounds: ZERO_BOUNDS,
        instructions: [],
      },
    });
  }

  /**
   * @param {OFFGlyphData} offData
   */
  setUnknownGlyph(offData) {
    this.glyphs[0] = new OFFGlyph(-1, '.notdef', offData);
  }

  /**
   * @param {number | string} char
   * @param {string} name
   * @param {OFFGlyphData} offData
   */
  addGlyph(char, name, offData) {
    const glyph = new OFFGlyph(char, name, offData);
    if (this.glyphs.find((g) => (g.charCode === glyph.charCode))) {
      throw new Error(`Duplicate glyph for '${char}'`);
    }
    this.glyphs.push(glyph);
  }

  get nonEmptyGlyphs() {
    return this.glyphs.filter((g) => !g.isEmpty());
  }

  /**
   * @return {Bounds}
   */
  aggNonEmptyBounds() {
    const bounds = {
      xmin: Number.POSITIVE_INFINITY,
      ymin: Number.POSITIVE_INFINITY,
      xmax: Number.NEGATIVE_INFINITY,
      ymax: Number.NEGATIVE_INFINITY,
    };
    for (const glyph of this.nonEmptyGlyphs) {
      bounds.xmin = Math.min(bounds.xmin, glyph.cff.data.bounds.xmin);
      bounds.ymin = Math.min(bounds.ymin, glyph.cff.data.bounds.ymin);
      bounds.xmax = Math.max(bounds.xmax, glyph.cff.data.bounds.xmax);
      bounds.ymax = Math.max(bounds.ymax, glyph.cff.data.bounds.ymax);
    }
    return bounds;
  }

  isMono() {
    const advanceWidth = this.glyphs[0].cff.data.advanceWidth;
    return this.glyphs.every((g) => (g.cff.data.advanceWidth === advanceWidth));
  }
}
