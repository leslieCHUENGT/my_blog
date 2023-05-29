# 数组中常见的api
- push() - 将一个或多个元素添加到数组的末尾，并返回新数组的长度。
- pop() - 删除数组的最后一个元素，并返回该元素的值。
- shift() - 删除数组的第一个元素，并返回该元素的值。
- unshift() - 将一个或多个元素添加到数组的开头，并返回新数组的长度。
- slice() - 返回数组的一部分，从开始位置到结束位置（不包括结束位置）。
  - slice() 方法用于返回数组的一部分，它**不改变原始数组**，而是**返回一个新的数组**。该方法接受两个参数：起始位置和结束位置（不包括结束位置）。例如，`arr.slice(1, 3)` 将返回从索引 `1` 开始，到索引 `3`（不包括）的元素，也就是 `arr[1] 和 arr[2]。`
- splice() - 从数组中添加或删除元素，并返回被删除的元素。
  - splice() 方法接受三个参数：**起始位置(从0开始)**、要删除的元素**数量**和可选的要添加到数组中的新元素。**改变原始数组，并返回被删除的元素**
- concat() - 连接两个或多个数组，并返回结果数组。
- join() - 将数组的所有元素连接成一个字符串，并返回该字符串。
- filter() - 创建一个新数组，其中包含满足指定条件的所有元素。
- forEach() - 对数组中的每个元素执行指定操作。
- map() - 创建一个新数组，其中包含对原始数组的每个元素进行指定操作后的结果。
- reduce() - 对数组中的所有元素执行指定的累加器函数，并返回累加器的结果。
- every() - 检查数组中的所有元素是否满足指定条件。
- some() - 检查数组中是否存在至少一个元素满足指定条件。
- indexOf() - 返回指定元素在数组中第一次出现的位置，如果未找到则返回 -1。
- lastIndexOf() - 返回指定元素在数组中最后一次出现的位置，如果未找到则返回 -1。
- sort() - 对数组进行排序，并返回排序后的数组。
- includes() - array.includes(searchElement, fromIndex)它用于判断一个数组是否包含某个特定元素，并返回一个布尔值。
应用场景：数组去重
```js
let arr = [1,2,2,3,4,4,5];
let uniqueArr = arr.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
        acc.push(curr);
    }
    return acc
}, []);
```


# CommonJS 和 ES6 模块化
- 在引用时的行为是不同的
- 在 `CommonJS` 中，模块加载是同步进行的。 `ES6` 模块化中，模块加载是异步进行的。

# 自己对闭包的理解
- 我理解的闭包是一种组合、模式。
- 这个组合涉及到js在编译前确定的**词法作用域**。
- 简单来说这个组合就是内部函数引用外部函数作用域的变量。
- 在学习过程中为了可以更好的理解一些常见的功能函数，比如闭包可以用在：
- **创建私有变量**、**延迟执行就像防抖节流**，**记忆化**、**柯里化**等等
- 就也去了解了js这门语言的**执行机制**和**内存模型**，对闭包的用途和**缺点**更了理解了

**那你讲一讲js执行机制**
- 简单来说：js引擎是通过**调用栈**来管理执行的上下文的
- 一个执行上下文又包括：变量环境、词法环境、外部环境和this
- 变量环境是js早期就存在的了，变量提升会发生和存放在变量环境里
- 词法环境是js为了实现块级作用域来增加的，存放`let`和`const`定义的变量
- 外部环境和他们两个就已经可以完成作用域链的构建了
- this则是一个大力神的角色，可以扭转指向，但是也存在一些缺点

**为什么要用栈来管理**
- 执行上下文的创建和销毁都是有顺序的，函数的调用和执行，栈是后进先出的，符合他的要求

**那你讲一下闭包的缺点**
- 容易造成内存泄漏，如果闭包引用的是全局变量
- 那么闭包就会一直存在，就造成了内存泄漏了

**this的坑**
- this的决定是什么，就是谁最后调用这个函数就指向谁，跟函数执行的位置有关
- 严格模式下，this指向window会变成undefined
- 嵌套函数，this不会继承
  - 缓存this
  - 箭头函数

**那你讲一讲从内存模型的角度上分析闭包**
- 在编译的时候，js引擎还会对内部函数做词法扫描
- 判断出存在闭包的组合，本来是存放在变量环境或者词法环境里的变量
- 就会存放在堆内存里，所以我们就可以知道为什么闭包最好不要引用全局变量了


```js
const {
    query: {
        page: pageNumber // es6的重命名,解构出来的page就在外层的词法环境中，重名会报错
    }
} = useRoute()
const page = ref(pageNumber ? parseInt(`${ pageNumber }`, 10) : 1)
```
**那你聊聊对数据是如何存储的，对栈内存和堆内存的理解**
- js的内存模型主要是有三种
- 堆内存、栈内存、代码空间
- 栈内存有比较重要的作用，用来存储执行上下文，所以原始数据类型和对象的引用地址会存放在变量环境或者词法环境里
- 堆内存比较大，存放着引用类型的值

**讲一讲垃圾回收机制**
- js这门语言不像c、c++一样需要去手动释放内存
- 栈内存和堆内存里都会存放变量
- 栈是通过ESP指针向下移动来释放内存的
- 堆是通过新生代垃圾回收器和老生代垃圾回收器来实现的
- 因为有些变量的生命周期极其短，而有些变量一直存活到程序终止，把堆空间分为两块
- 新生区和老生区，这样处理的目的就是为了防止产生内存碎片，提升性能
- 无论是新生区或者老生区的垃圾回收机制简单来说都是标记清除整理三个大的步骤
- 但是新生区为了处理频繁出现的内存碎片，还会采用对象区和空闲区反转算法、两次未清除的进行晋升的策略

**从编译的角度讲一讲v8如何执行一段js代码**
- Ignition 是点火器的意思，编译器 TurboFan 是涡轮增压的意思
- js代码片段通过词法分析和语法分析生成AST抽象语法树、执行上下文
- 词法分析是指把源码拆分为一个个的token，语法分析就是把token转换为AST
- AST会通过解释器来生成字节码，以前是没这个字节码的，会直接转换成机器码
- 但是机器码会占用大量的内存，就引入了字节码
- 解释器还可以解释字节码，当执行字节码的时候，解释器会标记某些热点代码也就是频繁执行的
- 编译器就派上用场了，直接把热点代码转换为机器码，保存起来，以备下次再用
- 执行上下文是在代码解析和编译过程中起到重要作用的环节，通过执行上下文可以确定变量和函数的作用域、内存分配、this 指向等信息，从而帮助引擎正确地生成机器码，并确保代码的正确性和可靠性。
- 这两个的组合也叫做JIT(即时编译)

**AST有什么用**
- AST抽象语法树非常重要，比如Babel这个代码转码器和ESLint，就是通过遍历或者改变AST来实现的

**你看了js的内存机制和编译原理，对你的代码风格有印象吗**
- 实际上并没有多大影响，因为前端框架发展迅速，很多需要注意问题，都被其他方式所避免了
- 但是了解底层确实可以让我更注重自己写的js代码可能会出现的问题
- 多使用局部变量可以减少作用域链的查找
- 使用闭包不要引用全局变量
- 循环引用会爆栈
- 定时器内引用了其他变量，不销毁是会导致内存泄漏的
- 不要频繁创建和销毁对象，垃圾回收机制也是会耗费性能的

# promise
**讲一讲回调地狱**
- 首先一个是多层嵌套
- 其次就是回调的结果成功或者失败，造成的代码冗余
- promise因为微任务的原因，相比回调函数的执行顺序也更靠前，时效性比较高
**promise为什么要引入微任务**
- 原本是通过setTimeout来把回调函数加入宏任务队列里面
- 但是这样就脱离了原本的消息队列上下文
- 执行的顺序也不能保证
- 因为当执行完当前的宏任务，就会马上执行微任务
- 时效性高，也符合设计初衷

# async/await

# websocket io库？


# npm yarn
- npm和yarn都是JavaScript的包管理工具，可以用于在项目中安装、升级、删除和发布依赖项（也称为软件包或模块）。
- npm是Node.js的默认软件包管理器，它允许用户从npm仓库中下载和安装各种JavaScript软件包。npm还允许用户创建自己的软件包并将其发布到npm仓库供其他人使用。npm提供了命令行工具，使用户可以方便地管理他们的软件包依赖关系，并且通常与Node.js一起安装。
- 相比之下，Yarn是Facebook开发的软件包管理器，旨在解决npm存在的一些问题。例如，Yarn具有更快的安装速度，更好的缓存管理和更一致的安装结果。Yarn还提供了更多的功能，例如离线模式、自动锁定文件生成、版本控制和增量安装。此外，Yarn与npm很相似，因此对npm用户来说非常容易上手。
- 虽然npm和yarn在某些方面略有不同，但它们的目标都是使**JavaScript项目的依赖管理**更加可靠和高效。

# 什么是匿名函数
- 函数声明时不给名字，把它赋给另一个变量或者作为参数
```js
const fn = function(){

}

setTimeOut(function(){

},2000)
```
# 回调函数
- 回调函数是一种函数，它作为参数传递给另一个函数，并在特定的时刻被该函数调用。

# 原型和原型链的理解

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e21b39c61d784492927f9027d8092a7d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

```js
// 构造函数Foo--上溯：Object()
function Foo(name){
    this.name=name;
};
console.log(Foo.prototype);//{constructor: ƒ}constructor: ƒ Foo(name)[[Prototype]]: Object
console.log(Foo.prototype.constructor);//[Function: Foo]
console.log(Foo);//[Function: Foo]
// 实例化对象f1,f2--上溯：Foo()
var f1=new Foo();
console.log(f1.__proto__);//{constructor: ƒ}constructor: ƒ Foo(name)[[Prototype]]: Object==Foo.prototype
console.log(f1.__proto__==Foo.prototype);//true
console.log(f1.prototype);//undefined,实例对象上没有显示原型

console.log(Foo.prototype.__proto__);//constructor: ƒ Object()
//对象
function Object(){};
console.log(Object.prototype);//constructor: ƒ Object()==Foo.prototype.__proto__
console.log(Object.prototype.constructor);//ƒ Object(){}
console.log(Object);//ƒ Object(){}
console.log(Object.__proto__);//ƒ () { [native code] }

var o1=new Object();
console.log(o1.__proto__==Object.prototype);//true

console.log(Object.prototype.__proto__);//null

```
- Foo和Object都是通过 function Function(){} 创造

# 你讲一讲什么是原型和原型链
- 原型是构造函数创造的对象的公共祖先，是一个属性，这个属性是一个对象
- 构造函数创造出来的对象可以继承原型上的方法和属性
- 就避免了开辟新的内存存放同样的方法和属性

- 原型链就是原型通过__proto__来查找上一层的原型，这样一直下去直到指向null，构成的链

- prototype 函数的原型（显示原型）； __proto__(或者[[prototype]])对象原型（隐式原型）。


#   Number  parseInt parseFloat
第一个例子中，Number 函数试图将给定的字符串转换为数字。由于 '123.3blue' 不是一个合法的数字，Number 函数返回 NaN（Not a Number）。

第二个例子中，parseInt 函数也试图将给定的字符串转换为数字。但是，它只会解析整数部分，遇到非数字字符就会停止解析。因此，对于 '123.3blue'，parseInt 返回整数部分 123。

第三个例子中，parseFloat 函数会尝试解析给定字符串并返回一个浮点数。与 parseInt 不同，parseFloat 可以解析小数点及其后面的数字。因此，对于 '123.3blue'，parseFloat 返回浮点数 123.3。

# js事件流机制
- 当用户点击页面浏览器页面时，浏览器主进程处理事件
- 跨进程间通信，渲染进程进行任务处理，事件循环机制进行处理
- js事件流就发生在这个时候
- 从window上往事件触发处传递，注册的捕获事件就会触发
- 从事件触发处往window上传递，注册的冒泡事件就会触发
- body -> div -> button 
- addEventListener
  - 第一个参数，必须。**字符串**指定事件名。
  - 第三个参数，**默认是false，即注册为冒泡事件**
- **当改为true，即注册为捕获事件**
```js
  box.addEventListener('click',()=>{

  },false)
```

```html
<ul class="color_list">        
    <li>red</li>        
    <li>orange</li>        
    <li>yellow</li>        
    <li>green</li>        
    <li>blue</li>        
    <li>purple</li>    
</ul>
<div class="box"></div>
```
```js
var color_list = document.querySelector("color_list")
color_list.addEventListener("click",(e)=>{
  var e = e || window.event;
  if(e.target.tagName.toLowerCase() === "li"){
    console.log("click")
  }
},false)
```
- 阻止事件冒泡
  - `stopPropagation`和`stopImmediatePropagation`的区别
  - 都可以阻止事件向上传播，后者还可以立即停止该节点上其他所有的事件监听器的执行
  - event.target.nodeName === event.CurrentTarget.nodeName
  - 触发的元素   绑定事件的元素
```html
<body onclick="handleClick(event)">
    <!-- e.target 和 e.currentTarget 区别？ -->
    <!-- js事件底层 
    先到达浏览器body 
    capture 事件捕获 
    event.target Dom节点 终点
    -->
    <button id="btn1">按钮1</button>
    <button id="btn2">按钮2</button>
    <button id="btn3">按钮3</button>

    <script>
        // 事件委托是js 优化的一种方案
        function handleClick(event) {
            console.log('点击了：', event.target.nodeName,
                ', 事件绑定在', event.currentTarget.nodeName
            );
        }
    </script>
</body>
```

# js和ts

# 对象哪些属性不可以被序列化
- 当是属性的值函数function或者undefined
- 当是属性的值是Symbol
- 当是属性的值是循环引用的对象
# get可以被序列化吗
- 完全可以，在被JSON.parse后可以正常调用
- get 属性实际上是一个访问器函数
- get 属性可以被序列化，因为它本身只是一个返回值的函数，而不是一个包含执行逻辑的函数。
```js
const obj = {
  firstName: 'John',
  lastName: 'Doe',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};

const serialized = JSON.stringify(obj);
console.log(serialized); // {"firstName":"John","lastName":"Doe"}

const deserialized = JSON.parse(serialized);
console.log(deserialized.fullName); // "John Doe"
```

# 高阶函数
- 指可以接收一个或多个函数作为参数，并且/或者返回一个新的函数的函数。
- 常见的高阶函数包括 map、filter 和 reduce 等



```











