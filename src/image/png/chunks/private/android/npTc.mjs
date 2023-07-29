import { registerChunk } from '../../registry.mjs';

/**
 * @typedef {import('../../registry.mjs').State & {
 * }} npTcState
 * @typedef {import('../../registry.mjs').Chunk & {
 * }} npTcChunk
 */

// https://android.googlesource.com/platform/frameworks/base/+/56a2301/include/androidfw/ResourceTypes.h

registerChunk('npTc', { max: 1 }, (/** @type {npTcChunk} */ chunk, /** @type {npTcState} */ state, warnings) => {
});
