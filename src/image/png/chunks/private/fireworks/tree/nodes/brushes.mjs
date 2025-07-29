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

registerNode('BPL', 'v', { // Brush Property List (?)
  read: (target, value, state) => {
    const category = getBasicValue(value, 'CAT', 's');
    const name = getBasicValue(value, 'INM', 's');
    const friendlyName = getBasicValue(value, 'UNM', 's');
    const angle = getBasicValue(value, 'BAN', 'i') ?? 0;
    const aspect = (getBasicValue(value, 'BAS', 'i') ?? 0) * 0.1;
    const diameter = getBasicValue(value, 'BDI', 'i');
    const maxCount = getBasicValue(value, 'BMM', 'i');
    const minSize = (getBasicValue(value, 'BMS', 'i') ?? 0) * 0.1;
    const softness = (getBasicValue(value, 'BSE', 'i') ?? 0) * 0.1;
    const softenModeId = getBasicValue(value, 'BSF', 'i');
    const softenMode = SOFTEN_MODES[softenModeId ?? -1];
    if (!softenMode) {
      state.warnings.push(`unknown brush soften mode (BSF): ${softenModeId}`);
    }
    const shapeId = getBasicValue(value, 'BSH', 'i');
    const shape = SHAPES[shapeId ?? -1];
    if (!shape) {
      state.warnings.push(`unknown brush shape (BSH): ${shapeId}`);
    }
    const blackness = (getBasicValue(value, 'BBK', 'i') ?? 0) * 0.1;
    const concentration = (getBasicValue(value, 'BCN', 'i') ?? 0) * 0.1;
    const effectId = getBasicValue(value, 'BEF', 'i');
    const effect = EFFECTS[effectId ?? -1];
    if (!effect) {
      state.warnings.push(`unknown brush effect (BEF): ${effectId}`);
    }
    const brushTypeId = getBasicValue(value, 'BRT', 'i');
    const brushType = BRUSH_TYPES[brushTypeId ?? -1];
    if (!brushType) {
      state.warnings.push(`unknown brush brush type (BRT): ${brushTypeId}`);
    }
    const feedbackId = getBasicValue(value, 'BFB', 'i');
    const feedback = FEEDBACK[feedbackId ?? -1];
    if (!feedback) {
      state.warnings.push(`unknown brush feedback (BFB): ${feedbackId}`);
    }
    const flowRate = (getBasicValue(value, 'BFR', 'i') ?? 0) * 0.1;
    const tipCount = getBasicValue(value, 'BNT', 'i') ?? 1;
    const spacing = (getBasicValue(value, 'BSP', 'i') ?? 0) * 0.1;
    const tipSpacing = (getBasicValue(value, 'BTS', 'i') ?? 0) * 0.1;
    const textureBlend = (getBasicValue(value, 'BTB', 'i') ?? 0) * 0.1;
    const textureEdge = (getBasicValue(value, 'BTE', 'i') ?? 0) * 0.1;
    const tipSpacingModeId = getBasicValue(value, 'BSM', 'i');
    const tipSpacingMode = SPACING_MODES[tipSpacingModeId ?? -1];
    if (!tipSpacingMode) {
      state.warnings.push(`unknown tip spacing mode (BSM): ${tipSpacingModeId}`);
    }
    const tipColouringModeId = getBasicValue(value, 'BCM', 'i');
    const tipColouringMode = COLOURING_MODES[tipColouringModeId ?? -1];
    if (!tipColouringMode) {
      state.warnings.push(`unknown tip colouring mode (BCM): ${tipColouringModeId}`);
    }

    //const RDO = getBasicValue(value, 'RDO', 'b'); // always false?
    //const BBL = getBasicValue(value, 'BBL', 'i'); // always 0?

    target.usesTexture = textureBlend > 0 || textureEdge > 0;

    let anySens = false;

    /** @type {Record<string, Record<string, number>>} */ const sensitivity = {};
    for (const source in SENSITIVITY_SOURCES) {
      /** @type {Record<string, number>} */ const effects = {};
      for (const target in SENSITIVITY_TARGETS) {
        const key = `S${SENSITIVITY_SOURCES[source]}${SENSITIVITY_TARGETS[target]}`;
        const v = (getBasicValue(value, key, 'i') ?? 0) * 0.1;
        effects[target] = v;
        anySens ||= v !== 0;
      }
      sensitivity[source] = effects;
    }

    const isAntialiased = getBasicValue(value, 'BIA', 'b');
    const dashCount = getBasicValue(value, 'NDI', 'i') ?? 0;
    const dashOn1 = getBasicValue(value, 'DO1', 'i');
    const dashOn2 = getBasicValue(value, 'DO2', 'i');
    const dashOn3 = getBasicValue(value, 'DO3', 'i');
    const dashOff1 = getBasicValue(value, 'DF1', 'i');
    const dashOff2 = getBasicValue(value, 'DF2', 'i');
    const dashOff3 = getBasicValue(value, 'DF3', 'i');

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
