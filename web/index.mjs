import { COLOURSPACES } from '../src/image/colour.mjs';
import { DIFFUSION_TYPES } from '../src/image/diffusions.mjs';
import { quantise } from '../src/image/actions/dither.mjs';
import { PALETTES } from '../src/image/palettes.mjs';
import { readPNG } from '../src/image/png/png.mjs';
import { asImageData, makeCanvas } from '../src/display/pretty.mjs';

/**
 * @param {ArrayBuffer} data
 * @param {string} name
 */
async function process(data, name) {
  const output = document.createElement('section');
  output.classList.add('output');
  const header = document.createElement('h2');
  header.append(name);
  output.append(header);

  try {
    const png = readPNG(data);

    if (png.warnings.length > 0) {
      const oDetails = document.createElement('details');
      oDetails.setAttribute('open', 'open');
      const oSummary = document.createElement('summary');
      oSummary.append('Warnings');
      oDetails.append(oSummary);
      for (const warning of png.warnings) {
        const owarn = document.createElement('div');
        owarn.classList.add('warning');
        owarn.append(warning);
        oDetails.append(owarn);
      }
      output.append(oDetails);
    }

    /** @type {Set<string>} */ const seen = new Set();
    for (const chunk of png.chunks) {
      const oSummary = document.createElement('span');
      const oHeader = document.createElement('span');
      oHeader.classList.add('chunk-header');
      oHeader.append(`${chunk.name}`);
      const oData = document.createElement('div');
      oData.classList.add('chunk-value');

      /** @type {HTMLElement} */ let section;
      if (chunk.aggregate) {
        if (seen.has(chunk.name)) {
          continue;
        }
        seen.add(chunk.name);
        const agg = chunk.aggregate();
        const parts = png.chunks.filter((c) => c.name === chunk.name);

        agg.display(oSummary, oData);
        oSummary.prepend(oHeader, ` [${parts.map((c) => c.data.byteLength).join(' & ')}] `);
      } else {
        chunk.display(oSummary, oData);
        oSummary.prepend(oHeader, ` [${chunk.data.byteLength}] `);
      }
      section = makeDetails(oSummary, oData, !chunk.defaultCollapse);
      section.classList.add('chunk');
      output.append(section);
    }

    const image = png.state.idat?.image;
    if (image) {
      const palette = document.createElement('select');
      for (let i = 0; i < PALETTES.length; ++i) {
        const opt = document.createElement('option');
        if (!i) {
          opt.setAttribute('selected', 'selected');
        }
        opt.append(`${PALETTES[i].name} (${PALETTES[i].value.length})`);
        palette.append(opt);
      }

      const colspace = document.createElement('select');
      for (let i = 0; i < COLOURSPACES.length; ++i) {
        const opt = document.createElement('option');
        if (!i) {
          opt.setAttribute('selected', 'selected');
        }
        opt.append(COLOURSPACES[i].name);
        colspace.append(opt);
      }

      const transLabel = document.createElement('label');
      const transparent = document.createElement('input');
      transparent.setAttribute('type', 'checkbox');
      transparent.setAttribute('checked', 'checked');
      transLabel.append(transparent, ' Transparent');

      const matteLabel = document.createElement('label');
      const matte = document.createElement('input');
      matte.setAttribute('type', 'color');
      matte.setAttribute('value', '#000000');
      matteLabel.append(matte, ' Matte');

      const amount = document.createElement('input');
      amount.setAttribute('type', 'range');
      amount.setAttribute('min', '0');
      amount.setAttribute('max', '1');
      amount.setAttribute('step', 'any');
      amount.setAttribute('value', '1');

      const diffusion = document.createElement('select');
      for (let i = 0; i < DIFFUSION_TYPES.length; ++i) {
        const opt = document.createElement('option');
        if (i === 1) {
          opt.setAttribute('selected', 'selected');
        }
        opt.append(DIFFUSION_TYPES[i].name);
        diffusion.append(opt);
      }

      const serpLabel = document.createElement('label');
      const serpentine = document.createElement('input');
      serpentine.setAttribute('type', 'checkbox');
      serpentine.setAttribute('checked', 'checked');
      serpLabel.append(serpentine, ' Serpentine');

      palette.addEventListener('change', updateDither);
      colspace.addEventListener('change', updateDither);
      transparent.addEventListener('change', updateDither);
      matte.addEventListener('input', updateDither);
      amount.addEventListener('input', updateDither);
      diffusion.addEventListener('change', updateDither);
      serpentine.addEventListener('change', updateDither);

      const options = document.createElement('form');
      options.setAttribute('action', '#');
      options.classList.add('options');
      options.append(palette, colspace, transLabel, matteLabel, amount, diffusion, serpLabel);
      const ditherIn = image;
      const ditherOut = makeCanvas(ditherIn[0]?.length ?? 0, ditherIn.length);
      output.append(options, ditherOut.canvas);

      function updateDither() {
        let p = PALETTES[palette.selectedIndex].value;// ?? pickPalette(ditherIn, 8);
        if (transparent.checked && !p.includes(0)) {
          p = [0, ...p];
        }
        const dithered = quantise(ditherIn, p, {
          colourspaceConversion: COLOURSPACES[colspace.selectedIndex].fromSRGB,
          dither: {
            matte: transparent.checked ? -1 : Number.parseInt(matte.value.substring(1), 16),
            amount: Number.parseFloat(amount.value),
            diffusion: DIFFUSION_TYPES[diffusion.selectedIndex].value,
            serpentine: serpentine.checked,
          },
        });
        ditherOut.ctx.putImageData(asImageData(dithered, true), 0, 0);
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

/**
 * @param {HTMLElement} summary
 * @param {HTMLElement} content
 * @param {boolean} open
 * @return {HTMLElement}
 */
function makeDetails(summary, content, open) {
  if (!content.childNodes.length) {
    const oItem = document.createElement('div');
    oItem.append(summary);
    return oItem;
  }
  const oDetails = document.createElement('details');
  if (open) {
    oDetails.setAttribute('open', 'open');
  }
  const oSummary = document.createElement('summary');
  oSummary.append(summary);
  oDetails.append(oSummary, content);
  return oDetails;
}

const out = document.createElement('div');

const drop = document.createElement('div');
drop.classList.add('drop');
drop.append('Drop a PNG file here');
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
      file?.arrayBuffer().then((d) => process(d, file.name));
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
