# 浅谈前端路由原理hash和history

# 异步更新
- “查看数据”这个动作是同步操作
- 设置this.msg = 'some thing'的时候，Vue并没有马上去更新DOM数据，
- 而是将这个操作放进一个队列中；如果我们重复执行的话，队列还会进行去重操作；
- 等待同一事件循环中的所有数据变化完成之后，会将队列中的事件拿出来处理。

# 讲一讲Vue中的nextTick
- 如果要简单理解，那这个函数就相当于setTimeout，放到异步后去处理
- 为了可以在数据更新后来操作DOM，使用nextTick，这样回调函数是在~来操作DOM
- 它的降级机制是为了兼容不支持 Promise 和 MutationObserver 的浏览器。
# nextTick源码分析
- 先是把回调函数都放入callbacks数组里
- 通过isNative函数来判断支不支持Promise、MutationObserver(H5新特性，监听DOM的函数，利用它来包裹成微任务)、setImmediate
- 都不支持就用setTimeout来包裹
- 最后深拷贝callbacks数组，执行回调函数。

# hash和history
- vue-router默认值就是hash模式
- hash 模式是利用了 window 可以监听 onhashchange 事件来实现
- hash模式是根据hash值发生改变，根据不同的值来指定DOM位置不同的数据,本质就是锚点定位
- 特点
  - url上会带有#号
  - 不会发送请求
  - 因为window.location.hash，可以在浏览器中增加记录
  - **不利于SEO，因为不知道是不是新页面**
- history模式
  - 通过history的api-`pushState`或者replaceState来先把URL添加到历史记录里
  - 通过`popState`来监听URL变化，进而改变网页数据

# keep-Alive
- 在自己的vue项目里用了
- 在路由里配置`meta`属性来标记，通过v-if判断是否需要进行keep-alive
- keep-alive是vue中的内置组件，将状态保留在内存中，防止重复渲染DOM
- 
- 当在创建keep-alive组件的时候
- 会有三个钩子函数
  - created
    - 此时已经模板编译了属性值也计算完成了，创建了虚拟dom，定义对象和数组缓存虚拟DOM和对应的key的集合
  - mounted
    - 此时对include参数等进行监听，实时删除和更新
  - destroyed
    - 来遍历删除缓存里的虚拟DOM
- 还有就是render函数
  - 流程
    - 进行条件匹配，决定是否缓存。
    - 把上面定义的两个对象解构出来
    - 根据key值来决定是调整key值还是直接缓存
    - 需要调整key值的原因是需要去进行垃圾回收，太久没使用的也要回收



# 使用Proxy对象可以对整个对象进行拦截，而使用class类只能对特定的属性或方法进行拦截。可以用代码举例吗？

# vue3关于响应式源码里使用proxy时要用Reflect？
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ae065034b742b4af50c74487a6dbcf~tplv-k3u1fbpfcp-watermark.image?)


# 懒加载的原理
- 路由懒加载
  - 是使用了webpack提供的import()函数，import()函数会返回Promise()对象，通过Promise来实现
- 图片懒加载
  - 通过`Intersection Observer API`来观察图片是否进入视口，进行加载

# vue里哪些是响应式的

# ref和reactive的区别
- ref和reactive都可以用来设置响应式的数据
- 在用法上
  - ref包裹的数据必须通过.value才能获取到，reactive就不需要这样
  - ref可以包裹原始数据类型的值来实现响应式，对象也行
  - reactive只能包裹对象，不能处理原始数据类型的值
    - 原因是因为proxy只能代理对象，不能代理原始数据类型的值
- 往深层次来讲，vue3源码里关于这两个函数的过程，一定情况下，ref会调用reactive函数来实现响应式数据，所以对于简单数据类型就用ref，复杂数据类型就用reative，这样性能更好。

# 那你讲一讲vue源码里关于ref和reactive的部分，怎么实现响应式的
- 那我先讲一讲reactive的流程
- 当通过reactive函数包裹js对象时，通过new proxy创建代理
- 进行读操作的时候会拦截get操作，执行track函数，把相关的effect函数注册到全局的依赖地图里，实质是WeekMap里对于的key-value来存放的。
- 当修改这个值的时候，就会拦截set操作，执行trigger函数，执行对应的effect函数，这样就完成了响应式：数值改变了，相关的函数自动执行，改变所有有关的数据
- ref呢，当包裹简单数据类型的值来说，通过普通的对象的get value set vlaue来执行track和trigger函数，当是复杂数据类型时，调用reactive就行了。

# Object.defineProperty 
- 这个api是es5用来管理对象属性的行为的
- 当我去研究vue2响应式Object.defineProperty的时候
- 它是通过只能遍历对象的属性来进行劫持，返回的是对象本身
- 而proxy是直接在对象外层加拦截，劫持整个对象，返回的是proxy代理的对象
- Object.defineProperty来实现响应式，因为是get和set方法进行监听，对对象的删除或者添加属性是劫持不到的
- 而proxy的handler方法是拦截读写等操作
- 对于数组而言还需要重写数组的方法，里面需要添加执行相关的effect函数

# v-if、v-for为什么不建议同时使用
- v-if指令用来判断要不要渲染
- v-for指令用来迭代对象或者数组，渲染一个列表
  - key值最好设置为独一无二的，便于differ时耗费更少的性能
- 我翻了一下vue源码里关于指令的优先级的代码
- 里面if语句判断条件v-for的优先级排在前面
```js
  else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  }
```
- 这意味着每次渲染都要先v-for循环判断v-if再渲染
- 所以千万不能用在同一个元素上
- 可以在外层加template进行v-if判断，因为template不会生成DOM节点，优化性能
- 或者直接先用  过滤掉不需要的数据，比如数组的filter方法来过滤

# v-model与：的区别

# 讲一讲你对vue生命周期的理解
- 在vue项目里我用得最多的就是生命周期钩子函数onMounted
- 它是在组件**挂载之后立即被调用和执行**
- 一般用来发**送异步的请求和监听滚动的事件**
- 其次就是开发国际化组件的时候，用了onBeforeMount
- 因为在这个时候vue已经编译了模板，生成了**虚拟dom**，**初始化dom**，但是在节点里的变量数据**还没有挂载到dom上**，此时国际化就起到了作用。
- beforeCreate->created
  - 创建vue实例，进行数据处理

# 怎么理解porxy对象要用reflect来进行获取操作
- 因为reflect函数的第三个参数是receiver
- 他简单来说就是指向的this值
- 可以确保this的正确指向
- 当对一个函数进行调用，这个函数里面如果引用了响应式对象的属性，用普通的方法获取，比如.或者[]，那么就只会执行一次。

# 讲一讲vue里router是怎么实现的
- vue-router是全局组件，需要再main.js里调用app.use方法引入，它会自动install，注册到全局
- 会注册两个组件router-link和router-view
- 正常配置路由的时候，选择创建路由方式hash或者history还有路由的信息，调用createRouter来创建实例对象
- 创建实例时
- 一是会需要监听hashchange事件，及时更改响应式数据url
- 二是通过inject和provide来使全局都可以获取到配置的路由对象的信息
- 然后router-link就负责是url改变
- router-view就用vue里的component组件来进行在对应的url下渲染对应组件

# 讲一讲vue里vuex是怎么实现的
- 一是vuex的Store类里只有commit方法可以去提交然后执行事件，这样就满足了设计
- 在commit方法里会对mutations进行执行
- 二是通过provide和inject来使得全局都可以访问store的信息
- 底层就是订阅发布者模式对数据和视图层进行解构

# 讲一讲你了解的koa源码是怎么回事
- 在原生Node环境下，不使用框架，对其response和request进行操作，调用listen监听某个端口
- 相比之下，Koa多了两个实例上的方法use、listen方法和use回调中的ctx、next两个参数
- 这个基本就是Koa的全部了
- listen实际上是http的语法糖，实际上用的就是http.createServer()
- use就是koa的核心——中间件，基于Promise，解决异步的回调地狱问题，原理就是利用了compose函数，使用next方法，从上一个中间件跳到下一个中间件
  - compose函数就是把当中间件函数进行串联起来，通过递归调用来实现，正因为next方法才可以串起来。
- use回调的参数ctx把req和res合而为一，可以更方便的直接调用query方法或者path方法解析参数，更加简洁
  
# vue组件之间的8种传信方式
1. 父子组件通信：props、$emit、
2. 兄弟组件通信：vuex、eventbus
3. 跨层级组件：vuex、pinia、provide + inject、eventbus

```js
// this.$emit('on-confirm','Confirmed!'); // 发送自定义事件，触发点击事件

<Child @on-confirm="handleConfirm"></Child>

methods: {
  handleConfirm(data) {
    console.log(data); // 输出 'Confirmed!'
  }
}

```
# eventBus了解吗？
- 事件总和模式
- 底层实际上是订阅发布者模式
- on方法绑定、emit方法触发事件并传参


# 讲一讲虚拟dom和diff算法
- 首先vue编译模板，生成了ast抽象语法树
- h函数就可以根据ast抽象语法树上的节点信息进行递归遍历
- 生成的是虚拟dom
  - h函数的工作流程就是把类型给确定好
  - 给节点添加上各种标签
  - 添加上标签有利于后续的diff算法可以高效进行
- diff算法
- react 对比递增子序列的过程
  - 1234
  - 2143
  - 寻找新的vonde节点的最大标记值
  - 那么就可以知道哪些节点是增加和插入
  - 对于删除来说，只能通过对比新旧节点来进行标记
  - 最后就通过render函数来进行渲染
  - **无法处理跨层级移动操作：如果在两个不同的层级中进行节点的移动操作**
  - 时间复杂度高O(n3)
- vue双端比较
  - dfs遍历，同级比较新旧节点
  - 新旧节点的头尾指针进行比较
  - 先是会在旧节点上两个指针进行向中间收拢，找出新节点的第一个节点，找不到就直接添加到容器上，后续就是插入操作，找到了就进行复制、添加
  - 后续也是这样遍历，旧节点的头尾指针向中间靠拢，而新节点的头指针向后进行
  - 当旧节点上的头尾指针变成一后一前了，就退出循环
  - **需要适当的 key 值区分子节点**
  - **过多的 watch 和 computed 会影响性能**
  -  O(nlogn) 
  

# 讲一讲路由懒加载和图片懒加载
- 路由懒加载实际上是通过import()函数动态导入路由组件
- 例如webpack这个工程化打包工具，初始的时候不会打包到js文件里
- 而是在运行时动态加载
- import()函数调用的时候会返回Promise对象

- 图片懒加载的实现就是通过
- 根据图片什么时候出现在视窗
- 进行加载
- 加载完成之后就下载到了本地，进而移除类名就可以了


# vuex 
- vuex是单例模式
- mutations可以追溯数据改变的源头

# 设计vue组件
- 组件必须通过 `defineComponent` 函数进行定义，更好地利用 TypeScript 的类型推断功能
- `Teleport` 是 Vue 3 中新增的一个组件，用于将子组件指定到父组件之外的 DOM 元素中渲染
- 

# 前端性能优化
## 页面渲染
### 减少页面的repaint和reflow
#### 讲一讲重排
- 实际上就是影响了渲染主进程对布局树的生成
- 并且为了优化重排对**布局树**频繁的生成
  - 所以对于属性改动的重排会进行异步处理
  - 也就是改动了，马上去获取布局信息，打印台的结果可能不是最新的
- 重排会使主线程传递的绘制指令不同
- 重排必定重绘
#### 讲一讲重绘
- 实际上也就是主线程**分层树**发生改变，导致给合成线程的绘制指令不同
#### 优化的方案
- 当设置一些复杂的动画效果的时候，position设置为fixed或者absolute，脱离文档流，不会影响其他布局
- 不使用table布局，里面的一个元素改变了位置、大小和颜色，就会导致整个布局重绘重排
- 当需要DOM元素移动的时候，尽量用translate()函数，不要用top来设置，因为浏览器的GPU进程会进行加速，也不会影响其他布局
- GPU加速，可以让transform、opacity和fiters动画不会引起重绘重排，而background-color属性会引发重绘
### 使用懒加载和预加载
- 图片懒加载
  - 判断图片出现在浏览器可视区域的方法
- import 引入时按需加载、路由的懒加载
- 预加载，通过预测用户必须的行为进行预加载
  - 在link标签的rel属性设置为preload

## webpack对前端性能优化可以在哪些方面做文章
- 主要就是分为几个方面：代码压缩和混淆、代码分割、tree shaking
- 可以从比较常用的loader和Plugin来讲一讲
- 就拿url-loader来说
  - 为了减小文件的大小，可以把部分小并且不怎么变的的图片转换成`base64`格式的
  - 为了**减少并发请求数**，还可以放在`js`文件里
  - 为了可以更好的让浏览器使用缓存，在输出的文件夹名里可以生成**新的哈希值**，这点在每个出口文件里都用到了
- 可以拿MiniCssExtractPlugin来说
  - 为了实现更好的利用缓存，不同类型的文件最好分离打包、做好**代码分割**
  - import() 函数来实现动态**代码分割** 将一个大型的 JavaScript 应用程序拆分为多个小块，然后按需加载这些小块。
  - 为了减少文件的大小，自然离不开**压缩**可以用CssMinimizerPlugin
- 可以拿TerserWebpackPlugin来说
  - 也就是tree shaking
  - 注释、console、没有使用的变量或者函数可以自动剔除
  - 或者用 UglifyJsPlugin 进行代码的混淆
- 为了可以更好的实现代码分割，可以再增加一个入口**vendor**
  - 比如一些**库、框架**抽离出来，独立打包，避免了重复打包，减少文件的体积

## 总体优化
### SSR服务器端渲染开发
- 比如nuxtjs，它的渲染过程是在服务端完成，最终的html文件通过http协议发送给客服端
- 最大的好处就是首屏加载速度提高、和对SEO友好
### 为什么nuxtjs对SEO更友好？
- 因为vuejs是动态框架，大部分内容都是js中生成添加到DOM里的
- nuxtjs返回给客服端的代码是静态的内容，构建的时候已经生成了完整的html内容
### gzip压缩
- 对文件压缩可以压缩到原来的40%，有效减少了下载的速度，提高首屏的加载速度
### 缓存问题
- 浏览器缓存、CDN缓存、本地缓存
- Nginx和Apache可以配置HTTP头以控制静态资源的缓存策略，在CDN中使用缓存技术来加速内容交付。
### 进行DNS预解析
- 当我们进行解析html文档的时候，遇到script标签暂停html解析，因为要访问其他域名就需要进行DNS解析，找到它的ip
- async属性，则浏览器会异步下载JavaScript文件并继续解析HTML，而如果使用了defer属性，则会在HTML解析完成后再下载并执行JavaScript文件。

# vue响应式
- 函数和数据的关联
  - 被监控的函数：render、computed回调、watchEffect 和 watch ，和哪些数据进行关联
  - 数据和数据直接是无法进行关联的
```js
// 前提props是响应式的

// 
const doubleCount = ref(props.count * 2);
//
const doubleCount = ref(0);
watchEffect(()=>{
  doubleCount.value = props.count * 2
})
// 可
function useDouble(props) => {
  const doubleCount = ref(props.count * 2);
  watchEffect(()=>{
    doubleCount.value = props.count * 2 //
  })
  retuen doubleCount
}
const doubleCount = useDouble(props)
// 不可,传入的props.count是原始数据的值，不是响应式对象。
function useDouble(count) => {
  const doubleCount = ref(0);
  watchEffect(()=>{
    doubleCount.value = count * 2 
  })
  retuen doubleCount
}
const doubleCount = useDouble(props.count)
// 
const doubleCount = computed(()=> props.count * 2)


```

# vue虚拟DOM和diff算法

## 组件的本质
- 模板引擎的年代，组件的产出是 html 字符串
- Vue 或 React，组件的产出是 Virtual DOM，带来了**分层设计**，可以渲染到其他的平台，不止是浏览器
- render函数的作用简单来说就是根据VNode创建真实DOM并添加到容器中
```js
// 最简单的render
function render(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // 创建元素调用了document.createElemrent()
  const el = document.createElement(vnode.tag)
  // 将元素添加到容器
  container.appendChild(el)
}
```
- 组件分为两种
  - 有状态组件,一种可以维护自己的状态，响应用户交互或其他操作并渲染结果的组件。有状态组件通过**继承Vue实例来获得响应式数据和生命周期方法等特性。**
```js
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="increment">{{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      message: 'Hello, world!'
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

```
  - 函数式组件是一种无状态、无实例、只传递props并返回渲染结果的组件。这意味着它们没有响应式数据，并且不会触发生命周期钩子。通常用于只展示静态内容的场景。
```js
<template functional>
  <div>{{ props.message }}</div>
</template>

```
## 设计VNode
- 以文本节点作为子节点的 div 标签的 VNode 对象
```javascript
const elementVNode = {
  tag: 'div',
  data: null,
  children: {
    tag: null,
    data: null,
    children: '文本内容'
  }
}
```
- 用 VNode 描述抽象内容,区分一个 VNode 到底是普通的 html 标签还是组件。
```js
<div>
  <MyComponent />
</div>

const elementVNode = {
  tag: 'div',
  data: null,
  children: {
    tag: MyComponent,
    data: null
  }
}
```
- 除了组件之外，还有两种抽象的内容需要描述，即 Fragment 和 Portal。
- Fragment 的寓意是要渲染一个片段，假设我们有如下模板：
```js
<template>
  <table>
    <tr>
      <Columns />
    </tr>
  </table>
</template>
// 组件 Columns 会返回多个 <td> 元素：
<template>
  <td></td>
  <td></td>
  <td></td>
</template>
```
- 当渲染器在渲染 VNode 时，如果发现该 VNode 的类型是 Fragment，**就只需要把该 VNode 的子节点渲染到页面。**
```js
const Fragment = Symbol()
const fragmentVNode = {
  // tag 属性值是一个唯一标识
  tag: Fragment,
  data: null,
  children: [
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    }
  ]
}
```
- 什么是 Portal 呢？
一句话：它允许你把内容渲染到任何地方。其应用场景是，假设你要实现一个蒙层组件 <Overlay/>，要求是该组件的 z-index 的层级最高
```js
<template>
  <div id="box" style="z-index: -1;">
    <Overlay />
  </div>
</template>

// 使用 Portal 可以这样编写 <Overlay/> 组件的模板
<template>
  <Portal target="#app-root">
    <div class="overlay"></div>
  </Portal>
</template>
// 对应VNode设计
const Portal = Symbol()
const portalVNode = {
  tag: Portal,
  data: {
    target: '#app-root'
  },
  children: {
    tag: 'div',
    data: {
      class: 'overlay'
    }
  }
}
```
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7ec292908724ff595576e641c427866~tplv-k3u1fbpfcp-watermark.image?)
- VNode的种类
  - html/svg元素、组件、纯文本、Fragment和Portal
## 为什么设置了 tag 还要设置 flags
- vue2 中区别 VNode 是 html 元素还是组件亦或者是普通文本
- 因为没有flags，只能进行下面的流程
- tag是html的标签名也可以是是组件的名称，没有办法直接判断
- 先是当做组件处理
- 再是检查tag的定义
- 有了flags就可以知道：
  - 是否是：
  - html/svg元素、组件、纯文本、Fragment和Portal
  - 有没有子节点、只有一个子节点、多个子节点有 key无 key、不知道子节点的情况
```js
export interface VNode {
  // _isVNode 属性在上文中没有提到，它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
  _isVNode: true
  // el 属性在上文中也没有提到，当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
  el: Element | null
  flags: VNodeFlags
  tag: string | FunctionalComponent | ComponentClass | null
  data: VNodeData | null
  children: VNodeChildren
  childFlags: ChildrenFlags
}
```
- 源码中一个 VNode 对象除了包含本节我们所讲到的这些属性之外，
- 还包含诸如 handle 和 contextVNode、parentVNode、key、ref、slots 等其他额外的属性。
- 比如 handle 属性仅用于函数式组件

# 辅助创建VNode的h函数
- 要了解h函数的作用，先了解一下vue的模板编译的先行步骤。
- 首先对字符串模板进行解析，转换为AST抽象语法树
- 然后vue会对其转换为一个js代码字符串，这个就是h函数的参数
```js
function h(tag, data = null, children = null) {
  //...
}

// 一个最简单的 h 函数如下
function h() {
  return {
    _isVNode: true,
    flags: VNodeFlags.ELEMENT_HTML,
    tag: 'h1',
    data: null,
    children: null,
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}
```

# 设计模式
- 使用观察者模式实现数据响应式之外，在一些场景中，Vue 还会使用订阅/发布模式。- 例如，Vue 实例的生命周期就是通过发布/订阅模式来实现的。
- 在生命周期的各个阶段，Vue 会通过发布消息的方式通知所有订阅者。此外，事件总线 EventBus 也是一种常见的基于订阅/发布模式实现的事件管理机制，

# 讲一讲你是怎么设计modal组件的
- 首先要设计这个组件就需要进行需求分析
  - 它是一个遮罩层
  - 标题的内容可以被定制
  - 有取消和确定的选项
  - 主题的内容就有三种：国际化语言的选择、表单提交功能和模拟异步请求的提交的加载过程实现
- 其次就是分析一下怎么实现上面的功能
  - 弹窗需要跳到页面上，为了不受父组件的束缚，那就可以用到Vue3的Teleport来绑定到body
  - 因为主题内容比较灵活，我们就可以用到slot来包裹
  - 国际化，就是通过定义t这个方法来切换语言

## 具体流程
- 设计成了全局的组件，所以会调用app.use()方法进行注册
- 调用app.use()方法的时候会自动执行install方法
- install函数有两个参数：app、options里就会做以下几件事
  - 进行样式和属性的配置合并
  - 调用app.component()方法注册全局组件：参数：name，Modal对象
  - 然后调用app.config.globalProperties.$modal()方法,可以添加到全局方法里，通过vue2这个api来进行的是函数形式配置，不必编写html标签再来绑定数据
  - 而app.config.globalProperties.$modal方法里面的show方法就是进行配置的
  - 可以配置title啊、content啊、能不能触发点击modal外面就可以取消的boolean类型的值啊，取消的那个X要不要显示啊、透明度设置成多少啊，还有就是定制的确定功能的函数、取消的函数
  - 然后用document.createElement()创建一个节点，createVNode()方法创建虚拟DOM，render()函数渲染到节点上
  - 再是把组件上的props、_hub解构出来和定义一个关闭弹窗的方法：将弹窗移除节点上
  - 我们需要在_hub上添加一些方法: t方法、on-confirm方法、取消方法
  - 因为要实现确定的加载效果，因为确认的函数会进行加载，所以先默认它是promise对象，进行判断，把props.loading设置为true那么确定按钮上就会显示圆圈，然后await 确认函数，再进行关闭弹窗
  - 再把传递的参数进行合并，合并给props
- 那我们看一看Modal.vue吧
  - defineComponent来定义，这样语义化更好
  - 自然是注册的name，实际上我还添加了一个子组件Content，这是一个函数式组件，试一下函数式组件渲染的流程，下面还有就是props的属性，modelValue是boolean类型，title、content可以是字符串或者函数、loading是否加载函数、close是否需要X按钮、maskClose点击外层是否关闭弹窗、设置透明度opacity。
  - 在setup(组件初始化阶段)方法里
    - 用computed计算样式
    - 用getCurrentInstance()方法获取组件实例
    - 在挂载之前，配置一些方法在hub里方便调用
    - 然后就是定义emits数组，方便父子组件之间进行通信
    - 在确认和取消方法被调用时，就向父组件通信，完成相应的操作


```javascript
// 这个语法可以确保代码在 config.props 为真时才会执行 close 方法，避免了可能由 null 或 undefined 值导致的错误
config.props!.close

// 使用 $modal 插件的实现方式：

html
<template>
  <div>
    <button @click="showModal">显示模态框</button>
  </div>
</template>

<script>
export default {
  methods: {
    showModal() {
      this.$modal.show({
        title: '提示',
        content: '确定要执行此操作吗？',
        buttons: [
          { text: '取消' },
          { text: '确定', handler: this.handleConfirm }
        ]
      })
    },
    handleConfirm() {
      // 处理确认操作
    }
  }
}
</script>
{/* 上面的代码中，我们通过在 methods 中定义了一个 showModal 方法，在点击按钮时调用 $modal.show 方法来显示模态框。在 $modal.show 方法中，我们可以通过传入一些选项来配置模态框的标题、内容和按钮等信息，并且还可以指定每个按钮的点击处理函数。 

使用 Modal 组件的实现方式：
*/}
html
<template>
  <div>
    <button @click="showModal">显示模态框</button>
    <modal v-model="isModalVisible">
      <h3 slot="title">提示</h3>
      <p>确定要执行此操作吗？</p>
      <div slot="footer">
        <button @click="isModalVisible = false">取消</button>
        <button @click="handleConfirm">确定</button>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from '@/Modal'

export default {
  components: { Modal },
  data() {
    return { isModalVisible: false }
  },
  methods: {
    showModal() {
      this.isModalVisible = true
    },
    handleConfirm() {
      // 处理确认操作
      this.isModalVisible = false
    }
  }
}
</script>
```
在Vue 3中，由于引入了Composition API的概念，组件的生命周期钩子发生了一些变化。相比Vue 2，Vue 3提供了更灵活、更强大的编程方式，其中就包括了setup()函数。在setup()函数中，我们可以使用新的生命周期钩子函数onMounted()，它的作用和mounted()类似，都是在组件被挂载后执行一些操作。不过，与mounted()函数不同的是，onMounted()是一个响应式的函数，可以在template中直接使用，并且其返回值可以作为组件内部的reactive状态。

另外，由于setup()函数是在组件创建之前执行的，因此onMounted()函数也可以在组件渲染前执行一些逻辑，以提高性能和用户体验。而mounted()函数则只能在组件已经被完全挂载之后才会被调用。


# 讲一讲vue的生命周期
- 生命周期就像是一个人的一生，会经历生老病死
- Vue的组件就会经历像这样的阶段：创建、挂载、更新、销毁，
- 我们可以在生命周期钩子函数添加代码，就可以在不同的生命周期里执行了
## 生命周期的阶段
- 创建前后、挂载前后、更新前后、销毁前后、还有就是一些特殊的场景的生命周期
- 就是keepalive激活的时候、捕捉后代组件错误时候，vue3里还增加了三个关于调试、服务端渲染的生命周期
## 钩子函数
- 这几个阶段对应的钩子函数 API依次为：beforeCreate create beforeMount mounted beforeUpdate updated activated(keep-alive 激活时调用) deactivated(keep-alive 停用时调用) beforeDestory destoryed errorCaptured（捕获子孙组件错误时调用）。
- 在 Vue3 中的变化 绝大多数只要加上前缀 on 即可，比如 mounted 变为 onMounted，除了 beforeDestroy 和 destroyed 被重新命名为 beforeUnmount 和 unMounted

## 他们分别的作用
- beforeCreate之前
  - 组件创建初始化
- created之前
  - 初始化data和methods
- beforeMount之前
  - 开始解析Vue模板，在内存里生成虚拟dom
- mounted之前
  - 虚拟dom转换为真实dom插入到页面里
  - 所以只有在mounted之后的生命周期，才能对dom'元素进行新的操作
  - 这个时候可以进行发送请求、触发绑定的事件
- 进行updated，简单来说就是前后虚拟dom，dispatch的过程。
- beforeUnmounted
  - 清除实例里的定时器、订阅事件
- unMounted
  - 销毁组件实例

# 讲一讲什么是SPA
- 也就是单页应用
- 动态重写当前的页面与用户交互，通过前端路由进行无刷新跳转
- 讲就是一个杯子，早上装的牛奶，中午装的是开水，晚上装的是茶，我们发现，变的始终是杯子里的内容，而杯子始终是那个杯子结构
- 用户体验好，通过ajax获取数据，全端负责渲染
- 首屏加载慢，大部分文件都是通过在首页加载，获取数据
- webpack打包工具缩小js文件、SSR开发、图片压缩

# hash和history模式
- hash模式实现的方式就是通过监听hashchange事件，执行回调函数
- url会带有#号
- **不利于SEO，因为不知道是不是新页面**
- history路由的实现主要就是通过pushState和replaceState实现的
- 一个是压入、另一个是替换
- 那么是不是如果我们能够监听到改变URL这个动作，就可以实现前端渲染逻辑的处理呢？
- popstate无法监听history.pushState和history.replaceState方法

- 当是hash路由的时候，我们可以通过监听hashchange事件
- 当是history路由的时候，本来popstate事件监听浏览器历史栈状态的变化
- 但是只能监听到前进或者后退导致的历史变化
- 当我们调用history.pushState和history.replaceState方法的时候，就算改变了URL，因为popState监听不到，就不会使页面重绘。
- 我们需要手动调用window.dispatchEvent(new PopStateEvent('popstate'))
- 通过监听自定义事件，完成功能
- 但是history模式有个缺点，跳转路由之后再刷新，会404，浏览器端在该路径下找静态资源，但是服务器端是没有这个文件的，所以我们就会配置，当访问的路径不存在的时候，默认指向index




