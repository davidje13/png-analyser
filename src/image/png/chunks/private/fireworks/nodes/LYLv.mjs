import { MultiList } from './base/CoreNode.mjs';
import { LAYv } from './LAYv.mjs';
import { LSAv } from './LSAv.mjs';
import { MPLv } from './MPLv.mjs';

/** Layer List */
export class LYLv extends MultiList(() => ({
	LAYv,
	LSAv,
	MPLv,
})) {}
