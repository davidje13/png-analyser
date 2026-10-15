import { MapNode } from './base/CoreNode.mjs';

/** Matrix */
export class MTXv extends MapNode {
	matrix = [
		this.optional('M00f') ?? 1, this.optional('M01f') ?? 0, this.optional('M02f') ?? 0,
		this.optional('M10f') ?? 0, this.optional('M11f') ?? 1, this.optional('M12f') ?? 0,
		this.optional('M20f') ?? 0, this.optional('M21f') ?? 0, this.optional('M22f') ?? 1,
	];

	static IDENTITY = new MTXv([]);

	toString() {
		return [
      '3x3 Matrix:',
      `${fmt(this.matrix[0])} ${fmt(this.matrix[1])} ${fmt(this.matrix[2])}`,
      `${fmt(this.matrix[3])} ${fmt(this.matrix[4])} ${fmt(this.matrix[5])}`,
      `${fmt(this.matrix[6])} ${fmt(this.matrix[7])} ${fmt(this.matrix[8])}`,
    ].join('\n');
	}

	get approximateScale() {
		return Math.pow(
			(this.matrix[0] * this.matrix[0] + this.matrix[3] * this.matrix[3]) *
			(this.matrix[1] * this.matrix[1] + this.matrix[4] * this.matrix[4]),
			0.25,
		) / this.matrix[8];
	}

	toCSS() {
		const cssMat = [
			this.matrix[0], this.matrix[1], 0, this.matrix[2],
			this.matrix[3], this.matrix[4], 0, this.matrix[5],
			0, 0, 1, 0,
			this.matrix[6], this.matrix[7], 0, this.matrix[8],
		];
		return `matrix3d(${cssMat.join(',')})`;
	}
}

/** @param {number} v */
const fmt = (v) => v.toFixed(5).padStart(10, ' ');
