import { BaseElement } from './IMGv.mjs';
import { PATv } from './PATv.mjs';
import { PBLv } from './PBLv.mjs';
import { PRIv } from './PRIv.mjs';

/** Path */
export class PTHv extends BaseElement {
	fillOnTop = this.optional('FOTb') ?? false;
	brushPlacement = this.optional('BRPi') ?? 1;
	evenOddFillRule = this.optional('EOFb') ?? true;

	bezierPoints = this.required('PBLv', PBLv);
	//segmentedPoints = this.required('PCLv', PCLv);

	pattern = this.required('PATv', PATv);
	pathTemplated = this.optional('PTTi') ?? 0;
	randomSeed = this.optional('RNDi');
	textureOffset = { x: this.optional('TOXf') ?? 0, y: this.optional('TOYf') ?? 0 };
	fillPoint1 = { x: this.optional('PSXf') ?? 0, y: this.optional('PSYf') ?? 0 };
	fillPoint2 = { x: this.optional('PEXf') ?? this.fillPoint1.x, y: this.optional('PEYf') ?? this.fillPoint1.y };
	fillPoint3 = { x: this.optional('PFXf') ?? this.fillPoint1.x, y: this.optional('PFYf') ?? this.fillPoint1.y };
	primitive = this.optional('PRIv', PRIv);

	//PCFb = this.required('PCFb');
	//AGMb = this.optional('AGMb');
}
