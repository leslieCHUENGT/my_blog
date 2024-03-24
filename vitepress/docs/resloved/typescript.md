# 泛型
- 泛型允许我们在`强类型程序设计语言`中编写代码时使用一些以后才`指定的类型`，在实例化时作为`参数指明`
- 泛型是允许同一个函数接受不同类型参数的一种模板
- 相比于使用any类型，使用泛型可以指定当前的类型
## 使用方式
```js
// 函数
function returnItem<T>(parma: T):T {
    return param;
}
// 可以一次定义多个类型参数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
// 接口
interface returnItemT <T>{
    (para: T): T
}
const returnItem: ReturnItemFn<number> = para => para// 传入number
// 类
class Stack<T> {
    private arr: T[] = []

    public push(item: T) {
        this.arr.push(item)
    }

    public pop() {
        this.arr.pop()
    }
}
```

# interface type
- 都可以描述一个对象或者函数
- 都允许拓展extends
- 因为项目里没有遇到需要区别的问题
- 能用 interface 实现，就用 interface , 如果不能就用 type 。

# ts数据类型
- 元组
  - 允许表示一个`已知元素数量和类型的数组`，各元素的类型不必相同
```js
let tupleArr:[number, string, boolean];
tupleArr = [12, '34', true]; //ok
typleArr = [12, '34'] // no ok
```
- 枚举
  - 对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字
- any
- null 和 和 undefined
- void
- never

# 接口interface
- 我们想要一个属性变成只读属性，在typescript只需要使用`readonly`声明
  
# 函数
- 函数重载，允许创建数项名称相同但`输入输出类型`或`个数不同`的子程序

# 高级类型
```javascript
// - 交叉类型 &
// - 合并对象
function extend<T , U>(first: T, second: U) : T & U {
    let result: <T & U> = {}
    for (let key in first) {
        result[key] = first[key]
    }
    for (let key in second) {
        if(!result.hasOwnProperty(key)) {
            result[key] = second[key]
        }
    }
    return result
}
// - 联合类型 |

// - 类型别名 type
// 类型别名有时和接口很像，但是可以作用于`原始值、联合类型、元组`以及其它任何你需要手写的类型
// 类型别名来在属性里引用自己
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}

// - 类型索引 keyof
interface Button {
    type: string
    text: string
}
type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"

// - 类型约束 extends
type BaseType = string | number | boolean

// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}
// - 类型约束通常和类型索引一起使用
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

const obj = { a: 1 }
const a = getValue(obj, 'a')
```

# 内置类型操作符
- 第一个登场的工具类型是 Partial，它接收一个对象类型，并将这个对象类型的所有属性都标记为`可选`
```js
type User = {
  name: string;
  age: number;
  email: string;
};

type PartialUser = Partial<User>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// 可以不实现全部的属性了！
const partialUser: PartialUser = {
  name: 'John Doe',
  age: 30
};

```
- Required

```javascript
type User = {
  name?: string;
  age?: number;
  email?: string;
};

type RequiredUser = Required<User>;

const user: User = {
  name: 'John Doe'
};

// 现在你必须全部实现这些属性了
const requiredUser: RequiredUser = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

```

- Readonly
```javascript
type User = {
  name: string;
  age: number;
  email: string;
};

type ReadonlyUser = Readonly<User>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

const readonlyUser: ReadonlyUser = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// 修改 user 对象的属性
user.name = 'Jane Doe';
user.age = 25;
user.email = 'jane.doe@example.com';

// 修改 readonlyUser 对象的属性
// readonlyUser.name = 'Jane Doe';  // 报错
// readonlyUser.age = 25;  // 报错
// readonlyUser.email = 'jane.doe@example.com';  // 报错

```
- TypeScript 中基于`索引签名类型`提供了一个简化版本 `Record`，用于声明一个内部属性键类型一致、键值类型也一致的`对象类型`

```js


```
- Pick

```javascript


```
- 与Pick相反Omit
- 









