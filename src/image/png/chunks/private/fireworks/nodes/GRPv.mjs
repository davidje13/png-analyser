import { ELMv } from './ELMv.mjs';
import { BaseElement } from './IMGv.mjs';
import { ISSv } from './ISSv.mjs';
import { MRMv } from './MRMv.mjs';

/** Group */
export class GRPv extends BaseElement {
	type = this.optional('GRTi') ?? 0; // 0 = regular, 1 = grayscale mask, 2 = shape mask
	elements = this.required('ELMv', ELMv);
	showMask = !(this.optional('MNAb') ?? false);
	MRMv = this.optional('MRMv', MRMv);
	linked = this.optional('LNKb');
	smartShape = this.optional('ISSv', ISSv);
}
