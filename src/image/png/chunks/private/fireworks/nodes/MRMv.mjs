import { MapNode } from './base/CoreNode.mjs';
import { PTHv } from './PTHv.mjs';

export class MRMv extends MapNode {
	path = this.optional('PTHv', PTHv);
}
