import { asColourDiv } from '../../../../../../../display/pretty.mjs';
import { getBasicValue, registerNode } from '../node_registry.mjs';

registerNode('URLv', { // Link (e.g. image slice or hotspot)
  read: (target, value, state) => {
    const foregroundCol = getBasicValue(value, 'FCLi');
    const left = getBasicValue(value, 'LFTf') ?? 0;
    const top = getBasicValue(value, 'TOPf') ?? 0;
    const right = getBasicValue(value, 'RITf') ?? 0;
    const bottom = getBasicValue(value, 'BOTf') ?? 0;
    const locked = getBasicValue(value, 'LCKb') ?? false;
    const name = getBasicValue(value, 'FILs') ?? null; // only used by slice
    const text = getBasicValue(value, 'TDTs') ?? null; // only used by slice
    const objectName = getBasicValue(value, 'OBNs') ?? null; // only used by hotspot
    const link = getBasicValue(value, 'INMs') ?? null;
    const alt = getBasicValue(value, 'A2Ts') ?? null;
    const linkTarget = getBasicValue(value, 'ALTs') ?? null;
    const shapeType = getBasicValue(value, 'URSi') ?? 0;
    const typeOfSlice = getBasicValue(value, 'TSLi') ?? 0;
    const repeat = getBasicValue(value, 'CBRi') ?? 0;
    const ext = {
      MSN: getBasicValue(value, 'MSNi') ?? 0, // possibly a unique tag / hash
      CBT: getBasicValue(value, 'CBTb') ?? null, // appears to be true for background slices (typeOfSlice == 2), or maybe for 9-slice groups?
      CBA: getBasicValue(value, 'CBAi') ?? null, // possibly: 0 = fixed, 1 = scroll ?
      CBH: getBasicValue(value, 'CBHi') ?? null, // something about horizontal scrolling. 0/1/2 = left/centre/right, 3 = use CHV
      CHV: getBasicValue(value, 'CHVi') ?? null, // relevant if CBH is 3, else always set to 0xFFFFFFFF
      CBV: getBasicValue(value, 'CBVi') ?? null, // something about vertical scrolling. 0/1/2 = top/centre/bottom, 3 = use CVV
      CVV: getBasicValue(value, 'CVVi') ?? null, // relevant if CBV is 3, else always set to 0xFFFFFFFF
    };
    // also can contain EXPv to set custom export options for slice
    // and PBPv (bezier path) if shape type is 2 (polygon)

    const shapeName = SHAPES.get(shapeType) ?? `unknown shape (${shapeType})`;
    const typeName = TYPES.get(typeOfSlice) ?? `unknown type (${typeOfSlice})`;
    const repeatName = REPEATS.get(repeat) ?? `unknown repeat (${repeat})`;

    target.toString = () => [
      `Slice ${JSON.stringify(objectName)}/${JSON.stringify(name)} ${typeName} ${shapeName} (${left}, ${top}) - (${right}, ${bottom}) ${repeatName}${locked ? ' locked' : ''}:`,
      link !== null ? `link to: ${JSON.stringify(link)} in ${JSON.stringify(linkTarget)}, alt: ${JSON.stringify(alt)}` : '',
      `cell text: ${JSON.stringify(text)}`,
      JSON.stringify(ext),
    ].join('\n');

    target.display = (summary) => {
      const det = document.createElement('details');
      det.setAttribute('open', 'open');
      const sum = document.createElement('summary');
      summary.append(det);
      det.append(sum);

      sum.append(`Slice ${JSON.stringify(objectName)}/${JSON.stringify(name)}`);
      if (locked) {
        det.append('locked\n')
      }
      det.append(`${typeName} ${shapeName} (${left}, ${top}) - (${right}, ${bottom})\n`);
      if (link !== null) {
        det.append(`link to: ${JSON.stringify(link)} in ${JSON.stringify(linkTarget)}, alt: ${JSON.stringify(alt)}\n`);
      }
      det.append(`cell text: ${JSON.stringify(text)}\n`);
      det.append(JSON.stringify(ext) + '\n');
      if (foregroundCol !== undefined) {
        det.append('editor colour: ', asColourDiv(foregroundCol, true), '\n');
      }
    };

    target.toSVG = (parts) => {
      /** @type {SVGElement|null} */ let element = null;
      switch (shapeType) {
        case 0: // rect
          element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          element.setAttribute('x', String(left));
          element.setAttribute('y', String(top));
          element.setAttribute('width', String(right - left));
          element.setAttribute('height', String(bottom - top));
          break;
        case 1: // ellipse
          element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
          element.setAttribute('cx', String((left + right) / 2));
          element.setAttribute('cy', String((top + bottom) / 2));
          element.setAttribute('rx', String((right - left) / 2));
          element.setAttribute('ry', String((bottom - top) / 2));
          break;
        case 2: // polygon
          // handled by PBPv
          break;
      }

      if (element) {
        element.setAttribute('fill', 'transparent');
        element.setAttribute('stroke', colToSVG(foregroundCol) ?? 'black');
        element.setAttribute('stroke-width', '1');
        element.setAttribute('vector-effect', 'non-scaling-stroke');
        element.setAttribute('stroke-linecap', 'round');
        element.setAttribute('stroke-linejoin', 'round');
        parts.push({ element, bounds: { minX: left, minY: top, maxX: right, maxY: bottom } });
      }

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String((left + right) / 2));
      text.setAttribute('y', String(bottom - 3));
      text.setAttribute('textLength', String(right - left));
      text.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      text.setAttribute('font-size', '10px');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', colToSVG(foregroundCol) ?? 'black');
      text.append(objectName ?? name ?? '');
      parts.push({ element: text, bounds: { minX: left, minY: top, maxX: right, maxY: bottom } });
    };
    if (shapeType === 2) {
      target.toSVG = undefined; // TODO: better to handle this ourselves to get correct styling, but the current DOM abstraction here for Fireworks PNG info isn't navigable enough
    }
  },
});

const SHAPES = new Map([[0, 'rectangle'], [1, 'ellipse'], [2, 'polygon']]);
const TYPES = new Map([[0, 'foreground'], [2, 'background']]);
const REPEATS = new Map([[0, 'no-repeat'], [1, 'repeat-both'], [2, 'repeat-x'], [3, 'repeat-y']]);

/**
 * @param {number | null | undefined} value
 * @return {string | null}
 */
function colToSVG(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const r = value & 0xFF;
  const g = (value >>> 8) & 0xFF;
  const b = (value >>> 16) & 0xFF;
  const a = (value >>> 24) & 0xFF;
  if (!a) {
    return 'transparent';
  }
  if (a === 255) {
    return '#' + ((b << 16) | (g << 8) | r).toString(16).padStart(6, '0');
  }
  return `rgba(${r},${g},${b},${a})`;
}
