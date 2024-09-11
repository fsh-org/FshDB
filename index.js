const fs = require('fs')

function getFile(file) {
  let contents = fs.readFileSync(file, 'utf8');
  try {
    contents = JSON.parse(contents);
  } catch (err) {
    throw new Error(file + ' is corrupted');
  }
  return contents;
}
function setFile(file, contents, sync = true, that = '') {
  if (sync) {
    fs.writeFileSync(file, JSON.stringify(contents, null, 2), { overwrite: true });
  } else {
    that.stream.write(JSON.stringify(contents, null, 2), err=>err);
  }
}

function setnest(data, key, value) {
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

class DB {
  constructor(file) {
    this.file = (file === undefined ? 'DB.json' : file);
    if (!fs.existsSync(this.file)) {
      setFile(this.file, {});
    }
  }
  set(key, value) {
    let data = getFile(this.file);
    data = setnest(data, key, value)
    setFile(this.file, data);
  }
  get(key) {
    let data = getFile(this.file);
    let p = key.split('.');
    for (let i= 0; i < p.length; i++) {
      data = data[p[i]]
    }
    return data
  }
  has(key) {
    let data = getFile(this.file);
    return data[key] !== undefined;
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
  values() {
    return Object.values(getFile(this.file))
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
  okey(key) {
    let data = getFile(this.file);
    let ke = data;
    key.split('.').forEach(ey => {
      ke = ke[ey]
    })
    return Object.keys(ke);
  }
}

class miniDB {
  constructor(file) {
    this.file = (file === undefined ? 'DB.json' : file);
    if (!fs.existsSync(this.file)) {
      setFile(this.file, {});
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
    return data[key] !== undefined;
  }
  remove(key) {
    let data = getFile(this.file);
    delete data[key];
    setFile(this.file, data);
  }
  all() {
    return getFile(this.file)
  }
  backup(file) {
    setFile(file, getFile(this.file));
  }
}

class fastDB {
  constructor(file) {
    this.file = (file === undefined ? 'DB.json' : file);
    this.stream = fs.createWriteStream(file, { flags: 'w' });
    this.cont = {};
    if (!fs.existsSync(this.file)) {
      setFile(this.file, {});
    } else {
      this.cont = getFile(this.file);
    }
  }
  set(key, value) {
    this.cont = setnest(this.cont, key, value);
    setFile(this.file, this.cont, false, this);
  }
  get(key) {
    let data = this.cont;
    let p = key.split('.');
    for (let i= 0; i < p.length; i++) {
      data = data[p[i]]
    }
    return data
  }
  has(key) {
    return this.cont[key] !== undefined;
  }
  remove(key) {
    delete this.cont[key];
    setFile(this.file, this.cont, false, this);
  }
  find(func) {
    let match = [];
    Object.keys(this.cont).forEach(key => {
      if (func(this.cont[key])) {
        match.push(key)
      }
    })
    return match;
  }
  keys() {
    return Object.keys(this.cont)
  }
  values() {
    return Object.values(this.cont)
  }
  all() {
    return this.cont
  }
  backup(file) {
    setFile(file, this.cont);
  }
  add(key, number) {
    this.cont[key] = (Number(this.cont[key]) || 0) + number;
    setFile(this.file, this.cont, false, this);
  }
  sub(key, number) {
    this.cont[key] = (Number(this.cont[key]) || 0) - number;
    setFile(this.file, this.cont, false, this);
  }
  push(key, value) {
    this.cont[key].push(value)
    setFile(this.file, this.cont, false, this);
  }
  pull(key, index) {
    this.cont[key] = this.cont[key].slice(0,index).concat(this.cont[key].slice(index+1,this.cont[key].length))
    setFile(this.file, this.cont, false, this);
  }
  pop(key) {
    let value = this.cont[key].pop()
    setFile(this.file, this.cont, false, this);
    return value;
  }
  flat(key) {
    this.cont[key] = this.cont[key].flat()
    setFile(this.file, this.cont, false, this);
  }
  concat(key, value) {
    this.cont[key] = this.cont[key].concat(value)
    setFile(this.file, this.cont, false, this);
  }
  okey(key) {
    let ke = this.cont;
    key.split('.').forEach(ey => {
      ke = ke[ey]
    })
    return Object.keys(ke);
  }
}

module.exports = { DB, miniDB, fastDB };
