import { MapNode } from './base/CoreNode.mjs';
import { MSKv } from './MSKv.mjs';

/** Texture Brush */
export class TXBv extends MapNode {
	internalName = this.optional('INMs');
	mask = this.required('MSKv', MSKv);
}
