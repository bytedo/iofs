![module info](https://nodei.co/npm/iofs.png?downloads=true&downloadRank=true&stars=true)

# iofs
> `iofs`是一个基于原生`fs`模块封装的工具, 旨在提供更加方便实用一些常用的API方法(同步), API习惯参考了`bash shell`, 习惯用命令行的朋友, 可能会比较亲切。

## 更新日志
[Change Logs](./History.md)


## API
+ props
  - [origin](#origin)
+ methods
  - [.cat(file)](#catfile)
  - [.ls(path, recursive)](#lspath-recursive)
  - [.echo(data, file, append, encode)](#echodata-file-append-encode)
  - [.chmod(path, mode)](#chmodpath-mode)
  - [.chown(path, uid, gid)](#chownpath-uid-gid)
  - [.mv(origin, target)](#mvorigin-target)
  - [.cp(origin, target)](#cporigin-target)
  - [.rm(origin)](#rmorigin)
  - [.stat(path)](#statpath)
  - [.isdir(path)](#isdirpath)
  - [.mkdir(dir, mode)](#mkdirdir-mode)
  - [.exists(path)](#existspath)


## 属性 

### origin
> 返回原生的`fs`模块对象, 方便调用一些未封装的额外功能



## APIs
> 所有API均支持在最后传入一个 `silently<Boolean>`参数(v1.3.2新增), 用于静默执行, 不打印错误日志

### .cat(file)
> 读取文件, 返回一个`Buffer对象`

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| file |  `<String>`  |  是  | 要读取的文件路径 |

---


### .ls(path, recursive)
> 列出指定目录下的所有文件&目录, 不包括 '.' and '..'. 结果返回一个数组.

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| path |  `<String>`  |  是  | 要读取的目录 |
| recursive |  `<String>`  |  否  | 是否递归读取 |

---

### .echo(data, file, append, encode)
> 写数据到指定文件中. 如果指定文件不存在, 则自动生成.

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| data |  `<String>` `<Buffer>` `<Number>` |  是  | 要写入的数据, 可以字符串、Buffer对象, 数字 |
| file |  `<String>`  |  是  | 要写入的文件名, 不存在会自动创建, 如存在会覆盖 |
| append |  `<Boolean>`  |  否  | 是否在文件后追加数据, 默认否, 即会整个文件替换 |
| encode |  `<String>`  |  否  | 指定保存的编码, 默认utf8 |


```javascript
var fs = require('iofs')

fs.echo('hello ', 'test.txt') // 如果test.txt存在, 则覆盖.
fs.echo('world', 'test.txt', true) // 不会覆盖, 只会追加到 test.txt中

```

---


### .chmod(path, mode)
> 修改文件&目录的权限.

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| path |  `<String>`|  是  | 要修改的文件&目录路径 |
| mode |  `<Number>`  |  是  | 权限码 `0o000 - 0o777` |


```javascript

fs.chmod('test.txt', 0o777)

```

---


### .chown(path, uid, gid)
> 修改文件&目录的归属。
>> `v1.3.0 新增`

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| path |  `<String>`|  是  | 要修改的文件&目录路径 |
| uid |  `<Number>`  |  是  | 用户ID |
| gid |  `<Number>`  |  是  | 用户组ID |



---




### .mv(origin, target)
> 移动文件&目录, 支持跨磁盘移动; 同时具备重命名功能。
>> `v1.3.0 之后支持对目录进行操作`

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| origin |  `<String>`|  是  | 要移动或重命名的文件&目录 |
| target |  `<String>`  |  是  | 目标文件名&目录名 |


---


### .cp(origin, target)
> 复制文件&目录, 支持跨磁盘复制。
>> `v1.3.0 之后支持对目录进行操作`

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| origin |  `<String>`|  是  | 要复制的文件&目录 |
| target |  `<String>`  |  是  | 目标文件名&目录名 |


---


### .rm(origin)
> 删除文件&目录
>> `v1.3.0 之后取消第2个参数, 改为自动判断是否目录, 是否自动递归删除`

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| origin |  `<String>`|  是  | 要删除的文件&目录 |

```javascript

fs.rm('./foo/test.txt')
fs.rm('./foo') // 整个目录删除

```


---



### .stat(path)
> 返回文件&目录的状态信息, 如修改时间, 文件大小等

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| path |  `<String>`|  是  | 要读取的目录&文件 |




---


### .isdir(path)
> 判断指定目录是否为一个目录, 路径不存在或者不是目录都会返回 false.

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| path |  `<String>`|  是  | 要读取的目录路径 |

---

### .mkdir(dir)
> 创建目录, 会自动创建上级目录(如不存在)

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| dir |  `<String>`|  是  | 要创建的目录名 |


---

### .exists(path)
> 判断文件&目录是否存在

| 参数 | 类型 | 是否必须 | 说明 |
| :--: | :--: | :--: | -- |
| path |  `<String>`|  是  | 要读取的目录&文件 |