import { MultiList } from './base/CoreNode.mjs';
import { TMCi } from './colours.mjs';

/** Tile ID List */
export class TILv extends MultiList(() => ({
	TIDi: null,
	TMCi,
})) {}
