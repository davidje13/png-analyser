import { Glyph } from './cff/glyph.mjs';

/**
 * @typedef {import('./cff/glyph.mjs').GlyphData} GlyphData
 * @typedef {import('./cff/glyph.mjs').Bounds} Bounds
 */

/** @type {Bounds} */ const ZERO_BOUNDS = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 };

export class Font {
  /**
   * @param {object} options
   * @param {string} options.name
   * @param {number=} options.majorVersion
   * @param {number=} options.minorVersion
   * @param {number=} options.em
   * @param {number=} options.weight
   * @param {number=} options.strikeoutSize
   * @param {number=} options.uniqueID
   * @param {string=} options.copyright
   * @param {string=} options.manufacturer
   * @param {string=} options.manufacturerURL
   * @param {string=} options.designer
   * @param {string=} options.designerURL
   * @param {string=} options.sampleText
   */
  constructor({
    name,
    majorVersion = 1,
    minorVersion = 0,
    em = 1000,
    weight = 400,
    strikeoutSize = 50,
    uniqueID = Math.round(Math.random() * 0x10000),
    copyright,
    manufacturer,
    manufacturerURL,
    designer,
    designerURL,
    sampleText,
  }) {
    /** @type {string} */ this.name = name;
    /** @type {number} */ this.majorVersion = majorVersion;
    /** @type {number} */ this.minorVersion = minorVersion;
    /** @type {number} */ this.em = em;
    /** @type {number} */ this.weight = weight;
    /** @type {number} */ this.strikeoutSize = strikeoutSize;
    /** @type {number} */ this.uniqueID = uniqueID;
    /** @type {string | undefined} */ this.copyright = copyright;
    /** @type {string | undefined} */ this.manufacturer = manufacturer;
    /** @type {string | undefined} */ this.manufacturerURL = manufacturerURL;
    /** @type {string | undefined} */ this.designer = designer;
    /** @type {string | undefined} */ this.designerURL = designerURL;
    /** @type {string | undefined} */ this.sampleText = sampleText;
    /** @type {Glyph[]} */ this.glyphs = [
      new Glyph(-1, '.notdef', { advanceWidth: 0, bounds: ZERO_BOUNDS, instructions: [] }),
    ];
  }

  /**
   * @param {GlyphData} data
   */
  setUnknownGlyph(data) {
    this.glyphs[0].replace(data);
  }

  /**
   * @param {number | string} char
   * @param {string} name
   * @param {GlyphData} data
   */
  addGlyph(char, name, data) {
    const glyph = new Glyph(char, name, data);
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
      bounds.xmin = Math.min(bounds.xmin, glyph.bounds.xmin);
      bounds.ymin = Math.min(bounds.ymin, glyph.bounds.ymin);
      bounds.xmax = Math.max(bounds.xmax, glyph.bounds.xmax);
      bounds.ymax = Math.max(bounds.ymax, glyph.bounds.ymax);
    }
    return bounds;
  }

  isMono() {
    const advanceWidth = this.glyphs[0].advanceWidth;
    return this.glyphs.every((g) => (g.advanceWidth === advanceWidth));
  }
}
