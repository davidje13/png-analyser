import { asGradientDiv } from '../../../../../pretty.mjs';
import { getBasicValue, getBasicValues, registerNode } from '../node_registry.mjs';

registerNode('FGV', 'v', { // Fill Gradient ???
  read: (target, value, state) => {
    const stops = extractGradient(value, state.warnings);

    target.toString = () => `FGV ${stops.length}-stop FGV gradient`;

    target.display = (summary, content) => {
      summary.append(`FGV ${stops.length}-stop FGV gradient`);
      content.append(asGradientDiv(stops));
    };
  },
});

registerNode('FG0', 'v', { // Fill Gradient 0
  read: (target, value, state) => {
    const stops = extractGradient(value, state.warnings);

    target.toString = () => `${stops.length}-stop FG0 (RGB) gradient`;
    for (const stop of stops) {
      if (stop.colour >>> 24 !== 0xFF) {
        state.warnings.push('Non-pure RGB gradient');
      }
    }

    target.display = (summary, content) => {
      summary.append(`${stops.length}-stop FG0 (RGB) gradient`);
      content.append(asGradientDiv(stops));
    };
  },
});

registerNode('FG1', 'v', { // Fill Gradient 1
  read: (target, value, state) => {
    const stops = extractGradient(value, state.warnings);
    for (const stop of stops) {
      if (stop.colour & 0xFFFFFF) {
        state.warnings.push('Non-pure alpha gradient');
      }
    }

    target.toString = () => `${stops.length}-stop FG1 (alpha) gradient`;

    target.display = (summary, content) => {
      summary.append(`${stops.length}-stop FG1 (alpha) gradient`);
      content.append(asGradientDiv(stops, true));
    };
  },
});

/**
 * @param {import('../node_registry.mjs').ProcessedNode[]} nodes
 * @param {string[]} warnings
 * @return {import('../../../../../pretty.mjs').Gradient}
 */
function extractGradient(nodes, warnings) {
  const count = getBasicValue(nodes, 'FNC', 'i') ?? 0;
  const stops = getBasicValues(nodes, 'FGI', 'v');
  if (stops.length !== count) {
    warnings.push(`Expected ${count} colour stops but got ${stops.length}`);
  }
  return stops.map((stop) => ({
    position: getBasicValue(stop, 'FGP', 'f') ?? 0,
    colour: getBasicValue(stop, 'FGC', 'i') ?? 0,
  }));
}
