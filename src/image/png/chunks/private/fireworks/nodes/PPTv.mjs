import { MapNode } from './base/CoreNode.mjs';

/** Path Point */
export class PPTv extends MapNode {
	xLocation = this.required('XLCf');
	yLocation = this.required('YLCf');
	pressure = this.optional('PRSf');
	velocity = this.optional('VELf');
	duration = this.optional('DURi');
	randomSeed = this.optional('RNDi');
	onControlPoint = this.optional('ONCb');
}
