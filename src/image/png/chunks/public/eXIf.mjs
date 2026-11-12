import { readEXIF } from '../../../../exif/EXIF.mjs';
import { registerChunk } from '../registry.mjs';

registerChunk('eXIf', { max: 1 }, (chunk, state, warnings) => {
  const exif = readEXIF(chunk.data, warnings);

  chunk.toString = () => exif.toString();
});
