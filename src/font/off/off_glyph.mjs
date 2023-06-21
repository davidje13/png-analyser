import { CFFGlyph } from '../cff/cff_glyph.mjs';

/**
 * @typedef {import('../cff/cff_glyph.mjs').CFFGlyphData} CFFGlyphData
 *
 * @typedef {{
 *   defs?: string[];
 *   parts: string[];
 * }} CharactersSVGDocument
 *
 * @typedef {{
 *   leftSideBearing?: number | undefined;
 *   cff: CFFGlyphData;
 *   svg?: { document: string | CharactersSVGDocument; id: string };
 * }} OFFGlyphData
 */

export class OFFGlyph {
  /**
   * @param {number | string} char
   * @param {string} name
   * @param {OFFGlyphData} data
   */
  constructor(char, name, { cff, ...data }) {
    /** @type {CFFGlyph} */ this.cff = new CFFGlyph(char, name, cff);
    /** @type {Omit<OFFGlyphData, 'cff'>} */ this.data = data;

    // internal value used by font formats
    /** @type {number | undefined} */ this.index;
  }

  get charCode() {
    return this.cff.charCode;
  }

  get advanceWidth() {
    return this.cff.data.advanceWidth;
  }

  get boundsWidth() {
    return this.cff.data.bounds.xmax - this.cff.data.bounds.xmin;
  }

  get leftSideBearing() {
    return this.data.leftSideBearing ?? this.cff.data.bounds.xmin;
  }

  get rightSideBearing() {
    return this.advanceWidth - this.leftSideBearing - this.boundsWidth;
  }

  isEmpty() {
    return !this.cff.data.instructions.length;
  }
}
