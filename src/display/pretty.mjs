/**
 * @param {unknown} v
 * @return {string}
 */
export function printNice(v) {
  return JSON.stringify(v, niceBuffer, 2);
}

/**
 * @param {string} k
 * @param {unknown} v
 * @return {unknown}
 */
function niceBuffer(k, v) {
  if (v instanceof DataView) {
    let r = [];
    for (let i = 0; i < v.byteLength; ++i) {
      r.push(v.getUint8(i).toString(16).padStart(2, '0'));
    }
    return `[${v.byteLength}] ${r.join(' ')}`;
  }
  return v;
}

/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
export function debugWrite(bytes) {
  const all = [''];
  for (let i = 0; i < bytes.byteLength; i += 16) {
    const rowN = [];
    const rowC = [];
    for (let j = 0; j < 16 && i + j < bytes.byteLength; ++j) {
      const c = bytes[i + j];
      rowN.push(c.toString(16).padStart(2, '0'));
      if (c >= 0x20 && c < 0x7F) {
        rowC.push(String.fromCharCode(c));
      } else {
        rowC.push('.');
      }
    }
    all.push(rowN.join(' ') + '   ' + rowC.join(''));
  }
  return all.join('\n') + '\n';
}

const NEWLINE = /\n/g;

/**
 * @param {string} s
 * @param {string} prefix
 * @param {string=} firstPrefix
 * @return {string}
 */
export function indent(s, prefix, firstPrefix = prefix) {
  return firstPrefix + s.replace(NEWLINE, '\n' + prefix);
}

/**
 * @param {number} top
 * @param {number} bottom
 * @return {number}
 */
export const overlayColour = (top, bottom) => {
  const aT = top >>> 24;
  const rT = (top >>> 16) & 0xFF;
  const gT = (top >>> 8) & 0xFF;
  const bT = top & 0xFF;

  const aB = 255 - aT;
  const rB = (bottom >>> 16) & 0xFF;
  const gB = (bottom >>> 8) & 0xFF;
  const bB = bottom & 0xFF;
  const r = Math.round((aT * rT + aB * rB) / 255);
  const g = Math.round((aT * gT + aB * gB) / 255);
  const b = Math.round((aT * bT + aB * bB) / 255);
  return 0xFF000000 | (r << 16) | (g << 8) | b;
};

export const termReset = '\u001b[0m';

/**
 * @param {number} c
 * @return {string}
 */
export const termCol = (c) => `\u001b[48;2;${(c >> 16) & 0xFF};${(c >> 8) & 0xFF};${c & 0xFF}m`;

/**
 * @param {number[][]} image
 * @param {number=} background
 * @return {string}
 */
export function printImage(image, background = -1) {
  return image.map((row) => row.map((c) => {
    if (c < 0) {
      return `${termReset}!`;
    }
    const mixed = background < 0 ? c : overlayColour(c, background);
    return `${termCol(mixed)} `;
  }).join('') + `${termReset}\n`).join('');
}

/**
 * @param {number[][]} image
 * @param {boolean} alpha
 * @return {ImageData}
 */
export function asImageData(image, alpha) {
  if (!image.length || !image[0].length) {
    return new ImageData(1, 1);
  }
  const w = image[0]?.length ?? 0;
  const h = image.length;
  const dat = new ImageData(w, h);
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      const c = image[y][x];
      const p = (y * w + x) * 4;
      dat.data[p  ] = (c >>> 16) & 0xFF;
      dat.data[p+1] = (c >>> 8) & 0xFF;
      dat.data[p+2] = c & 0xFF;
      dat.data[p+3] = alpha ? c >>> 24 : 255;
    }
  }
  return dat;
}

/**
 * @param {number} w
 * @param {number} h
 * @return {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }}
 */
export function makeCanvas(w, h) {
  if (w < 0 || h < 0) {
    throw new Error(`Invalid canvas size ${w} x ${h}`);
  }
  const canvas = el('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  return { canvas, ctx };
}

/**
 * @param {number[][]} image
 * @param {boolean} alpha
 * @return {HTMLCanvasElement}
 */
export function asCanvas(image, alpha) {
  const c = makeCanvas(image[0]?.length ?? 0, image.length);
  c.ctx.putImageData(asImageData(image, alpha), 0, 0);
  return c.canvas;
}

/**
 * @param {number} c
 * @return {string}
 */
export const rgba = (c) => `rgba(${(c >>> 16) & 0xFF}, ${(c >>> 8) & 0xFF}, ${c & 0xFF}, ${(c >>> 24) / 255})`;

/**
 * @param {number} c
 * @return {string}
 */
export const rgb = (c) => `rgb(${(c >>> 16) & 0xFF}, ${(c >>> 8) & 0xFF}, ${c & 0xFF})`;

/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   tiles: (
 *     { type: 'c', x: number, y: number, value: number, w: number, h: number } |
 *     { type: 'i', x: number, y: number, value: number[][] }
 *   )[],
 * }} TileData
 */

/**
 * @param {TileData} tileData
 * @return {HTMLCanvasElement}
 */
export function tilesAsCanvas({ width, height, tiles }) {
  const c = makeCanvas(width, height);
  for (const tile of tiles) {
    switch (tile.type) {
      case 'i':
        c.ctx.putImageData(asImageData(tile.value, true), tile.x, tile.y);
        break;
      case 'c':
        c.ctx.fillStyle = rgba(tile.value);
        c.ctx.fillRect(tile.x, tile.y, tile.w, tile.h);
        break;
    }
  }
  return c.canvas;
}

/**
 * @typedef {ReadonlyArray<{ position: number, colour: number }>} Gradient
 */

const backgroundImage = 'linear-gradient(white,white),repeating-linear-gradient(to right,#333333 0px 8px,#000000 8px 16px),repeating-linear-gradient(to bottom,#333333 0px 8px,#000000 8px 16px)';
const backgroundBlend = 'difference,difference,normal';

/**
 * @param {number} col
 * @param {boolean=} alpha
 * @param {string=} label
 * @return {HTMLElement}
 */
export function asColourDiv(col, alpha = false, label) {
  const preview = el('div', {
    class: 'colour-preview',
  }, [label ?? col.toString(16).padStart(alpha ? 8 : 6, '0')]);
  if (alpha) {
    if ((col >>> 24) !== 255) {
      const c = rgba(col);
      preview.style.backgroundImage = `linear-gradient(${c},${c}),${backgroundImage}`;
      preview.style.backgroundBlendMode = `normal,${backgroundBlend}`;
    } else {
      preview.style.backgroundColor = rgb(col);
    }
  } else {
    preview.style.backgroundColor = rgb(col);
  }
  return preview;
}

/**
 * @param {HTMLElement | string | (HTMLElement | string)[]} summary
 * @param {HTMLElement | string | (HTMLElement | string)[]} content
 * @param {boolean} open
 * @return {HTMLElement}
 */
export function disclosure(summary, content, open = false) {
  return el('details', { open: open ? 'open' : undefined }, [
    el('summary', {}, Array.isArray(summary) ? summary : [summary]),
    ...(Array.isArray(content) ? content : [content]),
  ]);
}

/**
 * @template {unknown} T
 * @param {T[]} items
 * @param {{ getGroup?: (o: T) => string | null | undefined, getName: (o: T) => string, getContent: (o: T) => HTMLElement }} opts
 * @return {{ select: HTMLElement, tabs: HTMLElement }}
 */
export function selectTabs(items, { getGroup = () => null, getName, getContent }) {
  const conv = items.map((o) => ({
    group: getGroup(o) ?? '',
    name: getName(o),
    content: getContent(o),
  }));
  conv.sort((a, b) => a.group !== b.group ? (a.group > b.group ? 1 : -1) : (a.name > b.name ? 1 : -1));
  const select = el('select');
  const tabs = el('div');
  let curGroup = '';
  /** @type {HTMLElement} */ let curOptGroup = select;
  /** @type {HTMLElement[]} */ const tabNodes = [];
  tabNodes.push(el('div'));
  let i = 1;
  const optNone = el('option', { value: 0 }, []);
  select.append(optNone);
  for (const o of conv) {
    if (o.group !== curGroup) {
      curGroup = o.group;
      curOptGroup = el('optgroup', { label: o.group });
      select.append(curOptGroup);
    }
    tabNodes.push(o.content);
    curOptGroup.append(el('option', { value: i }, [String(o.name)]));
    ++i;
  }
  let curTab = -1;
  /**
   * @param {number} n
   */
  function showTab(n) {
    if (curTab === n) {
      return;
    }
    curTab = n;
    tabs.childNodes[0]?.remove();
    tabs.append(tabNodes[n]);
    select.value = String(n);
  }
  showTab(0);
  select.addEventListener('change', () => showTab(Number(select.value)));
  return { select, tabs };
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {Record<string, string | number | boolean | undefined>} attrs
 * @param {(Element | string)[]} children
 * @return {HTMLElementTagNameMap[K]}
 */
export function el(tag, attrs = {}, children = []) {
	const o = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs)) {
		if (v === true) {
			o.setAttribute(k, '');
		} else if (v !== false && v !== undefined) {
			o.setAttribute(k, String(v));
		}
	}
	o.append(...children);
	return o;
}

/**
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} tag
 * @param {Record<string, string | number | boolean | undefined>} attrs
 * @param {(Element | string)[]} children
 * @return {SVGElementTagNameMap[K]}
 */
export function svgEl(tag, attrs = {}, children = []) {
	const o = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (const [k, v] of Object.entries(attrs)) {
		if (v === true) {
			o.setAttribute(k, '');
		} else if (v !== false && v !== undefined) {
			o.setAttribute(k, String(v));
		}
	}
	o.append(...children);
	return o;
}
