- 数据类型的定义
- 枚举类型
```js
// 可以定义不同的基本数据类型，不需要强制进行类型约束
// 没有以等于号来进行赋值的话，相当于使用起来Color.Red就是下标值
// 当设置了基础数字的值，那么就会进行加一操作
enum Color{
	RED,
	PINK = 2,
	BLUE,
	GREEN = "green"
}
const red: Color = Color.Red;// 打印出来是 0(即为默认初始值)
const pink: Color = Color.PINK;// 2
const blue： Color = Color.BULE;// 3
const green :Color = Color.GREEN;// "green"

```
- 数组类型定义
```js
let arr:string[] = ['1','2'];
let arr:Arrar<strig> = ['1','2'];
// 联合数组
let arr:(number | string)[];
// 指定数组成员
interface ArrObj{
	name: string,
	age: number
}
let arr:ArrObj[];
let arr:Array<ArrObj>;
```
- 元组类型
```js
// 已知数量和类型的数组
const tuple: [number, string] = [1,'zzz'];
```
- null 和 undefined
```js
// 默认情况下，null 和 undefined 是所有类型的子类型
// 严格模式下会报错
```
- any类型和unknown类型
	- any类型不进行检测，可以调用
	- unknown类型不可以调用
	- unknown类型的变量进行了类型缩小后才能赋值
```js
// 使用 any 类型
let anyValue: any = 10;
anyValue.foo(); // 没有编译错误，但在运行时会报错

// 使用 unknown 类型
let unknownValue: unknown = 10;
unknownValue.foo(); // 编译错误，因为 unknown 类型不能调用任意属性或方法

if (typeof unknownValue === "number") {
  let numberValue: number = unknownValue; // 编译通过，因为进行了类型缩小判断
}

let stringValue: string = anyValue; // 任意值可以分配给其他类型，没有编译错误
let stringValue2: string = unknownValue; // 编译错误，因为 unknown 类型不能直接分配给其他类型

```
- void类型，表示函数无返回值
- never类型
	- 表示不正常不可能的的值的类型
	- 异常
	- 死循环
- 函数类型
```js
const add = function(x: number, y: number): number {
  return x + y;
}
// 默认参数
const add = function(x: number, y: number = 0): number {
  return x + y;
}
// 剩余参数
function add(...number: number[]): number {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}
```
- 类型断言
	- 手动指定没给定类型的变量的类型
```js
let str: any = "to be or not to be";
let strLength: number = (<string>str).length;// 尖括号

let str: any = "to be or not to be";
let strLength: number = (str as string).length;// as

```
- 交叉类型
```js
interface IpersonA{
  name: string,
  age: number
}
interface IpersonB {
  name: string,
  gender: string
}

let person: IpersonA & IpersonB = { 
    name: "师爷",
    age: 18,
    gender: "男"
};

```
- 类型守卫
```js
// in ：检测是否含有该属性或者说是否包含这个属性
interface InObj1 {
    a: number,
    x: string
}
interface InObj2 {
    a: number,
    y: string
}
function isIn(arg: InObj1 | InObj2) {
    // x 在 arg 打印 x
    if ('x' in arg) console.log('x')
    // y 在 arg 打印 y
    if ('y' in arg) console.log('y')
}
isIn({a:1, x:'xxx'});
isIn({a:1, y:'yyy'});
// typeof
// instanceof
```
- 接口
	- 可选
	- 索引签名
		- [prop: string]
- 类型别名type
```js
type MyType = {

}
```
- 接口interface和类型别名type的区别
	- 一个用extends扩展，一个用&扩展
	- type可以声明基本数据类型别名，联合类型，元组，interface不行
	- interface可以合并声明，type不可以
- 泛型
- 定义接口时，不预先指定具体的类型，使用的时候再指定类型的一种特性
```js
// 语法：第一个尖括号写类型参数名
function getValue<T>(arg:T):T  {
  return arg;
}
// 使用
getValue<string>('树哥'); // 定义 T 为 string 类型
getValue('树哥') // 自动推导类型为 string、

```
- 多个参数
```js
// 元组类型
function getValue<T, U>(arg:[T,U]):[T,U] {
  return arg;
}

// 使用
const str = getValue(['树哥', 18]);
```
- 泛型拓展
```js
interface Lengthwise {
  length: number;
}

function getLength<T extends Lengthwise>(arg:T):T  {
  console.log(arg.length); 
  return arg;
}
```
- 泛型接口
```js
interface KeyValue<T,U> {
  key: T;
  value: U;
}
// 尖括号指定类型
const person1:KeyValue<string,number> = {
  key: '树哥',
  value: 18
}
const person2:KeyValue<number,string> = {
  key: 20,
  value: '张麻子'
}

```
- 内置工具类型
```js
const user: Required<Person>
type User = Partial<Person>

type P1 = Pick<Person, "name" | "age">

type Property = 'key1'|'key2' 
type Person = Record<Property, string>

type P1 = Omit<Person, "age" | "gender">
```
- Required：变成必选 
- Partial：变为可选 
- Pick : 挑选 
- Record: 转化，指定 
- Omit： 去除 