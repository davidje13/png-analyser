import { readPNG } from '../src/png.mjs';
import { printNice } from '../src/pretty.mjs';

/**
 * @param {ArrayBuffer} data
 */
async function process(data) {
  const png = readPNG(data);

  const output = document.createElement('section');
  output.classList.add('output');

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

  for (const { name, type, data, advance, write, display, ...parsed } of png.chunks) {
    const oSummaryExtra = document.createElement('span');
    const oData = document.createElement('div');
    oData.classList.add('chunk-value');
    let anyContent = false;
    if (display) {
      display(oSummaryExtra, oData);
      anyContent = oData.childNodes.length > 0;
    } else {
      const content = printNice(parsed);
      oData.append(content);
      anyContent = content !== '{}';
    }
    const oHeader = document.createElement('span');
    oHeader.classList.add('chunk-header');
    oHeader.append(`${name} [${data.byteLength}]`);
    if (anyContent) {
      const oDetails = document.createElement('details');
      oDetails.setAttribute('open', 'open');
      oDetails.classList.add('chunk');
      const oSummary = document.createElement('summary');
      oSummary.append(oHeader, ' ', oSummaryExtra);
      oDetails.append(oSummary, oData);
      output.append(oDetails);
    } else {
      const oItem = document.createElement('div');
      oItem.classList.add('chunk');
      oItem.append(oHeader, ' ', oSummaryExtra);
      output.append(oItem);
    }
  }
  out.append(output);
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

  out.innerText = '';

  if (e.dataTransfer?.items) {
    for (let i = 0; i < e.dataTransfer.items.length; ++i) {
      e.dataTransfer.items[i]
        .getAsFile()
        ?.arrayBuffer()
        .then((d) => process(d))
        .catch((e) => console.error(e));
    }
  }
});

document.body.append(drop);
document.body.append(out);
