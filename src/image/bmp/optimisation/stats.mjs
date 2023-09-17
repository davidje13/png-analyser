/**
 * @param {number[][]} image
 * @param {boolean} preserveTransparentColour
 * @param {boolean} hasAndMask
 */
export function getImageStats(image, preserveTransparentColour, hasAndMask) {
  let needsTrans = false;
  let needsAlpha = false;
  outer: for (const row of image) {
    for (const c of row) {
      const alpha = c >>> 24;
      if (alpha !== 255) {
        needsTrans = true;
        if (alpha !== 0) {
          needsAlpha = true;
          break outer;
        }
      }
    }
  }
  const noTrans = hasAndMask && !needsAlpha;

  const colours = new Set();
  outer: for (const row of image) {
    for (const c of row) {
      const alpha = c >>> 24;
      const norm = (preserveTransparentColour || alpha) ? c : 0;
      colours.add(noTrans ? (norm | 0xFF000000) >>> 0 : norm);
      if (colours.size > 256) {
        break outer;
      }
    }
  }
  return { colours, needsTrans, needsAlpha };
}
