import { MapNode } from './base/CoreNode.mjs';

/** Rectangle */
export class RCTv extends MapNode {
	borderRadius = this.optional('RDSf') ?? 0;
	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');
}
