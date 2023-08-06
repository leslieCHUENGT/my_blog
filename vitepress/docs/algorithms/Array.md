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
const topKFrequent = function(nums, k) {
  const freqMap = new Map(); // 统计元素频率
  for (let num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  const bucket = [];
  for (let [num, freq] of freqMap) { // 将元素插入桶中
    if (!bucket[freq]) {
      bucket[freq] = [];
    }
    bucket[freq].push(num);
  }
  const result = [];
  for (let i = bucket.length - 1; i >= 0 && result.length < k; i--) { // 取前 k 高的元素
    if (bucket[i]) {
      result.push(...bucket[i]);
    }
  }
  return result;
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
// 起点配合双指针扫描
const threeSum = (nums) => {
	const res = [];
	if(nums.length < 3) return res;
	// 排序，方便后续跳过重复元素
	nums.sort((a, b) => a - b);
	for(let i = 0;i < nums.length - 2;i++){
		if(nums[i] > 0) return res;
		// 跳过重复元素，使用之前的元素进行比较
		if(nums[i] === nums[i - 1] && i > 0){
			continue;
		}
		// 定义左右指针
		let left = i + 1;
		let right = nums.length - 1;
		// 双指针扫描
		while(left < right){
			let sum = nums[i] + nums[left] + nums[right];
			if(sum === 0){
				res.push([nums[i], nums[left], nums[right]]);
				// 跳过重复元素
				while(left < right && nums[left] === nums[left + 1]){
					left++;
				}
				while(left < right && nums[right] === nums[right + 1]){
					right++;
				}
				// 移动指针
				left++;
				right++;
			}else if(sum < 0){
				left++;
			}else{
				right--;
			}
		}
	}
	return res;
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