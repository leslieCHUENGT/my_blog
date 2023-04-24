const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))
fn().then(res => {
  console.log(res)
})
console.log('start')

class myPromise{
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let resolve = value => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                // 一旦resolve执行，调用成功数组中的函数，这会一般来说，第一次存放的也是promise对象
                this.onResolvedCallbacks.forEach(callback => callback());
            }
        }
        let reject = reason => {
            if (this.state === 'pending') {
              this.state = 'rejected';
              this.reason = reason;
              this.onRejectedCallbacks.forEach(callback => callback());
            }
        }
        // 执行传入promise的参数(函数)
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }
    then(onFulfilled, onRejected) {
        // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value???作用在哪
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        // onRejected如果不是函数，就忽略onRejected，直接扔出错误
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        // onFulfilled或onRejected不能同步被调用，必须异步调用。我们就用setTimeout解决异步问题
        let promise2 = new myPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                // resolvePromise函数，处理自己return的promise和默认的promise2的关系，防止循环引用
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.state === 'rejected') {
                setTimeout(() => {
                  try {
                    let x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                    reject(e);
                  }
                }, 0);
            }
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
            }
        })
        return promise2;
    }
}

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

myPromise.resolve = function (val) {
    return new myPromise(resolve => resolve(val));
}

myPromise.reject = function (val) {
    return new myPromise((resolve, reject) => reject(val));
}
// race方法是返回那个执行得最快的异步请求
// 在这里用.then方法来执行promises数组吗？
myPromise.race = function (promises) {
    return new myPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++){
            promises[i].then(resolve, reject);
        }
    })
}

//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
// 给Promise添加静态方法myAll，因为原生的all就是静态方法
myPromise.all = function (promises) {
  if (! typeof promises[Symbol.iterator] === 'function') { // 检查是否是可迭代类型
    const type = typeof promises;
        return Promise.reject(`${type} ${type === 'object' ? '' : promises} is not iterable (cannot read property Symbol(Symbol.iterator))`); // 基本数据类型要把值也提示给开发者
  }
  
  let doneCount = 0;  // 执行成功计数器
  const results = []; // 执行结果数组
  return new Promise((resolve, reject) => {
    for (const [index, item] of Object.entries(promises)) {
      Promise.resolve(item).then((res) => {
        results[index] = res; // index的作用是保证输出结果的顺序与输入保持一致
        doneCount += 1;
        if (doneCount === promises.length) return resolve(results); // 全部成功时resolve
      }, reject); // 别的地方不变，在这里加上reject，错误时直接调用外层Promise的reject函数，或者你先catch再返回也可以
    }
  });
};

// 手写promise.all方法

