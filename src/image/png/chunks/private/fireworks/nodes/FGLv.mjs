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
			return this.rgba.map((stop) => `#${(Math.round(stop.colour.a) * 0x010101).toString(16).padStart(6, '0')} ${(stop.position * 100).toFixed(2)}%`).join(',');
		}
		return this.rgba.map((stop) => `${stop.colour.toCSS()} ${(stop.position * 100).toFixed(2)}%`).join(',');
	}

	toMirroredCSSStops() {
		const r = [];
		const r2 = [];
		for (const stop of this.rgba) {
			const c = stop.colour.toCSS();
			r.push(`${c} ${(stop.position * 50).toFixed(2)}%`);
			r2.push(`${c} ${(100 - stop.position * 50).toFixed(2)}%`);
		}
		r.push(...r2.reverse());
		return r.join(',');
	}
}
