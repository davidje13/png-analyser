import { MapNode } from './base/CoreNode.mjs';
import { PBTv } from './PBTv.mjs';

/** Path Bezier Points */
export class PBPv extends MapNode {
	isClosed = this.optional('ISCb') ?? false;
	points = this.zeroOrMore('PBTv', PBTv);
	//BSLf = this.required('BSLf');
	//pathPointCount = this.required('PPCi');
}
