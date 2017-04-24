![module info](https://nodei.co/npm/iofs.png?downloads=true&downloadRank=true&stars=true)

# iofs
> `iofs` is a bash-like module for reading and writing files on Node.js. It base on Node.js's native `fs` module.

## property

### self
> It return the native `fs` module for more requests.



## API

### cat(file)
- file `<String>`

> Just like bash's cat, it will read a file and return a Buffer.



### ls(path, child)
- path `<String>`
- child `<Boolean>`

> List all files and folders of the path given exclude '.' and '..'. I t return an array.
> If para `child` is set to be ture, it will recur list all files of child dir.


### echo(data, file[, append][, encode])
- data `<String>` | `<Buffer>` | `<Number>`
- file `<String>`
- append `<Boolean>` optional
- encode `<String>` optional

> Write/Append data to a file. creating the file if it does not yet exist.
> If `append` is set true, it will append data to the file.
> Default `encode` is utf8.

```javascript
let fs = require('iofs')

fs.echo('hello ', 'test.txt') // replacing test.txt if it exists.

fs.echo('world', 'test.txt', true) // append the data to test.txt

```




### chmod(file, mode)
- file `<String>` | `<Buffer>`
- mode `<Integer>`

> Changes the mode of the file specified whose pathname is given.

```javascript

fs.chmod('test.txt', 777) // replacing test.txt if it exists.

```


### mv(from, to)
- from `<String>`
- to `<String>`

> Move a fil to the target location. It can also use to renaming a file.



### cp(from, to)
- from `<String>`
- to `<String>`

> Copy a fil to the target location.



### rm(path, recursion)
- path `<String>`
- recursion `<Boolean>`

> Delete a file or a folder. If path is a folder, `recursion` must be set to true.

```javascript

fs.rm('./foo/test.txt')

fs.rm('./foo', true)

```



### stat(path)
- path `<String>`

> Returns an instance of fs.Stats.


### isdir(path)
- path `<String>`

> Return true if the path is a folder, and false when it is a file or not yet exists.



### mkdir(path)
- path `<String>`

> Build a folder in where you want.



### exists(path)
- path `<String>`

> Return true if the path exists, and false not.