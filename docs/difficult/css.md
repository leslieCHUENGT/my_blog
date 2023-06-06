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

# 归并排序
## code
```js
// 归并排序
// 思路:中间拆、拆到单、回溯合并
const mergeSort = (arr) => {
    if (arr.length < 2) return arr;
    // 拆分
    let midIndex = Math.floor(arr.length / 2);// arr.length >> 1
    let left = arr.slice(0, midIndex),
        right = arr.slice(midIndex);
    // 返回
    return merge(mergeSort(left), mergeSort(right));
}
// 合并
const merge = (left, right) => {
    let result = [];
    // 情况1
    while (left.length && right.length) {
		// 判断条件是<=如果是<那么不稳定
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    // 情况2
    while (left.length) result.push(left.shift());
    // 情况3
    while (right.length) result.push(right.shift());
    // 返回
    return result;

}

```
## 分析
- **不是原地排序算法**，原地排序算法是仅使用输入数组本身的空间，需要额外的空间来存储临时数组，合并操作时需要开辟新的数组空间
- **是稳定的排序算法**，稳定排序算法是指排序后相等的元素，相对顺序会不会改变
- **时间复杂度：拆logn步，合并n步。故为nlogn**
# 快速排序
## code
```js
// 快排
// 定基准，放两边，直到单，回溯合并
function quickSort(arr) {
    if (arr.length < 2) return arr;
    // 定基准
    let pivot = arr[0];
    let left = [], right = [];
    // 存放
    for (let i = 1; i < arr.length; i++){
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            greater.push(arr[i]);
        }
    }
    // 递归拆、回溯合并
    return quickSort(left).concat(pivot, quickSort(right));

}

// 双指针法
function quickSort(arr, left = 0, right = arr.length - 1) {
    // 如果数组元素小于等于1个，则返回
    if (left >= right) return;
    // 取第一个元素为基准值
    const pivot = arr[left];
    // 定义左右指针
    let i = left;
    let j = right;
    // 利用左右指针交换元素位置
    while (i < j) {
        // 从右边向左扫描，找到第一个小于基准值的元素
        while (arr[j] >= pivot && i < j) {
           j--;
        }
        // 从左边向右扫描，找到第一个大于基准值的元素
        while (arr[i] <= pivot && i < j) {
            i++;
        }
        // 如果左右指针未相遇，交换元素位置
        if (i < j) {
           [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    // 将基准值归位
    [arr[left], arr[i]] = [arr[i], arr[left]];
    // 递归对左右两个子序列进行快排
    quickSort(arr, left, i - 1);
    quickSort(arr, i + 1, right);
    // 返回有序数组
    return arr;

}
```

## 分析
![[Pasted image 20230601164555.png]]
- 双指针法下的快排是原地排序
- 采用两个数组存放：定基准、放两边、拆到单、回溯合并
- 双指针：参数三、判断单、循环交换（注意都有i < j）、将基准值放中间、快排子序列
- 不稳定：相同元素之间的顺序可能会改变，交换
- 每次分区所选取的枢轴元素都恰好为中间位置时，快排的时间复杂度为 O(nlogn)
	- 原因是分区的时候比较log2n，进行分区n次
- 每次分区所选取的枢轴元素恰好为最大或最小值，时间复杂度达到 O(n^2)
	- 原因是分区的时候比较n-1，进行分区 n次


# 归并排序和快速排序的区别
- 归并是由下而上，先处理子问题，再合并
- 快排是由上而下，先分区，再处理子问题
- 归并稳定，但是不是原地排序算法
- 快排不稳定，但是是原地排序算法  









