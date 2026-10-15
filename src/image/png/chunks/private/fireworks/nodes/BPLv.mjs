import { MapNode } from './base/CoreNode.mjs';

/** Brush Property List */
export class BPLv extends MapNode {
	category = this.optional('CATs');
	internalName = this.optional('INMs');
	userFacingName = this.optional('UNMs');

	diameter = this.optional('BDIi') ?? 0;
	shape = this.optional('BSHi') ?? 1; // 0 = square, 1 = circle
	aspect = (this.optional('BASi') ?? 1000) * 0.001;
	angle = (this.optional('BANi') ?? 0) * Math.PI / 180;
	softEdges = (this.optional('BSEi') ?? 0) * 0.001;
	softEdgesFunction = this.optional('BSFi') ?? 0; // 0 = bell curve, 1 = linear
	blackness = (this.optional('BBKi') ?? 0) * 0.001;
	concentration = (this.optional('BCNi') ?? 0) * 0.001;
	edgeFunction = this.optional('BEFi') ?? 0; // 0 = none, 1 = white neon, 2 = harsh wet, 3 = smoth neon, 4 = wavy gravy, 5 = white neon edge
	isAntiAliased = this.optional('BIAb') ?? true;

	type = this.optional('BRTi') ?? 0; // 0 = natural, 1 = simple
	feedback = this.optional('BFBi') ?? 0; // 0 = none, 1 = brush, 2 = background
	flowRate = (this.optional('BFRi') ?? 1000) * 0.001;
	minSize = (this.optional('BMSi') ?? 0) * 0.001;
	spacing = (this.optional('BSPi') ?? 1000) * 0.001;

	textureBlend = (this.optional('BTBi') ?? 0) * 0.001;
	textureEdge = (this.optional('BTEi') ?? 0) * 0.001;

	numberOfDashes = this.optional('NDIi') ?? 0;
	dashOn1 = this.optional('DO1i') ?? 0;
	dashOn2 = this.optional('DO2i') ?? 0;
	dashOn3 = this.optional('DO3i') ?? 0;
	dashOff1 = this.optional('DF1i') ?? 0;
	dashOff2 = this.optional('DF2i') ?? 0;
	dashOff3 = this.optional('DF3i') ?? 0;

	maxTips = this.optional('BMMi') ?? Number.POSITIVE_INFINITY;
	numberOfTips = this.optional('BNTi') ?? 1;
	tipSpacing = this.optional('BTSi') ?? 0;
	tipSpacingMode = this.optional('BSMi') ?? 0; // 0 = random, 1 = diagonal, 2 = circular
	tipColouringMode = this.optional('BCMi') ?? 0; // 0 = random, 1 = uniform, 2 = complementary, 3 = hue, 4 = shadow

	sensitivityToPressureOnSize = (this.optional('SPZi') ?? 0) * 0.001;
	sensitivityToSpeedOnSize = (this.optional('SSZi') ?? 0) * 0.001;
	sensitivityToPressureOnOpacity = (this.optional('SPOi') ?? 0) * 0.001;
	sensitivityToSpeedOnOpacity = (this.optional('SSOi') ?? 0) * 0.001;
	sensitivityToPressureOnBlackness = (this.optional('SPBi') ?? 0) * 0.001;
	sensitivityToSpeedOnBlackness = (this.optional('SSBi') ?? 0) * 0.001;
	sensitivityToRandomOnSize = (this.optional('SRZi') ?? 0) * 0.001;
	sensitivityToRandomOnBlackness = (this.optional('SRBi') ?? 0) * 0.001;
	sensitivityToRandomOnHue = (this.optional('SRHi') ?? 0) * 0.001;
	sensitivityToRandomOnAngle = (this.optional('SRAi') ?? 0) * 0.001;
	sensitivityToRandomOnSaturation = (this.optional('SRSi') ?? 0) * 0.001;
	sensitivityToRandomOnScatter = (this.optional('SRRi') ?? 0) * 0.001;
	sensitivityToRandomOnOpacity = (this.optional('SROi') ?? 0) * 0.001;
	sensitivityToPressureOnScatter = (this.optional('SPRi') ?? 0) * 0.001;
	sensitivityToSpeedOnScatter = (this.optional('SSRi') ?? 0) * 0.001;
	sensitivityToPressureOnHue = (this.optional('SPHi') ?? 0) * 0.001;
	sensitivityToSpeedOnHue = (this.optional('SSHi') ?? 0) * 0.001;
	sensitivityToSpeedOnAngle = (this.optional('SSAi') ?? 0) * 0.001;
	sensitivityToHorizontalOnSize = (this.optional('SHZi') ?? 0) * 0.001;
	sensitivityToVerticalOnSize = (this.optional('SVZi') ?? 0) * 0.001;
	sensitivityToPressureOnAngle = (this.optional('SPAi') ?? 0) * 0.001;
	sensitivityToHorizontalOnAngle = (this.optional('SHAi') ?? 0) * 0.001;
	sensitivityToVerticalOnAngle = (this.optional('SVAi') ?? 0) * 0.001;
	sensitivityToHorizontalOnOpacity = (this.optional('SHOi') ?? 0) * 0.001;
	sensitivityToVerticalOnOpacity = (this.optional('SVOi') ?? 0) * 0.001;
	sensitivityToHorizontalOnScatter = (this.optional('SHRi') ?? 0) * 0.001;
	sensitivityToVerticalOnScatter = (this.optional('SVRi') ?? 0) * 0.001;
	sensitivityToHorizontalOnHue = (this.optional('SHHi') ?? 0) * 0.001;
	sensitivityToVerticalOnHue = (this.optional('SVHi') ?? 0) * 0.001;
	sensitivityToPressureOnLightness = (this.optional('SPLi') ?? 0) * 0.001;
	sensitivityToSpeedOnLightness = (this.optional('SSLi') ?? 0) * 0.001;
	sensitivityToHorizontalOnLightness = (this.optional('SHLi') ?? 0) * 0.001;
	sensitivityToVerticalOnLightness = (this.optional('SVLi') ?? 0) * 0.001;
	sensitivityToRandomOnLightness = (this.optional('SRLi') ?? 0) * 0.001;
	sensitivityToPressureOnSaturation = (this.optional('SPSi') ?? 0) * 0.001;
	sensitivityToSpeedOnSaturation = (this.optional('SSSi') ?? 0) * 0.001;
	sensitivityToHorizontalOnSaturation = (this.optional('SHSi') ?? 0) * 0.001;
	sensitivityToVerticalOnSaturation = (this.optional('SVSi') ?? 0) * 0.001;
	sensitivityToHorizontalOnBlackness = (this.optional('SHBi') ?? 0) * 0.001;
	sensitivityToVerticalOnBlackness = (this.optional('SVBi') ?? 0) * 0.001;

	get dashArray() {
		return [
			this.dashOn1, this.dashOff1,
			this.dashOn2, this.dashOff2,
			this.dashOn3, this.dashOff3,
		].slice(0, this.numberOfDashes * 2);
	}

	//BBLi = this.required('BBLi');
	//RDOb = this.required('RDOb');
}
