import { Colour } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { BGCi } from './colours.mjs';
import { GDSv } from './GDSv.mjs';
import { GRDv } from './GRDv.mjs';
import { LYLv } from './LYLv.mjs';
import { NGSv } from './NGSv.mjs';

export class BaseAnimatedCanvas extends MapNode {
	frameCount = this.zeroOrMore('FRCi')[0] ?? 1; // unclear why there can be multiple

	backgroundColour = this.optional('BGCi', BGCi) ?? Colour.TRANSPARENT;
	layerList = this.required('LYLv', LYLv);

	grid = this.optional('GRDv', GRDv);
	guides = this.optional('GDSv', GDSv);
	onionSkinningBeforeFrames = this.optional('OSBi') ?? 0;
	onionSkinningAfterFrames = this.optional('OSAi') ?? 0;
}

/** Symbol Definition */
export class MSTv extends BaseAnimatedCanvas {
	id = this.required('MSNi');
	name = this.optional('UNMs');
	type = this.optional('MSYi') ?? 0;
	lastUpdateTime = this.optional('LUTs');
	nineSliceGuide = this.optional('NGSv', NGSv);

	//MOXf = this.required('MOXf');
	//MOYf = this.required('MOYf');
	//ATSb = this.required('ATSb');
	//IDSb = this.required('IDSb');
	//DVLb = this.required('DVLb');
	//IODb = this.required('IODb');
}
