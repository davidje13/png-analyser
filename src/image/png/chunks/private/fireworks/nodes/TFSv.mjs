import { MultiList } from './base/CoreNode.mjs';
import { FCLi } from './colours.mjs';

/** Text Formatted String */
export class TFSv extends MultiList(() => ({
	FONs: null,
	PTSf: null,
	BOLb: null,
	ITLb: null,
	UNDb: null,
	HSCf: null,
	RKNf: null,
	BLSf: null,
	LEDf: null,
	LDMi: null,
	JSTi: null,
	FCLi,
	PINf: null,
	PSBf: null,
	PSAf: null,
	TRNs: null,
})) {}
