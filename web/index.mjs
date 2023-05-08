import { readPNG } from '../src/png.mjs';

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
drop.classList.add('drop-target');
drop.append('Drop a PNG file here');

drop.addEventListener('dragover', (e) => {
  e.preventDefault();
});
drop.addEventListener('dragenter', () => {
  drop.classList.add('active');
});
drop.addEventListener('dragleave', () => {
  drop.classList.remove('active');
});
drop.addEventListener('dragend', () => {
  drop.classList.remove('active');
});
drop.addEventListener('drop', (e) => {
  e.preventDefault();
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
  }
});

document.body.append(drop);
document.body.append(out);
