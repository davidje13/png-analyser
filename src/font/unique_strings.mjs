export class UniqueStrings {
  constructor() {
    /** @type {string[]} */ this.strings = [];
  }

  get length() {
    return this.strings.length;
  }

  /**
   * @param {string} string
   * @return {number}
   */
  add(string) {
    let p = this.strings.indexOf(string);
    if (p === -1) {
      p = this.strings.length;
      this.strings.push(string);
    }
    return p;
  }
}
