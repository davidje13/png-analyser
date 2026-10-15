import { MapNode } from './base/CoreNode.mjs';

/** Layer Source Link */
export class LSAv extends MapNode {
	id = this.required('UIDs');
	//isPrimary = this.required('ISPb'); // always false for LSAv
}
