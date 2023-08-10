# 
通过神三元的文章，了解了一下有关于`react的diff算法`的实现思路，关键代码如下：
```javascript
        let lastIndex = 0
          for (let i = 0; i < nextChildren.length; i++) {
            const nextVNode = nextChildren[i]
            let j = 0,
              find = false
            for (j; j < prevChildren.length; j++) {
              const prevVNode = prevChildren[j]
              if (nextVNode.key === prevVNode.key) {
                find = true
                patch(prevVNode, nextVNode, container)
                if (j < lastIndex) {
                  // 需要移动
                  const refNode = nextChildren[i - 1].el.nextSibling
                  container.insertBefore(prevVNode.el, refNode)
                  break
                } else {
                  // 更新 lastIndex
                  lastIndex = j
                }
              }
            }
            if (!find) {
              // 挂载新节点
              const refNode =
                i - 1 < 0
                  ? prevChildren[0].el
                  : nextChildren[i - 1].el.nextSibling
              mount(nextVNode, container, false, refNode)
            }
          }
          // 移除已经不存在的节点
          for (let i = 0; i < prevChildren.length; i++) {
            const prevVNode = prevChildren[i]
            const has = nextChildren.find(
              nextVNode => nextVNode.key === prevVNode.key
            )
            if (!has) {
              // 移除
              container.removeChild(prevVNode.el)
            }
          }
```
- 只有当新旧子节点的类型都是多个子节点时，核心 Diff 算法才派得上用场
- 简单Diff算法的操作行为：在可以准确完成更新的情况下，尽量去`复用之前的真实DOM`。
- 两层循环里先遍历新的vdom，再遍历旧的vdom。
- 在循环里需要做下面几件事情:
  - 通过key来寻找`递增子序列`，他们可以直接通过`patch`来完成更新
  - 不断更新`lastIndex`来确定新的vdom里的`插入、新增操作`，并且给予标记，完成更新
  - 当进行插入和新增时，需要去`拿到其前一个节点的container`，通过dom api来完成正确的重新定位
-  `删除操作`是会再通过一个for循环来`比较新旧vdom`再进行删除的





