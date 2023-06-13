import { XYZ65_to_LAB, sRGB_to_XYZ65 } from './colour.mjs';
import 'lean-test';

describe('XYZ65_to_LAB', () => {
  it('converts known colours', () => {
    const black = sRGB_to_XYZ65([1, 0, 0, 0]);
    expect(XYZ65_to_LAB(black)).equals([1, 0, 0, 0]);

    const white = sRGB_to_XYZ65([1, 1, 1, 1]);
    expect(XYZ65_to_LAB(white)).equals([1, 1, 0, 0]);

    // test value from matlab docs: https://www.mathworks.com/help/images/ref/xyz2lab.html
    expect(XYZ65_to_LAB([1, 0.25, 0.40, 0.10])).isListOf(
      1,
      isNear(0.6947, { decimalPlaces: 3 }),
      isNear(-0.4804, { decimalPlaces: 3 }),
      isNear(0.5713, { decimalPlaces: 3 }),
    );
  });
});
