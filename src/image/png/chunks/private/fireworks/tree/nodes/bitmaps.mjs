import { tilesAsCanvas } from '../../../../../../../display/pretty.mjs';
import { getBasicValue, nodeBasicValue, registerNode } from '../node_registry.mjs';

registerNode('TIDi', { // Tile ID
  read: (target, value, state) => {
    const mkbt = state.mkbts?.get(value);
    if (!mkbt) {
      state.warnings.push(`Missing mkBT tile ID ${value.toString(16).padStart(8, '0')}`);
    }
    target.mkbt = mkbt;
    target.toString = () => mkbt?.toString() ?? value.toString(16).padStart(8, '0');
    target.display = (summary, content) => {
      summary.append('Tile: ');
      mkbt?.display(summary, content);
    };
  },
});

registerNode('IMGv', { // IMaGe
  read: (target, value, state) => {
    const locked = getBasicValue(value, 'LCKb') ?? false;
    const xOf = getBasicValue(value, 'XOFf') ?? 0; // TODO: what is this?
    const yOf = getBasicValue(value, 'YOFf') ?? 0; // TODO: what is this?
    const xLocation = getBasicValue(value, 'XLCf') ?? 0;
    const yLocation = getBasicValue(value, 'YLCf') ?? 0;
    const width = getBasicValue(value, 'WPXi') ?? 0;
    const height = getBasicValue(value, 'HPXi') ?? 0;
    const tileSize = getBasicValue(value, 'TSZi') ?? 0;
    const tiles = getBasicValue(value, 'TILv') ?? [];
    const tileData = extractTiles(width, height, tiles, tileSize, state.warnings);
    target.xLocation = xLocation;
    target.yLocation = yLocation;
    target.width = width;
    target.height = height;
    const toString = () => `Image: ${width} x ${height} @${xLocation}, ${yLocation} / ${xOf}, ${yOf}${locked ? ' locked' : ''}`;
    target.toString = toString;
    target.display = (summary, content) => {
      summary.append(toString());
      content.append(tilesAsCanvas(tileData));
    };

    target.toSVG = (parts) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      element.setAttribute('x', String(xLocation));
      element.setAttribute('y', String(yLocation));
      element.setAttribute('width', String(width));
      element.setAttribute('height', String(height));
      element.setAttribute('href', tilesAsCanvas(tileData).toDataURL('image/png'));
      parts.push({
        element,
        bounds: { minX: xLocation, minY: yLocation, maxX: xLocation + width, maxY: yLocation + height },
      });
    };
  },
});

registerNode('MSKv', { // MaSK
  read: (target, value, state) => {
    const width = getBasicValue(value, 'WPXi') ?? 0;
    const height = getBasicValue(value, 'HPXi') ?? 0;
    const tileSize = getBasicValue(value, 'TSZi') ?? 0;
    const tiles = getBasicValue(value, 'TILv') ?? [];
    const tileData = extractTiles(width, height, tiles, tileSize, state.warnings);
    target.toString = () => `Mask: ${width} x ${height}`;
    target.display = (summary, content) => {
      summary.append(target.toString());
      content.append(tilesAsCanvas(tileData));
    };
  },
});

/**
 * @typedef {import('../../mkBT.mjs').mkBTChunk} mkBTChunk
 * @typedef {import('../../../../../../../display/pretty.mjs').TileData} TileData
 *
 * @param {number} width
 * @param {number} height
 * @param {import('../node_registry.mjs').ProcessedNode[]} tiles
 * @param {number} tileSize
 * @param {string[]} warnings
 * @return {TileData}
 */
function extractTiles(width, height, tiles, tileSize, warnings) {
  const nx = Math.ceil(width / tileSize);
  const ny = Math.ceil(height / tileSize);
  if (tiles.length !== nx * ny) {
    warnings.push(`expected ${nx * ny} tiles, got ${tiles.length}`);
  }

  /** @type {TileData} */ const r = { width, height, tiles: [] };
  for (let y = 0; y < ny; ++y) {
    for (let x = 0; x < nx; ++x) {
      const px = x * tileSize;
      const py = y * tileSize;
      const tile = tiles[y * nx + x];
      if (tile?.id === 'TIDi' && tile.mkbt) {
        const mkbt = /** @type {mkBTChunk} */ (tile.mkbt);
        if (mkbt.img) {
          r.tiles.push({ type: 'i', x: px, y: py, value: mkbt.img() });
          continue;
        }
      }
      const tmci = nodeBasicValue(tile, 'TMCi') ?? 0xFFFF0000;
      r.tiles.push({ type: 'c', x: px, y: py, value: tmci, w: tileSize, h: tileSize });
    }
  }
  return r;
}
