# 如何理解UDP 和 TCP? 区别? 应用场景?
- UDP
  - 面向数据报的通信协议
  - 一次性发送给定的报文
  - UDP 首部
    - 源端口、目的端口、长度、检验和
  - 无丢包重传的机制、顺序纠错的机制、无法进行流量控制来避免网络拥塞
- TCP
  - 面向字节流的通信协议
  - 

# CDN（内容分发网络）
- 网站预先内容分发到全国各地的（加速）节点，有效提升下载速度、降低响应时间
- 发送域名
- DNS服务器返回的不是ip，而是别名指向CDN的全局负载均衡
- 这个`CDN专用的DNS的服务器`，会根据ip来查看地址等情况
- 返回最佳的ip
- 
- # 如何理解cookie、JWT、session

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
  - Connection: [默认支持长连接] keep-alive
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

