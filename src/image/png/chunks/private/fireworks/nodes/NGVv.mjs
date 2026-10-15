import { MapNode } from './base/CoreNode.mjs';

/** Nine Slice Guide Limits */
export class NGVv extends MapNode {
	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');
}
