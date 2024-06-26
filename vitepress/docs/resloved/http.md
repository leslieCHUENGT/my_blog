# 跨域
**讲一下跨域是啥**
- 跨域本质就是**浏览器**基于**同源策略**的一种安全的手段，跨域是对浏览器的限制。同源策略呢，是浏览器核心的安全功能。
- 同源策略呢，三个相同，协议、主机、端口相同。当有一个不同了，就会产生跨域问题。
- **跨域实际上是浏览器基于同源策略的突围方式，因为同源策略限制了浏览器，访问不同源的URL就会产生跨域**
- 而同源策略就是浏览器的安全手段
- 而同源策略有三个相同
- 协议
- 域名
- 端口：80 443 https
  
**跨域拦截是浏览器拦截还是服务器拦截**
- 基于同源策略，浏览器发现是非同源的资源，浏览器会把响应体丢弃
- 所以能发出请求，服务器也会正常响应，只不过结果被浏览器拦截了

**假设我现在在淘宝，要去百度，我还会携带上淘宝的cookie吗**
- 不会，在`cookie`中，`domain`属性指定了`cookie`的所属域名和其下的子域名共享，`path`属性来指定路径，其他路径则无法获取
- 子域名就是指以**example.com 作为后缀**的所有域名，`blog.example.com` 等都属于 `example.com `的子域名。
- 这两个属性决定了服务器发送是否会带上这个cookie

**淘宝跳转到天猫页面为什么不需要重新登陆( taobao.com 和 tmall.com )**
- 这个应该是和服务器端`session ID`和`token`有关
- 当登录时发送请求到服务器，服务器创建`session ID`和`token`,会返回它作为`cookie`的一部分
- 点击跳转的时候根据这个包含`session ID`和`token`的`cookie`和服务器端的进行验证即可

**如何解决呢**
- `vue`全栈项目里我是用的最多的是`CORS`跨域，也就是跨域资源共享，它是一系列http头组成的
- 实质就是在后端服务器增加一些特点的响应头信息
- 通过设置响应头`Access-Control-Allow-xxx`字段来设置访问的**白名单**、**可允许访问的方式**等
- 比较常见的有
  - Access-Control-Allow-Origin `'host'`可以设置白名单
  - Access-Control-Allow-Headers `'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'`
  - Access-Control-Allow-Methods `'PUT, POST, GET, DELETE, OPTIONS'`
  - **白名单** **请求头** **方法**
- 还有就是通过proxy来实现跨域
- 它的本质就是通过绕开浏览器的同源策略限制来实现的
- 一是可以通过`webpack`的`devServer`来配置`proxy`进行代理
- 二是通过`nginx`实现代理
- 三是设置`express`设置代理的中间件

- 还有是一个`html5`原生的`websocket`也可以进行跨域
- `WebSocket` 是一种在单个`TCP `连接上进行双向通信的协议。与 `HTTP` 不同的是，`WebSocket` 在建立连接后，客户端和服务器之间可以直接发送消息，而不需要像 `HTTP` 一样每次请求都需要建立新的连接。
- 要实现 `WebSocket` 跨域服务，要向 `CORS` 一样设置允许特定域名的跨域请求才行

- 最后我还了解了jsonp来实现跨域
- 返回的数据会被当做`JavaScript`代码执行
- 浏览器对于` <script>` 标签的请求不受同源策略限制的特性。
- JSONP只支持`GET`请求，无法支持`POST`等其他类型的请求。
  - jsonp引发的恶意攻击：
  - XXS与CSRF攻击
  - 数据泄漏

**讲一讲jsonp具体怎么实现**
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


**讲讲跨域中怎么携带cookie**
- 后端设置响应头`Access-Control-Allow-Credentials`为`true`，表示允许浏览器发送包含身份凭证的请求，比如cookie、授权标头。
- 在前端发送请求时，需要设置 `withCredentials` 为 `true`，表示可以发送包含身份凭证的请求。
- 都必须使用`https`协议
- 由于 Cookie 存储的敏感信息，本应只能在设置了 `Secure` 和 `HttpOnly` 属性、使用 `HTTPS` 协议的情况下才能传输
- 浏览器默认禁止在非 HTTPS 的环境下跨域携带 Cookie。
- 失效


# nginx
**讲一下nginx的反向代理**
- 反向代理服务器充当了一个**中间人**的角色
- 输入网站访问服务器的时候，会先通过http或者https协议发送到反向代理服务器
- nginx根据配置呢，把请求转发到后端服务器上面
- 响应返回给nginx服务器，nginx服务器转发响应给客服端

**负载均衡**
- 定义了**后端服务器集群**
- 通过**合理地分配负载**，负载均衡可以确保每台服务器都能够得到合理的负载，从而提高系统的稳定性和性能。

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

# Cookie、Session、Token、JWT
https://juejin.cn/post/6844904034181070861#heading-5
- Authentication是验证当前用户的身份
- Authorization用户授予第三方应用访问该用户某些资源的权限
- Credentials实现认证和授权的前提是需要一种媒介（证书） 来标记访问者的身份

**什么是cookie**
- cookie会存放用户的**偏好信息、登录凭证**
- `http`是无状态的协议，对于每次的事务处理是没有记忆能力的，结束会话就不会保存任何会话信息
每个请求都是独立的，**为了进行会话跟踪**，就需要去维护一个状态
这个状态可以通过`cookie`或者`session`实现
- `cookie`存储在客服端上，一般不能超过4kb
- `cookie`比较重要的属性：
  - `domain`、`path`(跨域)
    - 指定 cookie 所属域名，默认是当前域名
    - 指定 cookie 在哪个路径（路由）下生效，默认是 '/'。
      如果设置为 /abc，则只有 /abc 下的路由可以访问到该 cookie，如：/abc/read。
  - `httpOnly`可以禁止`js`获取`cookie`防范`XSS`攻击，但是可以在`application`手动修改获取
  - `maxAge`(设置时间)
  - `secure`当 secure 值为 `true` 时，cookie 在 HTTP 中是无效，在 `HTTPS` 中才有效。
  - `SameSite`属性
    - strict模式，完全禁止第三方请求携带，完全遵守同源策略
    - lax模式，在大多数情况下表现得像Strict，对get、post请求的网站更宽松了
    - none模式，自动携带
- 怎么生成的？发来请求，服务器就在响应头设置set-Cookie，指定了什么内容要放到cookie里，再发送就发请求头的cookie

**什么是session**
- `session`是另一种记录服务器和客服端**会话状态**的机制
- **会话信息**可以包括**用户身份验证状态、购物车内容、搜索历史记录以及其他与用户交互相关的数据。**
- `session`可以存储的数据远高于`cookie`
- `session`是基于`cookie`实现的，`session`存储在服务器端，`session ID`会被存储到客服端的`cookie`中
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8db049ca37343cda1fd37fde7c47e33~tplv-k3u1fbpfcp-watermark.image?)

**cookie和session的区别**
- 安全性：`session`更安全
- 存取值的类型不同：`Cookie` 只支持存**字符串数据**，想要设置其他类型的数据，需要将**其转换成字符串**，`Session` 可以存任意数据类型。
- 有效期不同：cookie可长时间，session一般在**客服端关闭了**就失效了
- 存储量：4kb，...

**什么是Token**
- **`Token`是指身份验证的令牌**，一般指`Access Token`比如当用户登录后，**服务器**会生成一个`token`发送给客服端，它包含一些加密的信息，后续请求中`验证`客服端用户的身份
- 后续的请求中，客服端会把这个`token`作为**请求头的一部分**
- `token`完全由应用管理，所以他可以避开同源策略
- 还有一种`token`叫做`Refresh Token`
- 它是专门用来刷新access token的token
- 举个经典的例子，当用户登录发送请求，服务器会加密生成token返回给客服端，
- 当然，我这里举的例子是当`token`存储在`cookie`或者`localStorage`里的，这个`token`里有`access Token`和`Refresh Token`
- `Refresh Token`的有效期是比较长的，当`access Token`过期，而它没过期，那么服务器端会返回新的`access Token`和`Refresh Token`
- 也就不需要重新登录了
- `Access Token`和`Refresh Token`可能会被存储在**服务器端的数据库中**
- 现在基本都是JWT规范来生成token，在我项目里就用到了JWT生成token、还有另一个项目里用把一个密匙字符串存放到token里来。

# 讲一讲你项目里是使用JWT生成token和前端校验的过程
- 前端用户登录经过校验，发送post请求给后端
- 后端在经过加密中间件、校验中间件后会通过jwt.sign方法来生成token
- 使用jwt.sign方法时会先剔除password这种敏感的信息，保护用户的隐私安全
- 此时响应体里就会携带token信息，前端将token信息放入localStorage
- 当需要校验是否登录时，会发送`Authorization`头部从中获取JWT
- 通过jwt.verify方法来解密jwt进行校验token，防止客服端发出来的被篡改的信息，因为在传输的token里的payload都是只经过base64转码的信息。
- 前一个项目里用的就是简单的把一个字符串token放入localStorage里
- 验证有没有表示登录过
- 但是如果想持久化token，可以放在数据库里来进行校验和验证


**讲一讲session和Token的区别**
- session是记录服务器端和客服端会话状态的机制，Token是指验证身份的令牌
- session和token并不矛盾，各司其职
- 他们可以一起进行用户信息的验证，登录操作时，服务器会返回带有session ID和token的cookie

**什么是jwt**
- JSON Web Token
- JTW的组成
  - Header：包含令牌类型和使用的算法信息
  ```json
  {
  "alg": "HS256",
  "typ": "JWT"
  }
  ```
  - Payload:可以包含用户id、用户名和过期时间
  ```json
  {
    "user_id": 123456,
    "username": "john_doe",
    "exp": 1624898400  # 过期时间，这里为2021-06-29 00:00:00
  }
  ```
  - Signature:使用指定算法对header和payload进行加密生成的签名字符串，用于验证token的合法性。
  ```js
  HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
  secret)
  ```
  - secret是服务端保存的**私钥**，用于生成签名；base64UrlEncode()是一种特殊的base64编码方式，去掉了“+”、“/”和“=”，用“-”、“_”和“”代替，使其在URL中传输更方便。
- 组合JWT
```js
// JWT Token
// 记住JWT的header.payload.signature结构，我们只需要组合以上的三个部分，用点（.）分隔它们。
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQifQ.-xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM
```



**JWT 的使用方式**
- "Bearer" 是一种**认证机制中的一种类型**
  ```js
  Authorization: Bearer <token>
  ```
- 客户端收到服务器返回的 `JWT`，可以储存在 `Cookie` 里面，也可以储存在 `localStorage`
- 所以更好的做法是放在 `HTTP` 请求头信息的 `Authorization` 字段里，使用 `Bearer` 模式添加 `JWT`。

**Token 和 JWT 的区别**
- Token：要**查询数据库获取用户信息**，然后验证 `Token` 是否有效。
- JWT：减少查询数据库操作，因为 `JWT` 自包含了用户信息和加密的数据。

**使用cookie时应该注意的问题**
- 安全角度：存在本地客户端，可以被篡改，需要检查合法性，httpOnly只能是稍微提高了点安全性
- 使用角度：设置正确的domian和path，防止cookie外泄，cookie也不能太大

**使用 session 时需要考虑的问题**
- session存储在服务器，占用服务器资源，又要定期清理过期的session
- session基于cookie实现，要考虑cookie跨域问题
- **当然sessionId可以在url参数后面重写url或者在请求头里添加自定义的header，不基于cookie也其实可以实现**

**使用token时需要考虑的问题**
- 会用到数据库查询，可能会导致查询时间长。
- token 可以避免 `CSRF` 攻击，(因为不需要 `cookie` 了)

# localStorage和sessionStorage
- localStorage: 存储的数据是永久性的
- sessionStorage: 窗口或者标签页被关闭,就会清除数据
- localStorage: 在同一个浏览器内，同源文档之间共享 localStorage 数据，可以互相读取、覆盖。
- sessionStorage：只有同一浏览器、同一窗口的同源文档才能共享数据。

# HTTPS

**HTTPS为什么会出现**
- http是**明文传输**，容易被截取、修改和伪造请求发送
- http不会验证通信方的身份，**没有用户验证**
- http传输过程中**不会验证报文的完整性**，保证不了**数据一致性**

**什么是HTTPS**  
- HTTPS 是 HTTP 协议的一种扩展，它本身并不保证传输的证安全性
- **传输层安全性**`(TLS)`或**安全套接字层**`(SSL)`对通信协议进行加密。也就是 `HTTP` +` SSL(TLS)` = `HTTPS`。
- `TLS`是`SSL`的更新版本
- 原理是`HTTP`和`TCP`之间建立了一个**安全层**，安全层的核心就是加解密
- HTTPS默认使用**服务器**的`443`端口

**对称加密和非对称加密**
- 对称加密：加密和解密时使用的密钥都是同样的密钥，比如位运算。速度快
- 非对称加密也被称为公钥加密，比如特定的曲线方程和基点生成公钥和私钥。速度慢

**讲讲HTTPS加解密的流程吧**

[图解SSL/TLS协议 - 阮一峰的网络日志 (ruanyifeng.com)](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a912ac78bcbc4270888d418e6eaa520d~tplv-k3u1fbpfcp-watermark.image?)

- 重点在`Premaster secret`，给到了服务器端解密后，有了对称加密的方法，那么两边都有对称加解密的方法了
- 非对称加密开销大，复杂度高；并且公钥谁都有，可以解开。

1. 用户发起`HTTPS`请求,和服务器的`443`端口连接
2. `HTTPS`收到请求，返回响应，响应包括`CA`证书、证书里面有公钥`Public`，私钥`Private`保留在了服务器，不公开
3. 客服端收到证书，校验合法性，主要包括：是否有限期内、证书的域名和请求的域名是否匹配、颁发机构，合法则继续下面的流程
4. 客服端会用证书里的公钥加密一个`key`，发送给服务端
5. 服务端收到这个`key`，会用私钥解密，然后再对`key`进行对称加密，响应返回给客户端
6. 客户端使用对称解密这个`key`
7. 这个时候客户端和服务器端都有了这个`key`的真实值，后续请求就用对称加解密来相互验证就可以了
总结：对称加解密和非对称加解密混合，结合证书验证。


# 浏览器架构
- 并行处理就是采用多线程处理任务
- **进程启动和管理线程**，进程就是程序的**运行实例**
- 本质来讲进程是**运行的环境**，操作系统会开创一块内存来存放代码，数据和文件
- 进程的任意线程出错，那么整个进程崩溃，参考原始的IE
- 线程是可以共享进程的数据的
- 进程退出，操作系统就会回收内存
- 进程和进程之间相互隔离，靠IPC通信

**为什么单进程浏览器时代存在不稳定、不流畅和不安全的问题**
- 插件和渲染引擎模块容易崩溃
- 渲染的线程，只有一个模块可以执行，插件也可能会出现问题啊
- 插件可以获取进程的资源，浏览器本身有些功能是需要对接到操作系统的，比如文件下载等，利用漏洞来恶意操作

**目前多进程架构**
https://time.geekbang.org/column/article/113513
- **有五类进程**
- **浏览器主进程**：负责界面显示、交互、存储
- **渲染进程**：运行在沙箱模式下，这个模式下的进程不可以对硬盘写入数据，不能在敏感位置读取数据。因为这个进程的核心任务是将HTML、CSS和javascript转化成可以交互的页面，可以存在跨站脚本攻击`XSS`，它可以禁止进程访问用户的cookie，限制对其他网站的访问，减少了`CSFR`攻击。
- **GPU进程**：为了实现3D CSS和UI界面的绘制
- **网络进程**
- **插件进程**
![](https://static001.geekbang.org/resource/image/a9/76/a9ba86d7b03263fa3997d3733d958176.png?wh=1142*630)
# TCP/IP 是如何工作的
**互联网，实际上是一套理念和协议组成的体系架构。都遵守一套协议，那么网络通信将会畅通无阻。**
- IP(Internet Protocol)网际协议
- 也就是计算机的地址，访问任何网站也不过是从一台计算机到另一台计算机请求信息
- 数据包要有IP头
- IP 头是 IP 数据包开头的信息，包含 IP 版本、源 IP 地址、目标 IP 地址、生存时间等信息。

- UDP(User Datagram Protocol)用户数据包协议
- 通过计算机上的端口号来把数据包发送给指定的程序
- 所以数据包又多了一个头
- UDP不能保证数据的完整性，因为对于错误的包，它直接丢弃，传输速度是非常快的

- TCP（Transmission Control Protocol，**传输控制协议**）是一种面向连接的、可靠的、基于字节流的传输层通信协议。
- TCP 头除了包含了目标端口和本机端口号外，**还提供了用于排序的序列号，**以便接收端通过序号来重排数据包。
- 一个完整的 TCP 连接的生命周期包括了“**建立连接**”“**传输数据**”和“**断开连接**”三个阶段。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4b5168e7b674065b03d011ff88080bf~tplv-k3u1fbpfcp-watermark.image?)

- 其中，传输数据阶段。接受端需要对每个数据包进行确认操作
- 也就是说收了数据包，得回信，不然就算是数据包丢失，就触发了重发机制
- 小包传过去就可以用头信息的序列号来排序

# HTTP请求流程 

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2e2d74b8487433aa2034becafed3882~tplv-k3u1fbpfcp-watermark.image?)

如果你在浏览器地址栏里键入极客时间网站的地址：
1. 构建请求，
2. 查找缓存，先看看缓存的生存期到没到期
3. 准备IP地址和端口
  - 这个时候通过DNS来返回域名对应的IP，DNS也有缓存的
  - 建立TCP连接需要计算机程序的端口号，起始的和最终的
  - http是在80端口
4. 等待TCP队列，一个域名下可能存在的TCP连接大于6个，就需要排队
5. 建立TCP连接
  - 三次握手确定连接
    - **SSL/TLS**
6. 发起HTTP请求

**为什么很多站点第二次打开速度会很快？**
- DNS 缓存和页面资源缓存

# 从输入URL到页面展示，这中间发生了什么？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9f72d3b73fa441f94fd089b1110a803~tplv-k3u1fbpfcp-watermark.image?)

1. 用户输入url并回车
2. 浏览器进程检查url，组装协议，构成完整的url
3. 浏览器进程通过进程间通信（IPC）把url请求发送给网络进程
4. 网络进程接收到url请求后检查本地缓存是否缓存了该请求资源，如果有则将该资源返回给浏览器进程
5. 如果没有，网络进程向web服务器发起http请求（网络请求），请求流程如下：
  - 进行DNS解析，获取服务器ip地址，端口
  - 利用ip地址和服务器建立tcp连接
  - 构建请求头信息
  - 发送请求头信息
  - 服务器响应后，网络进程接收响应头和响应信息，并解析响应内容
6. 网络进程解析响应流程；
  - 检查状态码，如果是301/302，则需要重定向，从Location自动中读取地址，重新进行第4步，如果是200，则继续处理请求。
  - 200响应处理：
    检查响应类型Content-Type，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行
    后续的渲染，如果是html则通知浏览器进程准备渲染进程准备进行渲染。
7. 准备渲染进程
  - 浏览器进程检查当前url是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程
8. 传输数据、更新状态
  - 渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”
  - **渲染进程接收完数据后，向浏览器发送“确认提交”**
  - 浏览器进程接收到确认消息后更新浏览器界面状态：安全、地址栏url、前进后退的历史状态、更新web页面

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

`CSS`的`transform`属性可以用来对元素进行**平移、旋转、缩放等变换**。由于`transform`**只涉及到视觉呈现的变化，而不会引起文档流的改变，**因此在使用`transform`实现动画效果时，可以避开重排和重绘阶段，从而提高页面性能。
相比之下，通过改变元素的位置、大小等属性来实现动画效果，会导致文档流的改变，引起重排和重绘的发生。这些操作需要重新计算布局，并重新绘制页面元素，所以会比使用`transform`产生更大的性能开销。
因此，在实现动画效果时，尽可能使用`transform`属性，可以有效地减少页面的重排和重绘次数，提高页面的性能。

# styleSheetList由什么组成

# 再讲一讲复杂的渲染流程
- 浏览器的网络进程接收到HTML文档，那么渲染进程的主进程消息队列的尾部就会多一个渲染任务
- 渲染主线程就会开始渲染
- 主要分为八个步骤：html解析 样式计算 形成布局树 分层树 绘制 分块 光栅化 画 
- html解析
  - 当对html文档进行解析时
  - 会得到DOM树和CSSOM树
- 计算样式
  - 根据CSSOM来计算样式，生成一个带有样式的DOM树
  - 预设值会变成绝对单位 red -> rgb(255,0,0)
- 形成布局树
  - 也就是根据上面计算的来剔除或者增加一些节点
  - 剔除是因为display：none 等等等
  - 增加是因为伪元素或者对一些元素的处理要进行包裹一个匿名块盒或者行盒
- 根据布局树来进行分层
  - 分层渲染可以提升效率，也符合html文件里嵌套的标签
  - 但是不会简单的根据盒子嵌套来分层，不同浏览器会有不同的优化
  - z-index、滚动条、transform和opacity会影响分层，会决定是否需要给予新的图层
  - 通过will-change属性更大程度的影响分层结果。
- 绘制
  - 这时主线程将每个图层的绘制信息产生指令，指令提交到合成线程里
- 分块
  - **合成线程**会对图层进行分块，产生多个任务
  - 就可以从线程池里取多个线程来工作
- 进行光栅化，形成位图的信息，也就是像素图的信息
  - 合成线程会把图块的信息交给GPU进程进行光栅化
  - 这里涉及一个跨组件通信
  - GPU内存里就会保存位图信息
- 画
  - 合成线程会提交指引给GPU进程
  - GPU进程产生系统调用，进行显示

# 讲一讲重排
- 实际上就是影响了渲染主进程对布局树的生成
- 并且为了优化重排对**布局树**频繁的生成
- 所以对于属性改动的重排会进行异步处理
- 还有一些容易被忽略的操作：`获取一些特定属性的值`
`
offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight

这些属性有一个共性，就是需要通过`即时计算`得到。因此浏览器为了获取这些值，也会进行回流
- 也就是改动了，马上去获取布局信息，打印台的结果可能不是最新的
- 重排会使主线程传递的绘制指令不同
- 所以重排必定重绘

# 减少重排
- 避免使用 table，容易导致整个table的计算
- 复杂动画，将其尽量脱离文档流，减少对其他元素的影响
- 使用css3硬件加速，可以让`transform、opacity、滤镜效果（filter 属性）`这些动画不会引起回流重绘
- 

# CPU、GPU
- CPU（Central Processing Unit）即中央处理器，是计算机中的主要晶片之一，其核心功能是执行各种指令并控制计算机的操作。
- GPU（Graphics Processing Unit）则是一种专门为图形渲染而设计的处理器。GPU 的主要功能是进行图形处理和图像渲染

# 讲一讲重绘
- 实际上也就是主线程**分层树**发生改变，导致给合成线程的绘制指令不同

# 为什么transform效率高
- 基本上只会影响GPU绘画的过程，对渲染主线程基本没影响，合成线程给GPU的指引不同了


**讲一讲eventloop**
- 要理解浏览器的eventloop就需要了解浏览器的**进程架构**
- 浏览器源码里就是用循环语句里监听是否有新任务的一个模型
- eventloop在浏览器的**渲染进程**里运行
- 渲染进程里有一个渲染主线程和**IO线程**
- 为了实现跨线程，处理其他线程的任务，就比如网络进程的资源加载传入，点击事件的操作
- 引入了消息队列这个数据结构
- 又为了要先处理优先级高的问题，因为队列是先进先出，没办法直接处理优先级的问题
- 所以微任务和宏任务就应运而生
- **每个宏任务都包含一个微任务队列**
- 宏任务在js的调用栈里执行，产生的微任务就会添加到调用栈里
- 为了支持定时器，又增加了**延时队列**
- 这大概就是浏览器渲染进程里eventloop的框架了

**为什么渲染进程不适用多个线程来处理**

**讲一讲宏任务和微任务**
- 大部分任务在渲染主线程里都是宏任务
- 毋庸置疑最常见的就是
- 浏览器渲染事件（如解析 DOM、计算布局、绘制）
- 用户交互事件（如鼠标点击、滚动页面、放大缩小等）
- 网络请求完成、文件读写完成事件
- js事件
- 微任务就是需要异步执行的函数，执行时机是在调用栈中主函数执行完了，宏任务马上全部结束了，就会执行微任务。
- 微任务有两种：
- DOM节点发生变化了，增删节点，优先级高，设置成微任务，很符合需要
- 使用Promise原型上的方法，产生对应的回调函数。会设置成微任务

要注意的是，虽然在过去，Promise 对象的“解决”或“拒绝”操作可能会使用 setTimeout 来模拟异步执行，但现代浏览器和 JavaScript 引擎已经对其进行了优化，使得它们可以更加高效地处理微任务，并且不再需要使用 setTimeout 进行处理。因此，当调用 Promise.resolve() 或者 Promise.reject() 方法时，产生的微任务与 setTimeout 函数没有直接关系。

# 如何理解js的异步
- js是一门单线程的语言，因为运行只在浏览器渲染主线程里运行  
  - 渲染、执行js
- 单线程，使用同步代码，那么就会对主线程产生堵塞
- 就必须采取异步的处理方式，源源不断的、在相应时刻把回调函数包装成任务加入消息队列
- 等待主线程调度
- 渲染主线程就永不堵塞，单线程运行的实现

# js是如何影响渲染的
- 微队列： 最高
- 交互队列：监听到用户的点击事件，把回调函数包装成任务  高
- 延时队列：setTimeout 中
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/def4cd1e824d46cc9da655c791a5bc72~tplv-k3u1fbpfcp-watermark.image?)

# 讲一讲eventloop
- eventloop又叫message loop,js是在浏览器渲染进程里执行的
- 而eventloop就是执行的机制
- 实际上浏览器源码里就是一个不会停止的循环，对消息队列取出第一个任务执行，其他线程会把任务添加到消息队列的末尾
- 现在的浏览器对消息队列里的任务不只分为宏任务和微任务了，为了区别优先级
- **微队列**、**交互队列**、**延时队列**等
- W3C官网的说法是：必须要有微队列，同一种任务要放同一个队列里，微任务的具有最高优先级，必须**优先调度执行**。
- 微任务
  - Promise回调函数
  - MutationObserver 回调函数：MutationObserver 是浏览器提供的一个 API，用于监听 DOM 树的变化。
  - IntersectionObserver 回调函数：IntersectionObserver 也是浏览器提供的一个 API，用于监听指定元素与视口（即浏览器窗口）的交叉情况。
- 宏任务
  - 渲染事件（如解析 DOM、计算布局、绘制）；
    - `requestAnimationFrame `回调函数：在下一次绘制前执行指定的回调函数。自动适应设备的**刷新率**，从而实现更加平滑的动画效果。
  - 用户交互事件（如鼠标点击、滚动页面、放大缩小等）；
  - JavaScript 脚本执行事件；
  - 网络请求完成、文件读写完成事件。`XMLHttpRequest` 和` fetch `请求
# 讲一讲js计时器可以做到精准计时吗
- 调用的是操作系统的函数，不可能做到精准计时
- w3c标准：嵌套过5层，就会至少带有4毫秒的默认时间
- 计时器的回调函数要在主线程空闲时候才能执行，会有偏差

# 回调函数
- 回调函数是指在某个函数执行完毕后，调用另一个函数的过程。
- 当某个异步请求完成时，它会调用预定义的回调函数来处理响应数据。
- 当用户单击按钮或输入文本时，可以将回调函数与该事件相关联并在事件发生时调用回调函数。

# 讲一讲http各个版本
## http0.9
- 只支持GET请求，响应内容为纯文本
## http1.0
- 引入了POST、HEAD、PUT等方法
- 支持响应头、状态码、字符集、多部分发送，代理
- 支持cookie记录会话
- B/C 和 C/S 两种不同的架构模式
## http1.1
- 持久化连接keepAlive
- 管道传输:pipline
- 同一个TCP上建立链接，多次发送，减少建立链接的次数
- Cache值有哪些？
  - public
    - Cache-Control：public，max-age=8600
    - CDN或其他代理服务器缓存 
  - private
    - 只能被客服端缓存 不允许中间节点缓存
  - max-age
  - no-store
    - 谁也不可以缓存
  - no-cache
    - 一定是协商缓存
    - 客服端或中间服务器需要发起验证请求，以确认缓存中的数据是否过期，过期就要 向服务器发起请求
  - must-revalidate
    - 客服端或中间服务器不得缓存过期的响应，并要求验证
      - IF-Modified-Since If-None-Match
- 虚拟主机
  - 服务器建站角度
    - 域名->ip DNS映射
    - 服务器共享
      - HOST字段，带有指定的域名

# http 2.0
- 多路复用
- 二进制分帧(Frame)每个Frame都是一个二进制数据块，大小可控


# 前端直接实现 url 跳转和重定向状态码 302 的区别
- 发送请求，获取响应资源，加载页面
- 返回302，会重定向到新的URL上请求资源

# localStorage、sessionStorage
[Cookie、localStorage和sessionStorage的区别？](https://juejin.cn/post/6970291738652966942)
- localStorage适合存储在多个会话之间需要共享的数据，例如用户喜好设置等；而sessionStorage适合存储一些临时性数据，例如表单数据、用户登陆状态等
https://juejin.cn/post/6844903587764502536

# http协议的构成
- 请求
- 响应


# 淘宝跳转到天猫
- 单点登录SSO
# 微信授权
B端<---->微信(oAuth Accsess token 时间戳)<------>用户

# webscoket
- 轮询：不停连接或者始终打开

# jsonp
- `POST` 请求通常需要在请求体中携带数据，而 `script` 标签没有相应的属性可以设置请求体，因此无法使用 `POST` 请求方式进行数据传输。

# 讲一讲http各个版本
## http1
- http协议是基于TCP/IP
- 因为http0.9设计出来的时候，既没有请求头响应头、返回的内容就是ASCII字符流传输的html
- http1.0为了可以为了支持多种类型的文件的下载，就引入了请求头响应头来进行协商
- 此时就才引入了get、post请求还有状态码，浏览器重要的缓存机制，用户代理字段信息(不同用户，不同体验)，
- http1.1为了可以在同一个TCP上减少没必要的建立和断开连接的开销，增加了持久连接的方法，只要浏览器没有明确断开，就不会关闭。
- 由于各种原因，放弃了管线化。
- 虚拟机的发展使得多个域名共用一个ip的发生，需要根据域名来作出反应
- 还引入了cookie机制，多种请求方式:PUT OPTIONS DELETE CONNECT HEAD

## http2
- http1.1有几个弊端导致了对宽带的利用率却不理想
- **TCP的慢启动**
  - 慢启动是 TCP 为了减少网络拥塞的一种策略，我们是没有办法改变的
- 同时开启了**多条 TCP 连接**，那么这些连接会**竞争**固定的带宽
  - 浏览器为每个域名最多同时维护 6 个 TCP 持久连接
- **队头阻塞的问题**
- 于是http2产生了多路复用，利用二进制分层帧和一个域名只用一个TCP长连接来实现
- 实际上二进制分层帧的工作就是把数据包给予id
- 这样就可以根据id来识别相应的响应数据包，自然可以做到优先级和控制数据包大小的问题
- 但是无法解决队头阻塞的问题，这是TCP协议的问题
## http3
![](https://static001.geekbang.org/resource/image/0b/c6/0bae470bb49747b9a59f9f4bb496a9c6.png?wh=1142*729)
- 因为TCP协议存在的缺陷：队头阻塞和建立和断开连接RTT问题
- 但是无法更新TCP协议，存在僵化问题，简单来说就是中间设备不能理解新的协议
- QUIC协议于是就诞生了
  - 基于UDP协议,也就是在UDP上加了一层
  - 实现了类似TCP的重传、快速握手也集成了SSL(TLS)加密协议
  - 不仅可以多路复用，还可以有多个物理连接，解决了TCP的问题
- 但是由于优化问题，丢包率很大

## 讲一讲常见的响应头、请求头
```js
Host: example.com
Connection: Keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) 
            AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
accept: text/html
accept-encoding: gzip, br, deflate
accept-Charset: utf-8
accept-language: en-US,zh-CN
```
```js
content-encoding: br
content-type: text/html; charset=UTF-8
```

# 队头堵塞
- 持久连接虽然能减少 TCP 的建立和断开次数，但是它需要等待前面的请求返回之后，
- 才能进行下一次请求。如果 TCP 通道中的某个请求因为某些原因没有及时返回，
- 那么就会阻塞后面的所有请求，这就是著名的队头阻塞的问题。

# TCP 的队头阻塞是如何影响到 HTTP/2 性能的呢？
- TCP的队头阻塞，TCP传输过程中也是把一份数据分为多个数据包的。
- 当其中一个数据包没有按照顺序返回，接收端会一直保持连接等待数据包返回，这时候就会阻塞后续请求。
- 如果在数据传输的过程中，有一个数据因为网络故障或者其他原因而丢包了，那么整个 TCP 的连接就会处于暂停状态，需要等待丢失的数据包被重新传输过来。

## 讲一讲CDN缓存机制
- http1.1后就正式引入CDN缓存
- CDN就是内容分发网络，在这上面缓存了一些静态资源：图片、css、js
- 请求发送就会经过CDN服务器，查看CDN服务器的缓存是否过期
- 没过期，则返回响应头也会包含Cache-Control 和 Expires 响应头控制浏览器缓存的问题
## 讲一讲浏览器缓存机制
![浏览器缓存](https://juejin.cn/post/6855469171703185416#heading-18)
![浏览器缓存](https://juejin.cn/post/6947936223126093861)
- 强缓存
  - Expires 绝对时间，本地可改

# cors处理http和https的区别
- Access-Control-Allow-Origin即可允许来自任意域名的请求
- 不论是HTTP还是HTTPS请求，处理方式都是相同的

# head 请求了解过吗？如何用 get 模拟 head 请求？不需要服务器返回数据，怎么实现？
- 是的，我了解 HEAD 请求。HEAD 请求是 HTTP 协议中的一种请求方法，它与 GET 请求类似，但是服务器不会返回响应体（即不会返回数据），只返回响应头，用于获取目标资源的元数据，**例如最后修改时间、文件类型等信息。**

- 如果要使用 GET 请求模拟 HEAD 请求，可以在发送 GET 请求时，指定 `Content-Length` 头为0，并省略请求体。这样就可以模拟一个 HEAD 请求，因为服务器不会返回任何实际数据，而只会返回请求头和状态码。

- 下面是一个使用 XMLHttpRequest 对象发送 GET 请求并模拟 HEAD 请求的 JavaScript 代码示例：
```js
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/mypage');
xhr.setRequestHeader('Content-Length', '0');
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var headers = xhr.getAllResponseHeaders();
        console.log(headers); // 输出响应头信息
    }
};
xhr.send();
```
- 在上面的代码中，我们创建了一个 XMLHttpRequest 对象并指定了请求方法和 URL。然后，我们设置 `Content-Length` 头为 `0`，以模拟 HEAD 请求。当服务器返回响应时，我们使用 `getAllResponseHeaders()` 方法获取响应头信息，并将其输出到控制台。注意，在此示例中，我们没有设置响应数据的处理方式，因为 HEAD 请求不需要返回实际数据。

- 总之，通过设置 `Content-Length` 头为 `0` 可以使用 GET 请求来模拟 HEAD 请求，并获取目标资源的元数据信息。


# 跨域
- 跨站请求的响应一般会被浏览器拦截，成功到达了客服端，但是会被拦截。
- 渲染进程是沙箱模式，防止读取或修改用户的文件、截取网络传输的数据。
- 沙箱当中的渲染进程是没有办法发送网络请求，通过进程间通信`IPC`使得网络进程来发送。
- 数据传递给了浏览器主进程，主进程接收到后，才真正地发出相应的网络请求。
- 服务端处理完数据后，将响应返回，**浏览器主进程**检查到跨域，且没有cors响应头，将响应体全部丢掉，并不会发送给**渲染进程**。
## CORS跨域资源共享
- 简单请求和非简单请求
- 简单请求
  - 请求方法：GET、POST和HEAD
  - 请求头的范围：
    - Accept：可以接收的响应类型
    - Accept-Language：指定客户端接受的自然语言，存在优先级。
    - Content-Language：指定请求或响应实体使用的语言。
    - Content-Type：指定请求或响应实体的MIME类型。JSON、multipart/form-data
  - 在发送时，自动添加`Origin`字段,用来说明请求来自哪个源
  - 在回应时
    - 在白名单内，会自动添加`Access-Control-Allow-Origin`字段，其值设置为`Origin`
    - 不在白名单，不添加` Access-Control-Allow-Origin `字段，并返回错误信息。
  - 浏览器端进行校验
    - `Access-Control-Allow-Origin`字段的值`Origin`与请求头的`Origin`进行比对
  - `Access-Control-Allow-Credentials`,取值为boolean类型，表示是否发送`cookie`
    - 前端也需要设置`withCredentials`属性
    ```js
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    ```
  - `Access-Control-Expose-Headers` 的作用则是允许在响应中公开**额外的、自拓展的**响应头供客户端访问。
  ```js
  Access-Control-Expose-Headers: aaa
  XMLHttpRequest.getResponseHeader('aaa')// 拿到该字段的值
  ```
- 非简单请求：PUT、DELETE
- 预检请求和响应字段
  - 预检请求，请求行和请求体是下面这个格式:
    - 方法、源、主机名、Access-Control-Request-Method、Access-Control-Request-Headers
    ```js
    OPTIONS / HTTP/1.1
    Origin: 当前地址
    Host: xxx.com
    Access-Control-Request-Method: PUT
    Access-Control-Request-Headers: X-Custom-Header
    ```
  - 预检请求的响应体
    - Access-Control-Allow-Origin、Methods、Headers、Credentials和Max-Age
    ```js
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET, POST, PUT
    Access-Control-Allow-Headers: X-Custom-Header
    Access-Control-Allow-Credentials: true
    Access-Control-Max-Age: 1728000 
    Content-Type: text/html; charset=utf-8
    Content-Encoding: gzip
    Content-Length: 0
    ```
## JSONP
- 通过script标签动态填写src，发送GET请求，实现跨域，在回调函数里拿到响应数据

## Nginx
- 正向代理
  - 用于访问限制客服端访问的资源，VPN
- 反向代理
  - 代理服务器将请求转发给后端的多台服务器，根据**负载均衡算法**选择其中一台服务器进行处理，并将该服务器的响应结果返回给客户端
  - 配置文件
```js
server {
    listen 80;
    
    server_name frontend.example.com;    # 前端域名

    location /api/ {
        add_header 'Access-Control-Allow-Origin' 'http://frontend.example.com';   # 允许跨域请求的源
        add_header 'Access-Control-Allow-Credentials' 'true';     # 允许传递 Cookie 等凭证信息
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';   # 允许的 HTTP 方法
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';     # 允许的 HTTP 头
        proxy_pass http://backend_server;    # 转发请求到后端服务器
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;    # 将客户端真实 IP 传递给后端
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;   # 添加头信息，记录请求链路
    }

    location / {
        root /var/www/frontend;
        index index.html;
    }
}
```
  - location /api/ 会匹配子域名下带有/api/的域名，将其发送的请求转发到后端服务器上

# WebSocket
- 服务器端向客服端推送数据，无需等待客服端的请求
- 建立了持久的双向通信，接受和发送数据
- 支持SSL、TLS加密
- 避免了反复创建和销毁连接的开销

# echarts
如折线图、柱状图、散点图、饼图、地图等，可以满足数据可视化的大部分需求。

# UDP
- 面向数据报的通信协议
- 报头包括四个字段，每个字段占用两个字节
  - 源端口、目的端口、长度和校验和
- 无论多长，一次统统发送
- 不负责重发
- 面向无连接的通信协议
- 收包后立即发包，无法进行流量控制避免网络拥塞

# TCP
- 面向字节流的通信协议
- Tcp会将数据放进缓存区，等可以发送的时候发送
- 报文首段有20个字节
  - 印象比较深的就是还有序号、确认序号、数据偏移
- TCP通过确认报文和超时定时器来实现丢包重传的机制
- TCP是面向有连接的的字节流的通信协议，只有确认对方有接受和发送能力才进行发包
- TCP会根据网络拥塞状态进行

# 两者区别
- 流量控制	
  - 滑动窗口	无
- 拥塞控制	
  - 慢开始、拥塞避免、快重传、快恢复	无
- TCP面向连接：3 4
- 提供可靠的服务：流量控制、编号确认、定时器来保证丢包重传和避免网络拥塞

# OSI七层模型
- 应用层
  - 万维网HTTP、域名系统DNS、电子邮件系统SMTP
- 表示层
  - 数据压缩和数据加密
- 会话层
  - 管理会话机制：DNS
- 传输层
  - 为两台主机之间提供通信服务
  - 数据包错误、数据包次序
  - TCP、UDP协议
- 网络层
  - 选择合适的网间路由和节点
  - 把数据报和封装成组合和包
  - 主要使用ip协议
- 数据链路层
  - 每一帧的数据可以分成报头head和数据data
  - head：发送者、接受者、数据类型，比如MAC地址
- 物理层

# TCP/IP
- 传输控制协议、网际协议
- TCP/IP协议指的是有SMTP、TCP、UDP、IP等协议组成的协议簇
- TCP/IP的五层模型
- 网络接口层：帧
- 网络层：数据报
- 传输层：报文段

# DNS
- 域名系统，三级域名www、二级域名xxx、顶级域名.com
- DNS的查询过程
  - 先搜索浏览器的DNS缓存进行表的查找
  - 没有命中，则进行查找操作系统的DNS缓存
  - 还是没有命中，那么就进行在本地的域名服务器进行递归查询
  - 还是没有命中，那么就在DNS的服务器发送查询，进行迭代查询
  - 拿到了则进行操作系统和浏览器缓存DNS的结果
# CDN
- 根据用户位置分配最新的资源
- 部署在各地边缘服务器，通过中心平台的负载均衡，内容分发、调度等模块，降低网络拥塞，提高访问效率、命中率
- 主要功能就是内容存储和分发技术
- 没有应用CDN时，返回的是ip地址
- 应用了CDN时，会进行返回别名记录，指向CDN的全局负载均衡，进行查找相对最近的边缘节点

# 状态码
- 1表示消息发送请求已经被接受了，还需要继续处理
- 2表示成功
  - 200 成功
  - 204 没有返回内容
  - 206 请求部分内容，返回了部分内容
- 3重定向
  - 301 永久重定向
  - 302 临时重定向
  - 303 临时重定向，要求最好使用get请求
  - 304 Not Modified，和重定向没关系
- 4请求错误
  - 400 服务器不理解请求的语法
  - 401 要求授权
  - 403 访问的资源被服务器拒绝了，可以对原因进行描述
  - 404 访问的资源不存在，可以没有原因
  - 405 不能使用该方法进行访问： OPTIONS 方法来查看服务器允许的访问方法
- 5服务器错误状态码
  - 500 内部bug
  - 503 超负载维护 

# TCP流量控制
- 发送缓存区，接收缓存区
- 处理缓冲队列
- 简而言之就是通过通过发送接收区，`ACK`的报文首段控制，可以接收的大小来控制发送端的发送
- 发送窗口
  - 已送已确认
  - 已送未确认
  - 未送可送
  - 未送不可送
- 接收窗口
# TCP拥塞控制
- 刚开始进入传输数据的时候，你是`不知道现在的网路到底是稳定还是拥堵的`，如果做的太激进，发包太急，那么疯狂丢包，造成雪崩式的网络灾难。因此，拥塞控制首先就是要采用一种`保守`的算法来慢慢地适应整个网路，这种算法叫`慢启动`
  - 三次握手，宣告接收窗口的大小
  - 初始化拥塞窗口的大小
  - 起初每增加一个ACK，拥塞窗口增二，到了慢启动阈值
  - TCP传输过程中丢包了，接收端发现数据段不是按序到达的，而是重复的ACK报文，马上进行`快速重传和选择性重传`
  - 快速恢复，拥塞阈值降为一半
- 拥塞窗口是指目前`自己还能传输`的数据量大小







