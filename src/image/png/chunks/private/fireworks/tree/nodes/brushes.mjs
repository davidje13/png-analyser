import { getBasicValue, registerNode } from '../node_registry.mjs';

const FEEDBACK = ['none', 'brush', 'background'];

const EFFECTS = [
  'none',
  'white neon',
  'harsh wet',
  'smooth neon',
  'wavy gravy',
  'white neon edge',
];

const COLOURING_MODES = [
  'random',
  'uniform',
  'complementary',
  'hue',
  'shadow',
];

const SPACING_MODES = [
  'random',
  'diagonal',
  'circular',
];

const SHAPES = [
  'square',
  'circle',
];

const SOFTEN_MODES = [
  'bell curve',
  'linear',
];

const BRUSH_TYPES = [
  'natural',
  'simple',
];

/** @type {Record<string, string>} */ const SENSITIVITY_SOURCES = {
  hdir: 'H',
  vdir: 'V',
  pressure: 'P',
  speed: 'S',
  random: 'R',
};

/** @type {Record<string, string>} */ const SENSITIVITY_TARGETS = {
  angle: 'A',
  blackness: 'B',
  hue: 'H',
  lightness: 'L',
  opacity: 'O', // "ink amount" in UI
  saturation: 'S',
  scatter: 'R',
  size: 'Z',
};

registerNode('BPLv', { // Brush Property List (?)
  read: (target, value, state) => {
    const category = getBasicValue(value, 'CATs');
    const name = getBasicValue(value, 'INMs');
    const friendlyName = getBasicValue(value, 'UNMs');
    const angle = getBasicValue(value, 'BANi') ?? 0;
    const aspect = (getBasicValue(value, 'BASi') ?? 0) * 0.1;
    const diameter = getBasicValue(value, 'BDIi');
    const maxCount = getBasicValue(value, 'BMMi');
    const minSize = (getBasicValue(value, 'BMSi') ?? 0) * 0.1;
    const softness = (getBasicValue(value, 'BSEi') ?? 0) * 0.1;
    const softenModeId = getBasicValue(value, 'BSFi');
    const softenMode = SOFTEN_MODES[softenModeId ?? -1];
    if (!softenMode) {
      state.warnings.push(`unknown brush soften mode (BSF): ${softenModeId}`);
    }
    const shapeId = getBasicValue(value, 'BSHi');
    const shape = SHAPES[shapeId ?? -1];
    if (!shape) {
      state.warnings.push(`unknown brush shape (BSH): ${shapeId}`);
    }
    const blackness = (getBasicValue(value, 'BBKi') ?? 0) * 0.1;
    const concentration = (getBasicValue(value, 'BCNi') ?? 0) * 0.1;
    const effectId = getBasicValue(value, 'BEFi');
    const effect = EFFECTS[effectId ?? -1];
    if (!effect) {
      state.warnings.push(`unknown brush effect (BEF): ${effectId}`);
    }
    const brushTypeId = getBasicValue(value, 'BRTi');
    const brushType = BRUSH_TYPES[brushTypeId ?? -1];
    if (!brushType) {
      state.warnings.push(`unknown brush brush type (BRT): ${brushTypeId}`);
    }
    const feedbackId = getBasicValue(value, 'BFBi');
    const feedback = FEEDBACK[feedbackId ?? -1];
    if (!feedback) {
      state.warnings.push(`unknown brush feedback (BFB): ${feedbackId}`);
    }
    const flowRate = (getBasicValue(value, 'BFRi') ?? 0) * 0.1;
    const tipCount = getBasicValue(value, 'BNTi') ?? 1;
    const spacing = (getBasicValue(value, 'BSPi') ?? 0) * 0.1;
    const tipSpacing = getBasicValue(value, 'BTSi') ?? 0;
    const textureBlend = (getBasicValue(value, 'BTBi') ?? 0) * 0.1;
    const textureEdge = (getBasicValue(value, 'BTEi') ?? 0) * 0.1;
    const tipSpacingModeId = getBasicValue(value, 'BSMi');
    const tipSpacingMode = SPACING_MODES[tipSpacingModeId ?? -1];
    if (!tipSpacingMode) {
      state.warnings.push(`unknown tip spacing mode (BSM): ${tipSpacingModeId}`);
    }
    const tipColouringModeId = getBasicValue(value, 'BCMi');
    const tipColouringMode = COLOURING_MODES[tipColouringModeId ?? -1];
    if (!tipColouringMode) {
      state.warnings.push(`unknown tip colouring mode (BCM): ${tipColouringModeId}`);
    }

    //const RDO = getBasicValue(value, 'RDOb'); // always false?
    //const BBL = getBasicValue(value, 'BBLi'); // always 0?

    target.usesTexture = textureBlend > 0 || textureEdge > 0;

    let anySens = false;

    /** @type {Record<string, Record<string, number>>} */ const sensitivity = {};
    for (const source in SENSITIVITY_SOURCES) {
      /** @type {Record<string, number>} */ const effects = {};
      for (const target in SENSITIVITY_TARGETS) {
        const v = (getBasicValue(value, `S${SENSITIVITY_SOURCES[source]}${SENSITIVITY_TARGETS[target]}i`) ?? 0) * 0.1;
        effects[target] = v;
        anySens ||= v !== 0;
      }
      sensitivity[source] = effects;
    }

    const isAntialiased = getBasicValue(value, 'BIAb');
    const dashCount = getBasicValue(value, 'NDIi') ?? 0;
    const dashOn1 = getBasicValue(value, 'DO1i');
    const dashOn2 = getBasicValue(value, 'DO2i');
    const dashOn3 = getBasicValue(value, 'DO3i');
    const dashOff1 = getBasicValue(value, 'DF1i');
    const dashOff2 = getBasicValue(value, 'DF2i');
    const dashOff3 = getBasicValue(value, 'DF3i');

    target.diameter = diameter ?? 1;
    target.storage.diameter = diameter ?? 1;

    const details = [
      `shape: ${shape}`,
      `diameter: ${diameter}`,
      `antialiased: ${isAntialiased}`,
      `maxCount: ${maxCount}`,
      `minSize: ${minSize}`,
      `softness: ${softness}%`,
      `soften mode: ${softenMode}`,
      `blackness: ${blackness}%`,
      `concentration: ${concentration}%`,
      `alpha remap: ${effect}`,
      `type: ${brushType}`,
      `feedback: ${feedback}`,
      `flowRate: ${flowRate}%`,
      `spacing: ${spacing}%`,
    ];
    if (shape !== 'circle' || aspect !== 100 || anySens) {
      details.push(
        `angle: ${angle}`,
        `aspect: ${aspect}%`,
      );
    }
    if (textureBlend > 0 || textureEdge > 0) {
      details.push(
        `textureBlend: ${textureBlend}%`,
        `textureEdge: ${textureEdge}%`,
      );
    }
    if (tipCount > 1) {
      details.push(
        `tipCount: ${tipCount}`,
        `tipSpacing: ${tipSpacing}%`,
        `tipSpacingMode: ${tipSpacingMode}`,
        `tipColouring: ${tipColouringMode}`,
      );
    }
    if (dashCount > 0) {
      const dash = [dashOn1, dashOff1, dashOn2, dashOff2, dashOn3, dashOff3].slice(0, dashCount * 2);
      details.push(`dash: ${dash.join(' ') || 'none'}`);
    }

    target.toString = () => [
      `${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`,
      ...details,
      anySens ? makeSensitivityTable(sensitivity).map((r) => r.join(' ')).join('\n') : '',
    ].join('\n');

    target.display = (summary, content) => {
      summary.append(`Brush: ${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`);
      content.append(details.join(', '));
      if (anySens) {
        content.append('\n' + makeSensitivityTable(sensitivity).map((r) => r.join(' ')).join('\n'));
      }
    };
  },
});

/**
 * @param {Record<string, Record<string, number>>} sensitivity
 * @return {string[][]}
 */
function makeSensitivityTable(sensitivity) {
  const headers = [''.padEnd(10, ' ')];
  for (const source in SENSITIVITY_SOURCES) {
    headers.push(source.padStart(8, ' '));
  }
  const sensTable = [headers];
  for (const target in SENSITIVITY_TARGETS) {
    const row = [target.padEnd(10, ' ')];
    for (const source in SENSITIVITY_SOURCES) {
      const v = sensitivity[source][target];
      row.push((v ? v.toFixed(1) : '-').padStart(8, ' '));
    }
    sensTable.push(row);
  }
  return sensTable;
};
