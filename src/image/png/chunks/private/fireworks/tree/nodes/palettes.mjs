import { asColourDiv, termCol, termReset } from '../../../../../../../display/pretty.mjs';
import { nodeBasicValue } from '../node_registry.mjs';
import { registerNode } from '../node_registry.mjs';

/**
 * @typedef {{
 *   col: number,
 *   locked: boolean,
 *   transparent: boolean,
 *   mapped: boolean
 *   mapTo: number | undefined,
 * }} Entry
 */

registerNode('PAL', 'v', { // PALette
  read: (target, value, state) => {
    /** @type {Entry[]} */ const entries = [];
    for (const c of value) {
      const fcl = nodeBasicValue(c, 'FCL', 'i');
      const bcl = nodeBasicValue(c, 'BCL', 'i');
      const cll = nodeBasicValue(c, 'CLL', 'b');
      const clt = nodeBasicValue(c, 'CLT', 'b');
      const clm = nodeBasicValue(c, 'CLM', 'b');
      if (fcl !== undefined) {
        entries.push({
          col: fcl,
          locked: false,
          transparent: false,
          mapped: false,
          mapTo: undefined,
        });
      } else if (cll !== undefined && entries.length > 0) {
        entries[entries.length - 1].locked = cll;
      } else if (clt !== undefined && entries.length > 0) {
        entries[entries.length - 1].transparent = clt;
      } else if (clm !== undefined && entries.length > 0) {
        entries[entries.length - 1].mapped = clm;
      } else if (bcl !== undefined && entries.length > 0) {
        entries[entries.length - 1].mapTo = bcl;
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
        if (entry.transparent) {
          o.classList.add('transparent');
        }
        content.append(o);
        if (entry.mapTo !== undefined && entry.mapped) {
          content.append('\u2192', asColourDiv(entry.mapTo, true));
        }
      }
    };
  },
});
