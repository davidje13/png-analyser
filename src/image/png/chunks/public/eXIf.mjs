import { el } from '../../../../display/pretty.mjs';
import { readEXIF } from '../../../../exif/EXIF.mjs';
import { registerChunk } from '../registry.mjs';

registerChunk('eXIf', { max: 1 }, (chunk, state, warnings) => {
  const exif = readEXIF(chunk.data, warnings);

  chunk.toString = () => exif.toString();
  chunk.display = (summary, content) => {
    content.append(exif.toString());
    const thumbnail = exif.extractThumbnailDataURI();
    if (thumbnail) {
      content.append('\n\nThumbnail image:\n', el('img', { src: thumbnail, height: 128 }));
    }
  };
});
