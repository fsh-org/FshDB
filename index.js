const fs = require('fs')
const write = require('write')

function getFile(file) {
  let contents = fs.readFileSync(file, 'utf8');
  try {
    contents = JSON.parse(contents);
  } catch (err) {
    throw new Error(file + ' is corrupted');
    return;
  }
  return contents;
}
function setFile(file, contents) {
  write.sync(file, JSON.stringify(contents, null, 2), { overwrite: true });
}

class DB {
  constructor(file) {
    this.file = file;
    if (!fs.existsSync(file)) {
      setFile(file, {});
    }
  }
  set(key, value) {
    let data = getFile(this.file);
    data[key] = value;
    setFile(this.file, data);
  }
  get(key) {
    let data = getFile(this.file);
    return data[key];
  }
  has(key) {
    let data = getFile(this.file);
    return !!data[key];
  }
  remove(key) {
    let data = getFile(this.file);
    delete data[key];
    setFile(this.file, data);
  }
  find(func) {
    let data = getFile(this.file);
    let match = [];
    Object.keys(data).forEach(key => {
      if (func(data[key])) {
        match.push(key)
      }
    })
    return match;
  }
  keys() {
    return Object.keys(getFile(this.file))
  }
  all() {
    return getFile(this.file)
  }
  backup(file) {
    setFile(file, getFile(this.file));
  }
  add(key, number) {
    let data = getFile(this.file);
    data[key] = (Number(data[key]) || 0) + number;
    setFile(this.file, data);
  }
  sub(key, number) {
    let data = getFile(this.file);
    data[key] = (Number(data[key]) || 0) - number;
    setFile(this.file, data);
  }
  push(key, value) {
    let data = getFile(this.file);
    data[key].push(value)
    setFile(this.file, data);
  }
  pull(key, index) {
    let data = getFile(this.file);
    data[key] = data[key].slice(0,index).concat(data[key].slice(index+1,data[key].length))
    setFile(this.file, data);
  }
  pop(key) {
    let data = getFile(this.file);
    let value = data[key].pop()
    setFile(this.file, data);
    return value;
  }
  flat(key) {
    let data = getFile(this.file);
    data[key] = data[key].flat()
    setFile(this.file, data);
  }
  concat(key, value) {
    let data = getFile(this.file);
    data[key] = data[key].concat(value)
    setFile(this.file, data);
  }
  oset(key, value) {
    // not secure, not recomended for getting stuff via user input :p
    let data = getFile(this.file);
    let ke = 'data["'+key.replaceAll(/[\\\/"]/g, function(match){return '\\'+match}).split('.').join('"]["')+'"] = value;';
    eval(ke)
    setFile(this.file, data);
  }
  oget(key) {
    let data = getFile(this.file);
    let ke = data;
    key.split('.').forEach(ey => {
      ke = ke[ey]
    })
    return ke;
  }
  okey(key) {
    let data = getFile(this.file);
    let ke = data;
    key.split('.').forEach(ey => {
      ke = ke[ey]
    })
    return Object.keys(ke);
  }
}

module.exports = DB;
