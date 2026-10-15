import { MapNode } from './base/CoreNode.mjs';
import { MSKv } from './MSKv.mjs';

/** Texture Fill */
export class TXFv extends MapNode {
	internalName = this.optional('INMs');
	userFacingName = this.optional('UNMs');
	mask = this.required('MSKv', MSKv);
}
