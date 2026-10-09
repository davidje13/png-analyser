import { asColourDiv, disclosure, termCol, termReset } from '../../../../../../../display/pretty.mjs';
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

registerNode('PALv', { // PALette
  read: (target, value, state) => {
    /** @type {Entry[]} */ const entries = [];
    for (const c of value) {
      const fcl = nodeBasicValue(c, 'FCLi');
      const bcl = nodeBasicValue(c, 'BCLi');
      const cll = nodeBasicValue(c, 'CLLb');
      const clt = nodeBasicValue(c, 'CLTb');
      const clm = nodeBasicValue(c, 'CLMb');
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
        state.warnings.push(`Unknown palette node ${c.id}`);
      }
    }
    target.entries = entries;

    target.toString = () => [
      `${entries.length}-colour palette:`,
      ...entries.map((c) => `${termCol(c.col)} ${c.col.toString(16).padStart(8, '0')} ${termReset}`),
    ].join('\n');

    target.display = (container) => {
      const out = disclosure(`${entries.length}-colour palette`, [], true);
      for (const entry of entries) {
        const o = asColourDiv(entry.col, true);
        if (entry.locked) {
          o.classList.add('locked');
        }
        if (entry.transparent) {
          o.classList.add('transparent');
        }
        out.append(o);
        if (entry.mapTo !== undefined && entry.mapped) {
          out.append('\u2192', asColourDiv(entry.mapTo, true));
        }
      }
      container.append(out);
    };
  },
});
