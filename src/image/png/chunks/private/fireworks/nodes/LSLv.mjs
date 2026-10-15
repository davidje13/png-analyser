import { MapNode } from './base/CoreNode.mjs';
import { CLLv } from './CLLv.mjs';
import { VIFv } from './VIFv.mjs';

/** Layer Sub-Layer */
export class LSLv extends MapNode {
	name = this.optional('LNMs');
	animationCellList = this.required('CLLv', CLLv);
	frameChangingLayer = this.optional('MCLb') ?? true;
	treeNodeOpen = this.optional('DISb') ?? true;
	visibilityPerFrame = this.optional('VIFv', VIFv);

	//special = this.required('MSLb');
	//nestingLevel = this.optional('LLLi') ?? 0;
	//BKGb = this.required('BKGb');
	//URLb = this.required('URLb');

	/** @param {number} frame */
	visibleInFrame(frame) {
		if (this.visibilityPerFrame && !this.visibilityPerFrame[frame]) {
			return false;
		}
		return this.contentInFrame(frame).visible;
	}

	/** @param {number} frame */
	contentInFrame(frame) {
		return this.animationCellList[this.frameChangingLayer ? frame : 0];
	}
}
