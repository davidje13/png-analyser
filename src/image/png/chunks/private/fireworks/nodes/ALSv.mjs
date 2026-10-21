import { signedInt } from './base/CoreNode.mjs';
import { BaseElement } from './IMGv.mjs';
import { MTXv } from './MTXv.mjs';

/** Symbol Instance */
export class ALSv extends BaseElement {
	id = this.required('MSNi');
	name = this.optional('OBNs');
	label = this.optional('FILs');
	transformMatrix = this.optional('MTXv', MTXv) ?? MTXv.IDENTITY;
	//symbolTransformMatrix = this.optional('ATMv', ATMv);
	animationNumberOfFrames = this.optional('ANNi') ?? 1;
	animationXShift = this.optional('ANXf') ?? 0;
	animationYShift = this.optional('ANYf') ?? 0;
	animationScaling = this.optional('ASCf') ?? 1;
	animationRotation = signedInt(this.optional('ANRi') ?? 0);
	animationStartOpacity = (this.optional('ASOi') ?? 1000) * 0.001;
	animationEndOpacity = (this.optional('AEOi') ?? 1000) * 0.001;

	//WPVs = this.optional('WPVs')?.split('&;&').map((v) => {
	//	const [name, value, type] = v.split('&|&');
	//	return { name, value, type };
	//}) ?? [];

	//XFMi = this.required('XFMi');
	//ALNi = this.optional('ALNi');
}
