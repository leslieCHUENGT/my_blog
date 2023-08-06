在做项目的时候，我们经常会用到nextTick，简单的理解就是它就是一个setTimeout函数，将函数放到异步后去处理；将它替换成setTimeout好像也能跑起来，但它仅仅这么简单吗？那为什么我们不直接用setTimeout呢？让我们深入剖析一下。
# 异步更新

  我们发现上述两个问题的发生，不管子组件还是父组件，都是在给`data`中赋值后立马去查看数据导致的。由于“查看数据”这个动作是同步操作的，而且都是在赋值之后；因此我们猜测一下，给数据赋值操作是一个异步操作，并没有马上执行，Vue官网对数据操作是这么描述的：

> 可能你还没有注意到，Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

  也就是说我们在设置`this.msg = 'some thing'`的时候，Vue并没有马上去更新DOM数据，而是将这个操作放进一个队列中；如果我们重复执行的话，队列还会进行去重操作；等待**同一事件循环中**的所有数据变化完成之后，会将队列中的事件拿出来处理。

  这样做主要是为了提升性能，因为如果在主线程中更新DOM，循环100次就要更新100次DOM；但是如果等事件循环完成之后更新DOM，只需要更新1次。

  为了在数据更新操作之后操作DOM，我们可以在数据变化之后立即使用`Vue.nextTick(callback)`；这样回调函数会在DOM更新完成后被调用，就可以拿到最新的DOM元素了。

```js
复制代码
//第一个demo
this.msg = '我是测试文字'
this.$nextTick(()=>{
    //20
    console.log(document.querySelector('.msg').offsetHeight)
})
//第二个demo
this.childName = '我是子组件名字'
this.$nextTick(()=>{
    //子组件name：我是子组件名字
    this.$refs.child.showName()
})
```

# nextTick源码分析

  了解了nextTick的用法和原理之后，我们就来看一下Vue是怎么来实现这波“操作”的。

![opt.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/940028333bcf48ebb44fdb209a8454be~tplv-k3u1fbpfcp-zoom-1.image)

  Vue把nextTick的源码单独抽到一个文件中，`/src/core/util/next-tick.js`，删掉注释也就大概六七十行的样子，让我们逐段来分析。

```js
const callbacks = []
let pending = false
let timerFunc

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

  我们首先找到`nextTick`这个函数定义的地方，看看它具体做了什么操作；看到它在外层定义了三个变量，有一个变量看名字就很熟悉：callbacks，就是我们上面说的队列；在nextTick的外层定义变量就形成了一个闭包，所以我们每次调用$nextTick的过程其实就是在向callbacks新增回调函数的过程。

  callbacks新增回调函数后又执行了timerFunc函数，`pending`用来标识同一个时间只能执行一次。那么这个timerFunc函数是做什么用的呢，我们继续来看代码：

```js
export let isUsingMicroTask = false
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  //判断1：是否原生支持Promise
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  //判断2：是否原生支持MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

  这里出现了好几个`isNative`函数，这是用来判断所传参数是否在当前环境原生就支持；例如某些浏览器不支持Promise，虽然我们使用了垫片(polify)，但是isNative(Promise)还是会返回false。

  可以看出这边代码其实是做了四个判断，对当前环境进行不断的降级处理，尝试使用原生的`Promise.then`、`MutationObserver`和`setImmediate`，上述三个都不支持最后使用setTimeout；降级处理的目的都是将`flushCallbacks`函数放入微任务(判断1和判断2)或者宏任务(判断3和判断4)，等待下一次事件循环时来执行。`MutationObserver`是Html5的一个新特性，用来监听目标DOM结构是否改变，也就是代码中新建的textNode；如果改变了就执行MutationObserver构造函数中的回调函数，不过是它是在微任务中执行的。

  那么最终我们顺藤摸瓜找到了最终的大boss：flushCallbacks；nextTick不顾一切的要把它放入微任务或者宏任务中去执行，它究竟是何方神圣呢？让我们来一睹它的真容：

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

  本来以为有多复杂的flushCallbacks，居然不过短短的8行。它所做的事情也非常的简单，把callbacks数组复制一份，然后把callbacks置为空，最后把复制出来的数组中的每个函数依次执行一遍；所以它的作用仅仅是用来执行callbacks中的回调函数。

# 总结

  到这里，整体nextTick的代码都分析完毕了，总结一下它的流程就是：

1.  把回调函数放入callbacks等待执行
1.  将执行函数放到微任务或者宏任务中
1.  事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调

  再回到我们开头说的setTimeout，可以看出来nextTick是对setTimeout进行了多种兼容性的处理，宽泛的也可以理解为将回调函数放入setTimeout中执行；不过nextTick优先放入微任务执行，而setTimeout是宏任务，因此nextTick一般情况下总是先于setTimeout执行，我们可以在浏览器中尝试一下：

```js
javascript
复制代码
setTimeout(()=>{
    console.log(1)
}, 0)
this.$nextTick(()=>{
    console.log(2)
})
this.$nextTick(()=>{
    console.log(3)
})
//运行结果 2 3 1
```


  

