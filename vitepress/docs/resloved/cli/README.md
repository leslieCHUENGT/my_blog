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
  - 实现的手段就是在模版代码的`package.json`中进行修改`dependencies`不给脚手架版本号，给一个`workspace: *`,另外在`pnpm-workspace.yaml`指定就行
  - 同属于一个工作空间，同属一个工作空间的，工作空间中的子工程编译打包的产物都可以被`其它子工程引用。`
- 指定安装`pnpm add yargs --F mortal-cli`在某个子工程里
- 
