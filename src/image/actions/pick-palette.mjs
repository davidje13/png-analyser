/** @type {('a'|'r'|'g'|'b')[]} */ const CHANNELS = ['a', 'r', 'g', 'b'];

// target:
// - always include extremes
//   - all input colours must be within the convex hull formed by the output colours (for target palette sizes < 9 this may not be possible in all cases)
//   - in 1D this is easy: include max & min
//   - in 2D+ this could mean including colours which are not in the original image
// - the RGB value of "transparent" is irrelevant (and relevance of RGB decreases as the colour approaches transparent)
//   - effectively means look at "premultiplied alpha" space, but also need to scale differences by alpha
// - errors have different "costs" depending on how "flat" the colour is
//   - dithering shows up more obviously in large areas of flat or slowly changing colour
//   - take abs(c5-c2)+abs(c5-c4)+abs(c5-c6)+abs(c5-c8) as the relative "flatness" (0 = flat, 4*range = steep)
//   - extracted into scoreFlatness (passed through as weights here)
// - be invariant to:
//   - image scale (e.g. pixel count / total area, distance / sqrt(total area))
//   - number of colours / bit depth in source palette (e.g. cumulative distribution)
// - never produce duplicate palette entries
// - minimise sum(min(delta) * flatness cost)
//   - can precompute sum(flatness cost) for each colour value
//   - in 1D: can calculate cumulative histogram of this to speed up search

const ALPHA_FRAC = 1;
const RGB_FRAC = 1;
const COUNT_FRAC = 50;

/**
 * @param {number[][]} image
 * @param {number[][]} weights - use scoreFlatness(image)
 * @param {number} maxEntries
 * @return {number[]}
 */
export function pickPalette(image, weights, maxEntries) {
  const colours = getImagePaletteStats(image, weights);
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
  if (isAllGreyscale(colours.keys()) && stats.a.singular) {
    const alpha = stats.a.max;
    return distribute1D(histogram.r, maxEntries).map((l) => argb(alpha, l, l, l)).sort(niceColourOrder);
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
        }).sort(niceColourOrder);
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

  //// blur count a little into nearby colours so that colours within smooth gradients are favoured over random outliers
  //// - removed: turns out to be slow and gives poor results
  ///** @type {RGBABuckets<Col>} */ const buckets = new RGBABuckets(16);
  //for (const col of remainingColours) {
  //  buckets.add(col.c, col);
  //}
  //buckets.runNearby(1, (a, b) => {
  //  const dr = a.c.r - b.c.r;
  //  const dg = a.c.g - b.c.g;
  //  const db = a.c.b - b.c.b;
  //  const da = a.c.a - b.c.a;
  //  const d = Math.sqrt(dr * dr + dg * dg + db * db + da * da);
  //  a.blurCount += b.count / (d + 1);
  //});
  //for (const col of remainingColours) {
  //  col.score = ALPHA_FRAC + RGB_FRAC + col.count * countNorm;
  //}

  let remaining = maxEntries;

  /** @type {number[]} */ const r = [];
  /** @type {(col: Col) => void} */
  const addCol = (col) => {
    r.push(argb(col.c.a, col.c.r, col.c.g, col.c.b));
    --remaining;
    for (let i = 0, e = remainingColours.length, del = false; i < e; ++i) {
      const v = remainingColours[i];
      if (v === col) {
        del = true;
      } else {
        const da = v.c.a - col.c.a;
        const dr = v.c.r - col.c.r;
        const dg = v.c.g - col.c.g;
        const db = v.c.b - col.c.b;
        v.score = Math.min(v.score,
          Math.abs(da) * alphaNorm +
          Math.sqrt(dr * dr + dg * dg + db * db) * Math.min(v.c.a, col.c.a) * colourNorm +
          v.count * countNorm,
        );
        if (del) {
          remainingColours[i - 1] = v;
        }
      }
    }
    --remainingColours.length;
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
 * @return {number[]}
 */
function distribute1D(histogram, maxEntries) {
  const { min, max } = getHistogramStats(histogram);
  /** @type {number[]} */ const cumulative = [];
  let n = 0;
  for (const v of histogram) {
    n += v;
    cumulative.push(n);
  }
  const output = [{ value: min, done: true }, { value: max, done: true }];
  function findOptimalPosition() {
    let index = 1;
    let lower = output[index - 1].value;
    let upper = output[index].value;
    let score = 0;
    let best = { index: 0, value: 0, score: -1, count: 0 };
    for (let v = min + 1; v < max; ++v) {
      const pos = v - 1;
      score += cumulative[(pos + lower) >>> 1] + cumulative[(pos + upper) >>> 1] - cumulative[pos] * 2;
      if (score > best.score || (score === best.score && histogram[v] > best.count)) {
        best = { index, value: v, score, count: histogram[v] };
      }
      if (v === upper) {
        lower = upper;
        upper = output[++index].value;
      }
    }
    return best;
  }
  for (let i = 2; i < maxEntries; ++i) {
    const best = findOptimalPosition();
    output.splice(best.index, 0, { value: best.value, done: true });
  }
  if (maxEntries < 4) {
    return output.map(({ value }) => value);
  }
  for (let iteration = 0; iteration < 4; ++iteration) { // 1-3 iterations are normally enough to reach the optimal palette
    for (const o of output) {
      o.done = false;
    }
    let changed = false;
    for (let i = 1; i < maxEntries - 1;) {
      if (output[i].done) {
        ++i;
        continue;
      }
      const current = output.splice(i, 1)[0];
      const updated = findOptimalPosition();
      output.splice(updated.index, 0, { value: updated.value, done: true });
      if (updated.index <= i) {
        ++i;
      }
      changed ||= updated.value !== current.value;
    }
    if (!changed) {
      break;
    }
  }
  return output.map(({ value }) => value);
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
    // put transparent colours first so that tRNS PNG chunk can omit solid colours
    return a.a - b.a;
  }
  // sort by luminosity (having similar colours nearby can improve compression)
  const la = a.r + a.g + a.b;
  const lb = b.r + b.g + b.b;
  if (la !== lb) {
    return la - lb;
  }
  return c1 - c2;
}

/**
 * @param {number[][]} image
 * @param {number[][]} weights
 */
function getImagePaletteStats(image, weights) {
  /** @type {Map<number, number>} */ const colours = new Map();
  const h = image.length;
  if (!h) {
    return colours;
  }
  const w = image[0].length;
  for (let y = 0; y < h; ++y) {
    const row = image[y];
    const weightRow = weights[y] ?? [];
    for (let x = 0; x < w; ++x) {
      const c = row[x];
      const weight = weightRow[x] ?? 1;
      const key = (c >>> 24) ? c : 0;
      colours.set(key, (colours.get(key) ?? 0) + weight);
    }
  }
  return colours;
}

/**
 * @param {Iterable<number>} colours
 */
function isAllGreyscale(colours) {
  for (const c of colours) {
    const alpha = c >>> 24;
    if (alpha) {
      const red = (c >>> 16) & 0xFF;
      const green = (c >>> 8) & 0xFF;
      const blue = c & 0xFF;
      if (red !== green || green !== blue) {
        return false;
      }
    }
  }
  return true;
}
