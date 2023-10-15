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
- `实际上开发过程中，很多时候会在本地调试，使用npm link命令,在版本迭代更新时，总要把之前link的弄为unlink,新仓库代码才会生效，为了解决npm link的弊端`，我们使用`pnpm`搭建`monorepo`风格的脚手架

