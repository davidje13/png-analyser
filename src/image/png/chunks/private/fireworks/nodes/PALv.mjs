import { MultiList } from './base/CoreNode.mjs';

// TODO: this structure is an inline array of objects, each beginning with FCLi

/** Palette */
export class PALv extends MultiList(() => ({
	FCLi: null,
	CLLb: null,
	CLTb: null,
	CLMb: null,
	BCLi: null,
})) {}
