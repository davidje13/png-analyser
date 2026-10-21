import { Enum } from './base/CoreNode.mjs';
import { EXPv } from './EXPv.mjs';
import { BaseAnimatedCanvas } from './MSTv.mjs';

const RSUi = Enum([
	[0, { name: 'pixels per inch', scale: 1 }],
	[1, { name: 'pixels per centimeter', scale: 2.54 }],
]);

/** Page */
export class PDCv extends BaseAnimatedCanvas {
	// this is also used as a base class for MKBv, so some
	// fields are optional despite always appearing in PDCv

	id = this.optional('PIDs');
	name = this.optional('PGNs');
	masterPage = this.optional('IMPb') ?? false;
	linkedToMaster = this.optional('PILb') ?? false;

	viewX = this.optional('XLCf') ?? 0;
	viewY = this.optional('YLCf') ?? 0;
	width = this.required('WIDf');
	height = this.required('HITf');
	resolution = this.optional('RESf') ?? 72;
	resolutionUnit = this.optional('RSUi', RSUi)?.value ?? { name: undefined, scale: 1 };

	//brushDefinitions = this.optional('PLLv', PLLv);
	//fillTypeDefinitions = this.optional('FLDv', FLDv);
	//gradientListDefinitions = this.optional('GLDv', GLDv);
	//effectDefinitions = this.optional('EFDv', EFDv);

	//pattern = this.optional('PATv', PATv);

	exportOptions = this.optional('EXPv', EXPv);
	//MNFv = this.optional('MNFv', MNFv);
	//lastExportDirectory = this.optional('LXDs');
	//lastExportFilename = this.optional('LXFs');

	//VRSi = this.optional('VRSi');
	//VRMi = this.optional('VRMi');
	//RQNi = this.optional('RQNi');

	get scaleAt72DPI() {
		const unit = this.resolutionUnit.scale;
		if (unit === 1) {
			return 72 / this.resolution;
		}
		// apply rounding to the scale due to unit conversion errors
		return Math.round(72 / (this.resolution * unit) * 1000) * 0.001;
	}
}
