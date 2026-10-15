import { MapNode } from './base/CoreNode.mjs';
import { LAYv } from './LAYv.mjs';

/** Layer Shared Definition */
export class LSEv extends MapNode {
	id = this.required('UIDs');
	layer = this.required('LAYv', LAYv);
	//isPrimary = this.required('ISPb'); // always true for LSEv
}
