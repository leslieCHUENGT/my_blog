# 常见api的使用
## String.prototype.split(separator, limit) 分裂
```js
// 可以寻找参数所处的位置进行分割
// 返回值是一个数组
// 对参数的左右进行分为数组的元素
const str = 'The quick brown fox jumps over the lazy dog.';

const words = str.split(' ',3);
console.log(words);
// Array ["The", "quick", "brown"] 

const chars = str.split('');
console.log(chars);
// Array ["T", "h", "e", " ", "q", "u", "i", "c", "k", " ", "b", "r", "o", "w", "n", " ", "f", "o", "x", " ", "j", "u", "m", "p", "s", " ", "o", "v", "e", "r", " ", "t", "h", "e", " ", "l", "a", "z", "y", " ", "d", "o", "g", "."] 

const strCopy = str.split();
console.log(strCopy);
//  Array ["The quick brown fox jumps over the lazy dog."]

// 将字符串分为一个一个，并且以数组形式返回
console.log("abc".split("")) // ["a","b","c"]
// 不加双引号就什么都不做
console.log("abc".split()) // ["abc"]

```
## String.prototype.slice(start, end) 片
```
const str = 'The quick brown fox jumps over the lazy dog.';

// 从0开始
console.log(str.slice(31));
// Expected output: "the lazy dog."

console.log(str.slice(1, 2));
// Expected output: "h"
// 如果该参数为负数，则被看作是 strLength + endIndex
console.log(str.slice(-4));
// Expected output: "dog."

console.log(str.slice(-9, -5));
// Expected output: "lazy"
```

## Array.prototype.splice()
```js
const months = ['Jan', 'March', 'April', 'June'];
// 对原数组进行切割
months.splice(1, 0, 'Feb');// 从索引1开始，删除0个，加入一个'Feb'元素
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May');
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]

```
## decodeURIComponent()、encodeURIComponent()
```
// encodeURIComponent()`将字符串"hello world!"编码为URI组件
// 编码后的结果为"hello%20world%21"。
// decodeURIComponent("hello%20world%21")`，
// 返回的结果为"hello world!"。

```


## String.prototype.toLowerCase()
## Object.prototype.assign()
```
// Object.assign直接可以合并对象，目标对象是第一个参数
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };
const obj3 = { d: 4 };

const mergedObj = Object.assign({}, obj1, obj2, obj3);

console.log(mergedObj); // 输出：{ a: 1, b: 2, c: 3, d: 4 }
console.log(obj1);      // 输出：{ a: 1, b: 2 }

```
##  Array.prototype.indexOf()
```
// 找不到就返回-1
// 找到了就返回下标的值
const str = 'ant'
console.log(str.indexOf('an'))// 0
```
##  Array.prototype.join()
```js
const elements = ['a','b','c'];

console.log(elements.join());
// Expected output: "a,b,c"

console.log(elements.join(''));
// Expected output: "abc"

console.log(elements.join('-'));
// Expected output: "a-b-c"

const elements = ['a','b','c'];

console.log(elements.join("%D"));
// Expected output: "a%Db%Dc"
```
## Array.from() 
- 此方法是数组上的静态方法，可以使**可迭代或类数组对象**创建一个新的浅拷贝对象
```js
console.log(Array.from('foo'));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], x => x + x));
// Expected output: Array [2, 4, 6]

```
## Math.floor()
```
// 返回小于等于该整数的数值
Math.floor(-5.05)
// -6
```
## paserInt()
```
// 接收两个参数
// 第一个参数：要被解析的值，如果参数不是一个字符串，则将其转换为字符串
// 第二个参数：进制2-32，0或者未指定，根据字符串的值进行推算。
```
## Object.entries()
- entries() 方法会返回一个新的 Iterator 对象，其中每个元素是一个包含两个元素的数组，第一个为键，第二个为对应的值。
```js
const map = new Map([["a", 1], ["b", 2], ["c", 3]]);
const arr = [...map.entries()];
console.log(arr);
// 输出的是可迭代对象，每个元素都是数组，有两个元素
// 输出：[["a", 1], ["b", 2], ["c", 3]]

```
## Array.findIndex()
- 里面的是函数
![[Pasted image 20230622170929.png]]
## for in和for of的区别
- for in 遍历的是index，并且这个index是string类型的，也会遍历原型上自定义的属性、方法，for of遍历的是value
- for of 适合遍历有迭代器的类型
	- Array、Map、String、Arguments
	- 对象没有迭代器，要想遍历就用Objecy.keys()
# 经典手写题思路整理
## mermoize
- 高阶函数
- 作用就是形成闭包，进行缓存
- 闭包
- 有则取，无则apply
## curry
- 不是高阶函数，返回的不是新函数
- 参数满了则直接调用而不是使用 apply
- 参数没满则进行递归等待参数的进入
- 第一次的参数是默认参数，后面的函数调用都以它为第一个参数
## compose
- 把一个个函数的返回值当成参数
- 因此参数就是函数列表数组
- 判断长度
	- 恒等式
	- 函数数组第一个元素
	- 调用reduce，实际上返回的是函数：接受参数
	- 理解reduce的用法，上一个函数的返回值就是prev，函数的调用、执行
## instanceof
- `instanceof` 只能检测**对象**是否是某个**构造函数**的实例
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
const p = new Person('Tom', 18);
console.log(p instanceof Person);    // true
```
## 数组的深度
```js
// 对递归的理解要更加深刻
// 深度->递归->确定参数和返回值、终止条件、单层逻辑
// 确定参数和返回值：返回值是深度
const getArrayDepth = (arr) => {
	// 是数组则
	if(Array.isArray(arr)){
		let maxDepth = 0;// 记录后续的深度
		// 遍历记录
		for(let i = 0;i < arr.length;i++){
			maxDepth = Math.max(getArrayDepth(arr[i]), maxDepth);
		}
		return 1 + maxDepth;
	}else{
		return 0;
	}
}

```
## 数组拍扁
- 使用reduce方法，默认的初始值为空数组，进行判断cur是否是数组，记住prev是数组，要进行展开
- 尾递归优化，参数必须携带结果函数，对该数组元素进行递归拆分，返回值也是
- 调用toString()可以把中括号剔除，再用split(',')可以构成数组，但是元素是字符串，调用map方法
### new
- 确定参数：构造函数，参数(展开运算符)
- 先是绑定原型：Object.create(),这个函数的底层实现就是创建一个新的函数，绑定原型，进而 new  返回这个函数
- 调用构造函数，绑定this
## 订阅发布者模式
- constructor函数定义this.events = new Map()
- on 方法绑定事件和回调函数
	- 必须是先进行获取检测
- emit 方法触发事件，执行所有回调函数，需要传递参数
- off 方法移除所有的回调函数或者指定的函数列表(在元素都是函数的数组里)
- once 方法创造一个只执行一次的回调函数，用到高阶函数的思路，因为要完成只实现一次的功能，那么就要调用off方法，重写回调函数，使得可以接受参数，绑定this
## 观察者模式

# 排序
## 归并排序
### code
```js
// 归并排序

// 思路:中间拆、拆到单、回溯合并
//

const mergeSort = (arr) => {

    if (arr.length < 2) return arr;

    // 拆分

    let midIndex = Math.floor(arr.length / 2);// arr.length >> 1

    let left = arr.slice(0, midIndex),

        right = arr.slice(midIndex);

    // 返回

    return merge(mergeSort(left), mergeSort(right));

}

// 合并

const merge = (left, right) => {

    let result = [];

    // 情况1

    while (left.length && right.length) {
		// 判断条件是<=如果是<那么不稳定
        if (left[0] <= right[0]) {

            result.push(left.shift());

        } else {

            result.push(right.shift());

        }

    }

    // 情况2

    while (left.length) result.push(left.shift());

    // 情况3

    while (right.length) result.push(right.shift());

    // 返回

    return result;

}

```
### 分析
- **不是原地排序算法**，原地排序算法是仅使用输入数组本身的空间，需要额外的空间来存储临时数组，合并操作时需要开辟新的数组空间
- **是稳定的排序算法**，稳定排序算法是指排序后相等的元素，相对顺序会不会改变
- **时间复杂度：拆logn步，合并n步。故为nlogn**
## 快速排序
### code
```js
// 快排

// 定基准，放两边，直到单，回溯合并
// 

function quickSort(arr) {

    if (arr.length < 2) return arr;

    // 定基准

    let pivot = arr[0];

    let left = [], right = [];

    // 存放

    for (let i = 1; i < arr.length; i++){

        if (arr[i] < pivot) {

            left.push(arr[i]);

        } else {

            greater.push(arr[i]);

        }

    }

    // 递归拆、回溯合并

    return quickSort(left).concat(pivot, quickSort(right));

}

// 双指针法
function quickSort(arr, left = 0, right = arr.length - 1) {

    // 如果数组元素小于等于1个，则返回

    if (left >= right) return;

    // 取第一个元素为基准值

    const pivot = arr[left];

    // 定义左右指针

    let i = left;

    let j = right;

    // 利用左右指针交换元素位置

    while (i < j) {

        // 从右边向左扫描，找到第一个小于基准值的元素

        while (arr[j] >= pivot && i < j) {

            j--;

        }

        // 从左边向右扫描，找到第一个大于基准值的元素

        while (arr[i] <= pivot && i < j) {

            i++;

        }

        // 如果左右指针未相遇，交换元素位置

        if (i < j) {

            [arr[i], arr[j]] = [arr[j], arr[i]];

        }

    }

    // 将基准值归位

    [arr[left], arr[i]] = [arr[i], arr[left]];

    // 递归对左右两个子序列进行快排

    quickSort(arr, left, i - 1);

    quickSort(arr, i + 1, right);

    // 返回有序数组

    return arr;

}
```

### 分析
![[Pasted image 20230601164555.png]]
- 双指针法下的快排是原地排序
- 采用两个数组存放：定基准、放两边、拆到单、回溯合并
- 双指针：参数三、判断单、循环交换（注意都有i < j）、将基准值放中间、快排子序列
- 不稳定：**相同元素之间的顺序可能会改变，交换**
- 每次分区所选取的枢轴元素都恰好为中间位置时，快排的时间复杂度为 O(nlogn)
	- 原因是分区的时候比较log2n，进行分区n次
- 每次分区所选取的枢轴元素恰好为最大或最小值，时间复杂度达到 O(n^2)
	- 原因是分区的时候比较n-1，进行分区 n次


## 归并排序和快速排序的区别
- 归并是由下而上，先处理子问题，再合并
- 快排是由上而下，先分区，再处理子问题
- 归并稳定，但是不是原地排序算法
- 快排不稳定，但是是原地排序算法
## 冒泡排序
- 比较相邻的两个数字，前面的数字比后面大，则交换
```js
// 因为后续是 j + 1 与 j 作比较，所以遍历的时候可以 len - 1, len - i -1
function bubbleSort(arr){
	const len = arr.length;
	for(let i = 0;i < len - 1;i++){
		for(let j = 0;i < len - i - 1;j++){
			if(arr[j] > arr[j + 1]){
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];// es6结构
			}
		}
	}
}
```
## 选择排序
```js
// 思想就是找到最小的，放前面
// 第一层循环 lne - 1 因为第二层
// 第二层循环从 i + 1 开始，
function selectionSort(arr){
	const len = arr.length;
	let minIndex;
	for(let i = 0;i < len - 1;i++){
		for(let j = i + 1;j < len;j++){
			if(arr[j] < arr[minindex]){
				minIndex = j;
			}
		}
		// 交换放前面
		[arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
	}
	return arr;
}

```
# 分割URL参数

```js
// https://www.example.com/search?query=JavaScript&sort=desc&page=2
// 主机号就是域名
// 第一个?号后面带参数
function spiltUrlParams(url,res){
	// key-value存放参数信息
	// let params = {};
	// 得到发送的参数信息
	
	let paramsTemp = url.spilt("?")[1];
	if(!paramsTemp) return;
	
	params.spilt("&").forEach((item)=>{
		let itemArray = (item.spilt('='));
		let parmasName = decodeURIComponent(itemArray[0]);
		let paramsValue = decodeURIComponent(itemArray[1]);
		if(parmasName === res){
			return paramsValue;
		}
	})	
}
```
# 合并对象
```js
const mergeObjects = (...agrs) => {// 展开运算符进行合并为一个数组
	let mergeObj = {};
	agrs.forEach((item)=>{
		for(const v in item){
			if(item.hasOwnProperty(v)){
				mergeObj[v] = item[v];
			}
		}
	})
	return mergeObj;
}
```
# 数组去重
```js
// 方法一，使用Set
const arr = [1, 2, 2, 3, 3, 4];
const uniqueArr = [...new Set(arr)]
// 方法二，使用filter和indexOf
const uniqueArr = arr.filter((item, index) => {
	// 调用indexOf会找到第一个下标
	return arr.indexOf(item) === index;
})
```
# 回溯算法
## 组合
- 给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的**组合**。你可以按 **任何顺序** 返回答案。
- 思路：控制深度和宽度的问题。
- 细节：
	- 终止条件里必须 return; 
	- 简单剪枝：n - i + 1 >= k - path.length
	- 递归的参数 i + 1
```js
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```
## 组合总和II
- 找出所有相加之和为 n 的 k 个数的**组合**，且满足下列条件：
- **只使用数字 1 到 9**
- 每个数字 最多使用一次 
- 返回 所有可能的有效组合的列表 。该列表不能包含相同的组合两次，组合可以以任何顺序返回。

- 1-9于是控制了宽度、求和必定可以剪枝、组合问题
## 电话号码的字母组合
- for of
- .slipt("")
- .join()
## 组合总和
- 从给定的数组里进行取值
- **必须进行排序，否则后序剪枝操作无法进行**
- 可以重复选取，那么传递参数的 i 没必要加 1
- 求和必定可以剪枝
## 组合总和II
- [1,2,2,2,2,2,2,3,3,3]
- 每个数组只可以选一次且有重复的元素，需要用到数组前后元素比较来进行去重
```
// 当前元素和前一个元素进行比较
// 保证同一树层的取值不能相同

if(i > startIndex && candidates[i] === candidates[i - 1]){
	continue;
}
```


## 分割回文串
- 判断是否是回文子串
```
const isPalindrome = (s, l ,r) => {
	for(let i = l, j = r;i < j; i++, j--){
		if(s[i] !== s[j]) return false;
	}
	return true;
}
```
- 切板子，i 和 startIndex 之间进行切切切
- 切的时候注意api调用为slice(startIndex, i + 1 )

## 复原IP地址
- s = "25525511135"
- 回溯算法进行切割，板板板
- 切割slice(startIndex, i + 1)，判断符不符合条件
- [255,255,11,135].join('.')
## 子集
-  从给定数组里取值，都要进行排序，但是这题可以不排序
- 没有终止条件直接push

## 子集II
- 可能含有重复元素，排序完才能，使用同树层去重的方法
- 当前元素和前一个比较 && i > startIndex
## 递增子序列
-  **因为含有重复元素，所以必须在同一树层上进行去去重**
-  本题不可以进行排序，再前后比较的方法进行去重，要求的是递增子序列
-  **定义used[]来进行去重**
```
if(){

}
let uset = [];// 同一树层去重，uset放这里
for(){
	// 必须先进行一个比较的剪枝
	if(path.length > 0 && nums[i] < path[path.length - 1]){
		// 注意细节的处理，当是求组合的和，可以用i > startIndex
		// 但是此时i > startIndex时，path里不一定有元素
	}
	if(uset[nums[i] + 100]) continue;
	uset[nums[i] + 100] = true;// 数组元素大于-100 小于100，那么就用这种方式
}
```
## 全排列
-  不含有重复元素，求全排列
- 全排列和组合问题的不同就是，元素的顺序不同，那么结果也算是不同
- 此时递归的参数，不需要参数
- 但是同一树枝不可以用同样的元素
```
// 实质上就是标记index
const used = [];
const dfs = () => {
	if(){}
	for(){
		if(used[i]) continue;
		used[i] = true;
		...
		used[i] = false;
	}
}
```

## 全排列II
-  含有重复元素，求全排列
-  全排列问题先就需要进行树枝去重：used[]
-  再是进行树层的去重，排序后，前后元素进行比较

# BFS和DFS实现document.querySelectAll('.a')
- 正则表达式中的` \b `是一个特殊的元字符，可以匹配一个在单词边界位置的零宽度断言。
- // 包裹，\b \b里面的是匹配的单个的字符串
```js
/\ba\b/.test(node.className)

```
- `node.nodeType === 1` 为判断是否是元素节点
## DFS实现
```js
function dfsFindNode(node){
	const res = [];
	if(node && node.nodeType === 1){// 判断是否是元素节点
		if(/\ba\b/.test(node.className)){
			// 符合条件
			res.push(node);
		}
		const children = node.children;// 当前节点的子节点
		const len = children.length;
		if(len === null) break;
		for(let i = 0;i < len;i++){
			const child = children[i];
			res.push(...dfsFindNode(child))
		}
	}
	return res;
}
```
## BFS实现
```js
function bfsFindNode(node){
	const res = [];
	const queue = [node];
	while(queue.length > 0){
		const cur = queue.length;
		if(cur.nodeType === 1 && /\ba\b/.tast(cur.className)){
			res.push(cur);
		}
		const children = cur.children;
		for(let i = 0; i < children.length; i++){
			const child = children[i];
			queue.push(child);
		}
	}
	return res;
}

```

# 动态规划
##  理论
- 确定dp数组的含义
- 初始化dp数组
- 确定递推公式
- 确定遍历顺序
## 斐波那契数列
- 递归
```js
function fibonacciRecursive(n){
	if(n <= 1) return n;
	return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}
// 时间复杂度O(2^n),每个递归分解成两个递归
// 空间复杂度O(2n)->O(n)
```
- 尾递归优化
- 把上面的返回值整合成一个函数返回
```js
// 尾递归优化，三个参数，在参数里进行加减法
function fibonacciRecursive(n, start = 1, total = 1){
	// 终止条件，当为前两项时，直接返回结果
	if(n <= 2) return total;
	return fibonacciRecursive(n - 1, total, total + start);
}
// 时间复杂度降为O(n)
```
- 迭代法
```js
function fibonacciRecursive(n){
	if(n <= 1) return n;
	// 定义前后变量进行累加
	let prev = 0, cur = 1;
	for(let i = 2; i <= n; i++){
		let next = prev + cur;
		prev = cur;
		cur = next;
	}
	return cur;
}
// O(n) 
// O(1)
```
- 动态规划
```js
function fibonacciRecursive(n){
	if(n <= 1) return n;
	// 定义dp数组
	const dp = new Array(n + 1);
	// 初始化dp数组
	dp[0] = 0;
	dp[1] = 1;
	// 遍历
	for(let i = 2;i <= n;i++){
		dp[i] = dp[i-1] + dp[i-2];
	}
	return dp[n];
}
// O(n)
// O(n)
```

## 爬楼梯
```js
function sultion(n){
	// 确定dp数组的含义，
	let dp = [1,1];
	for(let i = 2;i <= n;i++){
		dp[i] = dp[i-1] +dp[i-2];
	}
	return dp[n];
}

```


## 使用最小花费爬楼梯
```js
// 确定dp数组的含义：爬到第i层楼的最小花费是dp[i]
const minCostClimbingStairs = (cost) =>{
	let len = cost.length;
	// 初始化dp数组
	let dp = new Array(len + 1);
	dp[0] = dp[1] = 0;
	// 确定遍历顺序
	for(let i = 2;i <= len;i++){// i的起始值以dp为准
		// dp[i] 的来源有两种 
		// 就是该层对应的花费
		dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
	} 
	return dp[len];
}

```
## 不同路径
```js
// 确定dp数组的含义：到i x j阶有dp[i - 1][j - 1]种方法
const uniquePaths = (m, n) => {
	// 定义dp数组
	let dp = new Array(m).fill().map(()=>Array(n).fill());
	// 初始化dp数组
	for(let i = 0;i < m;i++){
		dp[i][0] = 1;
	}
	for(let j = 0;j < n;j++){
		dp[0][j] = 1;
	}
	// 确定遍历顺序
	for(let i = 1;i < m;i++){
		for(let j = 1;j < n;j++){
			// 确定递推公式
			dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
		}
	}
	return dp[m - 1][n - 1];
}
// 确定dp数组的含义：到i x j阶有dp[i - 1][j - 1]种方法
const uniquePathsWithObstacles = (obstacleGrid) =>{
	// 拿到行列的长度，直接.length拿的是行数，[0].length拿的是列数
	const m = obstacleGrid.length;
	const n = obstacleGrid[0].length;
	// 初始化dp数组
	let dp = new Array(m).fill().map(()=>Array(n));
	for(let i = 0;i < m && obstacleGrid[i][0] === 0;i++){
		dp[i][0] = 1;
	}
	for (let i = 0; i < n && obstacleGrid[0][i] === 0; ++i) {
        dp[0][i] = 1;
    }
    // 确定遍历顺序
    for(let i = 1;i < m;i++){
	    for(let j = 1;j < n;j++){
		    dp[i][j] = obstacleGrid[i][j] === 1 ? 0 : dp[i - 1][j] + dp[i][j - 1];
	    }
    }
	return dp[m - 1][n - 1];
}
```

## 01背包问题
```js
// 确定dp数组的含义：容量为i的背包可以装下的最大价值为dp[i]
const weightBag = (wight, value, size) =>{
	const len = wight.length;
	// 定义dp数组以及初始化，01背包问题会进行倒叙遍历，所以全部赋值为0
	const dp = new Array(size + 1).fill(0);
	// 确定遍历顺序，先遍历物品，后遍历背包
	for(let i = 0;i < len;i++){
		// 倒叙遍历背包
		for(let j = size;j >= wight[i];j--){
			// 确定递推公式：dp[j]的来源,装与不装
			dp[j] = Math.max(dp[j],value[i] + dp[j - wight[i]]);
		}
	}
	return dp[size];
}

```
## 分割等和子集
```js
// 确定dp数组的含义：容量为i的背包装下最大的价值为dp[i]
const canPartition = (nums) => {
	// 求和
	const sum = nums.reduce((p,v) => p + v);
	// 必须为偶数
	if(sum & 1)return false;
	let len = sum/2 + 1;
	// 定义dp数组
	const dp = new Array(len);
	// 初始化，装包问题，都为0
	dp.fill(0);
	//确定遍历顺序,01背包问题
	for(let i = 0;i < nums.length;i++){
		for(let j = sum/2;j >= nums[i];j--){
			// 确定递推公式,装与不装
			dp[j] = Math.max(dp[j],dp[j - nums[i]] + nums[i]);
			if(dp[j] === sum/2) return true;
		}
	}
	return false;
}
```
## 最后一块石头的重量
```js
// 确定dp数组的含义：容量为i最大能装dp[i]
var lastStoneWeightII = function (stones) {
    const sum = stones.reduce((p,v)=>p+v);
    // 和不一定是偶数，sum >> 1 位运算也可以
    const dpLen = Math.floor(sum/2);
    // 定义dp数组以及初始化，01背包问题，先都初始化为0
    const dp = Array(1+dpLen).fill(0);
    // 确定遍历顺序
    for(let i=0;i<stones.length;i++){
        for(let j=dpLen;j>=stones[i];j--){
            dp[j] = Math.max(dp[j],dp[j-stones[i]]+stones[i])
        }
    }
    return sum-dp[dpLen]-dp[dpLen];
};
```
## 目标和
```js
// 确定dp数组的含义：01背包问题，确定方法总数，容量为j最多有dp[j]种方法
const findTargetSumWays = (nums, target) => {
	// 求和
	const sum = nums.reduce((p, v) => p + v);
	// 判断基本条件
	if(Math.abs(target) > sum) return 0;
	if((target + sum) % 2) return 0;// 相加为偶数
	// 求容量的值
	const halfSum = (sum + target);
	// 定义dp数组,01背包问题，先赋值成0
	let dp = new Array(halfSum + 1).fill(0);
	// 初始化,涉及方法的问题,第一个值为1
	dp[0] = 1;
	// 确定遍历顺序
	for(let i = 0;i < nums.length;i++){
		for(let j = halfSum;j >= nums[i];j++){
			// 确定递推公式
			dp[j] += dp[j - nums[i]]
		}
	}
}

```
## 一和零
```js
// 确定dp数组的含义：01背包问题，最多可以装多少个物品
const findMaxForm = (strs, n ,m) => {
	// 定义dp数组,01背包问题的初始化
	const dp = new Array(n + 1).fill().map(() => Array(m + 1).fill(0));
	let numOfZeros, numOfOnes;
	for(const str of strs){
		numOfZeros = 0;
		numOfOnes = 0;
		for(const s of str){
			if(s === '1'){
				numOfOnes++;
			}else{
				numOfZeros++;
			}
		}
		// 遍历背包
		for(let i = m; i >= numOfZeros; i--){
			for(let j = m; j >= numOfOnes; j--){
				// 确定递推公式，能装下则物品的个数加一就是
				dp[i][j] = Math.max(dp[i][j], dp[i - numOfZeros][j - numOfOnes] + 1);
			}
		}
	}
}

```

## 完全背包问题
- **如果求组合数就是外层for循环遍历物品，内层for遍历背包**
- **如果求排列数就是外层for遍历背包，内层for循环遍历物品**。
```js
// 物品可以无限使用
function completePack(){
	let wight = [1, 3, 5];
	let value = [15, 20, 30];
	let bagWight = 4;
	// 定义dp数组，及初始化
	let dp = new Array(bagWight + 1).fill(0);
    for(let i = 0; i <= weight.length; i++) {
	    // 起始值设置为物品的重量
        for(let j = weight[i]; j <= bagWeight; j++) {
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
        }
    }
}

```
## 零钱兑换
```js
// 分析:完全背包问题
// 确定dp数组的含义：容量为i最多有dp[i]种方法
const change = (amount, coins) => {
	// 定义dp数组以及初始化
	let dp = new Array(amount + 1).fill(0);
	// 首项必须是1
	dp[0] = 1;
	// 确定遍历顺序
	for(let i = 0;i < amount.length;i++){
		for(let j = coins[i];j <= amount;j++){
			dp[j] += dp[j - coins[i]];
		}
	}
	return dp[amount];
}

// 贪心
function change(amount, coins){
	// 

}

```

## 组合总和
```js
// 完全背包问题
// 确定dp数组的含义：容量为i最多有dp[i]种方式
const combinationSum4 = (nums, target) => {
	// 定义dp数组以及初始化为0
	let dp = Array(target + 1).fill(0);
	// 首项为1种方法
	dp[0] = 1;
	// 
	for(let i = 0;i < target;i++){
		for(let j = 0;j < nums.length;j++){
			// 必须满足容量大于物品重量
			if(i >= nums[j]){
				dp[i] += dp[i - nums[j]]; 
			}
		}
	}
	return dp[target];
}
```
## 零钱兑换
```js
// 确定题意，固定容量的背包来装，凑齐容量，并且要找个数最少
const coinChange = (coin, amount) => {
	if(!amount) return 0;
	// 定义dp数组以及初始化
	const dp = new Array(amount + 1).fill(Infinity);
	// 容量为0时，必须赋值为0个，前序开始，如果没有赋值，那么就会全部是 Infinity
	dp[0] = 0;
	// 确定遍历顺序
	for(let i = 0; i < coin.length; i++){
		for(let j = coin[i];j <= amount;j++){
			dp[j] = Math.min(dp[j - coin[i]] + 1, dp[j])
		}
	}
	return (dp[amount] === Infinity) ? -1 : dp[amount];
}
```

## 完全平方数
```js



```

# 数组
## 二分查找
```js
function search(nums, target){
	let mid,left,right;
	left = 0;
	right = nums.length;
	while(left <= right){
		mid = left + ((right - left) >> 1);
		if(nums[mid] > target){
			right = mid - 1;
		}else if(nums[mid] < target){
			left = mid + 1;
		}else{
			return mid;
		}
	}
	return -1;
}

```
## 移除元素
```js
// 不要使用额外的数组空间，你必须仅使用 `O(1)` 额外空间并 [原地] 修改数组
// 快慢指针修改数组的元素
function removeElement(nums, val){
	let slowIndex = 0;
	// 遍历
	for(let fastIndex = 0;i < nums.length;i++){
		if(nums[fastIndex] !== val){
			nums[slowIndex++] = nums[fastIndex];
		}
	}
	return slowIndex;
}
```
## 有序数组的平方
```js
// 最大值必在两倍
function sortedSquares(nums){
	let n = nums.length;
	// 定义指针,前后尾三个指针
	let i = 0,j = n - 1,k = n - 1;
	// 定义新数组进行存放
	let res = new Array(n).fill(0);
	while(i <= j){
		let left = nums[i] * nums[i],
			right = nums[j] * nums[j];
		if(left < right){
			res[k--] = right;
			j--;
		}else{
			res[k--] = left;
			i++;
		}
	}
	return res;
}

```
## 滑动窗口
- 脑海的思路
- 定义快慢指针，快指针和边界作比较
- 慢指针和快指针之间的差值就是长度
- 两个while循环
### 长度最小的子数组
```js
function minSubArrayLen(target, nums){
	let start = 0, end = 0;
	let sum = 0;
	let len = nums.length;
	let ans = Infinity;// 记录最小的长度
	while(end < len){// 尾指针的最大长度就是len - 1
		sum += nums[end];
		while(sum >= target){
			ans = Math.min(ans, end - start + 1);
			sum -= nums[start];
			start++;
		}
		end++;
	}
	
}
```
## 无重复字符的最长子串
```js
// 使用map来实现滑动窗口
// 通过.has来更新子串的起点位置
// 外部定义变量来记录最大的长度
const lengthOfLongestSubstring = () => {
	const Map = new Map();
	// 记录最长子串的长度
	let maxLength = 0;
	// 记录子串的起始位置
	let start = 0;
	// 遍历
	for(let i = 0;i < s.length;i++){
		const ch = s[i];
		// 如果 ch 出现过，更新子串的更新位置
		if(map.has(ch) && map.get(ch) >= start){
			satrt = map.get(ch) + 1;
		}
		// 存放
		map.set(ch, i);
		// 更新最大长度
		maxLength = Math.max(maxLength, i - start + 1);
	}
	return maxLength;
}
```
## 摩尔投票法解决主要元素问题
```js
function majorityElement(nums){
	// 定义候选者和计数器
	let count = 0;
	let candidate = null;
	// 遍历数组找到候选元素
	for(let num of nums){
		if(count === 0){
			candidate = num;
		}
		count += (num ==== candidate) ? 1 : -1;
	}
	// 再次遍历进行统计次数
	for(let num of nums){
		if(num === candidate){
			count++;
		}
	}
	return (count > nums.length / 2) ? candidate : -1;
}
```
- 使用Map来实现
```js
function majortyElement(nums){
	const map = new Map();
	for(let i = 0;i < nums.length;i++){
		if(map.has(nums[i])){
			map.set(nums[i], map.get(nums[i]) + 1);
		}else{
			map.set(nums[i], 1);
		}
	}
	let res = -1;
	let maxCount = 0;
	for(let [key, value] of map){
		if( value > nums.length / 2){
			res = key;
		}
	}
	return res;
}
```
## 数组中最多使用的一个或多个元素
```js
// 整体思路：MAP 存放 ，.values()取极值
function getMostCommonElements(arr) {
	const Map = new Map();
	// 遍历
	for(let i = 0;i < arr.length;i++){
		// 判断是否已经进行了保存
		if(Map.has(arr[i])){
			Map.set(arr[i], Map.get(arr[i]) + 1);
		}else{
			Map.set(arr[i], 1);
		}
	}
	// 取极值
	let maxCount = Math.max(...Map.values);
	let res = [];
	let count = 0;
	for(const [key, value] of Map.entires(){
		if(value === maxCount){
			res.push(key);
		}
	}
	return res;
}
```
## 元音字母
```js
// 思路:用Set()包裹字母集合，.has来实现查找
const isSimilar = (s) => {
	const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']);
	const midIndex = s,length / 2;
	let countA = 0, countB = 0;
	for(let i = 0;i < s.length;i++){
		let ch = s[i];// 等同于 s.charAt(i) 
		if(vowels.has(ch)){
			if(i < midIndex){
				countA++;
			}else{
				countB++;
			}
		}
	}
	return countA === countB;
}

```
# 版本号排序
```js
const versions = ["1.2.1", "1.0.2", "1.3.2", "1.1", "1.2", "1", "1.10.0"]; 
// 升序排序 
versions.sort(compareVersion); 
console.log(versions); // ["1", "1.0.2", "1.1", "1.2", "1.2.1", "1.3.2", "1.10.0"] 
// 降序排序 
versions.sort((a, b) => compareVersion(b, a)); 
console.log(versions); // ["1.10.0", "1.3.2", "1.2.1", "1.2", "1.1", "1.0.2", "1"]
// 整体思路:重写 sort 方法
// 通过字符串分割成数组，比较数组的元素的大小
// 注意的是以最大长度进行遍历，然后取数组元素的时候进行比较有没有超过长度，再进行 parseInt
const compareVersion = (version1, version2) => {
	const arr1 = version1.spilt('.');
	const arr2 = version2.split('.');
	const len = Math.max(arr1.length, arr2.length);
	for(let i = 0;i < len;i++){
		const num1 = i > arr1.length ? 0 : parseInt(arr1[i]);
		const num2 = i > arr2.length ? 0 : parseInt(arr2[i]);
		if(num1 < num2){
			return -1;
		}else if(num1 > num2){
			return 1;
		}
	}
	// 考虑最后是等于的情况
	return 0;
}
```
# 链表
## 翻转链表
- 迭代法
```js
const reverseList = (head) => {
	if(!head || !head.next) return head;
	let prev = null;
	let cur = head;
	// 遍历
	while(cur !== null){
		const next = cur.next;
		cur.next = prev;
		prev = cur;
		cur = next;
	}
	return prev;
}
```
- 递归法
```js
const reverseList = (head) => {
	// 处理边界
	if(!head || !head.next) return head;
	// 递归处理剩余节点
	const tail = reverseList(head.next);
	head.next.next = head;
	// 将指向赋值为null
	head.next = null;
	return tail;
}
```
## 合并有序链表
```js
// 考虑l1、 l2的长度问题
// 迭代法解决问题
const merge = (l1, l2){
	// 定义虚拟头结点
	let prevHead = new ListNode(0);
	let prev = prevHead;
	while(l1 && l2){
		if(l1.val < l2.val){
			prev.next = l1;
			
			l1 = l1.next;
		}else{
			prev.next = l2;
			l2 = l2.next;
		}
		prev = prev.next;
	}
	prev.next = l1 ? l2 : l1;
	return prevHead.next;
}

```

## 判断链表是否有环
```js
// 实现思路就是快指针每次移动两步，慢指针每次移动一步
const hasCycle = (head) => {
	if(!head || !head.next) return false;
	let slow = head;
	let fast = head.next;
	// 当相等时跳出循环
	while(slow !== fast){
		// 必须满足指向不能指向null
		if(!fast || !fast.next){
			return false;
		}
		slow = slow.next;
		fast = fast.next.next;
	}
	return true;
}
```
# 最长公共前缀
```js
function longestCommonPrefix(strs){
	if(strs.length === 0) return '';
	// 先赋值初始值，后续不断缩小
	let prefix = strs[0];
	for(let i = 0;i < strs.length;i++){
		while(strs[i].indexOf(prefix) !== 0){
			prefix = prefix.slice(0, prefix.length - 1);
			if(prefix === '') return '';
		}
	}
	return prefix;
}

```
## 两数相加
```js
const addTwoNumber = (l1, l2) => {
	// 创造虚拟头结点
	const dummy = new ListNode(0);
	let cur = dummy;
	// 创建指针指向
	let p1 = l1,p2 = l2;
	// 记录进位状态
	let carry = 0;
	// 当两个均为空就停止遍历
	while(p1 || p2){
		const value1 = p1 ? p1.val : 0;
		const value2 = p2 ? p2.val : 0;
		// 求和
		let sum = value1 + value2 + carry;
		// 求进位的值
		carry = Math.floor(sum / 10);
		// 更新当前位置的值
		sum %= 10;
		// 创建新节点
		cur.next = new ListNode(sum);
		// 移动当前指针
		cur = cur.next;
		// 指针后移
		// 增加判断语句，可能不存在
		p1 && p1 = p1.next;
		p2 && p2 = p2.next;
	}
	if(carry > 0) cur.next = new ListNode(carry);
	return dummy.next;
}
```
## 

# 二叉树
- 基础模板
```js
// 涉及递归，那么就是三部曲
// 确定递归函数的参数和返回值
// 确定终止条件
// 确定单层逻辑
```
## 递归遍历
```js
const preorderTraversal = (root) => {
	let res = [];
	const dfs = (node) =>{
		if(node === null) return;
		res.push(node.val);
		dfs(node.left);
		dfs(node.right);
	}
	dfs(root);
	return res;
}
```
## 迭代法
```js
// 前序遍历
const preorderTraversal = (root, res = []) => {
	if(!root) return res;
	const stack = [root];
	let cur = null;
	while(stack.length){
		cur = stack.pop();
		res.push(cur.val);
		cur.right && stack.push(cur.right);
		cur.left && stack.push(cur.left);
	}
	return res;
}
```
## 层序遍历
```js
const levelOrder = (root) => {
	let res = [],queue = [root];
	if(root === null) return null;
	while(queue.length){
		let len = queue.length;
		let curLevel = [];
		for(let i = 0;i < len;i++){
			let node = queue.shift();
			curLevel.push(node.val);
			node.left && queue.push(node.left);
			node.right && queue.push(node.right);
		}
		res.push(curLevel);
	}
	return res;
}
```
## 翻转二叉树
```js
// 确定参数和返回值
const invertTree = (root) => {
	// 终止条件
	if(!root) return root;
	// 暂存
	let leftNode = root.left;
	// 重定义
	root.left = invertTree(root.right);
	root.right = invertTree(leftNode);
	return root;
}
```
## 对称二叉树
```js
const isSymmetric = (root) => {
	if(root.length <= 1) return root;
	const dfs = (left, right) =>{
		// 终止条件
		if(left !== null && right === null || left === null && right !== null)
			return false;
		else if(left === null && right === null)
			return true;
		else if(left.val !== right.val)
			return false;
		return dfs(left.left, right.right) && dfs(left.right,right.left)
	}
	dfs(root.left, root.right);
}

```
## 求二叉树最大深度
```js
function maxDepth(root){
	// 确定参数和返回值:返回值是高度
	// 后序遍历进行高度的统计
	const dfs = (node) => {
		// 终止条件
		if(node === null) return 0;
		// 单层逻辑
		let leftDepth = dfs(node.left);
		let rightDepth = dfs(node.right);
		
		return 1 + Math.max(leftDepth, rightDepth);
	}
	dfs(root);
}
```
## 最小深度
```js
var minDepth = function(root) {

    const getMinDepth = (node)=>{

        if(!node) return 0;

        let leftDepth = getMinDepth(node.left);

        let rightDepth = getMinDepth(node.right);

        if(node.left === null && node.right !==null) return 1+rightDepth;

        if(node.left !== null && node.right === null) return 1+leftDepth;

        return 1+Math.min(leftDepth,rightDepth)

    };

    return getMinDepth(root);

};

```
## 完全二叉树的节点数
```js
const countNodes = (root) =>{
	// 确定参数和返回值：
	// 后序遍历将高度统计
	const getNodeSum = (node) => {
		// 终止条件
		if(!node) return 0;
		// 处理返回值
		let left = getNodeSum(node.left);
		let right = getNodeSum(node.right);
		return left + right + 1;
	}
	getNodeSum(root);
}

```
## 平衡二叉树
```js
const isBalanced = (root) => {
	// 确定参数和返回值
	// 后序遍历将高度作差
	// 不符合条件之间返回 -1
	const dfs = (node) => {
		// 终止条件
		if(!node) return 0;
		let left = dfs(node.left);
		if(left === -1) return -1;
		let right = dfs(node.right);
		if(right === -1) return -1;
		// 后序遍历处理单层逻辑
		if(Math.abs(left - right) > 1){
			return -1;
		}else{
			return 1 + Math.max(left, right);
		}
	}
	return !(dfs(root) === -1);
}

```
## 二叉树的所有路径
```js
function binaryTreePath(root){
	let res = [];
	// 确定参数和返回值
	// 前序遍历，存储前面的路径信息，可以保存在参数里
	const dfs = (node, path) => {
		// 终止条件
		if(!node) return;
		// 叶子结点
		if(node.left === null && node.right === null){
			path += node.val;
			res.push(path);
			return; // 必须return
		}
		// 非叶子节点
		path += node.val + "->";
		dfs(node.left);
		dfs(node.right);
	}
	dfs(root, '');
	return res;
}

```
## 左叶子之和
```js
function sumOfLeftLeaves(root){
	// 确定参数和返回值
	// 后序遍历处理所有的左叶子
	// 返回值是和
	const nodeSum = (node) => {
		// 终止条件
		if(!node) return 0;
		let left = nodeSum(node.left);
		let right = nodeSum(node.right);
		// 处理当前节点的逻辑
		let mid = null;
		if(node.left && node.left.left === null && node.left.right === null){
			mid = node.left.val;
		}
		return left + right + mid;// 最后回溯返回是总和值
	}
	return nodeSum(root);
}
```
## 找树最下角的值
```js
function findBottomLeftValue(root){
	// 要返回节点，定义一个temp变量
	let resNode = null, maxPath = 0;
	// 确定参数和返回值
	// 求深度，找到第一个最深的叶子节点就是树最下角的值
	// 参数可以带有高度，便于前序逻辑的直接处理
	const dfs = (node, curPath) => {
		// 终止条件
		if(!node) return;
		// 最深的叶子节点
		if(node.left === null && node.right === null){
			if(curPath > maxPath){
				resNode = node.val;
				maxPath = curPath;
				return;
			}
		}
		dfs(node.left, curPath + 1);
		dfs(node.right, curPath + 1);
	}
	dfs(root, 1);
	return resNode;
}

```
	



# 构造函数
```
    写一个构造函数Foo，该函数每个实例为一个对象，形如{id:N},其中N表示第N次调用得到的。
    要求：
    1、不能使用全局变量
    2、直接调用Foo()也会返回实例化的对象 -> 立即执行函数 -> 可new可返回实例
    3、实例化的对象必须是Foo的实例
```

```js
const Foo = (function (){
	// 外部定义变量，形成闭包
	let count = 0;
	// 定义构造函数
	function Foo(){
		// 没有通过 new 运算符则
		if(!(this instanceof Foo)){
			return new Foo();
		}
		count++;
		this.count++;
	}
	return Foo;
})();
const foo1 = new Foo(); 
console.log(foo1); // { id: 1 } 
const foo2 = new Foo(); 
console.log(foo2); // { id: 2 } 
const foo3 = Foo(); 
console.log(foo3); // { id: 3 }
```

# 定时器递归
- 实现一个定时器函数myTimer(fn, a, b)， 
- 让fn执行， 第一次执行是a毫秒后， 第二次执行是a+b毫秒后， 第三次是a+2b毫秒， 第N次执行是a+Nb毫秒后 
- 要求： myTimer要有返回值，并且返回值是一个函数，调用该函数，可以让myTimer停掉
```js
function myTimer(fn, a, b){
	// 在外部定义，便于清除
	let timerId;
	let count = 0;
	// 定义函数
	function schedule(){
		const delay = a + count * b;
		timerId = setTimeout(() => {
			fn();
			count++;
			schedule();// 循环调用
		}, delay)
	}
	// 执行函数
	schedule();
	// 返回清除器
	return function(){
		clearTimeout(timerId);
	}
}

```

# 队列与栈
## 用栈实现队列
```js
let MyQueue = function(){
	// 定义的两个栈
	this.stackIn = [];
	this.stackOut = [];
}
MyQueue.prototype.push = function(x){
	this.stackIn.push(x);
}
MyQueue.prototype.pop = function(x){
	// 检测出栈的内容
	const size = this.stackOut.length;
	if(size)return this.stack.pop();
	while(this.stackIn.length){
		// 把入栈的元素都放入出栈里面
		this.stackOut.push(this.stackIn.pop());
	}
	// 返回出栈的元素
	return this.stackOut.pop()	
}
MyQueue.prototype.peek = function(){
	const x = this.pop();
	this.stackOut.push(x);
	return x;
}
MyQueue.prototype.empty(){
	return !this.stackIn.length && !this.stackOut.length;
}

```

## 用队列实现栈
```js
let MyStack = function(){
	this.queue = [];
}
MyStack.prototype.push = function(){
	this.queue.push(x);
}
MyStack.prototype.pop = function(){
	let size = this.queue.length;
	while(size-- > 1){
		this.queue.push(this.queue.shift())
	}
	return this.queue.shift();
}
MyStack.prototype.top = function() {
    const x = this.pop();
    this.queue.push(x);
    return x;
};
MyStack.prototype.empty = function() {
    return !this.queue.length;
};

```
## 括号匹配
```js
const isValid = function(str){
	const stack = [];
	const map = {
		"(":")",
		"{":"}",
		"[":"]"
	}
	// 遍历
	for(const x of str){
		// 用in运算符
		if(x in map){
			// 放入队列中
			stack.push(x);
			continue;
		}
		if(map[stack.pop()] !== x) return false;
	}
	return !stack.length;
}

```
## 删除字符串中的所有相邻重复项
```js
// 使用栈
const removeDuplicates = (s) => {
	const res = [];
	for(const i of s){
		// 和栈末元素进行比较
		if(i === res[res.length - 1]){
			res.pop();
		}else{
			res.push(i)
		}
	}
	return res.join('');
}
```
## 逆波兰表达式求值
- [150. 逆波兰表达式求值 - 力扣（LeetCode）](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)
```js
const evalRPN = function(tokens){
	// 栈来实现求值
	const stack = [];
	for(const token of tokens){
		if(isNaN(Number(token))){
			const n1 = stack.pop();
			const n2 = stack.push();
			switch(token){
				case "+":
					stack.push(n1 + n2);
					break;
				case "-":
					stack.pop(n1 - n2);
					break;
				case "*":
					stack.pop(n1 * n2);
					break;
				 case "/":
                    stack.push(n1 / n2 | 0);
                    break;
			}		
		}else{
			stack.push(Number(token));
		}
	}	
	return stack[0];
}
```



# 哈希表
## 前 `k` 个频率高的元素
```js
const topKFrequent = function(nums, k) {
  const freqMap = new Map(); // 创建一个空的 Map 对象，用于统计元素频率
  for (let num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1); // 计算每个元素的频率并存储在 freqMap 中
  }
  const bucket = []; // 创建一个空数组，用于存放元素的桶（按照频率分配）
  for (let [num, freq] of freqMap) { // 遍历 freqMap 的所有元素，将元素插入到对应频率的桶中
    if (!bucket[freq]) { // 如果当前频率的桶不存在，创建一个空数组作为该桶
      bucket[freq] = [];
    }
    bucket[freq].push(num); // 将当前元素插入到对应频率的桶中
  }
  const result = []; // 创建一个空数组，用于存放最终结果
  for (let i = bucket.length - 1; i >= 0 && result.length < k; i--) { // 从频率最高的桶开始遍历，直到满足取前 k 高的元素或桶已经遍历完
    if (bucket[i]) { // 如果当前频率存在桶（有元素），将桶中的元素加入到结果数组中
      result.push(...bucket[i]);
    }
  }
  return result; // 返回前 k 个高频元素的数组
};
```
## 两数之和
```js
// 哈希表查找
const twoSum = (nums, target) => {
	let Map = {};
	for(let i = 0;i < nums.length;i++){
		let temp = target - nums[i];
		if(Map.has(temp)){
			return [i, Map.get(temp)];
		}
		Map.set(nums[i], i);
	}
}
```
## 三数之和
```js
function threeSum(nums) {
  const result = [];

  if (nums.length < 3) {
    return result;
  }

  nums.sort((a, b) => a - b); // 排序

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue; // 跳过重复的元素
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        while (left < right && nums[left] === nums[left - 1]) {
          left++; // 跳过重复的元素
        }
        while (left < right && nums[right] === nums[right + 1]) {
          right--; // 跳过重复的元素
        }
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

```
## 四数相加
```js
// 和两数相加思路一致
const fourSum = (nums1, nums2, nums3, nums4) => {
	// 定义 Map
	const Map = new Map();
	let count = 0;
	// 遍历存储
	for(const n1 of nums1){
		for(const n2 of nums2){
			let sum = n1 + n2;
			Map.set(sum, (Map.get(sum) || 0) + 1)
		}
	}
	// 查找
	for(const n3 of nums3){
		for(const n4 of nums4){
			let sum = n3 + n4;
			count += Map.get(-sum) || 0;
		}
	}
	return count;
}

```
## 赎金信
```js
const canConstruct = (ransomNote, magazine){
	// 数组存放，26 字母表给予标记
	const strArray = new Array(26).fill(0);
	// ASCII 基准值
	const base = "a".charCodeAt();
	// 标记后者
	for(const s of magazine){
		strArray[s.charCodeAt() - base]++;
	}
	// 进行判断
	for(const s of ransomNote){
		const index = s.charCodeAt() - base;
		if(!strArray[index])return false;
		index--;
	}
	return true;
}
```
# 字符串
## 反转字符串
```js
// 可以用来判断回文串
const reverseString = (s) => {
	const n = s.length;
	// 定义左右指针进行遍历循环
	for(let left = 0, right = n - 1;left < right;left++, right--){
		[s[left], s[right]] = [s[right], s[left]];
	}
}
```
## 反转字符串II
```js
const reverseStr = (s, k) => {
	const n = s.length;
	const arr = Array.from(s);
	// 
	for(let i = 0;i < n;i += 2 * k){
		reverse(arr, i, Math.min(i + k, n) - 1)
	}
}
const reverse = (arr, left, right) => {
	// 交换
	while(left < right){
		[arr[left], arr[right]] = [arr[right], arr[left]];
		left++;
		right--;
	}	
}
```
## 替换空格
```js
return s.split(' ').join('%20');
```
# 设计一个lru缓存结构
# 给定一些目录路径，聚合成树形结构
# 代码题
## 类型转换
```js
1. 以下代码返回结果为true的是 C

A. 0 + true === 1  // 0 + 1

B. '0' + false === 0 // 字符串拼接：'0false'

C. 1 + { valueOf() { return 1 } } === 2  

D. 1 + [2, 3] === '1,2,3' // 字符串拼接：'12,3'
```

```js
function sqrt(s, precision = 16) {
  // 特殊情况处理：当输入的数字为 0 或 1 时，直接返回自身
  if (s === 0 || s === 1) {
    return s;
  }

  // 计算精度值，调用Math.pow()来实现
  const precisionValue = Math.pow(10, -precision);

  let low = 0;
  let high = s;

  while (high - low > precisionValue) {
    const mid = (low + high) / 2;
    const square = mid * mid;

    if (square === s) {
      return mid;
    } else if (square < s) {
      low = mid;
    } else {
      high = mid;
    }
  }

  // 返回限定精度位数的结果
  // 调用.toFixed()方法，进行了装箱操作，parseFloat()方法进行转化为number类型
  return parseFloat(low.toFixed(precision));
}
```
# 剑指offer
## 字符串
### 表示数值的字符串
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function(s) {
    let i, len, numFlag = false, dotFlag = false, eFlag = false;
    s = s.trim(); // 去掉首尾空格
    len = s.length; // 去掉后再重新计算长度
    for(i = 0; i < len; i++) {
        // 如果是数字，那么直接将 numFlag 变为 true 即可
        if(s[i] >= '0' && s[i] <= '9') {
            numFlag = true;
        } else if(s[i] === '.' && !dotFlag && !eFlag) {
            // 如果是 .  那必须前面还出现过 .  且前面没出现过 e/E，因为如果前面出现过 e/E 再出现. 说明 e/E 后面跟着小数，不符合题意
            dotFlag = true;
        } else if((s[i] === 'e' || s[i] === 'E') && !eFlag && numFlag) {
            // 如果是 e 或 E，那必须前面没出现过 e/E，且前面出现过数字
            eFlag = true;
            numFlag = false; // 这一步很重要，将是否出现过数字的 Flag 置为 false，防止出现 123E 这种情况，即出现 e/E 后，后面没数字了
        } else if((s[i] === '+' || s[i] === '-') && (i === 0 || (s[i - 1] === 'e' || s[i - 1] === 'E'))) {
            // 如果是 +/- 那必须是在第一位，或是在 e/E 的后面
        } else {
            // 上面情况都不满足，直接返回 false 即可，提前剪枝
            return false;
        }
    }
    return numFlag;
};
```
### 左旋字符串
```javascript
// 方法一:调用.slice()方法
var reverseLeftWords = function(s, n) {
	// s.slice(n)代表n以后的，包括n
    return s.slice(n) + s.slice(0,n);
};
// 方法二：把字符串变成数组，进行shift()和push()方法的调用，再调用join方法变成字符串
var reverseLeftWords = function (s, n) {
    var i = 0;
    var arr = [...s];
    while(i<n){
        arr.push(arr.shift());
        i++;
    }
    return arr.join('')
};
```












