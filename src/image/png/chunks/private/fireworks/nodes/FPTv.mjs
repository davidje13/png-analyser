import { MapNode } from './base/CoreNode.mjs';
import { IMGv } from './IMGv.mjs';

/** Fill Pattern Tile */
export class FPTv extends MapNode {
	internalName = this.optional('INMs');
	image = this.required('IMGv', IMGv);
}
