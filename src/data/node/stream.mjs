import { Readable } from 'node:stream';

/**
 * @param {Uint8Array} bytes
 * @return {Readable}
 */
export function bytesToStream(bytes) {
  const readable = new Readable();
  readable._read = () => {
    readable.push(bytes);
    readable.push(null);
  };
  return readable;
}
