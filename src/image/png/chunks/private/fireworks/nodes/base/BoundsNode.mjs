import { MapNode } from './CoreNode.mjs';

export class BoundsNode extends MapNode {
	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');

	get width() {
		return this.right - this.left;
	}

	get height() {
		return this.bottom - this.top;
	}
}
