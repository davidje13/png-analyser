import { MapNode } from './base/CoreNode.mjs';
import { ZSTv } from './ZSTv.mjs';

/** Behaviour */
export class BEHv extends MapNode {
	behaviourType = this.required('BETi');
	BEEi = this.optional('BEEi');
	CDTs = this.optional('CDTs');
	xLocation = this.optional('XLCf');
	yLocation = this.optional('YLCf');
	textRun = this.optional('TRNs');
	menuItemTextColour = this.optional('FCLi');
	FETi = this.optional('FETi');
	justification = this.optional('JSTi');
	VERi = this.optional('VERi');
	menuDelay = this.optional('TMOi');
	XSLf = this.optional('XSLf');
	YSLf = this.optional('YSLf');
	RELb = this.optional('RELb');
	menuItemCellSpacing = this.optional('CSPi');
	menuItemCellPadding = this.optional('CPDi');
	OPQb = this.optional('OPQb');
	highlightColour = this.optional('HICi');
	colourShadow = this.optional('CSHi');
	borderColour = this.optional('BOCi');
	borderSize = this.optional('BOSi');
	overrideWidth = this.optional('OVWb');
	overrideHeight = this.optional('OVHb');
	menuIndentText = this.optional('MITi');
	menuItemsVertical = this.optional('MIVb');
	textColourHover = this.optional('MIDi');
	menuItemWidth = this.optional('MIWi');
	menuItemHeight = this.optional('MIHi');
	HIMb = this.optional('HIMb');
	bold = this.optional('BOLb');
	italic = this.optional('ITLb');
	fontFamily = this.optional('FONs');
	fontPointSize = this.optional('PTSf');
	autoEnlarge = this.optional('ATEb');
	backgroundColour = this.optional('BCLi');
	backgroundColourHover = this.optional('BCMi');
	ZSTvs = this.zeroOrMore('ZSTv', ZSTv);
}
