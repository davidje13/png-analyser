import { svgEl } from '../../../../../../display/pretty.mjs';
import { float } from './readers.mjs';
import { registerEffect } from './registry.mjs';

registerEffect('{f1cfce41-718e-11d1-8c8200a024cdc039}', {
	name: 'Blur',
	apply: (globals, contents) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: '16 16 16 16 127 16 16 16 16',
				divisor: 255,
				edgeMode: 'duplicate',
			}),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{f1cfce42-718e-11d1-8c8200a024cdc039}', {
	name: 'Blur More',
	apply: (globals, contents) => {
		const filterID = globals.addDef(svgEl('filter', {
			x: '0%',
			y: '0%',
			width: '100%',
			height: '100%',
		}, [
			svgEl('feConvolveMatrix', {
				// match fireworks behaviour
				order: 3,
				kernelUnitLength: 1,
				kernelMatrix: '21 21 21 21 87 21 21 21 21',
				divisor: 255,
				edgeMode: 'duplicate',
			}),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{d04ef8c0-71b3-11d1-8c8200a024cdc039}', {
	name: 'Gaussian Blur',
	apply: (globals, contents, data) => {
		const blur = float(data['gaussian_blur_radius']) ?? 0;

		// match fireworks behaviour
		const stdDeviation = blur * 1.05;

		const filterID = globals.addDef(svgEl('filter', {
			// TODO: extend bounds based on blur amount (need to know what size the target is)
			x: '-30%',
			y: '-30%',
			width: '160%',
			height: '160%',
		}, [
			svgEl('feGaussianBlur', { stdDeviation }),
		]));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{538016b6-ffd6-418f-a10c590e6ee841ae}', {
	name: 'Motion Blur',
	apply: (globals, contents, data) => {
		const dist = float(data['motion_blur_distance']) ?? 0;
		const angle = -(float(data['motion_blur_angle']) ?? 0) * Math.PI / 180;

		// match fireworks behaviour
		const x = Math.trunc(Math.cos(angle) * dist);
		const y = Math.trunc(Math.sin(angle) * dist);

		/** @type {SVGElement[]} */ const steps = [];
		// TODO: could make the blur higher quality using an initial or final feConvolveMatrix for sub-pixel blending
		let prev = 'SourceGraphic';
		let d = 0.5;
		let i = 0;
		const lim = Math.max(Math.abs(x), Math.abs(y));
		for (; d * 2 <= lim + 1; d *= 2) {
			const next = `l${++i}`;
			steps.push(
				svgEl('feOffset', { dx: x * d / lim, dy: y * d / lim }),
				svgEl('feComposite', { operator: 'arithmetic', k2: 0.5, k3: 0.5, in: prev, result: next }),
			);
			prev = next
		}
		let j = 0;
		for (let dd = d; i && dd < lim + 1; dd += d) {
			while (i && dd + d > lim + 1) {
				d /= 2;
				--i;
			}
			const next = `b${++j}`;
			steps.push(
				svgEl('feOffset', { dx: x * dd / lim, dy: y * dd / lim, in: i ? `l${i}` : 'SourceGraphic' }),
				svgEl('feComposite', { operator: 'arithmetic', k2: dd / (dd + d), k3: d / (dd + d), in: prev, result: next }),
			);
			prev = next;
		}

		const filterID = globals.addDef(svgEl('filter', {
			// TODO: extend bounds based on translation distance (need to know what size the target is)
			x: x >= 0 ? '0%' : '-50%',
			y: y >= 0 ? '0%' : '-50%',
			width: x ? '150%' : '100%',
			height: y ? '150%' : '100%',
		}, steps));
		contents.setAttribute('filter', `url(#${encodeURIComponent(filterID)})`);
		return contents;
	},
});

registerEffect('{d1c33142-2ad8-4215-a39fc5d934c8fc0c}', {
	name: 'Radial Blur',
	apply: (globals, contents, data) => {
		const angle = (float(data['radial_blur_amount']) ?? 0) * 0.5;
		const n = Math.max(1, Math.min(180, Math.ceil((float(data['radial_blur_quality']) ?? 0) / 2)));

		const sourceID = globals.nextID();
		contents.setAttribute('id', sourceID);
		contents.setAttribute('opacity', String(1 / (n * 2 + 1)));
		contents.style.mixBlendMode = 'plus-lighter';
		const hold = svgEl('g', {}, [contents]);
		hold.style.isolation = 'isolate';
		for (let i = -n; i <= n; ++i) {
			if (i) {
				const sample = svgEl('use', { href: `#${encodeURIComponent(sourceID)}`, transform: `rotate(${angle * i / n})`, 'transform-origin': 'center' });
				sample.style.transformBox = 'fill-box'; // TODO: may be better to specify an explicit transform origin, but that requires knowing the object's bounds
				sample.style.mixBlendMode = 'plus-lighter';
				hold.append(sample);
			}
		}
		return hold;
	},
});

registerEffect('{94dbd663-9b2e-44bf-8064ab6efdd2d327}', {
	name: 'Zoom Blur',
	apply: (globals, contents, data) => {
		const zoom = (float(data['zoom_blur_amount']) ?? 0) * 0.005;
		const n = Math.max(1, Math.min(100, Math.ceil((float(data['zoom_blur_quality']) ?? 0) / 2)));

		const sourceID = globals.nextID();
		contents.setAttribute('id', sourceID);
		contents.setAttribute('opacity', String(1 / (n * 2 + 1)));
		contents.style.mixBlendMode = 'plus-lighter';
		const hold = svgEl('g', {}, [contents]);
		hold.style.isolation = 'isolate';
		for (let i = -n; i <= n; ++i) {
			if (i) {
				const sample = svgEl('use', { href: `#${encodeURIComponent(sourceID)}`, transform: `scale(${(1 + zoom * i / n)})`, 'transform-origin': 'center' });
				sample.style.transformBox = 'fill-box'; // TODO: may be better to specify an explicit transform origin, but that requires knowing the object's bounds
				sample.style.mixBlendMode = 'plus-lighter';
				hold.append(sample);
			}
		}
		return hold;
	},
});

registerEffect('{d810e821-f86b-11d0-6563413465646d54}', {
	name: 'Motion Trail',
	apply: (globals, contents, data) => {
		return contents; // TODO
	},
});
