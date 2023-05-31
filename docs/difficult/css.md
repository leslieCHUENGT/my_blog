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
# 订阅发布
```js
class EventEmitter {
  constructor() {
    // 存储事件及其对应的回调函数
    this.events = new Map();
  }

  // 绑定事件和回调函数
  on(event, callback) {
    // 获取事件的回调函数列表
    let callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则创建一个新的回调函数列表
    if (!callbacks) {
      callbacks = [];
      this.events.set(event, callbacks);
    }

    // 将回调函数添加到回调函数列表中
    callbacks.push(callback);
  }

  // 触发事件，执行回调函数
  emit(event, ...args) {
    // 获取事件的回调函数列表
    const callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则不执行任何操作
    if (!callbacks) {
      return;
    }

    // 执行回调函数列表中的所有回调函数，并传入参数
    callbacks.forEach((callback) => {
      callback.apply(this, args);
    });
  }

  // 绑定事件和回调函数，只执行一次
  once(event, callback) {
    // 定义一个新的回调函数，它会在执行一次后被自动移除
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(event, wrapper);
    };

    // 将新的回调函数添加到回调函数列表中，并且确保不会重复执行
    this.on(event, wrapper);
  }

  // 移除事件的所有回调函数，或指定的回调函数
  off(event, callback) {
    // 获取事件的回调函数列表
    const callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则不执行任何操作
    if (!callbacks) {
      return;
    }

    // 如果没有指定回调函数，则移除事件的所有回调函数
    if (!callback) {
      this.events.delete(event);
      return;
    }

    // 移除指定的回调函数
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }
}

```
# webpack对前端性能优化可以在哪些方面做文章
- 主要就是分为几个方面：代码压缩和混淆、代码分割、tree shaking
- 可以从比较常用的loader和Plugin来讲一讲
- 就拿url-loader来说
  - 为了减小文件的大小，可以把部分小并且不怎么变的的图片转换成`base64`格式的
  - 为了**减少并发请求数**，还可以放在`js`文件里
  - 为了可以更好的让浏览器使用缓存，在输出的文件夹名里可以生成**新的哈希值**，这点在每个出口文件里都用到了
- 可以拿MiniCssExtractPlugin来说
  - 为了实现更好的利用缓存，不同类型的文件最好分离打包、做好**代码分割**
  - import() 函数来实现动态**代码分割** 将一个大型的 JavaScript 应用程序拆分为多个小块，然后按需加载这些小块。
  - 为了减少文件的大小，自然离不开**压缩**可以用CssMinimizerPlugin
- 可以拿TerserWebpackPlugin来说
  - 也就是tree shaking
  - 注释、console、没有使用的变量或者函数可以自动剔除
  - 或者用 UglifyJsPlugin 进行代码的混淆
- 为了可以更好的实现代码分割，可以再增加一个入口**vendor**
  - 比如一些**库、框架**抽离出来，独立打包，避免了重复打包，减少文件的体积


在Vue 3中，由于引入了Composition API的概念，组件的生命周期钩子发生了一些变化。相比Vue 2，Vue 3提供了更灵活、更强大的编程方式，其中就包括了setup()函数。在setup()函数中，我们可以使用新的生命周期钩子函数onMounted()，它的作用和mounted()类似，都是在组件被挂载后执行一些操作。不过，与mounted()函数不同的是，onMounted()是一个响应式的函数，可以在template中直接使用，并且其返回值可以作为组件内部的reactive状态。

另外，由于setup()函数是在组件创建之前执行的，因此onMounted()函数也可以在组件渲染前执行一些逻辑，以提高性能和用户体验。而mounted()函数则只能在组件已经被完全挂载之后才会被调用。


# 讲一讲vue的生命周期
- 生命周期就像是一个人的一生，会经历生老病死
- Vue的组件就会经历像这样的阶段：创建、挂载、更新、销毁，
- 我们可以在生命周期钩子函数添加代码，就可以在不同的生命周期里执行了
## 生命周期的阶段
- 创建前后、挂载前后、更新前后、销毁前后、还有就是一些特殊的场景的生命周期
- 就是keepalive激活的时候、捕捉后代组件错误时候，vue3里还增加了三个关于调试、服务端渲染的生命周期
## 钩子函数
- 这几个阶段对应的钩子函数 API依次为：beforeCreate create beforeMount mounted beforeUpdate updated activated(keep-alive 激活时调用) deactivated(keep-alive 停用时调用) beforeDestory destoryed errorCaptured（捕获子孙组件错误时调用）。
- 在 Vue3 中的变化 绝大多数只要加上前缀 on 即可，比如 mounted 变为 onMounted，除了 beforeDestroy 和 destroyed 被重新命名为 beforeUnmount 和 unMounted

## 他们分别的作用
- beforeCreate之前
  - 组件创建初始化
- created之前
  - 初始化data和methods
- beforeMount之前
  - 开始解析Vue模板，在内存里生成虚拟dom
- mounted之前
  - 虚拟dom转换为真实dom插入到页面里
  - 所以只有在mounted之后的生命周期，才能对dom'元素进行新的操作
  - 这个时候可以进行发送请求、触发绑定的事件
- 进行updated，简单来说就是前后虚拟dom，dispatch的过程。
- beforeUnmounted
  - 清除实例里的定时器、订阅事件
- unMounted
  - 销毁组件实例

# 讲一讲什么是SPA
- 也就是单页应用
- 动态重写当前的页面与用户交互，通过前端路由进行无刷新跳转
- 讲就是一个杯子，早上装的牛奶，中午装的是开水，晚上装的是茶，我们发现，变的始终是杯子里的内容，而杯子始终是那个杯子结构
- 用户体验好，通过ajax获取数据，全端负责渲染
- 首屏加载慢，大部分文件都是通过在首页加载，获取数据
- webpack打包工具缩小js文件、SSR开发、图片压缩

# hash和history模式
- hash模式实现的方式就是通过监听hashchange事件，执行回调函数
- url会带有#号
- **不利于SEO，因为不知道是不是新页面**
- history路由的实现主要就是通过pushState和replaceState实现的
- 一个是压入、另一个是替换
- 那么是不是如果我们能够监听到改变URL这个动作，就可以实现前端渲染逻辑的处理呢？
- popstate无法监听history.pushState和history.replaceState方法

- 当是hash路由的时候，我们可以通过监听hashchange事件
- 当是history路由的时候，本来popstate事件监听浏览器历史栈状态的变化
- 但是只能监听到前进或者后退导致的历史变化
- 当我们调用history.pushState和history.replaceState方法的时候，就算改变了URL，因为popState监听不到，就不会使页面重绘。
- 我们需要手动调用window.dispatchEvent(new PopStateEvent('popstate'))
- 通过监听自定义事件，完成功能
- 但是history模式有个缺点，跳转路由之后再刷新，会404，浏览器端在该路径下找静态资源，但是服务器端是没有这个文件的，所以我们就会配置，当访问的路径不存在的时候，默认指向index



# 从输入URL到页面展示，这中间发生了什么？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9f72d3b73fa441f94fd089b1110a803~tplv-k3u1fbpfcp-watermark.image?)

1. 用户输入url并回车
2. 浏览器进程检查url，组装协议，构成完整的url
3. 浏览器进程通过进程间通信（IPC）把url请求发送给网络进程
4. 网络进程接收到url请求后检查本地缓存是否缓存了该请求资源，如果有则将该资源返回给浏览器进程
5. 如果没有，网络进程向web服务器发起http请求（网络请求），请求流程如下：
  5.1 进行DNS解析，获取服务器ip地址，端口
  5.2 利用ip地址和服务器建立tcp连接
  5.3 构建请求头信息
  5.4 发送请求头信息
  5.5 服务器响应后，网络进程接收响应头和响应信息，并解析响应内容
6. 网络进程解析响应流程；
  6.1 检查状态码，如果是301/302，则需要重定向，从Location自动中读取地址，重新进行第4步，如果是200，则继续处理请求。
  6.2 200响应处理：
    检查响应类型Content-Type，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行
    后续的渲染，如果是html则通知浏览器进程准备渲染进程准备进行渲染。
7. 准备渲染进程
  7.1 浏览器进程检查当前url是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程
8. 传输数据、更新状态
  8.1 渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”
  8.2 **渲染进程接收完数据后，向浏览器发送“确认提交”**
  8.3 浏览器进程接收到确认消息后更新浏览器界面状态：安全、地址栏url、前进后退的历史状态、更新web页面。

# 讲一讲复杂的渲染流程
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7636bf798be48e59df3a356ebe35f8a~tplv-k3u1fbpfcp-watermark.image?)

1. **渲染进程接受完数据之后，先把html内容转换为DOM树**(document)
2. **渲染引擎将html内容里的css内容转换为styleSheets**(document.styleSheets)，还会把属性值标准化，比如rem转换为px，**计算DOM节点的样式**，把不显示在页面的DOM去掉。设置为display:none的节点，会存在在DOM树里，但是v-if不会。
3. **创建布局树，计算元素、节点的布局信息**
4. **对布局树进行分层，生成分层树。**页面元素是按照嵌套关系组织的，生成分层树，使得渲染更加高效
5. **对每一个图层生成绘制列表，并提交到合成线程中。**绘制列表只是用来记录绘制顺序和绘制指令的列表，际上绘制操作是由渲染引擎中的合成线程来完成的。
6. **合成线程将图层会分成图块，并在光栅化线程池中将图块转换成位图。**合成线程会将图层划分为图块（tile），这些图块的大小通常是 `256x256` 或者 `512x512`,合成线程会按照**视口**附近的图块来**优先**生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图.位图（bitmap），也叫做**光栅图或像素图**，例如，当浏览器将网页中的 `SVG` 图片或 `Canvas` 元素渲染成屏幕上可视的元素时，会使用光栅化技术将其转换为位图。位图可以直接在屏幕上显示，而不需要进行额外的计算，因此它们是一种非常高效的图像呈现方式。栅格化过程都会使用 `GPU` 来加速生成，使用 `GPU` 生成位图的过程叫**快速栅格化**，或者 `GPU` 栅格化，生成的位图被保存在 `GPU` 内存中。这就涉及到了跨进程操作。
7. **合成线程发送绘制图块命令 DrawQuad 给浏览器进程。**
8. **浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。**浏览器进程里面有一个叫 `viz` 的组件，用来接收合成线程发过来的` DrawQuad `命令，然后根据` DrawQuad `命令，将其页面内容绘制到**内存**中，最后再将内存的绘制内容显示在屏幕上。













