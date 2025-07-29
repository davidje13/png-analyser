import { indent } from '../../../../../../../display/pretty.mjs';
import { registerType } from '../node_registry.mjs';

registerType('i', {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `${target.name}: ${value.toString(16).padStart(8, '0')}`;
  },
});

registerType('v', {
  read: (target, value) => {
    target.value = value;
    Object.assign(target, outputNodes(target.name, value));
  },
});

registerType(null, {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `${target.name}: ${JSON.stringify(value)}`;
  },
});

/**
 * @typedef {import('../node_registry.mjs').ProcessedNode} ProcessedNode
 * @typedef {import('../node_registry.mjs').SVGPart} SVGPart
 *
 * @param {string} name
 * @param {(ProcessedNode | undefined)[]} nodes
 * @param {boolean=} onlyUnvisited
 * @return {{
 *   toString: () => string,
 *   display: (summary: HTMLElement, content: HTMLElement) => void,
 * }}
 */
export function outputNodes(name, nodes, onlyUnvisited = false) {
  let actualNodes = /** @type {ProcessedNode[]} */ (nodes.filter((n) => n));
  if (onlyUnvisited) {
    actualNodes = actualNodes.filter((n) => !n.visited);
  }
  for (const node of actualNodes) {
    node.visited = true;
  }
  return {
    toString: () => {
      if (!actualNodes.length) {
        return `${name}: []`;
      }
      return `${name}:\n${actualNodes.map((n) => indent(n.toString(), '  ', '- ')).join('\n')}`;
    },
    display: (summary, content) => {
      if (!actualNodes.length) {
        summary.append(`${name}: []`);
        return;
      }
      const ul = document.createElement('ul');
      for (const n of actualNodes) {
        const li = document.createElement('li');
        const s = document.createElement('div');
        const c = document.createElement('div');
        n.display(s, c);
        li.append(s, c);
        ul.append(li);
      }
      const det = document.createElement('details');
      det.setAttribute('open', 'open');
      const sum = document.createElement('summary');
      sum.append(name);

      // download all children as an SVG
      if (actualNodes.some((n) => n.hasSVG?.())) {
        const svg = document.createElement('button');
        svg.innerText = 'To SVG';
        svg.addEventListener('click', () => {
          /** @type {SVGPart[]} */
          const parts = [];
          for (const n of actualNodes) {
            n.toSVG?.(parts);
          }
          if (!parts.length) {
            alert('nothing to export');
            return;
          }
          let bl = Number.POSITIVE_INFINITY;
          let br = Number.NEGATIVE_INFINITY;
          let bt = Number.POSITIVE_INFINITY;
          let bb = Number.NEGATIVE_INFINITY;
          for (const p of parts) {
            bl = Math.min(bl, p.bounds.minX);
            br = Math.max(br, p.bounds.maxX);
            bt = Math.min(bt, p.bounds.minY);
            bb = Math.max(bb, p.bounds.maxY);
          }

          // image editors can get confused if top-left is not 0,0
          bl = 0;
          bt = 0;

          const SVG_NS = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(SVG_NS, 'svg');
          svg.setAttribute('version', '1.1');
          svg.setAttribute('xmlns', SVG_NS);
          svg.setAttribute('viewBox', `${bl} ${bt} ${br - bl} ${bb - bt}`);
          svg.setAttribute('width', String(br - bl));
          svg.setAttribute('height', String(bb - bt));
          svg.setAttribute('fill', 'none');
          svg.append(...parts.map((p) => p.element));
          const code = '<?xml version="1.0" encoding="UTF-8" ?>' + svg.outerHTML;
          const download = document.createElement('a');
          download.setAttribute('href', 'data:image/svg+xml;base64,' + btoa(code));
          download.setAttribute('download', 'image.svg');
          download.click();
        });
        sum.append(' ', svg);
      }

      det.append(sum, ul);
      content.append(det);
    },
  };
}
