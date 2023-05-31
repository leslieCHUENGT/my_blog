# JEST
- toBe用于判断两个值是否严格相等，也就是类型和值都要相同。
- toEqual用于判断两个值是否深度相等
```js
    describe('测试用户账户接口', () => {
        test('响应里应该包含指定的属性', async () => {
            const response = await request(app)
                .get('/users/1');
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('王皓');
        })
    })
```
# koa源码思考
- 核心功能把res、req加工成ctx，app.use()第二个参数next()跳到下一个，把多个use的回调函数按照规则顺序执行。
- async函数返回的是一个promise，当上一个use的next前加上await关键字，会等待下一个use的回调resolve了再继续执行代码。
```js
app.use((ctx, next) => {
    console.log(1)
    // next()  被替换成下一个use里的代码
    console.log(3)
    // next()  又被替换成下一个use里的代码
    console.log(5)
    // next()  没有下一个use了，所以这个无效
    console.log(6)
    console.log(4)
    console.log(2)
})
// 
app.use(async (ctx, next) => {
    console.log(1)
    // console.log(3)
    // let p = new Promise((resolve, roject) => {
    //     setTimeout(() => {
    //         console.log('3.5')
    //         resolve()
    //     }, 1000)
    // })
    // 调用此行代码时，相当于是把下一个中间件的回调函数插入上方
    // await next()会等待上方的代码执行
    await next()
    console.log(2)
})
app.use(async (ctx, next) => {
    console.log(3)
    let p = new Promise((resolve, roject) => {
        setTimeout(() => {
            console.log('3.5')
            resolve()
        }, 1000)
    })
    await p.then()
    await next()
    console.log(4)
    ctx.body = 'hello world'
})
// 1
// 3
//  一秒后
// 3.5
// 4
// 2
```
- 最精华的compose函数
```js
compose(middlewares, ctx){
    function dispatch(index){
        if(index === middlewares.length) return Promise.resolve() // 若最后一个中间件，返回一个resolve的promise
        let middleware = middlewares[index]
        return Promise.resolve(middleware(ctx, () => dispatch(index + 1))) // 用Promise.resolve把中间件包起来
    }
    return dispatch(0)
}
```
- 实现的流程：
- 当调用app.use()时，回调函数会按顺序被保存在middlewares数组里
- compose函数里有个dispatch函数，先是判断其参数index是否到最后一个中间件的后一个位置了
- 是的话直接会返回一个Promise.reslove(),所以最后的中间件是不能执行next()的
- 然后拿到当前的回调函数，传入两个参数，ctx和next，实际上的next()函数就是调用了dispatch(index + 1)
- 最后返回一个Promise.reslove()包裹其返回值

# 大文件上传和断点续传
## 前端
```js
// 生成文件碎片
createFileChunk(file, size = SIZE){
    // 定义文档块碎片
    const fileChunkList = [];
    let cur = 0;// 判断进度
    while(cur < file.size){
        fileChunkList.push({ file: file.slice(cur, cur + size)})
        cur += size;
    }
    return fileChunkList;
}

// 发送操作
// 调用map方法进行利用文件名和下标生成唯一的hash值
async hanleUpload(){
    if(!this.container.file)return;
    const fileChunkList = this.createFileChunk(this.container.file)
    this.data = fileChunkList,map(({ file }, index) => ({
        chunk: file,
        hash: this.container.file.name + '-' + index;
    }))
    await this.uploadChunks();
}

// 上传文件 用到两个map方法
// 使用FormData对象将其序列化成可供AJAX请求上传的格式
// 在每个上传时 new FormData() 存入 文档碎片、hash值、名字

async uploadChunks(){
    const requestList = this.data
        .map(({ chunk, hash}) => {
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('hash', hash);
            formData.append('filename',this.container.filename);
        })
        .map(({ formData })=>{
            this.request({
                url: "http://localhost:3000",
                data: formData
            })
        })
}
// 合并切片，即前端主动通知服务端进行合并
// 发送post请求，告知服务器合并

```

# 后端
```js
// 使用multiparty.parse可以把http请求的formData解析为js对象
// 在mutiparty.parse的回调中，files 参数保存了 formData 中文件，fields 参数保存了 formData 中非文件的字段
// 调用files.move()来保存文件和名字：hash + filename组成
const multipart = new multiparty.From();
multipart.parse(req,async(err, fields, files) => {
    if(err) return;
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;
    // 设置上传的目录、路径
    // 添加chunkDir前缀与文件名做区分,也就是用path.resolved创建文件
    const chunkDir = path.resolved(UPLOAD_DIR, 'chunkDir' + filename);
    // 如果该子目录不存在，则用fse.mkdirs创建该子目录
    if(!fse.existsSync(chunkDir)){
        await fse.mkdirs(chunkDir);
    }
    // 用fse.move把分片移动到子目录
    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    // 返回给客服端
    res.end("received file chunk");
})

// 合并切片
// 定义一个函数，用来解析POST请求的数据并返回Promise对象
// 解析请求里要合并的文件的名字包裹成一个Promise对象
const resolvePost = req =>
  new Promise(resolve => {
    let chunk = "";
    // 监听data事件，将接收到的数据chunk拼接起来
    req.on("data", data => {
      chunk += data;
    });
    // 监听end事件，将拼接好的数据进行JSON解析并传递给resolve函数
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
}); 
// 定义函数，用来将文件流写入指定路径的文件中，并返回Promise对象
const pipeStream = (path, writeStream) => {
    new Promise(reslove => {
        // 创建可读流来读取指定路径上的文件
        const readStream = fse.createReadStream(path);
        // 监听readStream的end事件，在读取完成后删除原始文件并调用resolve函数
        readStream.on('end',()=>{
            fse.unlinkSync(path);
            resolve();
        })
        // 将读取的数据通过管道传递给 writeStream
        readStream.pipe(writeStream)
    })
}
// 合并切片的函数，参数: 文件路径、文件名、切片大小
const mergeFileChunk = async(filePath, filename, size){
    // 用path.resolve找到指定子目录
    const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir' + filename);
    // fse.readdir 获取切片下所有的切片的文件名
    const chunkPaths = await fse.readdir(chunkDir);
    // 根据切片下标进行排序
    chunkPaths.sort((a,b) => a.split('-')[1] - a.split('-')[1]);
    // 并发写入文件，每个切片都通过pipeStream函数讲起内容追加到指定的文件中
    await Promise.all(
        chunkPaths.map((chunkPath,index)=>{
            // pipeStream()函数会将指定的文件路径下的内容读取并通过管道(pipe)传输给一个可写流（WriteStream）。
            pripeStream(
                path.resolve(chunkDir, chunkPath),
                fes.createWriteStream(filePath, {
                    start: index * size,
                })
            )
            // 这个可写流对象是通过fse.createWriteStream()方法创建的，并且通过设置start选项，将文件的写入位置移动到正确的偏移量处。
        })
    )
    // 合并完删除保存切片的目录
}

if(req.url === '/merge'){
    // 解析文件对象
    const data = await resolvePost(req);
    // 解构得到文件名和size
    const { filename, size } = data;
    // 根据文件名，找到指定指定的路径下的文件
    const filePath = path.resolve(UPLOAD_DIR, `${ filename }`)
    // 进行合并
    await mergeFileChunk(filePath, filename);
    res.end(
        JSON.stringfy({
            cose: 0,
            message: 'file merged success'
        })
    )
}

```





