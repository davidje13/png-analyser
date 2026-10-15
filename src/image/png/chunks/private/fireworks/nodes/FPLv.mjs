import { Colour } from './base/ColourNode.mjs';
import { MapNode } from './base/CoreNode.mjs';
import { FD1i, FD2i, FD3i, FD4i } from './colours.mjs';
import { FGLv } from './FGLv.mjs';
import { FPTv } from './FPTv.mjs';

/** Fill Pattern Properties */
export class FPLv extends MapNode {
	category = this.optional('CATs');
	internalName = this.optional('INMs');
	userFacingName = this.optional('UNMs');
	textureBlend = (this.optional('FTBi') ?? 0) * 0.001;
	feather = this.optional('FEFi') ?? 0;
	stampingMode = this.optional('FSMi') ?? 0; // 0 = transparent / blend, 1 = white / blend opaque
	hardEdge = this.optional('FETi') === 0;
	shape = this.optional('FSXi') ?? this.optional('FSHi') ?? 0;
	gradient = this.optional('FGLv', FGLv);
	ditherColour1 = this.optional('FD1i', FD1i) ?? Colour.TRANSPARENT;
	ditherColour2 = this.optional('FD2i', FD2i) ?? Colour.TRANSPARENT;
	ditherColour3 = this.optional('FD3i', FD3i) ?? Colour.TRANSPARENT;
	ditherColour4 = this.optional('FD4i', FD4i) ?? Colour.TRANSPARENT;
	ditherTransparent = this.optional('FDTb') ?? false;
	patternTile = this.optional('FPTv', FPTv);

	//FRDb = this.required('FRDb');
	//RDOb = this.required('RDOb');
	//FRRi = this.required('FRRi');
}
