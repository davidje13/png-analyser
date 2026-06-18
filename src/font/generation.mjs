/**
 * @typedef {import('../image/actions/vectorise.mjs').Point} Point
 * @typedef {import('./cff/cff_glyph.mjs').Instruction} Instruction
 */

/**
 * @template {unknown} TIn
 * @template {unknown} TOut
 * @param {TIn[][]} bitmap
 * @param {TIn} value
 * @param {TOut} resultOn
 * @param {TOut} resultOff
 * @return {TOut[][]}
 */
export function extractValue(bitmap, value, resultOn, resultOff) {
  return bitmap.map((ln) => ln.map((v) => v === value ? resultOn : resultOff));
}

/**
 * @template {unknown} T
 * @param {T[][]} bitmap1
 * @param {T[][]} bitmap2
 * @return {T[][]}
 */
export function bitmapOr(bitmap1, bitmap2) {
  if (bitmap2.length !== bitmap1.length) {
    throw new Error('size mismatch');
  }
  if (!bitmap1.length) {
    return [];
  }
  if (bitmap2[0].length !== bitmap1[0].length) {
    throw new Error('size mismatch');
  }
  return bitmap1.map((ln, y) => ln.map((v, x) => v || bitmap2[y][x]));
}

/**
 * @template {unknown} T
 * @param {T[][]} bitmap
 * @param {number} scale
 * @return {T[][]}
 */
export function upscaleBitmap(bitmap, scale) {
  /** @type {T[][]} */ const result = [];
  for (const row of bitmap) {
    /** @type {T[]} */ const resultRow = [];
    for (const cell of row) {
      for (let i = 0; i < scale; ++i) {
        resultRow.push(cell);
      }
    }
    for (let i = 0; i < scale; ++i) {
      result.push(resultRow);
    }
  }
  return result;
}

/**
 * @param {string[]} options
 */
function shortest(...options) {
  let best = options[0];
  for (const option of options) {
    if (option.length < best.length) {
      best = option;
    }
  }
  return best;
}

/**
 * @type {(scaleX: number, scaleY?: number) => (loop: Point[]) => Point[]}
 */
export const scale = (scaleX, scaleY = scaleX) => (loop) => loop.map((p) => ({ x: p.x * scaleX, y: p.y * scaleY }));

/**
 * @type {(dx: number, dy: number) => (loop: Point[]) => Point[]}
 */
export const translate = (dx, dy) => (loop) => loop.map((p) => ({ x: p.x + dx, y: p.y + dy }));

/**
 * Check is loop is clockwise, assuming +x = right, +y = up (true for CFF vector space)
 * @param {Point[]} loop
 */
export function isClockwise(loop) {
  // thanks, https://stackoverflow.com/a/1165943/1180785
  const n = loop.length;
  let sum = 0;
  for (let i = 0; i < n; ++i) {
    const p1 = loop[i];
    const p2 = loop[(i + 1) % n];
    sum += (p2.x - p1.x) * (p2.y + p1.y);
  }
  return sum > 0;
}

/**
 * @param {Point[]} loop
 * @param {boolean} clockwise
 */
function ensureDirection(loop, clockwise) {
  if (isClockwise(loop) === clockwise) {
    return loop;
  }
  return loop.slice().reverse();
}

/**
 * @param {Point[][]} loops
 */
export function toSVGPath(loops) {
  return loops.flatMap((loop) => {
    const r = [`M${loop[0].x},${loop[0].y}`];
    for (let i = 1; i < loop.length; ++i) {
      const cur = loop[i];
      const prev = loop[i - 1];
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      if (dx && dy) {
        r.push(shortest(`l${dx},${dy}`, `L${cur.x},${cur.y}`));
      } else if (dx) {
        r.push(shortest(`h${dx}`, `H${cur.x}`));
      } else if (dy) {
        r.push(shortest(`v${dy}`, `V${cur.y}`));
      }
    }
    r.push('Z');
    return r;
  }).join('');
}

/**
 * @param {Point[][]} loops
 * @return {Instruction[]}
 */
export function toType2Instructions(loops) {
  let pos = { x: 0, y: 0 };
  /** @type {Instruction | null} */ let active = null;
  let activeNextH = false;

  /** @type {Instruction[]} */ const instructions = [];
  for (const rawLoop of loops) {
    const loop = ensureDirection(rawLoop, false); // TODO: should probably enforce direction earlier, so that inner holes remain clockwise

    // this instruction doubles as closing the last loop, so don't omit it if the delta is 0
    instructions.push(['rmoveto', loop[0].x - pos.x, loop[0].y - pos.y]);
    active = null;
    pos = loop[0];
    for (let i = 1; i < loop.length; ++i) {
      const cur = loop[i];
      const dx = cur.x - pos.x;
      const dy = cur.y - pos.y;
      if (dx && dy) {
        instructions.push(['rlineto', dx, dy]);
        active = null;
      } else if (dx) {
        if (!active || !activeNextH) {
          active = ['hlineto'];
          instructions.push(active);
        }
        active.push(dx);
        activeNextH = false;
      } else if (dy) {
        if (!active || activeNextH) {
          active = ['vlineto'];
          instructions.push(active);
        }
        active.push(dy);
        activeNextH = true;
      }
      pos = cur;
    }
  }
  return instructions;
}

/**
 * @param {{ x: number, y: number, r: number }[]} points
 * @return {Instruction[]}
 */
export function makeType2CurvedPolygon(points) {
  let x = points[0].x;
  let y = points[0].y;

  /**
   * @param {number} absX
   * @param {number} absY
   */
  const relative = (absX, absY) => {
    const dx = absX - x;
    const dy = absY - y;
    x = absX;
    y = absY;
    return [dx, dy];
  };
  /** @type {Instruction[]} */ const instructions = [['rmoveto', x, y]];
  for (let i = 1; i < points.length - 1; ++i) {
    const cur = points[i];
    if (!cur.r) {
      instructions.push(['rlineto', ...relative(cur.x, cur.y)]);
      continue;
    }
    const next = points[i + 1];
    let d1x = x - cur.x;
    let d1y = y - cur.y;
    let d2x = next.x - cur.x;
    let d2y = next.y - cur.y;
    const l1 = Math.hypot(d1x, d1y);
    const l2 = Math.hypot(d2x, d2y);
    d1x /= l1;
    d1y /= l1;
    d2x /= l2;
    d2y /= l2;
    const angS = Math.abs(d2x * d1y - d2y * d1x);
    const angC = d2x * d1x + d2y * d1y;
    const p = angS / (1 - angC);
    const rLim = Math.min(l1, l2) / p;
    let r = cur.r;
    if (r > rLim) {
      console.error('clamped radius');
      r = rLim;
    }
    let v = Math.atan(angS / angC);
    if (v < 0) {
      v += Math.PI;
    }
    const bezier = Math.tan((Math.PI - v) * 0.25) * 4 / 3;
    instructions.push(['rlinecurve',
      ...relative(cur.x + r * d1x * p, cur.y + r * d1y * p),
      ...relative(cur.x + r * d1x * (p - bezier), cur.y + r * d1y * (p - bezier)),
      ...relative(cur.x + r * d2x * (p - bezier), cur.y + r * d2y * (p - bezier)),
      ...relative(cur.x + r * d2x * p, cur.y + r * d2y * p),
    ]);
  }
  return instructions;
}
