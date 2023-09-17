import { isRIFF, readRIFF } from '../../containers/riff.mjs';

// https://www.daubnet.com/en/file-format-ani

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function isANI(data) {
  return isRIFF(data, 'ACON');
}

/**
 * @param {ArrayBuffer | ArrayBufferView} data
 */
export function readANI(data) {
  const { chunks, warnings } = readRIFF(data);
  if (!chunks.length) {
    warnings.push('ANI file contains no data');
    return { warnings };
  }
  if (chunks[0].type !== 'ACON') {
    warnings.push(`Type ${chunks[0]?.type} is not ACON`);
  }
  const cs = chunks[0].chunks ?? [];
  const anih = cs.find((c) => c.type === 'anih');
  const fram = cs.find((c) => c.type === 'fram');
  const seq = cs.find((c) => c.type === 'seq ');
  const rate = cs.find((c) => c.type === 'rate');

  for (const c of fram?.chunks ?? []) {
    if (c.type !== 'icon') {
      warnings.push(`non-icon ${c.type} in fram`);
      continue;
    }
    //
  }

  throw new Error('TODO');
}
