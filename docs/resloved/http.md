# 跨域
**讲一下跨域是啥**
- 跨域本质就是**浏览器**基于**同源策略**的一种安全的手段，跨域是对浏览器的限制。同源策略呢，是浏览器核心的安全功能。
- 同源策略呢，三个相同，协议、主机、端口相同。当有一个不同了，就会产生跨域问题。

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
- `vue`全栈项目里我是用的最多的是`CORS`跨域
- 只要在`koa`或者`epress`里实现了`cors`，就实现了跨域
- 只要在配置的时候增加一些请求头就可以了
- 通过设置响应头`Access-Control-Allow-xxx`字段来设置访问的**白名单**、**可允许访问的方式**等
- 比较常见的有
  - Access-Control-Allow-Origin `'host'`可以设置白名单
  - Access-Control-Allow-Headers `'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'`
  - Access-Control-Allow-Methods `'PUT, POST, GET, DELETE, OPTIONS'`

- 还有就是通过proxy来实现跨域
- 它的本质就是通过绕开浏览器的同源策略限制来实现的
- 一是可以通过`webpack`的`devServer`来配置`proxy`进行代理
- 二是通过`nginx`实现代理

- 还有是一个`html5`原生的`websocket`也可以进行跨域
- `WebSocket` 是一种在单个` TCP `连接上进行双向通信的协议。与 `HTTP` 不同的是，`WebSocket` 在建立连接后，客户端和服务器之间可以直接发送消息，而不需要像 `HTTP` 一样每次请求都需要建立新的连接。
- 要实现 `WebSocket` 跨域服务，要向 `CORS` 一样设置允许特定域名的跨域请求才行

- 最后我还了解了jsonp来实现跨域
- 返回的数据会被当做`JavaScript`代码执行
- 浏览器对于` <script>` 标签的请求不受同源策略限制的特性。
- JSONP只支持`GET`请求，无法支持`POST`等其他类型的请求。
  - jsonp引发的恶意攻击：
  - XXS与CFRS攻击
  - 数据泄漏

# nginx
**讲一下nginx的反向代理**
- 反向代理服务器充当了一个中间人的角色
- 输入网站访问服务器的时候，会先通过http或者https协议发送到反向代理服务器
- nginx根据配置呢，把请求转发到后端服务器上面
- 响应返回给nginx服务器，nginx服务器转发响应给客服端

**负载均衡**
- 定义了后端服务器集群，其中包含多少台Web服务器
- 一个挂了就可以转发给另一个
- 就可以实现负载均衡

# XXS攻击
**讲一下什么是XXS攻击**
- 叫**跨站脚本**攻击
- 分为三种情况
  - **存储型**、**反射型**和**文档型**
- 存储型比较常见的例子就是评论去输入一段脚本代码，没做转义和过滤等操作，就会存储到数据库里，页面渲染过程中直接执行。
- 反射型比较常见的就是脚本代码作为网络请求的一部分，经过服务器，反射到html文档里，执行
- 文档型是在数据传输过程中劫持数据包，修改里面的html文档

**怎么防范XXS攻击呢？**
- 一个信念，两个利用
- 千万不要相信用户的任何输入，必须经过**转义**和**过滤**
- 利用`CSP`安全机制，核心思想就是服务器决定浏览器加载哪些资源
- 利用`HttpOnly`
  - 很多 XSS 攻击脚本都是用来窃取`Cookie`, 而设置 `Cookie` 的 `HttpOnly` 属性后，`JavaScript` 便无法读取 `Cookie` 的值。这样也能很好的防范 `XSS` 攻击。

# CFRS攻击
**讲一下什么是CSRF攻击**
- `即跨站请求伪造`
- 比较常见的有黑客诱导用户点击链接，那么就打开了黑客的网站，黑客就**利用用户目前的登录状态**发起跨站请求
- 然后就可能做下面几件事
- 1是自动发get请求，这个请求会带上之前你已经登录过的网站的cookie，然后进行操作，获取信息、转账汇款
- 2是自动发post请求，写了一个自动提交post请求的脚本，恶意操作
- 3是诱导点击发送get请求，流程大差不大
- CSRF攻击并不需要将恶意代码注入用户当前页面的html文档中，而是跳转到新的页面，**利用`服务器的验证漏洞`和`用户之前的登录状态`来`模拟用户进行操作`。**

**怎么防范CFRS攻击**
1. 利用`Cookie`的`SameSite`属性
   - strict模式，完全禁止第三方请求携带，完全遵守同源策略
   - lax模式，get提交的时候可以携带
   - none模式，自动携带
2. 验证来源站点，请求头中的两个字段，Origin(域名)和Referer(URI)，但是可以伪造啊
3. CSRF Token令牌，在每个表单提交中都包含一个随机生成的令牌

# Cookie、Session、Token、JWT
- Authentication是验证当前用户的身份
- Authorization用户授予第三方应用访问该用户某些资源的权限
- Credentials实现认证和授权的前提是需要一种媒介（证书） 来标记访问者的身份

**什么是cookie**
- `http`是无状态的协议，对于每次的事务处理是没有记忆能力的，结束会话就不会保存任何会话信息
每个请求都是独立的，**为了进行会话跟踪**，就需要去维护一个状态
这个状态可以通过`cookie`或者`session`实现
- `cookie`存储在客服端上，一般不能超过4kb
- `cookie`比较重要的属性：
  - `domain`、`path`(跨域问题)
  - `httpOnly`可以禁止`js`获取`cookie`防范`XSS`攻击，但是可以在`application`手动修改获取
  - `maxAge`(设置时间)
  - `secure`当 secure 值为 `true` 时，cookie 在 HTTP 中是无效，在 `HTTPS` 中才有效。

**什么是session**
- `session`是另一种记录服务器和客服端**会话状态**的机制
- **会话信息**可以包括用户身份验证状态、购物车内容、搜索历史记录以及其他与用户交互相关的数据。
- `session`可以存储的数据远高于`cookie`
- `session`是基于`cookie`实现的，`session`存储在服务器端，`session ID`会被存储到客服端的`cookie`中
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8db049ca37343cda1fd37fde7c47e33~tplv-k3u1fbpfcp-watermark.image?)

**他们两个的区别**
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

**讲一讲session和Token的区别**
- session是记录服务器端和客服端会话状态的机制，Token是指验证身份的令牌
- session和token并不矛盾，各司其职
- 他们可以一起进行用户信息的验证，登录操作时，服务器会返回带有session ID和token的cookie

**什么是jwt**

# HTTPS

**HTTPS为什么会出现**
- http是**明文传输**，容易被截取、修改和伪造请求发送
- http不会验证通信方的身份，**没有用户验证**
- http传输过程中**不会验证报文的完整性**，保证不了**数据一致性**

**什么是HTTPS**
- HTTPS 是 HTTP 协议的一种扩展，它本身并不保证传输的证安全性
- **传输层安全性**`(TLS)`或**安全套接字层**`(SSL)`对通信协议进行加密。也就是 `HTTP` +` SSL(TLS)` = `HTTPS`。
- 原理是`HTTP`和`TCP`之间建立了一个**安全层**，安全层的核心就是加解密
- HTTPS默认使用**服务器**的`443`端口


**对称加密和非对称加密**
- 对称加密：加密和解密时使用的密钥都是同样的密钥，比如位运算。速度快
- 非对称加密也被称为公钥加密，比如特定的曲线方程和基点生成公钥和私钥。速度慢

**讲讲HTTPS加解密的流程吧**

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a912ac78bcbc4270888d418e6eaa520d~tplv-k3u1fbpfcp-watermark.image?)

1. 用户发起`HTTPS`请求,和服务器的`443`端口连接
2. `HTTPS`收到请求，返回响应，响应包括`CA`证书、证书里面有公钥`Public`，私钥`Private`保留在了服务器，不公开
3. 客服端收到证书，校验合法性，主要包括：是否有限期内、证书的域名和请求的域名是否匹配、颁发机构，合法则继续下面的流程
4. 客服端会用证书里的公钥加密一个`key`，发送给服务端
5. 服务端收到这个`key`，会用私钥解密，然后再对`key`进行对称加密，响应返回给客户端
6. 客户端使用对称解密这个`key`
7. 这个时候客户端和服务器端都有了这个`key`的真实值，后续请求就用对称加解密来相互验证就可以了
总结：对称加解密和非对称加解密混合，结合证书验证。






