import { tilesAsCanvas } from '../../../../../../display/pretty.mjs';
import { IMGv } from '../nodes/IMGv.mjs';
import { MSKv } from '../nodes/MSKv.mjs';

/** @typedef {import('./globals.mjs').ImageGlobals} ImageGlobals */

/**
 * @param {ImageGlobals} globals
 * @param {IMGv | MSKv} o
 */
export function rasterToDataURL(globals, o) {
	const width = o.width;
	const height = o.height;
	const tileSize = o.tileSize;
	const tiles = o.tiles;

	const nx = Math.ceil(width / tileSize);
	const ny = Math.ceil(height / tileSize);
	if (tiles.length !== nx * ny) {
		console.warn(`expected ${nx * ny} tiles, got ${tiles.length}`);
	}

	/** @type {import('../../../../../../display/pretty.mjs').TileData} */
	const r = { width, height, tiles: [] };
	for (let y = 0; y < ny; ++y) {
		for (let x = 0; x < nx; ++x) {
			const px = x * tileSize;
			const py = y * tileSize;
			const tile = tiles[y * nx + x];
			if (tile?.type === 'TIDi') {
				const mkbt = globals.root.getTile(tile.value);
				if (mkbt?.img) {
					r.tiles.push({ type: 'i', x: px, y: py, value: mkbt.img() });
					continue;
				}
			}
			const tmci = (tile?.type === 'TMCi' ? tile.value.argb32 : null) ?? 0xFFFF0000;
			r.tiles.push({ type: 'c', x: px, y: py, value: tmci, w: tileSize, h: tileSize });
		}
	}
	return tilesAsCanvas(r).toDataURL();
}
