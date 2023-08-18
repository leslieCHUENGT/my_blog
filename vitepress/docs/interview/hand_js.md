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
// 
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
1
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
function flatter(arr) {
  if (!arr.length) return [];// 完全是为了首次进去直接结束
  return arr.reduce(
    (pre, cur) =>
      Array.isArray(cur) ? [...pre, ...flatter(cur)] : [...pre, cur],
    [] //初始值是空数组
  );
}

// 尾递归优化
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

// toString()方法会剔除[],变成字符串
[[1,[2]],3].toString().split(',').map(x => Number(x))  
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

function Object.create(property){
  if(typeof property !== 'object' || property === null){
    throw new TypeError();
  }
  // 定义构造函数
  function F(){ }
  F.prototype = property;
  return new F();
}

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
      callback.apply(this, args);
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
      callbacks.splice(index, 1);// 执行结果的返回值是被删除的元素
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
      prefix = prefix.slice(0,prefix.length - 1);
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
    if(nums[i] > 0) return result;// 当出现元素
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






