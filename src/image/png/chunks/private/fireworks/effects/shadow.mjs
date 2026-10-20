import { rgba, svgEl } from '../../../../../../display/pretty.mjs';
import { col, float } from './readers.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{a7944db8-6ce2-11d1-8c76000502701850}', {
	name: 'Drop Shadow',
	apply: (globals, contents, data) => {
		const knockout = data['ShadowType'] === '1';
		const blur = float(data['ShadowBlur']) ?? 0;
		const dist = float(data['ShadowDistance']) ?? 0;
		const angle = -(float(data['ShadowAngle']) ?? 0) * Math.PI / 180;
		const shadowCol = col(data['ShadowColor']);
		if (!shadowCol) {
			if (knockout) {
				contents.setAttribute('display', 'none');
			}
			return contents;
		}

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);
		const stdDeviation = blur * 0.5;

		if (knockout) {
			const filterID = globals.addDef(svgEl('filter', {
				// TODO: extend bounds based on blur amount (need to know what size the target is)
				x: '-30%',
				y: '-30%',
				width: '160%',
				height: '160%',
				'data-type': 'drop-shadow',
				'data-knockout': 'true',
			}, [
				svgEl('feOffset', { dx: x, dy: y, in: 'SourceAlpha' }),
				svgEl('feGaussianBlur', { stdDeviation }),
				svgEl('feComposite', { operator: 'out', in2: 'SourceAlpha', result: 'b' }),
				svgEl('feFlood', { 'flood-color': rgba(shadowCol) }),
				svgEl('feComposite', { operator: 'in', in2: 'b' }),
			]));
			contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		} else {
			const filterID = globals.addDef(svgEl('filter', {
				// TODO: extend bounds based on blur amount (need to know what size the target is)
				x: '-30%',
				y: '-30%',
				width: '160%',
				height: '160%',
				'data-type': 'drop-shadow',
			}, [
				svgEl('feDropShadow', {
					dx: x,
					dy: y,
					stdDeviation,
					'flood-color': rgba(shadowCol),
				}),
			]));
			contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		}
		return contents;
	},
});

registerEffect('{5600f702-774c-11d3-baad0000861f4d01}', {
	name: 'Inner Shadow',
	apply: (globals, contents, data) => {
		const knockout = data['ShadowType'] === '1';
		const blur = float(data['ShadowBlur']) ?? 0;
		const dist = float(data['ShadowDistance']) ?? 0;
		const angle = -(float(data['ShadowAngle']) ?? 0) * Math.PI / 180;
		const shadowCol = col(data['ShadowColor']);
		if (!shadowCol) {
			return contents;
		}

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);
		const stdDeviation = blur * 0.5;

		const filterID = globals.addDef(svgEl('filter', {
			// TODO: extend bounds based on translation distance (need to know what size the target is)
			x: x >= 0 ? '0%' : '-50%',
			y: y >= 0 ? '0%' : '-50%',
			width: x ? '150%' : '100%',
			height: y ? '150%' : '100%',
			'data-type': 'inner-shadow',
			'data-knockout': knockout ? 'true' : undefined,
		}, [
			svgEl('feOffset', { dx: x, dy: y, in: 'SourceAlpha' }),
			svgEl('feGaussianBlur', { stdDeviation, result: 'b' }),
			svgEl('feFlood', { 'flood-color': rgba(shadowCol) }),
			svgEl('feComposite', { operator: 'out', in2: 'b' }),
			knockout
				? svgEl('feComposite', { operator: 'in', in2: 'SourceAlpha' })
				: svgEl('feComposite', { operator: 'atop', in2: 'SourceGraphic' }),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{b90c950e-64df-11d8-aaf2000a9582f7d4}', {
	name: 'Solid Shadow',
	apply: (globals, contents, data) => {
		const dist = float(data['distance']) ?? 0;
		const angle = -(float(data['angle']) ?? 0) * Math.PI / 180;
		const shadowCol = col(data['color']) ?? 0;
		const useCol = data['usecolor'] !== 'false';

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);

		/** @type {SVGElement[]} */ const steps = [];
		// TODO: could make the blur higher quality using an initial or final feConvolveMatrix for sub-pixel blending
		let prev = 'SourceGraphic';
		if (useCol) {
			steps.push(
				svgEl('feFlood', { 'flood-color': rgba(shadowCol) }),
				svgEl('feComposite', { operator: 'in', in2: 'SourceAlpha', result: 'l0' }),
			);
			prev = 'l0';
		}
		const first = prev;
		let d = 0.5;
		let i = 0;
		const lim = Math.max(Math.abs(x), Math.abs(y));
		for (; d * 2 <= lim; d *= 2) {
			const next = `l${++i}`;
			steps.push(
				svgEl('feOffset', { dx: x * d / lim, dy: y * d / lim }),
				svgEl('feComposite', { operator: 'over', in: prev, result: next }),
			);
			prev = next
		}
		let j = 0;
		for (let dd = d; i && dd < lim; dd += d) {
			while (i && dd + d > lim) {
				d /= 2;
				--i;
			}
			const next = `b${++j}`;
			steps.push(
				svgEl('feOffset', { dx: x * dd / lim, dy: y * dd / lim, in: i ? `l${i}` : first }),
				svgEl('feComposite', { operator: 'over', in: prev, result: next }),
			);
			prev = next;
		}

		steps.push(
			svgEl('feOffset', { dx: x * 0.5 / lim, dy: y * 0.5 / lim }),
			svgEl('feComposite', { operator: 'over', in: 'SourceGraphic' }),
		);

		const filterID = globals.addDef(svgEl('filter', {
			// TODO: extend bounds based on translation distance (need to know what size the target is)
			x: x >= 0 ? '0%' : '-50%',
			y: y >= 0 ? '0%' : '-50%',
			width: x ? '150%' : '100%',
			height: y ? '150%' : '100%',
			'data-type': 'solid-shadow',
			'data-x': x,
			'data-y': y,
		}, steps));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});
