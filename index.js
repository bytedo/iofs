/**
 * 
 * @authors yutent (yutent@doui.cc)
 * @date    2015-12-28 14:28:38
 *
 */
"use strict";

const fs = require('fs'),
    path = require('path');

class Iofs {

    constructor(){
        this.self = fs
    }


    /**
     * [cat 文件读取]
     * @param  {String} file [文件路径]
     * @param  {Function} cb   [回调] 可选
     */
    cat(file){
        try{
            return fs.readFileSync(file)
        }catch(err){
            console.error(err)
            return null
        }
    }

    /**
     * [ls 读取整个目录(不遍历子目录)]
     * @param  {string} dir [目标路径]
     * @param  {boolean} child [是否遍历子目录]
     * @return {array}      [返回目标目录所有文件名和子目录名, 不包括'.'和'..']
     */
    ls(dir, child){
        try{
            let list = fs.readdirSync(dir)

            if(!child)
                return list

            let tmp = Array.from(list)
            tmp.forEach(it => {
                let childdir = path.join(dir, it)
                if(this.isdir(childdir)){
                    list = Array.prototype.concat.apply(list, this.ls(childdir, true).map(sub => {
                            return path.join(it, sub)
                    }))
                }
            })
            return list
        }catch(err){
            console.error(err)
            return null
        }
    }



    /**
     * [echo 写文件]
     * @param  {String|Buffer|Number} data   [要写入的数据]
     * @param  {String} file   [要写的文件]
     * @param  {Boolean} append [是否在后面追加，默认否]
     * @param  {String} encode [编码, 默认utf8]
     */
    echo(data, file, append, encode){
        if(!file){
            return data;
        }

        let updir = path.parse(file).dir,
            opt = {};
        if(!this.isdir(updir)){
            this.mkdir(updir)
        }

        if(append && typeof append === 'string'){
            encode = append;
            append = false;
            opt.encoding = encode;
        }else{
            if(typeof encode === 'string'){
                opt.encoding = encode
            }
        }

        try{
            if(!!append){
                fs.appendFileSync(file, data, opt)
            }else{
                fs.writeFileSync(file, data, opt)
            }
        }catch(err){
            console.error(err)
        }
    }



    //修改权限
    chmod(path, mode){
        try{
            fs.chmodSync(path, mode)
        }catch(err){
            console.error(err)
        }
    }
    

    /**
     * [mv 移动文件,兼具重命名功能]
     * @param  {String} from [原路径/原名]
     * @param  {String} to   [目标路径/新名]
     */
    mv(from, to){

        let updir = path.parse(to).dir
        if(!this.isdir(updir))
            this.mkdir(updir)

        try{
            fs.renameSync(from, to)
        }catch(e){
            let rs = fs.createReadStream(from),
            ws = fs.createWriteStream(to);

            rs.pipe(ws)
            rs.on('end', err => {
                this.rm(from)
            })
        }
    }



    cp(from, to){
        let updir = path.parse(to).dir
        if(!this.isdir(updir)){
            this.mkdir(updir)
        }

        let rs = fs.createReadStream(from),
            ws = fs.createWriteStream(to);

        rs.pipe(ws)
        rs.on('end', err => console.error(err))

    }


    /**
     * [rm 删除文件/目录]
     * @param  {[type]} from      [源文件/目录路径]
     * @param  {[type]} recursion [是否递归删除，若删除目录，此值须为true]
     */
    rm(from, recursion){
        try{
            if(!!recursion){
                fs.rmdirSync(from)
            }else{
                fs.unlinkSync(from)
            }
        }catch(err){
            console.error(err)
            
        }
    }


    /**
     * [stat 返回文件/目录的状态信息]
     * @param  {[type]} path [目标路径]
     */
    stat(path){
        try{
            return fs.statSync(path)
        }catch(err){
            return null
        }
    }


    /**
     * [isdir 判断目标是否为目录]
     * @param  {String} path [目标路径]
     */
    isdir(path){
        try{
            return this.stat(path).isDirectory()
        }catch(err){
            return false
        }
    }


    /**
     * [mkdir 新建目录]
     * @param  {String} dir [目标路径]
     */
    mkdir(dir){
        let updir = path.parse(dir).dir
        if(!updir)
            return

        if(!this.isdir(updir)){
            this.mkdir(updir)
        }

        try{
            fs.mkdirSync(dir)
        }catch(err){
            console.error(err)
        }
    }

    /**
     * [exists 判断目标(文件/目录)是否存在]
     * @param  {String} file [目标路径]
     */
    exists(file){
        return fs.existsSync(file)
    }



}


module.exports = new Iofs