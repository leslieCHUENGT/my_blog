# vue响应式原型
##

在学习VUE3源码时，看到了一个深入浅出的关于VUE3响应式原型的小册子，[28｜响应式：万能的面试题，怎么手写响应式系统 (geekbang.org)](https://time.geekbang.org/column/article/470089)，有关于vue的底层实现又更深一步了解了，特做如下的复盘。

# 复盘内容目录

*   **vue3中响应式的重要性**
*   **jest(JavaScript 测试框架)的基本使用**
*   **实现手写一个min版响应式原型**

# vue3中响应式的重要性

*   什么是 Vue3 的响应式系统？

    Vue3 的响应式系统是一种数据绑定机制，它允许开发者在组件中使用响应式数据，以便在数据变化时更新视图。

*   Vue3 的响应式系统使用了什么技术？

    Vue3 的响应式系统使用了 ES6 中的 Proxy 对象，它可以拦截对对象属性的访问、赋值和删除操作，并且可以在这些操作发生时触发特定的行为。

*   Vue3 的响应式系统的优点是什么？

    Vue3 的响应式系统可以帮助开发者更加高效地编写代码，减少错误和 bug 的出现，并且可以帮助开发者构建更加灵活和可维护的代码。

*   Vue3 的响应式系统如何实现数据更新？

    当数据变化时，Vue3 的响应式系统会自动检测数据的变化，并且可以在需要时更新相关的视图。这样一来，开发者不需要手动编写大量的代码来完成数据的更新。

*   Vue3 的响应式系统如何帮助开发者构建可维护的代码？

    Vue3 的响应式系统可以让开发者轻松地组织和管理数据，并且可以让开发者在需要的时候快速地调整代码的结构和功能。这样一来，开发者可以更加方便地实现功能，并且可以更加容易地修改和扩展代码。

综上所述，Vue3 的响应式系统是该框架的一个非常重要的特性，它可以帮助开发者轻松地实现数据的管理和 UI 的更新，并且可以帮助开发者构建更加灵活和可维护的代码。

# min版响应式原型

## 简单的小例子

Vue 的响应式是可以独立在其他平台使用的。比如你可以新建 test.js，使用下面的代码在 node 环境中使用 Vue 响应。以 reactive 为例，我们使用 reactive 包裹 JavaScript 对象之后，**每一次对响应式对象 counter 的修改，都会执行 effect 内部注册的函数：**

```js
const {effect, reactive} = require('@vue/reactivity')

let dummy
const counter = reactive({ num1: 1, num2: 2 })
effect(() => {
  dummy = counter.num1 + counter.num2
  console.log(dummy)// 每次counter.num1修改都会打印日志
})
setInterval(()=>{
  counter.num1++
},1000)
```

执行 node test.js 之后，每次 count.value 修改之后都会执行effect 内部的函数。

## 流程图

我们先来看一下响应式整体的流程图，上面的代码中我们使用 reactive 把普通的 JavaScript 对象包裹成响应式数据了。所以，在 effect 中获取 counter.num1 和 counter.num2 的时候，就会触发 counter 的 get 拦截函数；get 函数，会把当前的 effect 函数注册到一个全局的依赖地图中去。这样 counter.num1 在修改的时候，就会触发 set 拦截函数，去依赖地图中找到注册的 effect 函数，然后执行。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc0ab5cf819c4e70b1074aa812963ffc~tplv-k3u1fbpfcp-watermark.image?)

## 测试文件目录
```
        ├──reactivity
            ├── __test___
                ├──reactive.spec.js
                ├──ref.spec.js
            ├──baseHandler.js
            ├──effect.js
            ├──reactive.js
            ├──ref.js
            ├──shared.js
```
## 用jest构建测试用例

### reactive.spec.js

```js
import { reactive } from '../reactive'
import { effect } from '../effect'
describe('虚拟DOM', () => {
    it('测试', () => {
        expect(1 + 2).toBe(3)
    })
    it('reactive 基本使用', () => {
        // expect(1 + 2).toBe(3)
        let obj = {num: 0, num1: 1}
        const ret = reactive(obj)
        const ret2 = reactive(obj)
        let val
        effect(() => {
            val = ret.num // 运行 依赖收集
        })
        expect(val).toBe(0)
        ret.num++
        expect(val).toBe(1)
    })
    test('一个reactive 对象的属性在多个effect中', () => {
        const ret = reactive({num: 0})
        let val, val2
        effect(() => {
            val = ret.num
        })
        effect(() => {
            val2 = ret.num
        })
        expect(val).toBe(0)
        expect(val2).toBe(0)
        ret.num++
        expect(val).toBe(1)
        expect(val2).toBe(1)
    })
    test('shallowReactive基本使用', () => {
        const ret = shallowReactive({num: 0})
        let val
        effect(() => {
            val = ret.num
        })
        expect(val).toBe(0)
        ret.num++
        expect(val).toBe(1)
    })
    test('shallowReactive浅层响应式', () => {
        const ret = shallowReactive({
            info: {
                price: 129,
                type: 'f2e'
            }
        })
        let price
        effect(() => {
            price = ret.info.price
        })
        expect(price).toBe(129)
        ret.info.price++
        expect(price).toBe(129)
    })
    it('reactive 嵌套', () => {
        const ret = reactive({
            info: {
                price: 129,
                type: 'f2e'
            }
        })
        let price
        effect(() => {
            price = ret.info.price
        })
        expect(price).toBe(129)
        ret.info.price++
        expect(price).toBe(130)
    })
})
```

### ref.spec.js

```js
import { effect } from '../effect'
import { ref } from '../ref'

describe('ref测试', () => {
    it('ref 基本使用', () => {
        const r = ref(0)
        let val
        effect(() => {
            val = r.value
        })
        expect(val).toBe(0)
        r.value++
        expect(val).toBe(1)
    })
    it('should make nested properties reactive', () => {
        const a = ref({
          count: 1
        })
        let dummy
        effect(() => {
          dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
      })
})
```

## reactive

```js
import { mutableHandlers,shallowReactiveHandlers } from './baseHandlers'
export const reactiveMap = new WeakMap()
export const shallowReactiveMap = new WeakMap()
export const reactiveMap = new WeakMap() // 定义一个reactive对象地图

export function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers)
}

function createReactiveObject(target, proxyMap, proxyHandlers) {
    if (typeof target !== 'object') {
        console.warn('reactive ${target} 必须是一个对象')
        return target
    }
    //在reactive对象地图中查找是否有target，防止重复注册同一个reactive对象
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }

    // 通过Proxy 创建代理，不同的Map存储不同类型的reactive依赖关系
    const proxy = new Proxy(target, proxyHandlers)
    proxyMap.set(target, proxy) // 把从未注册过的reactive对象放入reactive地图中
    return proxy // 返回的是一个一个Proxy实例对象
}
// 浅层的代理
export function shallowReactive(target) {
    return createReactiveObject(
        target,
        shallowReactiveMap,
        shallowReactiveHandlers
    )
}
```

梳理思路：

1.  此时通过reactive包裹的obj对象，返回的对象是一个Proxy实例对象。
2.  定义一个reactive地图，防止重复注册同一个reactive对象。

此时**const ret = reactive(obj)** 的任务基本完成了。因为返回的是一个Proxy实例对象，可以拦截属性的读取（`get`）和设置（`set`）行为，如果对Proxy不太了解，可以参考[Proxy - ECMAScript 6入门 (ruanyifeng.com)](https://es6.ruanyifeng.com/#docs/proxy)，所以我们在这个Proxy实例上重写其handler参数。

## baseHandlers

```js
    import {
        reactive, 
        reactiveMap, 
        shallowReactiveMap 
    } from './reactive'
    import { track, trigger } from './effect'
    import { isObject } from './shared'

    const get = createGetter() 
    const set = craeteSeter()
    const has = () => {}
    const deleteProperty = () => {}

    const shallowReactiveGet = createGetter(true)

    function createGetter(shallow = false) { //默认是深层代理
        return function get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)
            track(target, "get", key)  // 收集依赖
            if (isObject(res)) { // 处理嵌套的情况
                return shallow ? res : reactive(res)
            }
            return res
        }
    }

    function craeteSeter() {
        return function set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver)
            trigger(target, "set", key)
            return result
        }
    }
    //深层代理
    export const mutableHandlers = {
        get,
        set,
        has,
        deleteProperty
    }
    // 可以选择浅层代理
    export const shallowReactiveHandlers = {
        get: shallowReactiveGet,
        set,
        has,
        deleteProperty
    }
```

当触发了get和set拦截操作，我们再看看effect里是怎么处理track和trigger的。

依赖地图的格式，用代码描述如下：
```js
        targetMap = {
         target： {
           key1: [回调函数1，回调函数2],
           key2: [回调函数3，回调函数4],
         }  ,
          target1： {
           key3: [回调函数5]
         }  

        }
```
## effect

```js
    let activeEffect = null
    const targetMap = new WeakMap()
    export function effect(fn, options = {}) { 
        // effect嵌套，通过队列管理
        const effectFn = () => {
            try {
                activeEffect = effectFn
                //fn执行的时候，内部读取响应式数据的时候，就能在get配置里读取到activeEffect
                return fn()
            } finally {
                activeEffect = null 
            }
        }
        // 第二个参数options，传递lazy和scheduler来控制函数执行的时机
        if (!options.lazy) {
            /没有配置lazy 直接执行
            effectFn() // proxy实例对象发起拦截操作
        }
        effectFn.scheduler = options.scheduler // 调度时机 watchEffect会用到
        return effectFn
    }

    export function track(target, type, key) {
        let depsMap = targetMap.get(target) 
        if (!depsMap) { // 防止重复注册
            targetMap.set(target, (depsMap = new Map()))
        }
        let deps = depsMap.get(key)
        if (!deps) { // 防止重复注册
            deps = new Set() 
        }
        if (!deps.has(activeEffect) && activeEffect) { // 防止重复注册
            deps.add(activeEffect)
        }
        depsMap.set(key, deps)
    }

    export function trigger(target, type, key) {
        const depsMap =  targetMap.get(target)
        if (!depsMap) {
            return
        }
        const deps = depsMap.get(key)
        if (!deps) {
            return
        }
        deps.forEach((effectFn) => { // 挨个执行effect函数
            effectFn()
        })
    }
```

梳理思路：

1.为什么定义注册全局地图依赖是使用`WeakMap数据类型`呢？

因为，**它的键名所引用的对象都是弱引用**，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，**不用手动删除引用**。

2.effect 传递的函数，比如可以通过**传递 lazy 和 scheduler 来控制函数执行的时机**，默认是同步执行。scheduler 存在的意义就是我们可以手动控制函数执行的时机，方便应对一些性能优化的场景，比如数据在一次交互中可能会被修改很多次，我们**不想每次修改都重新执行依次 effect 函数，而是合并最终的状态之后，最后统一修改一次。**

3.track函数的作用就是把effect注册到依赖地图中，其中用Set数据类型存储effect，属于是一种**性能优化**，防止重复注册相同的effect。

4，trigger函数的作用就是把依赖地图中对应的effect函数数组`全部执行一遍`。

## ref

```js
    export function ref(val) {
      if (isRef(val)) {
        return val
      }
      return new RefImpl(val)
    }
    export function isRef(val) {
      return !!(val && val.__isRef)
    }

    // ref就是利用面向对象的getter和setters进行track和trigget
    class RefImpl {
      constructor(val) {
        this.__isRef = true
        this._val = convert(val)
      }
      get value() {
        track(this, 'value')
        return this._val
      }

      set value(val) {
        if (val !== this._val) {
          this._val = convert(val)
          trigger(this, 'value')
        }
      }
    }

    // ref也可以支持复杂数据结构
    function convert(val) {
      return isObject(val) ? reactive(val) : val
    }
```

梳理思路：

1.ref 的执行逻辑要比 reactive 要简单一些，`不需要使用 Proxy 代理语法`，直接使用对象语法的 getter 和 setter 配置，监听 value 属性即可。

2.ref 函数实现的相对简单很多，只是` 利用面向对象的 getter 和 setter  `拦截了 value 属性的读写，这也是为什么我们`需要操作 ref 对象的 value 属性`的原因。值得一提的是，ref 也可以包裹复杂的数据结构，` 内部会直接调用 reactive  `来实现，但是**需要去操作ref对象的value属性才能拿到复杂数据类型的值**。

3.此时我们对ref和reactive的理解又更加深刻了，**当ref包裹的是一个原始类型的值时，例如：null、0等，并没有用到Proxy代理**，直接用对象语法就可以完成监听。
