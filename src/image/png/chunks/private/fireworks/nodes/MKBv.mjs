import { LSMv } from './LSMv.mjs';
import { MSLv } from './MSLv.mjs';
import { PDCv } from './PDCv.mjs';
import { ZSLv } from './ZSLv.mjs';

/** Document */
export class MKBv extends PDCv {
	crossPageLayerDefinitions = this.optional('LSMv', LSMv) ?? [];
	symbolDefinitions = this.optional('MSLv', MSLv) ?? [];
	styleDefinitions = this.optional('ZSLv', ZSLv) ?? [];
	//ILLb = this.optional('ILLb');
}
