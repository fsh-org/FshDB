const fs = require('fs');

class DB {
  constructor(file='DB.json', options={}) {
    this.file = file ?? 'DB.json';
    if (!fs.existsSync(this.file)) {
      this._setFile({});
    }
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
      if (target[p[i]] === undefined) {
        target[p[i]] = {};
      }
      target = target[p[i]];
    }
    target[p[p.length - 1]] = value;
    return data;
  }
  set(key, value) {
    let data = this._getFile();
    data = this._setnest(data, key, value)
    this._setFile(data);
  }
  get(key) {
    let data = this._getFile();
    let p = key.split('.');
    for (let i= 0; i < p.length; i++) {
      data = data[p[i]]
    }
    return data
  }
  has(key) {
    let data = this._getFile();
    return data[key] !== undefined;
  }
  remove(key) {
    let data = this._getFile();
    delete data[key];
    this._setFile(data);
  }
  find(func) {
    let data = this._getFile();
    let match = [];
    Object.keys(data).forEach(key => {
      if (func(data[key], key)) {
        match.push(key);
      }
    })
    return match;
  }
  keys() {
    return Object.keys(this._getFile());
  }
  values() {
    return Object.values(this._getFile());
  }
  all() {
    return this._getFile();
  }
  backup(file) {
    this._setFile(this._getFile(), file);
  }
  add(key, number) {
    let data = this._getFile();
    data[key] = (Number(data[key]) || 0) + number;
    this._setFile(data);
  }
  sub(key, number) {
    let data = this._getFile();
    data[key] = (Number(data[key]) || 0) - number;
    this._setFile(data);
  }
  push(key, value) {
    let data = this._getFile();
    data[key].push(value);
    this._setFile(data);
  }
  pull(key, index) {
    let data = this._getFile();
    data[key] = data[key].slice(0,index).concat(data[key].slice(index+1,data[key].length));
    this._setFile(data);
  }
  pop(key) {
    let data = this._getFile();
    let value = data[key].pop();
    this._setFile(data);
    return value;
  }
  flat(key) {
    let data = this._getFile();
    data[key] = data[key].flat();
    this._setFile(data);
  }
  concat(key, value) {
    let data = this._getFile();
    data[key] = data[key].concat(value);
    this._setFile(data);
  }
}

module.exports = DB;
