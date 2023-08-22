# 插件核心 SDK 包——plugin-core

- 基于字节的`modern.js`提供的插件化 API 的二次封装
- 支持以组件或者函数的形式载入插件

## 开发流程

- 背景描述
  - 组件/函数插件使用的流程
    - 混合云产品会有大量的、重复的组件和逻辑，实现更好的开发和后期维护
    - 插件开发使得项目不再那么臃肿和难以维护
    - 在项目里开发在目录下有 plugin 文件夹，我们可以在这里引入插件的代码
    - 如果需要进行插件的二次开发，我们就再起一个分支进行定制开发
    - 这里 plugin 文件下的组件页面不会被直接进行引入到 src 下，通过我们引入公司的 SDK 包文件进行间接的使用
    - 使用方面就是通过引入 SDK 的文件来进行插件异步管理来引入插件的使用

# @esign-bridge-store 插件数据隔离

```js
// 使用该插件
Vue.use(
  // 需要加载的插件
  storeSDK,
  // 需要的配置参数信息
  {
    state,
    store,
    router,
  }
);

// 自动执行install方法

```
- 组件页面/函数插件作为数据使用方，需要对主应用数据的使用进行权限管理
- 比如主应用的token、个人信息是不能被插件修改的，做好数据隔离，权限管理
- 所以要做的事情有：
  - 不能丢失`响应式特性`
  - 针对数据的修改权限进行管理，只有`指定`的才能进行修改
  - 对`全局`数据获取/`页面`数据获取进行管理

- 既然要进行改插件的实现，我们先关注到调用`app.use()`的第二个参数
- 第一,我们是用` vuex `进行状态管理的，所以，我们需要获取指定的插件可用的数据源，指定这个state的来源`（store.state.pluginData）`
- 第二,我们传入`router`，使得在插件里可以解构到当前路由的name的信息，后续针对某页面数据管理可以用到（不传递参数，就默认是改页面的数据）
- 第三,我们传入`store`，因为我们可以指定某些数据在插件里获取，所以可能会需要调用到`commit/dispatch`来进行状态的管理

- 再讲一讲store设计的内容是怎么才能符合该流程下的规范
- 我们在`modules`中会单独开一个PluginData.js来进行暴露，state中会有`global`和某些页面name后缀的名字作为属性名称

- 接下来我可以讲一讲需要实现的方法
- 执行完了install方法，我们就可以进行将实例在挂载在`window.esignbridge.$store`上，(没有考虑挂载在Vue上和调用app.config.globalProperties上)
- 这里有几个方法
  - 第一个是获取global数据源，也就是在store里进行设置成每个页面都可以直接访问的state
  - 第二个是获取页面的数据源，不传参就可以进行当前页state数据获取，传参可以指定获取某页面的
  - 上面获取的数据都不能进行改变，
  - 还有一个就是进行指定数据源state状态的改变
  - 做这些操作都是为了在使用其他插件时，做到数据隔离，必须通过该挂载在window上的实例方法进行使用数据

- 实现流程
- 通过install传递的参数有vue方法和三个参数
- 针对前两个方法的实现，我们需要解决的第一个问题，一定不可以通过该函数的返回值进行改变源state的状态
  - `深拷贝`：实现数据隔离、
  - 对拷贝的数据进行`代理`：解决不改变的问题、
  - 对state进行深度和立即监听，实现数据响应式丢失的问题（当然会进行`Object.defineProperty`代理）
- 再一个就是进行`state`的改变，这个确定一下是dispatch还是commit就行

- 但实际上这样做出现了很大的问题，测试用例根本就过不了，响应式丢失，`全部都进行代理数据不可修改的错`
- 针对这个问题我是这样提炼问题和解决的，我要做两件事情：更新的时候，对于我已经代理的数据我可以再插件里进行改变；在外面我们不能直接改变数据
- 所以我需要去对set函数进行`上锁和解锁`的的包装，其实vue源码里的`computed`也用到了这个
- 所以处理的方法就是，在对数据进行$watch时，我们先将这个更新的操作进行函数的包裹，先使一个flag变量为true，在这个代理的set操作中就去到了另一个可以更新数据的分支，随后再进行flags的赋值，进行上锁。

- 实际上还有细节要进行处理，打印的代理数据的结果，是一层一层的proxy进行嵌套，发生这个情况的原因就是每次都直接对不管是新加的还是旧的数据，都会再进行一次proxy的代理，必须对嵌套的情况进行处理。
- 实际上的解决办法就是可以通过在代理的对象上添加一个属性来表示已经是proxy代理对象了，所以遍历的时候可以进行筛选再进行代理

- 参与了基线开发数据 SDK 的编写，熟悉 Vue 插件和 SDK 的开发流程






