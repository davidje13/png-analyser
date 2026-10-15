import { Colour } from './base/ColourNode.mjs';
import { BaseElement } from './IMGv.mjs';
import { MTXv } from './MTXv.mjs';
import { PATv } from './PATv.mjs';
import { TAPv } from './TAPv.mjs';
import { TFSv } from './TFSv.mjs';

/**
 * @typedef {{
 *   fillColour: Colour;
 *   font: string;
 *   pointSize: number;
 *   bold: boolean;
 *   italic: boolean;
 *   underline: boolean;
 *   horizontalScale: number;
 *   autoKern: boolean;
 *   kerning: number;
 *   baselineShift: number;
 *   lineHeight: number;
 *   lineHeightUnit: number;
 *   justification: number;
 *   paragraphIndent: number;
 *   paragraphSpaceBefore: number;
 *   paragraphSpaceAfter: number;
 * }} Formatting
 * @typedef {{ text: string } & Formatting} FormattedStringFragment
 */

/** Text */
export class TXTv extends BaseElement {
	left = this.required('LFTf');
	top = this.required('TOPf');
	right = this.required('RITf');
	bottom = this.required('BOTf');
	leftAnchor = this.optional('LFAf');
	transformMatrix = this.optional('MTXv', MTXv);
	bounds = this.optional('BOAf');
	autoEnlarge = this.optional('ATEb') ?? false;

	pattern = this.required('PATv', PATv);
	fillOnTop = this.optional('FOTb') ?? false;
	textureOffset = { x: this.optional('TOXf') ?? 0, y: this.optional('TOYf') ?? 0 };
	fillPoint1 = { x: this.optional('PSXf') ?? 0, y: this.optional('PSYf') ?? 0 };
	fillPoint2 = { x: this.optional('PEXf') ?? 0, y: this.optional('PEYf') ?? 0 };
	fillPoint3 = { x: this.optional('PFXf') ?? 0, y: this.optional('PFYf') ?? 0 };
	brushPlacement = this.optional('BRPi') ?? 1;

	textAntiAlias = this.optional('TAAi') ?? 0; // 0 = smooth/none, 1 = crisp, 2 = strong, 3 = system, 4 = custom
	textAntiAliasingSharpness = this.optional('TA1i');
	textAntiAliasingStrength = this.optional('TA2i');
	textAntiAliasingSamples = this.optional('TOSi');

	flow = this.optional('TFTi'); // 0 = no path, 2 = follow path, 3 = fit within fill
	path = this.optional('TAPv', TAPv);
	orientation = this.optional('ORIi') ?? 0;

	//fontTypeface = this.optional('CFTs');

	randomSeed = this.optional('RNDi');

	formattedString = (() => {
		/** @type {Formatting} */ const fontState = {
			fillColour: this.pattern.fillColour,
			font: this.optional('FONs') ?? 'sans-serif',
			pointSize: this.optional('PTSf') ?? 12,
			bold: this.optional('BOLb') ?? false,
			italic: this.optional('ITLb') ?? false,
			underline: this.optional('UNDb') ?? false,
			horizontalScale: this.optional('HSCf') ?? 1,
			autoKern: this.optional('ATKb') ?? true,
			kerning: this.optional('RKNf') ?? 0,
			baselineShift: this.optional('BLSf') ?? 0,
			lineHeight: this.optional('LEDf') ?? 1,
			lineHeightUnit: this.optional('LDMi') ?? 0, // 0 = em, 1 = px
			justification: this.optional('JSTi') ?? 0, // 0 = left, 1 = center, 2 = right, 3 = justify
			paragraphIndent: this.optional('PINf') ?? 0,
			paragraphSpaceBefore: this.optional('PSBf') ?? 0,
			paragraphSpaceAfter: this.optional('PSAf') ?? 0,
		};

		/** @type {FormattedStringFragment[]} */ const strings = [];
		for (const { type, value } of this.required('TFSv', TFSv)) {
			switch (type) {
				case 'FCLi': fontState.fillColour = value; break;
				case 'FONs': fontState.font = value; break;
				case 'PTSf': fontState.pointSize = value; break;
				case 'BOLb': fontState.bold = value; break;
				case 'ITLb': fontState.italic = value; break;
				case 'UNDb': fontState.underline = value; break;
				case 'HSCf': fontState.horizontalScale = value ?? 1; break;
				case 'RKNf': fontState.kerning = value ?? 0; break;
				case 'BLSf': fontState.baselineShift = value; break;
				case 'LEDf': fontState.lineHeight = value ?? 1; break;
				case 'LDMi': fontState.lineHeightUnit = value; break;
				case 'JSTi': fontState.justification = value; break;
				case 'PINf': fontState.paragraphIndent = value; break;
				case 'PSBf': fontState.paragraphSpaceBefore = value; break;
				case 'PSAf': fontState.paragraphSpaceAfter = value; break;
				case 'TRNs':
					strings.push({ text: value.replace(/\r/g, '\n'), ...fontState });
					break;
			}
		}
		return strings;
	})();

	//pathTemplated = this.required('PTTi');
	//FOAb = this.optional('FOAb');
	//KRNf = this.required('KRNf');
	//PCFb = this.optional('PCFb');
	//RIAf = this.optional('RIAf');
	//TOAf = this.optional('TOAf');
	//XFMi = this.required('XFMi');
}
