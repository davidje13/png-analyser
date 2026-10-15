import { MapNode } from './base/CoreNode.mjs';

/** Nine Slice Guide Shape Bounds */
export class NGMv extends MapNode {
	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');
}
