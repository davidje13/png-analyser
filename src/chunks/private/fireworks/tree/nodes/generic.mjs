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
    target.toString = () => {
      if (!value.length) {
        return `${target.name}: []`;
      }
      return `${target.name}:\n${value.map((n) => indent(n.toString(), '  ', '- ')).join('\n')}`;
    };
    target.display = (summary, content) => {
      if (!value.length) {
        summary.append(`${target.name}: []`);
        return;
      }
      const ul = document.createElement('ul');
      for (const n of value) {
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
      sum.append(target.name);
      det.append(sum, ul);
      content.append(det);
    };
  },
});

registerType(null, {
  read: (target, value) => {
    target.value = value;
    target.toString = () => `${target.name}: ${JSON.stringify(value)}`;
  },
});
