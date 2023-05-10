# 记忆函数
```js
// 创建一个函数 memoize，接受一个函数作为参数
function memoize(func) {
  // 创建一个空对象 cache，用于存储计算结果
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
      const result = func.apply(this, args);
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
  return x + 1;
}
function fn2(x) {
  return x + 2;
}
function fn3(x) {
  return x + 3;
}
function fn4(x) {
  return x + 4;
}
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 1+4+3+2+1=11

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
## 手写flatter
```js
function flatter(arr) {
  if (!arr.length) return [];
  return arr.reduce(
    (pre, cur) =>
      Array.isArray(cur) ? [...pre, ...flatter(cur)] : [...pre, cur],
    [] //初始值是空数组
  );
}
```
# new
## new 操作符
```javascript
function myNew(constructor, ...args) {
  // 创建一个空对象，并将它的原型指向构造函数的 prototype 属性
  const obj = Object.create(constructor.prototype);
  // 调用构造函数，并将 this 绑定到新创建的对象上
  const result = constructor.apply(obj, args);
  // 如果构造函数返回了一个对象，则直接返回该对象；否则返回新创建的对象
  return (typeof result === 'object' && result !== null) ? result : obj;
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

    // 将新的回调函数添加到回调函数列表中
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
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
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
  return [...quickSort(left), pivot, ...quickSort(right)];
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

# 深拷贝


```javascript
function clone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        let cloneTarget = isArray ? [] : {};

        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);

        const keys = isArray ? undefined : Object.keys(target);
        forEach(keys || target, (value, key) => {
            if (keys) {
                key = value;
            }
            cloneTarget[key] = clone2(target[key], map);
        });

        return cloneTarget;
    } else {
        return target;
    }
}
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





