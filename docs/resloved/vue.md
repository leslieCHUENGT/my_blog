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
- 在路由里配置meta属性来标记，通过v-if判断是否需要进行keep-alive
- keep-alive是vue中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM
- 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们

# 使用Proxy对象可以对整个对象进行拦截，而使用class类只能对特定的属性或方法进行拦截。可以用代码举例吗？

# vue3关于响应式源码里使用proxy时要用Reflect？
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ae065034b742b4af50c74487a6dbcf~tplv-k3u1fbpfcp-watermark.image?)

# Object.defineProperty()
- vue2里是通过Object.defineProperty()来进行数据劫持
- 但是对象新增的属性和方法它监听不到，还需要手动Vue.set
- 对于深度监听，要手动Vue.set

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

# 








