import { MapNode } from './base/CoreNode.mjs';
import { VIFv } from './VIFv.mjs';

/** Master Page Link */
export class MPLv extends MapNode {
	pageId = this.required('PIDs');
	treeNodeOpen = this.optional('DISb') ?? true;
	name = this.optional('LNMs');
	visibilityPerFrame = this.optional('VIFv', VIFv);

	/** @param {number} frame */
	visibleInFrame(frame) {
		return !this.visibilityPerFrame || Boolean(this.visibilityPerFrame[frame]);
	}
}
