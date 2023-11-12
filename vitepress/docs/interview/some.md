# MVC与MVVM
- MVC起初只是后端，后续出现了ajax，前后端的职责更加清晰
- view和model之间是观察者模式，交互产生，controller负责响应操作，调用model，通知view
- MVVM是VM层，它和 MVP 的思想其实是相同的，不过它通过双向的数据绑定，将 View 和 Model 的同步更新给自动化了。这样就将 Presenter 中的工作给自动化了。

# vue3中的优化
- 位运算，节点的flags
- WeakMap()和Set()
- 