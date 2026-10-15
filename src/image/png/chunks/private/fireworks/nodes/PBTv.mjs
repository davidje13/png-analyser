import { MapNode } from './base/CoreNode.mjs';
import { BZLv } from './BZLv.mjs';
import { PPLv } from './PPLv.mjs';

/** Path Bezier Point */
export class PBTv extends MapNode {
	x = this.required('XLCf');
	y = this.required('YLCf');
	xC1 = this.optional('XPCf') ?? this.x;
	yC1 = this.optional('YPCf') ?? this.y;
	xC2 = this.optional('XSCf') ?? this.x;
	yC2 = this.optional('YSCf') ?? this.y;
	isCurve = this.optional('CRVb');
	randomSeed = this.optional('RNDi');
	nextSegmentDistance = this.optional('NSDf');
	subPointsList = this.optional('BZLv', BZLv);
	pathPointList = this.optional('PPLv', PPLv);
}
