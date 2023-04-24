export function writeBuf(b) {
  const all = [''];
  for (let i = 0; i < b.length; i += 16) {
    const rowN = [];
    const rowC = [];
    for (let j = 0; j < 16 && i + j < b.length; ++j) {
      const c = b[i + j];
      rowN.push(c.toString(16).padStart(2, '0'));
      if (c >= 0x20 && c < 0x7F) {
        rowC.push(String.fromCharCode(c));
      } else {
        rowC.push('.');
      }
    }
    all.push(rowN.join(' ') + '   ' + rowC.join(''));
  }
  return all.join('\n') + '\n';
}
