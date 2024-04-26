# 常见的content字段
- 数据格式、压缩方式、支持语言、字符集
# 缓存相关
- 强缓存检查、不要请求，检查字段
- 当Expires和Cache-Control同时存在的时候，Cache-Control会`优先`考虑。
  - Expires
  - Cache-Control
    - max-age
    - private：仅在客户端，Nginx 是一个功能强大的代理服务器也不会在其上缓存
    - no-cache：协商
    - no-store: 不缓存
    - s-maxage: 代理服务器上的缓存时间
    - must-revalidate：缓存过期直接去源服务器

- 协商缓存
  - 响应头：Last-Modified
  - 请求头：If-Modified-Since
  - 响应头：ETag
  - 请求头：If-None-Match

# 跨域
- 是什么？
  - 浏览器对于非同源的 `URL`发送请求，产生跨域
  - 本质：沙箱当中的渲染进程 -> 网络进程 -> 主进程 -> 主进程检查到跨域 -> 响应题丢弃 （为什么？）
- 怎么做？
- CORS：跨域资源共享，服务器需要附加特定的响应头
  - Access-Control-Allow-Origin: 表示可以允许请求的`源`
  - Access-Control-Allow-Methods: 表示允许的请求`方法列表`
  - Access-Control-Allow-Credentials: Cookie
  - Access-Control-Allow-Headers: 表示允许发送的`请求头字段`
  - Access-Control-Max-Age: 预检请求的有效期，在此期间，不用发出另外一条`预检请求`
- 简单请求:
  - 请求方法为 GET、POST 或者 HEAD
  - 请求头的取值范围: Accept、Accept-Language、Content-Language、Content-Type(只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain)
- 预检请求的方法是OPTIONS，同时会加上Origin源地址和Host目标地址，这很简单。同时也会加上两个关键的字段:
  - Access-Control-Request-Method, 列出 CORS 请求用到哪个HTTP方法
  - Access-Control-Request-Headers，指定 CORS 请求将要加上什么请求头
- JSONP
  - 返回给script标签，浏览器直接把这部分字符串执行

- JSONP是通过 script发送请求，在路径里触发回调函数。
```js
// 定义一个 JSONP 请求函数
function jsonp(url, callbackName, callback) {
    // 创建一个唯一的回调函数名称
    const callbackFuncName = `jsonp_${Date.now()}_${Math.ceil(Math.random() * 10000)}`;

    // 将回调函数名称添加到 URL 中作为参数
    const fullUrl = `${url}?callback=${callbackFuncName}`;

    // 创建一个 script 标签
    const script = document.createElement('script');

    // 定义回调函数
    window[callbackFuncName] = function(data) {
        // 调用用户定义的回调函数，并传入数据
        callback(data);

        // 数据获取成功后，移除 script 标签和全局的回调函数
        document.body.removeChild(script);
        delete window[callbackFuncName];
    };

    // 设置 script 标签的 src 属性为拼接好的 URL
    script.src = fullUrl;

    // 将 script 标签添加到页面中
    document.body.appendChild(script);
}

// 使用示例
jsonp('https://api.example.com/data', 'callback', function(data) {
    console.log('Data received:', data);
});

```
- 代理服务器

# 问题一：本地存储方式的区别和应用场景

# cookie

`http`协议是无状态的协议，会话结束了也就终止了联系，为了能在下次发送请求可以直接让服务器端知道是谁，于是`cookie`就诞生了。

特点：

1.  本质上是一段存储在本地不超过`4kb`的小型文本
2.  内部以**键值对**的方式来存储(在chrome开发者面板的`Application`这一栏可以看到)

常见字段：

*   `Expries `用于设置 cookie 的过期时间

```js
Expires=Wed, 21 Oct 2015 07:28:00 GMT
```

*   `Max-Age `用于设置在 Cookie 失效之前需要经过的秒数（优先级比`Expires`高）

```js
Max-Age=604800
```

- `Cookie`的`SameSite`属性
   - strict模式，完全禁止第三方请求携带，完全遵守同源策略
   - lax模式，get提交的时候可以携带
   - none模式，自动携带

*   `domain` 属性用于限制 Cookie 的作用域，只有在指定的域名下才能够使用该 Cookie。

```js
Domain=example.com
```

*   `path` 属性则用于限制 Cookie 的生效路径，只有在指定的路径下才能够使用该 Cookie。

```js
Path=/api
```

*   `secure`：一个布尔值，表示是否只在 HTTPS 连接时发送 Cookie。
*   `http-only`：一个布尔值，表示是否禁止通过 JavaScript 访问 Cookie，从而提高安全性。
*   `name`：Cookie 的名称，通常是一个字符串。
*   `value`：Cookie 的值，可以是一个字符串或其他类型的数据。

所以`cookie`最开始的作用并不是为了缓存而设计出来，只是借用了`cookie`的特性实现缓存。

怎么设置和删除？

```js
// 设置 Cookie
document.cookie = "username=john; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/";

// 读取 Cookie
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return '';
}
const username = getCookie('username');

// 删除 Cookie
// 最常用的方法就是给`cookie`设置一个过期的事件，这样`cookie`过期后会被浏览器删除
function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}
deleteCookie('username');
```

# localStorage

`HTML5`新方法，IE8及以上浏览器都兼容。

`localStorage` 是一种用于在客户端（浏览器）中存储数据的 Web API，可以用于长期存储非敏感数据，例如用户的个人偏好、应用程序状态等。

特点：

1.  持久化的本地存储，除非主动删除，否则永远不会过期。
2.  在同一域名中，存储的信息是共享的。
3.  当本页操作（新增、修改、删除）了`localStorage`的时候，本页面不会触发`storage`事件,但是别的页面会触发`storage`事件。通过 `window.addEventListener('storage', listener)` 方法注册一个事件监听器，其中 `listener` 是用于处理 `storage` 事件的回调函数，也就是说本页改变`localStorage`不会触发这个这个事件，也不会执行回调函数。
4.  大小：5M（跟浏览器厂商有关系）。
5.  只存在客户端，默认不参与与服务端的通信。这样就很好地避免了 Cookie 带来的**性能问题**和**安全问题**。
6.  接口封装。通过`localStorage`暴露在全局，并通过它的 `setItem` 和 `getItem`等方法进行操作，非常方便。

下面再看看关于`localStorage`的使用：

设置

```js
localStorage.setItem('username','cfangxu');
```

获取

```js
localStorage.getItem('username')
```

获取键名

```js
localStorage.key(0) //获取第一个键名
```

删除

```js
localStorage.removeItem('username')
```

一次性清除所有存储

```js
localStorage.clear()
```

`localStorage` 也不是完美的，它有两个缺点：

*   无法像`Cookie`一样设置过期时间
*   只能存入字符串，无法直接存对象

```js
localStorage.setItem('key', {name: 'value'});
console.log(localStorage.getItem('key')); // '[object, Object]'
```

# sessionStorage

`sessionStorage`和 `localStorage`使用方法基本一致，唯一不同的是生命周期，一旦页面（会话）关闭，`sessionStorage` 将会删除数据。

## 应用场景

1.  可以用它对**表单信息**进行维护，将表单信息存储在里面，可以保证页面即使刷新也不会让之前的表单信息丢失。
2.  可以用它存储本次浏览记录。如果关闭页面后不需要这些记录，用`sessionStorage`就再合适不过了。

# IndexedDB

`indexedDB`是运行在浏览器中的**非关系型数据库**，`IndexDB`的一些重要特性，除了拥有数据库本身的特性，比如`支持事务`，`存储二进制数据`，还有这样一些特性需要格外注意：

虽然 `Web Storage`对于存储较少量的数据很有用，但对于存储更大量的结构化数据来说，这种方法不太有用。`IndexedDB`提供了一个解决方案。

## 优点：

*   储存量理论上没有上限
*   所有操作都是异步的，相比 `LocalStorage` 同步操作性能更高，尤其是数据量较大时
*   原生支持储存`JS`的对象
*   是个正经的数据库，意味着数据库能干的事它都能干

## 缺点：

*   操作非常繁琐
*   本身有一定门槛

关于`indexedDB`的使用基本使用步骤如下：

*   打开数据库并且开始一个事务
*   创建一个 `object store`
*   构建一个请求来执行一些数据库操作，像增加或提取数据等。
*   通过监听正确类型的 `DOM` 事件以等待操作完成。
*   在操作结果上进行一些操作（可以在 `request`对象中找到）

关于使用`indexdb`的使用会比较繁琐，大家可以通过使用`Godb.js`库进行缓存，最大化的降低操作难度。

## 区别

关于`cookie`、`sessionStorage`、`localStorage`三者的区别主要如下：

*   存储大小：`cookie`数据大小不能超过`4k`，`sessionStorage`和`localStorage`虽然也有存储大小的限制，但比`cookie`大得多，可以达到5M或更大
*   有效时间：`localStorage`存储持久数据，浏览器关闭后数据不丢失除非主动删除数据； `sessionStorage`数据在当前浏览器窗口关闭后自动删除；`cookie`设置的`cookie`过期时间之前一直有效，即使窗口或浏览器关闭
*   数据与服务器之间的交互方式，`cookie`的数据会自动的传递到服务器，服务器端也可以写`cookie`到客户端； `sessionStorage`和`localStorage`不会自动把数据发给服务器，仅在本地保存

# 问题二：cookie的字段

参考问题一对`cookie`的描述

## 问题三：从url输入到页面显示的具体过程

1.  用户输入url并回车

2.  浏览器进程检查url，组装协议，构成完整的url

3.  浏览器进程通过进程间通信（IPC）把url请求发送给网络进程

4.  网络进程接收到url请求后检查本地缓存是否缓存了该请求资源，如果有则将该资源返回给浏览器进程

5.  如果没有，网络进程向web服务器发起http请求（网络请求），请求流程如下：

    *   进行DNS解析，获取服务器ip地址，端口
    *   利用ip地址和服务器建立tcp连接
    *   构建请求头信息
    *   发送请求头信息
    *   服务器响应后，网络进程接收响应头和响应信息，并解析响应内容

6.  网络进程解析响应流程；

    *   检查状态码，如果是301/302，则需要重定向，从Location自动中读取地址，重新进行第4步，如果是200，则继续处理请求。
    *   200响应处理：
        检查响应类型Content-Type，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行
        后续的渲染，如果是html则通知浏览器进程准备渲染进程准备进行渲染。

7.  准备渲染进程

    *   浏览器进程检查当前url是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程

8.  传输数据、更新状态

    *   渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”
    *   渲染进程接收完数据后，向浏览器发送“确认提交”
    *   浏览器进程接收到确认消息后更新浏览器界面状态：安全、地址栏url、前进后退的历史状态、更新web页面

# 问题四：渲染流程

1.  **渲染进程接受完数据之后，先把html内容转换为DOM树**(document)

2.  **渲染引擎将html内容里的css内容转换为styleSheets**(document.styleSheets)，还会把属性值标准化，比如rem转换为px，**计算DOM节点的样式**，把不显示在页面的DOM去掉。设置为display:none的节点，会存在在DOM树里。

3.  **创建布局树，计算元素、节点的布局信息**

4.  对布局树进行分层，生成分层树。页面元素是按照嵌套关系组织的，生成分层树，使得渲染更加高效

5.  对每一个图层生成绘制列表，并提交到合成线程中。绘制列表只是用来记录绘制顺序和绘制指令的列表，际上绘制操作是由渲染引擎中的合成线程来完成的。

6.  **合成线程将图层会分成图块，并在光栅化线程池中将图块转换成位图。**合成线程会将图层划分为图块（tile），这些图块的大小通常是 `256x256` 或者 `512x512`,合成线程会按照**视口**附近的图块来**优先**生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图.位图（bitmap），也叫做**光栅图或像素图**，例如，当浏览器将网页中的 `SVG` 图片或 `Canvas` 元素渲染成屏幕上可视的元素时，会使用光栅化技术将其转换为位图。位图可以直接在屏幕上显示，而不需要进行额外的计算，因此它们是一种非常高效的图像呈现方式。栅格化过程都会使用 `GPU` 来加速生成，使用 `GPU` 生成位图的过程叫**快速栅格化**，或者 `GPU` 栅格化，生成的位图被保存在 `GPU` 内存中。这就涉及到了跨进程操作。

7.  **合成线程发送绘制图块命令 DrawQuad 给浏览器进程。**

8.  **浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。**浏览器进程里面有一个叫 `viz` 的组件，用来接收合成线程发过来的`DrawQuad`命令，然后根据`DrawQuad`命令，将其页面内容绘制到**内存**中，最后再将内存的绘制内容显示在屏幕上。

`CSS`的`transform`属性可以用来对元素进行**平移、旋转、缩放等变换**。由于`transform`**只涉及到视觉呈现的变化，而不会引起文档流的改变，因此在使用`transform`实现动画效果时，可以避开重排和重绘阶段，从而提高页面性能。**


# Hppt2.0
- 性能提升
  - 头部压缩
    - 在 HTTP/1.1 及之前的时代，请求体一般会有响应的压缩编码过程
    - 对于` GET `请求，请求报文几乎全是请求头，这个时候还是存在非常大的优化空间的
  - 多路复用
    - 并发连接和域名分片，只是增加了 TCP 连接 -> 多条 TCP 连接会竞争有限的带宽 ->  二进制分帧 

- 二进制分帧
  - 在数据链路层是通过帧来传输的，提前解析成帧，转换为二进制串，Header + Data的形式
  - 分帧之后，服务器收到的是乱序的二进制帧，不存在先后关系，也就解决了http1.1的队头阻塞的问题
  - 二进制帧到达后对方会将 Stream ID 相同的二进制帧组装成完整的请求报文和响应报文
  - 通信双方都可以给对方发送二进制帧，这种二进制帧的双向传输的序列，也叫做流(Stream)。

- 颠覆性功能
  - 设置请求的优先级
  - 服务器推送
    - 新建 stream 来给客户端发送消息
    - 比如浏览器请求一个 HTML 文件，服务器就可以在返回 HTML 的基础上，将 HTML 中`引用到的其他资源文件`一起返回给客户端，减少客户端的等待
    - 

# CDN（内容分发网络）
- 网站预先内容分发到全国各地的（加速）节点，有效提升下载速度、降低响应时间
- 流程
  - 发送域名
  - DNS服务器返回的不是ip，而是别名指向CDN的全局负载均衡
  - 这个`CDN专用的DNS的服务器`，会根据ip来查看地址等情况
  - 返回最佳的ip

# http发展史

- 请求头
  - accept [期待服务器返回的类型文件] text/html
  - accept-encoding [压缩方式] gzip
  - accept-Charset [文件编码的方式] utf-8
  - accept-language [优先语言]
  - Connection: [默认支持长连接] keep-alive
  - User-Agent：[用户代理字段] Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
- 响应头
  - content-encoding [最终返回的压缩类型]
  - content-type [文件类型]
- http 0.9
  - 只有get请求
  - 明文ASII码传输
  - 只支持html文件，数据量不够用，要面向国际化，没有响应头，不知道用户的信息

- http 1.0
  - 出现了 post请求，可以增大数据量
  - 状态码解决了请求的情况的问题
  - 引入了缓存机制：Expires、Last-Modified（If-Modified-Since）
  - User-Agent字段表示用户`客户端信息`，
  - 频繁断开，无状态协议（需要会话信息的存储），没有安全机制还是明文传输，动态生成的内容不知道长度

- http 1.1
  - Connection: [默认支持长连接] `keep-alive`
  - cookies 应运而生
  - HTTP/1.0 中引入的 Host ，虚拟机问题，一个服务器可能会承载多个域名的网站
  - 最后使用一个`零长度`的块作为发送数据完成的标志。这样就提供了对动态内容的支持
  - 浏览器为每个域名最多同时维护 `6个TCP连接`
  - put delete option
- http 2.0
  - 一个域名只使用一个 TCP 长连接和`消除应用层传输协议的队头阻塞问题`，HTTP/2 最核心、最重要且最具颠覆性的`多路复用机制`
  - 举个简单的例子，当客户端需要向服务器发送一个`较大的HTTP POST请求`时，这个HTTP消息可能会被分割为多个数据帧（DATA Frame），每个数据帧携带部分请求体数据；同时，还会有一个`头部帧`（HEADERS Frame）携带请求的头部信息。这些帧一起构成了完整的HTTP消息，在传输过程中被`交错发送`，最终在`服务器端``重新组装`成完整的HTTP消息进行处理。
  - 能直接拿到需要的` CSS `文件和` JavaScript `文件
  - 首部压缩，有效降低了请求头不压缩浪费的资源
  - 服务器推送，（顺便）主动推送相关的静态资源
- http 3.0
  - QUIC

# TCP的keepalive
-  它的作用就是`探测`对端的连接有没有失效,检测`长时间`的死连接
-  现状是大部分的应用并没有默认开启 TCP 的keep-alive选项
-  7200s 也就是两个小时检测一次，时间太长

# TCP流量控制
- 三次握手，`初始化`发送和接收窗口的大小，均为200字节
- 当前发送端给接收端发送 100 个字节，发送端的`可用窗口`减少了 100 个字节，`往后移动`
- 这 100 个到达了接收端，被放到接收端的`缓冲队列`中，`大量负载`
- 只能处理 40 个字节，剩下的 60 个字节被`留`在了缓冲队列
- 接收端会在 `ACK` 的报文首部带上缩小后的滑动窗口 140 字节
- 
# TCP拥塞控制
- 刚开始进入传输数据的时候，你是`不知道现在的网路到底是稳定还是拥堵的`，如果做的太激进，发包太急，那么疯狂丢包，造成雪崩式的网络灾难。因此，拥塞控制首先就是要采用一种`保守`的算法来慢慢地适应整个网路，这种算法叫`慢启动`
  - 三次握手，宣告接收窗口的大小
  - 初始化拥塞窗口`cwnd`的大小
  - 起初每增加一个ACK，拥塞窗口增二，到了`慢启动阈值`
  - TCP传输过程中丢包了，接收端发现数据段不是按序到达的，而是重复的`ACK报文`，马上进行`快速重传和选择性重传`
  - 快速恢复，拥塞阈值降为一半
- 拥塞窗口是指目前`自己还能传输`的数据量大小
# TCP三次握手为什么不是两次
- 无法确认客户端的接收能力。

# 为什么是四次挥手而不是三次？
- 第四次挥手，主动关闭端等待2MSL是必须的
- 要使得服务端知道它最后发出的Fin报文成功了
- 那，照这样说一个 MSL 不就不够了吗，为什么要等待 2 MSL?
  - 1 个 MSL 确保四次挥手中主动关闭方最后的 ACK 报文最终能达到对端
  - 1 个 MSL 确保对端没有收到 ACK `重传`的 FIN 报文可以到达
# XXS攻击
**讲一下什么是XXS攻击**
- 叫**跨站脚本**攻击
- 分为三种情况
  - **存储型**、**反射型**和**文档型**
- 存储型比较常见的例子就是评论去输入一段脚本代码，没做**转义**和过滤等操作，就会存储到数据库里，页面渲染过程中直接执行。
- 反射型比较常见的就是脚本代码作为网络请求的一部分，不会存储，但是浏览器会执行这个脚本
- 文档型是在数据传输过程中劫持数据包，修改里面的html文档

**怎么防范XXS攻击呢？**
- 一个信念，两个利用
- 千万不要相信用户的任何输入，必须经过**转义**和**过滤**
- 利用`CSP`安全机制，核心思想就是服务器决定浏览器加载哪些资源
- 利用`HttpOnly`
  - 很多 XSS 攻击脚本都是用来窃取`Cookie`, 而设置 `Cookie` 的 `HttpOnly` 属性后，`JavaScript` 便无法读取 `Cookie` 的值。这样也能很好的防范 `XSS` 攻击。

# CSRF攻击
**讲一下什么是CSRF攻击**
- `即跨站请求伪造`
- 比较常见的有黑客诱导用户点击链接，那么就打开了黑客的网站，黑客就**利用用户目前的登录状态**发起跨站请求
- 然后就可能做下面几件事
- 1是自动发**get**请求，这个请求会带上之前你已经登录过的网站的cookie，然后进行操作，获取信息、转账汇款
- 2是自动发**post**请求，写了一个自动提交post请求的脚本，恶意操作
- 3是诱导点击发送get请求，流程大差不大
- CSRF攻击并不需要将恶意代码注入用户当前页面的html文档中，而是跳转到新的页面，**利用`服务器的验证漏洞`和`用户之前的登录信息比如cookie`来`模拟用户进行操作`。**

**怎么防范CFRS攻击**
1. 利用`Cookie`的`SameSite`属性
   - strict模式，完全禁止第三方请求携带，完全遵守同源策略
   - lax模式，get提交的时候可以携带
   - none模式，自动携带
2. 验证来源站点，**请求头**中的两个字段，Origin(域名)和Referer(URI)，但是可以伪造啊
3. 验证**CSRF Token令牌**


● window.onload 事件会等待页面所有资源加载完成后才触发，因此可能会导致页面加载速度较慢。
● document.ready 事件只等待 HTML 文档加载完成后就触发，不需要等待其他资源加载完成
● `eventTarget` 指向`实际`目标元素，`currentTarget` 指向事件`绑定`的元素，如果不阻止事件冒泡，eventTarget 的值可能会随着事件冒泡而改变。
● HTTPS握手涉及"多次握手"，但实际上这包括了TCP的三次握手和TLS/SSL握手的多次消息交换。TLS/SSL握手本身不是简单的一次握手过程，而是一个包含了多个回合的协议谈判过程。

