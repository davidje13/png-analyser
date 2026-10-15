import { Colour } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { GCLi } from './colours.mjs';

/** Grid */
export class GRDv extends MapNode {
	offsetX = this.optional('GOXf') ?? 0;
	offsetY = this.optional('GOYf') ?? 0;
	sizeX = this.optional('GSXf') ?? 0;
	sizeY = this.optional('GSYf') ?? 0;
	colour = this.optional('GCLi', GCLi) ?? Colour.TRANSPARENT;
}
