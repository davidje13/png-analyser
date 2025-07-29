import { makeCanvas } from '../../../../../../../display/pretty.mjs';
import { getBasicValue, getChildren, registerNode } from '../node_registry.mjs';
import { outputNodes } from './generic.mjs';

// PBL/PBP/BPT(/BZL?)

/**
 * @typedef {import('../node_registry.mjs').ProcessedNode} ProcessedNode
 */

registerNode('PTH', 'v', { // PaTH
  read: (target, value, state) => {
    Object.assign(target, outputNodes(target.name, value));
    const fillOnTop = getBasicValue(value, 'FOT', 'b') ?? false;
    target.storage.fillOnTop = fillOnTop;
  },
});

/**
 * @typedef {ProcessedNode & {
 *   x: number,
 *   y: number,
 *   xC1: number,
 *   yC1: number,
 *   xC2: number,
 *   yC2: number,
 *   CRV: boolean,
 *   RND: number,
 *   NSD: number,
 *   BZL: ProcessedNode[],
 * }} PBTNode
 */

registerNode('PBT', 'v', { // Path Bezier poinT
  read: (target, value, state) => {
    const x = getBasicValue(value, 'XLC', 'f');
    const y = getBasicValue(value, 'YLC', 'f');
    const xC1 = getBasicValue(value, 'XPC', 'f') ?? x;
    const yC1 = getBasicValue(value, 'YPC', 'f') ?? y;
    const xC2 = getBasicValue(value, 'XSC', 'f') ?? x;
    const yC2 = getBasicValue(value, 'YSC', 'f') ?? y;
    const isCurve = getBasicValue(value, 'CRV', 'b') ?? false;
    const randomSeed = getBasicValue(value, 'RND', 'i');
    const NSD = getBasicValue(value, 'NSD', 'f');
    const BZL = getBasicValue(value, 'BZL', 'v'); // TODO: maybe this holds attributes like pressure / velocity? Seems to have BZCi (count?) and BAZv (item array?)

    target.x = x;
    target.y = y;
    target.xC1 = xC1;
    target.yC1 = yC1;
    target.xC2 = xC2;
    target.yC2 = yC2;
    target.isCurve = isCurve; // control points are forced colinear
    target.randomSeed = randomSeed;
    target.NSD = NSD;
    target.BZL = BZL;

    target.toString = () => `(${x}, ${y}) (${xC1}, ${yC1}) (${xC2}, ${yC2})\nrandom seed = ${randomSeed}, NSD = ${NSD}, BZL = ${BZL}`;
  },
});

/**
 * @typedef {ProcessedNode & {
 *   points: PBTNode[],
 *   isClosed: boolean,
 *   BSL: number,
 * }} PBPNode
 */

registerNode('PBP', 'v', { // Path Bezier Points
  read: (target, value, state) => {
    const isClosed = getBasicValue(value, 'ISC', 'b') ?? false;
    const count = getBasicValue(value, 'PPC', 'i');
    const BSL = getBasicValue(value, 'BSL', 'f');
    const points = /** @type {PBTNode[]} */ (getChildren(value, 'PBT', 'v'));

    if (points.length !== count) {
      state.warnings.push(`Expected ${count} bezier points but got ${points.length}`);
    }

    target.isClosed = isClosed;
    target.points = points;
    target.BSL = BSL;

    target.toString = () => `${isClosed ? 'Closed ' : ''}Bezier Path:\n${points.join('\n')}`;

    target.display = (summary, content) => {
      if (!points.length) {
        content.append('Empty bezier path');
        return;
      }
      const bounds = getBezierBounds(points);

      const dispBounds = extendBounds(bounds, 5);
      const c = makeCanvas(
        dispBounds.maxX - dispBounds.minX,
        dispBounds.maxY - dispBounds.minY,
      );

      c.ctx.lineWidth = 2;
      c.ctx.strokeStyle = '#000000';
      c.ctx.lineJoin = 'round';
      c.ctx.fillStyle = 'rgba(0,0,0,0.1)';
      c.ctx.beginPath();
      traceBezierPath(c.ctx, points, dispBounds, isClosed);
      c.ctx.fill('evenodd');
      c.ctx.stroke();
      drawBezierPathControls(c.ctx, points, dispBounds);

      summary.append(`Bezier Path: ${bounds.minX} - ${bounds.maxX} / ${bounds.minY} - ${bounds.maxY}`);
      content.append(c.canvas);
    };

    target.toSVG = (parts) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.setAttribute('d', makeBezierPathSVG(points, isClosed));

      const data = target.parent?.parent?.storage?.svgPathDisplay;
      if (data) {
        element.setAttribute('fill', String(data.fill ?? 'none'));
        element.setAttribute('stroke', String(data.stroke ?? 'black'));
        element.setAttribute('stroke-width', String(data.strokeWidth ?? 0));
        element.setAttribute('stroke-linecap', 'round');
        element.setAttribute('stroke-linejoin', 'round');
        if (target.parent?.parent?.storage.fillOnTop) {
          element.setAttribute('paint-order', 'stroke');
        }
      } else if (isClosed) {
        element.setAttribute('fill', 'black');
      } else {
        element.setAttribute('stroke', 'black');
        element.setAttribute('stroke-width', '1');
      }
      parts.push({ element, bounds: extendBounds(getBezierBounds(points), 5) });
    };
  },
});

registerNode('PBL', 'v', { // Path Beziers List
  read: (target, value, state) => {
    const contours = /** @type {PBPNode[]} */ (getChildren(value, 'PBP', 'v'));

    target.contours = contours;

    target.toString = () => `Bezier Path Group:\n${contours.join('\n\n')}`;

    target.display = (summary, content) => {
      const bounds = contours.map((c) => getBezierBounds(c.points)).reduce(unionBounds);

      const dispBounds = extendBounds(bounds, 5);
      const c = makeCanvas(
        dispBounds.maxX - dispBounds.minX,
        dispBounds.maxY - dispBounds.minY,
      );

      c.ctx.lineWidth = 2;
      c.ctx.strokeStyle = '#000000';
      c.ctx.lineJoin = 'round';
      c.ctx.fillStyle = 'rgba(0,0,0,0.1)';
      c.ctx.beginPath();
      for (const contour of contours) {
        traceBezierPath(c.ctx, contour.points, dispBounds, contour.isClosed);
      }
      c.ctx.fill('evenodd');
      c.ctx.stroke();
      for (const contour of contours) {
        drawBezierPathControls(c.ctx, contour.points, dispBounds);
      }

      summary.append(`Bezier Path Group: ${bounds.minX} - ${bounds.maxX} / ${bounds.minY} - ${bounds.maxY}`);
      content.append(c.canvas);
    };
  },
});

// PCL/PPL/PPT seems to be a flattened linear-only view of the paths

/**
 * @typedef {ProcessedNode & {
 *   x: number,
 *   y: number,
 *   pressure: number,
 *   velocity: number,
 *   onControlPoint: boolean,
 * }} PPTNode
 */

registerNode('PPT', 'v', { // Path PoinT
  read: (target, value, state) => {
    const x = getBasicValue(value, 'XLC', 'f');
    const y = getBasicValue(value, 'YLC', 'f');
    const pressure = getBasicValue(value, 'PRS', 'f');
    const velocity = getBasicValue(value, 'VEL', 'f');
    const duration = getBasicValue(value, 'DUR', 'i');
    const randomSeed = getBasicValue(value, 'RND', 'i');
    const onControlPoint = getBasicValue(value, 'ONC', 'b') ?? false;

    target.x = x;
    target.y = y;
    target.pressure = pressure;
    target.velocity = velocity;
    target.duration = duration;
    target.randomSeed = randomSeed;
    target.onControlPoint = onControlPoint;

    target.toString = () => `(${x}, ${y})${onControlPoint ? '' : ' (Interpolated)'}\npressure = ${pressure}, velocity = ${velocity}, duration = ${duration}, random seed = ${randomSeed}`;

    target.display = (summary, content) => {
      summary.append(`(${x}, ${y})${onControlPoint ? '' : ' (Interpolated)'}`);
      content.append(`pressure = ${pressure}, velocity = ${velocity}, duration = ${duration}, random seed = ${randomSeed}`);
    };
  },
});

/**
 * @typedef {ProcessedNode & {
 *   points: PPTNode[],
 *   isClosed: boolean,
 * }} PPLNode
 */

registerNode('PPL', 'v', { // Path Point List
  read: (target, value, state) => {
    const isClosed = getBasicValue(value, 'ISC', 'b') ?? false;
    const count = getBasicValue(value, 'PPC', 'i');
    const points = /** @type {PPTNode[]} */ (getChildren(value, 'PPT', 'v'));

    if (points.length !== count) {
      state.warnings.push(`Expected ${count} points but got ${points.length}`);
    }

    target.isClosed = isClosed;
    target.points = points;

    target.toString = () => `${isClosed ? 'Closed ' : ''}Segmented Path:\n${points.join('\n')}`;

    target.display = (summary, content) => {
      if (!points.length) {
        content.append('Empty path');
        return;
      }
      const bounds = getBounds(points);

      const dispBounds = extendBounds(bounds, 5);
      const c = makeCanvas(
        dispBounds.maxX - dispBounds.minX,
        dispBounds.maxY - dispBounds.minY,
      );

      c.ctx.lineWidth = 2;
      c.ctx.strokeStyle = '#000000';
      c.ctx.lineJoin = 'round';
      c.ctx.fillStyle = 'rgba(0,0,0,0.1)';
      c.ctx.beginPath();
      tracePath(c.ctx, points, dispBounds, isClosed);
      c.ctx.fill('evenodd');
      c.ctx.stroke();
      drawPathControls(c.ctx, points, dispBounds);

      summary.append(`Segmented Path: ${bounds.minX} - ${bounds.maxX} / ${bounds.minY} - ${bounds.maxY}`);
      content.append(c.canvas);
    };

    target.toSVG = (parts) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.setAttribute('d', 'M' + points.map((p) => `${p.x} ${p.y}`).join('L') + (isClosed ? 'Z' : ''));
      element.setAttribute('visibility', 'hidden');
      const data = target.parent?.parent?.storage.svgPathDisplay;
      if (data) {
        element.setAttribute('fill', String(data.fill ?? 'none'));
        element.setAttribute('stroke', String(data.stroke ?? 'black'));
        element.setAttribute('stroke-width', String(data.strokeWidth ?? 0));
        element.setAttribute('stroke-linecap', 'round');
        element.setAttribute('stroke-linejoin', 'round');
        if (target.parent?.parent?.storage.fillOnTop) {
          element.setAttribute('paint-order', 'stroke');
        }
      } else if (isClosed) {
        element.setAttribute('fill', 'black');
      } else {
        element.setAttribute('stroke', 'black');
        element.setAttribute('stroke-width', '1');
      }
      parts.push({ element, bounds: extendBounds(getBounds(points), 5) });
    };
  },
});

registerNode('PCL', 'v', { // Path Contour List
  read: (target, value, state) => {
    const contours = /** @type {PPLNode[]} */ (getChildren(value, 'PPL', 'v'));

    target.contours = contours;

    target.toString = () => `Segmented Path Group:\n${contours.join('\n\n')}`;

    target.display = (summary, content) => {
      const bounds = contours.map((c) => getBounds(c.points)).reduce(unionBounds);

      const dispBounds = extendBounds(bounds, 5);
      const c = makeCanvas(
        dispBounds.maxX - dispBounds.minX,
        dispBounds.maxY - dispBounds.minY,
      );

      c.ctx.lineWidth = 2;
      c.ctx.strokeStyle = '#000000';
      c.ctx.lineJoin = 'round';
      c.ctx.fillStyle = 'rgba(0,0,0,0.1)';
      c.ctx.beginPath();
      for (const contour of contours) {
        tracePath(c.ctx, contour.points, dispBounds, contour.isClosed);
      }
      c.ctx.fill('evenodd');
      c.ctx.stroke();
      for (const contour of contours) {
        drawPathControls(c.ctx, contour.points, dispBounds);
      }

      summary.append(`Segmented Path Group: ${bounds.minX} - ${bounds.maxX} / ${bounds.minY} - ${bounds.maxY}`);
      content.append(c.canvas);
    };
  },
});

/**
 * @typedef {{
 *   minX: number,
 *   minY: number,
 *   maxX: number,
 *   maxY: number,
 * }} Bounds
 */

/**
 * @param {PPTNode[]} points
 * @return {Bounds}
 */
function getBounds(points) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  if (maxX < minX) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return {
    minX: Math.floor(minX),
    minY: Math.floor(minY),
    maxX: Math.ceil(maxX),
    maxY: Math.ceil(maxY),
  };
}

/**
 * @param {PBTNode[]} points
 * @return {Bounds}
 */
function getBezierBounds(points) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const point of points) {
    minX = Math.min(minX, point.x, point.xC1 ?? minX, point.xC2 ?? minX);
    minY = Math.min(minY, point.y, point.yC1 ?? minY, point.yC2 ?? minY);
    maxX = Math.max(maxX, point.x, point.xC1 ?? minX, point.xC2 ?? minX);
    maxY = Math.max(maxY, point.y, point.yC1 ?? minY, point.yC2 ?? minY);
  }

  if (maxX < minX) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return {
    minX: Math.floor(minX),
    minY: Math.floor(minY),
    maxX: Math.ceil(maxX),
    maxY: Math.ceil(maxY),
  };
}

/**
 * @param {Bounds} bounds1
 * @param {Bounds} bounds2
 * @return {Bounds}
 */
function unionBounds(bounds1, bounds2) {
  return {
    minX: Math.min(bounds1.minX, bounds2.minX),
    minY: Math.min(bounds1.minY, bounds2.minY),
    maxX: Math.max(bounds1.maxX, bounds2.maxX),
    maxY: Math.max(bounds1.maxY, bounds2.maxY),
  };
}

/**
 * @param {Bounds} bounds
 * @param {number} padding
 * @return {Bounds}
 */
function extendBounds(bounds, padding) {
  return {
    minX: bounds.minX - padding,
    minY: bounds.minY - padding,
    maxX: bounds.maxX + padding,
    maxY: bounds.maxY + padding,
  };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {PPTNode[]} points
 * @param {{ minX: number, minY: number }} bounds
 * @param {boolean} isClosed
 */
function tracePath(ctx, points, { minX, minY }, isClosed) {
  if (!points.length) {
    return;
  }
  ctx.moveTo(points[0].x - minX, points[0].y - minY);
  for (let i = 1; i < points.length; ++i) {
    const pt = points[i];
    ctx.lineTo(pt.x - minX, pt.y - minY);
  }
  if (isClosed) {
    ctx.closePath();
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {PPTNode[]} points
 * @param {{ minX: number, minY: number }} bounds
 */
function drawPathControls(ctx, points, { minX, minY }) {
  if (!points.length) {
    return;
  }
  ctx.fillStyle = 'rgba(0, 255, 0)';
  ctx.beginPath();
  for (const point of points) {
    if (!point.onControlPoint) {
      ctx.arc(point.x - minX, point.y - minY, 0.5, 0, Math.PI * 2);
      ctx.closePath();
    }
  }
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 0, 0)';
  ctx.beginPath();
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    if (point.onControlPoint) {
      ctx.arc(point.x - minX, point.y - minY, i === 0 ? 2 : 1, 0, Math.PI * 2);
      ctx.closePath();
    }
  }
  ctx.fill();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {PBTNode[]} points
 * @param {{ minX: number, minY: number }} bounds
 * @param {boolean} isClosed
 */
function traceBezierPath(ctx, points, { minX, minY }, isClosed) {
  if (!points.length) {
    return;
  }
  ctx.moveTo(points[0].x - minX, points[0].y - minY);
  for (let i = 1; i < points.length; ++i) {
    const ptA = points[i - 1];
    const pt = points[i];
    ctx.bezierCurveTo(
      ptA.xC2 - minX, ptA.yC2 - minY,
      pt.xC1 - minX, pt.yC1 - minY,
      pt.x - minX, pt.y - minY,
    );
  }
  if (isClosed) {
    const ptA = points[points.length - 1];
    const pt = points[0];
    ctx.bezierCurveTo(
      ptA.xC2 - minX, ptA.yC2 - minY,
      pt.xC1 - minX, pt.yC1 - minY,
      pt.x - minX, pt.y - minY,
    );
    ctx.closePath();
  }
}

/**
 * @param {PBTNode[]} points
 * @param {boolean} isClosed
 * @return {string}
 */
function makeBezierPathSVG(points, isClosed) {
  if (!points.length) {
    return '';
  }
  let r = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; ++i) {
    const ptA = points[i - 1];
    const pt = points[i];
    r += `C${ptA.xC2} ${ptA.yC2} ${pt.xC1} ${pt.yC1} ${pt.x} ${pt.y}`;
  }
  if (isClosed) {
    const ptA = points[points.length - 1];
    const pt = points[0];
    r += `C${ptA.xC2} ${ptA.yC2} ${pt.xC1} ${pt.yC1} ${pt.x} ${pt.y}Z`;
  }
  return r;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {PBTNode[]} points
 * @param {{ minX: number, minY: number }} bounds
 */
function drawBezierPathControls(ctx, points, { minX, minY }) {
  if (!points.length) {
    return;
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,255,0)';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (const point of points) {
    if (point.xC1 !== point.x || point.yC1 !== point.y) {
      ctx.moveTo(point.x - minX, point.y - minY);
      ctx.lineTo(point.xC1 - minX, point.yC1 - minY);
    }
    if (point.xC2 !== point.x || point.yC2 !== point.y) {
      ctx.moveTo(point.x - minX, point.y - minY);
      ctx.lineTo(point.xC2 - minX, point.yC2 - minY);
    }
  }
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,0,0)';
  ctx.beginPath();
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    ctx.arc(point.x - minX, point.y - minY, i === 0 ? 4 : 2, 0, Math.PI * 2);
    ctx.closePath();
  }
  ctx.fill();
}
