/**
 * @typedef {import('../image/actions/vectorise.mjs').Point} Point
 * @typedef {import('./cff/cff_glyph.mjs').Instruction} Instruction
 */

/**
 * @template {unknown} T
 * @param {T[][]} bitmap
 * @param {T} value
 * @return {boolean[][]}
 */
export function extractValue(bitmap, value) {
  return bitmap.map((ln) => ln.map((v) => v === value));
}

/**
 * @param {boolean[][]} bitmap1
 * @param {boolean[][]} bitmap2
 * @return {boolean[][]}
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
    const loop = ensureDirection(rawLoop, false);

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
