const MIN_WEIGHT = 0.001;
const OUTSIDE = { r: 0, g: 0, b: 0, a: 0 };
/** @type {{ r: number, g: number, b: number, a: number }[]} */const BLANK_ROW = [];

/**
 * @param {number[][]} image
 * @return {number[][]}
 */
export function scoreFlatness(image, penalty = 1) {
  /** @type {number[][]} */ const weights = [];
	const argbs = image.map((row) => row.map(splitARGB));
  const h = argbs.length;
  if (!h) {
    return weights;
  }
	const maxA = 255;
  const distNorm = penalty / (maxA * maxA * 4);
  const w = argbs[0].length;
  for (let y = 0; y < h; ++y) {
    const row = argbs[y];
    const r2 = argbs[y - 1] ?? BLANK_ROW;
    const r8 = argbs[y + 1] ?? BLANK_ROW;
		/** @type {number[]} */ const rowOut = [];
    for (let x = 0; x < w; ++x) {
      const c2 = r2[x] ?? OUTSIDE;
      const c4 = row[x - 1] ?? OUTSIDE;
      const c6 = row[x + 1] ?? OUTSIDE;
      const c8 = r8[x] ?? OUTSIDE;
      const c5 = row[x];

      const d2 = getDistance(c2, c5, maxA);
      const d4 = getDistance(c4, c5, maxA);
      const d6 = getDistance(c6, c5, maxA);
      const d8 = getDistance(c8, c5, maxA);

			rowOut.push(Math.max(MIN_WEIGHT, 1 - (d2 + d4 + d6 + d8) * distNorm));
    }
		weights.push(rowOut);
  }
  return weights;
}

/**
 * @param {{ a: number, r: number, g: number, b: number }} c1
 * @param {{ a: number, r: number, g: number, b: number }} c2
 * @param {number} maxA
 */
function getDistance(c1, c2, maxA) {
  return Math.max(
		Math.max(
			Math.abs(c1.r - c2.r),
			Math.abs(c1.g - c2.g),
			Math.abs(c1.b - c2.b),
		) * Math.min(c1.a, c2.a),
    Math.abs(c1.a - c2.a) * maxA,
  );
}

/**
 * @param {number} col
 */
function splitARGB(col) {
  return {
    a: col >>> 24,
    r: (col >>> 16) & 0xFF,
    g: (col >>> 8) & 0xFF,
    b: col & 0xFF,
  };
}
