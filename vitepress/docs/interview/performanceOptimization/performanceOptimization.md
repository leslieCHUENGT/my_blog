## 图片优化
- 谷歌官方的最佳实践是把图片优化列为极其重要的指标，因为图片是用户可以直观看到的，我们的指标是让图片和文字最优先展示
- 就拿图片来说，实际上是在做权衡，而非优化，我们在质量和性能直接寻求平衡点
- JPG / JPEG 格式
  - 是有损压缩，但是一种高质量的压缩方式，**压缩至原有体积的 50% 以下时，JPG 仍然可以保持住 60% 的品质。**
  - 适用场景，**背景图，（大）轮播图**。
  - 缺陷，但当它处理**矢量图形**和 **Logo** 等线条感较强、颜色对比强烈的图像时，人为压缩导致的图片模糊会相当明显。
  - PEG 图像**不支持透明度处理**，透明图片需要召唤 `PNG `来呈现。
- PNG-8 与 PNG-24
    - 关键字：**无损压缩、质量高、体积大、支持透明**
    - 考虑到 PNG 在处理线条和颜色对比度方面的优势，我们主要用它来呈现**小的 Logo、颜色简单且对比强烈的图片或背景等**。
- SVG
    - 关键字：**文本文件、体积小、不失真、兼容性好**
    - 一方面是它的渲染成本比较高，这点对性能来说是很不利的。另一方面，SVG 存在着其它图片格式所没有的学习成本（它是可编程的）。
- base64
    - 关键字：**文本文件、依赖编码、小图标解决方案**
- 最经典的小图标解决方案——雪碧图（CSS Sprites）
    - 雪碧图、CSS 精灵、CSS Sprites、图像精灵，说的都是这个东西——一种将小图标和背景图像合并到一张图片上，然后利用 CSS 的背景定位来显示其中的每一部分的技术。
- WebP
    - 关键字：**年轻的全能型选手**
    - 像 JPEG 一样对细节丰富的图片信手拈来，像 PNG 一样支持透明，像 GIF 一样可以显示动态图片
    - 兼容性有待提高

## 浏览器缓存机制
- 实际上可以尽量减少网络请求，节省了巨大花销和缩短反应、白屏时间
- 人为约定了强缓存和协商缓存
    - 强缓存
        - **当请求再次发出时**，浏览器会根据其中的 expires 和 cache-control 判断目标资源是否“命中”强缓存，若命中则直接从缓存中获取资源，**不会再与服务端发生通信。**
        - 实际上在大型项目里，我们还会考虑代理服务器上的缓存问题`s-maxage`来设置时间
        - no-store（不缓存）、no-cache（强制请求询问缓存情况）、max-age、public、private
    - 协商缓存
        - last-modified | If-Modified-Since 是一个时间戳，因此对时间差要求较高，还有就是服务器在某些情况下编辑了，又还原了，无法识别，会引发一次响应。
        - Etag | If-None-Match服务端有额外的开销
## CDN的缓存和回源机制
- `缓存`就是说我们把资源 copy 一份到 CDN 服务器上这个过程，`回源`就是说 CDN 发现自己没有这个资源（一般是缓存的数据过期了），**转头向根服务器**（或者它的上层服务器）去要这个资源的过程。
- **CDN 往往被用来存放静态资源**。上文中我们举例所提到的“根服务器”本质上是**业务服务器**，它的核心任务在于**生成动态页面或返回非纯静态页面**
- 所谓“静态资源”，就是像 JS、CSS、图片等**不需要业务服务器进行计算即得的资源**。而“动态资源”，顾名思义是需要**后端实时动态生成的资源**，较为常见的就是 JSP、ASP 或者依赖服务端渲染得到的 HTML 页面。
- 同一个域名下的请求会不分青红皂白地携带 Cookie，而静态资源往往并不需要 Cookie 携带什么认证信息。把静态资源和主页面置于不同的域名下，完美地避免了不必要的 Cookie 的出现！
- 看起来是一个不起眼的小细节，但带来的效用却是惊人的。以电商网站静态资源的流量之庞大，如果没把这个多余的 Cookie 拿下来，不仅用户体验会大打折扣，每年因性能浪费带来的经济开销也将是一个非常恐怖的数字。
## 渲染

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33709fdc300d44f5ac5f89a608f3bad9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1755&h=655&s=258264&e=png&b=fefdfd)
- CSSOM 的解析过程与 DOM 的解析过程是**并行的**
- **CSS 选择符是从右到左进行匹配的**，比如：`#title li{}`会遍历所有`li`然后匹配到`title`进行选择，使用类选择器来进行代替
- HTML、CSS 和 JS，都具有**阻塞渲染**的特性。
    - **即便 DOM 已经解析完毕了，只要 CSSOM 不 OK，那么渲染这个事情就不 OK**（这主要是为了避免没有 CSS 的 HTML 页面丑陋地“裸奔”在用户眼前）。**尽早（将 CSS 放在 head 标签里）和尽快（启用 CDN 实现静态资源加载速度的优化）。**
    - **JS 引擎是独立于渲染引擎存在的**。我们的 JS 代码在文档的何处插入，就在何处执行。当 HTML 解析器遇到一个 script 标签时，它会暂停渲染过程，将控制权交给 JS 引擎。从应用的角度来说，一般当**我们的脚本与 DOM 元素和其它脚本之间的依赖关系不强**时，我们会选用 async；当**脚本依赖于 DOM 元素和其它脚本的执行结果**时，我们会选用 defer。

## 调试和优化指标
- 前言
  - 在实习部门的学习到的内容，一部分比较感兴趣去了解和学习了，自己的知识体系在不断扩大
  - 国内有一些第三方的库`front.js`可以提供接入，自己设计的 `SDK`实现的
  - 主要内容目前是集成了`错误收集`和`用户使用页面情况统计`和`前端性能优化指标`进行监控
  - 内容还是比较全面的，错误捕获的情况都考虑到了
  - 性能优化的关键指标
    - 白屏时间
    - 首屏时间
    - 可以开始交互的时间
    - 总下载时间（window.onload的触发节点）
### 页面错误数据
- `window.onerror`捕获异常可以捕获同步和异步的，但是不能捕获`页面的加载错误`、`Promise`任务的未被处理的异常（如果没有`显式地在 .catch() 方法中处理该异常`，那么这个异常就会成为未被捕获的异常）
```js
// 首先判断出错的目标元素是否是 <script>、<link> 或 <img> 标签的实例，如果不是，则直接返回。
// 然后获取出错资源的 URL，并调用 onResourceError 函数处理该错误。最后一个参数 true 是指事件在捕获阶段进行处理。
window.addEventListener(
  "error",
  function (event) {
    const target: any = event.target || event.srcElement;
    const isElementTarget =
      target instanceof HTMLScriptElement ||
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement;
    if (!isElementTarget) return false;

    const url = target.src || target.href;
    onResourceError?.call(this, url);
  },
  true
);
// window.onunhandledrejection来捕获
const oldOnError = window.onerror;
const oldUnHandleRejection = window.onunhandledrejection;

 window.onerror = function (...args) {
   if (oldOnError) {
     oldOnError(...args);
   }

   const [msg, url, line, column, error] = args;
   onError?.call(this, {
     msg,
     url,
     line,
     column,
     error
   });
 };

 window.onunhandledrejection = function (e: PromiseRejectionEvent) {
   if (oldUnHandleRejection) {
     oldUnHandleRejection.call(window, e);
   }

   onUnHandleRejection && onUnHandleRejection(e);
 };


```

## 性能优化指标
- FP FCP LCP CLS 渲染时间
- 白屏时间（FP）
  - 页面加载开始到`第一个像素`绘制到屏幕上的时间
    - `DNS查询`、`TCP连接`、`首个http请求（TLS的验证时间）`、`返回html文档`、`html文档解析完毕`
  - 计算的数据内容组成，考虑优化的点
```js
// 通过performance.getEntriesByName()进行遍历获取frist-paint属性
// frist-paint属性上的对象即可
const entryHandler = (list) => {        
    for (const entry of list.getEntries()) {
        if (entry.name === 'first-paint') {
            observer.disconnect()
        }

       console.log(entry)
    }
}

const observer = new PerformanceObserver(entryHandler)
// buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
observer.observe({ type: 'paint', buffered: true })
// 该对象上的 startTime即是白屏的时间
{
    duration: 0,
    entryType: "paint",
    name: "first-paint",
    startTime: 359, // fp 时间
}

```
- FCP
  <!-- - 统计比较复杂，情况比较多需要去进行考虑
    - 图片轮播图懒加载的情况
    - 嵌套iframe的情况
    - css重要的背景图片改通过js获取
    - 没有图片则统计js执行时间为首屏（文字出现的时间） -->
  - 从页面加载开始到页面内容的`任一部分`在屏幕上`完成渲染的时间`
  - 1.8s以内完成
```javascript
// 拿到first-contentful-paint属性上对象的startTime的值
const entryHandler = (list) => {        
    for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
            observer.disconnect()
        }
        
        console.log(entry)
    }
}

const observer = new PerformanceObserver(entryHandler)
observer.observe({ type: 'paint', buffered: true })

```
- LCP
  - LCP 是`最大内容渲染完成`时触发
  - 从用户请求页面到该元素被完全渲染出来所需的时间
  - `最大的可见元素`，然后记录下它的加载时间，也就是从用户请求页面到该元素被完全渲染出来所需的时间。最大的可见元素可以是`图片、视频、文本块或其他 HTML 元素`
```javascript
// largest-contentful-paint属性的startTime属性，还可以获取DOM元素
const entryHandler = (list) => {
    if (observer) {
        observer.disconnect()
    }

    for (const entry of list.getEntries()) {
        console.log(entry)
    }
}

const observer = new PerformanceObserver(entryHandler)
observer.observe({ type: 'largest-contentful-paint', buffered: true })

```
  - 考察内容有
    - `img元素`、内嵌在svg元素内的img元素
    - 通过`url获取的背景图`
- CLS
  - 意外错误布局元素的偏移的累计分数
  - 计算：影响分数 * 距离分数
  - 累加、最大值、平均值
```js
// 监听layout-shift属性上的对象
```
- 用户可操作的时间
  - DOM解析完毕的时间
  - `script`标签插入监听`DOMContentLoaded`事件
```javascript
// 使用window.performance.timing来收集
const timingInfo = window.performance.timing;

// DNS解析，DNS查询耗时
timingInfo.domainLookupEnd - timingInfo.domainLookupStart;

// TCP连接耗时
timingInfo.connectEnd - timingInfo.connectStart;

// 获得首字节耗费时间，也叫TTFB
timingInfo.responseStart - timingInfo.navigationStart;

// *: domReady时间(与DomContentLoad事件对应)
timingInfo.domContentLoadedEventStart - timingInfo.navigationStart;

// DOM资源下载
timingInfo.responseEnd - timingInfo.responseStart;

// 准备新页面时间耗时
timingInfo.fetchStart - timingInfo.navigationStart;

// 重定向耗时
timingInfo.redirectEnd - timingInfo.redirectStart;

// Appcache 耗时
timingInfo.domainLookupStart - timingInfo.fetchStart;

// unload 前文档耗时
timingInfo.unloadEventEnd - timingInfo.unloadEventStart;

// request请求耗时
timingInfo.responseEnd - timingInfo.requestStart;

// 请求完毕至DOM加载
timingInfo.domInteractive - timingInfo.responseEnd;

// 解释dom树耗时
timingInfo.domComplete - timingInfo.domInteractive;

// *：从开始至load总耗时
timingInfo.loadEventEnd - timingInfo.navigationStart;

// *: 白屏时间
timingInfo.responseStart - timingInfo.fetchStart;

// *: 首屏时间
timingInfo.domComplete - timingInfo.fetchStart;
```
- 首屏渲染时间
  - 指的是页面资源加载完，渲染所需要的时间
```js
window.addEventListener('load', function() {
  var loadTime = new Date().getTime(); // 页面加载完成的时间点

  // 获取首屏内容的父级元素
  var firstScreenElement = document.querySelector('.first-screen');

  window.addEventListener('scroll', function() {
    var rect = firstScreenElement.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      var firstRenderTime = new Date().getTime(); // 首屏渲染完成的时间点
      var renderTime = firstRenderTime - loadTime; // 首屏渲染时间
      console.log('First Paint Time:', renderTime);
      window.removeEventListener('scroll', arguments.callee); // 移除滚动监听器
    }
  });
});

```
  - 首次将所有的内容呈现在用户的屏幕上所需的时间，LCP 是指最大的块图部分
  - 使用 JavaScript 代码监听 load 事件，该事件在`整个页面（包括图片、样式表等资源）加载完毕后触发`。
  - 考虑到`异步加载（延时加载）的图片`和 `DOM`， load事件是无法准确根据其计算的，取最大值进行上报
    - 有些项目首页存在轮播图和某个大数据 echars的延时加载，设计通用的方法进行处理
    - 整体思路：
      - 使用 MutationObserver监听 DOM对象属性发生变化时会触发事件，扩展性（pc端的物理像素和放缩会影响是否在首屏，增加判断），在的话使用`requestAnimationFrame() `回调函数中调用 `performance.now() `(精确性)获取当前时间，作为它的绘制时间
      - 将最大值作为首屏渲染时间
```javascript
// 监听DOM
// 使用 MutationObserver来进行定制执行的函数，过滤style、link、script标签的影响
// 使用 requestAnimation来进行获取 Dom的时间——原因是当 DOM 变更触发 MutationObserver 事件时，
// 只是代表 DOM 内容可以被读取到，并不代表该 DOM 被绘制到了屏幕上。
// requestAnimationFrame是指在每次进行`重绘之前`调用回调函数，通常是每秒60次（取决于浏览器的刷新频率）
const next = window.requestAnimationFrame ? requestAnimationFrame : setTimeout
const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK']
    
observer = new MutationObserver(mutationList => {
    const entry = {
        children: [],
    }

    for (const mutation of mutationList) {
        if (mutation.addedNodes.length && isInScreen(mutation.target)) {
             // ...
        }
    }

    if (entry.children.length) {
        entries.push(entry)
        next(() => {
            entry.startTime = performance.now()
        })
    }
})

observer.observe(document, {
    childList: true,
    subtree: true,
})
// 判断是否在首屏，使用getBoundingClient()获取属性来判断
// 再和异步加载的图片进行时间上的比较
```
- 考虑的情况解决了，那什么时候调用呢？
  - load事件执行后，Dom一般是不会改变的，LCP是指首次渲染的最大的内容，所以可以根据Lcp执行结束再监听
  - 持续递归，防抖处理MutationObserver的影响

