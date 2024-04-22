# v-model
- 指令、语法糖
- input框
  - 自动添加绑定的事件 `.value`
- 组件
  - 本质是父子组件之间的通信

# hash路由和 history路由
- 本质是 `Vue`实现单页应用，当url发生改变，但`index.html`文件不改变，绑定的相应的组件
- hash路由
  - 本质就是锚点
  - 监听 `onhashchange`事件
  - 微前端项目中，存在嵌套的应用的现象，但是一个url只能有一个 #，存在命名问题
  - SEO不友好，不知道是新页面
- history路由
  - history模式需要后台配置支持，如果后台没有正确配置，访问时会返回 404
  - 在不触发重新加载网页的情况下，采用`history`对象中的`pushState()`重写 URL，重写会丢失原html的路径
  - 脚手架在开发模式支持了，生产模式下服务器需要进行重定向
- Memory 模式
  - SSR/Node环境
# params和query的区别
- Params参数对应于URL中的动态部分，如/users/:id (`数字`)
- Query参数用于传递请求参数，如?name=John&age=30

# vue2和vue3响应式原理的差别
- api
  - Object.defineProperty()、proxy
- 数据改变，通知视图层进行更新
- 当在项目中`直接设置数组的某一项的值，或者直接设置对象的某个属性值`Object.defineProperty()限制，监听不到变化。 
- `vue源码里缓存了array的原型链，`然后重写了这几个方法，触发这几个方法的时候会observer数据，意思是使用这些方法不用再进行额外的操作，视图自动进行更新
  
# 性能上的优化
- 数据劫持上的优化
  - Object.defineProperty()无脑递归，并不能检测对象属性的添加和删除
  - 同时Proxy 并不能监听到内部深层次的对象变化，Vue3 的处理方式是在getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式
- 编译阶段，`每个组件实例`都对应一个 watcher 实例
  - `无状态的组件`不需要进行监听观察
  - diff算法优化，静态提升，不参与更新的节点只会创建一次
  - 事件监听缓存，对动态事件的结果进行缓存
  - 功能单个引入，对与`tree sharing`更加支持







