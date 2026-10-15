import { MapNode } from './base/CoreNode.mjs';
import { PTHv } from './PTHv.mjs';

/** Text Along Path */
export class TAPv extends MapNode {
	path = this.required('PTHv', PTHv);
	textAlignment = this.optional('TAMi') ?? 0; // 0 = angle follows path, 1 = vertical, 2 = skew v, 3 = skew h
	characterOffset = this.optional('CHOf') ?? 0;
}
