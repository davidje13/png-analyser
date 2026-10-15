import { MapNode } from './base/CoreNode.mjs';
import { ELMv } from './ELMv.mjs';

/** Animation Cell */
export class CELv extends MapNode {
	visible = this.optional('VISb') ?? true;
	lock = this.optional('LCKb') ?? false;
	elements = this.required('ELMv', ELMv);
}
