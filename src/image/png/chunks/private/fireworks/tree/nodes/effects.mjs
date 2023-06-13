import { rgba } from '../../../../../../../display/pretty.mjs';
import { registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';
import { getEntityValue } from './values.mjs';

/**
 * @typedef {import('../node_registry.mjs').ProcessedNode} ProcessedNode
 * @typedef {import('../node_registry.mjs').NodeState} NodeState
 *
 * @typedef {{
 *   name: string,
 *   read: (
 *     target: ProcessedNode,
 *     value: ProcessedNode[],
 *     state: NodeState,
 *   ) => (element: HTMLElement) => void,
 * }} EffectMeta
 */

/** @type {Map<string, EffectMeta>} */ const KNOWN_EFFECTS = new Map();

registerNode('EPS', 'v', { // Effect ???
  read: (target, value, state) => {
    const visible = getEntityValue(value, 'EffectIsVisible') === 'true';
    const tempUIName = getEntityValue(value, 'mkbFile_WriteOnly_TemporaryEffectUiName');
    const moaID = getEntityValue(value, 'EffectMoaID') ?? '';
    const previewTileSize = getEntityValue(value, 'MB_filter_preview_tile_size') ?? '-1 -1';

    const out = outputNodes(target.name, value);
    const meta = KNOWN_EFFECTS.get(moaID);
    if (!meta) {
      state.warnings.push(`Unknown effect Moa ID: ${moaID}`);
      Object.assign(target, out);
    } else {
      const display = meta.read(target, value, state);
      target.toString = out.toString;
      target.display = (summary, content) => {
        out.display(summary, content);
        summary.append(`${tempUIName ?? '?'} ${visible ? '[visible]' : '[hidden]'}`);
        const preview = document.createElement('div');
        preview.classList.add('effect-preview');
        display(preview);
        content.append(preview);
      };
    }
  },
});

const BEVEL_TYPES = new Map([
  ['0', { name: 'Inner Bevel' }],
  ['1', { name: 'Outer Bevel' }],
  ['2', { name: 'Raise Emboss' }],
  ['3', { name: 'Inset Emboss' }],
  ['4', { name: 'Glow Effect' }],
]);
const BEVEL_SLOPE_TYPES = new Map([
  ['0', { name: 'flat', fn: (/** @type {number} */ v) => v }],
  ['1', { name: 'smooth', fn: (/** @type {number} */ v) => v }], // TODO: equation
  ['2', { name: 'smooth inverted', fn: (/** @type {number} */ v) => v }], // TODO: equation
  ['3', { name: 'zigzag', fn: (/** @type {number} */ v) => v }], // TODO: equation
  ['4', { name: 'zigzag 2', fn: (/** @type {number} */ v) => v }], // TODO: equation
  ['5', { name: 'ring', fn: (/** @type {number} */ v) => Math.sin(v * Math.PI) }], // TODO: check eq
  ['6', { name: 'ruffle', fn: (/** @type {number} */ v) => v }], // TODO: equation
]);
const BUTTON_STATES = new Map([
  ['0', 'Up'],
  ['1', 'Over'],
  ['2', 'Down'],
  ['3', 'Hit'],
]);

KNOWN_EFFECTS.set('{7fe61102-6ce2-11d1-8c76000502701850}', {
  name: 'Bevel',
  read: (target, value, state) => {
    const typeId = getEntityValue(value, 'BevelType') ?? '';
    const type = BEVEL_TYPES.get(typeId);
    if (!type) {
      state.warnings.push(`Unknown bevel type: ${typeId}`);
    }
    const width = Number.parseFloat(getEntityValue(value, 'BevelWidth') ?? '0');
    const contrast = Number.parseFloat(getEntityValue(value, 'BevelContrast') ?? '0');
    const threshold = Number.parseFloat(getEntityValue(value, 'EdgeThreshold') ?? '0');
    const angleSoftness = Number.parseFloat(getEntityValue(value, 'AngleSoftness') ?? '0');
    const maskSoftness = Number.parseFloat(getEntityValue(value, 'MaskSoftness') ?? '0');
    const lightDistance = Number.parseFloat(getEntityValue(value, 'LightDistance') ?? '0');
    const lightAngle = Number.parseFloat(getEntityValue(value, 'LightAngle') ?? '0');
    const slopeTypeId = getEntityValue(value, 'SlopeType') ?? '';
    const slope = BEVEL_SLOPE_TYPES.get(slopeTypeId);
    if (!slope) {
      state.warnings.push(`Unknown bevel slope type: ${slopeTypeId}`);
    }
    const slopeMultiplier = Number.parseFloat(getEntityValue(value, 'SlopeMultiplier') ?? '0');
    const outerBevelCol = parseCol(getEntityValue(value, 'OuterBevelColor'));
    const downBlendCol = parseCol(getEntityValue(value, 'DownBlendColor'));
    const hitBlendCol = parseCol(getEntityValue(value, 'HitBlendColor'));
    const highlightCol = parseCol(getEntityValue(value, 'HiliteColor'));
    const shadowCol = parseCol(getEntityValue(value, 'ShadowColor'));
    const embossFaceCol = parseCol(getEntityValue(value, 'EmbossFaceColor'));
    const showObject = getEntityValue(value, 'ShowObject') === 'true';
    const buttonStateId = getEntityValue(value, 'ButtonState');
    const buttonState = BUTTON_STATES.get(buttonStateId ?? '');
    const glowStartDist = Number.parseFloat(getEntityValue(value, 'GlowStartDistance') ?? '0');
    const glowWidth = Number.parseFloat(getEntityValue(value, 'GlowWidth') ?? '0');

    return (element) => {
      // TODO
    };
  },
});

KNOWN_EFFECTS.set('{a7944db8-6ce2-11d1-8c76000502701850}', {
  name: 'Drop Shadow',
  read: (target, value, state) => {
    const knockout = getEntityValue(value, 'ShadowType') === '1';
    const blur = Number.parseFloat(getEntityValue(value, 'ShadowBlur') ?? '0');
    const dist = Number.parseFloat(getEntityValue(value, 'ShadowDistance') ?? '0');
    const angle = Number.parseFloat(getEntityValue(value, 'ShadowAngle') ?? '0');
    const col = parseCol(getEntityValue(value, 'ShadowColor'));

    // round to match fireworks behaviour
    const x = Math.round(Math.cos(angle * Math.PI / 180) * dist);
    const y = Math.round(-Math.sin(angle * Math.PI / 180) * dist);

    // TODO: is blur scaled?

    return (element) => {
      element.style.filter = `drop-shadow(${x}px ${y}px ${blur}px ${rgba(col ?? 0)})`;
    };
  },
});

KNOWN_EFFECTS.set('{5600f702-774c-11d3-baad0000861f4d01}', {
  name: 'Inner Shadow',
  read: (target, value, state) => {
    const type = getEntityValue(value, 'ShadowType'); // always 0?
    const blur = Number.parseFloat(getEntityValue(value, 'ShadowBlur') ?? '0');
    const dist = Number.parseFloat(getEntityValue(value, 'ShadowDistance') ?? '0');
    const angle = Number.parseFloat(getEntityValue(value, 'ShadowAngle') ?? '0');
    const col = parseCol(getEntityValue(value, 'ShadowColor'));

    return (element) => {
      // TODO: css filter does not support inset shadows
    };
  },
});

KNOWN_EFFECTS.set('{b90c950e-64df-11d8-aaf2000a9582f7d4}', {
  name: 'Solid Shadow',
  read: (target, value, state) => {
    const dist = Number.parseFloat(getEntityValue(value, 'distance') ?? '0');
    const angle = Number.parseFloat(getEntityValue(value, 'angle') ?? '0');
    const col = parseCol(getEntityValue(value, 'color'));

    const dx = Math.cos(angle * Math.PI / 180);
    const dy = -Math.sin(angle * Math.PI / 180);

    return (element) => {
      const step = 1 / Math.max(Math.abs(dx), Math.abs(dy));
      /** @type {string[]} */ const f = [];
      const c = rgba(col ?? 0);
      for (let d = dist / 2; d >= step; d *= 0.5) {
        f.push(`drop-shadow(${dx * d}px ${dy * d}px ${c})`);
      }
      element.style.filter = f.join(' ');
    };
  },
});

KNOWN_EFFECTS.set('{2ba87123-8220-11d3-baad0000861f4d01}', {
  name: 'Inner Glow',
  read: (target, value, state) => {
    const contrast = Number.parseFloat(getEntityValue(value, 'BevelContrast') ?? '0');
    const maskSoftness = Number.parseFloat(getEntityValue(value, 'MaskSoftness') ?? '0');
    const outerCol = parseCol(getEntityValue(value, 'OuterBevelColor'));
    const glowStartDist = Number.parseFloat(getEntityValue(value, 'GlowStartDistance') ?? '0');
    const glowWidth = Number.parseFloat(getEntityValue(value, 'GlowWidth') ?? '0');

    return (element) => {
      // TODO
    };
  },
});

KNOWN_EFFECTS.set('{dd54adc0-a279-11d3-b92a000502f3fdbe}', {
  name: 'Color Fill',
  read: (target, value, state) => {
    const col = parseCol(getEntityValue(value, 'Color'));
    const opacity = Number.parseFloat(getEntityValue(value, 'Opacity') ?? '0') * 0.01;
    const blendMode = getEntityValue(value, 'Blendmode');

    return (element) => {
      //element.style.filter = [
      //  'brightness(0) invert(1) brightness(0.5) sepia(1) saturate(1000)', // force to #FF0000
      //  `hue-rotate(${}deg)`,
      //].join(' ');
      // TODO
    };
  },
});

KNOWN_EFFECTS.set('{d04ef8c1-71b4-11d1-8c8200a024cdc039}', {
  name: 'Auto Levels',
  read: (target, value, state) => {
    //"source_low_rgb" = "0"
    //"source_high_rgb" = "255"
    //"dest_low_rgb" = "0"
    //"dest_high_rgb" = "255"
    //"gamma_rgb" = "1"
    //"source_low_red" = "0"
    //"source_high_red" = "255"
    //"dest_low_red" = "0"
    //"dest_high_red" = "255"
    //"gamma_red" = "1"
    //"source_low_green" = "0"
    //"source_high_green" = "255"
    //"dest_low_green" = "0"
    //"dest_high_green" = "255"
    //"gamma_green" = "1"
    //"source_low_blue" = "0"
    //"source_high_blue" = "255"
    //"dest_low_blue" = "0"
    //"dest_high_blue" = "255"
    //"gamma_blue" = "1"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d04ef8c2-71b5-11d1-8c8200a024cdc039}', {
  name: 'Levels',
  read: (target, value, state) => {
    //"source_low_rgb" = "0"
    //"source_high_rgb" = "255"
    //"dest_low_rgb" = "0"
    //"dest_high_rgb" = "255"
    //"gamma_rgb" = "1"
    //"source_low_red" = "0"
    //"source_high_red" = "255"
    //"dest_low_red" = "0"
    //"dest_high_red" = "255"
    //"gamma_red" = "1"
    //"source_low_green" = "0"
    //"source_high_green" = "255"
    //"dest_low_green" = "0"
    //"dest_high_green" = "255"
    //"gamma_green" = "1"
    //"source_low_blue" = "0"
    //"source_high_blue" = "255"
    //"dest_low_blue" = "0"
    //"dest_high_blue" = "255"
    //"gamma_blue" = "1"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{3439b08e-1923-11d3-9bde00e02910d580}', {
  name: 'Curves',
  read: (target, value, state) => {
    // TODO: how are the points represented?
    //"rgb_points" = undefined
    //"red_points" = undefined
    //"green_points" = undefined
    //"blue_points" = undefined

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{3439b08d-1922-11d3-9bde00e02910d580}', {
  name: 'Hue/Saturation',
  read: (target, value, state) => {
    const hue = Number.parseFloat(getEntityValue(value, 'hue_amount') ?? '0');
    const saturation = Number.parseFloat(getEntityValue(value, 'saturation_amount') ?? '0');
    const lightness = Number.parseFloat(getEntityValue(value, 'lightness_amount') ?? '0');
    const colourise = getEntityValue(value, 'hls_colorize') === 'true';

    // TODO

    return (element) => {
      if (colourise) {
        // TODO: what does this do?
      } else {
        element.style.filter = `hue_rotate(${hue}deg) saturate(${saturation + 100}%) brightness(${lightness + 100}%)`;
      }
    };
  },
});

KNOWN_EFFECTS.set('{3439b08c-1921-11d3-9bde00e02910d580}', {
  name: 'Brightness/Contrast',
  read: (target, value, state) => {
    const brightness = Number.parseFloat(getEntityValue(value, 'brightness_amount') ?? '0');
    const contrast = Number.parseFloat(getEntityValue(value, 'contrast_amount') ?? '0');

    // TODO: what are the value ranges? (assume default 0 = no change)
    // TODO: is contrast or brightness applied first?

    return (element) => {
      element.style.filter = `contrast(${contrast + 100}%) brightness(${brightness + 100}%)`;
    };
  },
});

KNOWN_EFFECTS.set('{d2541291-70d6-11d1-8c8000a024cdc039}', {
  name: 'Invert',
  read: () => (element) => {
    element.style.filter = 'invert(100%)';
  },
});

KNOWN_EFFECTS.set('{2932d5a2-ca48-11d1-8561000502701850}', {
  name: 'Convert to Alpha',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{fc7093f1-f95c-11d0-8be200a024cdc039}', {
  name: 'Find Edges',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{f1cfce41-718e-11d1-8c8200a024cdc039}', {
  name: 'Blur',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{538016b6-ffd6-418f-a10c590e6ee841ae}', {
  name: 'Motion Blur',
  read: (target, value, state) => {
    //"motion_blur_angle" = "90"
    //"motion_blur_distance" = "10"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d1c33142-2ad8-4215-a39fc5d934c8fc0c}', {
  name: 'Radial Blur',
  read: (target, value, state) => {
    //"radial_blur_amount" = "30"
    //"radial_blur_quality" = "20"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{94dbd663-9b2e-44bf-8064ab6efdd2d327}', {
  name: 'Zoom Blur',
  read: (target, value, state) => {
    //"zoom_blur_amount" = "30"
    //"zoom_blur_quality" = "20"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d04ef8c0-71b3-11d1-8c8200a024cdc039}', {
  name: 'Gaussian Blur',
  read: (target, value, state) => {
    //"gaussian_blur_radius" = "4.0999999999999996"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{f1cfce42-718e-11d1-8c8200a024cdc039}', {
  name: 'Blur More',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{f1cfce44-718e-11d1-8c8200a024cdc039}', {
  name: 'Unsharp Mask',
  read: (target, value, state) => {
    //"unsharp_mask_radius" = "4.0999999999999996"
    //"unsharp_mask_amount" = "50"
    //"unsharp_mask_threshold" = "0"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{c20952b1-fc76-11d0-8be700a024cdc039}', {
  name: 'Sharpen',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{1f2f2591-9db7-11d1-8cad00a024cdc039}', {
  name: 'Sharpen More',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{e4c0f4bc-c0a3-4cb3-b3513822027e4d9f}', {
  name: 'Add Noise',
  read: (target, value, state) => {
    //"add_noise_amount" = "50"
    //"add_noise_use_color" = "false"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{ff84d00c-4494-11d8-a072000a9582f7d4}', {
  name: 'Clouds',
  read: (target, value, state) => {
    //"cloud_color" = "#999933"
    //"sky_color" = "#99ff99"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d2e7769c-6349-11d8-b0e9000a9595f34e}', {
  name: 'Difference Clouds',
  read: (target, value, state) => {
    //"cloud_color" = "#999933"
    //"sky_color" = "#99ff99"

    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-6563413465646d41}', {
  name: 'Marble',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-656341346564694e}', {
  name: 'Bevel Boss',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-6563413465646d54}', {
  name: 'Motion Trail',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{d810e821-f86b-11d0-7371473173676544}', {
  name: 'Edges',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

KNOWN_EFFECTS.set('{8eeadf50-9efe-11da-a7460800200c9a66}', {
  name: 'Photoshop Live Effects Special Fill',
  read: (target, value, state) => {
    // TODO

    return (element) => {
    };
  },
});

/**
 * @param {string | undefined} c
 * @return {number | undefined}
 */
function parseCol(c) {
  if (!c) {
    return undefined;
  }
  if (c[0] === '#') {
    if (c.length === 7) {
      return (
        0xFF000000 |
        Number.parseInt(c.substring(1), 16)
      ) >>> 0;
    }
    if (c.length === 9) {
      return (
        (Number.parseInt(c.substring(7), 16) << 24) |
        Number.parseInt(c.substring(1, 7), 16)
      ) >>> 0;
    }
  }
  throw new Error(`Unknown colour format: ${c}`);
}
