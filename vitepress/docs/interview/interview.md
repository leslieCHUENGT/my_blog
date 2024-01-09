# 记忆函数
```js
// 创建一个函数 memoize，接受一个函数作为参数
function memoize(func) {
  // 创建一个空对象 cache，用于存储计算结果,形成闭包
  const cache = {};
  // 返回一个新的函数，此处使用了 rest parameter 操作符 ...args，
  // 它可以让我们将传入的参数转换成一个数组
  return function(...args) {
    // 使用 JSON.stringify 将参数列表 args 转换成字符串，作为缓存对象 cache 的 key 值
    const key = JSON.stringify(args);
    // 如果缓存对象中存在该 key 值，则直接返回缓存值
    if (cache[key]) {
      console.log('从缓存中获取结果');
      return cache[key];
    } else {
      // 否则，执行原始函数，将结果存入缓存对象中，并返回结果
      console.log('进行计算');
      const result = func.apply(this, args);// 执行函数
      cache[key] = result;
      return result;
    }
  }
}

function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

console.time('fib(40)');
console.log(fib(40));
console.timeEnd('fib(40)');

const memoizedFib = memoize(fib);// 高阶函数

console.time('memoizedFib(40)');
console.log(memoizedFib(40));
console.timeEnd('memoizedFib(40)');

```

# 柯里化
## 手写curry函数
```javascript
// curry函数有两个参数:fn、...args
// 实现原理就是参数够了就返回fn(...args),里面的fn是不会传参数进去的
// 如果参数的个数不够就返回一个函数，这个函数还可以接收参数，所以参数是...moreArgs
// 返回curry函数，参数有fn、..args、...moreArgs
function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : (...moreArgs) =>
    curry(fn, ...args, ...moreArgs);
}
```
看看`chatGTP`是怎么理解的：
这里使用了一种常见的编程技巧——柯里化（currying）。柯里化是一种将接受多个参数的函数转换为一系列只接受单个参数的函数的技术。通过这种方式，我们可以更加灵活地创建和组合函数，使代码更易于理解和重用。
具体来说，`curry` 函数的实现基于以下思路：
-   如果已经传递了足够的参数，那么直接调用原始函数 `fn` 并返回结果。
-   如果还没有传递足够的参数，那么返回一个新函数，该函数接收更多的参数并将它们与之前的参数合并起来，然后递归调用 `curry` 函数直到所有参数都被传递完成。

## 为什么要柯里化？
- 将`大型函数分解`成更小、可组合的函数
```js
function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : (...moreArgs) =>
    curry(fn, ...args, ...moreArgs);
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

const addCurried = curry(add);
const multiplyCurried = curry(multiply);

const calc = addCurried(1)
  .then(multiplyCurried(2))
  .then(addCurried(3))
  .then(multiplyCurried(4));

console.log(calc(5)); // 48
```
- 使得`参数复用`
```js
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1, 2, 3)); // 6

const partialAdd = curriedAdd(1);
console.log(partialAdd(2, 3)); // 6
console.log(partialAdd(4, 5)); // 20
```
- `延迟执行`
```javascript
function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : (...moreArgs) =>
    curry(fn, ...args, ...moreArgs);
}

const addCurried = curry((x, y) => x + y);

const addFive = addCurried(5); // 返回一个接受一个数字参数的新函数

console.log(addFive(10)); // 15
console.log(addFive(20)); // 25
console.log(addFive(30)); // 35
```
# compose函数
## 手写compose函数
```javascript
function compose(...fn) {
  // 如果没有传入任何函数，则直接返回一个恒等函数。
  if (!fn.length) return (v) => v;
  
  // 如果传入的只有一个函数，则直接返回它本身。
  if (fn.length === 1) return fn[0];// 这里为什么是数组?因为传入的参数用了...fn来代替，所以fn有多项
  
  // 使用 reduce 函数将多个函数组合起来。
  return fn.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
}
// 用法如下:
function fn1(x) {
  console.log("1")
  return x + 1;
}
function fn2(x) {
  console.log("2")
  return x + 2;
}
function fn3(x) {
  console.log("3")
  return x + 3;
}
function fn4(x) {
  console.log("4")
  return x + 4;
}
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 4 3 2 1 11

```

(pre, cur)：表示这是一个接受两个参数的函数，其中 pre 表示先前组合好的函数，cur 表示当前待组合的函数。

(...args) =>：表示这是一个接受任意数量参数的函数，即它使用了展开运算符 ... 来将传入的参数列表转化为一个数组 args。

pre(cur(...args))：表示先调用 cur 函数，并将参数列表 args 作为其输入参数。然后，将 cur 函数执行的结果作为参数传递给先前组合好的函数 pre，以此实现函数的组合。

简单来说，这一行代码实现了将``两个函数进行组合``的逻辑。它接受`两个函数`作为`参数`，其中第一个函数是已经组合好的函数，第二个函数是待组合的函数。然后，它返回一个新的函数，`该函数接受任意数量的参数`，并依次将这些参数传递给当前待组合的函数和先前组合好的函数。最终得到的结果就是所有组合函数的结果。

需要注意的是，这里使用了箭头函数的嵌套，使得代码更加紧凑并且易于理解。
## compose函数的作用
`compose` 函数的作用是将多个函数组合成一个函数，并返回这个新的函数。组合后的函数可以从右向左依次执行传入的所有函数，每个函数的返回值作为下一个函数的参数，最终得到一个最终结果。

使用 `compose` 函数可以简化函数嵌套的过程，提高代码的可读性和可维护性。例如，在 React 中使用 Redux 的时候，我们通常需要对一些组件进行多层嵌套的数据处理和状态管理操作，这个过程中可能会涉及到多个函数的调用和组合，使用 `compose` 函数可以更加方便地完成这些操作。

# 防抖节流
## 手写防抖节流
```js
// 防抖
function debounce(fn, delay = 500) {
  let timer = null; // 定义定时器变量
  return function (...args) {
    clearTimeout(timer); // 清除之前的定时器
    timer = setTimeout(() => {
      fn.apply(this, args); // 延迟执行传入的函数
      timer = null; // 清空定时器
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
    console.log(111);
  }, 1000)
);

// 节流
function throttle(fn, delay) {
  let timer = null; // 定义定时器变量
  return function (...args) {
    if (!timer) { // 如果定时器不存在
      timer = setTimeout(() => {
        fn.apply(this, args); // 执行传入的函数
        timer = null; // 清空定时器
      }, delay);
    }
  };
}

function throttle(fn, delay) {
  let lastTime = 0;
  
  return function (...args) {
    const now = Date.now();// 时间戳实现重要的函数调用：Date.now(),使用lastTime进行闭包
    
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;// 更新时间戳
    }
  }
}
// 升级版：最后一次按时执行
function throttled(fn, delay) {
  let timer = null;
  let startTime = Date.now();
  return function(...args) {
    let currentTime = Date.now();
    let remainingTime = currentTime - startTime;
    // 清除在规定时间内定时器
    clearTimeout(timer);
    if(remainingTime >= delay) {
      fn.apply(this, args);
      // 更新startTime时间
      startTime = Date.now();
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  }
}

window.addEventListener(
  "scroll",
  throttle(() => {
    console.log(111);
  }, 1000)
);
```
## 区别防抖节流
看看`chatGTP`是怎么解释的：

- 防抖（debounce）的原理是在函数被连续调用时，只有等待一定时间间隔后才会执行最后一次调用的结果。比如说，在用户不断输入搜索关键字的情况下，我们可以使用防抖来限制发送请求的频率，只有用户`停止输入一段时间后才会真正地执行搜索操作`。
- 节流（throttle）的原理是在函数被连续调用时，只有在一定时间间隔内执行第一次调用的结果，忽略接下来的调用。比如说，在用户频繁滚动页面的情况下，我们可以使用节流来限制触发回调函数的频率，`只有在一定时间间隔内执行一次回调函数`。

# instanceof
## 手写 instanceof

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9be25629d9064fa691d08a8d5be2e073~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=611&h=760&s=184821&e=png&b=fefefe)
- 对象只有隐式原型（__proto__），指向构造函数的`prototype`
- 构造函数有隐式原型和显式原型
  - 隐式原型是`Function.prototype`,所以有`function Function()`为其`构造函数`，`function Function()`的隐式原型和显式原型都是`Function.prototype`.
  - 显式原型是构造函数的`prototype`，而`prototype`是对象，只有隐式原型，指向`object.prototype`,而`object.prototype`最后其隐式原型只能指向`null`
- `Function.prototype`是对象，所以其只有隐式原型，指向`object.prototype`
- 所有的函数的隐式原型都是`Function.prototype`
```js
function myInstanceOf(object, constructor) {
  let prototype = Object.getPrototypeOf(object);
  while (prototype !== null) {
    if (prototype === constructor.prototype) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}

```
`Object.getPrototypeOf()`和`Object.setPrototypeOf()`方法是从 ECMAScript 2015（`ES6`）开始引入的，因此在2015年之前的 JavaScript 版本中并不存在这两个方法。
在早期的 JavaScript 版本中，可以使用`Object.prototype.__proto__`属性来访问一个对象的原型，但是这个方法不被推荐使用，因为它是非标准的扩展。
随着标准的发展和浏览器的更新，现代 JavaScript 引擎已经支持了这两个方法，因此建议使用它们来获取和设置对象的原型。同时，`由于这两个方法具有更好的兼容性和稳定性，也更易读、易维护`，因此在编写新代码时应该优先考虑使用它们。
虽然`__proto__`属性可以用来获取一个对象的原型，但是在现代 JavaScript 中已经不推荐使用它了。
这是因为`__proto__`属性是非标准的，且可能会导致一些问题。
相反，可以使用`Object.getPrototypeOf()`方法来获取一个对象的原型。这个方法是标准的，并且更可靠和可移植。

## 细节

在实现 `instanceof` 的时候，最快的方法是使用 JavaScript 原生的 `instanceof` 运算符，这是因为原生的 `instanceof` 在底层进行了优化，可以直接访问对象的内部数据结构，比手写代码要快得多。

如果你一定要自己实现一个比较高效的 `instanceof`，可以考虑使用 `Object.prototype.isPrototypeOf()` 方法来代替递归遍历原型链。例如：

```js
function myInstanceOf(obj, constructor) {
  return constructor.prototype.isPrototypeOf(obj);
}
```

这个实现方式利用了 `isPrototypeOf()` 的底层优化，可以更快地判断一个对象是否是另一个对象的实例。

# 数组扁平化(flatter)

```js
// 这样处理的话，可以保证 pre是已经受处理的
function flatter(arr) {
  if (!arr.length) return [];// 完全是为了首次进去直接结束
  return arr.reduce(
    (pre, cur) =>
      Array.isArray(cur) ? [...pre, ...flatter(cur)] : [...pre, cur],
    [] //初始值是空数组
  );
}

// 避免创建新的调用帧，直接复用当前的调用帧，类似于循环的效果。
// 使得在递归调用后不需要执行其他操作，直接返回递归调用的结果。
function flatten(arr, res = []) {
  arr.forEach((item) => {
    if(Array.isArray(item)){
      flatten(item, res);
    }else{
      res.push(item);
    }
  })
  return res;
}

let arr = [1, [2, [3, 4], 5], 6];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]

// toString()方法会剔除[],变成字符串
[[1,[2]],3].toString() //'1, 2, 3'
  .split(',')           //['1', '2', '3']
    .map(x => Number(x))  //[1, 2, 3]
```
# new
## new 操作符
- 创建一个空对象。
- 将这个空对象的原型设置为构造函数的原型。
- 将构造函数中的 this 绑定到这个新对象上,方便后续可以调用自己这个新对象的属性。
- 执行构造函数中的代码，初始化这个新对象。
- 返回这个新对象。
```javascript
function myNew(constructor, ...args) {
  // 创建一个空对象，并将它的原型指向构造函数的 prototype 属性
  // 它的作用是以指定对象为原型创建一个新的对象，新对象会继承原型对象的所有属性和方法
  const obj = Object.create(constructor.prototype);
  // 调用构造函数，并将 this 绑定到新创建的对象上
  const result = constructor.apply(obj, args);
  // 如果构造函数返回了一个对象，则直接返回该对象；否则返回新创建的对象
  return (typeof result === 'object' && result !== null) ? result : obj;
} 

function Object.create(property) {
  if(typeof property !== 'object' || property === null){
    throw new TypeError();
  }
  // 定义构造函数
  function F(){};
  F.prototype = property;
  return new F();
};

const person = myNew(Person, 'John', 30);
```
# 订阅发布者模式

##  JavaScript 发布-订阅模式的实现，包含 on、emit、once、off 四个方法

```js
class EventEmitter {
  constructor() {
    // 存储事件及其对应的回调函数
    this.events = new Map();
  }

  // 绑定事件和回调函数
  on(event, callback) {
    // 获取事件的回调函数列表
    let callbacks = this.events.get(event);
    
    // 如果回调函数列表不存在，则创建一个新的回调函数列表
    if (!callbacks) {
      callbacks = [];
      this.events.set(event, callbacks);
    }

    // 将回调函数添加到回调函数列表中
    callbacks.push(callback);
  }

  // 触发事件，执行回调函数
  emit(event, ...args) {
    // 获取事件的回调函数列表
    const callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则不执行任何操作
    if (!callbacks) {
      return;
    }

    // 执行回调函数列表中的所有回调函数，并传入参数
    callbacks.forEach((callback) => {
      callback.apply(this, ...args);
    });
  }

  // 绑定事件和回调函数，只执行一次
  once(event, callback) {
    // 定义一个新的回调函数，它会在执行一次后被自动移除
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(event, wrapper);
    };

    // 将新的回调函数添加到回调函数列表中，那么调用的时候就只会进行一次
    this.on(event, wrapper);
  }

  // 移除事件的所有回调函数，或指定的回调函数
  off(event, callback) {
    // 获取事件的回调函数列表
    const callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则不执行任何操作
    if (!callbacks) {
      return;
    }

    // 如果没有指定回调函数，则移除事件的所有回调函数
    if (!callback) {
      this.events.delete(event);
      return;
    }

    // 移除指定的回调函数
    const index = callbacks.indexOf(callback);// 找到索引值，然后调用splice方法
    if (index !== -1) {
      callbacks.splice(index, 1);// 执行结果的返回值是被删除的元素,会改变原数组
    }
  }
}

// 使用如下
const event = new EventEmitter();

const handle = (...rest) => {
  console.log(rest);
};

event.on("click", handle);

event.emit("click", 1, 2, 3, 4);

event.off("click", handle);

event.emit("click", 1, 2);

event.once("dbClick", () => {
  console.log(123456);
});
event.emit("dbClick");
event.emit("dbClick");

```

# 观察者模式和发布订阅者模式
观察者模式和发布订阅者模式都是常见的用于处理对象间通信的设计模式，它们有一些相似之处，但也有一些区别。

观察者模式中，`主题维护一个观察者列表`，并提供添加和删除观察者的方法，同时还提供一个通知方法，用于在`主题状态更改时通知所有的观察者`。观察者则实现了一个更新方法，用于在接收到主题通知时更新自己的状态。这种模式`强调的是主题与观察者之间的一对多关系`，而且`观察者是直接依赖于主题的`。

发布订阅模式中，发布者和订阅者之间`没有直接的联系`，而是通过`消息代理`来进行`通信`。发布者将`消息发送给一个或多个主题`（topic），而订阅者则`监听`这些主题，并在`接收到`消息时`做出反应`。这种模式强调的是`通过主题/消息代理`来`解耦`发布者和订阅者之间的关系。

因此，两种模式的主要区别在于：

观察者模式中，观察者`直接依赖于主题`；而发布订阅模式中，发布者和订阅者之间`没有直接的依赖关系`，而是`依赖于主题/消息代理`。
观察者模式中，主题状态变化时会`直接通知所有的观察者`；而发布订阅模式中，发布者`只需将消息发送给相应主题`，然后由`主题/消息代理`来`通知`所有订阅该主题的订阅者。
总之，两种模式都可以用于对象间通信，具体使用哪种取决于实际情况和开发者的个人喜好。观察者模式通常适用于一些比较简单的场景，而发布订阅模式则更适用于一些复杂的场景，特别是在分布式系统中。

## 面试回答观察者模式和发布订阅者模式
- 发布订阅模式强调的是`通过消息代理`来`解耦`发布者和订阅者之间的`关系`，他们两个`没有直接的关系`，通过`接受消息`来`作出反应`
- 在一个Vue应用程序中，我们可能有一个名为 store 的可观察对象，其中包含了整个应用程序的状态。每当某个组件想要修改这个状态时，它只需要通过调用` store 对象`上的方法来实现。而其他`订阅了 store 对象的组件`则会在 `store 对象发生改变`时`自动更新`。
- 订阅发布者模式（也称为事件驱动、消息机制或观察者模式）是一种`特殊的观察者模式`。
- 观察者模式中，状态变化时会`直接通知所有的观察者`

# 观察者模式

```js
// 定义主题对象
function Subject() {
  this.observers = []; // 观察者列表
}

Subject.prototype = {
  // 添加观察者
  addObserver: function(observer) {
    this.observers.push(observer);
  },
  
  // 删除观察者
  removeObserver: function(observer) {
    var index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  },

  // 通知所有观察者
  notifyObservers: function(data) {
    for(var i = 0; i < this.observers.length; i++) {
      this.observers[i].update(data);
    }
  }
};

// 定义观察者对象
function Observer(name) {
  this.name = name;
}

Observer.prototype = {
  // 接收到主题通知后更新自己的状态
  update: function(data) {
    console.log(this.name + ' received: ' + data);
  }
};

// 创建主题对象和观察者对象
var subject = new Subject();
var observer1 = new Observer('Observer1');
var observer2 = new Observer('Observer2');

// 注册观察者到主题对象中
subject.addObserver(observer1);
subject.addObserver(observer2);

// 发送消息通知所有观察者
subject.notifyObservers('Hello World!');

```

# 单例模式
- 单例模式是一种设计模式，用于确保一个类只有一个实例，并提供全局访问该实例的方法。这个模式常常被用来管理系统中`某个独特的资源`，例如数据库连接、日志记录器等。
- 现在很多第三方库都是单例模式，多次引用只会使用同一个对象，如`jquery`、`lodash`、`moment`
```js
// 定义一个类
function Singleton(name) {
    this.name = name;
    this.instance = null;
}
// 原型扩展类的一个方法getName()
Singleton.prototype.getName = function() {
    console.log(this.name)
};
// 获取类的实例
Singleton.getInstance = function(name) {
    if(!this.instance) {
        this.instance = new Singleton(name);
    }
    return this.instance
};

// 获取对象1
const a = Singleton.getInstance('a');
// 获取对象2
const b = Singleton.getInstance('b');
// 进行比较
console.log(a === b);
```

# 快速排序

## 简单版本
```javascript
function quickSort(arr) {
  // 如果数组长度小于等于1，则直接返回该数组
  if (arr.length <= 1) {
    return arr;
  }

  // 选择一个基准值（pivot），通常为中间元素
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];

  // 将小于基准值的元素放在left数组中，将大于基准值的元素放在right数组中
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) {
      continue; // 跳过基准值
    }
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // 分别对left和right数组进行递归排序，并将它们和基准值合并成一个新数组
  return quickSort(left).concat(pivot, quickSort(right));
}

// 测试用例
const arr = [3, 5, 1, 6, 4, 7, 2];
console.log(quickSort(arr)); // [1, 2, 3, 4, 5, 6, 7]

```

## 三路快排法

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) { // 如果左指针不小于右指针，则直接返回
    return;
  }
  
  let lessThan = left; // 小于基准值的区间右端点
  let greaterThan = right; // 大于基准值的区间左端点
  let i = left + 1; // 当前处理的元素

  const pivot = arr[left]; // 选择第一个元素为基准值

  while (i <= greaterThan) {
    console.log(arr);
    if (arr[i] < pivot) {
      swap(arr, i, lessThan); // 将当前元素与小于基准值的区间的下一个元素交换，并将小于基准值的区间右移一位
      i++;
      lessThan++;
    } else if (arr[i] > pivot) {
      swap(arr, i, greaterThan); // 将当前元素与大于基准值的区间的前一个元素交换，并将大于基准值的区间左移一位
      greaterThan--;
    } else {
      i++; // 如果等于基准值，则直接继续处理下一个元素
    }
  }

  quickSort(arr, left, lessThan - 1); // 对小于基准值的区间继续递归进行快排
  quickSort(arr, greaterThan + 1, right); // 对大于基准值的区间继续递归进行快排
}

function swap(arr, i, j) { // 交换数组中两个元素的位置
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// 测试用例
const arr = [3, 5, 1, 6, 4, 7, 2];
quickSort(arr);
console.log(arr); // [1, 2, 3, 4, 5, 6, 7]

```


# 单例模式
一个经典的单例模式的例子是应用程序中的日志记录器。在一个应用程序中，通常会有多个模块或组件需要记录日志，如果每个模块都自己创建一个日志记录器实例，不仅会浪费系统资源，而且还会导致日志信息的管理和维护变得困难。

因此，可以使用单例模式来创建一个全局唯一的日志记录器实例，并提供一个全局访问点来获取该实例。这样，所有的模块都可以共享这个唯一的日志记录器实例，从而实现更加高效和统一的日志记录。

下面是一个简单的日志记录器示例代码：

```javascript
class Logger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.logs.push({ message, timestamp });
    console.log(`${timestamp} - ${message}`);
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}



// 在其他模块中使用Logger
const logger = Logger.getInstance();
logger.log('Hello World!');
```

在上面的代码中，我们定义了一个`Logger`类，它有一个`logs`属性用于记录日志信息，以及一个`log()`方法用于向控制台输出日志信息。同时，我们也定义了一个静态的`getInstance()`方法，该方法负责创建Logger的唯一实例，并提供一个全局访问点`Logger.getInstance()`来获取该实例。

在其他模块中，我们可以通过调用`Logger.getInstance()`方法来获取Logger的唯一实例，并使用其`log()`方法来记录日志信息。由于Logger实例是全局唯一的，因此所有的模块都可以共享这个唯一的实例，从而实现更加高效和统一的日志记录。


# Object.keys
const keys = Object.keys(obj);// 获取obj的key，生成数组

# 深拷贝的几种方法
- 考虑数组里的元素都是原始数据类型，那么实际上就可以用api来完成深拷贝
  - 展开运算符
  - map
  - from
  - filter
- 利用JSON.parse(JSON.stringify(obj)但是不能处理函数和正则
- 考虑数组，递归遍历包含深层次的对象
```javascript
function clone(target){
  if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== "object") return obj;
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    for(const key in target){
      cloneTarget[key] = clone(target[key]);
    }
  }
}
```
- 考虑循环引用
```js
target.target = target;// 自己添加自己属性，克隆时会爆栈
```
- 可以同WeekMap来记录有没有克隆过这个对象
- WeakMap的话，key和value存在的就是**弱引用关系**，当下一次垃圾回收机制执行时，这块内存就会被释放掉。
- 还可以通过用while循环来优化遍历花费的时间
- 深拷贝一个函数可以使用`Function.prototype.toString()`方法将函数转化为字符串，再使用`eval()`或者new Function()构造函数来创建一个新的函数。

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj; // 如果是null我就不进行拷贝操作
  // if (obj instanceof Date) return new Date(obj);
  // if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== "object") return obj;
  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

# js判断类型的方法
```javascript
function getType(value) {
  const type = typeof value;

  if (type !== 'object' || value === null) {
    return type;
  }
  
  // 获取对象类型
  const classType = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

  return classType;
}
```
- typeof来判断是否是对象还是原始数据类型
  - 需要区分一下null和object
  - 可以识别简单数据类型和function
- Object.prototype.toString.call().sclice(8,-1).toLowerCase()
  - 可以处理各种数据类型
- instanceof来在原型上查找是否是该对象的实例

```js
console.log(typeof "hello");   // 输出: "string"
console.log(typeof 42);        // 输出: "number"
console.log(typeof true);      // 输出: "boolean"
console.log(typeof {});        // 输出: "object"
console.log(typeof []);        // 输出: "object"
console.log(typeof null);      // 输出: "object"
console.log(typeof undefined); // 输出: "undefined"
console.log(typeof function(){}); // 输出: "function"

console.log(Object.prototype.toString.call(NaN));         // [object Number]
console.log(Object.prototype.toString.call(Infinity));    // [object Number]
console.log(Object.prototype.toString.call(-Infinity));   // [object Number]
```

# call、apply、bind
- B.call (A, args1,args2)
  - 调用一个对象的一个方法，用另一个对象替换当前对象。
  - 可以传递多个参数数组
- B.apply(A, arguments)
  - 只可以传递一个参数数组
- bind的返回值是函数，参数和call一样可以传递参数数组


# 判断空对象的方法
- object上没有length属性，length是一个数组或者类数组内置的属性
- Object.keys()可以获取obj所有的key的值，返回一个数组
```js
if(Object.keys(obj).length === 0){
  // 对象为空
}
```
- 利用for in遍历一下对象，能遍历就能进去
```js
let isEmpty = true;
for(let key in obj){
  isEmpty = false;
  break;
}
if(isEmpty){
  // 对象为空
}
```
- JSON.stringify()来把对象转化为字符串，进行判断即可
```js
if(JSON.stringify(obj) === '{}'){
  // 对象为空
}
```

# for in、for of的区别
- for in 遍历的是索引**index**    
- for of 遍历的是元素值**value**    

- for in适合遍历对象，也可以遍历数组，但是遍历数组的时候会遍历原型上自定义的方法和属性，并且有个问题是，这个索引index值是string类型的，不是number，可以用**hasOwnProperty**方法来判断一下是不是非对象自身的属性或者方法
代码如下：
```js
var arr = [1,2,3]
Array.prototype.a = 123
Array.prototype.fn = function name(params) {
    
}
Array.prototype.Fn = () => {}
for (let index in arr) {
  let res = arr[index]
  console.log(res)
}
// 1 2 3 123 
// ƒ name(params) {
    
// }
// () => {}

var obj = {a:1, b:2, c:3}
    
for (let key in obj) {
  console.log(obj[key])
}
// 1 2 3
```
- for of适合遍历拥有Iterator的集合，因为遍历的是元素值，不会遍历原型上的属性和方法，如果想用for of遍历对象，用Object.keys()方法获取key值数组来遍历
```js
var myObject={
　　a:1,
　　b:2,
　　c:3
}
for (var key of Object.keys(myObject)) {
  console.log(key + ": " + myObject[key]);
}
//a:1 b:2 c:3

const str = 'string';
for(let v of str){
    console.log(v)
}
// s t r i n g
```

# 原生具备 Iterator 接口的数据结构如下
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

# null和undefined的区别
- 当定义一个变量的时候，设置为空值就会一般会赋值为null，没有赋值就为undefined

# promiseRetry
```javascript
// promise.retry
// 简单来说就是执行fn
// 递归判断，注意细节
const promiseRetry = (fn, retries = 3, delay = 1000) => {
    return new Promise((resolve, reject) => { 
        fn()
            .then(resolve)
            .catch((err) => {
                if (retries === 0) {
                    reject(err);
                } else {
                    setTimeout(() => {
                        // 必须.then(),否则无法得到上一次的结果
                        promiseRetries(fn, retries - 1, delay).then()
                    },delay);
                }
            })
    })
}
```  
# promise
```javascript
// 定义一个用于上传图片的函数
function uploadImage(image) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload');
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error('上传失败'));
      }
    };
    xhr.onerror = () => {
      reject(new Error('上传失败'));
    };
    xhr.send(image);
  });
}

// 定义一个异步函数用于上传图片
async function asyncUploadImages(images) {
  const groups = [];
  for (let i = 0; i < images.length; i += 3) {
    groups.push(images.slice(i, i + 3));
  }
  const results = [];
  for async (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const promises = group.map(image => uploadImage(image));
    const res = await Promise.all(promises);
    results.push(res);
  }
  return results;
}

// 调用函数上传图片
const images = [image1, image2, image3, ... , image10];
asyncUploadImages(images)
  .then(results => {
    console.log('所有图片上传成功', results);
  })
  .catch(error => {
    console.error('上传图片失败', error);
});
```

# 快速排序
```javascript
const quickSort = (arr) => {
  if(arr.length <= 1) return arr;
  // 取基准点
  const pivot = arr[0];
  const left = [];// 存放比基准值小的数组
  const right = [];// 存放比基准值大的数组
  // 遍历数组，进行判断分配
  for(let i = 0;i < arr.length;i++){
    if(arr[i] < pivot){
      left.push(arr[i]);
    }else{
      right(arr[i]);
    }
  }
  // 递归执行以上操作
  return [...quickSort(left),pivot,...quickSort(right)]
}

```
# 归并排序
```js
// 分治思想
const mergeSort = (arr) => {
  if(arr.length <= 1) return arr;
  // 将数组平分
  const middle = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, middle);// 切下0到middle的下标的元素
  const rightArr = arr.slice(middle);// 保留了middle下标后面的元素
  const sortedLeftArr = megeSort(leftArr);
  const sortedRightArr = megeSort(rightArr);
  return merge(sortedLeftArr, sortedRightArr);
}
// 合并两个已经排序的数组
const merge = (leftArr, rightArr){
  const result = [];
  // 比较两个数组元素，将小的元素添加到结果数组中
  while(leftArr.length && rightArr,length){
    if(left[0] < right[0]){
      result.push(leftArr.shift());
    }else{
      result.push(rightArr.shift());
    }
  }
  // 如果有剩余,加到后面去就是了
  while (leftArr.length) {
    result.push(leftArr.shift());
  }
  while (rightArr.length) {
    result.push(rightArr.shift());
  }
}
```
# 尾递归优化
- 在进行递归调用时，在尾部进行调用自身函数，不带其他的任何参数
- 也就是单有函数本身，不能乘除加减，否则就会开辟内存来分配
```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // O(n)

// 尾递归优化
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // O(1)

// 斐波那契数列
// 递归
function fn(n){
  if(n <= 1) return n;
  return fn(n - 1) + fn(n - 2);
}
// 尾递归优化
function fn(n, start = 1, total = 1) {
  if(n <= 2) return total;
  return fn(n - 1, total, total + start);
}
// 迭代
function fn(n){
  // 迭代法，前两项不必
  if(n === 0) return 0;
  if(n === 1) return 1;

  let prev = 0,curr = 0;
  for(let i = 2; i < n; i++){
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
// 数组扁平化,尾递归优化
function flatten(arr = [], res = []) {
  arr.forEach((v)=>{
    if(Array.isArray(v)){
      res = [...res, ...flatten(v, [])];
    }else{
      res.push(v)
    }
  })
  return res;
}
// 将一个对象的所有属性改为小写
function converKeysToLowerCase(obj){
  // 创建新对象来存放
  const newObj = {};
  // Object.keys(obj)拿到的是属性组成的数组，便于遍历
  Object.keys(obj).forEach((key)=>{
    const value = obj[key];
    const newKey = key.toLowerCase();
    const newValue = typeof value === 'object' ? converKeysToLowerCase(value) : value;
    newObj[newKey] = newValue;
  })
  return newObj;
}

```

# 分割URL参数
```javascript
// https://www.example.com/search?query=JavaScript&sort=desc&page=2
function splitUrlParams(url, res){
  // 分割的第二个
  let params = url.split('?')[1];
  if(!params) return;

  params.spilt('&').forEach((items)=>{
    let item = items.split('=');
    let paramsName = decodeURIComponent(item[0]);
    let paramsValue = decodeURIComponent(item[1]);
    if(paramsName === res){
      return paramsValue;
    }
  })
}

```

# 合并对象
```js
// 传进来的是对象数组
const mergeObject = (...agrs) => {
  let mergeObj = {};
  args.forEach((item) => {
    for(const v in item){
      if(item.hasOwnProperty(v)){
        mergeObj[v] = item[v];
      }
    }
  })
  return mergeObj;
}
```

# [1, 2, 3].map(parseInt)
- parseInt
  - 要被解析的值。如果参数不是一个字符串，则将其转换为字符串
  - 从 2 到 36 的整数，表示进制的基数。例如指定 16 表示被解析值是十六进制数。如果超出这个范围，将返回 NaN。假如指定 0 或未指定，基数将会根据字符串的值进行推算。
- parseInt(1,0) 1
- parseInt(2,1) NaN
- parseInt(3,2) NaN

# map
```js
const words = ['foo', 'bar', 'baz'];
// map的回调函数有三个参数：当前元素、当前索引和数组本身
const result = words.map(function(item, index, arr) {
  return item.toString().substring(0, 2);
});

console.log(result); // 输出 ["fo", "ba", "ba"]

const person = {
  name: 'Alice',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

const people = [
  {name: 'Bob'},
  {name: 'Charlie'},
  {name: 'Dave'}
];

// 使用 map 方法调用 person.greet，回调函数后还有一个thisArgs，保证指向
people.map(person.greet, person);
// 输出 "Hello, my name is Alice" 三次
```


# 反转链表
```js
// 迭代
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next; // 记录当前节点的下一个节点
    curr.next = prev; // 将当前节点的 next 属性指向上一个节点
    prev = curr; // 更新上一个节点为当前节点
    curr = next; // 更新当前节点为下一个节点
  }
  return prev;
}
// 递归
function reverseList(head) {
  if (head === null || head.next === null) {
    return head; // 处理边界情况：链表为空或只有一个节点
  }
  const tail = reverseList(head.next); // 递归反转剩余部分
  head.next.next = head; // 将当前节点的下一个节点的 next 属性指向当前节点
  head.next = null; // 将当前节点的 next 属性设为 null
  return tail; // 返回反转后的新链表的尾节点
}
```
# 大数相加

```javascript
function addStrings(num1, num2) {
  let i = num1.length - 1; // 初始化指向 num1 的末位的指针 i
  let j = num2.length - 1; // 初始化指向 num2 的末位的指针 j
  let carry = 0; // 初始化进位为 0
  let result = ''; // 初始化结果字符串为空字符串
  while (i >= 0 || j >= 0 || carry !== 0) { // 当还有数字或者存在进位时，继续执行循环
    // parseInt() 函数来将字符串转换为数字
    const digit1 = i >= 0 ? parseInt(num1[i]) : 0; // 取出 num1 当前位上的数字，如果越界了就用 0 补齐
    const digit2 = j >= 0 ? parseInt(num2[j]) : 0; // 取出 num2 当前位上的数字，如果越界了就用 0 补齐
    const sum = digit1 + digit2 + carry; // 计算当前位上的数字和
    result = (sum % 10).toString() + result; // 将该位上的数字插入到结果字符串的最前面
    carry = Math.floor(sum / 10); // 计算进位
    i--; // 将指针 i 向前移动一位
    j--; // 将指针 j 向前移动一位
  }
  return result; // 返回结果字符串
}
```

# 合并升序数组
[面试题 10.01. 合并排序的数组 - 力扣（LeetCode）](https://leetcode.cn/problems/sorted-merge-lcci/)
- 思路
  - 数组A和数组B的长度进行思考
  - n = m
  - n > m
    - 此时说明留下的都是更小的，没必要进行遍历了
  - n < m
    - 则需要循环将数组B加到数组A里去
```js
const merge = (A, n, B, m) => {
  // 定义索引指针
  let i = n - 1;
  let j = m - 1;
  let k = m + n - 1;

  // 循环处理情况1、2
  while(i >= 0 && j >= 0){
    if(A[i] > B[j]){
      A[k] = A[i];
      i--;
    }else{
      A[k] = B[j];
      j--;
    }
    k--;
  }
  // 处理情况3
  while(j >= 0){
    A[k] = B[j];
    j--;
    k--;
  }
  return A;
}
```
# 合并有序链表
## 迭代法
- 考虑链表1和链表2长度问题
- 情况1
  - 构造循环，条件是l&&2
  - 新的头结点.next的指定
  - 谁小指谁
- 情况2、3
  - 接上去就行
```js
const merge = (l1, l2) => {
  // 创建虚拟头结点，便于返回头结点
  let prehead = new ListNode(0);
  let prev = prehead;
  // 迭代,处理情况1
  while(l1 && l2){
    if(l1.val < l2.val){
      prev.next = l1;
      l1 = l1.next;
    }else{
      prev.next = l2.next;
      l2 = l2.next;
    }
    // 指向下一个
    prev = prev.next
  }
  // 处理情况2、3
  prev.next = l1 === null ? l1 : l2 
  return prehead.next;
}
```
# 给定目录路径,聚合成树形结构
```js
const paths = [
  'root/a',
  'root/b/c/d',
  'root/a/e/f'
];
const tree = buildTree(paths);
console.log(JSON.stringify(tree, null, 2));
{
  "name": "root",
  "children": [
    {
      "name": "a",
      "children": [
        {
          "name": "e",
          "children": [
            {
              "name": "f",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "b",
      "children": [
        {
          "name": "c",
          "children": [
            {
              "name": "d",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

function buildTree(paths) {
  // 创建根节点，包含一个空的 children 数组
  const root = { name: 'root', children: [] };
  for (const path of paths) {
    // 将路径按照 '/' 分隔成多个部分
    const partsList = path.split('/');
    //  ['root', 'a', 'b', 'c']
    let node = root; // 从根节点开始遍历
    for (const part of partsList) {
      let child = node.children.find(c => c.name === part); // 查找当前层级的子节点中是否已有该部分
      if (!child) {
        // 如果没有，就新建一个节点并添加到当前节点的 children 数组中
        child = { name: part, children: [] };
        node.children.push(child);
      }
      node = child; // 进入子节点继续遍历
    }
  }
  return root;
}
```

# 最长公共前缀
- 思路
- 求最长的公共前缀，不断缩小前缀来验证
- .indexOf() 匹配
```js
function longestCommonPrefix(strs){
  if(strs.length === 0){
    return '';
  }
  // 先赋初始值，后续不断缩小
  let prefix = strs[0];
  for(let i = 0; i < strs.length; i++){
    // 对于单层的字符串，不断缩小公共前缀
    // 注意此时要求的.indexOf()不为0，意思就是直到匹配到
    while(strs[i].indexOf(prefix) !== 0){
      // 缩短字符串,不断缩短
      prefix = prefix.slice(0, prefix.length - 1);
      if(prefix === ''){
        return '';
      }
    }
  }
  return prefix;
}

```

```js
function dfsFindNode(node) {
  const res = []; // 存放符合条件的节点的数组
  if (node && node.nodeType === 1) { // 判断当前节点是否为元素节点
    if (/\ba\b/.test(node.className)) { // 判断当前节点的 class 属性是否包含 a
      res.push(node); // 如果符合条件，则将当前节点加入结果数组中
    }
    const children = node.children; // 获取当前节点的子元素列表
    for (let i = 0; i < children.length; i++) { // 遍历每个子元素
      const child = children[i];
      res.push(...dfsFindNode(child)); // 递归调用自身，并将返回的节点列表合并到结果数组中
    }
  }
  return res; // 返回所有符合条件的节点组成的数组
}

const Nodes = dfsFindNode(document.body); // 查找 document.body 下所有 class 为 a 的元素节点


function bfsFindNode(node) {
  const res = []; // 存放符合条件的节点的数组
  const queue = [node]; // 定义一个队列，初始值为根节点
  while (queue.length > 0) { // 当队列不为空时进行遍历
    const cur = queue.shift(); // 取出队头元素，并作为当前处理的节点
    if (cur.nodeType === 1 && /\ba\b/.test(cur.className)) { // 判断当前节点是否为元素节点，并且其 class 属性是否包含 a
      res.push(cur); // 如果符合条件，则将当前节点加入结果数组中
    }
    const children = cur.children; // 获取当前节点的所有子元素
    for (let i = 0; i < children.length; i++) { // 遍历每个子元素
      const child = children[i];
      queue.push(child); // 将子元素加入队列尾部，等待被处理
    }
  }
  return res; // 返回所有符合条件的节点组成的数组
}

const Nodes = bfsFindNode(document.body); // 查找 document.body 下所有 class 为 a 的元素节点

```

# 二分查找
```js
// 
var search = function(nums, target) {
    // right是数组最后一个数的下标，num[right]在查找范围内，是左闭右闭区间
    let mid, left = 0, right = nums.length - 1;
    // 当left=right时，由于nums[right]在查找范围内，所以要包括此情况
    while (left <= right) {
        // 位运算 + 防止大数溢出
        mid = left + ((right - left) >> 1);
        // 如果中间数大于目标值，要把中间数排除查找范围，所以右边界更新为mid-1；如果右边界更新为mid，那中间数还在下次查找范围内
        if (nums[mid] > target) {
            right = mid - 1;  // 去左面闭区间寻找
        } else if (nums[mid] < target) {
            left = mid + 1;   // 去右面闭区间寻找
        } else {
            return mid;
        }
    }
    return -1;
};
```

# find
```js
function find(obj, str) {
    const keys = str.split('.'); // 将属性路径按照 . 分割成数组
    let value = obj; // 初始化 value 为输入对象 obj
    for (let key of keys) {
        if (value.hasOwnProperty(key)) { // 如果当前对象有该属性，则更新 value 为该属性对应的值
            value = value[key];
        } else { // 如果当前对象没有该属性，则返回 undefined
            return undefined;
        }
    }
    return value;
}

```

# sleep

```js
const sleep = (time) => {
  return new Promise((reslove, reject) => {
    setTimeout(()=<{
      reslove();
    }, time)
  })
}

const soTtired = async (time)=>{
  await sleep(time);
}

soTired(2000);
```
# 带并发限制的异步调度器Scheduler
```js
// JS实现一个带并发限制的异步调度器Scheduler，
// 保证同时运行的任务最多有两个。
// 完善代码中Scheduler类，
// 使得以下程序能正确输出

class Scheduler {
  constructor() {
   this.count = 2
   this.queue = []
   this.run = []
  }

  add(task) {
    
  }

 }
 
 const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
 })
 
 const scheduler = new Scheduler()
 const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
 }
 
 addTask(1000, '1')
 addTask(500, '2')
 addTask(300, '3')
 addTask(400, '4')
 // output: 2 3 1 4
 
 // 一开始，1、2两个任务进入队列
 // 500ms时，2完成，输出2，任务3进队
 // 800ms时，3完成，输出3，任务4进队
 // 1000ms时，1完成，输出1
 // 1200ms时，4完成，输出4

```

```js
class Scheduler {
  constructor() {
    this.count = 0; // 当前正在运行的任务数量
    this.queue = []; // 等待运行的任务队列
  }

  add(task) {
    return new Promise((resolve) => {
      const runTask = async () => {
        this.count++; // 运行任务数量加一
        await task(); // 执行任务
        resolve(); // 任务完成，resolve Promise
        this.count--; // 运行任务数量减一

        if (this.queue.length > 0) {
          // 如果等待队列中有任务，则继续运行下一个任务
          const nextTask = this.queue.shift();
          nextTask();
        }
      };

      if (this.count < 2) {
        // 当前运行的任务数量小于2，可以直接执行任务
        runTask();
      } else {
        // 否则将任务添加到等待队列中
        this.queue.push(runTask);
      }
    });
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

```
# 串行异步调度器
```js
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}
```

# 三数之和
```js
function threeSum(nums) {
  const result = [];
  if(nums.length < 3){
    return result;
  }
  // 排序方便去重
  nums.sort((a, b) => a - b);
  for(let i = 0; i < nums.length - 2; i++){
    if(nums[i] > 0) return result;
    // 跳过重复元素1
    if(i > 0 && nums[i] === nums[i - 1]){
      continue;
    }
    // 定义中右指针
    let left = i + 1;
    let right = nums.length - 1;
    // 进入循环，比较后续的相加是否可以为 0 
    while(left < right){
      const sum = num[i] + nums[left] + nums[right];
      // 如果满足条件
      if(sum === 0){
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // 跳过重复元素2,并且控制指针
        while(left < right && nums[left] === nums[left + 1]){
          left++;
        }
        // 跳过重复元素3,并且控制指针的走向
        while(right < left && nums[right] === nums[right + 1]){
          right--;
        }
      }else if(sum < 0){
        left++;
      }else{
        right--;
      }
    }
  }
  return result;
}
```
# 实现一个无限可扩容add(1)(2)(3)(4)()
```js
function add(num){
  let sum = num;
  function innerAdd(nextnum){
    if(nextnum === undefined){
      return sum;
    }
    sum += nextnum;
    return innerAdd;
  }
  return innerAdd;
}
```

# 千分位分隔
```javascript
function thousandSeparator(n) {
    let nStr = n.toString();
    let [integerPart, decimalPart = ''] = nStr.split('.');
    if (integerPart[0] === '-') {
        integerPart = integerPart.slice(1);
    }
    let formattedIntegerPart = '';

    for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
      if (count === 3) {
        formattedIntegerPart = ',' + formattedIntegerPart;
        count = 0;
      }
      formattedIntegerPart = integerPart[i] + formattedIntegerPart;
    }
    return (n < 0 ? '-' : '') + formattedIntegerPart + (decimalPart ? '.' + decimalPart : '');
}
  
console.log(thousandSeparator(123456.1)); 
function thousandSeparator(n) {
  let nStr = n.toString();
  let [inter, decimal = ''] = nStr.split('.');
  if(inter[0] === '-'){
    inter = inter.slice(1);
  }
  let format = '', count = 0;
  for(let i = inter.length - 1, i >= 0; i--){
    if(count === 3){
      format = ',' + format;
      count = 0;
    }
    format = inter[i] + format;
    count++;
  }
  return 
}
function thousandSeparator(n){
  let nStr = n.toString();
  let res = '';
  // 处理小数
  let [inter, decimal = ''] = nStr.split('.');
  str = n < 0 ? str : str.slice(1);// 剔除1个（第一个）
  while(str.length > 3){// 满足大于3，才要切
    res = ',' + str.slice(-3) + res;
    str = str.slice(0, str.length - 3);// 更新 str
  }
  if(str){// 如果还存在，加到前面
    res = str + res;
  }
  return (n < 0 ? '-' : '') + res + (decimal ? '.' + decimal : '');
}
```
## 判断是否存在循环引用
- `in` 操作符在 JavaScript 中用于检查`对象`是否具有指定属性
```js
function hasCircularReference(obj) {
  const stack = [];
  // 递归实现
  function detect(obj) {
    // 是对象那么就进入判断
    if (typeof obj === 'object' && obj !== null) {
      if (stack.includes(obj)) {// 设计的栈里存在（.includes()判断即可，数组专用）
        return true;// 存在则返回 true
      }
      stack.push(obj);// 存入stack数组
      for (let key in obj) {// 遍历每个属性
        if (detect(obj[key])) {// 判断每个递归的结果
          return true;
        }
      }
      stack.pop();// 满足条件则进行弹出即可
    }
    return false;// 不是对象就是false
  }

  return detect(obj);
}

```
## 版本号比较
```js
const versions = ["1.2.1", "1.0.2", "1.3.2", "1.1", "1.2", "1", "1.10.0"]; 
// 升序排序 
versions.sort(compareVersion); 
console.log(versions); // ["1", "1.0.2", "1.1", "1.2", "1.2.1", "1.3.2", "1.10.0"] 
// 降序排序 
versions.sort((a, b) => compareVersion(b, a)); 
console.log(versions); // ["1.10.0", "1.3.2", "1.2.1", "1.2", "1.1", "1.0.2", "1"]
// 整体思路:重写 sort 方法
// 通过字符串分割成数组，比较数组的元素的大小
// 注意的是以最大长度进行遍历，然后取数组元素的时候进行比较有没有超过长度，再进行 parseInt
const compareVersion = (version1, version2) => {
  // 先进行拆成数组
	const arr1 = version1.spilt('.');
	const arr2 = version2.split('.');
  // 拿到最大的长度
	const len = Math.max(arr1.length, arr2.length);
	for(let i = 0; i < len;i++){
    // 每次都要判断一下
		const num1 = i > arr1.length ? 0 : parseInt(arr1[i]);
		const num2 = i > arr2.length ? 0 : parseInt(arr2[i]);
    // 
		if(num1 < num2){
			return -1;
		}else if(num1 > num2){
			return 1;
		}
	}
	// 考虑最后是等于的情况
	return 0;
}
```

# 常见api的使用
## String.prototype.split(separator, limit) 分裂
```js
// 可以寻找参数所处的位置进行分割
// 返回值是一个数组
// 对参数的左右进行分为数组的元素
const str = 'The quick brown fox jumps over the lazy dog.';

const words = str.split(' ',3);
console.log(words);
// Array ["The", "quick", "brown"] 

const chars = str.split('');
console.log(chars);
// Array ["T", "h", "e", " ", "q", "u", "i", "c", "k", " ", "b", "r", "o", "w", "n", " ", "f", "o", "x", " ", "j", "u", "m", "p", "s", " ", "o", "v", "e", "r", " ", "t", "h", "e", " ", "l", "a", "z", "y", " ", "d", "o", "g", "."] 

const strCopy = str.split();
console.log(strCopy);
//  Array ["The quick brown fox jumps over the lazy dog."]

// 将字符串分为一个一个，并且以数组形式返回
console.log("abc".split("")) // ["a","b","c"]
// 不加双引号就什么都不做
console.log("abc".split()) // ["abc"]

```
## String.prototype.substring()
## String.prototype.slice(start, end) 片
```js
const str = 'The quick brown fox jumps over the lazy dog.';

// 从0开始
console.log(str.slice(31));
// Expected output: "the lazy dog."

console.log(str.slice(1, 2));
// Expected output: "h"
// 如果该参数为负数，则被看作是 strLength + endIndex
console.log(str.slice(-4));
// Expected output: "dog."

console.log(str.slice(-9, -5));
// Expected output: "lazy"
```

## Array.prototype.splice()
```js
const months = ['Jan', 'March', 'April', 'June'];
// 对原数组进行切割
months.splice(1,1);
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "April", "June"]

months.splice(4, 1, 'May');
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]

```
## decodeURIComponent()、encodeURIComponent()
```
// encodeURIComponent()`将字符串"hello world!"编码为URI组件
// 编码后的结果为"hello%20world%21"。
// decodeURIComponent("hello%20world%21")`，
// 返回的结果为"hello world!"。

```


## String.prototype.toLowerCase()
## Object.prototype.assign()
```
// Object.assign直接可以合并对象，目标对象是第一个参数
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };
const obj3 = { d: 4 };

const mergedObj = Object.assign({}, obj1, obj2, obj3);

console.log(mergedObj); // 输出：{ a: 1, b: 2, c: 3, d: 4 }
console.log(obj1);      // 输出：{ a: 1, b: 2 }

```
##  Array.prototype.indexOf()
```
// 找不到就返回-1
// 找到了就返回下标的值
const str = 'ant'
console.log(str.indexOf('an'))// 0
```
##  Array.prototype.join()
```js
const elements = ['a','b','c'];

console.log(elements.join());
// Expected output: "a,b,c"

console.log(elements.join(''));
// Expected output: "abc"

console.log(elements.join('-'));
// Expected output: "a-b-c"

const elements = ['a','b','c'];

console.log(elements.join("%D"));
// Expected output: "a%Db%Dc"
```
## Array.from() 
- 此方法是数组上的静态方法，可以使**可迭代或类数组对象**创建一个新的浅拷贝对象
```js
console.log(Array.from('foo'));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], x => x + x));
// Expected output: Array [2, 4, 6]

```
## Math.floor()
```
// 返回小于等于该整数的数值
Math.floor(-5.05)
// -6
```
## paserInt()
```
// 接收两个参数
// 第一个参数：要被解析的值，如果参数不是一个字符串，则将其转换为字符串
// 第二个参数：进制2-32，0或者未指定，根据字符串的值进行推算。
```
## Object.entries()
- entries() 方法会返回一个新的 Iterator 对象，其中每个元素是一个包含两个元素的数组，第一个为键，第二个为对应的值。
```js
const map = new Map([["a", 1], ["b", 2], ["c", 3]]);
const arr = [...map.entries()];
console.log(arr);
// 输出的是可迭代对象，每个元素都是数组，有两个元素
// 输出：[["a", 1], ["b", 2], ["c", 3]]

```
## Array.findIndex()
- 里面的是函数
![[Pasted image 20230622170929.png]]
## for in和for of的区别
- for in 遍历的是index，并且这个index是string类型的，也会遍历原型上自定义的属性、方法，for of遍历的是value
- for of 适合遍历有迭代器的类型
	- Array、Map、String、Arguments
	- 对象没有迭代器，要想遍历就用Objecy.keys()
# 经典手写题思路整理
## mermoize
- 高阶函数
- 作用就是形成闭包，进行缓存
- 闭包
- 有则取，无则apply
## curry
- 不是高阶函数，返回的不是新函数
- 参数满了则直接调用而不是使用 apply
- 参数没满则进行递归等待参数的进入
- 第一次的参数是默认参数，后面的函数调用都以它为第一个参数
## compose
- 把一个个函数的返回值当成参数
- 因此参数就是函数列表数组
- 判断长度
	- 恒等式
	- 函数数组第一个元素
	- 调用reduce，实际上返回的是函数：接受参数
	- 理解reduce的用法，上一个函数的返回值就是prev，函数的调用、执行
## instanceof
- `instanceof` 只能检测**对象**是否是某个**构造函数**的实例
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
const p = new Person('Tom', 18);
console.log(p instanceof Person);    // true
```
## 数组的深度
```js
// 对递归的理解要更加深刻
// 深度->递归->确定参数和返回值、终止条件、单层逻辑
// 确定参数和返回值：返回值是深度
const getArrayDepth = (arr) => {
	// 是数组则
	if(Array.isArray(arr)){
		let maxDepth = 0;// 记录后续的深度
		// 遍历记录
		for(let i = 0;i < arr.length;i++){
			maxDepth = Math.max(getArrayDepth(arr[i]), maxDepth);
		}
		return 1 + maxDepth;
	}else{
		return 0;
	}
}

```
## 数组拍扁
- 使用reduce方法，默认的初始值为空数组，进行判断cur是否是数组，记住prev是数组，要进行展开
- 尾递归优化，参数必须携带结果函数，对该数组元素进行递归拆分，返回值也是
- 调用toString()可以把中括号剔除，再用split(',')可以构成数组，但是元素是字符串，调用map方法
### new
- 确定参数：构造函数，参数(展开运算符)
- 先是绑定原型：Object.create(),这个函数的底层实现就是创建一个新的函数，绑定原型，进而 new  返回这个函数
- 调用构造函数，绑定this
## 订阅发布者模式
- constructor函数定义this.events = new Map()
- on 方法绑定事件和回调函数
	- 必须是先进行获取检测
- emit 方法触发事件，执行所有回调函数，需要传递参数
- off 方法移除所有的回调函数或者指定的函数列表(在元素都是函数的数组里)
- once 方法创造一个只执行一次的回调函数，用到高阶函数的思路，因为要完成只实现一次的功能，那么就要调用off方法，重写回调函数，使得可以接受参数，绑定this
## 观察者模式
## 单例模式
- Singleton
- 构造函数内有一个变量
- 定义gteInstance方法，如果不存在，则new，存在则返回this.instance

# 排序
## 归并排序
### code
![[Pasted image 20230806160140.png]]
```js
// 归并排序

// 思路:中间拆、拆到单、回溯合并
//

const mergeSort = (arr) => {
    if (arr.length < 2) return arr;
    // 拆分
    let midIndex = arr.length >> 1;
    let left = arr.slice(0, midIndex),
        right = arr.slice(midIndex);
    // 返回
    return merge(mergeSort(left), mergeSort(right));
}
// 合并
const merge = (left, right) => {
    let result = [];
    // 情况1
    while (left.length && right.length) {
		// 判断条件是<=如果是<那么不稳定
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    // 情况2
    while (left.length) result.push(left.shift());
    // 情况3
    while (right.length) result.push(right.shift());
    // 返回
    return result;
}

```
### 分析
- **不是原地排序算法**，原地排序算法是仅使用输入数组本身的空间，需要额外的空间来存储临时数组，合并操作时需要开辟新的数组空间
- **是稳定的排序算法**，稳定排序算法是指排序后相等的元素，相对顺序会不会改变
- **时间复杂度：拆logn步，合并n步。故为nlogn**
## 快速排序
### code
```js
// 快排

// 定基准，放两边，直到单，回溯合并

function quickSort(arr) {
    if (arr.length < 2) return arr;
    // 定基准
    let pivot = arr[0];
    let left = [], right = [];
    // 存放
    for (let i = 1; i < arr.length; i++){
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            greater.push(arr[i]);
        }
    }
    // 递归拆、回溯合并
    return quickSort(left).concat(pivot, quickSort(right));
}

// 双指针法
function quickSort(arr, left = 0, right = arr.length - 1) {
    // 如果数组元素小于等于1个，则返回
    if (left >= right) return;
    // 取第一个元素为基准值
    const pivot = arr[left];
    // 定义左右指针
    let i = left;
    let j = right;
    // 利用左右指针交换元素位置
    while (i < j) {
        // 从右边向左扫描，找到第一个小于基准值的元素
        while (arr[j] >= pivot && i < j) {// 相反的符号
            j--;
        }
        // 从左边向右扫描，找到第一个大于基准值的元素
        while (arr[i] <= pivot && i < j) {
            i++;
        }
        // 找到下标之后进行交换，如果左右指针未相遇，交换元素位置
        if (i < j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    // 将基准值归位
    [arr[left], arr[i]] = [arr[i], arr[left]];    
    // 递归对左右两个子序列进行快排
    quickSort(arr, left, i - 1);
    quickSort(arr, i + 1, right);
    // 返回有序数组
    return arr;
}
```

### 分析
![[Pasted image 20230601164555.png]]
- 双指针法下的快排是原地排序
- 采用两个数组存放：定基准、放两边、拆到单、回溯合并
- 双指针：参数三、判断单、循环交换（注意都有i < j）、将基准值放中间、快排子序列
- 不稳定：**相同元素之间的顺序可能会改变，交换**
- 每次分区所选取的枢轴元素都恰好为中间位置时，快排的时间复杂度为 O(nlogn)
	- 原因是分区的时候比较log2n，进行分区n次
- 每次分区所选取的枢轴元素恰好为最大或最小值，时间复杂度达到 O(n^2)
	- 原因是分区的时候比较n-1，进行分区 n次
## 归并排序和快速排序的区别
- 归并是由下而上，先处理子问题，再合并
- 快排是由上而下，先分区，再处理子问题
- 归并稳定，但是不是原地排序算法
- 快排不稳定，但是是原地排序算法
## 冒泡排序
- 比较相邻的两个数字，前面的数字比后面大，则交换
```js
// 因为后续是 j + 1 与 j 作比较，所以遍历的时候可以 len - 1, len - i -1
function bubbleSort(arr){
	const len = arr.length;
	for(let i = 0;i < len - 1;i++){
		for(let j = 0;j < len - i - 1;j++){
			if(arr[j] > arr[j + 1]){
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
			}
		}
	}
}
```
## 选择排序
```js
// 思想就是找到最小的，放前面
// 第一层循环 lne - 1 因为第二层
// 第二层循环从 i + 1 开始，
function selectionSort(arr){
	const len = arr.length;
	for(let i = 0;i < len - 1;i++){
		let minIndex = i;
		for(let j = i + 1;j < len;j++){
			if(arr[j] < arr[minindex]){
				minIndex = j;
			}
		}
		// 交换放前面
		[arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
	}
	return arr;
}

```
# 分割URL参数

```js
// (https://www.example.com/search?query=JavaScript&sort=desc&page=2)
// 主机号就是域名
// 第一个?号后面带参数
function spiltUrlParams(url,res){
	// key-value存放参数信息
	// let params = {};
	// 得到发送的参数信息
	
	let paramsTemp = url.spilt("?")[1];
	if(!paramsTemp) return;
	
	params.spilt("&").forEach((item)=>{
		let itemArray = (item.spilt('='));
		let parmasName = decodeURIComponent(itemArray[0]);
		let paramsValue = decodeURIComponent(itemArray[1]);
		if(parmasName === res){
			return paramsValue;
		}
	})	
}
```
# 合并对象
```js
const mergeObjects = (...agrs) => {// 展开运算符进行合并为一个数组
	let mergeObj = {};
	agrs.forEach((item)=>{
		for(const v in item){
			if(item.hasOwnProperty(v)){
				mergeObj[v] = item[v];
			}
		}
	})
	return mergeObj;
}
```
# 数组去重
```js
// 方法一，使用Set
const arr = [1, 2, 2, 3, 3, 4];
const uniqueArr = [...new Set(arr)]
// 方法二，使用filter和indexOf
const uniqueArr = arr.filter((item, index) => {
	// 调用indexOf会找到第一个下标
	return arr.indexOf(item) === index;
})
// 方法三：
function uniqueArray(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    var isDuplicate = false;
    for (var j = 0; j < result.length; j++) {
      if (arr[i] === result[j]) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      result.push(arr[i]);
    }
  }
  return result;
}
```
# 回溯
## 组合
- 给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的**组合**。你可以按 **任何顺序** 返回答案。
- 思路：控制深度和宽度的问题。
- 细节：
	- 终止条件里必须 return; 
	- 简单剪枝：n - i + 1 >= k - path.length
	- 递归的参数 i + 1
```js
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```
## 组合总和II
- 找出所有相加之和为 n 的 k 个数的**组合**，且满足下列条件：
- **只使用数字 1 到 9**
- 每个数字 最多使用一次 
- 返回 所有可能的有效组合的列表 。该列表不能包含相同的组合两次，组合可以以任何顺序返回。

- 1-9于是控制了宽度、求和必定可以剪枝、组合问题
## 电话号码的字母组合
- for of
- .slipt("")
- .join()
## 组合总和
- 从给定的数组里进行取值
- **必须进行排序，否则后序剪枝操作无法进行**
- 可以重复选取，那么传递参数的 i 没必要加 1
- 求和必定可以剪枝
## 组合总和II
- [1,2,2,2,2,2,2,3,3,3]
- 每个数组只可以选一次且有重复的元素，需要用到数组前后元素比较来进行去重
```
// 当前元素和前一个元素进行比较
// 保证同一树层的取值不能相同

if(i > startIndex && candidates[i] === candidates[i - 1]){
	continue;
}
```
## 分割回文串
- 判断是否是回文子串
```
const isPalindrome = (s, l ,r) => {
	for(let i = l, j = r;i < j; i++, j--){
		if(s[i] !== s[j]) return false;
	}
	return true;
}
```
- 切板子，i 和 startIndex 之间进行切切切
- 切的时候注意api调用为slice(startIndex, i + 1 )

## 复原IP地址
- s = "25525511135"
- 回溯算法进行切割，板板板
- 切割slice(startIndex, i + 1)，判断符不符合条件
- [255,255,11,135].join('.')
## 子集
-  从给定数组里取值，都要进行排序，但是这题可以不排序
- 没有终止条件直接push

## 子集II
- 可能含有重复元素，排序完才能，使用同树层去重的方法
- 当前元素和前一个比较 && i > startIndex
## 递增子序列
-  **因为含有重复元素，所以必须在同一树层上进行去去重**
-  本题不可以进行排序，再前后比较的方法进行去重，要求的是递增子序列
-  **定义used[]来进行去重**
```
if(){

}
let uset = [];// 同一树层去重，uset放这里
for(){
	// 必须先进行一个比较的剪枝
	if(path.length > 0 && nums[i] < path[path.length - 1]){
		// 注意细节的处理，当是求组合的和，可以用i > startIndex
		// 但是此时i > startIndex时，path里不一定有元素
	}
	if(uset[nums[i] + 100]) continue;
	uset[nums[i] + 100] = true;// 数组元素大于-100 小于100，那么就用这种方式
}
```
## 全排列
-  不含有重复元素，求全排列
- 全排列和组合问题的不同就是，元素的顺序不同，那么结果也算是不同
- 此时递归的参数，不需要参数
- 但是同一树枝不可以用同样的元素
```
// 实质上就是标记index
const used = [];
const dfs = () => {
	if(){}
	for(){
		if(used[i]) continue;
		used[i] = true;
		...
		used[i] = false;
	}
}
```

## 全排列II
-  含有重复元素，求全排列
-  全排列问题先就需要进行树枝去重：used[]
-  再是进行树层的去重，排序后，前后元素进行比较

# BFS和DFS实现document.querySelectAll('.a')
- 正则表达式中的` \b `是一个特殊的元字符，可以匹配一个在单词边界位置的零宽度断言。
- // 包裹，\b \b里面的是匹配的单个的字符串
```js
/\ba\b/.test(node.className)

```
- `node.nodeType === 1` 为判断是否是元素节点
## DFS实现
```js
function dfsFindNode(node){
	const res = [];
	if(node && node.nodeType === 1){// 判断是否是元素节点
		if(/\ba\b/.test(node.className)){
			// 符合条件
			res.push(node);
		}
		const children = node.children;// 当前节点的子节点
		const len = children.length;
		if(len === null) break;
		for(let i = 0;i < len;i++){
			const child = children[i];
			res.push(...dfsFindNode(child))
		}
	}
	return res;
}
const Nodes = bfsFindNode(document.body); // 查找 document.body 下所有 class 为 a 的元素节点
```
## BFS实现
```js
function bfsFindNode(node){
	const res = [];
	const queue = [node];
	while(queue.length > 0){
		const cur = queue.length;
		if(cur.nodeType === 1 && /\ba\b/.tast(cur.className)){
			res.push(cur);
		}
		const children = cur.children;
		for(let i = 0; i < children.length; i++){
			const child = children[i];
			queue.push(child);
		}
	}
	return res;
}

```

# 动态规划
##  理论
- 确定dp数组的含义
- 初始化dp数组
- 确定递推公式
- 确定遍历顺序
## 斐波那契数列
- 递归
```js
function fibonacciRecursive(n){
	if(n <= 1) return n;
	return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}
// 时间复杂度O(2^n), 每个递归分解成两个递归
// 空间复杂度O(2n) -> O(n)
```
- 尾递归优化
- 把上面的返回值整合成一个函数返回
```js
// 尾递归优化，三个参数，在参数里进行加减法
function fibonacciRecursive(n, start = 1, total = 1){
	// 终止条件，当为前两项时，直接返回结果
	if(n <= 2) return total;
	return fibonacciRecursive(n - 1, total, total + start);
}
// 时间复杂度降为O(n)
```
- 迭代法
```js
function fibonacciRecursive(n){
	if(n <= 1) return n;
	// 定义前后变量进行累加
	let prev = 0, cur = 1;
	for(let i = 2; i <= n; i++){
		let next = prev + cur;
		prev = cur;
		cur = next;
	}
	return cur;
}
// O(n) 
// O(1)
```
- 动态规划
```js
function fibonacciRecursive(n){
	if(n <= 1) return n;
	// 定义dp数组
	const dp = new Array(n + 1);
	// 初始化dp数组
	dp[0] = 0;
	dp[1] = 1;
	// 遍历
	for(let i = 2;i <= n;i++){
		dp[i] = dp[i-1] + dp[i-2];
	}
	return dp[n];
}
// O(n)
// O(n)
```
## 爬楼梯
```js
function sultion(n){
	// 确定dp数组的含义，
	let dp = [1,1];
	for(let i = 2;i <= n;i++){
		dp[i] = dp[i-1] +dp[i-2];
	}
	return dp[n];
}
```
## 使用最小花费爬楼梯
```js
// 确定dp数组的含义：爬到第i层楼的最小花费是dp[i]
const minCostClimbingStairs = (cost) =>{
	let len = cost.length;
	// 初始化dp数组
	let dp = new Array(len + 1);
	dp[0] = dp[1] = 0;
	// 确定遍历顺序
	for(let i = 2;i <= len;i++){// i的起始值以dp为准
		// dp[i] 的来源有两种 
		// 就是该层对应的花费
		dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
	} 
	return dp[len];
}
```
## 不同路径
```js
const uniquePaths = (m, n) => {
	// 确定dp数组的含义：到i x j阶有dp[i - 1][j - 1]种方法
	let dp = new Array(m).fill().map(()=>Array(n).fill());
	// 初始化dp数组
	for(let i = 0;i < m;i++){
		dp[i][0] = 1;
	}
	for(let j = 0;j < n;j++){
		dp[0][j] = 1;
	}
	// 确定遍历顺序，已经初始化了第一列和第一行
	// 从i = 1、j = 1开始遍历即可
	for(let i = 1;i < m;i++){
		for(let j = 1;j < n;j++){
			// 确定递推公式
			dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
		}
	}
	return dp[m - 1][n - 1];
}
```
## 整数拆分
```js
var integerBreak = function(n) {
	let dp = Array(n + 1).fill(0);
	// 初始化
	dp[0] = 0;dp[1] = 0; dp[2] = 1;
	for(let i = 3; i <= n; i++){
		for(let j = 1;j <= i/2; j++){
			dp[i] = Math.max(dp[i], j*(i - j), dp[i - j]*j)
		}
	}
	return dp[n];
}
```
## 01背包问题
```js
const weightBag = (wight, value, size) =>{
	const len = wight.length;
	// 确定dp数组的含义：容量为i的背包可以装下的最大价值为dp[i]
	// 初始化为0，都还没开始装
	const dp = new Array(size + 1).fill(0);
	// 确定遍历顺序，物品不能无限使用，先遍历物品，后遍历背包
	for(let i = 0; i < len; i++){
		// 倒叙遍历背包，不重复计算，满足条件是背包容量大于单个物品的重量
		for(let j = size;j >= wight[i];j--){
			// 确定递推公式：dp[j]的来源,装与不装
			dp[j] = Math.max(dp[j], value[i] + dp[j - wight[i]]);
		}
	}
	return dp[size];
}

```
## 分割等和子集
```js

const canPartition = (nums) => {
	// 求和
	const sum = nums.reduce((p,v) => p + v);
	// 必须为偶数
	if(sum & 1)return false;
	let len = sum/2 + 1;
	// 确定dp数组的含义：容量为i的背包可以装下最大值为dp[i](所以每次定义的长度加一)
	// 也就是说没有背包容量为0的背包
	const dp = new Array(len).fill(0);
	//确定遍历顺序,01背包问题
	for(let i = 0;i < nums.length;i++){
		for(let j = sum/2;j >= nums[i];j--){
			// 确定递推公式,装与不装
			dp[j] = Math.max(dp[j],dp[j - nums[i]] + nums[i]);
			if(dp[j] === sum/2) return true;
		}
	}
	return false;
}
```
## 最后一块石头的重量
```js
// 确定dp数组的含义：容量为i最大能装dp[i]
var lastStoneWeightII = function (stones) {
    const sum = stones.reduce((p,v)=>p+v);
    // 和不一定是偶数，sum >> 1 位运算也可以
    const dpLen = Math.floor(sum/2);
    // 定义dp数组以及初始化，01背包问题，先都初始化为0
    const dp = Array(1+dpLen).fill(0);
    // 确定遍历顺序
    for(let i=0;i<stones.length;i++){
        for(let j=dpLen;j>=stones[i];j--){
            dp[j] = Math.max(dp[j],dp[j-stones[i]]+stones[i])
        }
    }
    return sum-dp[dpLen]-dp[dpLen];
};
```
## 目标和
```js
// 确定dp数组的含义：01背包问题，确定方法总数，容量为j最多有dp[j]种方法
const findTargetSumWays = (nums, target) => {
	// 求和
	const sum = nums.reduce((p, v) => p + v);
	// 判断基本条件
	if(Math.abs(target) > sum) return 0;
	if((target + sum) % 2) return 0;// 相加为偶数
	// 求容量的值
	const halfSum = (sum + target) / 2;
	// 定义dp数组,01背包问题，先赋值成0
	let dp = new Array(halfSum + 1).fill(0);
	// 初始化,涉及方法的问题,第一个值为1
	dp[0] = 1;
	// 确定遍历顺序
	for(let i = 0;i < nums.length;i++){
		for(let j = halfSum;j >= nums[i];j--){// 01背包问题，从最大容量开始的
			// 确定递推公式
			dp[j] = dp[j] + dp[j - nums[i]]
		}
	}
	return dp[halfSum];
}

```
## 一和零
```js
// 确定dp数组的含义：01背包问题，最多可以装多少个物品
const findMaxForm = (strs, n ,m) => {
	// 定义dp数组,01背包问题的初始化
	const dp = new Array(n + 1).fill().map(() => Array(m + 1).fill(0));
	let numOfZeros, numOfOnes;
	for(const str of strs){
		numOfZeros = 0;
		numOfOnes = 0;
		for(const s of str){
			if(s === '1'){
				numOfOnes++;
			}else{
				numOfZeros++;
			}
		}
		// 遍历背包
		for(let i = m; i >= numOfZeros; i--){
			for(let j = m; j >= numOfOnes; j--){
				// 确定递推公式，能装下则物品的个数加一就是
				dp[i][j] = Math.max(dp[i][j], dp[i - numOfZeros][j - numOfOnes] + 1);
			}
		}
	}
}

```

## 完全背包问题
- **如果求组合数就是外层for循环遍历物品，内层for遍历背包**
- **如果求排列数就是外层for遍历背包，内层for循环遍历物品**
```js
// 物品可以无限使用
function completePack(){
	let wight = [1, 3, 5];
	let value = [15, 20, 30];
	let bagWight = 4;
	// 确定dp数组的含义：容量为i的背包最大可以装下dp[i]的价值物品
	let dp = new Array(bagWight + 1).fill(0);
    for(let i = 0; i <= weight.length; i++) {
	    // 与01背包不同之处：背包开始可以从物品重量开始
        for(let j = weight[i]; j <= bagWeight; j++) {
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
        }
    }
    return dp[bagWight];
}

```
## 零钱兑换
```js
// 分析:完全背包问题
// 确定dp数组的含义：容量为i最多有dp[i]种方法
const change = (amount, coins) => {
	// 定义dp数组以及初始化
	let dp = new Array(amount + 1).fill(0);
	// 首项必须是1
	dp[0] = 1;
	// 确定遍历顺序
	for(let i = 0;i < amount.length;i++){
		for(let j = coins[i];j <= amount;j++){
			dp[j] += dp[j - coins[i]];
		}
	}
	return dp[amount];
}

```
## 组合总和IV
```js
// 完全背包问题
// 确定dp数组的含义：容量为i最多有dp[i]种方式
// 为什么用动态规划来做？只求数目，不求所有的结果，那么动态规划是个好选择
const combinationSum4 = (nums, target) => {
	// 定义dp数组以及初始化为0
	let dp = Array(target + 1).fill(0);
	// 首项为1种方法
	dp[0] = 1;
	// 求排列数问题，我们先遍历背包再遍历物品
	// 必须满足容量大于物品重量再进行递推公式的开始
	for(let i = 0;i < target;i++){
		for(let j = 0;j < nums.length;j++){
			// 必须满足容量大于物品重量
			if(i >= nums[j]){
				dp[i] += dp[i - nums[j]]; 
			}
		}
	}
	return dp[target];
}
```
## 零钱兑换
```js
// 确定题意，固定容量的背包来装，凑齐容量，并且要找个数最少
const coinChange = (coin, amount) => {
	if(!amount) return 0;
	// 定义dp数组以及初始化
	// 确定dp数组的含义：凑足总额为j所需钱币的最少个数为dp[j]
	const dp = new Array(amount + 1).fill(Infinity);
	// 容量为0时，必须赋值为0个，前序开始，如果没有赋值，那么就会全部是 Infinity
	dp[0] = 0;
	// 确定遍历顺序，我们求的最少个数，和组合排列无关，不妨先遍历物品
	for(let i = 0; i < coin.length; i++){
		for(let j = coin[i];j <= amount;j++){
			dp[j] = Math.min(dp[j - coin[i]] + 1, dp[j])
		}
	}
	return (dp[amount] === Infinity) ? -1 : dp[amount];
}
```
## 买卖股票的最佳时机
```js
// 贪心
const maxProfit = (prices) => {
	let low = Infinity;
	let res = 0;
	for(let i = 0; i < prices.length; i++){
		low = Math.min(low, prices[i]);
		res = Math.max(prices[i] - low, res);
	}
	return res;
}
// 动态规划
const maxProfit = (prices) => {
	const len = prices.length;
	// 确定dp数组的含义
	let hold = new Array(len).fill(-Infinity);
	let unhold = new Array(len).fill(0);
	// dp数组的初始化
	hold[0] = -prices[0];
	// 遍历
	for(let i = 1; i < len; i++){
		// 花钱少
		hold[i] = Math.max(hold[i-1],-prices[i]);
		// 赚得多
        unhold[i] = Math.max(unhold[i-1],hold[i-1]+prices[i]);
	}
	return unhold[len - 1];
}
```
## 完全平方数
```js

```
## 打家劫舍
```js
// 买卖只能一次
const maxProfit = (prices) => {
    const len = prices.length;
    // 确定dp数组的含义：第i天最低价是dp[i - 1]
    let hold = new Array(len).fill(-Infinity);
    // 确定dp数组的含义：第i天获取利润最高价是dp[i - 1]
    let unhold = new Array(len).fill(0);
    // 初始化，否则无法更新hold[]
    hold[0] = -prices[0];
    for(let i = 1;i < len;i++){
        hold[i] = Math.max(hold[i-1],-prices[i]);
        unhold[i] = Math.max(unhold[i-1],hold[i-1]+prices[i]);
    }
    return unhold[len-1];
}
const maxProfit = prices => {
    let low = Infinity;
    let result = 0;
    for(let i = 0;i < prices.length;i++){
        // 局部最优：找着lowest，今天和lowest做比较
        low = Math.min(low,prices[i]);
        result = Math.max(prices[i]-low, result);
    }
    return result;
};
```
## 打家劫舍II
```js
// 可以多次买入卖出
var maxProfit = (prices) => {
	let res = 0;
	// 只要有利润就存下来
	for(let i = 0; i < prices.length - 1; i++){
		res += Math.max(prices[i + 1] - prices[i], 0);
	}
	return res;
}
var maxProfit = (prices) => {
	const len = prices.length;
	let dp = new Array(len).fill().map(() => Array(2).fill(0));
	//  确定dp数组的含义：dp[i][0]表示第i天持有股票所得最多现金
	//  dp[i][1]表示第i天卖出股票所得现金
	// 初始化
	dp[0][0] = 0 - prices[0];
	for(let i = 1; i < len; i++){
		// 持有股票所得的最多钱的来源：昨天持有的或者，昨天不持有再买今天的
		dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] - prices[i]);
		// 不持有股票所得钱最多的来源：昨天不持有的或者，昨天持有今天卖出的
		dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
	}
	return dp[len - 1][1];
}
```
## 最长递增子序列
```js
const lengthOfLIS = nums => {
	// dp[i]表示i之前包括i的以nums[i]结尾的最长递增子序列的长度
	let dp = Array(nums.length).fill(1);
	let res = 1;
	// 遍历区间是[j,i],所以i是从1开始的，j从0开始，要小于i
	for(let i = 1; i < nums.length; i++){
		for(let j = 0; j < i; j++){
			// 当发生一次nums[i]的变更，那么dp[i]的来源就是之前的dp[i]或者dp[j]+1
			if(nums[i] > nums[j]){
				dp[i] = Math.max(dp[i], dp[j] + 1)
			}
		}
		// 及时更新
		res = Math.max(res, dp[i]);
	}
	return res;
}
```
## 最长连续递增序列
```js
const findLengthOfCIS = nums => {
	let dp = new Array(nums.length).fill(1);
	for(let i = 0; i < nums.length; i++){
		if(nums[i + 1] > nums[i]){
			dp[i + 1] = dp[i] + 1
		}
	}
	return Math.max(...dp);
}
```
## 最长重复子数组
```js
const findLength = (A, B) => {
	const [m, n] = [A.length, B.length];
	// 确定dp数组的含义：A、B的下标是i、j,对应最大的长度是dp[i][j]
	const dp = new Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
	let res = 0;
	// 从头开始遍历
	for(let i = 1; i <= m; i++){
		for(let j = 1; j <= n; j++){
			if(A[i - 1] === B[j - 1]){
				dp[i][j] = dp[i - 1][j - 1] + 1
			}
			res = dp[i][j] > res ? dp[i][j] : res;
		}
	}
	return res;
}
```
## 最长公共子序列
```js
// 不要求连续的序列
const longestCommonSubsequence = (text1, text2) => {
	// 确定dp数组的含义：长度为[0, i - 1]和[0, j - 1]的最长公共子序列长度为dp[i][j]
	let dp = Array(text1.length + 1).fill().map(() => Array(text2.length + 1).fill(0));
	// 从1 开始遍历
	for(let i = 1; i <= text1.length; i++){
		for(let j = 1; j <= text2.length; j++){
			if(text1[i - 1] === text2[j - 1]){
				dp[i][j] = dp[i - 1][j - 1] + 1;
			}else{
				dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
			}
		}
	}
	return dp[text1.length][text2.length];
}
```
# 数组
## 摆动序列
```js
var wiggleMaxLength = function(nums) {
    // 判断nums.length长度
    const len = nums.length;
    if(len <= 1) return len;
    let result = 1;// 初始化为1，因为i+1开始算，只要满足一上一下两个点就算是一次摆动
    let pre=0;
    let cur=0;
    for(let i=0;i < len-1;i++){//此处为len-1,因为后面从i+1计数cur
        cur = nums[i + 1] - nums[i];
        // 满足更新pre的前提是一正一负
        // =号在后面
        if((cur > 0 && pre <= 0)||(cur < 0 && pre >= 0)){
            result++;
            pre = cur;
        }
    }
    return result;
};
```
## 数组深度
```js
// 实现思路：递归
// 先判断该元素是否是数组
// 进行遍历求得该元素的深度
// 更新深度
// 返回：深度 + 1
function getArrayDepth(arr) {
  if (!Array.isArray(arr)) {
    return 0; // 非数组返回深度为0
  }
  let maxDepth = 0;
  for (let item of arr) {
    const depth = getArrayDepth(item);
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  }
  return maxDepth + 1; // 当前层级的深度加1
}

// 示例用法
const arr1 = [1, 2, 3]; // 深度为1
console.log(getArrayDepth(arr1)); // 输出: 1

const arr2 = [[1, 2], [3, 4]]; // 深度为2
console.log(getArrayDepth(arr2)); // 输出: 2

const arr3 = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]; // 深度为3
console.log(getArrayDepth(arr3)); // 输出: 3

```
## 二分查找
```js
function search(nums, target){
	let mid,left,right;
	left = 0;
	right = nums.length;
	while(left <= right){
		mid = left + ((right - left) >> 1);
		if(nums[mid] > target){
			right = mid - 1;
		}else if(nums[mid] < target){
			left = mid + 1;
		}else{
			return mid;
		}
	}
	return -1;
}

```
## 
## 手撕开平方
```js
function sqrt(s, precision = 16) {
  // 特殊情况处理：当输入的数字为 0 或 1 时，直接返回自身
  if (s === 0 || s === 1) {
    return s;
  }
  // 计算精度值
  const precisionValue = Math.pow(10, -precision);

  let low = 0;
  let high = s;

  while (high - low > precisionValue) {
    const mid = (low + high) / 2;
    const square = mid * mid;

    if (square === s) {
      return mid;
    } else if (square < s) {
      low = mid;
    } else {
      high = mid;
    }
  }

  // 返回限定精度位数的结果
  return low.toFixed(precision);
}
```
## 移除元素
```js
// 不要使用额外的数组空间，你必须仅使用 `O(1)` 额外空间并 [原地] 修改数组
// 快慢指针修改数组的元素
function removeElement(nums, val){
	let slowIndex = 0;
	// 遍历
	for(let fastIndex = 0;i < nums.length;i++){
		if(nums[fastIndex] !== val){
			nums[slowIndex++] = nums[fastIndex];
		}
	}
	return slowIndex;
}
```
## 有序数组的平方
```js
// 最大值必在两倍
function sortedSquares(nums){
	let n = nums.length;
	// 定义指针,前后尾三个指针
	let i = 0,j = n - 1,k = n - 1;
	// 定义新数组进行存放
	let res = new Array(n).fill(0);
	while(i <= j){
		let left = nums[i] * nums[i],
			right = nums[j] * nums[j];
		if(left < right){
			res[k--] = right;
			j--;
		}else{
			res[k--] = left;
			i++;
		}
	}
	return res;
}

```
## 滑动窗口
- 脑海的思路
- 定义快慢指针，快指针和边界作比较
- 慢指针和快指针之间的差值就是长度
- 两个while循环
### 长度最小的子数组
```js
var minSubArrayLen = function(target, nums) {
    let start = 0, end = 0;// 前者负责记录窗口内的，后者负责记录循环的结束时机
    let sum = 0;
    let len = nums.length;
    let minLength = Infinity;// 记录最小的长度
    // 通过尾指针来判断循环结束的时机
    while(end < start){
        sum += nums[end];
        // 当满足和大于目标和时，我们进行尝试减少操作
        while(sum >= target){
            // 更新 minLength
            ans = Math.min(ans, end - start + 1);
            // 尝试减小
            sum -= nums[target];
            start++;
        }
        end++;// 将尾指针++
    }
};
```
## 无重复字符的最长子串
```js
// 使用map来实现滑动窗口
// 通过.has来更新子串的起点位置
// 外部定义变量来记录最大的长度
const lengthOfLongestSubstring = () => {
	const Map = new Map();
	// 记录最长子串的长度
	let maxLength = 0;
	// 记录子串的起始位置
	let start = 0;
	// 遍历
	for(let i = 0;i < s.length;i++){
		const ch = s[i];
		// 如果 ch 出现过，更新子串的更新位置
		if(map.has(ch) && map.get(ch) >= start){
			satrt = map.get(ch) + 1;
		}
		// 存放
		map.set(ch, i);
		// 更新最大长度
		maxLength = Math.max(maxLength, i - start + 1);
	}
	return maxLength;
}
```
## 摩尔投票法解决主要元素问题
```js
function majorityElement(nums){
	// 定义候选者和计数器
	let count = 0;
	let candidate = null;
	// 遍历数组找到候选元素
	for(let num of nums){
		if(count === 0){
			candidate = num;
		}
		count += (num ==== candidate) ? 1 : -1;
	}
	// 再次遍历进行统计次数
	for(let num of nums){
		if(num === candidate){
			count++;
		}
	}
	return (count > nums.length / 2) ? candidate : -1;
}
```
- 使用Map来实现
```js
function majortyElement(nums){
	const map = new Map();
	for(let i = 0;i < nums.length;i++){
		if(map.has(nums[i])){
			map.set(nums[i], map.get(nums[i]) + 1);
		}else{
			map.set(nums[i], 1);
		}
	}
	let res = -1;
	let maxCount = 0;
	for(let [key, value] of map){
		if( value > nums.length / 2){
			res = key;
		}
	}
	return res;
}
```
## 数组中最多使用的一个或多个元素
```js
// 整体思路：MAP 存放 ，.values()取极值
function getMostCommonElements(arr) {
	const Map = new Map();
	// 遍历
	for(let i = 0;i < arr.length;i++){
		// 判断是否已经进行了保存
		if(Map.has(arr[i])){
			Map.set(arr[i], Map.get(arr[i]) + 1);
		}else{
			Map.set(arr[i], 1);
		}
	}
	// 取极值，Map.values()将属性的值以数组形式展开
	let maxCount = Math.max(...Map.values());
	let res = [];
	let count = 0;
	// Map.entries()将Map里的数据以数组的形式展开
	// const [key, value] of Map.ebtries()
	for(const [key, value] of Map.entires()){
		if(value === maxCount){
			res.push(key);
		}
	}
	return res;
}
```
## 元音字母
```js
// 思路:用Set()包裹字母集合，.has来实现查找
const isSimilar = (s) => {
	const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']);
	const midIndex = s,length / 2;
	let countA = 0, countB = 0;
	for(let i = 0;i < s.length;i++){
		let ch = s[i];// 等同于 s.charAt(i) 
		if(vowels.has(ch)){
			if(i < midIndex){
				countA++;
			}else{
				countB++;
			}
		}
	}
	return countA === countB;
}

```
## 实现一个合并乱序区间
1.输入 [[1,4], [3,8], [10,15], [11,18], [20,27], [14,15],[19,28]] 
2.期望输出 [[1, 8], [10,18],[19,28]],
```js
function mergeIntervals(intervals){
	// 排序
	intervals.sort((a, b) => a[0] - b[0]);
	// 初始化
	const merged = [intervals[0]];
	// 遍历
	for(let i = 1;i < intervals.length; i++){
		// 当前区间
		const cur = intervals[i];
		// 前一个区间
		const prev = merged[merged.length - 1];
		// 判断是否要合并
		if(cur[0] <= prev[1]){
			prev[1] = Math.max(cur[1], prev[1]);
		}else{
			merged.push(cur);
		}
	}
	return merged;
}
```
# 版本号排序
```js
const versions = ["1.2.1", "1.0.2", "1.3.2", "1.1", "1.2", "1", "1.10.0"]; 
// 升序排序 
versions.sort(compareVersion); 
console.log(versions); // ["1", "1.0.2", "1.1", "1.2", "1.2.1", "1.3.2", "1.10.0"] 
// 降序排序 
versions.sort((a, b) => compareVersion(b, a)); 
console.log(versions); // ["1.10.0", "1.3.2", "1.2.1", "1.2", "1.1", "1.0.2", "1"]
// 整体思路:重写 sort 方法
// 通过字符串分割成数组，比较数组的元素的大小
// 注意的是以最大长度进行遍历，然后取数组元素的时候进行比较有没有超过长度，再进行 parseInt
const compareVersion = (version1, version2) => {
	const arr1 = version1.spilt('.');
	const arr2 = version2.split('.');
	const len = Math.max(arr1.length, arr2.length);
	for(let i = 0; i < len;i++){
		const num1 = i > arr1.length ? 0 : parseInt(arr1[i]);
		const num2 = i > arr2.length ? 0 : parseInt(arr2[i]);
		if(num1 < num2){
			return -1;
		}else if(num1 > num2){
			return 1;
		}
	}
	// 考虑最后是等于的情况
	return 0;
}
```
# 链表
## 翻转链表
- 迭代法
```js
const reverseList = (head) => {
	if(!head || !head.next) return head;
	let prev = null;
	let cur = head;
	// 遍历
	while(cur !== null){
		const next = cur.next;
		cur.next = prev;
		prev = cur;
		cur = next;
	}
	return prev;
}
```
- 递归法
```js
const reverseList = (head) => {
	// 处理边界
	if(!head || !head.next) return head;
	// 递归处理剩余节点
	const tail = reverseList(head.next);
	head.next.next = head;
	// 将指向赋值为null
	head.next = null;
	return tail;
}
```
## 回文链表
```js
function isPalindrome(head){
	let mid = getMiddleNode(head);
	let left = head;
	let right = revserse(mid);// 反转链表
	// 比较即可
	while(right){
		if(right.value !== left.value){
			return false;
		}
		left = left.next;
		right = right.next
	}
}
function getMiddleNode(head){
	let slow, fast;
	slow = fast = head;// 回文链表中可以统一
	while(fast && fast.next){
		fast = fast.next.next;
		slow = slow.next;
	}
	return slow;
}

```
## 合并有序链表
```js
// 考虑l1、 l2的长度问题
// 迭代法解决问题
const merge = (l1, l2){
	// 定义虚拟头结点
	let prevHead = new ListNode(0);
	let prev = prevHead;
	while(l1 && l2){
		if(l1.val < l2.val){
			prev.next = l1;
			
			l1 = l1.next;
		}else{
			prev.next = l2;
			l2 = l2.next;
		}
		prev = prev.next;
	}
	prev.next = l1 ? l2 : l1;
	return prevHead.next;
}
```
## 判断链表是否有环
```js
// 实现思路就是快指针每次移动两步，慢指针每次移动一步
const hasCycle = (head) => {
	if(!head || !head.next) return false;
	let slow = head;
	let fast = head.next;
	// 当相等时跳出循环
	while(slow !== fast){
		// 必须满足指向不能指向null
		if(!fast || !fast.next){
			return false;
		}
		slow = slow.next;
		fast = fast.next.next;
	}
	return true;
}
	```
# 最长公共前缀
```js
function longestCommonPrefix(strs){
	if(strs.length === 0) return '';
	// 先赋值初始值，后续不断缩小
	let prefix = strs[0];
	for(let i = 0;i < strs.length;i++){
		while(strs[i].indexOf(prefix) !== 0){
			prefix = prefix.slice(0, prefix.length - 1);
			if(prefix === '') return '';
		}
	}
	return prefix;
}

```
## 两数相加
```js
const addTwoNumber = (l1, l2) => {
	const dummry = new ListNode(null);
	let cur = dummry;
	let [p1, p2] = [l1, l2];
	// 记录进位状态
	let carry = 0;
	// 均为空则停止遍历
	while(p1 || p2){
		// 拿到value值
		const value1 = p1 ? p1.val : 0;
		const value2 = p2 ? p2.val : 0;
		// 求和
		let sum = value1 + value2 + carry;// 记得带上carry
		carry = Math.floor(sum / 10);
		sum %= 10;
		// 创建新节点
		cur.next = new ListNode(sum);
		// 移动当前指针
		cur = cur.next;
		// 后移p1、p2
		p1 && p1 = p1.next;
		p2 && p2 = p2.next;
	}
	// 判断一下carry是否还有
	if(carry > 0) cur.next = new ListNode(carry);
	return dummy.next;
}
```
## 链表的排序
```js
// 归并排序法
function sortList(head){
	// 空节点或者单个节点，直接返回就行
	if(!head || !head.next){
		return head;
	}
	// 分割出两个序列
	let midNode = getMiddleNode(head);
	let rightNode = midNode.next;
	midNode.next = null;// 分出一左一右

	return mergerTwoList(sortList(head), sortList(rightNode));
}
// 找到链表的中间位置
function getMiddleNode(node){
	// 不统一，可取奇数左侧
	let slow = node;
	let fast = node.next.next;
	while(!fast && !fast.next){
		slow = slow.next;
		fast = fast.next.next;
	}
	return slow;
}
// 合并两个有序链表
function mergeTwoList(l1, l2){
	// 定义虚拟头结点
	let dummry = new ListNode(null);
	let cur = dummry;
	while(l1 && l2){
		if(l1.val < l2.val){
			cur.next = l1;
			l1 = l1.next;
		}else {
			cur.next = l2;
			l2 = l2.next;
		}
		cur = cur.next;
	}
	// 处理剩下的
	cur.next = l1 ? l1 : l2;
	return dummry.next;
}
```

# 二叉树
- 基础模板
```js
// 涉及递归，那么就是三部曲
// 确定递归函数的参数和返回值
// 确定终止条件
// 确定单层逻辑
```
## 递归遍历
```js
const preorderTraversal = (root) => {
	let res = [];
	const dfs = (node) =>{
		if(node === null) return;
		res.push(node.val);
		dfs(node.left);
		dfs(node.right);
	}
	dfs(root);
	return res;
}
```
## 迭代法
```js
// 前序遍历
const preorderTraversal = (root, res = []) => {
	if(!root) return res;
	const stack = [root];
	let cur = null;
	while(stack.length){
		cur = stack.pop();
		res.push(cur.val);
		cur.right && stack.push(cur.right);
		cur.left && stack.push(cur.left);
	}
	return res;
}
```
## 层序遍历
```js
const levelOrder = (root) => {
	let res = [], queue = [root];
	if(root === null) return null;
	while(queue.length){
		let len = queue.length;
		let curLevel = [];
		for(let i = 0;i < len;i++){
			let node = queue.shift();
			curLevel.push(node.val);
			node.left && queue.push(node.left);
			node.right && queue.push(node.right);
		}
		res.push(curLevel);
	}
	return res;
}
```
## 翻转二叉树
```js
// 确定参数和返回值:重新构造二叉树，那么是有返回值的
const invertTree = (root) => {
	// 终止条件
	if(!root) return null;
	// 暂存
	let leftNode = root.left;
	// 重定义
	root.left = invertTree(root.right);
	root.right = invertTree(leftNode);
	return root;
}
```
## 对称二叉树
```js
const isSymmetric = (root) => {
	if(root.length <= 1) return root;
	const dfs = (left, right) =>{
		// 终止条件
		if(left !== null && right === null || left === null && right !== null)
			return false;
		else if(left === null && right === null)
			return true;
		else if(left.val !== right.val)
			return false;
		return dfs(left.left, right.right) && dfs(left.right,right.left)
	}
	// 确定参数和返回值：参数一开始就可以是一左一右
	dfs(root.left, root.right);
}

```
## 求二叉树最大深度
```js
function maxDepth(root){
	// 确定参数和返回值:返回值是高度
	// 后序遍历进行高度的统计
	const dfs = (node) => {
		// 终止条件
		if(node === null) return 0;
		// 单层逻辑
		let leftDepth = dfs(node.left);
		let rightDepth = dfs(node.right);
		
		return 1 + Math.max(leftDepth, rightDepth);
	}
	dfs(root);
}
```
## 最小深度
```js
var minDepth = function(root) {
    const getMinDepth = (node)=>{
        if(!node) return 0;
        let leftDepth = getMinDepth(node.left);
        let rightDepth = getMinDepth(node.right);
		// 求最小深度时，在后序遍历的逻辑里处理，左右子树有一个不存在的问题
        if(node.left === null && node.right !==null) return 1 + rightDepth;
        if(node.left !== null && node.right === null) return 1 + leftDepth;
        return 1 + Math.min(leftDepth,rightDepth)
    };
    return getMinDepth(root);
};
```
## 完全二叉树的节点数
```js
const countNodes = (root) =>{
	// 确定参数和返回值：
	// 后序遍历将高度统计
	const getNodeSum = (node) => {
		// 终止条件
		if(!node) return 0;
		// 处理返回值
		let left = getNodeSum(node.left);
		let right = getNodeSum(node.right);
		return left + right + 1;
	}
	getNodeSum(root);
}
```
## 平衡二叉树
```js
const isBalanced = (root) => {
	// 确定参数和返回值
	// 后序遍历将高度作差
	// 不符合条件之间返回 -1
	const dfs = (node) => {
		// 终止条件
		if(!node) return 0;
		let left = dfs(node.left);
		if(left === -1) return -1;
		let right = dfs(node.right);
		if(right === -1) return -1;
		// 后序遍历处理单层逻辑
		if(Math.abs(left - right) > 1){
			return -1;
		}else{
			return 1 + Math.max(left, right);
		}
	}
	return !(dfs(root) === -1);
}

```
## 二叉树的所有路径
```js
function binaryTreePath(root){
	let res = [];
	// 确定参数和返回值
	// 前序遍历，存储前面的路径信息，可以保存在参数里
	const dfs = (node, path) => {
		// 终止条件
		if(!node) return;
		// 叶子结点
		if(node.left === null && node.right === null){
			path += node.val;
			res.push(path);
			return; // 必须return
		}
		// 非叶子节点
		path += node.val + "->";
		dfs(node.left);
		dfs(node.right);
	}
	dfs(root, '');
	return res;
}

```
## 左叶子之和
```js
function sumOfLeftLeaves(root){
	// 确定参数和返回值
	// 求和问题：必须先进行递归得到左右子树的结果，和当前的结果相加
	// 求叶子和,那么就要用到node信息
	// 求和
	const nodeSum = (node) => {
		// 终止条件
		if(!node) return 0;
		let left = nodeSum(node.left);
		let right = nodeSum(node.right);
		// 处理当前节点的逻辑
		let mid = null;
		if(node.left && node.left.left === null && node.left.right === null){
			mid = node.left.val;
		}
		return left + right + mid;// 最后回溯返回是总和值
	}
	return nodeSum(root);
}
```
## 找树最下角的值
```js
function findBottomLeftValue(root){
	// 要返回节点，定义一个temp变量
	let resNode = null, maxPath = 0;
	// 确定参数和返回值
	// 求深度，找到第一个最深的叶子节点就是树最下角的值
	// 参数可以带有高度，便于前序逻辑的直接处理
	const dfs = (node, curPath) => {
		// 终止条件
		if(!node) return;
		// 最深的叶子节点
		if(node.left === null && node.right === null){
			if(curPath > maxPath){
				resNode = node.val;
				maxPath = curPath;
				return;
			}
		}
		dfs(node.left, curPath + 1);
		dfs(node.right, curPath + 1);
	}
	dfs(root, 1);
	return resNode;
}

```
	



# 构造函数
```
    写一个构造函数Foo，该函数每个实例为一个对象，形如{id:N},其中N表示第N次调用得到的。
    要求：
    1、不能使用全局变量
    2、直接调用Foo()也会返回实例化的对象 -> 立即执行函数 -> 可new可返回实例
    3、实例化的对象必须是Foo的实例
```

```js
const Foo = (function (){
	// 外部定义变量，形成闭包
	let count = 0;
	// 定义构造函数
	function Foo(){
		// 没有通过 new 运算符则
		if(!(this instanceof Foo)){
			return new Foo();
		}
		count++;
		this.count++;
	}
	return Foo;
})();
const foo1 = new Foo(); 
console.log(foo1); // { id: 1 } 
const foo2 = new Foo(); 
console.log(foo2); // { id: 2 } 
const foo3 = Foo(); 
console.log(foo3); // { id: 3 }
```

# 定时器递归
- 实现一个定时器函数myTimer(fn, a, b)， 
- 让fn执行， 第一次执行是a毫秒后， 第二次执行是a+b毫秒后， 第三次是a+2b毫秒， 第N次执行是a+Nb毫秒后 
- 要求： myTimer要有返回值，并且返回值是一个函数，调用该函数，可以让myTimer停掉
```js
function myTimer(fn, a, b){
	// 在外部定义，便于清除
	let timerId;
	let count = 0;
	// 定义函数
	function schedule(){
		const delay = a + count * b;
		timerId = setTimeout(() => {
			fn();
			count++;
			schedule();// 循环调用
		}, delay)
	}
	// 执行函数
	schedule();
	// 返回清除器
	return function(){
		clearTimeout(timerId);
	}
}

```

# 队列与栈
## 队列的最大值
```js
class MaxQueue{
	constuctor(){
		this.queue = [];
		this.max = [];
	}
	enqueue(el){
		this.queue.push(el);
		// 最关键的代码：当max.length存在,最尾部的小于el
		// 那么都需要被pop()出去
		while(this.max.length && this.max[this.length - 1] < el){
			this.max.pop()
		}
		this.max.push(el);// 最后无论怎么样会加进去
	}
	dequeue(){
		if(this.queue.length === 0) return -1;
		const el = this.queue.shift();
		if(el === this.max[0]){
			this.max.shift();
		}
		return el;
	}
	getMax(){
		return max.length > 0 ? max[0] : -1
	}
}
```
## 栈的最小值
```js
class MinStack(){
	constuctor(){
		this.stack = [];
		this.minStack = [];
	}
	push(val){
		this.stack.push(val);
		// 可以重复push最小值
		this.minStack.push(Math.min(this.minStack[this.minStack.length - 1], val));
	}
	pop(){
		this.stack.pop();
		this.minStack.pop();
	}
	getMin(){
		return this.minStack[this.minStack.length - 1];
	}
}
```
## 用栈实现队列
```js
function MyQueue(){
	// 定义的两个栈
	this.stackIn = [];
	this.stackOut = [];
}
MyQueue.prototype.push = function(x){
	// 进队列，在入栈中进
	this.stackIn.push(x);
}
MyQueue.prototype.pop = function(x){
	// 检测出栈的内容，如果在出栈中还存在元素，那么直接出
	const size = this.stackOut.length;
	if(size) return this.stackOut.pop();
	// 如果出栈中不存在，那就把入栈元素放入
	while(this.stackIn.length){
		// 把入栈的元素都放入出栈里面
		this.stackOut.push(this.stackIn.pop());
	}
	// 返回出栈的元素
	return this.stackOut.pop()	
}
MyQueue.prototype.peek = function(){
	const x = this.pop();
	this.stackOut.push(x);
	return x;
}
MyQueue.prototype.empty(){
	return !this.stackIn.length && !this.stackOut.length;
}
```
## 用队列实现栈
```js
let MyStack = function(){
	this.queue = [];
}
MyStack.prototype.push = function(){
	this.queue.push(x);
}
MyStack.prototype.pop = function(){
	let size = this.queue.length;
	// 队列实现栈，那么无论怎么样我都要反转一下
	// 反正我不管，每一次我都会倒转一下
	while(size-- > 1){
		this.queue.push(this.queue.shift())
	}
	return this.queue.shift();
}
MyStack.prototype.top = function() {
    const x = this.pop();
    this.queue.push(x);
    return x;
};
MyStack.prototype.empty = function() {
    return !this.queue.length;
};
```
## 括号匹配
```js
const isValid = function(str){
	// 定义一个栈
	const stack = [];
	// 定义对象，用键值对的形式保存
	const map = {
		"(":")",
		"{":"}",
		"[":"]"
	}
	// 遍历
	for(const x of str){
		// 用in运算符，会匹配对象的属性的列表，查看是否符合其中之一
		if(x in map){
			// 符合就放入栈中，跳出循环
			stack.push(x);
			continue;
		}
		// 对于没在对象属性列表里的，就进行匹配是否在栈里可以找到这个key，返回
		if(map[stack.pop()] !== x) return false;
	}
	// 必须保证栈是空的！
	return !stack.length;
}
```
## 删除字符串中的所有相邻重复项
```js
// 使用栈
const removeDuplicates = (s) => {
	const res = [];
	for(const str of s){
		// 和栈末元素进行比较
		if(str === res[res.length - 1]){
			res.pop();
		}else{
			res.push(str);
		}
	}
	return res.join('');
}
```
## 逆波兰表达式求值
- [150. 逆波兰表达式求值 - 力扣（LeetCode）](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)
```js
const evalRPN = function(tokens){
	// 栈来实现求值
	const stack = [];
	for(const token of tokens){
		if(isNaN(Number(token))){
			const n1 = stack.pop();
			const n2 = stack.push();
			switch(token){
				case "+":
					stack.push(n1 + n2);
					break;
				case "-":
					stack.pop(n1 - n2);
					break;
				case "*":
					stack.pop(n1 * n2);
					break;
				 case "/":
                    stack.push(n1 / n2 | 0);
                    break;
			}		
		}else{
			stack.push(Number(token));
		}
	}	
	return stack[0];
}
```



# 哈希表
## 前 `k` 个频率高的元素
```js
const topKFrequent = function(nums, k) {
  const freqMap = new Map(); // 创建一个空的 Map 对象，用于统计元素频率
  for (let num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1); // 计算每个元素的频率并存储在 freqMap 中
  }
  const bucket = []; // 创建一个空数组，用于存放元素的桶（按照频率分配）
  for (let [num, freq] of freqMap) { // 遍历 freqMap 的所有元素，将元素插入到对应频率的桶中
    if (!bucket[freq]) { // 如果当前频率的桶不存在，创建一个空数组作为该桶
      bucket[freq] = [];
    }
    bucket[freq].push(num); // 将当前元素插入到对应频率的桶中
  }
  const result = []; // 创建一个空数组，用于存放最终结果
  // 怎么取的问题，对res.length的长度进行控制即可
  for (let i = bucket.length - 1; i >= 0 && result.length < k; i--) { // 从频率最高的桶开始遍历，直到满足取前 k 高的元素或桶已经遍历完
    if (bucket[i]) { // 如果当前频率存在桶（有元素），将桶中的元素加入到结果数组中
      result.push(...bucket[i]);
    }
  }
  return result; // 返回前 k 个高频元素的数组
};
```
## 去除数最少的字符
```js
function removeLeastFrequent(str){
	const map = new Map();
	for(let i = 0; i < str.length; i++){
		map.set(str[i], (map.get(str[i]) || 0) + 1);
	}
	let minCount = Infinity;
	for(const [str, freq] of map){
		if(freq < minCount){
			minCount = count;
		}
	}
	// 重新构造
	let res = [];
	for(let i = 0; i < str.length; i++){
		const char = str[i];
		if(map.get(char) > minCount){
			res.push(char);
		}
	}
	return res.join('');
}
```
## 两数之和
```js
// 哈希表查找
const twoSum = (nums, target) => {
	let Map = new Map();
	for(let i = 0;i < nums.length;i++){
		let temp = target - nums[i];
		if(Map.has(temp)){
			return [i, Map.get(temp)];
		}
		Map.set(nums[i], i);
	}
}
```
## 三数之和
```js
function threeSum(nums) {
  const result = [];

  if (nums.length < 3) {
    return result;
  }

  nums.sort((a, b) => a - b); // 排序

  for (let i = 0; i < nums.length - 2; i++) {
	if(nums[i] > 0) return result;
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue; // 跳过重复的元素
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        while (left < right && nums[left] === nums[left - 1]) {
          left++; // 跳过重复的元素
        }
        while (left < right && nums[right] === nums[right + 1]) {
          right--; // 跳过重复的元素
        }
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

```
## 四数相加
```js
// 和两数相加思路一致
const fourSum = (nums1, nums2, nums3, nums4) => {
	// 定义 Map
	const Map = new Map();
	let count = 0;
	// 遍历存储
	for(const n1 of nums1){
		for(const n2 of nums2){
			let sum = n1 + n2;
			Map.set(sum, (Map.get(sum) || 0) + 1)
		}
	}
	// 查找
	for(const n3 of nums3){
		for(const n4 of nums4){
			let sum = n3 + n4;
			count += Map.get(-sum) || 0;
		}
	}
	return count;
}

```
## 赎金信
```js
const canConstruct = (ransomNote, magazine){
	// 数组存放，26 字母表给予标记
	const strArray = new Array(26).fill(0);
	// ASCII 基准值
	const base = "a".charCodeAt();
	// 标记后者
	for(const s of magazine){
		strArray[s.charCodeAt() - base]++;
	}
	// 进行判断
	for(const s of ransomNote){
		const index = s.charCodeAt() - base;
		if(!strArray[index])return false;
		index--;
	}
	return true;
}
```
# 字符串
## 反转字符串
```js
// 可以用来判断回文串
const reverseString = (s) => {
	const n = s.length;
	// 定义左右指针进行遍历循环
	for(let left = 0, right = n - 1;left < right;left++, right--){
		[s[left], s[right]] = [s[right], s[left]];
	}
}
```
## 反转字符串II
```js
const reverseStr = (s, k) => {
	const n = s.length;
	const arr = Array.from(s);
	// 
	for(let i = 0;i < n;i += 2 * k){
		reverse(arr, i, Math.min(i + k, n) - 1)
	}
}
const reverse = (arr, left, right) => {
	// 交换
	while(left < right){
		[arr[left], arr[right]] = [arr[right], arr[left]];
		left++;
		right--;
	}	
}
```
## 替换空格
```js
return s.split(' ').join('%20');
```

# 设计一个lru缓存结构
```js
var LRUCache = function(capacity){
    this.catch = new Map();
    this.capacity = capacity;
}

LRUCache.prototype.put = function(key, value){
    // 如果存在则删除，不存在则继续
    if(this.catch.has(key)){
        this.catch.delete(key);
    }
    // 判断会不会超出
    // map只有size属性，没有length属性
    // map.keys().next().value，键的下一个的value值
    // 当恰好是不存在且容量不足
    if(this.capacity <= this.catch.size){
        this.catch.delete(this.catch.keys().next().value);
    }
    this.catch.set(key, value);
}

LRUCache.prototype.get = function(key){
    if(this.cache.has(key)){
        let value = this.catch.get(key);
        this.catch.detele(key);
        this.catch.set(key, value);
        return value;
    }
    return -1;
}
```
# 遍历查找树结构的内容
```js
var obj = {
    "name": "abc",
    "desc": "wer",
    "type": "text",
    "content": "12345",
    "children": [
        {
            "name": "wer",
            "type": "img",
            "url": "www.didi.com",
            "children": [{
                "name": "cvb",
                "type": "text",
                "content": "56947",
                children: [{
                    name: 'leaf-3',
                    type: 'text',
                    content: 'lolo'
                }, {
                    type: 'url',
                    content: 'http://didi.com'
                }]
            }]
        },
        {
            "name": "try",
            "type": "text",
            "content": "55533"
        },
        {
            "name": "1",
            type: "url",
            content: 'text'
        }
    ]
}
// 参数，返回值：content内容
let content = [];
const getContent = (obj) => {
    // 获取content
    let pathContent = obj.content ? obj.content : '';
    content.push(pathContent);
    if (!obj.hasOwnProperty('children')) {
        return;
    } else {
        for (let child of obj.children) {
            getContent(child);
        }
    }
}

console.log(getContent(obj));
```
# 给定一些目录路径，聚合成树形结构
```js
const paths = [
  'root/a',
  'root/b/c/d',
  'root/a/e/f'
];
{

  "name": "root",

  "children": [

    {

      "name": "a",

      "children": [

        {

          "name": "e",

          "children": [

            {

              "name": "f",

              "children": []

            }

          ]

        }

      ]

    },

    {

      "name": "b",

      "children": [

        {

          "name": "c",

          "children": [

            {

              "name": "d",

              "children": []

            }

          ]

        }

      ]

    }

  ]

}
// 实现思路：
// 创建根节点，对路径的每个字符串进行遍历，把/去掉，对这个数组进行遍历，去查找存不存在于cheldren部分，没有则新建，继续往children遍历
function buildTree(paths) {
	// 创造根节点
	const root = { name: 'root', children: [] };
	// 对每个路径进行遍历
	for(const path of paths){
		// 分隔出来进行匹配
		const partList = path.split('/');
		// 对根节点进行遍历,需要进行缓存，后续要返回的是root
		let node = root;
		for(const part of partList){
			// 查找当前层级是否存在该部分
			let child = node.children.find(v => v.name = part)
			// 没有则进行新建一个节点
			if(!child){
				child = { name: part, children: [] };
				node.children.push(child);
			}
			// 继续去下一个层级进行添加节点
			node = child;
		}
	}
	return root;
}
```
# 代码题
## 类型转换
```js
1. 以下代码返回结果为true的是 C

A. 0 + true === 1  // 0 + 1

B. '0' + false === 0 // 字符串拼接：'0false'

C. 1 + { valueOf() { return 1 } } === 2  

D. 1 + [2, 3] === '1,2,3' // 字符串拼接：'12,3'
```

# Promise
## myPromise
```js
class promise{
	constructor(executor){
		this.status = 'pending';// 状态
		this.value = null;// 传递的值
		this.onFulfilledCallbacks = [];// 用来保存成功的回调
		this.onRejectedCallbacks = [];// 用来保存失败的回调
		// 初始化参数函数
		try{
			executor(this.resolve.bind(this), this.reject.bind(this))
		}catch(err){
			this.reject(err)
		}
	}
	reslove(val){
		if(this.status !== 'pending') return;
		this.status = 'fulfilled';
		this.value = val;
		// 再执行回调
		while(this.onFulfilledCallbacks.length){
			this.onFulfilledCallbacks.shift()(this.value)
		}
	}
	reject(reason) {
	    if (this.status !== 'pending') return
	    this.status = 'rejected';
	    this.value = reason;
	    while (this.onRejectedCallbacks.length) {
	      this.onRejectedCallbacks.shift()(this.value)
	    }
	}
	then(onFulfilled, onRejected){
		// 处理普通值
		onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
		onRejected = typeof onRejected === 'function' ? onRejected : val => { throw val }
		// 对回调函数进行包装,.then()返回的是一个promise对象
		// 实现.then的链式调用
		const thenPromise = new Promise((resolve, reject) => {
			const resolvePromise = (cb) => {
				setTimeout(() => {
					try{
						const x = cb(this.value);
						// 对返回值进行处理
						if(x === thenPromise){
							throw new Error('')
						}else if(x instanceOf myPromise){
							x.then(resolve, reject)
						}else{
							this.resolve(x)
						}
					}catch(err){
						throw new Error(err)
					}
				})
			}
			// 判断执行的时机
			// 当resolve直接执行了那么，回调马上包裹执行
			if(this.status === 'fulfilled'){
				resolvePromise(onFulfilled)
			}else if(this.status === 'rejected'){
				rejectedPromise(onRejected);
			}else if(this.status === 'pending'){// 状态没有直接改变
				this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
				this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
			}
		})
	}
	return thenPromise;
}
```
## 红绿灯交替设计
```js
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
const light = (cb, delay) => {
	return new Promise(resolve => {
		setTimeout(() => {
			cb();
			resolve();
		}, delay)
	})
}
const step = () => {
	Promise.reslove().then(() => {
		
	}).then(() => {
	
	}).then(() => {
		
	})
}
// 循环
async function lightStep(){
		await 
		await lightStep();
}
```
## promise.all
```js
const promiseAll = (promises) => {
	if(typeof promises[Symbol.interator] === 'function'){
		let count = 0;
		let result = [];
		return new Promise((reslove, reject) => {
			for(const [index, item] of promises){
				// 保存每次执行的结果
				Promise.resolve(item).then((res) => {
					result[index] = res;
					count++;
					if(count === promises.lenth){
						return reslove(result);
					}
				}).catch(err => {
					reject(err);
				})
			}
		})
	}
}
```
## Promise实现请求超时
```js
function promiseTimeout = (promise, delay) => {
	let timer = new Promise((reslove, reject) => {
		setTimeout(() => {
			reject('超时啦');
		}, delay)
	})
	return Promise.race([promise, timer]);
}
```
## 使用Promise实现每隔1秒输出1,2,3
```js
const printNumber = async() => {
	const array = [1,2,3];
	for(let i = 0; i < 3; i++){
		await new Promise((reslove) => {
			setTimeout(() => {
				console.log(array[i]);
				reslove();
			}, 1000)
		})
	}
}
```
## Promise.race
```js
const promiseRace = (items) => {
	return new Promise((reslove, reject) => {
		items.forEach((item) => {
			Promise.reslove(item).then((res) => {
				reslove(res);
			}).catch(err => {
				reject(err);
			})
		})
	})
}
```
## Promise.allSettled
```js
function allSettled(promises){
	return new Promise((reslove, reject) => {
		const result = [];
		let count = 0;
		if(promises.length === 0){
			resolve(result);
			return;
		}
		promises.forEach((promise, index) => {
			Promise.resolve(promise)
				.then((value) => {
					result[index] = { status: 'fulfilled', value }
				})
				.catch((reson) => {
					result[index] = { status: 'rejected', reason }
				})
				.fianlly(() => {
					count++;
					if(count === promise.length){
						resolve(results)
					}
				})
		})
	})
}
```

# 实现媒体查询
# call、apply、bind
```js
// call 方法的参数：对象（构造函数），多个参数
Function.prototype.call = function(context, ...args){
	if(typeof this !== 'function')// this 必须是函数
		return new TypeError('error');
	// 确保第一个参数不为空
	context = context || window;
	const fn = Symbol('fn');// 添加一个属性
	context[fn] = this;
	const res = context[fn](...args);
	delete context[fn];
	return res;
}
// apply方法的参数：对象，一个参数数组
Function.prototype.apply = (context, args) => {
	if(typeof this !== 'function'){
		return new TypeError('error');
	}
	context = context || window;
	const fn = Symbol('fn');
	context[fn] = this;
	const res = context[fn](...args);
	delete context[fn]
	return res;
}
// bind 是会返回一个函数,考虑到可能多次调用，那么就不进行删除
Function.prototype.bind = function(target, ...outArgs) {
	if(typeof this !== 'function'){
		return new TypeError('error');
	}
	target = target || window;
	const fn = Symbol();
	target[fn] = this;
	return function(...moreArgs) {
		const res = target[fn](...outArgs, ...moreArgs);
		return res;
	}
}
```
# 将下划线或中划线命名转换为驼峰命名
```js
function toCamelCase(str){
	// .split(/[-_]/)方法进行分隔
	let words = str.split(/[-_]/);
	let res = str[0];// 给第一个字符让其初始化，因为不需要变化
	for(let i = 1; i < words.length; i++){// 从 i = 1开始遍历即可
		// 拿到每个单词的第一个值，后面的切一刀连起来
		// toUpperCase()
		res += word[i][0].toUpperCase() + word[i].slice(1);
	}
	return res;
}
```
- str.split(/[-_]/)
- array.slice(1)
# 千分位分隔
```js
function thousandSeparator(n){
	// 处理负数的情况
	let nStr = n.toString();// 数字先进行.toString()
	let res = '';
	let [str, str1] = nStr.split('.');// 使用解构，剔除小数
	str = n < 0 ? str : str.slice(1)// 如果是小于0，那么就进行.slice(1),取0后面的
	while(str.length > 3){// 满足大于 3，才要切
		res = ',' + str.slice(-3) + res;// 后序取加，调用.slice(-3)
		str = str.slice(0, str.length - 3);// 是len - 3，已经相当于加了1
	}
	// 处理前面不足剩下的，加到前面去
	if(str){
		res = str + res;
	}
	return (n < 0 ? '-' : '') + res + (str1 ? '.' + str1 : '');
}
```
# 实现Set()
```js
class RandomizedSet {
  constructor() {
    this.set = []; // 用于存储集合的元素
    this.map = new Map(); // 用 map 存储元素和索引的对应关系
  }

  insert(n) {
    if (this.map.has(n)) {
      return false; // 如果元素已存在，则返回 false
    }
    this.set.push(n); // 将元素添加到数组末尾
    this.map.set(n, this.set.length - 1); // 在 map 中记录元素和索引的对应关系
    return true;
  }

  remove(n) {
	// 核心思想是将数组尾部的元素放入要去除的元素的位置上
	// 还可以使用.pop()弹出
    if (!this.map.has(n)) {
      return false; // 如果元素不存在，则返回 false
    }
    const index = this.map.get(n); // 获取元素在数组中的索引
    const lastElement = this.set[this.set.length - 1]; // 获取数组末尾元素

    this.set[index] = lastElement; // 将末尾元素移动到被删除元素的位置
    this.map.set(lastElement, index); // 更新 map 中末尾元素的索引
    this.set.pop(); // 删除数组末尾元素
    this.map.delete(n); // 删除 map 中的元素

    return true;
  }

  getRandom() {
    // 直接使用Math.floor(Math.random * this.set.length)是可以的
    // 因为小数都会抹
    const randomIndex = Math.floor(Math.random() * this.set.length); // 生成随机索引
    return this.set[randomIndex]; // 返回随机元素
  }
}

// 示例用法
const set = new RandomizedSet();
set.insert(1);
set.insert(2);
set.insert(3);
console.log(set.getRandom()); // 可能输出 1、2 或 3
set.remove(2);
console.log(set.getRandom()); // 可能输出 1 或 3

```
# 进程和线程
- 操作系统中最核心的概念就是进程，进程是对正在运行中的程序的一个抽象，是**系统进行资源分配和调度**的**基本单位**
- 执行这些任务的是`CUP`
- 进程是一种抽象的概念，一般说是由三部分组成
	- 程序：描述进程要完成的功能、控制进程
	- 数据集合：数据和工作区
	- 程序控制块：进程的描述信息控制信息
- 线程是能够进行**运算调度**的最小单位
	- 宏观上是并行，微观上就是切换串行
- 一个进程限定在一个`CPU`内核里
- 区别
	- 进程是系统资源分配的基本单位，线程是任务调度和执行的基本单位
	- 进程有独立的代码和空间，同一类线程共享代码和数据空间，独立运行栈
	- 在操作系统中能同时运行多个进程（程序）；而在同一个进程（程序）中有多个线程同时执行（**通过CPU调度，在每个时间片中只有一个线程执行**）

# 树、数组
```js
let data = [
    { id: 0, parentId: null, name: '生物' },
    { id: 1, parentId: 0, name: '动物' },
    { id: 2, parentId: 0, name: '植物' },
    { id: 3, parentId: 0, name: '微生物' },
    { id: 4, parentId: 1, name: '哺乳动物' },
    { id: 5, parentId: 1, name: '卵生动物' },
    { id: 6, parentId: 2, name: '种子植物' },
    { id: 7, parentId: 2, name: '蕨类植物' },
    { id: 8, parentId: 4, name: '大象' },
    { id: 9, parentId: 4, name: '海豚' },
    { id: 10, parentId: 4, name: '猩猩' },
    { id: 11, parentId: 5, name: '蟒蛇' },
    { id: 12, parentId: 5, name: '麻雀' }
]
function transTree(data) {
	let ref = [];
	let map = {};
	if(!Array.isArray(data)){
		return [];
	}
	// 空间换时间
	data.forEach((item) => {
		map[item.id] = item;
	})
	data.forEach((item) = > {
		// 找到 item的上一层,存放的都是地址值
		let parent = map[item.parentId];
		if(parent) {
			if(parent.children){
				parent.children.push(item)
			}else{
				parent.children = [item]
			}
		}else { // 如果他没有父亲就把他加入到我们首次声明的数组里 
			result.push(item) //item是对象的引用 
		}
	})
}
// 数组转树
const array = [
        {
            code: 101,
            name: '北京',
        },
        {
            code: 102,
            name: '石家庄',
        },
        {
            code: 102,
            name: '江苏',
            children: [{
                code: 102,
                name: '南京',
            }, {
                code: 102,
                name: '连云港',
            }]
        },
]
function toObj() {
	let obj = {};
	for(let item of arr){
		// 存在children属性那么就拆分，扩展运算符拷贝
		if(item[children] !== undefined) {
			obj = {...toObj(item[children]), ...obj};
		}else {
			obj[item.name] = item;
		}
	}
	return obj;
}

```
# 八股扫盲
## 全等操作符与等于操作符
- 操作符（= =，只需要值相同）
- boolean都会转为`数字0/1`
- 字符串遇到数字：`数字`的优先级高
- 对象：调用对象的`valueOf()`取得原始值
- null = = undefined
- NaN（运算错误产生）不等于任何
- 对象比较则比较地址值
- 全等操作符类型相同，值也需相同
## 闭包的定义作用
- 内层函数中访问到其外层函数的`作用域`
- 创建`私有变量`和`延长变量的生命周期`
- 实现颗粒化函数
- 实现私有属性，定义公共函数才可访问
```js
var createCounter() {
	let counter = 0;
	function increment() {
	    count++;
	    console.log(count);
	}
	function decrement() {
	    count--;
	    console.log(count);
	}
	// 返回一个对象实现可以用方法访问私有属性
	return {
		increment: increment,
		decrement: decrement,
	}
}
```
## 作用域链
- 作用域
	- 全局作用域
	- 函数作用域
	- 块级作用域： ES6引入了`let`和`const`关键字
- 词法作用域（静态作用域）
	- 变量在创建时作用域就确定好了，而非编译阶段
- 通过当前的上下文去寻找变量（有this通过它先找）
- 否则就根据静态作用域去找其他的上下文，直到全局作用域
## this
- 定义：函数运行时生成的一个内部对象，只能在函数内部使用
- 默认绑定
	- window上
	- 严格模式下绑定到undefined
- 隐式绑定
	- 外层作用域上的变量
- new绑定
- 显示修改
## 事件循环
- 实现`单线程非阻塞`的方法就是事件循环
- 同步任务直接进入主线程执行，异步任务按优先级不同执行
## BOM与DOM
- DOM
	- 文档对象模型，把文档当做对象，顶级对象是document，标准是W3C
	- 
- BOM
	- 浏览器对象模型，把浏览器当做对象，顶级对象是window
	- 浏览器交互的对象，厂商定义，兼容性较差
	- 核心对象是`window`，浏览器窗口的一个接口，是全局对象
	- 有一些控制窗口的方法，`window.open`与`window.close`
	- 还有`location`方法解析`url`的一些内容
	- 




# 组合

```js
// 确定参数和返回值：
// 参数：startIndex 就是防止出现重复的组合。无返回值

var combine = function(n, k) {
    let result = []
    let path = []
    const combineHelper = (startIndex) => {
        // 结合题意，确定终止条件。
        if (path.length === k) {
            result.push([...path]);
            return
        }
        // for循环内，i 初始值设置为startIndex，防止出现重复的组合
        // 剪枝操作：n-i+1是代表还能去的数的个数，k-path.length代表需要的个数
        for (let i = startIndex; n - i + 1 >=  k - path.length; ++i) {
            path.push(i);
            combineHelper(i + 1);
            path.pop();// 不要忘记回溯了。
        }
    }
    combineHelper(1);
    return result;
};
```


**如果把 path + "->"作为函数参数就是可以的，因为并有没有改变path的数值，执行完递归函数之后，path依然是之前的数值（相当于回溯了）**

因为回溯的本质是**穷举**，穷举所有可能，然后选出我们想要的答案，如果想让回溯法高效一些，可以加一些剪枝的操作，但也改不了回溯法就是穷举的本质。

- 回溯函数模板返回值以及参数
- 回溯函数终止条件
- 回溯搜索的遍历过程

# 组合总和II

```javascript
// 确定参数和返回值：参数为startIndex,无返回值
var combinationSum3 = function(k, n) {
    // 根据题意，定义变量。
    let res = [];
    let path = [];// 存储满足条件的单个结果，记得回溯
    let sum = 0;// 存储和，需要记得回溯
    const dfs = (startIndex)=>{
        // 确定终止条件，对sum和path都有要求
        
        if(path.length === k){
            if(sum === n){
                res.push([...path]);
                return;
            }
        }
        // for循环,可以剪枝。能用的最大的数是9 
        // 有sum则可剪枝
        for(let i = startIndex;9 - i + 1 >= k - path.length && (sum + i) <= n;i++){
            sum += i;path.push(i);
            dfs(i+1);
            sum -=i;path.pop();
        }
    }
    dfs(1);
    return res;
};
```

# 电话号码的组合

```js
// 确定参数和返回值：参数startIndex,无返回值
// 通过定义数组来映射所需的字符串
// 判断终止条件：按了几下
// for循环里，遍历第一个字符串的单个字符，遍历第二个...
// 将驻足转化为字符串：可以用.join('')方法
var letterCombinations = function(digits) {
    const k = digits.length;
    if(!k)return [];
    // 映射
    const map = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
    if(k === 1)return map[digits].split('')
    const res = [],path = [];

    function backtracking(startIndex) {
        if(path.length === k){
            res.push(path.join(""));
            return;
        }
        for(const s of map[digits[startIndex]]){           
            path.push(s);
            backtracking(startIndex + 1);
            path.pop();
        }
    }
    backtracking(0);
    return res;
};
```

# 组合总和

```javascript
// 要从给定的数组里面拿出子元素，需要给数排序
// 确定参数和返回值：参数是startIndex
// 终止条件：只对sum有要求
// 同一个数字可以被无限制选取，则递归参数不用加一即可，相当于是同一个的可以被选取多次
var combinationSum = function(candidates, target) {
    const len =  candidates.length; 
    const res = [], path = [];
    let sum = 0;
    candidates.sort((a, b) => a - b); // 排序，后续需要进行剪枝

    function backtracking(startIndex) {
        if (sum === target) {
            res.push([...path]);
            return; 
        }
        for(let i = startIndex; i < len && sum + candidates[i] <= target; i++ ) {
            const n = candidates[i];
            path.push(n); sum += n;
            backtracking(i);
            path.pop();sum -= n;
        }
    }

    backtracking(0);
    return res;
};
```

# 组合总和II
```js
var combinationSum2 = function(candidates, target) {
    const res = []; path = [], len = candidates.length;
    let sum = 0;
    candidates.sort((a, b) => a - b);
    backtracking(0);
    return res;
    function backtracking(startIdex) {
        if (sum === target) {
            res.push([...path]);
            return;
        }
        for(let i = startIdex; i < len && sum + candidates[i] <= target; i++) {
            const n = candidates[i];
            if(i > startIdex && candidates[i] === candidates[i-1]){// j>i表示的是 同一层的不同分支
              //若当前元素和前一个元素相等
              //则本次循环结束，防止出现重复组合
              continue;
            }
            //如果当前元素值大于目标值-总和的值
            //由于数组已排序，那么该元素之后的元素必定不满足条件
            //直接终止当前层的递归
            path.push(n);sum += n;
            backtracking(i + 1);
            path.pop();sum -= n;
        }
    }
};
```
# 组合总和IV
```js
const combinationSum4 = (nums, target) => {
    // 确定dp数组的含义：容量为i最多有dp[i]种方式
    const dp = Array(target + 1).fill(0);
    dp[0] = 1;
    // 求排列数问题，我们先遍历背包再遍历物品，必须满足容量大于物品重量
    for(let i = 0; i < target; i++){
        for(let j = 0; j < nums.length; j++){
            if(i >= nums[j]){
                dp[i] += dp[i - nums[j]] 
            }
        }
    }
    return dp[target];
}
```
# 分割回文子串

```js
// 判断是否是回文串，三个参数：s left right
const isPalindrome = (s, l, r) => {
    for(let i = l, i = r; i < j; i++, j--){
        if(s[i] !== s[j]) return false;
    }
    return true;
}

// 确定参数和返回值：参数为startIndex
// 整体思路相当于组合问题稍作整理做成切割问题
var partition = function(s) {
    const result = [],path = [];
    let len = s.length;
    const dfs = (startIndex) => {
        // 终止条件，当切割板到最后一个，即是该分支下已经判读完了，
        // 即当startIndex等于子串长度时,return
        if(startIndex === len){// 切到尾巴
            result.push([...path]);
            return;
        } 
        for(let i = startIndex;i < len;i++){
            // 每一次切，怎么切呢?起始位置就是startIndex,结束位置自然是i
            // 不符合是回文串，则continue
            if(!isPalindrome(s,startIndex, i))continue;
            path.push(s.slice(startIndex, i + 1));// 注意切割时，末位置记得加1
            dfs(i+1); // 不允许重复使用，则i+1
            path.pop();// 回溯
        }
    };
    dfs(0);
    return result;
};
```

# 复原IP地址

```js
// 同是组合问题转成切割问题
// .join('.')方法是将数组元素用.分割成字符串
var restoreIpAddresses = function(s) {
    const res = [],path = [];

    function dfs(startIndex){
        //终止条件，需要用到startIndex=s.length来比较什么时候退出
        //此时比较的是 path.length=4
        const len = path.length;
        if(len > 4)return;
        if(len === 4 && startIndex === s.length){// 切到尾巴
            res.push(path.join("."));
            return;
        }
        for(let j = startIndex; j < s.length; j++){
            const str = s.slice(startIndex, j + 1);// 切割时注意是j+1，我们对这个区间的进行分析
            if(str.length > 3 || +str > 255) break; // 只能是百位数以内并且不可以大于255
            if(str.length > 1 && str[0] === "0") break;// 当是十位或者百位数的时候，首位不可以是'0'
            path.push(str);
            dfs(j + 1);
            path.pop()
        }
    }

    dfs(0);
    return res;
};

```

# 子集

```javascript
// 确定参数和返回值
// 判断终止条件没有条件限制
var subsets = function(nums) {
    let res= [],path = [];
        nums = nums.sort((a, b) => {
        return a - b
    })// 排序是为了后序可以去重，这里可排可不排
    const dfs = (startIndex) =>{
        res.push([...path]);// 刚好空数组被push
        for(let i = startIndex;i < nums.length;i++){
            path.push(nums[i]);
            dfs(i+1);
            path.pop();
        }
    }
    dfs(0);
    return res;
};
```
# 子集II

```javascript
var subsetsWithDup = function(nums) {
    let result = []
    let path = []
    nums.sort((a, b) => {
        return a - b
    })
    function backtracing(startIndex) {
        result.push([...path])
        for(let i = startIndex; i < nums.length; i++) {
            if(i > startIndex && nums[i] === nums[i - 1]) {
                continue
            }
            path.push(nums[i])
            backtracing(i + 1)
            path.pop()
        }
    }
    backtracing(0, nums)
    return result
};
```

# 递增子序列

```javascript
// 求递增子序列问题，因为是求得是递增的子集，所以不可以排序！
// 不可以排序，所以一般的去重法失效了
// 要选择另一种去重的方法 uset
var findSubsequences = function(nums) {
    let result = []
    let path = []
    function backtracing(startIndex) {
        // 终止条件：至少有两个元素
        if(path.length > 1) {
            result.push([...path])
        }
        // 在每次循环之前定义一个uset来帮助去重，目地是使得每个分支去重
        let uset = []

        for(let i = startIndex; i < nums.length; i++) {
            // 当满足加入path的元素不是满足可以成为递增子序列时
            if((path.length > 0 && nums[i] < path[path.length - 1])) {
                continue;
            }
            // 当使用过了
            // 为什么不选择使用uset[i]的方式，因为我们要标记的是相同元素，i都是不同的
            if(uset[nums[i] + 100]) continue;
            uset[nums[i] + 100] = true;// 排列不需要回溯辅助去重的数组
            path.push(nums[i])
            backtracing(i + 1)
            path.pop()
        }
    }
    backtracing(0)
    return result
};
```
# 全排列

```js
// 全排列问题：此题不包含重复数字，求全排列
// 组合问题可以通过排序再比较前后来去重
// 全排列去重是定义一个全局变量used来记录nums中的元素有没有重复使用
// 并且要记得回溯uset
var permute = function(nums) {
    const res = [], path = [], used = [];
    nums.sort((a, b) => a - b)
    const len = nums.length;
    function backtracking(nums) {
        // 终止条件
        if(path.length === len){
            res.push([...path]);
            return;
        }
        // 全排列问题从i的初始值为0开始，不需要startIndex
        for(let i = 0;i < len;i++){
            // 定义的used数组来判断
            if(used[i]) continue;// 判断同一条路径下不可以用同一个数字
            path.push(nums[i]);
            used[i] = true;
            backtracking();
            path.pop();
            used[i] = false;
        }
    }
    backtracking();
    return res;
};
```

# 全排列II

```js
// 全排列问题：可有重复数字的序列，则需要两个去重细节
// 1.为一个path上的是否重复使用同一个下标下的元素
// 2.因为有重复数字，所以需要判断同一个数层是否用过
// i > 0 && nums[i] === nums[i - 1] && !used[i - 1] 组合问题是需要加第三个条件的
var permuteUnique = function (nums) {
    nums.sort((a, b) => {
        return a - b
    })
    let result = []
    let path = []
    let used = []
    function backtracing() {
        
        if (path.length === nums.length) {
            result.push([...path])
            return;
        }

        for (let i = 0; i < nums.length; i++) {
            // 
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                continue;
            }
            if (!used[i]) {
                used[i] = true; path.push(nums[i]);
                backtracing();
                path.pop();used[i] = false;
            }
        }
    }
    backtracing()
    return result
};
```


## 迭代法

### 前

```js
var preorderTraversal = function(root) {
    // 迭代法完成二叉树的前序遍历
    // 使用栈来完成，因为栈是先进后出，所以入栈的顺序是中右左
    // 树节点可能为0，需要判断一下,返回一个空数组即可。
    // 递归的实现就是：每一次递归调用都会把函数的局部变量、参数值和返回地址等压入调用栈中，
    // 然后递归返回的时候，从栈顶弹出上一次递归的各项参数，
    // 所以这就是递归为什么可以返回上一层位置的原因。
    let res = [];
    if(!root)return res;
    // 把根节点root直接push入栈，方便不影响后续在循环里的逻辑
    const stack = [root];
    let cur = null;// cur来处理当前节点的值
    // 进入while循环
    while(stack.length){// 循环条件是当stack为空则结束
        cur = stack.pop();// 如果是root出栈，则stack为null了
        res.push(cur.val);
        cur.right && stack.push(cur.right);// 需要右节点是否为空
        cur.left && stack.push(cur.left);
    }
    return res;
};
// 不可以使用队列来完成二叉树的遍历，无法模拟递归的过程,栈可以保证一个子树全部遍历完再遍历另一个子树
// var preorderTraversal = (root) =>{
//     let res = [];
//     if(!root)return res;
//     const queue = [root];
//     let cur = null;// 避免在循环里重复定义
//     while(queue.length){
//         cur = queue.shift();
//         res.push(cur.val);
//         cur.left && queue.push(cur.left);
//         cur.right && queue.push(cur.right);
//     }
//     return res;
// }

```
### 中

```js
// 左左左
var inorderTraversal = function(root, res = []) {
    // 中序遍历不同于上面的，需要先最左边的子树的节点再进行遍历
    const stack = [];// 定义空栈
    let cur = root;
    while(stack.length || cur){ // 栈会空，但是可以通过cur还可以指向来判断是否停止循环
        if(cur){
            stack.push(cur);
            cur = cur.left;
        }else {
            cur = stack.pop();
            res.push(cur.val);
            cur = cur.right;
        }
    }
    return res;
}
```
```js
var inorderTraversal = function(root) {
    const res = [];
    const stk = [];
    while (root || stk.length) {
        // 把一边上的所有的左孩子都入栈
        while (root) {
            stk.push(root);
            root = root.left;
        }
        // 中序遍历，左中右
        root = stk.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};
```

### 后

```js
// 后序遍历的迭代法，基本与前序遍历的一样
// 左右孩子入栈的顺序不同，最后记得翻转
var postorderTraversal = function(root, res = []) {
    if (!root) return res;
    const stack = [root];
    let cur = null;
    while(stack.length){
        cur = stack.pop();
        res.push(cur.val);
        cur.left && stack.push(cur.left);
        cur.right && stack.push(cur.right);
    } 
    return res.reverse();
};
```
## 层序遍历

```javascript
var levelOrder = function(root) {
    //二叉树的层序遍历，用队列来完成的，循环条件是队列的长度即可，空则跳出。
    //层序遍历，则需要每一层的节点，则需要添加for循环来存放节点，每一次存放节点的同时
    //需要把左右孩子也入列，res存储结果即可
    let res = [], queue = [];

    if(root === null) {
        return res;
    }
    queue.push(root);
    // 不是回溯，所以path要在循环里定义
    // 因为结果要求[[],[]],所以在while循环中，嵌套for循环，方便把每一层都存放在数组里面，
    //此时每遍历一个节点就可以把他的左右孩子放入队列中，方便后续的遍历
    while(queue.length) {
        // 记录当前层级节点数
        let length = queue.length;
        //存放每一层的节点 
        let curLevel = [];
        for(let i = 0;i < length; i++) {
            let node = queue.shift();
            curLevel.push(node.val);
            // 存放当前层下一层的节点
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
        //把每一层的结果放到结果数组
        res.push(curLevel);
    }
    return res;
};
```
## 翻转二叉树

- 遍历的过程中去翻转每一个节点的左右孩子就可以达到整体翻转的效果。
- 注意只要把每一个节点的左右孩子翻转一下，就可以达到整体翻转的效果
- 注意递归的单层逻辑要对节点进行操作的时候，判断的返回值的必须是null，否则无法处理
```js
var invertTree = function (root) {
    if(!root)return root;
    let leftNode = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(leftNode);
    return root;
}
```
## 对称二叉树

```javascript
// XXXXXXXXXXXXXXXX

// var isSymmetric = function(root) {
//     // 检查root
//     if(root.length === 1)return ture;
//     // 检查其是否轴对称，则返回值就是boolean类型的
//     const dfs = (root) =>{
//         // 终止条件
//         if(!root)return true;
//         if(root.left === null && root.right !== null 
//             || root.left !== null && root.right === null) 
//             return false;
//         if(root.right.val !== root.left.val) return false
//         dfs(root.left);
//         dfs(root.right);
//     }
// };

// 这段代码的if-else出现错误
// if (!left && !right) {
//     return true;
// } else if ((!left && right) || (left && !right)) {
//     return false;
// } else if (left.val === right.val) {
//     return true;
// } else if (left.val !== right.val) {
//     return false;
// }


// 完美逻辑：
// 比较有无单一为null
// 比较两个为null
// 比较值是否相同
var isSymmetric = function(root) {
    // 因为是判断左右是否对称，所以参数需要两个
    if(root.length === 1)return ture;
    const compareNode = (left,right) => {
        // 2. 确定终止条件 空的情况
        if(left === null && right !== null || left !== null && right === null) {
            return false;
        } else if(left === null && right === null) {
            return true;
        } else if(left.val !== right.val) {
            return false;
        }

        return compareNode(left.left,right.right) && compareNode(left.right,right.left);
    }
    return compareNode(root.left,root.right);
};
```

## 求二叉树的最大深度
```js
var maxDepth = function(root) {
    // 使用递归的方法 递归三部曲
    // 1. 确定递归函数的参数和返回值
    // 返回值：最大深度,参数：root
    const getdepth = function(node) {
        // 2. 确定终止条件
        // 空节点就返回 0
        if(node === null) {
            return 0;
        }
        // 3. 确定单层逻辑
        // 求最大深度思考使用什么遍历顺序最方便呢？
        // 后序遍历是通过到叶子节点开始的
        // 因此可以用后序遍历来记录、累加左右子树的高度
        let leftdepth = getdepth(node.left);
        let rightdepth = getdepth(node.right);
        // 每一次进行遍历，无论是左子树还是右子树，他的高度都要加一
        let depth = 1 + Math.max(leftdepth, rightdepth);
        return depth;
    }
    return getdepth(root);
}
```

## 最小深度

```javascript
// 确定参数和返回值：root，最小深度
// 求最小深度，就是找到叶子节点到root的距离
var minDepth = function(root) {
    const getMinDepth = (node)=>{
        if(!node) return 0;
        let leftDepth = getMinDepth(node.left);
        let rightDepth = getMinDepth(node.right);
        // 对比求最大深度的不同，因为min会使只有一个节点的子树的最小高度为0，那么此时需要我们手动
        // 使得有一个子树的最小深度是1
        if(node.left === null && node.right !==null) return 1+rightDepth;
        if(node.left !== null && node.right === null) return 1+leftDepth;
        return 1 + Math.min(leftDepth,rightDepth)
    };
    return getMinDepth(root);
};
```

## 完全二叉树的节点数
```javascript
var countNodes = function(root) {
    const getNodeSum = (node)=>{
        //终止
        if(node === null)return 0;
        //单层
        let leftNum = getNodeSum(node.left);
        let rightNum = getNodeSum(node.right);
        // 后序遍历，直接向上累加了
        return 1 + leftNum + rightNum;
    };
    return getNodeSum(root);
};
```
## 平衡二叉树

```javascript
var isBalanced = function(root) {
    // 判断是否是平衡二叉树，确定返回值：1.需要返回左右子树的最大高度2.当出现不符合条件的返回-1
    // 思考求最大深度那个题目，递归求得左右子树的高度，返回1 + 其中的最大深度
    // 基本思路围绕展开
    // 如果高度差会大于1的话，返回-1，则在求左右子树的高度的时候，判断是否-1，则可以直接判断是否符合条件了。
    const getDepth = (node) => {
        // 空节点则return 0
        if(!node) return 0;

        let leftDepth = getDepth(node.left);
        // 已经不符合条件，返回-1
        if(leftDepth === -1) return -1;

        let rightDepth = getDepth(node.right);
        if(rightDepth === -1) return -1;
        
        if(Math.abs(leftDepth - rightDepth) > 1){
            return -1;
        }else{
            return 1 + Math.max(leftDepth,rightDepth);
        }
    }
    return !(getDepth(root) === -1);
};
```
## 二叉树的所有路径

```javascript
// 求二叉树的路径，不需要返回值。
var binaryTreePaths = function(root) {
   //递归遍历+递归三部曲
   let res = [];
   //1. 确定递归函数 函数参数
   const getPath = function(node,curPath) {
        //2. 确定终止条件，到叶子节点把结果存储；遇到空节点则直接返回。
        if(!root) return;
        if(node.left === null && node.right === null) {
           curPath += node.val;
           res.push(curPath);
           return;
        }
        //3. 确定单层递归逻辑
        curPath += node.val + '->';
        getPath(node.left, curPath);
        getPath(node.right, curPath);
   }
   getPath(root, '');
   return res;
};
```
## 左叶子之和

```javascript
var sumOfLeftLeaves = function(root) {
    // 采用后序遍历，需要通过递归函数的返回值来累加左叶子数值和
    // 求和问题用后序相加
    // 进行累加即可
    // 1. 确定递归函数参数和返回值：累加需要和为返回值
    const nodesSum = function(node) {
        // 2. 确定终止条件，最后的节点为空，则返回数值0
        if(node === null) {
            return 0;
        }
        // 求得左右子树左叶子的和
        let leftValue = nodesSum(node.left);
        let rightValue = nodesSum(node.right);
        // 3. 单层递归逻辑
        // 求得当前的子树是否有左叶子
        let midValue = 0;
        if(node.left && node.left.left === null && node.left.right === null) {
            midValue = node.left.val;
        }
        // 把每个子树和当前子树的左叶子累加
        return midValue + leftValue + rightValue;
    }
    return nodesSum(root);
};

```
## 找树左下角的值

**递归**
```js
// 二叉树的题目，都是去利用遍历顺序去加入一下技巧去处理的
// 需要找到树左下角的值：在树的最后一行找到最左边的值。
// 可以发现找到最后一行，不需要要求遍历顺序，需要去处理去标记
// 哪一行是最后一行，于是乎，参数需要多一个
// 来比较什么时候是最后一层
var findBottomLeftValue = function(root) {
    //首先考虑递归遍历 前序遍历 找到最大深度的叶子节点即可
    let maxPath = 0, resNode = null;
    // 1. 确定递归函数的函数参数，通过参数进行传递高度
    const dfsTree = function(node, curPath) {
        // 2. 确定递归函数终止条件
        if(!node) return;
        // 并且左子树优先递归，在同一层上只会统计一次resNode的值
        // 只要满足是叶子节点即可
        if(node.left === null && node.right === null) {
            if(curPath > maxPath) {
                maxPath = curPath;
                resNode = node.val;
            }
            return;
        }
        // 左节点优先递归，在同一高度下，只记录一次value
        dfsTree(node.left, curPath + 1);
        dfsTree(node.right, curPath + 1);
    }
    // 高度默认为1
    dfsTree(root,1);
    return resNode;
};
```
**层序遍历**

```javascript
var findBottomLeftValue = function(root) {
    //考虑层序遍历 记录最后一行的第一个节点
    let queue = [];
    if(root === null) { 
        return null;
    }
    queue.push(root);
    let resNode;
    while(queue.length) {
        // 必须缓存
        let length = queue.length;
        for(let i = 0; i < length; i++) {
            let node = queue.shift();
            if(i === 0) {
                resNode = node.val;
            }
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
    }
    return resNode;
};
```

## 路径总和

```js
// 确定参数和返回值：参数上增加cur来进行判断
var hasPathSum = function(root, targetSum) {
    if(!root) return false;
    // 确定参数:剩余和保留下来
    // 返回值就是boolean类型
    const pathSum = (node, cur) => {
        // 判断条件
        if(!node) return false;
        // 到了叶子节点，进行判断剩下的是否可以满足相等
        if(!node.left && !node.right){
            return cur === node.val;
        }
        cur -= node.val;
        // 考虑到返回值是true/false,那么我们需要对左右子树的结果进行判断
        let left = pathSum(node.left, cur);
        let right = pathSum(node.right, cur);
        return left || right;// 只要一个为true即可
    }
    return pathSum(root, targetSum);
};
```

## 路径总和II

```js
var binaryTreePaths = function(root) {
    let res = [];
    // 确定参数和返回值:需要把路径传递下去，那么需要两个参数
    // 叶子节点需要进行记录,空节点则返回空
    const getAllPath = (root,cur) =>{
        if(!root) return;
        // 叶子结点
        if(!root.left && !root.right){
            cur += root.val;
            res.push(cur);
        }
        cur += root.val + "->"
        getAllPath(root.left,cur);
        getAllPath(root.right,cur);
    }
    getAllPath(root,'')
    return res;
};

```

## 从中序与后序遍历序列构造二叉树

```js
// indexof 获取下标 slice()裁剪 : 0,n裁剪0到n，参数如果为n,那么裁剪n以前的。
// 确定参数和返回值
// 构造二叉树，返回值是新的节点
const buildTree = (inorder, postorder) => {
  // 终止条件
  if (!inorder.length) return null;

  const rootValue = postorder.pop();
  const rootIndex = inorder.indexOf(rootValue);
  const root = new TreeNode(rootValue);

  root.right = buildTree(inorder.slice(rootIndex + 1), postorder.slice(rootIndex)); // 创建右节点
  root.left = buildTree(inorder.slice(0, rootIndex), postorder.slice(0, rootIndex)); // 创建左节点

  return root;
};
```
## 从前序与中序遍历序列构造二叉树
```js
var buildTree = function(preorder, inorder) {
  if (!preorder.length) return null;
  const rootVal = preorder.shift(); // 从前序遍历的数组中获取中间节点的值， 即数组第一个值
  const index = inorder.indexOf(rootVal); // 获取中间节点在中序遍历中的下标
  const root = new TreeNode(rootVal); // 创建中间节点
  root.left = buildTree(preorder.slice(0, index), inorder.slice(0, index)); // 创建左节点
  root.right = buildTree(preorder.slice(index), inorder.slice(index + 1)); // 创建右节点
  return root;
};
```

**前序和后序不能唯一确定一棵二叉树！，因为没有中序遍历无法确定左右部分，也就是无法分割。**
## 最大二叉树

```js
// 确定参数：对分下来的数组进行切割，派分
// 确定返回值，创建新的节点，那么就是返回 root
function constructMaximumBinaryTree(nums) {
  if (nums.length === 0) {
    return null;
  }
  // 找到最大值及其索引
  let maxVal = nums[0];
  let maxIndex = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > maxVal) {
      maxVal = nums[i];
      maxIndex = i;
    }
  }
  // 创建根节点
  const root = new TreeNode(maxVal);
  // 构建左子树
  root.left = constructMaximumBinaryTree(nums.slice(0, maxIndex));
  // 构建右子树
  root.right = constructMaximumBinaryTree(nums.slice(maxIndex + 1));
  return root;
}

```
## 合并二叉树
```js
// 确定参数和返回值：参数（左左合并、右右合并），返回值（节点，我们可以依据root1来进行构造，在后序遍历中返回即可）
var mergeTrees = function(root1, root2) {
    // 确定终止条件，当遇到空节点的时候，我们需要处理节点                   
    if (!root1)
        return root2
    if (!root2)
        return root1;
    // 进行和操作
    root1.val += root2.val;
    // 构造新的子树
    root1.left = mergeTrees(root1.left, root2.left);
    root1.right = mergeTrees(root1.right, root2.right);
    // 返回新的root节点
    return root1;
};
```
##  二叉搜索树中的搜索

```javascript
// 二叉树中的搜索，返回值要求是返回符合条件的节点
// 因为是搜索二叉树，是有序的，左小右大
// 所以if语句判断，进入分支，一旦找到了就不会进入其他分支
// 确定参数、返回值
var searchBST = function (root, val) {
    // 终止条件，当找到是叶子节点或者找到了，那就返回节点即可
    if (!root || root.val === val) {
        return root;//此处返回了root，后续的左右递归后可以不考虑再返回root
    }
    // 对于搜索二叉树的查找，必定可以进行剪枝
    if (root.val > val)// 实际上进入该分支完成了两件事，查找，返回，此处的返回相当于后序遍历返回节点
        return searchBST(root.left, val);
    if (root.val < val)
        return searchBST(root.right, val);
};
```

## 验证搜索二叉树

```js
// 验证搜索二叉树确定参数与返回值
// 参数：root，上下限，返回值：boolean类型
// 遇到叶子节点，返回true即可
// 遇到不在区间的返回false
// 进行递归，左子树递归存在的是上限，右子树存在的是下限
// 我们要比较的是 左子树所有节点小于中间节点，右子树所有节点大于中间节点。
var isValidBST = function(root) {
    let pre = null;
    const inOrder = (node) => {
        // 终止条件,能到叶子节点那么就是 ture
        if(node === null) return true;
        let left = inOrder(node.left);
        // 中序比较
        if(pre !== null && pre.val >= node.val) {
            return false;
        }
        pre = node;
        let right = inOrder(node.right);
        return right && left;
    }
    return inOrder(root);
};
```
## 二叉搜索树的最小绝对差

```js
// 由题意可知，只要根据前后指针来判断差值的大小即可
// 确定参数和返回值：只需要定义一个res来存储最大值即可，不需要返回值
// 中序遍历下，是一个有序数组。
var getMinimumDifference = function(root) {
    let res = Infinity;
    let preNode = null;// 前指针的初始值设置为null
    const inorder = (node)=>{
        //终止条件
        if(!node)return;
        inorder(node.left);
        // 确保第一次进入该分支时，不会报错
        if(preNode){
            res = Math.min(res, node.val - preNode.val)
        }
        preNode = node;
        inorder(node.right)
    }
    inorder(root);
    return res;
};
```

## 二叉搜索树中的众数

```js
var findMode = function(root) {
    let base = -Infinity, count = 0, maxCount = 0;
    let answer = [];
    // 主要是学会判断众数的逻辑判断
    // 变量定义和参数：参数是传进来的节点的val值，进入分支
    // base 设置为前一个的val值，所有第一个分支直接判断等于与否即可
    // 否则就count为1，base设置为x的值
    // 判断count与maxCount的大小即可
    const update = (x) => {
        if (x === base) {
            ++count;
        } else {
            count = 1;
            base = x;
        }
        if (count === maxCount) {
            answer.push(base);
        }
        if (count > maxCount) {
            maxCount = count;
            answer = [base];
        }
    }

    const dfs = (o) => {
        if (!o) {
            return;
        }
        dfs(o.left);
        update(o.val);
        dfs(o.right);
    }

    dfs(root);
    return answer;
};
```

## 二叉搜索树的最近公共祖先

```js
// 找到最近的公共祖先，换而言之就是找到第一个root满足在p q区间之间即可
// 由于是二叉搜索树，我们可以考虑只有出现在[p, q]里的root.val那么就是满足条件了
var lowestCommonAncestor = function(root, p, q) {
    // 使用递归的方法
    // 1. 使用给定的递归函数lowestCommonAncestor
    // 2. 确定递归终止条件
    // 二叉搜索树的中序遍历是有序的，但是此题并没有考虑使用，直接判断给定的区间来寻找
    // 终止条件：遇到null则return
    if(root === null) {
        return null;
    }
    // 对于不在区间的进行定向查询
    // 如果都大于，那么再左子树进行查找
    if(root.val > p.val && root.val > q.val) {// 加两个的原因是q和p的值不一定是一大一小
        return lowestCommonAncestor(root.left, p, q);
    }
    // 如果都小于，那么在右子树进行查找
    if(root.val < p.val && root.val < q.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    // 当在p,q区间里，那么就可以直接返回了，所以上面的都是return
    return root;
};
```

## 二叉搜索树的插入操作

```js
// 插入操作，实际上只要找到符合条件可以插入的位置就可以
// 如何寻找呢？由题意可知道，我们只要在该二叉搜索树中不断缩小区间
// 直到return root为null
// 那么可以在该节点创建新的node节点
// 确定参数和返回值：返回值是返回新的节点
var insertIntoBST = function(root, val) {
      const setInOrder = (root, val) => {
        // 缩小区间找到空节点
        // 返回插入的新的root
        if (root === null) {
            let node = new TreeNode(val);
            return node;
        }
        // 剪枝，快速查找
        if (root.val > val)
            root.left = setInOrder(root.left, val);
        else if (root.val < val)
            root.right = setInOrder(root.right, val);
        // 相当于后序遍历的返回根节点
        return root;
    }
    return setInOrder(root, val);
};
```

## 删除二叉搜索树中的节点

### 方法一——情况四直接手动操作

```js
// 删除二叉搜索树的一个节点，有以下几种情况：1.找不到2.是叶子节点3.左孩子在右孩子不在4.左孩子不在右孩子在5.左右孩子都不在
// 参数与返回值：返回值，新的节点
var deleteNode = function(root, key) {
    // 找不到，遇到空节点，返回null节点。
    if (root === null) return null;
    // 找到了
    if (root.val === key) {
        // 叶子节点
        if (root.left === null && root.right === null) return null;
        // 左为空
        if (root.left === null) return root.right;
        // 右为空
        if (root.right === null) return root.left;
        // 左右都有
        let curNode = root.right;
        while (curNode.left !== null) {
            curNode = curNode.left;
        }
        curNode.left = root.left;
        return root.right;
    }
    // 通过if判断来快速查找到 key所在之处
    if (root.val > key) root.left = deleteNode(root.left, key);
    if (root.val < key) root.right = deleteNode(root.right, key);
    // 最后递归返回根节点
    return root;
};
```

### 方法二——递归处理情况四

```javascript
var deleteNode = function(root, key) {
    if (!root) return null;
    if (key > root.val) {
        root.right = deleteNode(root.right, key);
        return root;
    } else if (key < root.val) {
        root.left = deleteNode(root.left, key);
        return root;
    } else {
        // 场景1: 该节点是叶节点
        if (!root.left && !root.right) {
            return null
        }
        // 场景2: 有一个孩子节点不存在
        if (root.left && !root.right) {
            return root.left;
        } else if (root.right && !root.left) {
            return root.right;
        }
        // 场景3: 左右节点都存在
        const rightNode = root.right;
        // 获取最小值节点
        const minNode = getMinNode(rightNode);
        // 将待删除节点的值替换为最小值节点值
        root.val = minNode.val;
        // 删除最小值节点
        root.right = deleteNode(root.right, minNode.val);
        return root;
    }
};
function getMinNode(root) {
    while (root.left) {
        root = root.left;
    }
    return root;
}
```
## 修建二叉树
```javascript
// 思考：root.val不在区间里，那么放弃左子树或者右子树
// 然后再返回裁剪的右子树或者左子树
var trimBST = function(root, low, high) {
    if (!root) {
        return null;
    }
    // 前序遍历进行裁剪
    if (root.val < low) {
        // 左子树都不符合，返回裁剪的右子树，为什么不是直接返回右节点
        // 实际上是因为我们要对右节点的树也要进行排查
        return trimBST(root.right, low, high);
    } else if (root.val > high) {
        // 右子树都不符合，返回裁剪的左子树
        return trimBST(root.left, low, high);
    } 
    // 重新指向返回裁剪后的子树
    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);
    // 递归返回根节点
    return root;
};
```

## 将有序数组转换为二叉搜索树

**Math.floor**保证是向下保留为整数
```js
// 有序数组转换为搜索二叉树，则中间节点就是根节点
// 所以参数：arr，左边界，右边界；返回值就是新的节点
// 本质就是寻找分割点，分割点作为当前节点，然后递归左区间和右区间。
var sortedArrayToBST = function (nums) {
    // 确定参数和返回值
    // 参数：传进来的数组，左右边界
    const buildTree = (Arr, left, right) => {
        // 终止条件
        // 当左边界大于右边界的时候，返回null即可
        if (left > right)
            return null;
        // 计算切割点mid的位置大小
        let mid = Math.floor(left + (right - left) / 2);
        // 建立新的节点
        let root = new TreeNode(Arr[mid]);
        // 遍历左右区间
        root.left = buildTree(Arr, left, mid - 1);
        root.right = buildTree(Arr, mid + 1, right);
        // 返回root节点
        return root;
    }
    return buildTree(nums, 0, nums.length - 1);
};
```

## 把二叉搜索树转换为累加树
```js
// 确定参数和返回值，终止条件（return什么是由返回值决定的）
// 单层逻辑：中序遍历，需要在函数外保存一个变量
// 从树中可以看出累加的顺序是右中左，所以我们需要反中序遍历这个二叉树，然后顺序累加就可以了。
var convertBST = function(root) {
    // 设置pre的初始值
    let pre = 0;
    const ReverseInOrder = (cur) => {
        // 终止条件
        if(!cur) return;
        // 右中左
        ReverseInOrder(cur.right);
        cur.val += pre;
        pre = cur.val;
        ReverseInOrder(cur.left);
    }
    ReverseInOrder(root);
    return root;
};
```
# 总结
- 01背包问题：物品只能装一次
  - 重量数组、价值数组、容量
  - dp的含义：容量为i的背包可以装下最大的价值为dp[i]（i -> i -> len + 1）
  - 初始化：没装的前提下，装下的价值为0
  - 遍历顺序：先遍历物品，一次一次遍历，不重复
  - dp数组为一维，那么需要倒叙遍历，不重复，满足条件是**背包容量大于单个物品的重量**
  - dp公式：dp[j] = Math.max(dp[j], value[i] + dp[j - wight[i]])**(装与不装)**
- 完全背包问题：物品可以无限装
  - 如果求**组合数**就是外层for循环遍历物品，内层for遍历背包
  - 如果求**排列数**就是外层for遍历背包，内层for循环遍历物品
  - 零钱兑换：零钱无限，求方案的组合数
    - 方案数的初始化：dp[0] = 1
    - 本题是求凑出来的方案个数，且每个**方案个数**是为组合数
  - 组合总和：求排列数
    - 先背包再物品
    - 必须等**i > weight[j]**才更新
  - 卡玛网爬楼梯：求排列数
  - 零钱兑换：求最少的硬币个数
    - **本题求钱币最小个数**，那么钱币有顺序和没有顺序都可以，都不影响钱币的最小个数。
    - 完全背包问题，还是要装，先遍历物品更好看一点
    - dp公式：dp[j] = Math.min(dp[j - coin[i]] + 1, dp[j])
  - 完全平方数：组合数
    - 注意外层循环我们可以用i * i <= n来界定
- 打家劫舍
  - 到第i个房获取到的**最多钱为dp[i]**
  - 初始化前两个
  - 抢与不抢的问题
- 最长公共子序列
  - 比较两个序列的元素相等的问题
    - -> 用len + 1的长度定义，初始化为0，比较A[i - 1]与B[j - 1]
  - 派生
    - -> dp含义：**长度为i,j**的两个子串的最长公共子序列的长度为dp[i][j]
    - -> 两种情况：相等时dp[i][j] = dp[i - 1][j - 1] + 1;不相等时dp[i][j] = Math.max(,)
  - 非派生
    - -> dp含义：**以A[i],B[j]为结尾**的子数组最大长度为dp[i][j]
    - -> 一种情况：相等时dp[i][j] = dp[i - 1][j - 1] + 1;及时更新即可
  - 单个数组比大小的问题
    - 非派生
      - dp含义：**以子序列以nums[i]结尾**的数组，最长连续递增序列的长度为dp[i]，dp[i + 1] = dp[i]+ 1
    - 派生
      - dp含义：**以子序列以nums[i]结尾**的数组，最长连续递增序列的长度为dp[i]
      - 因为是派生比较大小，一个循环无法确定（无法跳着比较），必须进行两个循环
      - 循环是恰着区间进行的：i = 1, i < len / j = 0, j < i
      - dp公式：dp[i] = Math.max(dp[i], dp[j] + 1)
    - 求和最大
      - 贪心求解即可，遇到单次统计的结果小于0的，我就进行重置就可以
- 回文子串问题
  - dp递推公式是要求dp[i + 1][j - 1]来界定dp[i][j]的，所以我们的顺序从后往前
  - 遍历顺序
    - i = len - 1, i >= 0, i--
    - j = i, j < len, j++
    - （连续）当s[i] === s[j],有三种情况：相差为0、相差为1，相差大于1
  - 派生问题
    - 确定dp数组的含义：区间i,j中dp[i][j]即为最长回文子序列的长度，默认给0
    - 求数目：
      - s[i] === s[j],相差为0，dp[i][j] = 1;相差大于1，dp[i][j] = dp[i + 1][j - 1] + 2
      - s[i] !== s[j],dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
  - 非派生问题
    - dp数组的含义：在区间**i,j**的子串是否是回文串是由dp[i][j]决定的,初始化dp数组：默认是false
    - s[i] === s[j]
      - 相差为小于1，dp[i][j] = true
      - 相差为大于1，取决于dp[i + 1][j - 1]再dp[i][j] = true
      - 内循环更新子串
- 股票问题
  - 买卖一次
    - 贪心算法：遍历一次，找到最小的low，进行买，对比res
    - 动态规划：
      - hold：确定dp数组的含义：第i天最低价是dp[i - 1]，初始化最大，后续会进行比较
      - unhold：确定dp数组的含义：第i天获取利润最高价是dp[i - 1]，初始化为0，后续比较
      - hold[0]需要去进行初始化，否则更新不了
  - 买卖多次
    - 贪心算法：每一次都进行比价，有利润就存下来

# 前言
- 动态规划中每一个状态一定是由上一个状态推导出来的，这一点就区分于贪心，贪心没有状态推导，而是从局部直接选最优的。



# 动规五部曲

- 确定dp数组（dp table）以及下标的含义
- 确定递推公式
- dp数组如何初始化
- 确定遍历顺序
- 打印dp数组

# 使用最小花费爬楼梯

```js
// 确定dp数组的含义：爬到i阶梯的最小花费是dp[i]
// 确定递推公式：因为爬到i阶，只有两种可能的方式爬
// 来自i-1或者i-2阶，则dp[i]=Math.min(dp[i-1]+cost[i-1],dp[i-2]+cost[i-2])
// dp数组如何初始化：因为可以选择0或者1阶开始爬楼梯，dp[0]=dp[1]=0
// 该dp数组是一维的，遍历顺序是从前往后的。
// 需要稍微注意的就是dp数组初始化时的长度问题，当是第i的dp[i]怎么样
// 定义时，需要记得是length+1
var minCostClimbingStairs = function(cost) {
    const len = cost.length;
    // 定义dp
    const dp = Array(len + 1);
    // 初始化
    dp[0] = dp[1] = 0;
    for(let i = 2;i <= len;i++){
        dp[i] = Math.min(dp[i-1]+cost[i-1],dp[i-2]+cost[i-2]);
    }
    return dp[len];
};
```
# 不同路径

```js
// 确定dp数组的含义：到达第ixj阶有dp[i][j]种方法
// 确定递推公式：达到ixj只有两种可能，就是来自上方或者左方:dp[i][j] = dp[i-1][j] +dp[i][j-1]
// 定义dp的长度问题：dp[m-1][n-1]个方法符合所求得含义
// 初始化：第0行都是1
var uniquePaths = function(m, n) {
    let dp = new Array(m).fill().map(()=>Array(n).fill());
    //初始化
    for(let i = 0;i < m;i++){
        dp[i][0] = 1;
    }
    for(let j = 0;j < n;j++){
        dp[0][j] = 1;
    }
    //遍历
    for(let i = 1;i < m;i++){
        for(let j = 1;j < n;j++){
            dp[i][j] = dp[i-1][j] +dp[i][j-1]
        }
    }
    return dp[m-1][n-1];
};
```
# 不同路径II

```javascript
var uniquePathsWithObstacles = function(obstacleGrid) {
    const m = obstacleGrid.length
    const n = obstacleGrid[0].length
    const dp = Array(m).fill().map(item => Array(n).fill(0))

    for (let i = 0; i < m && obstacleGrid[i][0] === 0; ++i) {
        dp[i][0] = 1
    }

    for (let i = 0; i < n && obstacleGrid[0][i] === 0; ++i) {
        dp[0][i] = 1
    }

    for (let i = 1; i < m; ++i) {
        for (let j = 1; j < n; ++j) {
            dp[i][j] = obstacleGrid[i][j] === 1 ? 0 : dp[i - 1][j] + dp[i][j - 1]
        }
    }

    return dp[m - 1][n - 1]
};

// 版本二：内存优化，直接以原数组为dp数组
var uniquePathsWithObstacles = function(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (obstacleGrid[i][j] === 0) {
                // 不是障碍物
                if (i === 0) {
                    // 取左边的值
                    obstacleGrid[i][j] = obstacleGrid[i][j - 1] ?? 1;
                } else if (j === 0) {
                    // 取上边的值
                    obstacleGrid[i][j] = obstacleGrid[i - 1]?.[j] ?? 1;
                } else {
                    // 取左边和上边的和
                    obstacleGrid[i][j] = obstacleGrid[i - 1][j] + obstacleGrid[i][j - 1];
                }
            } else {
                // 如果是障碍物，则路径为0
                obstacleGrid[i][j] = 0;
            }
        }
    }
    return obstacleGrid[m - 1][n - 1];
};
```

# 整数拆分

```javascript
// 确定dp数组的含义:i的整数拆分的最大乘积是dp[i]
// 确定定义时dp的长度，dp[len-1]个方法？2->dp[1]???所以初始化的时候需要加一
// 递推公式：dp[i]=Math.max(dp[i],j*(i-j),dp[i-j]*j),拆分更大的数
var integerBreak = function(n) {
    let dp = new Array(n+1).fill(0);
    //初始化
    dp[0] = 0,dp[1] = 0,dp[2] = 1;
    //遍历
    for(let i = 3;i <= n;i++){
        for(let j = 1;j <= i/2;j++){
            dp[i] = Math.max(dp[i],j*(i-j),dp[i-j]*j)
        }
    }
    return dp[n];
};
//加上dp[i]的原因？我们会尝试不同的j值进行拆分，在一个j值拆分的时候，
//根据上面介绍的两种情况取最大，那么如果我们换下一个j的时候，

```
# 不同的二叉搜索树

```js
// 确定dp数组的含义：i个节点构成不同的搜索二叉树dp[i]种
// 思路：第一层循环确定i个节点构成的dp[i]种，第二层循环把根节点拿出来，
// 左右子树的种树相乘即可，为什么是dp[i]+=，因为第二层循环每次都把dp[i]去累加
// 递推公式：dp[i] = dp[i] + dp[j-1]*dp[i-j]
// 初始化：因为是方法所以dp[0]和dp[1]都是1种
const numTrees =(n) => {
    let dp =new Array(n+1).fill(0);
    dp[0]=1,dp[1]=1;
    for(let i=2;i<=n;i++){
        for(let j=1;j<=i;j++){
            dp[i]+=dp[j-1]*dp[i-j];
        }
    }
    return dp[n];
};

```


# 01背包问题

```js
// wight:物品的重量 value：物品的价值 size：背包的容量
// 分析一下递推公式: 因为是通过一维数组来迭代：每次更新在装与不装的情况决定
// 递推公式： dp[j] = Math.max(dp[j],value[i] + dp[j - wight[i]])
function testWeightBagProblem(wight, value, size) { 
    const len = wight.length;
    // 定义dp数组
    const dp = Array(size + 1).fill(0);
    for(let i = 0;i < len;i++){// 01背包问题，先遍历物品。
        for(let j = size;j >= wight[i];j--){
            // 倒叙遍历，不会影响前一次物品遍历的基本数据
            // for循环的条件就是背包的剩余容量要大于本次物品的重量
            dp[j] = Math.max(dp[j],value[i] + dp[j - wight[i]]);
        }
    }
    return dp[size];
}

```
# 分割等和子集

```js
// 为什么是01背包问题？给定数组从中拿出元素，容量确定，是否可以装。
// 本质是什么呢？就是当前的物品是否装，会直接影响下一次的装与不装或者说装不装的下

var canPartition = function(nums) {
    const sum = nums.reduce((p,v)=>p+v);// 求和
    const len = nums.length;
    if(sum & 1)return false;// sum & 1 尾运算来判断是否是奇数
    // 确定背包容量：sum+1 -> 012345
    const dp = Array(sum/2 + 1).fill(0);
    for(let i = 0;i < len;i++){
        for(let j = sum/2;j >= nums[i];j--){
            dp[j] = Math.max(dp[j],dp[j - nums[i]] + nums[i])
            if(dp[j] === sum)return true;
        }
    }
    return false;
};
```

# 最后一块石头的重量

```js
var lastStoneWeightII = function (stones) {
    const sum = stones.reduce((p,v)=>p+v);
    const dpLen = Math.floor(sum/2);//js默认会处理成小数，需要用.floor来处理
    const dp = Array(1+dpLen).fill(0);

    for(let i =0;i < stones.length;i++){
        for(let j = dpLen;j >= stones[i];j--){
            dp[j] = Math.max(dp[j],dp[j - stones[i]] + stones[i])
        }
    }
    return sum - dp[dpLen] * 2;
};
```
# 目标和

```javascript
// 确定dp数组的含义：有dp[i]种方法使得目标和成立
// 递推公式：涉及方法的递推直接累加就完事dp[j] += dp[j - nums[i]]
// 初始化:dp[0] = 1,否则后序遍历dp数组的所有元素都是0
// 遍历顺序：经典01背包找最多方法的问题，先遍历物品，0 -> nums.length,再遍历背包 size -> j-nums[i] => 0
const findTargetSumWays = (nums, target) => {
    const sum = nums.reduce((p,v)=>p+v);
    // 判断基本条件
    if(Math.abs(target) > sum)return 0;
    if((target + sum) % 2)return 0;
    const halfSum = (target + sum) / 2;

    let dp = Array(halfSum + 1).fill(0);
    dp[0] = 1;

    for(let i = 0;i < nums.length;i++){
        for(let j = halfSum;j >= nums[i];j--){
            dp[j] += dp[j - nums[i]];
        }
    }
    return dp[halfSum];
};
```

# 一和零(最长子集问题)


```js
// 实质就是01背包装的最大个数（价值）问题
const findMaxForm = (strs, m, n) => {
    const dp = Array.from(Array(m+1), () => Array(n+1).fill(0));
    let numOfZeros, numOfOnes;
    // 物品
    for(let str of strs) {
        numOfZeros = 0;
        numOfOnes = 0;    
        for(let c of str) {
            if (c === '0') {
                numOfZeros++;
            } else {
                numOfOnes++;
            }
        }   
            // 背包
            for(let i = m; i >= numOfZeros; i--) {
                for(let j = n; j >= numOfOnes; j--) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - numOfZeros][j - numOfOnes] + 1);
                }
            }
    }
    return dp[m][n];
};
```

# 完全背包

```js
// 先遍历物品，再遍历背包容量
function test_completePack1() {
    let weight = [1, 3, 5]
    let value = [15, 20, 30]
    let bagWeight = 4 
    let dp = new Array(bagWeight + 1).fill(0)

    for(let i = 0; i <= weight.length; i++) {
        for(let j = weight[i]; j <= bagWeight; j++) {
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
        }
    }

    console.log(dp)
}

// 先遍历背包容量，再遍历物品
function test_completePack2() {
    let weight = [1, 3, 5]
    let value = [15, 20, 30]
    let bagWeight = 4 
    let dp = new Array(bagWeight + 1).fill(0)

    for(let j = 0; j <= bagWeight; j++) {
        for(let i = 0; i < weight.length; i++) {
            if (j >= weight[i]) {
                dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
            }
        }
    }

    console.log(2, dp);
}
```


# 零钱兑换

```javascript
const change = (amount, coins) => {
    let dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for(let i =0; i < coins.length; i++) {
        for(let j = coins[i]; j <= amount; j++) {
            dp[j] += dp[j - coins[i]];
        }
    }
    return dp[amount];
}

```

# 最长回文子串
```js
const longestPalindrome = (s) => {
    const len = s.length;
    let res = '';// 记录结果
    // 确定dp数组的含义：在区间i,j的是否是回文串是由dp[i][j]来决定的
    // dp数组的初始化，默认给false，后续需要进行更新时根据它来判断
    let dp = new Array(len).fill().map(() => Array(len).fill(false));
    // 确定遍历顺序，dp[i][j]需要前面的dp[i + 1][j - 1],我们采取后序遍历
    for(let i = len - 1; i >= 0; i--){
        for(let j = i; j < len; j++){
            if(s[i] === s[j]){
                // 当i,j相等或者相差为1时
                if(j - i <= 1){
                    dp[i][j] = true;
                }else if(dp[i + 1][j - 1]){// 当相差大于1
                    dp[i][j] = true;
                }
            }
            // 判断是否需要进行更新子串
            // 当dp[i][j]为true且子串的下标相差大于res的长度，是时候更新了
            // 考虑到区间i,j问题，那么我们进行内循环内进行更新即可
            if(dp[i][j] && j - i + 1 > res.length){
                res = s.slice(i, j + 1);
            }
        }
    }
    return res;
}

```
# 统计字符串里回文子串的数目
```js
// 和求最长回文子串的思路一模一样
// 我们将不进行更新，我们直接用变量来进行保存
// 是true则加1
```
# 最长回文子序列（派生）
```js
const longestPalindromeSubseq = (s) => {
    const len = s.length;
    // 确定dp数组的含义：区间i,j即为最长回文子序列的长度
    // 初始化为0，后续比较的是长度
    const dp = new Array(len).fill().map(() => Array(len).fill(0));
    // 确定递推的公式，两种情况：s[i] === s[j] 时，那么dp[i][j] = dp[i + 1][j - 1] + 2 
    // 或者是 i === j,我们把dp[i][j] = 1
    // 不满足条件时，dp[i][j] = Math(dp[i + 1][j], dp[i][j - 1])
    for(let i = len - 1; i >= 0; i--){
        for(let j = i; j < len; i++){
            if(s[i] === s[j]){
                if(i === j){
                    dp[i][j] = 1;
                }else{
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                }
            }else{
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[0][len - 1];
}

```
# 最长公共子序列
- 派生子序列的问题
- 不是回文，不需要判断s[i]、 s[j],遍历顺序不需要讲究（len - 1, i）
```js
const longestCommonSubsequence = (text1, text2) => {
    const [len1, len2] = [text1.length, text2.length];
    // 确定dp数组的含义：长度为i,j的两个子串的最长公共子序列长度为dp[i][j]
    // 初始化为0,后续会需要进行比较，为了使得dp的含义明显（两个比较）
    const dp = new Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    for(let i = 1; i <= len1; i++){
        for(let j = 1; j <= len2; j++){
            if(text1[i - 1] === text2[j - 1]){
                dp[i][j] = dp[i - 1][j - 1] + 1;
            }else{
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[len1][len2];
}
```
# 最长重复子数组
- 要求**顺序**
- 是需要比较两个
- 递推公式：当满足两个元素相等时dp[i][j] = dp[i - 1][j - 1] + 1
- 我们的来源只有上面的，然后更新res即可
```js
const lengthOfLIS = (nums) => {

}

```


# 链表
## 翻转链表
- 迭代法
```js
const reverseList = (head) => {
	if(!head || !head.next) return head;
	let prev = null;
	let cur = head;
	// 遍历
	while(cur !== null){
		const next = cur.next;
		cur.next = prev;
		prev = cur;
		cur = next;
	}
	return prev;// 此时 cur指向 null
}
```
- 递归法
```js
const reverseList = (head) => {
	// 处理边界
	if(!head || !head.next) return head;
	// 递归处理剩余节点
	const tail = reverseList(head.next);
	head.next.next = head;
	// 将指向赋值为null
	head.next = null;
	return tail;
}
```
## 两数相加
```js
const addTwoNumber = (l1, l2) => {
	// 创造虚拟头结点
	const dummy = new ListNode(0);
	let cur = dummy;
	// 创建指针指向
	let p1 = l1,p2 = l2;
	// 记录进位状态
	let carry = 0;
	// 当两个均为空就停止遍历
	while(p1 || p2){
		const value1 = p1 ? p1.val : 0;
		const value2 = p2 ? p2.val : 0;
		// 求和
		let sum = value1 + value2 + carry;
		// 求进位的值
		carry = Math.floor(sum / 10);
		// 更新当前位置的值
		sum %= 10;
		// 创建新节点
		cur.next = new ListNode(sum);
		// 移动当前指针
		cur = cur.next;
		// 指针后移
		// 增加判断语句，可能不存在
		p1 && p1 = p1.next;
		p2 && p2 = p2.next;
	}
	if(carry > 0) cur.next = new ListNode(carry);
	return dummy.next;
}
```
## 合并有序链表
```javascript
// 考虑l1、 l2的长度问题
// 迭代法解决问题
const merge = (l1, l2){
	// 定义虚拟头结点
	let prevHead = new ListNode(0);
	let prev = prevHead;
	while(l1 && l2){
		if(l1.val < l2.val){
			prev.next = l1;			
			l1 = l1.next;
		}else{
			prev.next = l2;
			l2 = l2.next;
		}
		prev = prev.next;
	}
	prev.next = l1 ? l2 : l1;
	return prevHead.next;
}

```
## 环形链表II
```javascript
function detectCycle(head){
	// 处理特殊情况
	if(!head || !head.next) return null;
	// 先用判断的方法定位到距离的位置
	let slow = head, fast = head, flag = false;
	// 必须保证快指针的走向、首次进行循环也需要进行判断
	while(fast.next && fast.next.next){
		slow = slow.next;
		fast = fast.next.next;
		if(slow === fast) {
			flag = true;
			break;
		}
	}
	// 通过flag来进行判断是否成环
	if(!flag) return null;
	// 此时将慢指针指向头节点，那么以同样的速度遍历会在环出相遇（慢指向头，同步走）
	slow = head;
	while(slow !== fast){
		slow = slow.next;
		fast = fast.next;
	}
	return slow;
}
```

## 回文链表
```ts
function isPalindrome(head: ListNode | null): boolean{
	// 拿到中间的节点信息
	let mid = getMiddleNode(head);
	let left = head;
	let right = reverse(mid);// 进行链表反转
	// 进行比较
	while(right){
		if(right.value !== left.value){
			return false;
		}
		left = left.next;
		right = right.next;
	}
}
// 递归法
function reverse(head: ListNode|null): ListNode|null{
	// 处理特殊情况
	if(head == null || head.next == null) return head;
	// 递归处理剩余节点
	const tail = reverse(head.next);
	head.next.next = head;
	head.next = null;
	return tail;
}
function getMiddleNode(head: ListNode | null): ListNode | null{
	let slow, fast;
	slow = fast = head;// 统一在头结点开始，可以使得slow到中间位置
	// 实际上已经处理了只有两个节点的情况
	while(fast && fast.next){
		fast = fast.next.next;
		slow = slow.next;
	}
	return slow;
}
```

## 排序链表（nlog(n)）
```js
function sortList(head){
	// 处理特殊情况
	if(!head || !head.next){
		return head;
	}
	// 获取中间节点
	let midNode = getMiddleNode(head);
	let rightNode = midNode.next;
	// 断开指向
	midNode.next = null;
	
	return mergeTwoList(sortList(head), sortList(rightNode));
}
function getMiddleNode(head){
	// 排序是不进行统一处理的，奇数取左侧
	let slow = head;
	let fast = head.next.next;
	while(fast != null && fast.next != null){
		slow = slow.next;
		fast = fast.next.next;
	}
	return slow;
}
// 合并两个有序链表，并返回头结点
function mergeTwoList(l1, l2) {
	// 定义虚拟头结点
	let dummry = new ListNode(null);
	let cur = dummry;
	while(l1 && l2){
		if(l1.val < l2.val){
			cur.next = l1;
			l1 = l1.next;
		}else{
			cur.next = l2;
			l2 = l2.next;
		}
		cur = cur.next;
	}
	cur.next = l1 ? l1 : l2;
	return dummry.next;
}
```

## LRU缓存
```js
var LRUCache = function(capacity){
	this.catch = new Map();
	this.capacity = capacity;
}
LRUCache.prototype.put = function(key, value){
	// 如果存在则删除，不存在则继续
	if(this.catch.has(key)){
		this.catch.delete(key);
	}
	// 判断会不会超出
	// map只有size属性，没有length属性
	// map.keys().next().value，键的下一个的value值
	// 当恰好是不存在且容量不足
	if(this.capacity <= this.catch.size){
		this.catch.delete(this.catch.keys().next().value);
	}
	this.catch.set(key, value);
}
LRUCache.prototype.get = function(key){
	if(this.cache.has(key)){
		let value = this.catch.get(key);
		this.catch.detele(key);
		this.catch.set(key, value);
		return value;
	}
	return -1;
}

```












