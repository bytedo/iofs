/**
 *
 * @authors yutent (yutent@doui.cc)
 * @date    2015-12-28 14:28:38
 *
 */
'use strict'

const FS = require('fs')
const PATH = require('path')

const ERROR_FN = (err, res) => {
  if (err) {
    console.error(err)
  }
}

const Iofs = {
  origin: FS,

  /**
   * [cat 文件读取]
   * @param  {String} file [文件路径]
   * @param  {Function} cb   [回调] 可选
   */
  cat(file) {
    try {
      return FS.readFileSync(file)
    } catch (err) {
      if (err) {
        console.error(err + '')
      }
      return null
    }
  },

  /**
   * [ls 读取整个目录(不遍历子目录)]
   * @param  {string} dir [目标路径]
   * @param  {boolean} recursion [是否递归遍历子目录]
   * @return {array}      [返回目标目录所有文件名和子目录名, 不包括'.'和'..']
   */
  ls(dir, recursion) {
    try {
      var list = FS.readdirSync(dir)

      list.forEach((it, i) => {
        list[i] = PATH.resolve(dir, it)
      })

      if (recursion) {
        var tmp = list.concat()
        tmp.forEach(it => {
          if (this.isdir(it)) {
            list = list.concat(this.ls(it, true))
          }
        })
      }
      return list
    } catch (err) {
      if (err) {
        console.error(err + '')
      }
      return null
    }
  },

  /**
   * [echo 写文件]
   * @param  {String|Buffer|Number} data   [要写入的数据]
   * @param  {String} file   [要写的文件]
   * @param  {Boolean} append [是否在后面追加，默认否]
   * @param  {String} encode [编码, 默认utf8]
   */
  echo(data, file, append, encode) {
    if (!file) {
      return data
    }

    var updir = PATH.parse(file).dir
    var opt = {}
    if (!this.isdir(updir)) {
      this.mkdir(updir)
    }

    if (append && typeof append === 'string') {
      encode = append
      append = false
      opt.encoding = encode
    } else {
      if (typeof encode === 'string') {
        opt.encoding = encode
      }
    }

    if (!!append) {
      FS.appendFileSync(file, data, opt, ERROR_FN)
    } else {
      FS.writeFileSync(file, data, opt, ERROR_FN)
    }
  },

  //修改权限
  chmod(path, mode) {
    FS.chmodSync(path, mode, ERROR_FN)
  },

  /**
   * [mv 移动文件,兼具重命名功能]
   * @param  {String} origin [原路径/原名]
   * @param  {String} target   [目标路径/新名]
   */
  mv(origin, target) {
    var updir = PATH.parse(target).dir
    if (!this.isdir(updir)) {
      this.mkdir(updir)
    }

    FS.rename(origin, target, err => {
      if (err) {
        var rs = FS.createReadStream(origin)
        var ws = FS.createWriteStream(target)

        rs.pipe(ws)
        rs.on('end', err => {
          this.rm(origin)
        })
      }
    })
  },

  cp(origin, target) {
    var updir = PATH.parse(target).dir
    if (!this.isdir(updir)) {
      this.mkdir(updir)
    }

    var rs = FS.createReadStream(origin)
    var ws = FS.createWriteStream(target)

    rs.pipe(ws)
  },

  /**
   * [rm 删除文件/目录]
   * @param  {[type]} origin      [源文件/目录路径]
   * @param  {[type]} recursion [是否递归删除，若删除目录，此值须为true]
   */
  rm(origin, recursion) {
    if (recursion) {
      var list = this.ls(origin)
      list.forEach(it => {
        this.rm(it, this.isdir(it))
      })
      FS.rmdirSync(origin, ERROR_FN)
    } else {
      FS.unlinkSync(origin, ERROR_FN)
    }
  },

  /**
   * [stat 返回文件/目录的状态信息]
   * @param  {[type]} path [目标路径]
   */
  stat(path) {
    try {
      return FS.statSync(path)
    } catch (err) {
      return null
    }
  },

  /**
   * [isdir 判断目标是否为目录]
   * @param  {String} path [目标路径]
   */
  isdir(path) {
    try {
      return this.stat(path).isDirectory()
    } catch (err) {
      return false
    }
  },

  /**
   * [mkdir 新建目录]
   * @param  {String} dir [目标路径]
   */
  mkdir(dir) {
    var updir = PATH.parse(dir).dir
    if (!updir) {
      return
    }

    if (!this.isdir(updir)) {
      this.mkdir(updir)
    }

    FS.mkdirSync(dir, ERROR_FN)
  },

  /**
   * [exists 判断目标(文件/目录)是否存在]
   * @param  {String} file [目标路径]
   */
  exists(file) {
    return FS.existsSync(file)
  }
}

module.exports = Iofs
