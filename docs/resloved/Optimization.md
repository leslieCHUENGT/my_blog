# 首页资源优化
## 懒加载
### 路由懒加载
- 如果不进行路由懒加载，js文件和css文件的大小将会翻几倍
- 也就是通过 es6 的 import() 来实现动态加载
- 启动的时候会加载初始页面所要的路由组件
- 路由跳转的时候就会请求新的文件
### 组件懒加载
- 比如引入弹框组件，期望是在点击后再触发
- 当然可能会造成请求次数过多，在js文件过大的时候使用
- 还有就是复用性很高的时候，懒加载抽离的话更利用内存的缓存
### 图片懒加载

## tree-shaking
- export default 导出的是一个对象，**无法通过静态分析判断出一个对象的哪些变量未被使用**，所以 tree-shaking 只对使用 export 导出的变量生效

## 骨架屏
- SPA 单页应用，无论 vue 还是 react，最初的 html 都是空白的，需要通过加载 JS 将内容挂载到根节点上，这套机制的副作用：会造成长时间的白屏
- 缩短白屏时间

## 长列表虚拟滚动
- 只渲染可视区的列表项，非可见区不渲染
- vue-virtual-scroller 虚拟滚动列表

## 浏览器渲染进程的线程
- GUI 渲染线程
- js 引擎线程
- 时间触发线程
- 定时器触发线程
- 异步http请求线程

## Web Worker 优化长任务
- 将长时间运行的代码从主线程中抽离出来，在其单独的线程中运行
- 避免了长时间运行的任务阻塞主线程
- Performance -> Main -> 红色的三角，长任务
- 要考虑通信时长

## requestAnimationFrame 制作动画

## js加载
```js
<script type="module">import { a } from './a.js'</script>
```
- es6 module来在标签里引入，会在后台下载

## link 标签的 preload 可以提前加载什么
```html
<link rel="preload" as="script" href="index.js">
<head>
  <link rel="preload" href="script.js" as="script">
</head>
<body>
  <!-- 在需要引用的位置引用该 JavaScript 文件 -->
  <script src="script.js"></script>

  <!-- 调用该 JavaScript 文件中的相应代码 -->
  <script>
    // 在这里执行 script.js 中定义的函数或变量等
    myFunction();
  </script>
</body>

```
- 预加载
- 可以加载js、css
- 需要的时候调用执行
- vue2 项目打包生成的 index.html 文件，会自动给首页所需要的资源，全部添加 preload，实现关键资源的提前加载

## link 标签的 prefetch
- 利用空闲时间加载可能会用到的资源

## 图片展示得更快
- 动态裁剪
  - url地址上动态添加参数，就可以得到你所需要的尺寸大小
- 懒加载
- 传输小图片的时候，base64带来的开销小于http请求的开销


# Threejs
- 解决加载慢的问题
- 当要执行render的时候，也就是渲染任务的时候，使用requestAnimationFrame
- 使用gltfLoader工具进行压缩
- 在浏览器的调试面板里面看加载的时间

# 在浏览器的调试面板里面看加载的时间
- performance 录制
- OVerview 表格可以看到 FPS CPU 的情况
  - FPS 的红色部分
  - CPU 的占用的情况
- 点击火焰图可以看到实时的那一刻的性能情况
- 可以在Event里看到函数的调用的情况





