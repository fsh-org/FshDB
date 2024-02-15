/*
  Functions:
  set(key, value)
  get(key)
  has(key)
  remove(key)
*/

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
      setFile(file, '{}');
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
}

module.exports = DB;
