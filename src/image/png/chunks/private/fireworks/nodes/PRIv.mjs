import { MapNode } from './base/CoreNode.mjs';
import { EFLv } from './EFLv.mjs';
import { MTXv } from './MTXv.mjs';
import { RCTv } from './RCTv.mjs';

/** Primitive */
export class PRIv extends MapNode {
	//PCFb = this.required('PCFb');
	//fillPoint1 = { x: this.required('PSXf'), y: this.required('PSYf') };
	//fillPoint2 = { x: this.required('PEXf'), y: this.required('PEYf') };
	//fillPoint3 = { x: this.required('PFXf'), y: this.required('PFYf') };
	transformMatrix = this.optional('MTXv', MTXv) ?? MTXv.IDENTITY;
	rectangle = this.optional('RCTv', RCTv);
	borderRadiusMaintain = this.optional('RDMb');
	effectList = this.optional('EFLv', EFLv);
}
