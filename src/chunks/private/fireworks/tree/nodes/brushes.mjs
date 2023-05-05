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

registerNode('BPL', 'v', { // Brush ???
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
    const tipCount = getBasicValue(value, 'BNT', 'i');
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

    const RDO = getBasicValue(value, 'RDO', 'b'); // always false?
    const BBL = getBasicValue(value, 'BBL', 'i'); // always 0?

    // TODO
    const sensitivity = {
      hdir: {
        angle: (getBasicValue(value, 'SHA', 'i') ?? 0) * 0.1,
        blackness: (getBasicValue(value, 'SHB', 'i') ?? 0) * 0.1,
        hue: (getBasicValue(value, 'SHH', 'i') ?? 0) * 0.1,
        lightness: (getBasicValue(value, 'SHZ', 'i') ?? 0) * 0.1,
        opacity: (getBasicValue(value, 'SHO', 'i') ?? 0) * 0.1,
        saturation: (getBasicValue(value, 'SHS', 'i') ?? 0) * 0.1,
        scatter: 0,
        size: (getBasicValue(value, 'SHR', 'i') ?? 0) * 0.1,
      },
      vdir: {
        angle: (getBasicValue(value, 'SVA', 'i') ?? 0) * 0.1,
        blackness: (getBasicValue(value, 'SVB', 'i') ?? 0) * 0.1,
        hue: (getBasicValue(value, 'SVH', 'i') ?? 0) * 0.1,
        lightness: (getBasicValue(value, 'SVZ', 'i') ?? 0) * 0.1,
        opacity: (getBasicValue(value, 'SVO', 'i') ?? 0) * 0.1,
        saturation: (getBasicValue(value, 'SVS', 'i') ?? 0) * 0.1,
        scatter: 0,
        size: (getBasicValue(value, 'SVR', 'i') ?? 0) * 0.1,
      },
      pressure: {
        angle: (getBasicValue(value, 'SPA', 'i') ?? 0) * 0.1,
        blackness: (getBasicValue(value, 'SPB', 'i') ?? 0) * 0.1,
        hue: (getBasicValue(value, 'SPH', 'i') ?? 0) * 0.1,
        lightness: (getBasicValue(value, 'SPZ', 'i') ?? 0) * 0.1,
        opacity: (getBasicValue(value, 'SPO', 'i') ?? 0) * 0.1,
        saturation: (getBasicValue(value, 'SPS', 'i') ?? 0) * 0.1,
        scatter: 0,
        size: (getBasicValue(value, 'SPR', 'i') ?? 0) * 0.1,
      },
      speed: {
        angle: (getBasicValue(value, 'SSA', 'i') ?? 0) * 0.1,
        blackness: (getBasicValue(value, 'SSB', 'i') ?? 0) * 0.1,
        hue: (getBasicValue(value, 'SSH', 'i') ?? 0) * 0.1,
        lightness: (getBasicValue(value, 'SSZ', 'i') ?? 0) * 0.1,
        opacity: (getBasicValue(value, 'SSO', 'i') ?? 0) * 0.1,
        saturation: (getBasicValue(value, 'SSS', 'i') ?? 0) * 0.1,
        scatter: 0,
        size: (getBasicValue(value, 'SSR', 'i') ?? 0) * 0.1,
      },
      random: {
        angle: (getBasicValue(value, 'SRA', 'i') ?? 0) * 0.1,
        blackness: (getBasicValue(value, 'SRB', 'i') ?? 0) * 0.1,
        hue: (getBasicValue(value, 'SRH', 'i') ?? 0) * 0.1,
        lightness: (getBasicValue(value, 'SRZ', 'i') ?? 0) * 0.1,
        opacity: (getBasicValue(value, 'SRO', 'i') ?? 0) * 0.1,
        saturation: (getBasicValue(value, 'SRS', 'i') ?? 0) * 0.1,
        scatter: 0,
        size: (getBasicValue(value, 'SRR', 'i') ?? 0) * 0.1,
      },
    };

    const isAntialiased = getBasicValue(value, 'BIA', 'b');
    const dashCount = getBasicValue(value, 'NDI', 'i') ?? 0;
    const dashOn1 = getBasicValue(value, 'DO1', 'i');
    const dashOn2 = getBasicValue(value, 'DO2', 'i');
    const dashOn3 = getBasicValue(value, 'DO3', 'i');
    const dashOff1 = getBasicValue(value, 'DF1', 'i');
    const dashOff2 = getBasicValue(value, 'DF2', 'i');
    const dashOff3 = getBasicValue(value, 'DF3', 'i');

    target.diameter = diameter ?? 1;

    target.toString = () => [
      `${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`
    ].join('');

    const dash = [dashOn1, dashOff1, dashOn2, dashOff2, dashOn3, dashOff3].slice(0, dashCount * 2);

    target.display = (summary, content) => {
      summary.append(`Brush: ${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`);
      content.append([
        `angle: ${angle}`,
        `aspect: ${aspect}%`,
        `diameter: ${diameter}`,
        `maxCount: ${maxCount}`,
        `minSize: ${minSize}`,
        `softness: ${softness}%`,
        `soften mode: ${softenMode}`,
        `shape: ${shape}`,
        `blackness: ${blackness}%`,
        `concentration: ${concentration}%`,
        `alpha remap: ${effect}`,
        `type: ${brushType}`,
        `feedback: ${feedback}`,
        `flowRate: ${flowRate}%`,
        `tipCount: ${tipCount}`,
        `spacing: ${spacing}%`,
        `textureBlend: ${textureBlend}%`,
        `textureEdge: ${textureEdge}%`,
        `tipSpacing: ${tipSpacing}%`,
        `tipSpacingMode: ${tipSpacingMode}`,
        `tipColouring: ${tipColouringMode}`,
        `antialiased: ${isAntialiased}`,
        `dash: ${dash.join(' ') || 'none'}`,
        `sensitivity: ${JSON.stringify(sensitivity)}`,
        `RDO: ${RDO}`,
        `BBL: ${BBL}`,
      ].join(', '));
    };
  },
});
