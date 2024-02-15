# FshDB
A lightweight & fast json database with the essentials

```js
const FshDB = require('fshdb')

// Creating the db
let DB = new FshDB('./path.json')

// Setting data
DB.set('key', 'value')
```

## Functions
- `set(key, value)` - Sets a value to a key
- `get(key)` - Gets the value of a key
- `has(key)` - Is there a key in the db
- `remove(key)` - Removes a key from the db
- `all()` - Gets the whole databse as object
