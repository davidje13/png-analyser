import { MapNode } from './base/CoreNode.mjs';
import { PPTv } from './PPTv.mjs';

/** Path Point List */
export class PPLv extends MapNode {
	isClosed = this.optional('ISCb');
	//pathPointCount = this.optional('PPCi');
	pathPoints = this.zeroOrMore('PPTv', PPTv);
}
