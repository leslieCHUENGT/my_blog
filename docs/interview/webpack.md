# webpack
## 基本使用流程的思考
- `Webpack` 本质上是一个`函数`，它接受一个`配置信息`作为`参数`，执行后返回一个 `compiler 对象`，调用` compiler `对象中的` run `方法就会`启动编译`。run 方法接受一个`回调`，可以用来查看编译过程中的`错误信息或编译信息`
```javascript
// const { webpack } = require("./webpack.js"); //后面自己手写
const { webpack } = require("webpack");
const webpackOptions = require("./webpack.config.js");
const compiler = webpack(webpackOptions);

//开始编译
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      assets: true, //打印本次编译产出的资源
      chunks: true, //打印本次编译产出的代码块
      modules: true, //打印本次编译产出的模块
    })
  );
});
```
- Webpack 原理，那么核心问题就变成了：如何将左边的`源代码`转换成` dist/main.js 文件`？

> 核心思想

-   第一步：首先，根据配置信息（`webpack.config.js`）找到入口文件（`src/index.js`）
-   第二步：`找到入口文件所依赖的模块`，并收集关键信息：比如`路径、源代码、它所依赖的模块`等：
```javascript
var modules = [
  {
    id: "./src/name.js",//路径
    dependencies: [], //所依赖的模块
    source: 'module.exports = "不要秃头啊";', //源代码
  },
  {
    id: "./src/age.js",
    dependencies: [], 
    source: 'module.exports = "99";',
  },
  {
    id: "./src/index.js",
    dependencies: ["./src/name.js", "./src/age.js"], 
    source:
      'const name = require("./src/name.js");\n' +
      'const age = require("./src/age.js");\n' +
      'console.log("entry文件打印作者信息", name, age);',
  },
];
```
- 第三步：根据上一步得到的信息，生成最终输出到硬盘中的文件（`dist`）： 包括 modules 对象、require 模版代码、入口执行文件等

- 在这过程中，由于浏览器并不认识除`html、js、css` 以外的文件格式，所以我们还需要对源文件进行转换 —— Loader 系统。
- 除此之外，打包过程中也有一些`特定的时机需要处理`，比如：
    - 在打包前需要校验用户传过来的参数，判断格式是否符合要求
    - 在打包过程中，需要知道哪些模块可以忽略编译，直接引用 cdn 链接
    - 在编译完成后，需要将输出的内容插入到 html 文件中
    - 在输出到硬盘前，需要先清空 dist 文件夹
    - ......
- 一个可插拔的设计，方便给社区提供可扩展的接口 —— `Plugin 系统`。
    - `Plugin 系统` 本质上就是一种`事件流`的机制，到了`固定的时间节点就广播特定的事件`，用户可以在事件内执行特定的逻辑，类似于`生命周期`：

## 架构设计
一套事件流的机制来管控整个打包过程，大致可以分为三个阶段：

- 打包开始前的`准备工作`
- 打包过程中（也就是`编译阶段`）
- 打包结束后（包含打包`成功`和打包`失败`）

`watch mode`（当文件变化时，将重新进行编译），因此这里最好将编译阶段（也就是下文中的compilation）单独解耦出来。
在 Webpack 源码中，`compiler` 就像是一个大管家，它就代表上面说的三个阶段，在它上面挂载着各种生命周期函数，而 `compilation` 就像专管伙食的厨师，专门`负责编译`相关的工作，也就是打包过程中这个阶段。画个图帮助大家理解


**如何实现这套事件流呢？**
类比到 Vue 和 React 框架中的`生命周期函数`，它们就是到了固定的时间节点就执行对应的生命周期，`tapable` 做的事情就和这个差不多，我们可以通过它先`注册一系列的生命周期函数`，然后在`合适的时间点执行`。

在 Webpack 中，就是通过 `tapable` 在 `comiler` 和 `compilation` 上像这样挂载着一系列`生命周期 Hook`，它就像是一座桥梁，贯穿着整个构建过程：

```js
class Compiler {
  constructor() {
    //它内部提供了很多钩子
    this.hooks = {
      run: new SyncHook(), //会在编译刚开始的时候触发此钩子
      done: new SyncHook(), //会在编译结束的时候触发此钩子
    };
  }
}
```

## 具体实现
（1）搭建结构，读取**配置参数**
（2）用**配置参数**对象初始化 `Compiler` 对象
（3）挂载配置文件中的**插件**
（4）执行 `Compiler` 对象的 `run `方法开始执行编译
（5）根据配置文件中的 `entry` 配置项找到所有的入口
（6）从入口文件出发，调用配置的 `loader` 规则，对各模块进行编译
（7）找出此模块所依赖的模块，再对**依赖模块**进行编译
（8）等所有模块都编译完成后，根据模块之间的**依赖关系**，组装代码块 `chunk`
（9）把各个代码块 `chunk` 转换成一个一个文件加入到**输出列表**
（10）确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统

### 搭建结构，读取配置参数
根据 Webpack 的用法可以看出，
`Webpack` 本质上是一个**函数**，它接受一个**配置信息作为参数**，执行后返回一个 `compiler` 对象，调用 `compiler` 对象中的 `run `方法就会启动编译。run 方法接受一个回调，可以用来查看编译过程中的**错误信息或编译信息**

### 用配置参数对象初始化 Compiler 对象
上面提到过，`Compiler` 它就是整个打包过程的大管家，它里面放着各种你可能需要的**编译信息**和**生命周期 Hook**，而且是**单例模式**。

### 挂载配置文件中的插件
`Webpack Plugin` 其实就是一个**普通的函数**，在该函数中需要我们定制一个 apply 方法。当 `Webpack` 内部进行插件挂载时会执行 apply 函数。我们可以在 apply 方法中订阅各种生命周期钩子，**当到达对应的时间点时就会执行**。

```js
//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数
function webpack(webpackOptions) {
  //第二步：用配置参数对象初始化 `Compiler` 对象
  const compiler = new Compiler(webpackOptions);
  //第三步：挂载配置文件中的插件
+ const { plugins } = webpackOptions;
+ for (let plugin of plugins) {
+   plugin.apply(compiler);
+ }
  return compiler;
}
```
### 执行Compiler对象的run方法开始执行编译

### 从入口文件出发，调用配置的loader规则，对各模块进行编译
-  把入口文件的**绝对路径**添加到依赖数组（`this.fileDependencies`）中，记录此次编译依赖的模块

-  得到入口模块的的 `module` 对象 （里面放着**该模块的路径**、**依赖模块**、**源代码**等）

    -   读取模块内容，获取源代码
    -   创建模块对象
    -   找到对应的 `Loader` 对源代码进行翻译和替换

-  将生成的入口文件 `module` 对象 push 进 `this.modules` 中

### 找出此模块所依赖的模块，再对依赖模块进行编译
（7.1）：先把源代码编译成` AST`
（7.2）：在 `AST` 中查找 `require` 语句，找出依赖的模块名称和绝对路径
（7.3）：将依赖模块的绝对路径 `push` 到 `this.fileDependencies` 中
（7.4）：生成依赖模块的模块 `id`
（7.5）：修改语法结构，把依赖的模块改为依赖模块 `id`
（7.6）：将依赖模块的信息 `push` 到该模块的 `dependencies` 属性中
（7.7）：**生成新代码**，并把转译后的源代码放到 `module._source` 属性上
（7.8）：对依赖模块进行编译 **对 `module `对象中的` dependencies` 进行递归执行 `buildModule`**
（7.9）：对依赖模块编译完成后得到依赖模块的 `module `对象，`push` 到 `this.modules `中
（7.10）：等依赖模块全部编译完成后，返回入口模块的 `module` 对象

### 等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 chunk

一般来说，每个入口文件会对应一个**代码块chunk**，每个代码块chunk里面会放着本入口模块和它依赖的模块，这里暂时不考虑代码分割。

### 把各个代码块 chunk 转换成一个一个文件加入到输出列表

### 确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统





