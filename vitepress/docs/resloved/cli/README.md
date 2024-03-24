- #!/usr/bin/env node
- npm link
- commander.js
```js
node xxx
[
  'D:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\chueng\\AppData\\Roaming\\npm\\node_modules\\my_cli\\bin\\index.js'
]
```
- 创建系统命令`zccli create app`
- npm init -y创建pakeage.json,添加bin字段，那么命令就会执行这个文件
- `为了解决MacOS下发生的问题`，修改读写权限为755，自动执行命令 chmod 755 cli.js 实现修改
- `实际上开发过程中，很多时候会在本地调试，使用npm link命令,在版本迭代更新时/版本内容bug修复时，总要把之前link的弄为unlink,新仓库代码才会生效，为了解决npm link的弊端`，我们使用`pnpm`搭建`monorepo`风格的脚手架
- npm link 的原理就是通过创建`软链接`的方式，将本地开发的模块`链接到全局目录中`，使得它可以被其他项目引用和使用。
  - 实现的手段就是在模版代码的`package.json`中进行修改`dependencies`不给脚手架版本号，给一个`workspace: *`,另外在`pnpm-workspace.yaml`指定就行
  - 同属于一个工作空间，同属一个工作空间的，工作空间中的子工程编译打包的产物都可以被`其它子工程引用。`
- 指定安装`pnpm add yargs --F mortal-cli`在某个子工程里
- 命令参数模块 开源库 yargs解析参数,设置子命令。
- 用户交互模块 开源库inquirer

# 为什么要做一个脚手架的形式？
- 语言方面的选择，统一部门内项目的依赖的版本问题，可以快速搭建起后台管理系统
# 难点痛点？
- 统一代码风格的问题引入Eslint、Prettier
- git提交规范commitLint
## 兼容问题
- vite开箱即用的插件处理了一切`vite/plugin-legacy`
- 兼容性最怕遇到低版本的浏览器，对于兼容性会在线上出现两种报错的情况
  - 语法不支持（Promise）
  - Polyfill缺失（注入api的代码，有些出现会缺失）
- 这个问题的底层就是通过babel和corejs库来解决的
- bebal做了很多事，Polyfill也是在ast上来进行垫片的
- 这个插件的打包产物会有两种script引入
- module和nomodule会进行自动忽略
- 
