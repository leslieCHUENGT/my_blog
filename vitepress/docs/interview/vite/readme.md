     - 错误监控：资源加载错误、js 错误、promise 错误、自定义错误 

     - 行为监控： uv、pv（**使用通用自定义指令、方法和路由守卫**）、页面停留时间、自定义统计事件、用户点击

     - 性能监控：FP、FCP、LCP、LCS、FPS、DNS和 TCP首字节时间、onload、、缓存命中率、接口请求耗时、资源加载时间、首屏渲染时间（**独立解决了特定项目异步渲染大数据的 echars和懒加载图片的计时不准确问题**）
     
     - 上报方式：SendBeacon或者 XMLHttpRequest上报

     - 上报时机：采用 requestIdleCallback及其降级方案上报、在 beforeunload上报或者缓存达到数量后再上报
      



# 什么是构建工具

- 具备的功能
  - ts：遇到ts文件使用tsc将ts代码转化为js代码
  - React/vue：转换为render函数
  - css预处理器：编译工具
  - 语法降级：
  - 体积优化
  - 模块化开发支持：支持直接从node_modules里引入
  - 处理兼容性：
  - 提供项目性能：
  - 优化开发体验：
    - 热更新
    - 跨域 






