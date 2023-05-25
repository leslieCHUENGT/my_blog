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
  - 不利于SEO，因为不知道是不是新页面
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
[【vue进阶之旅】组件通信的8种方式，你搞清楚了吗？ - 掘金 (juejin.cn)](https://juejin.cn/post/7022054075411726366#heading-0)
- 父组件子组件传信
  - props
  - 通过$emits触发自定义事件
  - ref/$refs，父组件通过this.$refs.子组件名来调用子组件上的方法
- 还有几种就是可以不受限制的
  - vue2里有一个中央事件总线eventbus，不受组件关系限制，都可以传递和获取
  - $parent/ $children通过调用方式来确定父子组件的关系，获取信息，官方不推荐使用
  - vuex/pinia,管理所有组件状态的工具
  - 本地存储localStorage/sessionStorage
  - `$attrs`/`$listeners`
##### 一：`props`/`$emit`(父传子，子传父，子调父)

##### 二：`$bus`（任意组件传值，任意组件调方法）

##### 三：`ref/$refs`（父调子）

##### 四：`$parent`/ `$children`（父子组件）

##### 五：`provide`/`reject`（跨级组件）

##### 六：`Vuex`（任意组件）

##### 七：`localStorage`/`sessionStorage`（任意组件）

##### 八：`$attrs`/`$listeners`（跨级组件）

# 讲一讲虚拟dom和diff算法
- 首先vue编译模板，生成了ast抽象语法树
- h函数就可以根据ast抽象语法树上的节点信息进行递归遍历
- 生成的是虚拟dom
  - h函数的工作流程就是把类型给确定好
  - 给节点添加上各种标签
  - 添加上标签有利于后续的diff算法可以高效进行
- diff算法
  - 对比递增子序列的过程
  - 1234
  - 2143
  - 寻找新的vonde节点的最大标记值
  - 那么就可以知道哪些节点是增加和插入
  - 对于删除来说，只能通过对比新旧节点来进行标记
- 最后就通过render函数来进行渲染

# 讲一讲路由懒加载和图片懒加载
- 路由懒加载实际上是通过import()函数动态导入路由组件
- 例如webpack这个工程化打包工具，初始的时候不会打包到js文件里
- 而是在运行时动态加载
- import()函数调用的时候会返回Promise对象

- 图片懒加载的实现就是通过
- 根据图片什么时候出现在视窗
- 进行加载
- 加载完成之后就下载到了本地，进而移除类名就可以了











