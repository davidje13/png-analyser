import { MapNode } from './base/CoreNode.mjs';
import { EFLv } from './EFLv.mjs';
import { IMGv } from './IMGv.mjs';
import { PATv } from './PATv.mjs';

export class ZSTv extends MapNode {
	//ZSNs = this.required('ZSNs');
	//ZSFi = this.required('ZSFi');
	//ZSOi = this.required('ZSOi');
	pattern = this.optional('PATv', PATv);
	fillPoint1 = { x: this.optional('PSXf') ?? 0, y: this.optional('PSYf') ?? 0 };
	fillPoint2 = { x: this.optional('PEXf') ?? this.fillPoint1.x, y: this.optional('PEYf') ?? this.fillPoint1.y };
	fillPoint3 = { x: this.optional('PFXf') ?? this.fillPoint1.x, y: this.optional('PFYf') ?? this.fillPoint1.y };
	brushPlacement = this.optional('BRPi') ?? 1;
	fillOnTop = this.optional('FOTb') ?? false;
	//FALi = this.required('FALi');
	//FATi = this.required('FATi');
	//FARi = this.required('FARi');
	//FABi = this.required('FABi');
	effectList = this.optional('EFLv', EFLv);
	fontFamily = this.optional('FONs') ?? 'sans-serif';
	//fontTypeface = this.optional('CFTs');
	fontPointSize = this.optional('PTSf') ?? 12;
	bold = this.optional('BOLb') ?? false;
	italic = this.optional('ITLb') ?? false;
	underline = this.optional('UNDb') ?? false;
	justification = this.optional('JSTi') ?? 0;
	horizontalScale = this.optional('HSCf') ?? 1;
	kerning = this.optional('RKNf') ?? 0;
	lineHeight = this.optional('LEDf') ?? 1;
	lineHeightUnit = this.optional('LDMi') ?? 0;
	autoKern = this.optional('ATKb') ?? true;
	//TIAb = this.required('TIAb');
	textAntiAlias = this.optional('TAAi') ?? 0;
	textAntiAliasingSharpness = this.optional('TA1i');
	textAntiAliasingStrength = this.optional('TA2i');
	textAntiAliasingSamples = this.optional('TOSi');
	images = this.zeroOrMore('IMGv', IMGv);
}
