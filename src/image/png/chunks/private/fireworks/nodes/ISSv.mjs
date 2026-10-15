import { MapNode } from './base/CoreNode.mjs';
import { CPSv } from './CPSv.mjs';
import { JSVv } from './JSVv.mjs';
import { MTXv } from './MTXv.mjs';

/** Smart Shape */
export class ISSv extends MapNode {
	label = this.optional('FILs');
	script = this.optional('JSVv', JSVv);
	transformMatrix = this.optional('MTXv', MTXv) ?? MTXv.IDENTITY;
	controlPoints = this.optional('CPSv', CPSv) ?? [];
}
