import { Colour } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { BEVv } from './BEVv.mjs';
import { FCLi } from './colours.mjs';
import { DTAv } from './DTAv.mjs';
import { EXPv } from './EXPv.mjs';
import { PBPv } from './PBPv.mjs';

/** Image Slice / Hotspot */
export class URLv extends MapNode {
	id = this.optional('MSNi');
	name = this.optional('OBNs');
	lock = this.optional('LCKb') ?? false;
	type = this.optional('TSLi') ?? 0; // 0 = foreground, 2 = background

	label = this.optional('FILs');
	cellTdText = this.optional('TDTs');
	backgroundRepeat = this.optional('CBRi');
	backgroundAttachment = this.optional('CBAi');
	backgroundHorizontalPosition = this.optional('CBHi');
	horizontalValue = this.optional('CHVi');
	backgroundVerticalPosition = this.optional('CBVi');
	verticalValue = this.optional('CVVi');

	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');
	shape = this.optional('URSi') ?? 0; // 0 = rect, 1 = ellipse, 2 = polygon (PBPv)
	path = this.optional('PBPv', PBPv);

	href = this.optional('INMs');
	altText = this.optional('A2Ts');
	linkTarget = this.optional('ALTs');
	fillColour = this.optional('FCLi', FCLi) ?? Colour.TRANSPARENT;
	behaviourList = this.optional('BEVv', BEVv);
	exportOptions = this.optional('EXPv', EXPv);

	data = this.optional('DTAv', DTAv);

	//CBTb = this.optional('CBTb');
}
