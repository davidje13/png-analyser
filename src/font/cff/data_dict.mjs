import { ByteArrayBuilder } from '../../data/builder.mjs';
import { writeOperation } from './operations.mjs';

/**
 * @typedef {import('./operations.mjs').Operator} Operator
 * @typedef {import('./operations.mjs').Operand} Operand
*/

export class Dict {
  constructor() {
    /** @type {Map<Operator, Operand[]>} */ this.items = new Map();
  }

  /**
   * @param {Operator} operator
   * @param {Operand[]} operands
   */
  set(operator, ...operands) {
    this.items.set(operator, operands);
  }

  /**
   * @param {ByteArrayBuilder} buf
   */
  write(buf) {
    for (const [operator, operands] of this.items.entries()) {
      writeOperation(buf, operator, operands);
    }
  }

  /**
   * @return {ByteArrayBuilder}
   */
  toBytes() {
    const buf = new ByteArrayBuilder();
    this.write(buf);
    return buf;
  }
}
