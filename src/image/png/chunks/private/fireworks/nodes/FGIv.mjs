import { MapNode } from './base/CoreNode.mjs';
import { FGCi } from './colours.mjs';

/** Fill Gradient Control Point */
export class FGIv extends MapNode {
	position = this.required('FGPf');
	colour = this.required('FGCi', FGCi);
}
