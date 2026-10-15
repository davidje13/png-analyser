import { SimpleList } from './base/CoreNode.mjs';
import { BAZv } from './BAZv.mjs';

/** Bezier Sub-Points List */
export class BZLv extends SimpleList('BAZv', BAZv, { counter: 'BZCi', checkCount: false }) {}
