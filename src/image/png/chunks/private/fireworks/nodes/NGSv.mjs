import { Colour } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { NGMv } from './NGMv.mjs';
import { NGVv } from './NGVv.mjs';

/** Nine Slice Guide */
export class NGSv extends MapNode {
	nineSliceGuideLocked = this.optional('NGLb') ?? false;
	nineSliceGuideColour = this.optional('NGKi') ?? Colour.TRANSPARENT;
	nineSliceGuideControls = this.zeroOrMore('NGCf'); // exactly 4
	nineSliceGuideShapeBounds = this.optional('NGMv', NGMv);
	nineSliceGuideLimits = this.optional('NGVv', NGVv);
}
