import { Colour, mixColourSRGB } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { FG0v } from './FG0v.mjs';
import { FG1v } from './FG1v.mjs';

/** Fill Gradient RGB + Alpha */
export class FGYv extends MapNode {
	rgb = this.required('FG0v', FG0v);
	alpha = this.required('FG1v', FG1v);

	/** @type {Gradient} */
	get combined() {
		return [...new Set([...this.rgb, ...this.alpha].map((v) => v.position))]
			.sort((a, b) => a - b)
			.map((position) => ({
				position,
				colour: gradientAt(this.rgb, position).withAlpha(gradientAt(this.alpha, position).a),
			}));
	}
}

/**
 * @typedef {ReadonlyArray<{ position: number, colour: Colour }>} Gradient
 */

/**
 * @param {Gradient} m
 * @param {number} p
 * @return {Colour}
 */
function gradientAt(m, p) {
  if (!m.length) {
    return Colour.TRANSPARENT;
  }
  for (let i = 0; i < m.length; ++i) {
    if (m[i].position >= p) {
      if (i === 0) {
        return m[0].colour;
      }
      const prev = m[i - 1];
      const next = m[i];
      const frac = (p - prev.position) / (next.position - prev.position);
      return mixColourSRGB(prev.colour, next.colour, frac);
    }
  }
  return m[m.length - 1].colour;
}
