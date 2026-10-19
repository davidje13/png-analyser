/** @param {number} x */
export function erf(x) {
	const s = Math.sign(x);
	x = Math.abs(x);

	// thanks, https://en.wikipedia.org/wiki/Error_function#Approximation_with_elementary_functions

	const t = 1 / (1 + x * (ERR_P1 + x * ERR_P2));
	let tN = t;
	let sum = 0;
	for (const a of ERR_A) {
		sum += tN * a;
		tN *= t;
	}
	return s * (1 - sum * Math.exp(-x * x));
}

/** @param {number} x */
export function ierf(x) {
	// thanks, https://en.wikipedia.org/wiki/Error_function#Approximation_with_elementary_functions

	if (x <= -1) {
		return Number.NEGATIVE_INFINITY;
	}
	if (x >= 1) {
		return Number.POSITIVE_INFINITY;
	}
	const l = Math.log(1 - x * x) * 0.5;
	const ld = IERFA2PI + l;
	return Math.sign(x) * Math.sqrt(Math.sqrt(ld * ld - l * IERFA2) - ld);
}

const IERFA2 = 2 * ((3 * Math.PI * (4 - Math.PI)) / (8 * (Math.PI - 3)));
const IERFA2PI = IERFA2 / Math.PI;

const ERR_A = [
	0.316879890481381, -0.138329314150635, 1.08680830347054, -1.11694155120396,
	1.20644903073232, -0.393127715207728, 0.0382613542530727,
];
const ERR_P1 = 0.406742016006509;
const ERR_P2 = 0.0072279182302319;

/**
 * @param {number} a
 * @param {number} b
 */
export function lcm(a, b) {
	return a * (b / gcd(a, b));
}

/**
 * @param {number} a
 * @param {number} b
 */
export function gcd(a, b) {
	while (b) {
		[a, b] = [b, a % b];
	}
	return a;
}
