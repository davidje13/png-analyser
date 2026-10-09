import { asGradientDiv, rgba } from '../../../../../../../display/pretty.mjs';
import { getBasicValue, getBasicValues, getChild, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

registerNode('FGLv', { // Fill Gradient ???
  read: (target, value, state) => {
    const category = getBasicValue(value, 'CATs');
    const name = getBasicValue(value, 'INMs');
    const grad = getChild(value, 'FGVv');
    const grad2 = getChild(value, 'FGYv');

    Object.assign(target, outputNodes(
      `Gradient ${JSON.stringify(category)} / ${JSON.stringify(name)}`,
      [grad2 ?? grad],
    ));
  },
});

registerNode('FGVv', { // Fill Gradient ???
  read: (target, value, state) => {
    const stops = extractGradient(value, state.warnings);

    target.toString = () => `FGV ${stops.length}-stop FGV gradient`;

    target.display = (summary, content) => {
      summary.append(`FGV ${stops.length}-stop FGV gradient`);
      content.append(asGradientDiv(stops));
    };
  },
});

registerNode('FG0v', { // Fill Gradient 0 (RGB)
  read: (target, value, state) => {
    const stops = extractGradient(value, state.warnings);

    target.toString = () => `${stops.length}-stop FG0 (RGB) gradient`;
    for (const stop of stops) {
      if (stop.colour >>> 24 !== 0xFF) {
        state.warnings.push('Non-pure RGB gradient');
      }
    }
    target.stops = stops;

    target.display = (summary, content) => {
      summary.append(`${stops.length}-stop FG0 (RGB) gradient`);
      content.append(asGradientDiv(stops));
    };
  },
});

registerNode('FG1v', { // Fill Gradient 1 (Alpha)
  read: (target, value, state) => {
    const stops = extractGradient(value, state.warnings);
    for (const stop of stops) {
      if (stop.colour & 0xFFFFFF) {
        state.warnings.push('Non-pure alpha gradient');
      }
    }
    target.stops = stops;

    target.toString = () => `${stops.length}-stop FG1 (alpha) gradient`;

    target.display = (summary, content) => {
      summary.append(`${stops.length}-stop FG1 (alpha) gradient`);
      content.append(asGradientDiv(stops, true));
    };
  },
});

registerNode('FGYv', { // Fill Gradient ??? (RGB + Alpha gradient)
  read: (target, value, state) => {
    const rgb = /** @type {Gradient | undefined} */ (getChild(value, 'FG0v')?.stops);
    const alpha = /** @type {Gradient | undefined} */ (getChild(value, 'FG1v')?.stops);
    if (!rgb) {
      state.warnings.push('Missing FG0v for FGYv');
      return;
    }
    if (!alpha) {
      state.warnings.push('Missing FG1v for FGYv');
      return;
    }
    const stops = combineGrad(rgb, alpha);

    target.toString = () => `${stops.length}-stop FGY (RGB + alpha) gradient`;

    target.display = (summary, content) => {
      summary.append(`${stops.length}-stop FGY (RGB + alpha) gradient`);
      content.append(asGradientDiv(stops));
    };
  },
});

const STAMPING_MODES = [
  null,
  'transparent', // "blend"
  'white', // "blend opaque"
];

const SHAPES = [
  'solid',
  null,
  'linear',
  'radial', // also contour grad ?
  'conical',
  'satin',
  null,
  'pinch',
  'folds',
  'elliptical',
  'rectangular',
  null,
  'bars',
  'ripple',
  'waves',
  'pattern',
  'web dither',
  'contour grad',
];

registerNode('FPLv', { // Fill Pattern (?) ??
  read: (target, value, state) => {
    const category = getBasicValue(value, 'CATs');
    const name = getBasicValue(value, 'INMs');
    const friendlyName = getBasicValue(value, 'UNMs');
    const textureBlend = (getBasicValue(value, 'FTBi') ?? 0) * 0.1;
    const feather = getBasicValue(value, 'FEFi') ?? 0;
    const stampingModeId = getBasicValue(value, 'FSMi');
    const stampingMode = STAMPING_MODES[stampingModeId ?? -1];
    if (!stampingMode) {
      state.warnings.push(`unknown fill stamping mode (FSM): ${stampingModeId}`);
    }
    const hardEdge = getBasicValue(value, 'FRDb');
    const fallbackShapeId = getBasicValue(value, 'FSHi');
    const shapeId = getBasicValue(value, 'FSXi') ?? fallbackShapeId;
    const shape = SHAPES[shapeId ?? -1];
    if (!shape) {
      state.warnings.push(`unknown fill shape (FSH): ${shapeId}`);
    }

    // only used by web dither
    const ditherCols = [
      getBasicValue(value, 'FD1i') ?? 0,
      getBasicValue(value, 'FD2i') ?? 0,
      getBasicValue(value, 'FD3i') ?? 0,
      getBasicValue(value, 'FD4i') ?? 0,
    ];
    const ditherTrans = getBasicValue(value, 'FDTb');

    target.usesTexture = textureBlend > 0;

    const details = [
      `shape: ${shape}`,
      `stampingMode: ${stampingMode}`,
      `edge: ${hardEdge ? 'hard' : 'anti-aliased'}`,
    ];
    if (feather > 0 && !hardEdge) {
      details.push(`feather: ${feather}px`);
    }
    if (textureBlend) {
      details.push(`texture opacity: ${textureBlend}%`);
    }
    if (shape === 'web dither') {
      details.push(`dither: ${ditherCols.map((c) => rgba(c)).join(' & ')}${ditherTrans ? ' [transparent]' : ''}`);
    }

    //const RDO = getBasicValue(value, 'RDOb'); // always false?
    //const FET = getBasicValue(value, 'FETi'); // always 1?
    //const FRR = getBasicValue(value, 'FRRi'); // always 0?

    target.toString = () => [
      `${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`,
      ...details,
    ].join('\n');

    target.display = (summary, content) => {
      summary.append(`Fill: ${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`);
      content.append(details.join(', '));
    };
    target.storage.category = category;
  },
});

/**
 * @typedef {import('../../../../../../../display/pretty.mjs').Gradient} Gradient
 */

/**
 * @param {import('../node_registry.mjs').ProcessedNode[]} nodes
 * @param {string[]} warnings
 * @return {Gradient}
 */
function extractGradient(nodes, warnings) {
  const count = getBasicValue(nodes, 'FNCi') ?? 0;
  const stops = getBasicValues(nodes, 'FGIv');
  if (stops.length !== count) {
    warnings.push(`Expected ${count} colour stops but got ${stops.length}`);
  }
  return stops.map((stop) => ({
    position: getBasicValue(stop, 'FGPf') ?? 0,
    colour: getBasicValue(stop, 'FGCi') ?? 0,
  }));
}

/**
 * @param {Gradient} m
 * @param {number} p
 * @return {number}
 */
function gradientAt(m, p) {
  if (!m.length) {
    return 0;
  }
  for (let i = 0; i < m.length; ++i) {
    if (m[i].position >= p) {
      if (i === 0) {
        return m[0].colour;
      }
      const prev = m[i - 1];
      const next = m[i];
      const frac = (p - prev.position) / (next.position - prev.position);
      return mixColour(prev.colour, next.colour, frac);
    }
  }
  return m[m.length - 1].colour;
}

/**
 * @param {Gradient} rgb
 * @param {Gradient} alpha
 * @return {Gradient}
 */
function combineGrad(rgb, alpha) {
  return [...new Set([...rgb, ...alpha].map((v) => v.position))]
    .sort((a, b) => a - b)
    .map((position) => ({
      position,
      colour: (
        (gradientAt(alpha, position) & 0xFF000000) |
        (gradientAt(rgb, position) & 0x00FFFFFF)
      ) >>> 0,
    }));
}

/**
 * @param {number} c1
 * @param {number} c2
 * @param {number} f
 * @return {number}
 */
const mixColour = (c1, c2, f) => {
  const a1 = c1 >>> 24;
  const r1 = (c1 >>> 16) & 0xFF;
  const g1 = (c1 >>> 8) & 0xFF;
  const b1 = c1 & 0xFF;

  const a2 = c2 >>> 24;
  const r2 = (c2 >>> 16) & 0xFF;
  const g2 = (c2 >>> 8) & 0xFF;
  const b2 = c2 & 0xFF;

  const a = Math.round((1 - f) * a1 + f * a2);
  const r = Math.round((1 - f) * r1 + f * r2);
  const g = Math.round((1 - f) * g1 + f * g2);
  const b = Math.round((1 - f) * b1 + f * b2);
  return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
};
