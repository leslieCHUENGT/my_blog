# webpack是什么
- `webpack`是基于`nodejs`的工程化套件，是前端资源的打包工具

# 讲一讲webpack的打包流程
- 首先就是把配置参数确定下来，一般是从`配置文件`确定就可以了，但有时候会使用`shell`来传递参数，它比较`灵活`，所以结合他们两个来确定参数。
- 确定下来了，然后，用得到的参数来初始化`Compiler`对象，完成`挂载插件Plugin`，执行`Compiler`对象的`run`方法**开始执行编译**。
- 接下来就开始编译了，先根据配置文件的`entry`配置找到**入口文件**，从入口文件出发，调用配置的`loader`规则，**对各模块进行翻译和替换**,再找出该模块**依赖**的模块，通过递归再对依赖模块进行**翻译和替换**，同时还得到了模块间的依赖关系，**构成了依赖图**。
- 等所有模块都编译完成后，根据模块之间的依赖关系，**组装代码块 chunk**
- 把**各个代码块 chunk**转换成一个一个文件加入到输出列表
- 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

# webpack对前端性能优化可以在哪些方面做文章
- 可以从比较常用的loader和Plugin来讲一讲
- 就拿url-loader来说
  - 为了减小文件的大小，可以把部分小并且不怎么变的的图片转换成`base64`格式的
  - 为了**减少并发请求数**，还可以放在`js`文件里
  - 为了可以更好的让浏览器使用缓存，在输出的文件夹名里可以生成**新的哈希值**，这点在每个出口文件里都用到了
- 可以拿MiniCssExtractPlugin来说
  - 为了实现更好的利用缓存，不同类型的文件最好分离打包、做好**代码分割**
  - 为了减少文件的大小，自然离不开**压缩**可以用CssMinimizerPlugin
- 可以拿TerserWebpackPlugin来说
  - 也就是tree shaking
  - 注释、console、没有使用的变量或者函数可以自动剔除
- 为了可以更好的实现代码分割，可以再增加一个入口**vendor**
  - 比如一些**库、框架**抽离出来，独立打包，避免了重复打包，减少文件的体积

# 你有了解手写过一个loader吗？
- loader的实质就是一个function
- 我了解过一个很基本的loader的手写实现，就是babel-loader，它这个例子还实现了在代码里剔除console.log的功能
- 不过我看的这个手写的例子让我对js的编译原理产生了好奇，因为会涉及AST抽象语法树
- 它的实现流程就是通过引入babel的几个库函数，生成了AST抽象语法树后，通过traverse函数来变成es5的AST抽象语法树
- 在遍历途中剔除了console.log
- 最后就再通过功能函数来返回的是es5的代码

# 讲一讲tree shaking是怎么工作的
- 本质上利用了ES6模块系统的静态特性，模块的依赖关系在代码编译时就已确定，而且这些依赖关系是静态的，不会在运行时发生变化。
- 代码解析：使用编译器对JavaScript代码进行静态解析，构建抽象语法树（AST）。
- 标记无用代码：分析代码的AST，标记出那些不需要执行的代码段，例如未被引用的函数或类。
- 删除无用代码：将标记的无用代码从源代码中移除，生成一个精简的、只包含实际需要的代码的输出文件。

# webpack如何优化打包
1. 文件大小
   1. tree shaking、代码分割
   2. cache
2. 打包速度
   1. 配置optimization.splitChunks选项以进行代码分割。在这个例子中，设置chunks选项为async表示只对异步加载的模块进行代码分割（不对同步加载的模块进行分割），并将所有公共依赖项打包到名为common的chunk中。
    

# 讲一讲Loader和Plugin的区别
- `Loader`本质就是function，它充当着翻译官的角色，因为Webpack默认只能处理JavaScript文件，因为是基于nodejs，所以需要一个翻译官来对`非JavaScript文件（如CSS、图片等）`转换成`可被Webpack处理的模块`。
- 在 `module.rules` 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 `test(类型文件)`、`loader`、`options (参数)`等属性。
- 每个loader都有一些选项或配置参数，这些选项可以通过webpack配置文件的module.rules字段来设置。这些选项**通常用于控制loader的行为**，例如指定loader所处理的文件类型、启用或禁用某些功能、设置相应的输出格式等等。
- `Plugin`的本质就是本质是一个具有apply方法javascript对象，基于`事件流框架 Tapable`，插件可以`扩展 Webpack 的功能`，可以对`JS代码进行压缩混淆`、对`处理图片、字体等资源文件，将其转换为base64格式或者单独的文件`、将`多个JS文件合并成一个`等等。这些操作都需要依靠Plugin来完成。在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以`监听这些事件`，在`合适的时机`通过 Webpack 提供的 API `改变输出结果。`
- Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

# 打包优化
- 代码压缩和混淆
  - js压缩的插件`UglifyJSPlugin` / `TerserPlugin`
    - 混淆、删除多余的空格、注释、console.log()和未使用的代码等
      - 混淆就是将变量名改为短且无意义的名字，使得难以破解`SayHello() -> S()`
    - 本质就是根据AST抽象语法树来进行重命名和分配
    - 报错怎么办：`dev-tool:'source-map'`
  - css压缩的插件 `MiniCssExtractPlugin`将CSS提取为**单独的文件**，并使用css-loader和uglifyjs-webpack-plugin对其进行压缩。
    - scoped带来css的安全性？
  - gzip压缩,Http2.0？  
  - 
- treeshaking
    - 基于es6模块化，静态分析，无用代码
  - 图片方面
    - 为了减小文件的大小，可以把部分小并且不怎么变的的图片转换成`base64`格式的
    - 为了**减少并发请求数**，还可以放在`js`文件里
    - webp批处理
- code splitting
  -  import() 函数来实现动态代码分割，将一个大型的 JavaScript 应用程序拆分为多个小块，然后按需加载这些小块。
  - vue3 composition api 函数式使得更友好
  - 框架懒加载
  - 图片懒加载
  - 使用cdn vendor js css


# 与webpack类似的工具还有哪些？区别？
- Rollup
  - 不像webpack那样存在大量`引导代码和模块函数`
  - 默认支持 `Tree-shaking`

- Parcel
  - 开箱即用的工具
  - 默认多进程打包
  - 生态不成熟，插件不够丰富，性能瓶颈...

- snowpack
  - 和vite一样使用即时模块构建，开发体验更好
  - 生态不成熟，插件不够丰富

