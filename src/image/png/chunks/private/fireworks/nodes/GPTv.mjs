import { MapNode } from './base/CoreNode.mjs';

/** Grab Point */
export class GPTv extends MapNode {
	x = this.required('XLCf');
	y = this.required('YLCf');
}
