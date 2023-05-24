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


