import { COLOURSPACES } from '../src/image/colour.mjs';
import { DIFFUSION_TYPES } from '../src/image/diffusions.mjs';
import { falseColour, SPECTRUM_RED } from '../src/image/actions/false-colour.mjs';
import { scoreFlatness } from '../src/image/actions/score-flatness.mjs';
import { quantise } from '../src/image/actions/dither.mjs';
import { PALETTES } from '../src/image/palettes.mjs';
import { readPNG } from '../src/image/png/png.mjs';
import { asImageData, disclosure, el, makeCanvas } from '../src/display/pretty.mjs';
import { writePNG } from '../src/image/png/png-write.mjs';

/**
 * @param {ArrayBuffer} data
 * @param {string} name
 */
async function processFile(data, name) {
  const output = el('section', { class: 'output' }, [el('h2', {}, [name])]);

  try {
    const png = await readPNG(data);

    if (png.warnings.length > 0) {
      const oDetails = el('details', { open: 'open' }, [el('summary', {}, ['Warnings'])]);
      for (const warning of png.warnings) {
        oDetails.append(el('div', { class: 'warning' }, [warning]));
      }
      output.append(oDetails);
    }

    /** @type {Set<string>} */ const seen = new Set();
    for (const chunk of png.chunks) {
      const oSummary = el('span');
      const oHeader = el('span', { class: 'chunk-header' }, [`${chunk.name}`]);
      const oData = el('div', { class: 'chunk-value' });

      /** @type {HTMLElement} */ let section;
      if (chunk.aggregate) {
        if (seen.has(chunk.name)) {
          continue;
        }
        seen.add(chunk.name);
        const agg = chunk.aggregate();
        const parts = png.chunks.filter((c) => c.name === chunk.name);

        agg.display(oSummary, oData, name);
        oSummary.prepend(oHeader, ` [${parts.map((c) => c.data.byteLength).join(' & ')}] `);
      } else {
        chunk.display(oSummary, oData, name);
        oSummary.prepend(oHeader, ` [${chunk.data.byteLength}] `);
      }
      section = makeDetails(oSummary, oData, !chunk.defaultCollapse);
      section.classList.add('chunk');
      output.append(section);
    }

    const image = png.state.idat?.image;
    if (image) {
      const weights = scoreFlatness(image);

      //const weightsOut = makeCanvas(weights[0]?.length ?? 0, weights.length);
      //weightsOut.ctx.putImageData(asImageData(falseColour(weights, SPECTRUM_RED, 0, 1), false), 0, 0);
      //output.append(weightsOut.canvas);

      const palette = el('select');
      palette.append(el('option', { selected: 'selected' }, ['none']));
      for (let i = 0; i < PALETTES.length; ++i) {
        const opt = el('option');
        if (typeof PALETTES[i].value === 'function') {
          opt.append(PALETTES[i].name);
        } else {
          opt.append(`${PALETTES[i].name} (${PALETTES[i].value.length})`);
        }
        palette.append(opt);
      }

      const colspace = el('select');
      for (let i = 0; i < COLOURSPACES.length; ++i) {
        colspace.append(el('option', { selected: i === 0 ? 'selected' : undefined }, [COLOURSPACES[i].name]));
      }

      const transparent = el('input', { type: 'checkbox', checked: 'checked' }, []);
      const transLabel = el('label', {}, [transparent, 'Transparent']);

      const matte = el('input', { type: 'color', value: '#000000' });
      const matteLabel = el('label', {}, ['Matte ', matte]);

      const amount = el('input', { type: 'range', min: 0, max: 1, step: 'any', value: '0.85' });

      const diffusion = el('select');
      for (let i = 0; i < DIFFUSION_TYPES.length; ++i) {
        diffusion.append(el('option', { selected: i === 1 ? 'selected' : undefined }, [DIFFUSION_TYPES[i].name]));
      }

      const serpentine = el('input', { type: 'checkbox', checked: 'checked' });
      const serpLabel = el('label', {}, [serpentine, 'Serpentine']);

      palette.addEventListener('change', updateDither);
      colspace.addEventListener('change', updateDither);
      transparent.addEventListener('change', updateDither);
      matte.addEventListener('input', updateDither);
      amount.addEventListener('input', updateDither);
      diffusion.addEventListener('change', updateDither);
      serpentine.addEventListener('change', updateDither);

      const save = el('button', { type: 'button' }, ['Save']);

      const options = el('form', { action: '#', class: 'options' });
      options.append(palette, colspace, transLabel, matteLabel, amount, diffusion, serpLabel, save);
      const ditherIn = image;
      const palettePreviewSize = 20;
      const paletteOut = makeCanvas(1, 1);
      const ditherOut = makeCanvas(ditherIn[0]?.length ?? 0, ditherIn.length);
      output.append(options, paletteOut.canvas, el('br'), ditherOut.canvas);
      /** @type {number[][] | null} */ let ditheredData = null;
      /** @type {{ from: number, to: number } | null} */ let highlight = null;
      /** @type {number[]} */ let chosenPalette = [];

      paletteOut.canvas.addEventListener('mouseleave', () => {
        if (highlight) {
          highlight = null;
          redrawPalette();
          redrawImage();
        }
      });
      paletteOut.canvas.addEventListener('mousemove', (e) => {
        const { top, left } = paletteOut.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - left) / palettePreviewSize);
        const y = Math.floor((e.clientY - top) / palettePreviewSize);
        const n = x + y * 64;
        const c = chosenPalette[n];
        if (c === undefined) {
          if (highlight) {
            highlight = null;
            redrawPalette();
            redrawImage();
          }
        } else if (highlight?.from !== c) {
          highlight = {
            from: c,
            to: makeContrastingColour(c),
          };
          redrawPalette();
          redrawImage();
        }
      });

      function redrawPalette() {
        if (!chosenPalette.length) {
          paletteOut.canvas.width = 1;
          paletteOut.canvas.height = 1;
        }
        const pw = Math.min(chosenPalette.length, 64);
        paletteOut.canvas.width = pw * palettePreviewSize;
        paletteOut.canvas.height = Math.ceil(chosenPalette.length / pw) * palettePreviewSize;
        paletteOut.ctx.clearRect(0, 0, paletteOut.canvas.width, paletteOut.canvas.height);
        for (let i = 0; i < chosenPalette.length; ++i) {
          const c = chosenPalette[i];
          const x = (i % pw) * palettePreviewSize;
          const y = Math.floor(i / pw) * palettePreviewSize;
          const w = palettePreviewSize;
          const hw = palettePreviewSize / 2;
          const alpha = c >>> 24;
          if (alpha === 0) {
            paletteOut.ctx.fillStyle = '#FFFFFF';
            paletteOut.ctx.fillRect(x, y, w, w);
            paletteOut.ctx.fillStyle = '#CCCCCC';
            paletteOut.ctx.fillRect(x + hw, y, hw, hw);
            paletteOut.ctx.fillRect(x, y + hw, hw, hw);
          } else if (alpha === 255) {
            paletteOut.ctx.fillStyle = '#' + (c & 0xFFFFFF).toString(16).padStart(6, '0');
            paletteOut.ctx.fillRect(x, y, w, w);
          } else {
            paletteOut.ctx.fillStyle = '#' + (c & 0xFFFFFF).toString(16).padStart(6, '0');
            paletteOut.ctx.fillRect(x, y, w, w);
            paletteOut.ctx.fillStyle = '#' + (alpha * 0x010101).toString(16).padStart(6, '0');
            paletteOut.ctx.fillRect(x + hw, y + hw, hw, hw);
          }
          if (c === highlight?.from) {
            paletteOut.ctx.fillStyle = '#' + (makeContrastingColour(c) & 0xFFFFFF).toString(16).padStart(6, '0');
            paletteOut.ctx.fillRect(x + w / 4, y + w / 4, hw, hw);
          }
        }
      }

      function redrawImage() {
        if (!ditheredData) {
          ditherOut.ctx.clearRect(0, 0, ditherIn[0]?.length ?? 0, ditherIn.length);
          return;
        }
        const h = highlight;
        if (h) {
          const highlighted = ditheredData.map((row) => row.map((c) => c === h.from ? h.to : c));
          ditherOut.ctx.putImageData(asImageData(highlighted, true), 0, 0);
        } else {
          ditherOut.ctx.putImageData(asImageData(ditheredData, true), 0, 0);
        }
      }

      save.addEventListener('click', () => {
        save.setAttribute('disabled', 'disabled');
        save.innerText = 'Compressing...';

        setTimeout(() => {
          const output = writePNG(ditheredData ?? image, console.log, {
            preserveTransparentColour: false,
            compressionTimeAllotment: 20000,
          });
          const blob = new Blob([/** @type {Uint8Array<any>} */ (output.data.toBytes())], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          el('a', { href: url, download: name }).click();
          // not sure when it's safe to revoke the URL, but this works...
          setTimeout(() => URL.revokeObjectURL(url), 0);

          save.removeAttribute('disabled');
          save.innerText = 'Save';
        }, 0);
      });

      function updateDither() {
        if (palette.selectedIndex === 0) {
          chosenPalette = [];
          ditheredData = null;
          redrawPalette();
          redrawImage();
          return;
        }
        const paletteSource = PALETTES[palette.selectedIndex-1].value;
        if (typeof paletteSource === 'function') {
          chosenPalette = paletteSource(ditherIn, weights);
        } else if (transparent.checked && !paletteSource.includes(0)) {
          chosenPalette = [0, ...paletteSource];
        } else {
          chosenPalette = paletteSource;
        }
        ditheredData = quantise(ditherIn, chosenPalette, {
          colourspaceConversion: COLOURSPACES[colspace.selectedIndex].fromSRGB,
          dither: {
            matte: transparent.checked ? -1 : Number.parseInt(matte.value.substring(1), 16),
            amount: Number.parseFloat(amount.value),
            diffusion: DIFFUSION_TYPES[diffusion.selectedIndex].value,
            serpentine: serpentine.checked,
          },
        });
        redrawPalette();
        redrawImage();
      }
      setTimeout(updateDither, 0);
    }
  } catch (e) {
    if (e && typeof e === 'object' && /** @type {any} */ (e).message) {
      output.append(/** @type {any} */ (e).message);
    } else {
      output.append(String(e));
    }
    console.error(e);
  }
  out.append(output);
}

/** @param {number} c */
function makeContrastingColour(c) {
  if (((c >> 16) & 0xFF) >= 0x80 && ((c >> 8) & 0xFF) < 0x80 && (c & 0xFF) < 0x80) {
    return 0xFF0000FF;
  }
  return 0xFFFF0000;
}

/**
 * @param {HTMLElement} summary
 * @param {HTMLElement} content
 * @param {boolean} open
 * @return {HTMLElement}
 */
function makeDetails(summary, content, open) {
  if (!content.childNodes.length) {
    return el('div', {}, [summary]);
  }
  return disclosure(summary, content, open);
}

const out = el('div');

const drop = el('div', { class: 'drop' }, ['Drop a PNG file here']);
let dragc = 0;

window.addEventListener('dragover', (e) => {
  e.preventDefault();
});
window.addEventListener('dragenter', () => {
  ++dragc;
  drop.classList.add('active');
});
window.addEventListener('dragleave', () => {
  if (!--dragc) {
    drop.classList.remove('active');
  }
});
window.addEventListener('dragend', () => {
  dragc = 0;
  drop.classList.remove('active');
});
window.addEventListener('drop', (e) => {
  e.preventDefault();
  dragc = 0;
  drop.classList.remove('active');

  document.title = 'PNG Analyser';
  out.innerText = '';

  if (e.dataTransfer?.items) {
    for (let i = 0; i < e.dataTransfer.items.length; ++i) {
      const file = e.dataTransfer.items[i].getAsFile();
      file?.arrayBuffer().then((d) => processFile(d, file.name));
      if (file && e.dataTransfer.items.length === 1) {
        document.title = `${file.name} \u2014 PNG Analyser`;
      }
    }
    document.body.classList.add('hasoutput');
  } else {
    document.body.classList.remove('hasoutput');
  }
});

document.body.append(drop);
document.body.append(out);
