# 计网
## 跨域
- 受到同源策略的限制
  - 协议、端口号、主机
  - 在沙箱中的渲染进程无法发送请求，只能通过网络进程来进行发送
  - 没有Cors响应头，将响应体全部丢掉
- 跨域资源共享
  - 简单请求
    - 请求方法GET、POST 或者 HEAD
    - 请求头的取值范围
      - Accept：application/json、text/plain、text/html(指定客户端能够接收的响应类型)
      - Accept-Language:zh-CN,zh;q=0.9,en;q=0.8（指定客户端接受的自然语言，存在优先级）
      - Content-Language：en-US （指定请求或响应实体使用的语言）
      - Content-Type：JSON、multipart/form-data（指定请求或响应实体的MIME类型）
    - 请求发送出去，会添加Origin字段，来说明是哪个源。服务器会进行判断，进而判断是否对应添加Access-Control-Allow-Origin字段
    - Cookie的携带
      - 请求头中设置withCredentials: true时，浏览器会将包含凭证的信息发送到服务器
      - 服务器响应头中的Access-Control-Allow-Credentials也为true，则表示服务器`允许`在跨域请求中使用和共享凭证
      - 服务器的Access-Control-Allow-Origin不能为通配符*，而必须是具体的来源域名
  - 非简单请求
    - 先进行发送OPTION请求，同时会加上Origin源地址和Host目标地址
```js
OPTIONS / HTTP/1.1
Origin: 当前地址
Host: xxx.com
Access-Control-Request-Method: PUT(列出会进行请求的方法)
Access-Control-Request-Headers: X-Custom-Header(列出会携带上的请求头)
```
    - 预检请求的响应，会包括：可允许请求的源、方法、请求头字段、预请求的有效期（在此期间内不允许发另一条预检请求）
- Nginx反向代理
  - 正向代理：帮助用户访问自己无法访问的服务器（VPN）
  - 反向代理：帮其他服务器拿到请求，选择一个合适的服务器，将请求转发给它（负载均衡）
  - 客服端发送自己域名下带/api的请求，Nginx服务器作为反向代理，转发请求和后续转发响应
- 脚手架实现代理跨域
  - 本地起一个服务器进行请求的代理



