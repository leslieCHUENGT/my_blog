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
  if (fn.length === 1) return fn[0];
  
  // 使用 reduce 函数将多个函数组合起来。
  return fn.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
}
```
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

这个实现方式利用了 `isPrototypeOf()` 的底层优化，可以更快地判断一个对象是否是另一个对象的实例。但是需要注意的是，这种实现方式只适用于检查单个对象是否是指定构造函数的实例，不能用于检查一个对象数组中的所有元素是否都是该构造函数的实例。

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
```







