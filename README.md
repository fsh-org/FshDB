# FshDB Mini
A lightweight & fast json database with only the essentials\
Minimal version of FshDB

```js
const FshDB = require('fshdb-mini')

// Creating the db
let DB = new FshDB('./path.json')

// Setting data
DB.set('key', 'value')
```

## Functions
- `set(key, value)` - Sets a value to a key (can be any standard type)
- `get(key)` - Gets the value of a key
- `remove(key)` - Removes a key from the db
- `find(function)` - Returns a list of keys which values follow the function
- `all()` - Gets the whole database as object
- `backup(file)` - Backups the db file to another file (big dbs will take some time)
