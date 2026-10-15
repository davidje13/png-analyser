import { MapNode } from './base/CoreNode.mjs';
import { FGVv } from './FGVv.mjs';
import { FGYv } from './FGYv.mjs';

/** Fill Gradient */
export class FGLv extends MapNode {
	category = this.optional('CATs');
	internalName = this.optional('INMs');
	rgba = this.optional('FGYv', FGYv)?.combined ?? this.required('FGVv', FGVv);

	toCSSStops(alphaToLum = false) {
		if (alphaToLum) {
			return this.rgba.map((stop) => `#${(Math.round(stop.colour.a) * 0x010101).toString(16).padStart(6, '0')} ${stop.position * 100}%`).join(',');
		}
		return this.rgba.map((stop) => `${stop.colour.toCSS()} ${stop.position * 100}%`).join(',');
	}
}
