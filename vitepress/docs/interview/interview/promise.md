# 谈谈你对生成器以及协程的理解
- 协程：存在于线程中，一次执行一个协程
- async
  - async 是一个通过异步执行并隐式`返回 Promise 作为结果`的函数
- async/await 利用协程和Promise实现了同步方式编写异步代码的效果
# promise上的方法
- promise.all()
  - Promise.all()方法的参数可以不是数组，但必须具有 `Iterator` 接口
  - 只有p1、p2、p3的状态都变成 fulfilled，p的状态才会变成fulfilled
  - 只要p1、p2、p3之中有一个被 rejected，p的状态就变成rejected
- promise.race()
  - 只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变
- promise.allSettled()
  - `ES2020` 引入了Promise.allSettled()方法，用来确定一组异步操作是否都结束了（不管成功或失败）。
- Promise.any() 
  - `ES2021`
  - 只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态
  - 如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态

# 代码输出题
## 定义时就已经执行了

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});

console.log(4);

// 1 2 4
```

## 三个状态

```js
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);

// promise1 1{resolved} 2{pending} resolve1
```

## 不会阻塞

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
```
- 代码执行过程如下：
  - 首先遇到Promise`构造函数`，会`先执行`里面的内容，打印1；
  - 遇到定时器steTimeout，它是一个宏任务，放入宏任务队列；
  - 继续向下执行，打印出2；
  - 由于Promise的状态此时还是`pending`，所以promise.then先不执行；
  - 继续执行下面的同步任务，打印出4；
  - 此时微任务队列没有任务，继续执行下一轮宏任务，执行steTimeout；
  - 首先执行timerStart，然后遇到了resolve，将promise的状态改为resolved且保存结果并将之前的promise.then
  - `推入微任务队列`，再执行timerEnd；
  - 执行完这个宏任务，就去执行微任务promise.then，打印出resolve的结果。

- 遇到微任务会挤到前面去

```js
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2') // 挤到前面去
  })
}, 0)
console.log('start');
```
## then方法接收函数，否则会传递 
```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
// 1 
```
- Promise.resolve方法的参数如果是一个原始值，或者是一个不具有then方法的对象，
- 则Promise.resolve方法返回一个新的Promise对象，状态为resolved，Promise.resolve方法的参数，会同时传给回调函数。
- `then方法接受的参数是函数`，而如果传递的并非是一个函数，它实际上会将其解释为`then(null)`，这就会导致前一个Promise的结果会`传递`下面。
- 实际上只需要记住一个原则：.then 或.catch 的参数期望是`函数`，传入非函数则会发生值透传。 
## return 2会被包装
```javascript
Promise.resolve(1)
  .then(res => {
    console.log(res);// 并且return 2会被包装成resolve(2)
    return 2;
  })
  .catch(err => {
    return 3;
  })
  .then(res => {
    console.log(res);
  });
  // 1 2
```
- 由于每次调用 .then 或者 .catch 都会返回一个新的 promise

## 被catch捕获只能是因为`reject()`/`throw`,`return`是捕获不到的
```js
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})
// "then: " "Error: error!!!"
```
## 死循环报错
```javascript
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)

```
## 错误只会捕获一次
```javascript
Promise.reject('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
  }).catch(err => {
    console.log('catch', err)
  })
  // error err!!!
```
## 被catch捕获只能是因为`reject()`/`throw`,`return`是捕获不到的
```javascript
Promise.resolve()
  .then(function success (res) {
    throw new Error('error!!!')
  }, function fail1 (err) {
    console.log('fail1', err)
  }).catch(function fail2 (err) {
    console.log('fail2', err)
  })
```
## await 遇到`promise 或者 async的函数`具有阻塞效果，同步代码会直接执行，异步代码会延缓，直到执行完该部分代码才会执行下面的内容
```javascript
async function async1() {
  console.log("async1 start");//1
  await async2();
  console.log("async1 end");//4
}
async function async2() {
  console.log("async2");//2
}
async1();
console.log('start')//3
```
- 可以理解为 `await后面的语句`下一行及之后的语句相当于放在`Promise.then`中。

## 遇到setTimeout和promise的区别
```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
  setTimeout(() => { 
    console.log('timer2')
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")
// async1 start
// async2
// start
// async1 end
// timer2
// timer3
// timer1
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
 await setTimeout(() => { // 阻塞跳出,后面的语句相当于promise.then()包裹，先执行后面的再执行定时器
    console.log('timer2')
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")

// async1 start
// start 阻塞跳出到同步代码
// async2
// async1 end

// timer2
// timer3
// timer1
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
  await Promise.resolve().then(() => {// 阻塞跳出，同步代码执行完立即执行
      console.log('timer2')
  })
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")
// async1 start
// start
// timer2
// async2
// async1 end
// timer3
// timer1
```
##  await 遇到`promise.resolve/reject(同步代码)`立即执行，promise.then()、setTimeout放入微任务（统一在一个promise）中
```javascript
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')// 一直是pending，阻塞了，同步代码会直接执行
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')

```

## await遇到promise连续then调用会等这个微任务完成
```js
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise1 resolve')
  }).then(res => {
      console.log('///')
      return res
  }).then((res) => {
      console.log(res, '///')
  })// 执行完了才到下面
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
```
## async遇到错误会终止执行，catch捕获则可以继续
```javascript
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')// 嘎了
  })
}
async1().then(res => console.log(res))
// async2
// Uncaught (in promise) error

async function async1 () {
  await Promise.reject('error!!!').catch(e => console.log(e))
  console.log('async1');
  return Promise.resolve('async1 success')
}
async1().then(res => console.log(res))
console.log('script start')
// script start
// error!!!
// async1
// async1 success
```
## 
```javascript
const first = () => (new Promise((resolve, reject) => {
    console.log(3);// 1
    let p = new Promise((resolve, reject) => {
        console.log(7);// 构造函数 -> 2
        setTimeout(() => {
            console.log(5);// 5
            resolve(6);
            console.log(p)// 6
        }, 0)
        resolve(1);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg);// 3
    });
}));
first().then((arg) => {
    console.log(arg);// 4
});
console.log(4);// 3

const async1 = async () => {
  console.log('async1'); // 2
  setTimeout(() => {
    console.log('timer1') // 8
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1') // 3 
  })
  console.log('async1 end') // 4 出现问前面的状态是 pending
  return 'async1 success' // 会正常返回promise.resolve()对象
} 
console.log('script start'); // 1
async1().then(res => console.log(res)); // 5
console.log('script end'); // 4
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res)) //6
setTimeout(() => {
  console.log('timer2') // 7
}, 1000)
```
## 打印的是本次promise的返回值
```javascript
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)  // resolve1
  setTimeout(() => {
    console.log(p1) // Promise{<resolved>: undefined}是指当前的
  }, 1000)
  // 加一个return 1 ，则是 Promise{<resolved>: 1}
}).finally(res => {
  console.log('finally', res)
})
```
## 无论是thne还是catch中，只要throw 抛出了错误，就会被catch捕获，如果没有throw出错误，就被继续执行后面的then。
```javascript
Promise.resolve().then(() => {
    console.log('1');
    throw 'Error';
}).then(() => {
    console.log('2');
}).catch(() => {
    console.log('3');
    throw 'Error';
}).then(() => {
    console.log('4');
}).catch(() => {
    console.log('5');
}).then(() => {
    console.log('6');
});
// 1 3 5 6
```

```javascript
async function test() {
  console.log(100)
  let x = await 200// 执行完之后，线程的执行权交还给父协程
  console.log(x)
  console.log(200)
}
console.log(0)
test()
console.log(300)
// 父协程的第一件事情就是对await返回的Promise调用then, 来监听这个 Promise 的状态改变 。
```

