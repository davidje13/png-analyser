import { MapNode } from './base/CoreNode.mjs';

/** Control Point */
export class CPTv extends MapNode {
	xLocation = this.required('XLCf');
	yLocation = this.required('YLCf');
	type = this.optional('CTYi') ?? 0;
	name = this.optional('OBNs');
	tooltip = this.optional('TTPs');
	tooltipTracksDrag = this.optional('TTDb') ?? false;
	visible = this.optional('VISb') ?? true;
}
