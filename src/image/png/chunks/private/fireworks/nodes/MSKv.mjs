import { MapNode } from './base/CoreNode.mjs';
import { TILv } from './TILv.mjs';

/** Mask */
export class MSKv extends MapNode {
	width = this.required('WPXi');
	height = this.required('HPXi');
	tileSize = this.required('TSZi');
	tiles = this.required('TILv', TILv);

	/** @type {string | undefined} */ cachedDataURL;
}
