- 2xx success成功状态码
  -  200 OK
  -  204 No Content
  -  206 Partial Content 请求了一部分响应的也是一部分
- 3xx Redirection重定向状态码
  - 301 Moved Permanently 
    - 表示请求的资源已被分配了新的 `URI`，以后应使用资源现在所指的 `URI`
  - 302 Found
    - 该状态码表示请求的资源已被分配了新的 URI，**希望用户(本次)能使用新的 `URI` 访问。**
  - 303 See Other
    - 该状态码表示由于请求对应的资源存在着另一个 URI，应使用 `GET` 方法定向获取请求的资源。
  - 304 Not Modified
    - 服务器验证后**发现资源未被修改**，于是可以避免重复传输相同的资源内容，返回 `304 Not Modified` **响应状态码和空的响应体（body）**，客户端则从**缓存**中获取资源。这种方式可以减轻服务器的负担，同时提高响应速度。通常情况下，使用 304 Not Modified 响应状态码可以通过设置合适的响应头（例如 ETag 和 If-None-Match）实现。
  - 307 Temporary Redirect
    - 该状态码与 302 Found 有着相同的含义。
- 4xx客服端状态码
  - 400 Bad Request
    - 该状态码表示请求报文中存在语法错误。
  - 401 Unauthorized
    - 当浏览器初次接收到 401 响应，会弹出认证用的对话窗口
  - 403 Forbidden
    - 该状态码表明对请求资源的访问被服务器拒绝了。
  - 404 Not Found
    - 该状态码表明服务器上无法找到请求的资源。
  - 405 Method Not Allowed
    该状态码标明，客户端请求的方法虽然能被服务器识别，但是服务器禁止使用该方法
    > GET 和 HEAD 方法，服务器应该总是允许客户端进行访问
    客户端可以通过 OPTIONS 方法来查看服务器允许的访问方法, 如下
    ```js
    Access-Control-Allow-Methods →GET,HEAD,PUT,PATCH,POST,DELETE
    ```
-  5XX(Server Error 服务器错误状态码)
   - 500 Internal Server Error 
     - 该状态码表明服务器端在执行请求时发生了错误。
   - 502 Bad Gateway
     - 该状态码表明扮演网关或代理角色的服务器，从上游服务器中接收到的响应是无效的
   - 503 Service Unavailable
     - 该状态码表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。
  

# 单行文本溢出省略
```css
.single-line {
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}
```
# 多行文本溢出
```css
.multi-line {
  display: -webkit-box; /* 伸缩盒模型布局 */
  -webkit-box-orient: vertical;/* 伸缩盒子元素的排列方向为垂直方向 */
  -webkit-line-clamp: 3; /* 显示行数 */
  max-height: 60px; /* 容器最大高度 */
  overflow: hidden; /* 隐藏超出部分 */
  position: relative; /* 让 ::after 相对于父元素定位 */
}
.multi-line::after {
  content: "..."; /* 显示省略号 */
  position: absolute; /* 相对于父元素定位 */
  bottom: 0;
  right: 0;
  padding-left: 10px; /* 留出省略号的宽度 */
  background-color: #fff; /* 遮盖被截断的文字 */
}
```

# 给定目录路径,聚合成树形结构
```js
function buildTree(paths) {
  // 创建根节点，包含一个空的 children 数组
  const root = { name: 'root', children: [] };
  for (const path of paths) {
    // 将路径按照 '/' 分隔成多个部分
    const parts = path.split('/');
    //  ['root', 'a', 'b', 'c']
    let node = root; // 从根节点开始遍历
    for (const part of parts) {
      let child = node.children.find(c => c.name === part); // 查找当前层级的子节点中是否已有该部分
      if (!child) {
        // 如果没有，就新建一个节点并添加到当前节点的 children 数组中
        child = { name: part, children: [] };
        node.children.push(child);
      }
      node = child; // 进入子节点继续遍历
    }
  }
  return root;
}

function multiplyBigNum(num1, num2) {
    //判断输入是不是数字
    if (isNaN(num1) || isNaN(num2)) return "";
    num1 = num1 + ""
    num2 = num2 + ""
    let len1 = num1.length,
        len2 = num2.length;
    let pos = [];

    //j放外面，先固定被乘数的一位，分别去乘乘数的每一位，更符合竖式演算法
    for (let j = len2 - 1; j >= 0; j--) {
        for (let i = len1 - 1; i >= 0; i--) {
            //两个个位数相乘，最多产生两位数，index1代表十位，index2代表个位
            let index1 = i + j,
                index2 = i + j + 1;
            //两个个位数乘积加上当前位置个位已累积的数字，会产生进位，比如08 + 7 = 15，产生了进位1
            let mul = num1[i] * num2[j] + (pos[index2] || 0);
            //mul包含新计算的十位，加上原有的十位就是最新的十位
            pos[index1] = Math.floor(mul / 10) + (pos[index1] || 0);
            //mul的个位就是最新的个位
            pos[index2] = mul % 10;
        }
    }

    //去掉前置0
    let result = pos.join("").replace(/^0+/, "");

    return result - 0 || '0';
}
```

- 面试官你好，我叫赖经涛，本科来自江西财经大学软件与物联网工程学院，专业是软件工程
- 在校期间担任过班长和班主任助理，去年参与了学院的算法集训，后续加入了一个研究生导师的课题，极限学习机瞬变电课题，立项获得省奖
- 在去年下半年决定走前端方向，在这期间在自己的github上上传了自己的三个项目
- 在这个学期在独立完成vue项目后，为了让基础更加扎实，通过书籍和博客的渠道学习了vue源码、浏览器架构、前端工程化、V8引擎的执行机制、axios源码和学习使用koa搭建后端
- 最近参与了一个企业级前端开发框架开源项目，在里面贡献pr，对标蚂蚁的bigfish和字节的web infra，现在在负责npm包以及类库研发场景的检测,现在处于初学阶段,刚接触umi。
- 希望自己可以通过实习，提升自己的能力和对基础知识的更加完善认识。
- 谢谢面试官老师，这是我的自我介绍。

  - umi 基于 react
  - 现在在根据umi的father这款npm包研发工具来，编写相应的逻辑
    - 构建工具的插件中，检查项目中导入模块的路径是否存在大小写问题。
    - 基于Umijs插件函数，通过静态代码检测CommonJS引入ES module的情况
    - Umi.js 插件函数，用于检查项目中包依赖关系是否存在问题
    - 基于Umijs的插件函数，来检查规则，通过检查项目里package.json的peerDependencies和dependencies字段，会不会出现同时存在的问题







