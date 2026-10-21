import { rootv } from '../nodes/rootv.mjs';

/**
 * @typedef {{
 *   root: rootv;
 *   frame: number;
 *   svg: SVGSVGElement;
 *   left: number;
 *   top: number;
 *   width: number;
 *   height: number;
 *   nextID: () => string,
 *   addDef: (o: SVGElement | ((id: string) => SVGElement), ref?: string) => string;
 * }} ImageGlobals
 */
