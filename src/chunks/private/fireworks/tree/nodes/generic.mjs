import { indent } from '../../../../../pretty.mjs';
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
 * @param {string} name
 * @param {import('../node_registry.mjs').ProcessedNode[]} nodes
 * @return {{
 *   toString: () => string,
 *   display: (summary: HTMLElement, content: HTMLElement) => void,
 * }}
 */
export function outputNodes(name, nodes) {
  return {
    toString: () => {
      if (!nodes.length) {
        return `${name}: []`;
      }
      return `${name}:\n${nodes.map((n) => indent(n.toString(), '  ', '- ')).join('\n')}`;
    },
    display: (summary, content) => {
      if (!nodes.length) {
        summary.append(`${name}: []`);
        return;
      }
      const ul = document.createElement('ul');
      for (const n of nodes) {
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
      det.append(sum, ul);
      content.append(det);
    },
  };
}
