# h函数

## h函数的作用

在模板引擎的年代，组件的产出是 `html` 字符串，而如今的 `Vue` 或 `React`，它们的组件所产出的内容并不是 `html` 字符串，而是大家所熟知的 `Virtual DOM`。下面我们用`snabbdom的h函数`来简单了解一下`h`函数创建`Virtual DOM`以及渲染到真实DOM的过程。

***

**在后续行文时，将统一使用 `VNode` 来简称 Virtual DOM** 。

```js
import { h } from 'snabbdom'
// h 函数用来创建 VNode
const MyComponent = props => {
  return h('h1', props.title)
}
// 组件的产出是 VNode
const prevVnode = MyComponent({ title: 'prev' })
// 将 VNode 渲染成真实 DOM
patch(document.getElementById('app'), prevVnode)

// 数据变更，产出新的 VNode
const nextVnode = MyComponent({ title: 'next' })
// 通过对比新旧 VNode，高效地渲染真实 DOM
patch(prevVnode, nextVnode)
```
## 使用flags作为VNode的标识
既然 `VNode` 有类别之分，我们就有必要使用一个唯一的标识，来标明某一个 `VNode` 属于哪一类。同时给 `VNode` 添加 `flags` 也是 `Virtual DOM` 算法的优化手段之一。

```js
const VNodeFlags = {
    // html 标签
    ELEMENT_HTML: 1,
    // SVG 标签
    ELEMENT_SVG: 1 << 1,
    // 普通有状态组件
    COMPONENT_STATEFUL_NORMAL: 1 << 2,
    // 需要被KEEPALIVE的有状态组件
    COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
    COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
    // 函数式组件
    COMPONENT_FUNCTIONAL: 1 << 5,
    TEXT: 1 << 6,
    FRAGMENT: 1 << 7,
    PORTAL: 1 << 8
}

  // html 和 svg 都是标签元素，可以用 ELEMENT 表示
  VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG
  // 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlice的有状态组件 都是“有状态组件”，统一用 COMPONENT_STATEFUL 表示
  VNodeFlags.COMPONENT_STATEFUL =
  VNodeFlags.COMPONENT_STATEFUL_NORMAL |
  VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE |
  VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE
  // 有状态组件 和  函数式组件都是“组件”，用 COMPONENT 表示
  VNodeFlags.COMPONENT =
  VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL

const ChildrenFlags = {
    // 未知的children类型
    UNKNOW_CHILDREN: 0,
    // 没有children
    NO_CHILDREN: 1,
    SINGLE_VNODE: 1 << 1,
    // children是多个拥有key的VNODE  
    KEYED_VNODES: 1 << 2,
    // 多个没有key的VNODE
    NONE_KEYED_VNODE: 1 << 3
}
ChildrenFlags.MULTIPLE_VNODES =
    ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODE

```

## h函数

### 确定h函数的参数和返回值

```js
function h(tag, data = null, children = null) {
  return {
    tag,
    _isVNode: true,
    el:null,
    flags,
    data,
    children,
    childFlags
  }
}
```

### 在VNode创建时确定其类型-flags

```js {11-22}
function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    // 兼容 Vue2 的对象式组件
    if (tag !== null && typeof tag === 'object') {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
    } else if (typeof tag === 'function') {
      // Vue3 的类组件
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
        : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
    }
  }
  return {
    tag,
    _isVNode: true,
    el:null,
    flags,
    data,
    children,
    childFlags
  }  
}
```
### 在VNode创建时确定其children的类型

```js
function h(tag, data = null, children = null) {
    let flags = null
    if (typeof tag === 'string') {
        flags = tag === 'svg' ?VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
    } else if (tag === Fragment) {
        flags = VNodeFlags.FRAGMENT
    } else if (tag === Portal) { 
        flags = VNodeFlags.PORTAL
        tag = data && data.target//???
    } else {
        // 兼容 Vue2 的对象式组件
        if (tag !== null && typeof tag === 'object') {
            flags = tag.functional//???
                ? VNodeFlags.COMPONENT_FUNCTIONAL
                : VNodeFlags.COMPONENT_FUNCTIONAL
        } else if (typeof tag === 'function') { // Vue3 的类组件
            // 箭头函数没有构造函数，更别说有prototype
            flags = tag.prototype && tag.prototype.render
                ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
                : VNodeFlags.COMPONENT_FUNCTIONAL
        }
    }

    let childFlags = null
    if (Array.isArray(children)) {
        const { length } = children
        if (length === 0) {
            childFlags = ChildrenFlags.NO_CHILDREN
        } else if (length === 1) {
            childFlags = ChildrenFlags.SINGLE_VNODE
            children = children[0]
        } else {
            // 2个以上
            childFlags = ChildrenFlags.KEYED_VNODES
            children = normalizeVNodes(children)
        }
    } else if (children === null) {
        childFlags = ChildrenFlags.NO_CHILDREN
    }else if (childFlags._isVNode) {
        childFlags = ChildrenFlags.SINGLE_VNODE
    } else {
        // 文本节点
        childFlags = ChildrenFlags.SINGLE_VNODE
        children = createTextNode(children + '')
    }
    return {
        tag,
        _isVNode: true,
        el:null,
        flags,
        data,
        children,
        childFlags
    }
}
function createTextNode(text) {
    return {
      _isVNode: true,
      flags: VNodeFlags.TEXT,
      tag: null,
      children: text,
      childFlags: ChildrenFlags.NO_CHILDREN
    }
}
// 拥有多个使用了key的 li 标签作为子节点的 ul 标签
function normalizeVNodes(children) {
    const newChildren = []
    for (let i = 0, len = children.length; i < len; i++) { 
        const child = children[i]
        if (child.key === null) {
            child.key = '|' + i
        }
        newChildren.push(child)
    }
    return newChildren
}

```
















