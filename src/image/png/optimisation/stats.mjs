export const NONE = -1;
export const MULTI = -2;

/**
 * @typedef {{
 *   colours: Map<number, number>;
 *   transparentColour: number;
 *   needsAlpha: boolean;
 *   allGreyscale: boolean;
 *   preserveTransparentColour: boolean;
 *   allowMatteTransparency: boolean;
 * }} Stats
 */

/**
 * @param {number[][]} image
 * @param {boolean} preserveTransparentColour
 * @param {boolean} allowMatteTransparency
 * @return {Stats}
 */
export function getImageStats(image, preserveTransparentColour, allowMatteTransparency) {
  /** @type {Map<number, number>} */ const colours = new Map();
  let transparentColour = NONE;
  let needsAlpha = false;
  let allGreyscale = true;
  for (const row of image) {
    for (const c of row) {
      const alpha = c >>> 24;
      const key = (preserveTransparentColour || alpha) ? c : 0;
      colours.set(key, (colours.get(key) ?? 0) + 1);
      if (!alpha) {
        if (transparentColour === NONE) {
          transparentColour = c;
        } else if (transparentColour !== c) {
          transparentColour = MULTI;
        }
      }
      if (alpha !== 255 && alpha !== 0) {
        needsAlpha = true;
      }
      if (allGreyscale && (preserveTransparentColour || alpha)) {
        const red = (c >>> 16) & 0xFF;
        const green = (c >>> 8) & 0xFF;
        const blue = c & 0xFF;
        if (red !== green || green !== blue) {
          allGreyscale = false;
        }
      }
    }
  }
  if (!needsAlpha && preserveTransparentColour) {
    if (transparentColour === MULTI || (transparentColour !== NONE && colours.has((transparentColour | 0xFF000000) >>> 0))) {
      needsAlpha = true;
    }
  }
  if (!allowMatteTransparency && transparentColour !== NONE) {
    needsAlpha = true;
  }
  return { colours, transparentColour, needsAlpha, allGreyscale, preserveTransparentColour, allowMatteTransparency };
}
