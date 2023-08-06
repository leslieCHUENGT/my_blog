# SSR
- 服务器端渲染

## 手写SSR
- 声明周期create之前都会完成
- node 搭建 web 服务器,启动 web 服务
- Vue 在 node 环境下运行，并通过 Vue.createSSRApp() 编译生成服务器端 app 对象
- @vue/compiler-ssr 服务器端编译
- @vue/server-renderer 将服务器端 app 对象调用 renderToString() 生成 html 字符串，并由 res.send 返回给客服端
- 客服端再执行 相应js文件 完成事件绑定 页面渲染 生命周期等前端业务
