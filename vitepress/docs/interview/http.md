# http
- HTTP (HyperText Transfer Protocol)，即`超文本运输协议`，是实现网络通信的一种`约定和规范`
- 按照范围的大小 `协议` > `传输 `> `超文本`。下面就分别对这三个名次做一个解释。
- `超文本`（Hypertext）指的是一种能够在文本中添加超链接的技术，使得读者可以通过点击链接跳转到相关的其他文本资源或网页。
- 存储的超文本会被解析成为二进制数据包，由传输载体（例如同轴电缆，电话线，光缆）负责把二进制数据包由计算机终端传输到另一个终端的过程称为`传输`(transfer)。
- HTTP常被用于在`Web浏览器`和`网站服务器`之间传递信息，以明文方式发送内容，不提供任何方式的数据加密
# 网络模型网络中的协议层次
## 应用层
- 应用层是网络应用程序和网络协议存放的分层
- `HTTP`，电子邮件传送协议 `SMTP`、端系统文件上传协议 `FTP`、还有为我们进行域名解析的 `DNS` 协议。
- 我们把位于应用层的信息分组称为 `报文`(message)。
## 运输层
- 这一层主要有两种传输协议` TCP`和` UDP`
- `TCP`（Transmission Control Protocol）是一种`可靠的、面向连接的协议`。当使用TCP协议进行通信时，发送方会先与接收方`建立连接`，然后`逐步传输数据`，在每次`传输完成后`都会`等待`接收方的`确认`信息。如果数据`丢失或出现错误`，TCP协议会`自动重传数据`，保证数据的可靠性。因此，TCP协议适合于需要保证数据传输可靠性和完整性的应用，如文件传输、电子邮件等。
- UDP（User Datagram Protocol）是一种`无连接的、不可靠的协议`。使用UDP协议进行数据传输时，发送方会`直接将数据包发送`给接收方，而`不会`像TCP那样`建立连接和确认机制`。因此，UDP协议传输数据的效率比TCP高，但是由于没有确认机制，数据丢失或出错的情况下不会自动重传，可能会导致数据的丢失或损坏。UDP协议适合于实时性要求较高，但对数据完整性要求不高的应用，如在线游戏、视频聊天等。
- 总的来说，TCP协议适合于需要保证数据传输可靠性和完整性的应用，而UDP协议则适合于实时性要求较高，但对数据完整性要求不高的应用。使用两种协议需要根据具体应用场景进行选择。
- 运输层的分组称为 `报文段`(segment)
## 网络层
- 网络层一个非常重要的协议是 `IP` 协议
- 因特网的网络层负责将称为 `数据报`(datagram) 的网络分层从一台主机移动到另一台主机。
## 链路层
- 将分组从一个`节点`（主机或路由器）运输到另一个`节点`，网络层必须依靠链路层提供服务。链路层的例子包括`以太网`、`WiFi` 和`电缆`接入的 `DOCSIS` 协议，因为数据从源目的地传送通常需要经过几条链路，一个数据包可能被沿途不同的`链路层协议处理`，我们把链路层的分组称为 `帧`(frame)
## 物理层
- 物理层的作用是将帧中的一个个 `比特` 从一个节点运输到另一个节点，`物理层的协议仍然使用链路层协议`，这些协议与`实际的物理传输介质`有关，例如，以太网有很多物理层协议：关于双绞铜线、关于同轴电缆、关于光纤等等。
# 浏览器
我们在地址栏输入`URL`（即网址），浏览器会向`DNS`（域名服务器，后面会说）`提供网址`，由它来`完成 URL 到 IP 地址的映射`。然后将请求你的请求提交给具体的服务器，在由`服务器返回`我们要的结果（以HTML编码格式返回给浏览器），浏览器`执行HTML编码`，将结果显示在浏览器的正文。这就是一个浏览器发起请求和接受响应的过程。
# Web服务器
浏览器是 HTTP 请求的`发起方`，那么 `Web 服务器`就是 HTTP 请求的`应答方`，Web 服务器可以向浏览器等 Web 客户端`提供文档`，也可以`放置网站文件`，让全世界浏览；可以放置数据文件，让全世界下载。目前最主流的三个Web服务器是Apache、 Nginx 、IIS。
# CDN
- `CDN`的全称是Content Delivery Network，即`内容分发网络`，它`应用了 HTTP 协议里的缓存和代理技术`，`代替``源站响应``客户端的请求`。
- CDN的关键技术主要有`内容存储`和`分发技术`。
# WAF
- WAF 是一种 `Web 应用程序防护系统`（Web Application Firewall，简称 WAF）
- 它是一种通过执行一系列针对HTTP / HTTPS的安全策略来专门为Web应用提供保护的一款产品，它是应用层面的防火墙，专门检测 HTTP 流量，是防护 Web 应用的安全技术。
WAF 通常位于 Web 服务器之前，可以`阻止如 SQL 注入、跨站脚本`等攻击，目前应用较多的一个开源项目是 ModSecurity，它能够完全集成进 Apache 或 Nginx。
# 与 HTTP 有关的协议
## TCP/IP
TCP/IP 协议你一定听过，TCP/IP 我们一般称之为`协议簇`，什么意思呢？就是 TCP/IP 协议簇中不仅仅只有 TCP 协议和 IP 协议，它是`一系列网络通信协议的统称`。而其中最核心的两个协议就是 TCP / IP 协议，其他的还有 UDP、ICMP、ARP 等等，共同构成了一个复杂但有层次的协议栈。
TCP 协议的全称是 Transmission Control Protocol 的缩写，意思是`传输控制协议`，`HTTP 使用 TCP` 作为`通信协议`，这是因为 TCP 是一种可靠的协议，而可靠能保证数据不丢失。
IP 协议的全称是 Internet Protocol 的缩写，它主要解决的是`通信双方寻址`的问题。IP 协议使用 IP 地址 来标识互联网上的每一台计算机，可以把 IP 地址想象成为你手机的电话号码，你要与他人通话必须先要知道他人的手机号码，计算机网络中信息交换必须先要知道对方的 IP 地址。（关于 TCP 和 IP 更多的讨论我们会在后面详解）
## DNS
你有没有想过为什么你可以通过键入 www.google.com 就能够获取你想要的网站？我们上面说到，计算机网络中的每个端系统都有一个 IP 地址存在，而把 `IP 地址`转换为便于人类记忆的协议就是 DNS 协议。
DNS 的全称是`域名系统`（Domain Name System，缩写：DNS），它作为`将域名和 IP 地址`相互`映射`的一个分布式数据库，能够使人更方便地访问互联网。
## URI URL
- URI 不仅包括 URL，还包括 URN（统一资源名称）
# HTTP 请求响应过程
http://www.someSchool.edu/someDepartment/home.index，当我们输入网址并点击回车时，浏览器内部会进行如下操作：
- `DNS`服务器会首先进行`域名的映射`，找到访问www.someSchool.edu所在的地址，然后`HTTP 客户端进程`在 `80 端口``发起`一个到服务器 www.someSchool.edu 的 `TCP 连接`（`80 端口是 HTTP 的默认端口`）。在客户和服务器进程中都会有一个`套接字`与其相连。
- HTTP `客户端`通过它的`套接字`向`服务器`发送一个 `HTTP 请求报文`。该报文中包含了路径 someDepartment/home.index 的资源，我们后面会详细讨论 HTTP 请求报文。
- `服务器`通过它的`套接字``接受该报文`，进行`请求的解析工作`，并从其`存储器`(RAM 或磁盘)中`检索`出对象 www.someSchool.edu/someDepartment/home.index，然后把检索出来的对象进行`封装`，封装到 HTTP `响应报文`中，并通过套接字`向客户进行发送`。
- 服务器`随即通知 `TCP 断开 TCP 连接，实际上是需要等到客户`接受完响应报文后`才会`断开` TCP 连接。
- HTTP 客户端接受完响应报文后，`TCP 连接会关闭`。HTTP `客户端`从`响应中提取出报文中是一个 HTML 响应文件`，并`检查`该 HTML 文件，然后`循环检查`报文中其他内部对象。
- 检查完成后，HTTP 客户端会把对应的资源通过显示器`呈现`给用户。
简化：
- 浏览器会`解析 URL`，提取出`协议`、`主机名`、`端口号`以及`路径`等信息。
- 浏览器会`查询本地 DNS 缓存`以`确定主机名对应的 IP 地址`。如果缓存中没有该信息，则浏览器会向 DNS 服务器-发送请求，并等待响应。
- 浏览器与服务器建立` TCP 连接`。
- 浏览器向服务器`发送 HTTP 请求`，其中包含了上一步解析得到的路径和其他附加信息，例如请求方法、请求头等。
- 服务器收到请求后会处理请求并`返回响应`，响应中包含了`状态码`、`响应头`和`响应体`等信息。
- 浏览器接收到响应后，会`解析响应头和响应体`，然后将页面`呈现`给用户。
# HTTP请求的特点
HTTP请求的特点包括以下几个方面：

- 支持客户-服务器模式
- `简单快速`：客户向服务器请求服务时，只需传送请求方法和路径。请求方法常用的有 GET、HEAD、POST。每种方法规定了客户与服务器联系的类型不同。由于 HTTP 协议简单，使得 HTTP 服务器的`程序规模小`，因而通信速度很快。
- `灵活`：HTTP 允许`传输任意类型的数据对象`。正在传输的`类型由 Content-Type 加以标记`。
- `无连接`：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的`应答后，即断开连接`。采用这种方式可以节省传输时间。
- `无状态`：HTTP 协议是无状态协议。无状态是指协议对于`事务处理没有记忆能力`。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。
- `明文传输`：HTTP协议默认采用明文传输，数据可能被第三方窃取或篡改，安全性较低。
# 详解 HTTP 报文
HTTP 协议主要由三大部分组成：

-   `起始行（start line）`：描述请求或响应的基本信息；
-   `头部字段（header）`：使用 key-value 形式更详细地说明报文；
-   `消息正文（entity）`：实际传输的数据，它不一定是纯文本，可以是图片、视频等二进制数据。

`起始行和头部字段`并成为 `请求头 或者 响应头`，统称为 `Header`；`消息正文`也叫做`实体`，称为 `body`。HTTP 协议规定每次发送的报文`必须要有 Header`，但是`可以没有 body`，也就是说头信息是必须的，实体信息可以没有。而且在 `header `和` body 之间`必须要有`一个空行（CRLF）`，如果用一幅图来表示一下的话

    HTTP 请求报文示例：

```js
POST /api/login HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 31
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0

{"username":"user123","password":"pass456"}
```

在这个例子中，请求行仍然为 `POST /api/login HTTP/1.1`，表示`请求方法`为 POST，请求的资源(`URL`)为 `/api/login`，`HTTP 版本号`为 1.1。

紧接着请求行的是 Header 部分，请求头中包含了`Host`、`User-Agent`、`Accept`、`Accept-Language`和`Connection`等字段，表示请求主机、用户代理、可接受的媒体类型、首选语言和持久连接等信息。

在空行后面是 Body 部分，即 `{"username":"user123","password":"pass456"}`。在这个示例中，Body 是一个 JSON 格式的字符串，用于向服务器发送用户名和密码等数据。需要注意的是，`Body 的长度`必须与 `Content-Length 字段指定的值相同`，否则服务器可能会拒绝处理该请求。

2. HTTP响应报文
假设上述客户端请求成功，服务器返回了网站首页的HTML文档，那么该响应报文可能长这样：
```js
HTTP/1.1 200 OK
Server: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.4.12
Content-Type: text/html; charset=UTF-8
Content-Length: 5696
Date: Wed, 28 Apr 2023 14:06:28 GMT

<!DOCTYPE html>
<html>
<head>
  <title>Example Website</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <!-- 页面内容省略 -->
</body>
</html>
```
其中，HTTP响应状态码为`200 OK`，表示服务器成功处理了请求，并返回了一个`HTML`文档。响应头中包含了`Server`、`Content-Type`、`Content-Length`和`Date`等字段，表示响应的服务器、实体主体的MIME类型、长度和时间等信息。响应报文的实体主体是一个`HTML`文档，由<!DOCTYPE html>到</html>之间的部分组成。
# HTTP 的请求方法？
`http/1.1`规定了以下请求方法(注意，都是大写):

-   GET: 通常用来获取资源
-   HEAD: 获取资源的元信息，类似于 GET 方法，但是只返回响应头部信息，不返回实体内容。
-   POST: 提交数据，即上传数据
-   PUT: 修改数据，上传资源，比如上传图片或者视频。
-   DELETE: 删除资源(几乎用不到)
-   CONNECT: 建立连接隧道，用于代理服务器
-   OPTIONS: 列出可对资源实行的请求方法，用来跨域请求
-   TRACE: 追踪请求-响应的传输路径，用于调试，服务器会将请求原封不动地返回给客户端。
# GET 和 POST 有什么区别
- 从**缓存**的角度，GET 请求会被浏览器`主动缓存`下来，留下历史记录，而 POST 默认不会。
- 从**编码**的角度，GET 只能进行 `URL 编码`，只能`接收 ASCII 字符`，而 POST 没有限制。
  - 当使用 GET 方法提交数据时，数据必须经过 URL 编码后才能被发送到服务器。而由于 URL 只允许使用 ASCII 字符，因此 GET 方法只能接收 ASCII 字符。
  - URL 编码是一种将非 ASCII 字符转换成 ASCII 字符的方法。例如，中文字符 "你好" 在进行 URL 编码后会变成 "%E4%BD%A0%E5%A5%BD"。在进行 GET 请求时，如果需要传输包含非 ASCII 字符的数据，会先对数据进行 URL 编码，然后将编码后的结果附加在 URL 的查询字符串中。因此，GET 方法只能用于传输较小量的数据，而且不适合传输敏感信息。
  - 而 POST 方法则没有这种限制，它可以传输任何类型、任何大小的数据，并且不需要进行 URL 编码。POST 方法将数据包含在请求体中，采用二进制方式传输，因此不会存在 URL 长度限制。同时，由于 POST 方法可以使用 HTTP 加密协议（如 HTTPS），所以它更适合传输敏感信息。
- 从**参数**的角度，GET 一般放在 `URL` 中，因此不安全，POST 放在`请求体`中，更适合传输敏感信息。
- 从**幂等性**的角度，`GET`是**幂等**的，而`POST`不是。(`幂等`表示执行相同的操作，结果也是相同的)
  - 使用 GET 方法请求某个资源时，无论请求多少次，服务器都会返回相同的资源内容。
  - POST 方法则不同，每次提交请求时，数据都会被更新或者修改。
- 从**TCP**的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(**火狐**浏览器除外，它的 POST 请求只发一个 TCP 包)
- get 请求的 `URL` 有长度限制，而 post 请求会把`参数和值`放在`消息体`中，对数据长度没有要求。
# 解析域名
`http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument  
`
- `http://`告诉浏览器使用何种协议。
- 主机:www.example.com 既是一个`域名`，也代表管理该域名的机构。它指示了需要向网络上的哪一台`主机发起请求`
- 端口:两个主机之间要发起 `TCP `连接需要两个条件，`主机` + `端口`。它表示用于访问 Web 服务器上资源的入口。如果访问的该 Web 服务器使用HTTP协议的标准端口（`HTTP为80，HTTPS为443`）授予对其资源的访问权限，则`通常省略`此部分。否则端口就是 URI 必须的部分。
- 路径
- 查询参数
- 锚点:`#SomewhereInTheDocument` 是资源本身的`某一部分的一个锚点`。锚点代表资源内的一种“`书签`”，它给予浏览器显示位于该“加书签”点的内容的指示。 例如，在HTML文档上，浏览器将滚动到`定义锚点`的那个点上；在视频或音频文档上，浏览器将转到锚点代表的那个时间。值得注意的是 # 号后面的部分，也称为`片段标识符`，永远不会与请求一起发送到服务器。
# HTTP 常见的请求头
HTTP 标头会分为四种，分别是 `通用标头`、`实体标头`、`请求标头`、`响应标头`。分别介绍一下
## 通用标头
通用标头主要有三个，分别是 `Date`、`Cache-Control` 和 `Connection`
- Date 是一个通用标头，它可以出现在`请求标头`和`响应标头`中，它的基本表示如下
```js
Date: Wed, 21 Oct 2015 07:28:00 GMT 
```
- Cache-Control 是一个通用标头，他可以出现在`请求标头`和`响应标头`中，Cache-Control 的种类比较多，虽然说这是一个通用标头，但是又一些特性是请求标头具有的，有一些是响应标头才有的。主要大类有 `可缓存性`、`阈值性`、 `重新验证并重新加载` 和`其他特性`
- Connection
  - Connection 决定当前事务（一次三次握手和四次挥手）完成后，是否会关闭网络连接。Connection 有两种，一种是`持久性连接`，即一次事务完成后不关闭网络连接
  ```js
  Connection: keep-alive
  ```
  - 另一种是`非持久性连接`，即一次事务完成后关闭网络连接
  ```js
  Connection: close
  ```
## 实体标头
实体标头是描述消息正文内容的 HTTP 标头。实体标头用于 HTTP 请求和响应中。头部`Content-Length`、 `Content-Language`、 `Content-Encoding` 是实体头。
-   Content-Length 实体报头指示实体主体的大小，以字节为单位，发送到接收方。
-   Content-Language 实体报头描述了客户端或者服务端能够接受的语言。
-   Content-Encoding 这又是一个比较麻烦的属性，这个实体报头用来压缩媒体类型。Content-Encoding 指示对实体应用了何种编码。
    常见的内容编码有这几种： **gzip、compress、deflate、identity** ，这个属性可以应用在请求报文和响应报文中
```js
Accept-Encoding: gzip, deflate //请求头
Content-Encoding: gzip  //响应头
```
## 请求标头
- `Host` 请求头指明了服务器的域名（对于虚拟主机来说），以及（可选的）服务器监听的 `TCP 端口号`。  
- `Referer`告诉服务器该网页是从哪个页面链接过来的，服务器因此可以获得一些信息用于处理。
- `If-Modified-Since` 用于确认代理或客户端拥有的本地资源的`有效性`。获取资源的更新日期时间，可通过确认首部字段 Last-Modified 来确定。在 `Last-Modified` 之后更新了服务器资源，那么服务器会响应 `200`，如果在` Last-Modified` 之后没有更新过资源，则返回 `304`。
## 响应标头
- `Access-Control-Allow-Origin` 指定一个来源，它告诉浏览器允许该来源进行资源访问。
- `Keep-Alive` 表示的是 Connection 非持续连接的存活时间，可以进行指定。
- `Server`服务器标头包含有关原始服务器用来处理请求的软件的信息。
```js
Server: Apache/2.4.1 (Unix)
```
- `Set-Cookie` 用于服务器向客户端发送 sessionID。
- `X-Frame-Options` 属于 HTTP 响应首部，用于控制网站内容在其他 Web 网站的 Frame 标签内的显示问题。其主要目的是为了防止点击劫持（`clickjacking`）攻击。

# TCP 三次握手
- TCP的三次握手指的是建立TCP连接时，客服端和服务端需要进行的一系列通信过程
- TCP握手就好比两个人相隔几十米不能直接确认，通过招手来确定对方是否认识自己
- `SYN` 是`同步序列编号`
- `ACK` 是`确认序列编号`
- 第一次握手：客户端给服务端发一个 `SYN 报文`，并`指明`客户端的`初始化序列号` ISN(c)，此时客户端处于 `SYN_SENT` 状态
- 第二次握手：服务器收到客户端的 SYN 报文之后，会以自己的 `SYN + ACK 报文`作为`应答`，为了确认客户端的 SYN，将客户端的 `ISN+1`作为`ACK的值`，此时服务器处于 `SYN_RCVD` 的状态
- 第三次握手：客户端收到` SYN + ACK 报文`之后，会发送一个 `ACK 报文`，值为服务器的`ISN+1`。此时客户端处于 `established` 状态。服务器`收到 ACK 报文`之后，也处于 `established` 状态，此时，双方已建立起了连接
`syn_sent`和`syn_rcvd`，这两个状态叫着「`半打开」状态`，就是向对方招手了，但是还没来得及看到对方的点头微笑。syn_sent是主动打开方的「半打开」状态，syn_rcvd是被动打开方的「半打开」状态。客户端是主动打开方，服务器是被动打开方。
## 为什么不是两次握手?
如果是两次握手，发送端可以确定自己发送的信息能对方能收到，也能确定对方发的包自己能收到，但接收端只能`确定对方发的包自己能收到,``无法确定自己发的包对方能收到。`

## 四次挥手
tcp终止一个连接，需要经过四次挥手

过程如下：

- 第一次挥手：客户端发送一个 `FIN` 报文，报文中会`指定一个序列号`。此时客户端处于 `FIN_WAIT1 `状态，停止发送数据，等待服务端的确认
- 第二次挥手：服务端收到 `FIN` 之后，会发送 `ACK` 报文，且把客户端的`序列号值 +1` 作为 ACK 报文的序列号值，表明已经收到客户端的报文了，此时服务端处于 `CLOSE_WAIT状态`
- 第三次挥手：如果`服务端也想断开连接`了，和客户端的第一次挥手一样，发给 `FIN` 报文，且指定一个序列号。此时服务端处于 `LAST_ACK` 的状态
- 第四次挥手：客户端收到 `FIN` 之后，一样发送一个 `ACK` 报文作为应答，且把服务端的`序列号值 +1` 作为自己 ACK 报文的序列号值，此时客户端处于 `TIME_WAIT`状态。服务端收到 ACK 报文之后，就处于关闭连接了，处于 `CLOSED `状态,需要过一阵子客户端以`确保服务端收到`自己的 ACK 报文之后才会进入` CLOSED 状态`，

- `TIME_WAIT`状态是TCP四次挥手协议中的最后一个状态，它通常会持续`2倍的最大报文段生存时间（MSL）`，这个时间通常为2分钟左右。在TIME_WAIT状态下，`TCP连接已经关闭了`，但是任何在网络中`滞留的数据报文`都可能在此期间`到达该连接`。因此，TIME_WAIT状态的主要作用是`确保`网络上所有与该连接相关的数据都已被`处理完毕。`
# UDP 和 TCP 的区别
TCP 和 UDP 都位于计算机网络模型中的`运输层`，它们`负责传输应用层产生的数据`。下面我们就来聊一聊 TCP 和 UDP 分别的特征和他们的区别
## UDP 是什么
UDP 的全称是 `User Datagram Protocol`，`用户数据报协议`。它不需要所谓的`握手`操作，从而加快了通信速度，允许网络上的其他主机在接收方同意通信之前进行数据传输。

> 数据报是与分组交换网络关联的传输单元。

UDP 的特点主要有
-   UDP 能够支持容忍数据包丢失的带宽密集型应用程序
-   UDP 具有低延迟的特点
-   UDP 能够发送大量的数据包
-   UDP 能够允许 DNS 查找，`DNS` 是建立在 `UDP` 之上的应用层协议。
  - 这段话表达了UDP协议作为传输层协议的一个特点，即它能够允许DNS进行查找。DNS（Domain Name System）是一种应用层协议，它通常运行在UDP协议之上。
  - DNS协议主要用于将域名转换为IP地址，以便计算机可以通过IP地址来寻找和访问网络资源。当需要进行DNS查询时，客户端会向DNS服务器发送一个DNS请求报文，并使用UDP协议进行传输。因为`DNS请求通常比较短`，并且需要`快速响应`，所以UDP协议非常适合用于DNS查询。
  - 与TCP不同，UDP是无连接、不可靠的协议，它没有提供可靠的数据传输保证，也没有拥塞控制和流量控制等机制。但是，正是由于`UDP协议具有简单、轻量级、高效的特点`，使得它非常适合于一些对数据传输效率要求较高的应用场景，例如`DNS查询、音视频传输`等。
  - 因此，这段话表达的意思是，UDP协议作为传输层协议，能够允许DNS查询这个应用层协议在其上运行，而DNS查询通常采用UDP协议进行传输，因为UDP协议比TCP更加适合用于快速响应、数据传输效率要求较高的场景。
  
### TCP 是什么

TCP 的全称是`Transmission Control Protocol` ，传输控制协议。它能够帮助你确定计算机连接到 Internet 以及它们之间的数据传输。通过三次握手来建立 TCP 连接，三次握手就是用来启动和确认 TCP 连接的过程。一旦连接建立后，就可以发送数据了，当数据传输完成后，会通过关闭虚拟电路来断开连接。

TCP 的主要特点有

-   TCP 能够`确保连接的建立`和`数据包的发送`
-   TCP 支持`错误重传机制`
-   TCP 支持`拥塞控制`，能够在网络拥堵的情况下`延迟发送`
-   TCP 能够提供`错误校验`和`甄别有害的数据包`。

 
TCP                                  | UDP                      |
| ------------------------------------ | ------------------------ |
| TCP 是面向连接的协议                         | UDP 是无连接的协议              |
| TCP 在发送数据前先需要建立连接，然后再发送数据            | UDP 无需建立连接就可以直接发送大量数据    |
| TCP 会按照特定顺序重新排列数据包                   | UDP 数据包没有固定顺序，所有数据包都相互独立 |
| TCP 传输的速度比较慢                         | UDP 的传输会更快               |
| TCP 的头部字节有 20 字节                     | UDP 的头部字节只需要 8 个字节       |
| TCP 是重量级的，在发送任何用户数据之前，TCP需要三次握手建立连接。 | UDP 是轻量级的。没有跟踪连接，消息排序等。  |
| TCP 会进行错误校验，并能够进行错误恢复                | UDP 也会错误检查，但会丢弃错误的数据包。   |
| TCP 有发送确认                            | UDP 没有发送确认               |
| TCP 会使用握手协议，例如 SYN，SYN-ACK，ACK       | 无握手协议                    |
| TCP 是可靠的，因为它可以确保将数据传送到路由器。           | 在 UDP 中不能保证将数据传送到目标。     |

# 简述 HTTP1.0/1.1/2.0 的区别
- HTTP 中的队头阻塞（Head-of-Line Blocking），也称为管道化阻塞，是指当一个 HTTP 请求在传输时被阻塞，`接下来的请求也必须等待该请求完成后才能继续进行处理`。这样会导致一些请求需要长时间等待，从而降低了网络吞吐量和响应速度。
HTTP 协议中的队头阻塞通常发生在使用`持久连接`（Keep-Alive）并开启了`流水线`（pipelining）模式的情况下。在这种模式下，客户端可以在一个 TCP 连接上同时发送多个请求，服务器则按照请求的顺序依次返回响应。如果某个请求由于网络延迟或其他原因被阻塞，则该请求之后的所有请求都需要等待该请求的响应返回后才能开始传输数据。这就造成了队头阻塞的问题。
为了解决队头堵塞的问题，HTTP/2 引入了`二进制分帧`和`多路复用`的机制，使得`多个请求可以并行处理`，从而提高了网络效率和响应速度。
- HTTP/2 是一个二进制协议，其中最小的通信单位是`帧`（Frame），每个帧都包含了与`请求或响应相关的数据`。HTTP/2 帧具有以下特点：
帧是`二进制格式`：HTTP/2 中所有通信都是以二进制格式进行的，因此帧也是由一系列二进制位组成的。
每个帧包含头部和负载：HTTP/2 帧由头部和负载两部分组成。头部提供了帧的元数据信息，如标识符、类型、长度等，而负载则包含了实际的数据内容。
帧`可以被拆分成更小的帧`：HTTP/2 允许将大的帧拆分成多个更小的帧来传输，这样可以更好地利用网络资源，避免出现队头堵塞（Head of Line Blocking）的问题。
帧`可以被关联到一个流上`：HTTP/2 允许将帧关联到一个特定的流上，从而使得多个请求可以共享同一个 TCP 连接。
帧`支持优先级`：HTTP/2 支持对帧设置不同的优先级，保证重要的帧能够优先传输，提高网络效率和用户体验。

总之，`HTTP/2 帧是 HTTP/2 通信中最小的单位信息`，它们使用`二进制格式`进行传输，并在`头部包含了一些元数据`，`负载则包含了实际的请求或响应数据`。帧的优点是能够更好地利用网络资源，避免出现队头堵塞问题
- 服务器推送是 HTTP/2 中的一个新功能，它允许服务器`主动向客户端推送相关资源`，以提高页面加载速度和性能。这种方式可以避免客户端请求资源的延迟，并且减少了往返的网络通信时间，从而加速了页面的加载速度。


  [面试官：说说 HTTP1.0/1.1/2.0 的区别? | web前端面试 - 面试官系列 (vue3js.cn)](https://vue3js.cn/interview/http/1.0_1.1_2.0.html#%E4%B8%80%E3%80%81http1-0)

# HTTP 和 HTTPS 的区别?
## http
- HTTP 是一种 `超文本传输协议`(Hypertext Transfer Protocol)，HTTP 是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的`约定和规范`
- 传输的数据并`不是`计算机底层中的`二进制包`，而是完整的、有意义的数据，如`HTML 文件`, `图片文件`, `查询结果`等`超文本`，能够被上层应用识别,在实际应用中，HTTP常被用于在`Web浏览器`和`网站服务器`之间传递信息，以`明文方式发送内容`，不提供任何方式的数据加密
特点如下：

-   `支持客户/服务器模式`
-   `简单快速`：客户向服务器请求服务时，只需传送请求方法和路径。由于`HTTP协议简单`，使得HTTP服务器的`程序规模小`，因而`通信速度很快`
-   `灵活`：HTTP允许传输`任意类型的数据对象`。正在传输的类型由Content-Type加以标记
-   `无连接`：无连接的含义是`限制每次连接只处理一个请求`。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间
-   `无状态`：HTTP协议`无法根据之前的状态进行本次的请求处理`
## https 
- 让HTTP运行安全的SSL/TLS协议上，即` HTTPS = HTTP + SSL/TLS`，通过 SSL证书来验证服务器的身份，并为浏览器和服务器之间的通信进行加密
- `SSL 协议``位于``TCP/IP 协议与各种应用层协议`之间，浏览器和服务器在使用 SSL 建立连接时需要选择一组恰当的加密算法来实现安全通信，为数据通讯提供安全支持
  -   首先客户端通过`URL访问服务器`建立`SSL连接`
  -   `服务端`收到客户端请求后，会将网站支持的`证书信息`（`证书中包含公钥`）`传送`一份给客户端
  -   客户端的服务器开始`协商SSL连接的安全等级`，也就是信息加密的等级
  -   客户端的浏览器根据双方同意的安全等级，`建立会话密钥`,然后利用网站的`公钥将会话密钥加密`，并传送给网站
  -   服务器利用自己的`私钥解密出会话密钥`
  -   服务器利用`会话密钥加密与客户端之间的通信`
## 区别
-   HTTPS是HTTP协议的安全版本，HTTP协议的数据传输是明文的，是不安全的，HTTPS使用了SSL/TLS协议进行了加密处理，相对更安全
-   HTTP 和 HTTPS 使用连接方式不同，默认端口也不一样，HTTP是80，HTTPS是443
-   HTTPS 由于需要设计加密以及多次握手，性能方面不如 HTTP
-   HTTPS需要SSL，SSL 证书需要钱，功能越强大的证书费用越高


# GET与POST的区别
## 是什么
- 两者是HTTP协议中发送请求的方法
- 本质上都是TCP链接，并无差别
## 区别
- 在浏览器回退时
- URL地址可以被Bookmark
- 浏览器主动cache
- 只能进行url编码
- 请求参数会被完整保留在浏览器历史记录里
- URL中传送的参数是有长度限制
- 对参数的数据类型，只接受ASCII字符
- 更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息
- GET参数通过URL传递，POST放在Request body中
- 数据包
  - 对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）
  - 对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok
  - 并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次
## HTTP 常见的状态码
## HTTP 的特点？HTTP 有哪些缺点？


## 当浏览器接收到 HTML 文档时，它会按照以下步骤解析和渲染页面：
- 解析 HTML：浏览器将 HTML 文档解析成 DOM 树，也就是 Document Object Model。DOM 树由节点组成，每个节点代表文档中的一个元素、属性或文本。
- 解析 CSS：浏览器会将 CSS 文件解析成 CSSOM 树，也就是 CSS Object Model。CSSOM 树由样式规则组成，每个规则包含了一个选择器和一组样式声明。
- 合并 DOM 和 CSSOM：浏览器会将 DOM 树和 CSSOM 树合并成一个渲染树。渲染树只包括需要显示的元素，例如有 display: none 的元素不会被包含在渲染树中。
- 布局计算：浏览器会根据渲染树的内容计算每个元素在屏幕上的位置及大小。这个过程被称为布局计算（layout 或 reflow）。
- 绘制页面：浏览器会遍历渲染树，并将每个元素绘制到屏幕上。这个过程被称为绘制（painting 或 rasterizing）。
- 优化性能：浏览器会在以上步骤中进行一些优化，例如缓存页面、异步加载资源等。
以上就是浏览器解析渲染 HTML 的大致过程。需要注意的是，这个过程并不是一次性完成的，而是在用户请求页面后动态进行的。如果页面中包含大量的 JavaScript 和 CSS，则会对性能产生负面影响，因此需要合理优化和管理页面资源。


# 缓存问题
Web缓存种类： 数据库缓存，CDN缓存，代理服务器缓存，浏览器缓存。
- **浏览器缓存**其实就是指在本地使用的计算机中**开辟一个内存区**，同时也**开辟一个硬盘区**作为数据传输的**缓冲区**，然后用这个**缓冲区**来暂时保存用户以前访问过的信息。
- 浏览器缓存过程： **强缓存**，**协商缓存**。
- 浏览器**缓存位置**一般分为四类： Service Worker-->Memory Cache-->Disk Cache-->Push Cache。

## 强缓存
强缓存是当我们访问`URL`的时候，不会向服务器发送请求，**直接从缓存中读取资源**，但是会返回`200`的状态码。

- 我们第一次进入页面，请求服务器，然后服务器进行应答，浏览器会根据`response Header`**响应头**来判断是否对资源进行缓存，如果**响应头**中`expires`、`pragma`或者`cache-control`字段，代表这是**强缓存**，浏览器就会把资源缓存在`memory cache` 或 `disk cache`中。
- 第二次请求时，浏览器判断请求参数，如果**符合强缓存条件**就直接返回状态码`200`，从本地缓存中拿数据。否则把响应参数存在`request` `header`请求头中，看是否**符合协商缓存**，符合则返回状态码`304`，不符合则服务器会返回全新资源。



### expires
是HTTP1.0控制网页缓存的字段，**值为一个时间戳**，准确来讲是格林尼治时间，服务器返回该请求结果缓存的到期时间，意思是，**再次发送请求时，如果未超过过期时间，直接使用该缓存，如果过期了则重新请求。**
有个缺点，就是它判断是否过期是用本地时间来判断的，**本地时间是可以自己修改的。**

### Cache-Control

是HTTP1.1中控制网页缓存的字段，当Cache-Control都存在时，**Cache-Control优先级更高**，主要取值为：

public：资源客户端和服务器都可以缓存。
privite：资源只有客户端可以缓存。
no-cache：客户端缓存资源，但是是否缓存需要经过协商缓存来验证。
no-store：不使用缓存。
**max-age：缓存保质期。**
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d436363afff54d03ba32b1c67b313d8f~tplv-k3u1fbpfcp-zoom-1.image)

Cache-Control使用了max-age相对时间，解决了expires的问题。

### pragma

这个是HTTP1.0中禁用网页缓存的字段，其取值为`no-cache`，和`Cache-Control`的`no-cache`效果一样。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6743661072c4aedbe553d80dc8bf0bb~tplv-k3u1fbpfcp-zoom-1.image)

## 2. 缓存位置

查找浏览器缓存时会按顺序查找: Service Worker-->Memory Cache-->Disk Cache-->Push Cache。

1. Service Worker
是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 `Service Worker`的话，传输协议必须为 `HTTPS`。因为 `Service Worker `中涉及到请求拦截，所以必须使用` HTTPS `协议来保障安全。`Service` Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们**自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。**

2. Memory Cache
**内存中的缓存**，主要包含的是当前中页面中已经抓取到的资源，例如页面上**已经下载的样式、脚本、图片等**。**读取内存中的数据肯定比磁盘快，**内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。一旦我们**关闭 Tab 页面，内存中的缓存也就被释放了。**

3. Disk Cache
**存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。**

在所有浏览器缓存中，`Disk Cache` **覆盖面基本是最大的**。它会根据 `HTTP Herder` 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。绝大部分的缓存都来自 `Disk Cache`。

memory cache 要比 disk cache 快的多。举个例子：从远程 web 服务器直接提取访问文件可能需要500毫秒(半秒)，那么磁盘访问可能需要10-20毫秒，而内存访问只需要100纳秒，更高级的还有 L1缓存访问(最快和最小的 CPU 缓存)只需要0.5纳秒。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/816b32098de04046a5004720f3fcca3a~tplv-k3u1fbpfcp-zoom-1.image)

很神奇的，我们又看到了一个`prefetch cache`，这个又是什么呢?
**prefetch cache(预取缓存)**
**link标签上带了prefetch，再次加载会出现。**
prefetch是预加载的一种方式，被标记为prefetch的资源，将会被浏览器在空闲时间加载。


4. Push Cache

Push Cache（推送缓存）是` HTTP/2` 中的内容，**当以上三种缓存都没有命中时**，它才会被使用。它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在**Chrome浏览器中只有5分钟左右**，同时它也并非严格执行HTTP头中的缓存指令。

5. CPU、内存、硬盘
这里提到了硬盘，内存，可能有些小伙伴对硬盘，内存没什么直观的概念。
CPU、内存、硬盘都是计算机的主要组成部分。
`CPU`：中央处理单元(CntralPocessingUit)的缩写，也叫**处理器**，是计算机的运算核心和控制核心。电脑靠CPU来运算、控制。让电脑的各个部件顺利工作，起到协调和控制作用。
`硬盘`：**存储资料和软件等数据的设备，有容量大，断电数据不丢失的特点。**
`内存`：**负责硬盘等硬件上的数据与CPU之间数据交换处理。****特点是体积小，速度快，有电可存，无电清空，即电脑在开机状态时内存中可存储数据，关机后将自动清空其中的所有数据。**

## 协商缓存
协商缓存就是强缓存失效后，浏览器携带缓存标识向服务器发送请求，由服务器根据缓存标识来决定是否使用缓存的过程。

主要有以下两种情况：

协商缓存生效，返回304

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00e7ca5901cf4cf9bd404c118e583c62~tplv-k3u1fbpfcp-zoom-1.image)

协商缓存失效，返回200和请求结果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54dd73422bb54be7af3b8fe3c9afbe89~tplv-k3u1fbpfcp-zoom-1.image)

**如何设置协商缓存？**

假设客户端浏览器首次请求某个图片资源时，服务器返回以下响应头信息：

```js
HTTP/1.1 200 OK
Content-Type: image/jpeg
Last-Modified: Wed, 01 May 2021 08:00:00 GMT
Content-Length: 10240

<binary data>
```

此时，客户端将该图片资源缓存起来，并记录下Last-Modified的值为"Wed, 01 May 2021 08:00:00 GMT"。

当客户端再次请求该图片资源时，会在请求头中添加If-Modified-Since头部信息：

```js
GET /image.jpg HTTP/1.1
Host: www.example.com
If-Modified-Since: Wed, 01 May 2021 08:00:00 GMT
```

如果**该图片资源在服务器上的修改时间**,也就是说服务器会更新这个修改时间，晚于上次请求的时间，则服务器会返回新的图片资源，并在响应头中加上新的Last-Modified头部信息；否则，服务器会返回不带实体内容的304 Not Modified响应码，客户端可以直接使用本地缓存的资源。这样，客户端就可以根据是否有修改判断是否需要获取新的图片资源，从而避免了不必要的数据传输和服务器负载压力。

假设客户端第一次请求一个名为example.jpg的图片资源，服务器返回以下HTTP响应头：
```js
HTTP/1.1 200 OK
Content-Type: image/jpeg
Etag: "abc123"
```
客户端收到响应后保存了该图片和Etag值，并在之后的某个时间再次请求该图片资源，发送的请求头如下：

```js
GET /example.jpg HTTP/1.1
Host: example.com
If-None-Match: "abc123"
```
服务器收到请求后发现**If-None-Match的值与服务器上的Etag值相同**，因此返回状态码`304 Not Modified`，客户端可以继续使用本地缓存的资源。
如果在下一次请求中，客户端发送的If-None-Match值与服务器上的Etag值不匹配，那么服务器将会返回新的资源内容以及新的Etag值。

4. 缓存方案
目前的项目大多使用这种缓存方案的：
HTML: 协商缓存；
css、js、图片：强缓存，文件名带上hash。
5. 强缓存与协商缓存的区别
1. 强缓存不发请求到服务器，所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器，所以资源是否更新，服务器肯定知道。
2. 大部分web服务器都默认开启协商缓存。
6. 刷新对于强缓存和协商缓存的影响
1. 当ctrl+f5强制刷新网页时，直接从服务器加载，跳过强缓存和协商缓存。
2. 当f5刷新网页时，跳过强缓存，但是会检查协商缓存。
3. 浏览器地址栏中写入URL，回车 浏览器发现缓存中有这个文件了，不用继续请求了，直接去缓存拿。（最快）

# ngnix
## 反向代理
- 反向代理可以使用多种协议进行通信，但最常用的协议是**HTTP和HTTPS**
- 当用户在浏览器中**输入**网址访问服务器时，请求会通过**HTTP或HTTPS**协议**发送到反向代理服务器**。**反向代理服务器**会根据配置**将请求转发到后端的web服务器上**，并将**响应**返回给用户的浏览器。在这个过程中，反向代理服务器充当了一种"**中间人**"的角色，帮助客户端与后端服务器进行通信。
- 需要注意的是，在使用HTTPS协议时，反向代理服务器还需要处理证书的验证和加密解密等操作，以确保数据传输的安全性。
## nginx的实现原理










