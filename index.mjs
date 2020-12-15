/**
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/09/19 16:39:59
 */

import FS from 'fs'
import PATH from 'path'

class STATS {
  isFile() {
    return false
  }
  isDirectory() {
    return false
  }
  isSocket() {
    return false
  }
  isSymbolicLink() {
    return false
  }
}

const VERSION = +process.versions.node
  .split('.')
  .slice(0, 2)
  .join('.')

const EMPTY_STAT = new STATS()

export default {
  origin: FS,

  /**
   * [cat 文件读取]
   * @param  {String} file [文件路径]
   * @param  {Function} cb   [回调] 可选
   */
  cat(file, debug) {
    try {
      return FS.readFileSync(file)
    } catch (err) {
      debug && console.error('call cat(): ', err + '')
      return null
    }
  },

  /**
   * [ls 读取整个目录(不遍历子目录)]
   * @param  {string} dir [目标路径]
   * @param  {boolean} recursive [是否递归遍历子目录]
   * @return {array}      [返回目标目录所有文件名和子目录名, 不包括'.'和'..']
   */
  ls(dir, recursive, debug) {
    try {
      var list = FS.readdirSync(dir)

      list.forEach((it, i) => {
        list[i] = PATH.resolve(dir, it)
      })

      if (recursive) {
        var tmp = list.concat()
        tmp.forEach(it => {
          if (this.isdir(it)) {
            list = list.concat(this.ls(it, recursive))
          }
        })
      }
      return list
    } catch (err) {
      debug && console.error('call ls(): ', err + '')
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
  echo(data, file, append, encode, debug) {
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

    try {
      if (!!append) {
        FS.appendFileSync(file, data, opt)
      } else {
        FS.writeFileSync(file, data, opt)
      }
      return true
    } catch (err) {
      debug && console.error('call echo(): ', err + '')
      return false
    }
  },

  //修改权限
  chmod(path, mode, debug) {
    try {
      FS.chmodSync(path, mode)
      return true
    } catch (err) {
      debug && console.error('call chmod(): ', err + '')
      return false
    }
  },

  //修改所属用户
  chown(path, uid, gid, debug) {
    try {
      FS.chownSync(path, uid, gid)
      return true
    } catch (err) {
      debug && console.error('call chown(): ', err + '')
      return false
    }
  },

  /**
   * [mv 移动文件&目录,兼具重命名功能]
   * @param  {String} origin [原路径/原名]
   * @param  {String} target   [目标路径/新名]
   */
  mv(origin, target, debug) {
    var updir = PATH.parse(target).dir
    if (!this.isdir(updir)) {
      this.mkdir(updir)
    }

    try {
      FS.renameSync(origin, target)
    } catch (err) {
      if (~err.message.indexOf('cross-device')) {
        if (this.cp(origin, target)) {
          return this.rm(origin)
        }
        return false
      }
      debug && console.error('call mv(): ', err + '')
      return false
    }
  },

  /**
   * [cp 复制文件&目录]
   * @param  {String} origin [原路径]
   * @param  {String} target   [目标路径]
   */
  cp(origin, target, debug) {
    try {
      // 如果是目录, 则递归操作
      if (this.isdir(origin)) {
        this.mkdir(target)
        var list = this.ls(origin)
        list.forEach(val => {
          let name = PATH.parse(val).base
          this.cp(val, PATH.join(target, name))
        })
      } else {
        var updir = PATH.parse(target).dir
        if (!this.isdir(updir)) {
          this.mkdir(updir)
        }

        var rs = FS.createReadStream(origin)
        var ws = FS.createWriteStream(target)
        rs.pipe(ws)
      }

      return true
    } catch (err) {
      debug && console.error('call cp(): ', err + '')
      return false
    }
  },

  /**
   * [rm 删除文件/目录]
   * @param  {[type]} origin      [源文件/目录路径]
   */
  rm(origin, debug) {
    try {
      if (this.isdir(origin)) {
        if (VERSION > 12.1) {
          FS.rmdirSync(origin, { recursive: true })
        } else {
          var list = this.ls(origin)
          list.forEach(it => this.rm(it))
          FS.rmdirSync(origin)
        }
      } else {
        FS.unlinkSync(origin)
      }
      return true
    } catch (err) {
      debug && console.error('call rm(): ', err + '')
      return false
    }
  },

  /**
   * [stat 返回文件/目录的状态信息]
   * @param  {[string]} path [目标路径]
   * @param  {[boolean]} debug [是否静默检测, 是否不打印错误日志]
   */
  stat(path, debug) {
    try {
      return FS.statSync(path)
    } catch (err) {
      debug && console.error('call stat(): ', err + '')
      return EMPTY_STAT
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

  isfile(path) {
    try {
      return this.stat(path).isFile()
    } catch (err) {
      return false
    }
  },

  /**
   * [mkdir 新建目录]
   * @param  {String} dir [目标路径]
   * @param {Number} mode [目录权限, node v10.12起支持]
   */
  mkdir(dir, mode = 0o755, debug) {
    try {
      if (VERSION > 10.12) {
        FS.mkdirSync(dir, { recursive: true, mode: mode })
      } else {
        var updir = PATH.parse(dir).dir
        if (!updir) {
          debug && console.error('call mkdir(): ', 'Wrong dir path')
          return false
        }

        if (!this.isdir(updir)) {
          this.mkdir(updir)
        }

        FS.mkdirSync(dir)
        this.chmod(dir, mode)
      }
      return true
    } catch (err) {
      debug && console.error('call mkdir(): ', err + '')
      return false
    }
  },

  /**
   * [exists 判断目标(文件/目录)是否存在]
   * @param  {String} file [目标路径]
   */
  exists(file) {
    return this.is(file, FS.constants.F_OK)
  },

  // 是否可读写
  is(file, mode) {
    try {
      FS.accessSync(file, mode)
      return true
    } catch (e) {
      return false
    }
  }
}
