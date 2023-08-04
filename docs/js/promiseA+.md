# 手写promise A+规范
简单使用Promise的例子：
```js
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then(res => {
  console.log(res);
});
```
## 解决基本状态

promise肯定是一个类，我们就用class来声明。

- 由于new Promise(`(resolve, reject)=>{}`)，所以传入一个参数（`函数`），叫他executor，传入就执行。
- executor里面有两个参数，一个叫resolve（成功），一个叫reject（失败）。
- 由于resolve和reject可执行，所以都是函数，我们用let声明。

## 对Promise有规定：

-   Promise存在三个状态（state）pending、fulfilled、rejected
-   pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）
-   成功时，不可转为其他状态，且必须有一个不可改变的值（value）
-   失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
-   `new Promise((resolve, reject)=>{resolve(value)})` resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。
-   `new Promise((resolve, reject)=>{reject(reason)})` reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
-   若是executor函数报错 直接执行reject();


```javascript
class Promise{
  constructor(executor){
    // 初始化state为等待态
    this.state = 'pending';
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    let resolve = value => {
      // state改变,resolve调用就会失败
      if (this.state === 'pending') {
        // resolve调用后，state转化为成功态
        this.state = 'fulfilled';
        // 储存成功的值
        this.value = value;
      }
    };
    let reject = reason => {
      // state改变,reject调用就会失败
      if (this.state === 'pending') {
        // reject调用后，state转化为失败态
        this.state = 'rejected';
        // 储存失败的原因
        this.reason = reason;
      }
    };
    // 如果executor执行报错，直接执行reject
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}
```
## then方法

### Promise有一个叫做then的方法，里面有两个参数：onFulfilled,onRejected,成功有成功的值，失败有失败的原因

-   当状态state为fulfilled，则执行onFulfilled，传入this.value。当状态state为rejected，则执行onRejected，传入this.reason
-   onFulfilled,onRejected如果他们是函数，则必须分别在fulfilled，rejected后被调用，value或reason依次作为他们的第一个参数

```js
class Promise{
  constructor(executor){...}
  // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled,onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    };
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason);
    };
  }
}
```  


## 解决异步实现

**现在基本可以实现简单的同步代码，但是当resolve在setTomeout内执行，then时state还是pending等待状态 我们就需要在then调用的时候，将成功和失败存到各自的数组，一旦reject或者resolve，就调用它们**

- 类似于发布订阅，先将then里面的两个函数储存起来，由于一个promise可以有多个then，所以存在同一个数组内。

```js
// 多个then的情况
let p = new Promise();
p.then();
p.then();
```

- 成功或者失败时，forEach调用它们

```js
class Promise{
  constructor(executor){
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled,onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    };
    if (this.state === 'rejected') {
      onRejected(this.reason);
    };
    // 当状态state为pending时
    if (this.state === 'pending') {
      // onFulfilled传入到成功数组
      this.onResolvedCallbacks.push(()=>{
        onFulfilled(this.value);
      })
      // onRejected传入到失败数组
      this.onRejectedCallbacks.push(()=>{
        onRejected(this.reason);
      })
    }
  }
}
```
## 解决链式调用

**我门常常用到`new Promise().then().then()`,这就是链式调用，用来解决回调地狱**

1、为了达成链式，我们默认在第一个then里返回一个promise。[秘籍](https://link.juejin.cn?target=https%3A%2F%2Fpromisesaplus.com "https://promisesaplus.com")规定了一种方法，就是在then里面返回一个新的promise,称为promise2：`promise2 = new Promise((resolve, reject)=>{})`

-   将这个promise2返回的值传递到下一个then中
-   如果返回一个普通的值，则将普通的值传递给下一个then中

2、当我们在第一个then中`return`了一个参数（参数未知，需判断）。这个return出来的新的promise就是onFulfilled()或onRejected()的值

规定onFulfilled()或onRejected()的值，即第一个then返回的值，叫做x，判断x的函数叫做resolvePromise

-   首先，要看x是不是promise。
-   如果是promise，则取它的结果，作为新的promise2成功的结果
-   如果是普通值，直接作为promise2成功的结果
-   所以要比较x和promise2
-   resolvePromise的参数有promise2（默认返回的promise）、x（我们自己`return`的对象）、resolve、reject
-   resolve和reject是promise2的

```js
class Promise{
  constructor(executor){
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled,onRejected) {
    // 声明返回的promise2
    let promise2 = new Promise((resolve, reject)=>{
      if (this.state === 'fulfilled') {
        let x = onFulfilled(this.value);
        // resolvePromise函数，处理自己return的promise和默认的promise2的关系
        resolvePromise(promise2, x, resolve, reject);
      };
      if (this.state === 'rejected') {
        let x = onRejected(this.reason);
        resolvePromise(promise2, x, resolve, reject);
      };
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(()=>{
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        })
        this.onRejectedCallbacks.push(()=>{
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        })
      }
    });
    // 返回promise，完成链式
    return promise2;
  }
}
```
## 完成resolvePromise函数

```javascript
function resolvePromise(promise2, x, resolve, reject){
    // 循环引用报错
    if(x === promise2){
        // reject 报错
        return reject(new TypeError('Chaining cycle detected for promise'));
    }
    // 标记，防止多次调用
    let called;
    if(x !== null && (typeof x === 'object' || typeof x === 'function')){
        try{
            let then = x.then;
            // then如果是函数，那x肯定就是promise对象，then就是其类中的方法
            if(typeof then === 'function'){
                // 就让then执行，用.call方法，x指向resolvePromise,递归解析，最终返回一个原始数据类型的值
                then.call(x,y => {
                    // 通过标记来判断是否执行过了
                    if(called) return;
                    called = true;
                    // 继续解析promise
                    resolvePromise(promise2, y , resolve, reject);
                },err =>{
                    if(!called) return;
                    reject(err); 
                })
            }else{
                resolve(x);//最后返回的就是原始数据类型的值
            }
        }catch(e){
            if(called) return;
            called = true;
            reject(e);
        }
    }else{// 当x是原始数据类型的值，直接返回了
        resolve(x)
    }
}
```
## 解决其他问题

1、规定onFulfilled,onRejected都是可选参数，如果他们不是函数，必须被忽略

-   onFulfilled返回一个普通的值，成功时直接等于 `value => value`
-   onRejected返回一个普通的值，失败时如果直接等于 value => value，则会跑到下一个then中的onFulfilled中，所以直接扔出一个错误`reason => throw err` 2、规定onFulfilled或onRejected不能同步被调用，必须异步调用。我们就用setTimeout解决异步问题
-   如果onFulfilled或onRejected报错，则直接返回reject()

```js
class Promise{
  constructor(executor){
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled,onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 异步
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'rejected') {
        // 异步
        setTimeout(() => {
          // 如果报错
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      };
    });
    // 返回promise，完成链式
    return promise2;
  }
}
```
## catch和resolve、reject、race、all方法

```js
class Promise{
  constructor(executor){
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled,onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      };
    });
    return promise2;
  }
  catch(fn){
    return this.then(null,fn);
  }
}
function resolvePromise(promise2, x, resolve, reject){
  if(x === promise2){
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  let called;
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') { 
        then.call(x, y => {
          if(called)return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          if(called)return;
          called = true;
          reject(err);
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      if(called)return;
      called = true;
      reject(e); 
    }
  } else {
    resolve(x);
  }
}
//resolve方法
myPromise.resolve = function(val){
  return new Promise((resolve,reject)=>{
    resolve(val)
  });
}
//reject方法
myPromise.reject = function(val){
  return new Promise((resolve,reject)=>{
    reject(val)
  });
}
//race方法 
myPromise.race = function(promises){
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(result => {
        resolve(result);
      }).catch(error => {
        reject(error);
      });
    });
  });
}
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = (promises) => {
    // 检查是否是可迭代类型
    // Symbol.iterator 为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。
    if (! typeof promises[Symbol.iterator] === 'function') {
        return Promise.reject();
    }
    let doneCount = 0;// 执行成功计数器
    let results = [];// 执行结果数组
    return new Promise((resolve, reject) => {
         // Object.entries将promises转换为[ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]这种键值对数组，便于获取索引
        for (const [index, item] of Object.entries(promises)) {
            // 保证数组内接收的元素都是promise实例对象
            Promise.resolve(item).then((res) => {
                results[index] = res;
                doneCount++;
                if (doneCount === promises.length) resolve(results);
            }).catch(err => {
                reject(err);
            })
        }
    })
}
``` 
- 当你需要遍历一个异步可迭代对象并且该对象中的每个项都返回一个 Promise 时，就可以使用 for-await-of 循环。 在这种情况下，使用普通的 for…of 循环将不起作用，**因为它不能等待 Promise 的解析**。相反，for-await-of 循环会等待 Promise 完成，并将其完成值作为下一个项返回。
- 
- Promise.all() 方法`接收一个 promise 的 iterable 类型`（注：Array，Map，Set 都属于 ES6 的 iterable 类型）的输入，并且`只返回一个Promise实例`，那个输入的所有 promise 的 resolve 回调的结果是一个数组。这个Promise的 resolve 回调执行是在所有输入的 promise 的 resolve 回调都结束，或者输入的 iterable 里没有 promise 了的时候。它的 reject 回调执行时，只要任何一个输入的 promise 的 reject 回调执行或者输入不合法的 promise 就会立即抛出错误，并且 reject 的是第一个抛出的错误信息。
- for of 比forEach靠谱

**`event loop`它的执行顺序：**

-   一开始整个脚本作为一个宏任务执行
-   执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
-   当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
-   执行浏览器UI线程的渲染工作
-   检查是否有`Web Worker`任务，有则执行
-   执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空

**微任务包括：** `MutationObserver`、`Promise.then()或catch()`、`Promise为基础开发的其它技术，比如fetch API`、`V8`的垃圾回收过程、`Node独有的process.nextTick`。

**宏任务包括**：`script` 、`setTimeout`、`setInterval` 、`setImmediate` 、`I/O` 、`UI rendering`。

**注意**⚠️：在所有任务开始的时候，由于宏任务中包括了`script`，所以浏览器会先执行一个宏任务，在这个过程中你看到的延迟任务(例如`setTimeout`)将被放到下一轮宏任务中来执行。

  
## 使用Promise实现每隔1秒输出1,2,3

```js

const printNumbers = async () => {
  const array = [1, 2, 3];
  for (let i = 0; i < array.length; i++) {
    await new Promise((resolve) => 
    setTimeout(() => {
      console.log(array[i]);
      resolve();
    }, 1000));
  }
};

printNumbers().then(() => {
  console.log("Done");
});

```
##  使用Promise实现红绿灯交替重复亮

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

const light = (timer,cb) => {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    },timer)
  })
}
// 实现思路：先封装一个通用的函数light，它的返回值是一个Promise对象，需要再.then()方法里面调用
// 只有返回值是Promise才可以进行.then方法的链式调用
// 
const step = () => {
  Promise.resolve().then(() => {
    light(3000,red);
  }).then(() => {
    light(2000,green);
  }).then(() => {
    light(1000, yellow)
  })
}

step();
```

```js
async function lightStep() {
    await light(red, 3000);
    await light(yellow, 2000);
    await light(green, 1000);
    await lightStep();
}
```
## 封装一个异步加载图片的方法

```js

function loadImage(url){
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => {
      console.log('图片加载完成')
      resolve(img);
    }
    img.onerror = () => {
      reject(new Error('ERROR!'))
    }
    img.src = url;
  })
}
```
## 限制异步操作的并发个数并尽可能快的完成全部
```js
function limitConcurrency(tasks, concurrencyLimit) {
  // 返回一个新的 Promise，用于封装所有的异步操作
  return new Promise((resolve, reject) => {
    const results = []; // 存放每个任务的结果
    let runningCount = 0; // 当前正在运行的任务个数
    let currentIndex = 0; // 当前要执行的任务索引

    // 定义一个递归函数，用于执行任务
    function runNextTask() {
      // 如果当前正在运行的任务个数已经达到了限制，或者所有任务都已经执行完成，则退出递归
      if (runningCount >= concurrencyLimit || currentIndex >= tasks.length) {
        return;
      }

      // 取出当前要执行的任务
      const task = tasks[currentIndex++];

      // 执行任务，并将结果存入 results 数组中
      const taskPromise = task().then(result => {
        results.push(result);
        runningCount--;
        runNextTask();
      }).catch(error => {
        reject(error);
      });

      // 更新当前正在运行的任务个数，并继续执行下一个任务
      runningCount++;
      runNextTask();

      // 返回当前任务的 Promise，可以用来取消任务等操作
      return taskPromise;
    }

    // 首次调用递归函数，开始执行任务
    runNextTask();

    // 当所有任务执行完成后，将结果数组传递给 resolve 函数
    const checkAllTasksDone = setInterval(() => {
      if (currentIndex >= tasks.length && runningCount === 0) {
        clearInterval(checkAllTasksDone);
        resolve(results);
      }
    }, 10);
  });
}

// 示例用法
const tasks = [
  () => new Promise(resolve => setTimeout(() => resolve(1), 3000)),
  () => new Promise(resolve => setTimeout(() => resolve(2), 2000)),
  () => new Promise(resolve => setTimeout(() => resolve(3), 1000)),
  () => new Promise(resolve => setTimeout(() => resolve(4), 500)),
];

limitConcurrency(tasks, 2).then(results => console.log(results)); // [3, 4, 2, 1]

```
[面试 JS 篇 - Promise 相关面试题 - 掘金 (juejin.cn)](https://juejin.cn/post/7217637205589721148)

## Promise 的含义
- Promise 是`异步编程`的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。
- 从语法上说，Promise 是一个对象，从它可以`获取异步操作的结果`。Promise 提供统一的 API，`各种异步操作`都可以用`同样的方法进行处理`。
- 特点
  - 对象的状态不受外界影响。
    - `只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。`
  - 一旦状态改变，就不会再变，任何时候都可以得到这个结果。
  - 此外，Promise对象提供统一的接口，使得控制异步操作更加容易。
- 缺点
  - 无法取消`Promise`，一旦新建它就会立即执行，无法中途取消
  - `如果不设置回调函数`，Promise内部抛出的`错误`，`不会反应到外部`。
  - 当处于`pending状态`时，无法得知目前`进展到哪一个阶段`

## Promise.prototype.catch()
- Promise.prototype.catch()方法是`.then(null, rejection)`或.then(undefined, rejection)的`别名`，`用于指定发生错误时的回调函数`。

```javascript
Promise
    .resolve()
    .then(function () {
        throw new Error('外部报错');
    }, function () {
        console.log('This in never called');
    }).catch(err => {
        console.log('捕捉到错误', err.message);
    })// 这样才能捕捉到错误
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```
- Promise `内部的错误`不会影响到 Promise 外部的代码，通俗的说法就是“Promise `会吃掉错误`”。
- Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，`错误总是会被下一个catch语句捕获`。
- 上面代码中，`第二个catch()方法用来捕获前一个catch()方法抛出的错误`。这句话可以反应.catch方法的实质就是.then(null,rejection)，两个promise链式调用，需要两个catch来把错误冒泡传递

## Promise.prototype.finally() 
- 不管`promise`最后的状态，在执行完`then或catch`指定的回调函数以后，都会执行`finally`方法指定的回调函数。
- finally本质上是`then`方法的特例。
  - 如果不使用finally方法，同样的语句需要为成功和失败两种情况各写一次。有了finally方法，则只需要写一次。
- finally 有什么用
  大型语言 try {} catch() {} finally
  1. promise 失败后
  - 应用场景
    all race any allSettled finally
    Promise.resolve/reject
  2. 有些应用不只是耗时
     i/o 操作要关闭文件句柄...  
## Promise.try() 
- 不知道或者不想区分，函数f是`同步函数还是异步操作`，但是想用 Promise 来处理它。
```js
const f = () => console.log('now');
(
  () => new Promise(
    resolve => resolve(f())
  )
)();
console.log('next');
// now
// next
```
- 上面代码也是使用立即执行的匿名函数，执行new Promise()。这种情况下，同步函数也是同步执行的。

- 鉴于这是一个很常见的需求，所以现在有一个提案，提供Promise.try方法替代上面的写法。
```js
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```
```js
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}
```

上面这样的写法就很笨拙了，这时就可以统一用`promise.catch()`捕获所有同步和异步的错误。

```js
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```

事实上，`Promise.try`就是模拟`try`代码块，就像`promise.catch`模拟的是`catch`代码块。

## promise设置超时请求
```javascript
// 实现的原理就是通过promise.race来完成的
// 定义一个函数来返回一个Promise.race的结果，因此参数设置为两个
// 一个就是promise函数（任务），另一个也是promise实例对象，用来比较的。
// 执行该函数，然后.then方法打印以及.catch来处理错误
function promiseTimeout(promise,delay){
  let timeout = new Promise((resolve,reject) => {
    setTimeout(() => {
      reject('超时啦')；
    },delay);
  })
  return Promise.race([promise,timeout]);
}
function foo(){
  return Promise((resolve,reject) => {
    setTimeout(() =>{
      reslove('request sucess!')
    },3000)
  })
}
promiseTimeout(foo(),2000)
  .then((data)=>{
    console.log(data)
  }).catch((err)=>{
    console.error(err)
  })
```
## 利用promise将十张图片上传到后端，要求同时最多上传三张，当有一张上传完成后，若有未上传的，则递交进来，直到上传完成

```js
function uploadImageToServer(image) {
  // replace with your actual upload function
  // 这里应该是实际的上传函数，需要根据具体情况进行替换
  return Promise.resolve();
}

function uploadImages(images){
  const MAX_CONCURRENT_UPLOADS = 3;// 最大并发上传数
  let currentIndex = 0; // 当前上传的图片索引
  
  function uploadNext(){
    if (currentIndex >= images.length) {// 如果所有图片都已经上传成功，则返回
      return Promise.resolve();
    }

    const currentBatch = images.slice(currentIndex, currentIndex + MAX_CONCURRENT_UPLOADS);
    currentIndex += MAX_CONCURRENT_UPLOADS;// 更新当前上传的图片索引
    
    const uploadPromises = currentBatch.map(image => {
      return uploadImageToServer(image);// 将当前批次的图片上传到服务器
    })
    // 当前批次的所有图片上传完成后，递归调用自身以上传下一个批次的图片
    return Promise.all(uploadPromises).then(uploadNext);
  }
  return uploadNext();
}

const images = [];
uploadImages(images)
.then(() => {
  console.log('All images uploaded successfully!');
}).catch((err) => { 
  reject(err);
})
```
## 以下是ES5实现Promise.all

```javascript
function promiseAll(promises) {
  return new Promise(function(resolve, reject) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError("arguments must be iterable"));
    }
    var resolvedCount = 0;
    var promiseNum = promises.length;
    var resolvedValues = new Array(promiseNum);
    for (var i = 0; i < promiseNum; i++) {
      (function(i) {
        Promise.resolve(promises[i]).then(function(value) {
          resolvedCount++;
          resolvedValues[i] = value;
          if (resolvedCount == promiseNum) {
            return resolve(resolvedValues);
          }
        }, function(reason) {
          return reject(reason);
        });
      })(i);
    }
  });
}
```
## ES6的语法糖async/await实现promise.all

在这段代码中，for循环使用`await`关键字是因为它遍历了一个异步迭代器。异步迭代器是一种特殊类型的迭代器，它返回一个Promise对象，该对象在迭代下一个值时解析。
对于异步迭代器，`for await...of`语法用于遍历异步序列（即由两个或多个异步操作组成的序列）。每次遍历都会暂停执行，直到当前Promise被解析并返回结果。这样可以确保在继续处理下一个迭代之前，先等待上一个迭代完成。
在这段代码中，通过使用`await`关键字来等待每个Promise对象被解决，然后将解决的值添加到`resolvedValues`数组中，最后返回该数组。

```javascript
const promiseAll = async (iterable) => {
  if (typeof iterable[Symbol.iterator] !== 'function') {
    throw new TypeError("arguments must be iterable");
  }
  const resolvedValues = [];
  for await (const promise of iterable) {
    try {
      resolvedValues.push(await Promise.resolve(promise));
    } catch (error) {
      console.error(error);
    }
  }
  return resolvedValues;
}
```
# [Symbol.iterator]
- 当我们使用 `for...of` 循环或者展开运算符 `...` 来遍历一个对象时，
- `JavaScript` 引擎会自动查找该对象是否实现了 [Symbol.iterator] 方法，
- 如果有，则调用该方法并获取一个迭代器对象，然后通过不断调用迭代器对象的 `next()` 方法来逐个访问该对象的元素，直到迭代器对象的 `done` 属性为 `true` 为止。

```javascript
const myArray = [1, 2, 3, 4];

myArray[Symbol.iterator] = function() {
  let index = 0;
  
  return {
    next: () => {
      if (index < this.length) {
        return { value: this[index++], done: false };
      } else {
        return { done: true };
      }
    }
  }
}

for (let item of myArray) {
  console.log(item);
}

```



```javascript
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = (promises) => {
    // 检查是否是可迭代类型
    // Symbol.iterator 为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。
    if ( typeof promises[Symbol.iterator] !== 'function') {
        return Promise.reject();
    }
    let doneCount = 0;// 执行成功计数器
    let results = [];// 执行结果数组
    return new Promise((resolve, reject) => {
         // Object.entries将promises转换为[ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]这种键值对数组，便于获取索引
        for (const [index, item] of promises) {
            // 保证数组内接收的元素都是promise实例对象
            Promise.resolve(item).then((res) => {
                results[index] = res;
                doneCount++;
                if (doneCount === promises.length) return resolve(results);
            }).catch(err => {
                reject(err);
            })
        }
    })
}
```

## 常见面试题
- promise原理
- promise作用
- 利用promise将十张图片上传到后端，要求同时最多上传三张，当有一张上传完成后，若有未上传的，则递交进来，直到上传完成
- 回调地狱
  - **回调函数的层层嵌套**，就叫做回调地狱。回调地狱会造成代码可**复用性不强**，**可阅读性差**，**可维护性(迭代性差)**，**扩展性**差等等问题
- promise设置超时请求
- promise限制次数内重试,async,awiat
-  JavaScript 缓存装饰器

- 多层嵌套的问题；
- 每种任务的处理结果存在两种可能性（成功或失败），那么需要在每种任务执行结束后分别处理这两种可能性。
- Promise 通过回调函数延迟绑定、回调函数返回值穿透和错误“冒泡”技术解决了上面的两个问题。
- 是的，JavaScript 引擎是单线程的。这意味着在同一时间内只能执行一个任务。在浏览器环境下，JavaScript 与用户界面共享同一个主线程，因此如果 JavaScript 在执行一个长时间运行的任务时，用户界面就会被冻结，直到任务完成为止。为了解决这个问题，开发人员通常使用异步编程技术，例如回调函数、Promise 和 async/await，来确保 JavaScript 可以处理多个任务而不会阻塞用户界面。