import { MapNode } from './base/CoreNode.mjs';
import { BLDi } from './BLDi.mjs';
import { DTAv } from './DTAv.mjs';
import { EFLv } from './EFLv.mjs';
import { TILv } from './TILv.mjs';

export class BaseElement extends MapNode {
	visible = this.optional('VISb') ?? true;
	lock = this.optional('LCKb') ?? false;
	name = this.optional('OBNs');
	effectList = this.optional('EFLv', EFLv);
	opacity = (this.optional('OPAi') ?? 1000) * 0.001;
	blendMode = this.optional('BLDi', BLDi);
	image = this.optional('IMGv', IMGv);
	data = this.optional('DTAv', DTAv);
}

/** Image */
export class IMGv extends BaseElement {
	width = this.required('WPXi');
	height = this.required('HPXi');
	tileSize = this.required('TSZi');
	tiles = this.required('TILv', TILv);

	x = this.required('XLCf');
	y = this.required('YLCf');
	//xOffset = this.required('XOFf');
	//yOffset = this.required('YOFf');

	/** @type {string | undefined} */ cachedDataURL;
}
