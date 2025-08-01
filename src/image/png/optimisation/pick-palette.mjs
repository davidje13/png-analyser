/** @type {('a'|'r'|'g'|'b')[]} */ const CHANNELS = ['a', 'r', 'g', 'b'];

const ALPHA_FRAC = 1;
const RGB_FRAC = 1;
const COUNT_FRAC = 20;

/**
 * @param {number[][]} image
 * @param {import('./stats.mjs').Stats} stats
 * @param {number} maxEntries
 * @return {number[]}
 */
export function pickPalette(image, { colours, allGreyscale, allowMatteTransparency }, maxEntries) {
  if (allowMatteTransparency) {
    throw new Error('Cannot pick palette using stats with matte transparency');
  }
  if (colours.size <= maxEntries) {
    return [...colours.keys()].sort(niceColourOrder);
  }
  if (maxEntries <= 0) {
    return [];
  }
  if (maxEntries === 1) {
    return [weightedAverageARGB(colours)];
  }

  const histogram = makeARGBHistograms(colours);

  const stats = Object.fromEntries(CHANNELS.map((c) => [c, getHistogramStats(histogram[c])]));

  // grayscale
  if (allGreyscale && stats.a.singular) {
    const alpha = stats.a.max;
    return distribute1D(histogram.r, maxEntries).map((l) => argb(alpha, l, l, l));
  }

  const channelCount = CHANNELS.map((c) => Number(stats[c].singular ? 0 : 1)).reduce((a, b) => a + b, 0);

  // single channel
  if (channelCount === 1) {
    /** @type {[number, number, number, number]} */ const base = [stats.a.max, stats.r.max, stats.g.max, stats.b.max];
    for (let i = 0; i < CHANNELS.length; ++i) {
      const c = CHANNELS[i];
      if (!stats[c].singular) {
        return distribute1D(histogram[c], maxEntries).map((v) => {
          base[i] = v;
          return argb(...base);
        });
      }
    }
  }

  /** @typedef {{ c: { a: number, r: number, g: number, b: number }, count: number, score: number }} Col */

  const alphaNorm = ALPHA_FRAC / 255;
  const colourNorm = RGB_FRAC / Math.sqrt(255 * 255 * 3) / 255;
  const countNorm = COUNT_FRAC / histogram.sum;

  /** @type {Col[]} */ const remainingColours = [];
  /** @type {Map<number, Col>} */ const lookup = new Map();
  for (const [col, count] of colours) {
    const entity = { c: splitARGB(col), count, score: ALPHA_FRAC + RGB_FRAC + count * countNorm };
    remainingColours.push(entity);
    lookup.set(col, entity);
  }
  let remaining = maxEntries;
  let remainingSum = histogram.sum;

  /** @type {number[]} */ const r = [];
  /** @type {(col: Col) => void} */
  const addCol = (col) => {
    r.push(argb(col.c.a, col.c.r, col.c.g, col.c.b));
    remainingSum -= col.count;
    --remaining;
    col.count = 0;
    col.score = 0;
    for (const v of remainingColours) {
      if (!v.score) {
        continue;
      }
      const da = v.c.a - col.c.a;
      const dr = v.c.r - col.c.r;
      const dg = v.c.g - col.c.g;
      const db = v.c.b - col.c.b;
      v.score = Math.min(v.score,
        Math.abs(da) * alphaNorm +
        Math.sqrt(dr * dr + dg * dg + db * db) * Math.min(v.c.a, col.c.a) * colourNorm +
        v.count * countNorm,
      );
    }
  };

  // if any part of the image is transparent, ensure we keep it
  const transparent = lookup.get(0);
  if (transparent) {
    addCol(transparent);
  }

  // keep finding colour which is greatest distance from current colours
  while (remaining > 0) {
    /** @type {Col | null} */ let best = null;
    for (const col of remainingColours) {
      if (best === null || col.score > best.score) {
        best = col;
      }
    }
    if (!best) {
      break;
    }
    addCol(best);
  }
  return r.sort(niceColourOrder);
}

/**
 * @param {Map<number, number>} colours
 */
function makeARGBHistograms(colours) {
  const histogramA = make0(256);
  const histogramR = make0(256);
  const histogramG = make0(256);
  const histogramB = make0(256);
  let sum = 0;
  let count = 0;
  for (const [col, n] of colours) {
    const c = splitARGB(col);
    histogramA[c.a] += n;
    histogramR[c.r] += n * c.a;
    histogramG[c.g] += n * c.a;
    histogramB[c.b] += n * c.a;
    sum += n;
    ++count;
  }
  return { a: histogramA, r: histogramR, g: histogramG, b: histogramB, sum, count };
}

/**
 * @param {number} size
 * @return {number[]}
 */
function make0(size) {
  const r = [];
  for (let i = 0; i < size; ++i) {
    r.push(0);
  }
  return r;
}

/**
 * @param {number[]} histogram
 */
function getHistogramStats(histogram) {
  let count = 0;
  let sum = 0;
  let min = -1;
  let max = 0;
  for (let i = 0; i < histogram.length; ++i) {
    if (histogram[i] > 0) {
      ++count;
      sum += histogram[i];
      max = i;
      if (min === -1) {
        min = i;
      }
    }
  }
  return { count, sum, min, max, singular: count === 1 };
}

/**
 * @param {number[]} histogram
 * @param {number} maxEntries
 * @param {boolean} includeStart
 * @param {boolean} includeEnd
 * @return {number[]}
 */
function distribute1DSimple(histogram, maxEntries, includeStart, includeEnd) {
  if (maxEntries === 0) {
    return [];
  }

  const { sum, min, max } = getHistogramStats(histogram);

  // evenly allocate all space according to frequency of use
  // note: this can result in duplicates, proportional to the frequency of the colour
  const r = [];
  const evenStep = sum / (maxEntries + 1 - Number(includeStart) - Number(includeEnd));
  let next = includeStart ? 0 : evenStep;
  for (let i = min, p = 0; i <= max; ++i) {
    p += histogram[i];
    while (p > next && r.length < maxEntries) {
      r.push(i);
      next += evenStep;
    }
  }
  // due to numerical precision, we cannot be sure if the last entry has been added or not, so check
  if (includeEnd && r.length < maxEntries) {
    r.push(max);
  }

  return r;
}

/**
 * @param {number[]} histogram
 * @param {number} maxEntries
 * @return {number[]}
 */
function distribute1D(histogram, maxEntries) {
  if (maxEntries < 2) {
    return distribute1DSimple(histogram, maxEntries, false, false);
  }

  let { count, sum, min, max } = getHistogramStats(histogram);

  const r = [];
  if (count <= maxEntries) {
    // enough spaces for everything; no need to quantise at all
    for (let i = 0; i < histogram.length; ++i) {
      if (histogram[i] > 0) {
        r.push(i);
      }
    }
    return r;
  }

  const h = [...histogram];
  // first and last must always be included, else dither pattern can bleed
  r.push(min, max);
  sum -= h[min];
  sum -= h[max];
  h[min] = 0;
  h[max] = 0;

  // if values far outweigh others (to the point where they would be included multiple times),
  // add them early and redistribute the remaining space
  let remaining = maxEntries - 2;
  while (remaining > 0) {
    let changed = false;
    const evenStep = sum / (remaining + 1);
    for (let i = 0; i < h.length; ++i) {
      if (h[i] > evenStep) {
        r.push(i);
        sum -= h[i];
        --remaining;
        h[i] = 0;
        changed = true;
        if (!remaining) {
          break;
        }
      }
    }
    if (!changed) {
      break;
    }
  }

  // evenly allocate remaining space according to frequency of use
  r.push(...distribute1DSimple(h, remaining, false, false));
  return r.sort(niceColourOrder);
}

/**
 * @param {Map<number, number>} colours
 * @return {number}
 */
function weightedAverageARGB(colours) {
  let a = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  let an = 0;
  let cn = 0;
  for (const [col, weight] of colours) {
    const c = splitARGB(col);
    a += c.a * weight;
    r += c.r * c.a * weight;
    g += c.g * c.a * weight;
    b += c.b * c.a * weight;
    an += weight;
    cn += weight * c.a;
  }
  if (an === 0 || cn === 0) {
    return 0; // no colours, or all were fully transparent
  }
  return argb(a / an, r / cn, g / cn, b / cn);
}

/**
 * @param {number} a
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @return {number}
 */
function argb(a, r, g, b) {
  return ((Math.round(a) << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)) >>> 0;
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

/**
 * @param {number} c1
 * @param {number} c2
 */
function niceColourOrder(c1, c2) {
  const a = splitARGB(c1);
  const b = splitARGB(c2);
  if (a.a !== b.a) {
    return a.a - b.a;
  }
  const la = a.r + a.g + a.b;
  const lb = b.r + b.g + b.b;
  if (la !== lb) {
    return la - lb;
  }
  return c1 - c2;
}
