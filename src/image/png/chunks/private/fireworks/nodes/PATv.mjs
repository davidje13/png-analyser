import { Colour } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { BPLv } from './BPLv.mjs';
import { BCLi, FCLi } from './colours.mjs';
import { FPLv } from './FPLv.mjs';
import { TXBv } from './TXBv.mjs';
import { TXFv } from './TXFv.mjs';

/** Pattern */
export class PATv extends MapNode {
	brushColour = this.optional('BCLi', BCLi) ?? Colour.TRANSPARENT;
	fillColour = this.optional('FCLi', FCLi) ?? Colour.TRANSPARENT;
	fillPatternProperties = this.optional('FPLv', FPLv);
	textureBrush = this.optional('TXBv', TXBv);
	textureFill = this.optional('TXFv', TXFv);
	brushPropertyList = this.optional('BPLv', BPLv);
}
