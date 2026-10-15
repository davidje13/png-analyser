import { LSEv } from './LSEv.mjs';
import { MSTv } from './MSTv.mjs';
import { PDCv } from './PDCv.mjs';

/**
 * @typedef {{
 *   sharedLayerDefinitions: Map<string, LSEv>;
 *   symbolDefinitions: Map<number, MSTv>;
 *   pages: Map<string, PDCv>;
 *   mkbts: Map<number, import('../mkBT.mjs').mkBTChunk>;
 * }} ImageGlobals
 */
