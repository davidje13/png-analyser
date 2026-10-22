import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const basedir = dirname(fileURLToPath(import.meta.url));

export default [
	{
		input: join(basedir, 'web', 'index.mjs'),
		output: {
			file: join(basedir, 'build', 'static', 'index.mjs'),
			format: 'esm',
		},
		plugins: [nodeResolve(), terser()],
	},
];
