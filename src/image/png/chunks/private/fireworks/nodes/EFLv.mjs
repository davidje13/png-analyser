import { MapNode } from './base/CoreNode.mjs';
import { EPSv } from './EPSv.mjs';

/** Effect List */
export class EFLv extends MapNode {
	category = this.optional('CATs');
	internalName = this.optional('INMs');
	effectPropertiess = this.zeroOrMore('EPSv', EPSv);
}
