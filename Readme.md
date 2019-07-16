![module info](https://nodei.co/npm/iofs.png?downloads=true&downloadRank=true&stars=true)

# iofs
> `iofs`是一个基于原生`fs`模块封装的工具, 旨在提供更加方便实用一些常用的API方法(同步), API习惯参考了`bash shell`, 习惯用命令行的朋友, 可能会比较亲切。

## 属性 

### origin
> 返回原生的`fs`模块对象, 方便调用一些未封装的额外功能



## APIs

### .cat(file)
- file `<String>` 文件路径

> 读取文件, 返回一个`Buffer对象`



### .ls(path, recursion)
- path `<String>`
- recursion `<Boolean>`

> 列出指定目录下的所有文件&目录, 不包括 '.' and '..'. 结果返回一个数组.
> 如果参数`recursion`设为ture, 则会递归遍历所有子目录.


### echo(data, file[, append][, encode])
- data `<String>` | `<Buffer>` | `<Number>`
- file `<String>`
- append `<Boolean>` optional
- encode `<String>` optional

> 写数据到指定文件中. 如果指定文件不存在, 则自动生成.
> 如果`append`设为true, 则往文件后面追加数据, 不会覆盖.
> `encode`为指定编码, 默认utf8.

```javascript
var fs = require('iofs')

fs.echo('hello ', 'test.txt') // 如果test.txt存在, 则覆盖.

fs.echo('world', 'test.txt', true) // 不会覆盖, 只会追加到 test.txt中

```




### chmod(file, mode)
- file `<String>` | `<Buffer>`
- mode `<Integer>`

> 修改文件&目录的权限.

```javascript

fs.chmod('test.txt', 777)

```


### mv(from, to)
- from `<String>`
- to `<String>`

> 移动文件, 支持跨磁盘移动; 同时具备重命名功能。



### cp(from, to)
- from `<String>`
- to `<String>`

> 复制文件.



### rm(path, recursion)
- path `<String>`
- recursion `<Boolean>`

> 删除文件, 如果要删除目录&子目录, `recursion`必须设为true.

```javascript

fs.rm('./foo/test.txt')

fs.rm('./foo', true)

```



### stat(path)
- path `<String>`

> 返回文件的状态信息, 如修改时间, 文件大小等


### isdir(path)
- path `<String>`

> 判断指定目录是否为一个目录, 路径不存在或者不是目录都会返回 false.



### mkdir(path)
- path `<String>`

> 创建目录, 可自动创建上级目录(如不存在)



### exists(path)
- path `<String>`

> 判断文件&目录是否存在