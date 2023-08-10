# 讲一下ajax、fetch和axios的区别
- `Ajax` 是一种思想，`XMLHttpRequest` 只是实现 `Ajax` 的一种方式。
- 我们通常所说的 `Ajax` 是指使用 `XMLHttpRequest` 实现的 `Ajax`，所以真正应该和 `XMLHttpRequest` 作比较。
- 
**相同点：**
- 他们都是发起请求和获取数据的方式
**不同点：**
- **底层来看：**
  - `ajax`基于的是`XHR`实现的，`fetch`是`ES6`的新特性，基于`Promise`的`fetch()`函数，`axios`基于`XHR`和`node.js`的`http`模块的一个封装库
- **使用上看：**
  - `ajax`不支持`promise`，容易出现**回调地狱**，`fetch`、`axios`支持`promise`，可以使用**链式调用**来避免回调地狱。
- **功能上看：** 
  - `axios`支持**请求和响应拦截器**，`fetch`和`ajax`需要手动添加。
  - `axios(axios.all)`可以用自带`api`来**处理发送多个并发请求后的响应**，`fetch`和`ajax`需要手动添加。
  - `Axios` 支持请求的取消和超时设置，可以在发送请求时设置 `cancelToken` 和 `timeout` 选项，对于需要及时取消或超时的请求非常有用。`Fetch API` 和 `Ajax` 在原生状态下不支持请求的取消和超时设置，需要手动编写实现。
  - `Ajax` 和 `Fetch API` 都遵循浏览器的同源策略，不能直接请求不同域名的资源。但是，它们可以通过设置 `CORS` 或使用 `JSONP` 等技术来实现跨域请求。而 `Axios` 对跨域请求的处理更为简单，可以通过使用**代理**等方式来实现跨域请求。
# 跨域问题
## 跨域问题的本质
- 基于**浏览器同源策略**的一种手段
- 在一些非浏览器环境下，如Node.js环境下，是不存在跨域问题的。
- 同源
  - 协议相同
  - 主机相同
  - 端口相同
## CORS
- 在vue项目里主要就是用CORS和Proxy来解决跨域的
- 当使用CORS解决跨域问题的时候，Axios 可以用于发送跨域请求，但是跨域请求需要服务器允许。
- 在后端配置一下
```js
// 发起跨域请求
axios.get('http://example.com/api/data', {
  headers: {
    'Origin': 'http://localhost:3000' // 设置请求头
  }
}).then(response => {
  console.log(response.data)
}).catch(error => {
  console.log(error)
})

// 设置跨域响应头
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3000' // 设置跨域响应头
  })
  next()
})

```
```js
/* 这个响应头指定了允许跨域请求的来源为 http://localhost:8080 */
Access-Control-Allow-Origin: http://localhost:8080
/* 这个响应头指定了允许跨域请求时发送身份验证凭据（如cookie） */
Access-Control-Allow-Credentials: true
//这个响应头指定了允许使用的 HTTP 方法，包括 GET、POST、PUT 和 DELETE 
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
/* 这个响应头指定了允许在请求中使用的自定义请求头，例如 Authorization */
Access-Control-Allow-Headers: Authorization
```
在 Vue 项目中，可以使用` Axios `库发送` CORS` 请求。

`withCredentials` 是一个布尔值，用于指定跨域请求是否需要将身份验证凭据包括在请求中。如果是，则浏览器会在请求中发送与当前域相关的 `cookie`，`HTTP 认证`及`客户端 SSL 证明`等。这对于需要在不同域之间进行用户身份认证的应用程序非常有用。
`Authorization` 参数通常用于指定访问受保护资源所需的身份验证信息。例如，在使用 `JWT` 鉴权时，可以通过在请求头中添加 `Authorization` 参数来传递访问令牌。服务器可以使用这个访问令牌来验证用户的身份，并授权他们访问受保护的资源。

## Proxy
- webpack可以帮助解决跨域问题
- 开发环境的时候可以用上它webpack-dev-server的proxy选项进行跨域的配置
实质：通过代理服务器，前端发送请求不是直接发送给目标服务器，而是先发送给代理服务器，由代理服务器再将请求发送给目标服务器。因为**代理服务器与目标服务器不跨域**，所以不存在跨域问题。

## jsonp
- 通过在页面上**动态创建一个script标签**，
- 将跨域请求的数据作为参数放在URL中，
- 服务端**返回的数据通过函数来调用和处理**，从而实现跨域数据的获取。

**只支持GET请求**：由于是通过script标签获取数据，因此只能使用GET请求，无法发送POST等其他类型的请求。
**安全性问题**：由于JSONP是通过动态创建script标签获取数据，因此无法对请求进行限制和过滤，存在安全风险。
**依赖于服务端**：JSONP需要服务端返回一段**可执行的JavaScript代码**，因此服务端需要有相应的支持。同时，服务端的实现也需要考虑安全性等问题。

# 讲一下你axios二次封装都干了什么
- 方便处理请求中出现的错误，可以通过函数直接获取到是否成功是否失败
  - 我封装的请求，响应返回的是一个数组，数组第一个元素是error，第二个是result
  - 通过判断error来判断请求和响应有没有出现错误就可以了
  - 并且也增加了一个回调函数可以处理返回值
- 请求拦截的封装
  - 设置config的基本配置：超时处理、参数配置和请求头中token的携带
- 响应拦截的封装
  - 通过response.status返回的状态码来判断错误
    - 授权错误处理
    - 普通错误处理
  - 处理响应的错误就通过第二个回调函数实现来判断
    - 网络错误
- 安装第三方库扩展功能
  - 安装 `axios-retry`，可以让你的 `Axios` **支持自动重试的功能**
  - 安装 axios-jsonp，可以让你的 Axios 支持 jsonp 的功能。
- 定制扩展功能

# axios是如何取消请求
主要是两种用法：

使用 **cancel token** 取消请求

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
     // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

还可以通过传递一个 executor 函数到 `CancelToken` 的构造函数来创建 cancel token：

```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// cancel the request
cancel();
```

# 那你讲一下状态码
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
  
# axios/fetch是怎么取消请求
1.  CancelToken：通过创建一个 `CancelToken` 对象，在需要取消请求的时候调用 `cancel` 方法取消请求。例如：

```js
import axios from 'axios';

// 创建一个 CancelToken 对象
const source = axios.CancelToken.source();

// 发送请求
axios.get('/api/data', {
  cancelToken: source.token
}).then((response) => {
  console.log(response.data);
}).catch((error) => {
  if (axios.isCancel(error)) {
    console.log('Request canceled', error.message);
  } else {
    console.log(error);
  }
});

// 取消请求
source.cancel('Operation canceled by the user.');
```

2.  取消请求的promise：可以使用一个 `Promise` 来封装 `CancelToken` 的 `cancel` 方法，以便在需要取消请求的时候调用。例如：

```js
import axios from 'axios';

// 创建一个取消请求的 Promise 对象
const cancelRequest = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Operation canceled by the user.');
  }, 5000);
});

// 发送请求
axios.get('/api/data', {
  cancelToken: new axios.CancelToken((cancel) => {
    cancelRequest.then((reason) => {
      cancel(reason);
    });
  })
}).then((response) => {
  console.log(response.data);
}).catch((error) => {
  if (axios.isCancel(error)) {
    console.log('Request canceled', error.message);
  } else {
    console.log(error);
  }
});
```

3.  拦截器：可以在请求或响应拦截器中设置一个变量，以便在需要取消请求的时候判断是否已经被取消。例如：

```js
import axios from 'axios';

// 设置一个变量用于判断请求是否已经被取消
let isCanceled = false;

// 请求拦截器
axios.interceptors.request.use((config) => {
  if (isCanceled) {
    return Promise.reject(new Error('Request canceled'));
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }
  return Promise.reject(error);
});

// 发送请求
axios.get('/api/data').then((response) => {
  console.log(response.data);
}).catch((error) => {
  if (axios.isCancel(error)) {
    console.log('Request canceled', error.message);
  } else {
    console.log(error);
  }
});

// 取消请求
setTimeout(() => {
  isCanceled = true;
}, 5000);
```

这三种方法均可用于取消 Axios 的请求。需要注意的是，在使用 `CancelToken` 或者 `Promise` 取消请求时，需要在 `catch` 中判断错误是否为 `Cancel` 类型，以便区分请求被取消和其他错误类型。
# 怎么以同步的方式使用axios

# 讲一下怎么简单写个axios
- 我是直接看了axios的源码，基本了解了一下：
  - 拦截器原理
  - axios创建的过程
  - axios发送请求的过程
  - 适配器
  - 取消请求的原理
- 请求拦截器和响应拦截器都是通过一个`function`实现的
- 在他的原型上有`use`方法用来把所有的拦截器压入栈里，`eject`方法就是取消一个拦截器，`forEach`方法就是方便后续遍历栈里所有的拦截器，对所有需要发送请求的`item`进行一个拦截处理操作。
- axios创建是通过`createInstance`(defaults)函数创建的，但它实际上是整合了`Axios`函数原型上的属性和方法得到的，其中比较重要的就是`request`这个方法，它的核心负责处理拦截器的逻辑，它定义了一个`chain`，调用了拦截器函数里的`forEach`方法，把请求拦截器加入`dispatchRequest`前面，响应拦截器加到后面，又利用`promise`的链式调用，把`config`参数传下去，特别完美,这样就确保了每一个请求和响应，每个拦截器都发挥了作用。
- 如果是浏览器环境：就是用`xhr` 否则就是用`http`，node 环境。
- 发送请求就是那个`dispatchRequest`方法，里面比较核心的是`adapter`（适配器）函数，真正发送请求的底层操作都封装这里，在浏览器环境里就发送`ajax`请求，用到`xhr`，发送`http`请求就用到http请求
- 取消请求有两种方法。但实质上都是通过触发同一个函数来实现的，无论是通过创建取消请求的`Promise`还是使用`CancelToken`来取消，实质就是通过最后调用的`cancel()函数`，它这个函数可以把向外暴露的`promise`状态又`pending`变为`fulfilled`，于是就触发了`xhr`的`abort()`函数






