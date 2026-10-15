export class Colour {
	/** @type {number} */ r;
	/** @type {number} */ g;
	/** @type {number} */ b;
	/** @type {number} */ a;

	/**
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @param {number} a
	 */
	constructor(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	static TRANSPARENT = new Colour(0, 0, 0, 0);

	get rgb24() {
		return (this.r << 16) | (this.g << 8) | this.b;
	}

	get rgba32() {
		return ((this.r << 24) | (this.g << 16) | (this.b << 8) | this.a) >>> 0;
	}

	get argb32() {
		return ((this.a << 24) | (this.r << 16) | (this.g << 8) | this.b) >>> 0;
	}

	/** @param {number} a */
	withAlpha(a) {
		return new Colour(this.r, this.g, this.b, a);
	}

	toCSS() {
		return `#${this.rgba32.toString(16).padStart(8, '0')}`;
	}

	toString() {
		return this.toCSS();
	}
}

export class ColourABGR extends Colour {
	/** @param {number} value */
	constructor(value) {
		super(
			value & 0xff,
			(value >>> 8) & 0xff,
			(value >>> 16) & 0xff,
			value >>> 24,
		);
	}
}

export class ColourARGB extends Colour {
	/** @param {number} value */
	constructor(value) {
		super(
			(value >>> 16) & 0xff,
			(value >>> 8) & 0xff,
			value & 0xff,
			value >>> 24,
		);
	}
}

export class ColourRGBA extends Colour {
	/** @param {number} value */
	constructor(value) {
		super(
			value >>> 24,
			(value >>> 16) & 0xff,
			(value >>> 8) & 0xff,
			value & 0xff,
		);
	}
}

export class ColourBGRA extends Colour {
	/** @param {number} value */
	constructor(value) {
		super(
			(value >>> 8) & 0xff,
			(value >>> 16) & 0xff,
			value >>> 24,
			value & 0xff,
		);
	}
}

/**
 * @param {Colour} c1
 * @param {Colour} c2
 * @param {number} f
 * @return {Colour}
 */
export const mixColourSRGB = (c1, c2, f) => {
  return new Colour(
		Math.round((1 - f) * c1.r + f * c2.r),
		Math.round((1 - f) * c1.g + f * c2.g),
		Math.round((1 - f) * c1.b + f * c2.b),
		Math.round((1 - f) * c1.a + f * c2.a),
	);
};
