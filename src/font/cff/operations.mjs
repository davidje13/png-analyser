/**
 * @typedef {import('../../data/builder.mjs').ByteArrayBuilder} ByteArrayBuilder
 * @typedef {`${number}`} BigDecimal
 * @typedef {{ id: number; esc?: boolean }} Operator
 * @typedef {(
 *   | { type: 'number'; value: number | BigDecimal }
 *   | { type: 'fixed-size-number'; value: number; reference: { value: number } | null }
 *   | { type: 'string-id'; value: number }
 *   | { type: 'array'; value: (number | BigDecimal)[] }
 *   | { type: 'delta'; value: number[] }
 *   | { type: 'type-2-number'; value: number }
 * )} Operand
 */

/**
 * @param {ByteArrayBuilder} buf
 * @param {number} v
 */
function writeOperandInt(buf, v) {
  if (v !== Math.round(v)) {
    throw new Error('non-integer value');
  }
  if (v >= -107 && v <= 107) {
    buf.uint8(v + 139);
  } else if (v >= 108 && v <= 1131) {
    buf.uint16BE(0xF700 + v - 108);
  } else if (v >= -1131 && v <= -108) {
    buf.uint16BE(0xFB00 - v - 108);
  } else if (v >= -32768 && v <= 32767) {
    buf.uint8(28);
    buf.int16BE(v);
  } else {
    buf.uint8(29);
    buf.int32BE(v);
  }
}

/**
 * This format comes from the "Type 2" spec
 *
 * @param {ByteArrayBuilder} buf
 * @param {number} v
 */
function writeOperandType2Number(buf, v) {
  const fixed = Math.round(v * 0x10000);
  if (fixed < -0x80000000 || fixed > 0x7FFFFFFF) {
    throw new Error('value out of range');
  }
  if (!(fixed & 0xFFFF)) {
    writeOperandInt(buf, fixed >> 16);
  } else {
    buf.uint8(0xFF);
    buf.uint32BE(fixed);
  }
}

/**
 * Equivalent to writeOperandInt, but always uses fixed (largest) size.
 *
 * @param {ByteArrayBuilder} buf
 * @param {number} v
 */
function writeOperand32BitInt(buf, v) {
  if (v !== Math.round(v)) {
    throw new Error('non-integer value');
  }
  buf.uint8(29);
  buf.int32BE(v);
}

/**
 * @param {string} v
 */
function tidyNumberString(v) {
  return v
    .toLowerCase()
    .replaceAll(/\+/g, '')
    .replaceAll(/(\.[0-9]+?)0*(e|$)/g, '$1$2')
    .replaceAll(/\.0(e|$)/g, '$1');
}

/**
 * @param {number | BigDecimal} v
 */
function asShortString(v) {
  if (typeof v === 'string') {
    return tidyNumberString(v);
  }
  const option1 = tidyNumberString(v.toFixed(12));
  const option2 = tidyNumberString(v.toExponential(12));
  const d1 = Math.abs(Number(option1) - v);
  const d2 = Math.abs(Number(option2) - v);
  if (d1 <= d2 && option1.length <= option2.length) {
    return option1;
  }
  return option2;
}

const REAL_ENC = '0123456789.   -';
/**
 * @param {ByteArrayBuilder} buf
 * @param {number | BigDecimal} v
 */
function writeOperandReal(buf, v) {
  const vs = asShortString(v);
  let enc = [];
  for (let i = 0; i < vs.length; ++i) {
    const c = vs[i];
    if (c === 'e') {
      if (i + 1 >= vs.length) {
        throw new Error(`Invalid real number: '${vs}'`);
      }
      if (vs[i + 1] === '-') {
        enc.push(0xC);
        ++i;
      } else {
        enc.push(0xB);
      }
    } else {
      const p = REAL_ENC.indexOf(c);
      if (p === -1) {
        throw new Error(`Invalid real number: '${vs}'`);
      }
      enc.push(p);
    }
  }
  enc.push(0xF);
  if (enc.length & 1) {
    enc.push(0xF);
  }
  buf.uint8(30);
  for (let i = 0; i < enc.length; i += 2) {
    buf.uint8((enc[i] << 4) | enc[i + 1]);
  }
}

/**
 * @param {ByteArrayBuilder} buf
 * @param {number | BigDecimal} v
 */
function writeOperandNumber(buf, v) {
  const num = Number(v);
  if (Math.round(num) === num && num >= -0x80000000 && num < 0x80000000) {
    writeOperandInt(buf, num);
  } else {
    writeOperandReal(buf, v);
  }
}

/**
 * @param {ByteArrayBuilder} buf
 * @param {Operand} operand
 */
export function writeOperand(buf, operand) {
  switch (operand.type) {
    case 'number':
      writeOperandNumber(buf, operand.value);
      break;
    case 'fixed-size-number':
      writeOperand32BitInt(buf, operand.value + (operand.reference?.value ?? 0));
      break;
    case 'string-id':
      writeOperandInt(buf, operand.value);
      break;
    case 'array':
      for (const value of operand.value) {
        writeOperandNumber(buf, value);
      }
      break;
    case 'delta':
      let v = 0;
      for (const value of operand.value) {
        writeOperandNumber(buf, value - v);
        v = value;
      }
      break;
    case 'type-2-number':
      writeOperandType2Number(buf, operand.value);
      break;
    default:
      throw new Error('unknown operand type');
  }
}

/**
 * @param {ByteArrayBuilder} buf
 * @param {Operator} operator
 */
function writeOperator(buf, { id, esc = false }) {
  if (esc) {
    buf.uint8(12);
    buf.uint8(id);
  } else {
    buf.uint8(id);
  }
}

/**
 * @param {ByteArrayBuilder} buf
 * @param {Operator} operator
 * @param {Operand[]} operands
 */
export function writeOperation(buf, operator, operands) {
  for (const operand of operands) {
    writeOperand(buf, operand);
  }
  writeOperator(buf, operator);
}

/**
 * @param {number | BigDecimal} v
 * @return {Operand}
 */
export function opNumber(v) {
  return { type: 'number', value: v };
}

/**
 * This operator type exists to work around a bug in the spec: some index
 * values can depend on the size of their own representation. Since this
 * causes a circular dependency, we break it by storing the values
 * inefficiently so that they have a predictable size.
 *
 * The 'reference' parameter is used to make it easier to modify the value
 * once the actual index is known: it will be added to the value at
 * serialisation time. One reference can be shared between multiple operands.
 *
 * @param {number} v
 * @param {({ value: number } | null)=} reference
 * @return {Operand}
 */
export function opFixedInt(v, reference = null) {
  return { type: 'fixed-size-number', value: v, reference };
}

/**
 * @param {number} v
 * @return {Operand}
 */
export function opStringID(v) {
  if (v < 0 || v >= 65000) {
    throw new Error('invalid string ID');
  }
  return { type: 'string-id', value: v };
}

/**
 * @param {(number | BigDecimal)[]} v
 * @return {Operand}
 */
export function opArray(v) {
  return { type: 'array', value: v };
}

/**
 * @param {number[]} v
 * @return {Operand}
 */
export function opDelta(v) {
  return { type: 'delta', value: v };
}

/**
 * @param {number} v
 * @return {Operand}
 */
export function opType2Number(v) {
  return { type: 'type-2-number', value: v };
}
