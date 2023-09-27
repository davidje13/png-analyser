import { asDataView } from '../../data/utils.mjs';

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isJPEG(data) {
  if (data.byteLength < 4) {
    return false;
  }
  const dv = asDataView(data);
  const magic = dv.getUint16(0);
  return magic === 0xFFD8 && dv.getUint8(2) === 0xFF;
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isJPEG2000(data) {
  if (data.byteLength < 12) {
    return false;
  }
  const dv = asDataView(data);
  const magic1 = dv.getUint32(0);
  const magic2 = dv.getUint32(4);
  const magic3 = dv.getUint32(8);
  return magic1 === 0x0000000C && magic2 === 0x6A502020 && magic3 === 0x0D0A870A;
}
