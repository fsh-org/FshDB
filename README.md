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
- `set(key, value)` - Sets a value to a key (can be any standard type)
- `get(key)` - Gets the value of a key
- `has(key)` - Checks for a key in the db return true or false
- `remove(key)` - Removes a key from the db
- `find(function)` - Returns a list of keys which values follow the function
- `all()` - Gets the whole database as object
- `backup(file)` - Backups the db file to another file (big dbs will take some time)

### Number values
Functions for values that are of type number (Values will be converted)
- `add(key, number)` - Adds the number to the current
- `sub(key, number)` - Subtracts the number to the current

### Array values
Functions for values that are of type array
- `push(key, value)` - Pushes value into the list element
- `pull(key, index)` - Removes element at index
- `pop(key)` - Removes last element (return removed value)
- `flat(key)` - Flattens array at key
- `concat(key, value)` - Concats a array to the current one
