import { MapNode } from './base/CoreNode.mjs';

/** Bezier Sub-Point */
export class BAZv extends MapNode {
	velocity = this.optional('VELf');
	pressure = this.optional('PRSf');
}
