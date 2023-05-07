import { asColourDiv, termCol, termReset } from '../../../../../pretty.mjs';
import { nodeBasicValue } from '../node_registry.mjs';
import { registerNode } from '../node_registry.mjs';

/** @typedef {{ col: number, locked: boolean, clt: boolean }} Entry */

registerNode('PAL', 'v', { // PALette
  read: (target, value, state) => {
    /** @type {Entry[]} */ const entries = [];
    for (const c of value) {
      const fcl = nodeBasicValue(c, 'FCL', 'i');
      const cll = nodeBasicValue(c, 'CLL', 'b');
      const clt = nodeBasicValue(c, 'CLT', 'b'); // one-colour transparency?
      if (fcl !== undefined) {
        entries.push({ col: fcl, locked: false, clt: false });
      } else if (cll !== undefined && entries.length > 0) {
        entries[entries.length - 1].locked = cll;
      } else if (clt !== undefined && entries.length > 0) {
        entries[entries.length - 1].clt = clt;
      } else {
        state.warnings.push(`Unknown palette node ${c.name}`);
      }
    }
    target.entries = entries;

    target.toString = () => [
      `${entries.length}-colour palette:`,
      ...entries.map((c) => `${termCol(c.col)} ${c.col.toString(16).padStart(8, '0')} ${termReset}`),
    ].join('\n');

    target.display = (summary, content) => {
      summary.append(`${entries.length}-colour palette`);
      for (const entry of entries) {
        const o = asColourDiv(entry.col, true);
        if (entry.locked) {
          o.classList.add('locked');
        }
        if (entry.clt) {
          o.classList.add('clt');
        }
        content.append(o);
      }
    };
  },
});
