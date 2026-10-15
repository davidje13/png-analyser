import { MapNode } from './base/CoreNode.mjs';

export class CDMv extends MapNode {
	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');
}
