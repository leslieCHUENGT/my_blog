// Promise
const promiseAll = (promises) => {
    if (Array.isArray(promises)) { 
        let count = 0;
        let res = [];
        // 最后返回的是Promise数组
        new Promise((resolve, reject) => { 
            // 遍历
            for (let [index, item] of promises) { 
                // 保存每次执行的结果
                Promise.resolve(item)
                    .then((item) => {
                        res[index] = item;
                        count++;
                        if(count === promises.lenth){
                            return reslove(result);
                        }
                    })
                    .catch((err) => { 
                        reject(err);
                    })
            }
        })
    } else {
        return Promise.reject(new Error());
    }
}

const promiseTimeout = (promise, delay) => {
    let timer = new Promise((reslove,reject) => {
        setTimeout(() => {
            reject('超时啦')
        }, delay)
    })
    return Promise.race([promise, timer]);
}
// 核心就是利用reslove()
const promiseRace = (promises) => {
    return new Promise((reslove, reject) => { 
        promises.forEach((item) => { 
            // 执行
            Promise.resolve(item).then((res) => {
                reslove(res);
            }).catch(err => reject(err))
        })
    })
}

const PromiseAllSettle = (promises) => {
    if (Array.isArray(promises)) {
        // 返回的是Promise对象
        return Promise((resolve, reject) => {
            let count = 0;
            let res = [];
            for (let [index, item] of promises) {
                Promise.resolve(item)
                    .then((res) => { 
                        res[index] = { status: 'fulfilled', value }
                    }).catch((err) => {
                        res[index] = { status: 'reject' , err}
                    }).finally(() => {
                        count++;
                        if (count === promises.length) {
                            resolve(res);
                        }
                    })
            }
        })
    } else {
        return Promise.reject();
    }
}

const promiseNumber = async () => {
    const array = [1, 2, 3];
    for (let i = 0; i < 3; i++){
        await Promise((reslove) => {
            setTimeout(() => {
                console.log(array[i]);
				reslove();
            }, 1000);
        })
    }
}

// 返回的都是Promise对象，利用reslove()来进行结束
// 利用Promise.reslove().then来进行执行
// 利用Promise.reslove().finally(()=>{})进行查看情况






