# 了解WebGL
- WebGL能够直接访问计算机的GPU（图形处理单元），这使得它比传统的Canvas API更快速并且功能更强大。
- 传统的Canvas API只能使用浏览器的CPU（中央处理单元）来执行这些任务
- 主要是通过学习Threejs框架来了解WebGL
# 讲一下你构建的threejs车模型
- 先构造一个renderer函数，这个函数有两个参数camera和scene
- camera对象可以决定视口里投影的车模型
- scene对象可以添加光源、网格地面、对车模型材质进行处理
- 最后调用render()函数渲染



