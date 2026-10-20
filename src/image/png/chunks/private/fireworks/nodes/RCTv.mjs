import { BoundsNode } from './base/BoundsNode.mjs';

/** Rectangle */
export class RCTv extends BoundsNode {
	borderRadius = this.optional('RDSf') ?? 0;
}
