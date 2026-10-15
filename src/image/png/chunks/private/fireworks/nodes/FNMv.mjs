import { MapNode } from './base/CoreNode.mjs';

/** Frame Configuration */
export class FNMv extends MapNode {
	name = this.optional('OBNs');
	duration = (this.optional('FNDi') ?? 7) * 0.01;
	visible = this.optional('VISb') ?? true;
	//FNPi = this.required('FNPi');
}
