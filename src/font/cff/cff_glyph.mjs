/**
 * @typedef {{
 *   xmin: number;
 *   ymin: number;
 *   xmax: number;
 *   ymax: number;
 * }} Bounds
 *
 * @typedef {(
 *   | 'hstem'
 *   | 'vstem'
 *   | 'vmoveto'
 *   | 'rlineto'
 *   | 'hlineto'
 *   | 'vlineto'
 *   | 'rrcurveto'
 *   | 'callsubr'
 *   | 'return'
 *   | 'vsindex'
 *   | 'blend'
 *   | 'hstemhm'
 *   | 'hintmask'
 *   | 'cntrmask'
 *   | 'rmoveto'
 *   | 'hmoveto'
 *   | 'vstemhm'
 *   | 'rcurveline'
 *   | 'rlinecurve'
 *   | 'vvcurveto'
 *   | 'hhcurveto'
 *   | 'callgsubr'
 *   | 'vhcurveto'
 *   | 'hvcurveto'
 *   | 'and'
 *   | 'or'
 *   | 'not'
 *   | 'abs'
 *   | 'add'
 *   | 'sub'
 *   | 'div'
 *   | 'neg'
 *   | 'eq'
 *   | 'drop'
 *   | 'put'
 *   | 'get'
 *   | 'ifelse'
 *   | 'random'
 *   | 'mul'
 *   | 'sqrt'
 *   | 'dup'
 *   | 'exch'
 *   | 'index'
 *   | 'roll'
 *   | 'hflex'
 *   | 'flex'
 *   | 'hflex1'
 *   | 'flex1'
 * )} CFFOpName
 *
 * @typedef {{
 *   id: number;
 *   esc: boolean;
 *   cff1?: boolean;
 *   cff2?: boolean;
 * }} CFFOp
 *
 * @typedef {[CFFOpName, ...number[]]} Instruction
 *
 * @typedef {{
 *   advanceWidth: number;
 *   bounds: Bounds;
 *   renderBounds?: boolean;
 *   instructions: Instruction[];
 * }} CFFGlyphData
 */

export class CFFGlyph {
  /**
   * @param {number | string} char
   * @param {string} name
   * @param {CFFGlyphData} data
   */
  constructor(char, name, data) {
    /** @type {number} */ this.charCode = (typeof char === 'number' ? char : char.charCodeAt(0));
    /** @type {string} */ this.name = name;

    /** @type {CFFGlyphData} */ this.data = data;
  }
}

// https://wwwimages2.adobe.com/content/dam/acom/en/devnet/font/pdfs/5177.Type2.pdf
/** @type {Map<CFFOpName, CFFOp>} */ const CFF_OPS = new Map();
CFF_OPS.set('hstem', { id: 0x01, esc: false });
CFF_OPS.set('vstem', { id: 0x03, esc: false });
CFF_OPS.set('vmoveto', { id: 0x04, esc: false });
CFF_OPS.set('rlineto', { id: 0x05, esc: false });
CFF_OPS.set('hlineto', { id: 0x06, esc: false });
CFF_OPS.set('vlineto', { id: 0x07, esc: false });
CFF_OPS.set('rrcurveto', { id: 0x08, esc: false });
CFF_OPS.set('callsubr', { id: 0x0A, esc: false });
CFF_OPS.set('return', { id: 0x0B, esc: false, cff2: false });
//CFF_OPS.set('endchar', { id: 0x0E, esc: false, cff2: false });
CFF_OPS.set('vsindex', { id: 0x0F, esc: false });
CFF_OPS.set('blend', { id: 0x10, esc: false, cff1: false });
CFF_OPS.set('hstemhm', { id: 0x12, esc: false });
CFF_OPS.set('hintmask', { id: 0x13, esc: false });
CFF_OPS.set('cntrmask', { id: 0x14, esc: false });
CFF_OPS.set('rmoveto', { id: 0x15, esc: false });
CFF_OPS.set('hmoveto', { id: 0x16, esc: false });
CFF_OPS.set('vstemhm', { id: 0x17, esc: false });
CFF_OPS.set('rcurveline', { id: 0x18, esc: false });
CFF_OPS.set('rlinecurve', { id: 0x19, esc: false });
CFF_OPS.set('vvcurveto', { id: 0x1A, esc: false });
CFF_OPS.set('hhcurveto', { id: 0x1B, esc: false });
CFF_OPS.set('callgsubr', { id: 0x1D, esc: false });
CFF_OPS.set('vhcurveto', { id: 0x1E, esc: false });
CFF_OPS.set('hvcurveto', { id: 0x1F, esc: false });
CFF_OPS.set('and', { id: 0x03, esc: true, cff2: false });
CFF_OPS.set('or', { id: 0x04, esc: true, cff2: false });
CFF_OPS.set('not', { id: 0x05, esc: true, cff2: false });
CFF_OPS.set('abs', { id: 0x09, esc: true, cff2: false });
CFF_OPS.set('add', { id: 0x0A, esc: true, cff2: false });
CFF_OPS.set('sub', { id: 0x0B, esc: true, cff2: false });
CFF_OPS.set('div', { id: 0x0C, esc: true, cff2: false });
CFF_OPS.set('neg', { id: 0x0E, esc: true, cff2: false });
CFF_OPS.set('eq', { id: 0x0F, esc: true, cff2: false });
CFF_OPS.set('drop', { id: 0x12, esc: true, cff2: false });
CFF_OPS.set('put', { id: 0x14, esc: true, cff2: false });
CFF_OPS.set('get', { id: 0x15, esc: true, cff2: false });
CFF_OPS.set('ifelse', { id: 0x16, esc: true, cff2: false });
CFF_OPS.set('random', { id: 0x17, esc: true, cff2: false });
CFF_OPS.set('mul', { id: 0x18, esc: true, cff2: false });
CFF_OPS.set('sqrt', { id: 0x1A, esc: true, cff2: false });
CFF_OPS.set('dup', { id: 0x1B, esc: true, cff2: false });
CFF_OPS.set('exch', { id: 0x1C, esc: true, cff2: false });
CFF_OPS.set('index', { id: 0x1D, esc: true, cff2: false });
CFF_OPS.set('roll', { id: 0x1E, esc: true, cff2: false });
CFF_OPS.set('hflex', { id: 0x22, esc: true });
CFF_OPS.set('flex', { id: 0x23, esc: true });
CFF_OPS.set('hflex1', { id: 0x24, esc: true });
CFF_OPS.set('flex1', { id: 0x25, esc: true });

/**
 * @param {CFFOpName} name
 */
export function getCFFOp(name) {
  return CFF_OPS.get(name);
}
