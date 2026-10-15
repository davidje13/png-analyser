import { rootv } from './nodes/rootv.mjs';

/**
 * @param {import('./tokeniser.mjs').NodeToken} root
 * @param {Map<number, import('./mkBT.mjs').mkBTChunk>} mkbts
 */
export function parseRoot(root, mkbts) {
	if (root.id !== 'rootv') {
		throw new Error('Not a root node');
	}
	return new rootv(root.value, mkbts);
}
