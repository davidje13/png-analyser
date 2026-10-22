import { MultiList } from './base/CoreNode.mjs';
import { ALSv } from './ALSv.mjs';
import { GRPv } from './GRPv.mjs';
import { IMGv } from './IMGv.mjs';
import { LSLv } from './LSLv.mjs';
import { PTHv } from './PTHv.mjs';
import { TXTv } from './TXTv.mjs';
import { URLv } from './URLv.mjs';
import { CSGv } from './CSGv.mjs';

/** Elements */
export class ELMv extends MultiList(() => ({
	IMGv,
	PTHv,
	TXTv,
	GRPv,
	CSGv,
	LSLv,
	URLv,
	ALSv,
})) {}
