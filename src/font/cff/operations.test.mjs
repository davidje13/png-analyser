import { ByteArrayBuilder } from '../../data/builder.mjs';
import { opFixedInt, opNumber, opType2Number, writeOperand } from './operations.mjs';
import 'lean-test';

describe('writeOperand', () => {
  it('converts known values', (/** @type {any} */ { value, expected }) => {
    const target = new ByteArrayBuilder();
    writeOperand(target, value);
    expect(hex(target.toBytes())).equals(expected);
  }, { parameters: [
    // test values from Adobe PostScript Technical Node #5176 (page 10)
    { value: opNumber(0), expected: '8b' },
    { value: opNumber(100), expected: 'ef' },
    { value: opNumber(-100), expected: '27' },
    { value: opNumber(1000), expected: 'fa7c' },
    { value: opNumber(-1000), expected: 'fe7c' },
    { value: opNumber(10000), expected: '1c2710' },
    { value: opNumber(-10000), expected: '1cd8f0' },
    { value: opNumber(100000), expected: '1d000186a0' },
    { value: opNumber(-100000), expected: '1dfffe7960' },

    { value: opNumber('0'), expected: '8b' },

    { value: opFixedInt(0), expected: '1d00000000' },
    { value: opFixedInt(100), expected: '1d00000064' },

    { value: opNumber(1000000000001), expected: '1e1000000000001f' },
    { value: opNumber(1000000000000), expected: '1e1b12ff' },

    // test values from Adobe PostScript Technical Node #5176 (page 11)
    { value: opNumber('-2.25'), expected: '1ee2a25f' },
    { value: opNumber(-2.25), expected: '1ee2a25f' },
    { value: opNumber('0.140541e-3'), expected: '1e0a140541c3ff' },
    { value: opNumber(0.140541e-3), expected: '1e1a40541c4f' },

    { value: opType2Number(0), expected: '8b' },
    { value: opType2Number(100), expected: 'ef' },
    { value: opType2Number(1000), expected: 'fa7c' },
    { value: opType2Number(-1000), expected: 'fe7c' },
    { value: opType2Number(1.23), expected: 'ff00013ae1' },
  ] });
});

/**
 * @param {Uint8Array} v
 * @return {string}
 */
function hex(v) {
  return [...v].map((v) => v.toString(16).padStart(2, '0')).join('');
}
