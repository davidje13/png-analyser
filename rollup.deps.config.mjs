import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const basedir = dirname(fileURLToPath(import.meta.url));

export default [
  {
    input: join(basedir, 'src', 'third-party', 'pako-deflate.mjs'),
    output: {
      file: join(basedir, 'src', 'third-party', 'pako-deflate.min.mjs'),
      format: 'esm',
    },
    plugins: [nodeResolve(), terser()],
  },
];
