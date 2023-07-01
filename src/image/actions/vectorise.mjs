/**
 * @typedef {{ x: number, y: number }} Point
 */

/**
 * @param {boolean[][]} image
 * @return {Point[][]}
 */
export function vectorisePixelated(image) {
  const h = image.length;
  if (!h) {
    return [];
  }
  const w = image[0].length;

  /** @type {Map<string, Point[]>} */ const anchors = new Map();
  /** @type {Point[][]} */ const loops = [];

  /**
   * @param {Point} point
   */
  const getAndDelete = (point) => {
    const key = `${point.x},${point.y}`;
    const v = anchors.get(key);
    anchors.delete(key);
    return v;
  };

  for (let y = 0; y <= h; ++y) {
    for (let x = 0; x <= w; ++x) {
      const v5 = Boolean(image[y]?.[x]);
      const v2 = Boolean(image[y-1]?.[x]);
      const v4 = Boolean(image[y]?.[x-1]);
      const f = [
        v4 !== v5 ? { x, y: y + 1 } : null,
        { x, y },
        v2 !== v5 ? { x: x + 1, y } : null,
      ].filter(notNull);

      if (!v5) {
        f.reverse();
      }

      const end = f.pop();
      if (end && f.length > 0) {
        const a = getAndDelete(f[0]) || [];
        const b = getAndDelete(end);
        a.push(...f);
        if (a === b) {
          loops.push(a);
        } else {
          if (b) {
            b.unshift(...a);
          } else {
            anchors.set(`${end.x},${end.y}`, a);
          }
          anchors.set(`${a[0].x},${a[0].y}`, b || a);
        }
      }
    }
  }

  return loops.map(simplify);
};

/**
 * @param {Point[]} loop
 * @return {Point[]}
 */
function deduplicate(loop) {
  const n = loop.length;
  return loop.filter((v, i) => {
    const next = loop[(i + 1) % n];
    return next.x !== v.x || next.y !== v.y;
  });
}

/**
 * @param {Point[]} loop
 * @return {Point[]}
 */
export function simplify(loop) {
  const dedup = deduplicate(loop);
  const n = dedup.length;
  /** @type {Point[]} */ const result = [];
  for (let i = 0; i < n; ++i) {
    const point0 = dedup[(i + n - 1) % n];
    const point1 = dedup[i];
    const point2 = dedup[(i + 1) % n];
    const d1 = { x: point1.x - point0.x, y: point1.y - point0.y };
    const d2 = { x: point2.x - point1.x, y: point2.y - point1.y };
    const cross = d1.y * d2.x - d1.x * d2.y;
    const dot = d1.x * d2.x + d1.y * d2.y;
    if (cross !== 0 || dot <= 0) {
      result.push(point1);
    }
  }
  return result;
}

/** @type {<T>(x: T | null | undefined) => x is T} */
const notNull = (x) => x !== null && x !== undefined;
