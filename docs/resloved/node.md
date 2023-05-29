# JEST
- toBe用于判断两个值是否严格相等，也就是类型和值都要相同。
- toEqual用于判断两个值是否深度相等
```js
    describe('测试用户账户接口', () => {
        test('响应里应该包含指定的属性', async () => {
            const response = await request(app)
                .get('/users/1');
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('王皓');
        })
    })
```
# koa源码思考
- 核心功能把res、req加工成ctx，app.use()第二个参数next()跳到下一个，把多个use的回调函数按照规则顺序执行。
- async函数返回的是一个promise，当上一个use的next前加上await关键字，会等待下一个use的回调resolve了再继续执行代码。
```js
app.use((ctx, next) => {
    console.log(1)
    // next()  被替换成下一个use里的代码
    console.log(3)
    // next()  又被替换成下一个use里的代码
    console.log(5)
    // next()  没有下一个use了，所以这个无效
    console.log(6)
    console.log(4)
    console.log(2)
})
// 
app.use(async (ctx, next) => {
    console.log(1)
    // console.log(3)
    // let p = new Promise((resolve, roject) => {
    //     setTimeout(() => {
    //         console.log('3.5')
    //         resolve()
    //     }, 1000)
    // })
    // 调用此行代码时，相当于是把下一个中间件的回调函数插入上方
    // await next()会等待上方的代码执行
    await next()
    console.log(2)
})
app.use(async (ctx, next) => {
    console.log(3)
    let p = new Promise((resolve, roject) => {
        setTimeout(() => {
            console.log('3.5')
            resolve()
        }, 1000)
    })
    await p.then()
    await next()
    console.log(4)
    ctx.body = 'hello world'
})
// 1
// 3
//  一秒后
// 3.5
// 4
// 2
```
- 最精华的compose函数
```js
compose(middlewares, ctx){
    function dispatch(index){
        if(index === middlewares.length) return Promise.resolve() // 若最后一个中间件，返回一个resolve的promise
        let middleware = middlewares[index]
        return Promise.resolve(middleware(ctx, () => dispatch(index + 1))) // 用Promise.resolve把中间件包起来
    }
    return dispatch(0)
}
```
- 实现的流程：
- 当调用app.use()时，回调函数会按顺序被保存在middlewares数组里
- compose函数里有个dispatch函数，先是判断其参数index是否到最后一个中间件的后一个位置了
- 是的话直接会返回一个Promise.reslove(),所以最后的中间件是不能执行next()的
- 然后拿到当前的回调函数，传入两个参数，ctx和next，实际上的next()函数就是调用了dispatch(index + 1)
- 最后返回一个Promise.reslove()包裹其返回值