const fs = require('node:fs');

class DB {
  constructor(file='DB.json', options={}) {
    this.file = file ?? 'DB.json';
    if (!fs.existsSync(this.file)) this._setFile({});
    this.compact = Boolean(options?.compact);
    this.warm = Boolean(options?.warm);
    if (this.warm) this.contents = {};
  }
  _getFile() {
    if (this.warm) return this.contents;
    let contents = fs.readFileSync(this.file, 'utf8');
    try {
      contents = JSON.parse(contents);
    } catch (err) {
      throw new Error(this.file + ' is corrupted');
    }
    return contents;
  }
  _setFile(contents, file=this.file) {
    if (this.warm && file!==this.file) {
      this.contents = contents;
      return;
    }
    fs.writeFileSync(file,
      (this.compact ?
      JSON.stringify(contents) :
      JSON.stringify(contents, null, 2)),
      { overwrite: true });
  }
  _setnest(data, key, value) {
    let p = key.split('.');
    let target = data;
    for (let i = 0; i < p.length - 1; i++) {
      if (target[p[i]] === undefined) target[p[i]] = {};
      target = target[p[i]];
    }
    target[p[p.length - 1]] = value;
    return data;
  }
  _getnest(data, key) {
    let p = key.split('.');
    let target = data;
    for (let i = 0; i < p.length; i++) {
      if (target == null) return undefined;
      target = target[p[i]];
    }
    return target;
  }
  _hasnest(data, key) {
    let p = key.split('.');
    let target = data;
    for (let i = 0; i < p.length; i++) {
      if (!Object.hasOwn(target, p[i])) return false;
      target = target[p[i]];
    }
    return true;
  }
  _removenest(data, key) {
    let p = key.split('.');
    let target = data;
    for (let i = 0; i < p.length - 1; i++) {
      if (!target[p[i]]) return data;
      target = target[p[i]];
    }
    delete target[p[p.length - 1]];
    return data;
  }
  set(key, value) {
    this._setFile(this._setnest(this._getFile(), key, value));
  }
  get(key) {
    return this._getnest(this._getFile(), key);
  }
  has(key) {
    return this._hasnest(this._getFile(), key);
  }
  remove(key) {
    this._setFile(this._removenest(this._getFile(), key));
  }
  find(func) {
    let data = this._getFile();
    let match = [];
    Object.keys(data).forEach(key => {
      if (func(data[key], key)) match.push(key);
    });
    return match;
  }
  all() {
    return this._getFile();
  }
  backup(file) {
    this._setFile(this._getFile(), file);
  }
  add(key, number) {
    let data = this._getFile();
    let current = Number(this._getnest(data, key)) || 0;
    this._setFile(this._setnest(data, key, current + number));
  }
  sub(key, number) {
    let data = this._getFile();
    let current = Number(this._getnest(data, key)) || 0;
    this._setFile(this._setnest(data, key, current - number));
  }
  push(key, value) {
    let data = this._getFile();
    let arr = this._getnest(data, key);
    if (!Array.isArray(arr)) arr = [];
    arr.push(value);
    this._setFile(this._setnest(data, key, arr));
  }
  pull(key, index) {
    let data = this._getFile();
    let arr = this._getnest(data, key);
    if (!Array.isArray(arr)) return;
    arr.splice(index, 1);
    this._setFile(this._setnest(data, key, arr));
  }
  pop(key) {
    let data = this._getFile();
    let arr = this._getnest(data, key);
    if (!Array.isArray(arr)) return;
    let value = arr.pop();
    this._setFile(this._setnest(data, key, arr));
    return value;
  }
  flat(key, number=1) {
    let data = this._getFile();
    let arr = this._getnest(data, key);
    if (!Array.isArray(arr)) return;
    arr = arr.flat(number);
    this._setFile(this._setnest(data, key, arr));
  }
  concat(key, value) {
    let data = this._getFile();
    let arr = this._getnest(data, key);
    if (!Array.isArray(arr)) return;
    arr = arr.concat(value);
    this._setFile(this._setnest(data, key, arr));
  }
}

module.exports = DB;
