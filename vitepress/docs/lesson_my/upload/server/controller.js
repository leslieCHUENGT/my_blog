// 引入第三方模块 multiparty、path 和 fse
const multiparty = require('multiparty')
const path = require('path')
const fse = require('fs-extra')

// 定义上传目录 UPLOAD_DIR
const UPLOAD_DIR = path.resolve(__dirname, "..", "target");

// 获取文件扩展名的方法
const extractExt = filename =>
    filename.slice(filename.lastIndexOf("."), filename.length);

const resolvePost = req =>
    new Promise((resolve, reject) => {
        let chunk = '';
        // 慢慢接受源码
        // bodyparser 的作用机理 
        req.on("data", data => {
            chunk += data;
        })
        req.on("end", () => {
            resolve(JSON.parse(chunk));
        })
    });    

const getChunkDir = fileHash =>
    path.resolve(UPLOAD_DIR, `chunkDir_${fileHash}`);// 将多个路径解析为一个绝对路径。

// getChunkDir(fileHash) 方法获取文件块所在目录的路径。
// 使用 fse.existsSync() 判断文件块目录是否存在。
// fse.readdir() 方法读取目录下所有文件块的名称，并将名称数组返回给调用方
const createUploadedList = async fileHash =>
    fse.existsSync(getChunkDir(fileHash))
        ? await fse.readdir(getChunkDir(fileHash))
        : [];

// 写入文件流的方法，返回 Promise 对象
const pipeStream = (path, writeStream) =>
    new Promise(resolve => {
        const readStream = fse.createReadStream(path); // 创建读取流
        readStream.on("end", () => { // 读取完成后
            fse.unlinkSync(path); // 删除原文件
            resolve(); // 返回 Promise 对象
        })
        readStream.pipe(writeStream) // 将文件读取流中的内容写入到指定路径的文件中
    }) 

const mergeFileChunk = async (filePath, fileHash, size){
    
}

// 导出一个类
module.exports = class {

    // 单个切片的上传
    async handleFormData(req, res) {
        console.log('----------------------')
        const multipart = new multipart.Form();
        multipart.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status = 500;
                res.end("process file chunk failed");
                return;
            }
            const [chunk] = files.chunk;
            const [hash] = fields.hash;
            const [fileHash] = fields.fileHash;
            const [filename] = fields.filename;
        })
    }

    // 合并所有切片 
    async handleMerge(req, res) {
        // 请求头
        const data = await resolvePost(req);
        const { fileHash, filename, size } = data;
        const est = extractExtract(filename);
        const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${est}`);

        await mergeFileChunk(filePath, fileHash, size);
        res.end(
            JSON.stringify({
                code: 0,
                message: "file merged success"
            })
        )
    }

    // 判断是否已经上传过
    async handleVerifyUpload() {
        
    }

    // 删除文件
    async deleteFiles() {

    }
}