# computed
```js
describe("computed", () => {
    it("仅当进行更新且使用计算属性时进行effect.run()", () => {
        const value = reactive({ foo: 1 });
        const getter = jest.fn(() => return value.foo)// jest.fn 便于监听
        const cValue = computed(getter);
        // 基本实现
        expect(getter).not.toHaveBeenCalled();
        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);
        // 实现缓存
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);
        // 响应式数据变更，但不使用
        value.foo = 2;
        expect(getter).toHaveBeenCalledTimes(1);
        // 使用后，get value 会执行
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);
        // 验证更新后的缓存
        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)
    })
})
```
- 实现的流程：
  - 设置变量 dirty 进行开关上锁，定义 scheduler 来进行控制关锁

# effect







