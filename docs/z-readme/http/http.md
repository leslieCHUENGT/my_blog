# http
- HTTP (HyperText Transfer Protocol)，即`超文本运输协议`，是实现网络通信的一种规范
- HTTP常被用于在`Web浏览器`和`网站服务器`之间传递信息，以明文方式发送内容，不提供任何方式的数据加密
# TCP
- 传输控制协议（TCP，Transmission Control Protocol）是一种面向连接的、可靠的、`基于字节流`的`传输层通信协议`
# 001 HTTP 报文结构是怎样的？
对于 TCP 而言，在传输的时候分为两个部分:`TCP头`和`数据部分`。
而 HTTP 类似，也是`header + body的结构`，具体而言:
# URL
统一资源定位器（URL）是指定在 Internet 上可以找到资源的位置的文本字符串。
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






