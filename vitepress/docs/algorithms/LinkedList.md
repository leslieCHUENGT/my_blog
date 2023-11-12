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
	return prev;// 此时 cur指向 null
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
## 合并有序链表
```javascript
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
## 环形链表II
```javascript
function detectCycle(head){
	// 处理特殊情况
	if(!head || !head.next) return null;
	// 先用判断的方法定位到距离的位置
	let slow = head, fast = head, flag = false;
	// 必须保证快指针的走向、首次进行循环也需要进行判断
	while(fast.next && fast.next.next){
		slow = slow.next;
		fast = fast.next.next;
		if(slow === fast) {
			flag = true;
			break;
		}
	}
	// 通过flag来进行判断是否成环
	if(!flag) return null;
	// 此时将慢指针指向头节点，那么以同样的速度遍历会在环出相遇（慢指向头，同步走）
	slow = head;
	while(slow !== fast){
		slow = slow.next;
		fast = fast.next;
	}
	return slow;
}
```

## 回文链表
```ts
function isPalindrome(head: ListNode | null): boolean{
	// 拿到中间的节点信息
	let mid = getMiddleNode(head);
	let left = head;
	let right = reverse(mid);// 进行链表反转
	// 进行比较
	while(right){
		if(right.value !== left.value){
			return false;
		}
		left = left.next;
		right = right.next;
	}
}
// 递归法
function reverse(head: ListNode|null): ListNode|null{
	// 处理特殊情况
	if(head == null || head.next == null) return head;
	// 递归处理剩余节点
	const tail = reverse(head.next);
	head.next.next = head;
	head.next = null;
	return tail;
}
function getMiddleNode(head: ListNode | null): ListNode | null{
	let slow, fast;
	slow = fast = head;// 统一在头结点开始，可以使得slow到中间位置
	// 实际上已经处理了只有两个节点的情况
	while(fast && fast.next){
		fast = fast.next.next;
		slow = slow.next;
	}
	return slow;
}
```

## 排序链表（nlog(n)）
```js
function sortList(head){
	// 处理特殊情况
	if(!head || !head.next){
		return head;
	}
	// 获取中间节点
	let midNode = getMiddleNode(head);
	let rightNode = midNode.next;
	// 断开指向
	midNode.next = null;
	
	return mergeTwoList(sortList(head), sortList(rightNode));
}
function getMiddleNode(head){
	// 排序是不进行统一处理的，奇数取左侧
	let slow = head;
	let fast = head.next.next;
	while(fast != null && fast.next != null){
		slow = slow.next;
		fast = fast.next.next;
	}
	return slow;
}
// 合并两个有序链表，并返回头结点
function mergeTwoList(l1, l2) {
	// 定义虚拟头结点
	let dummry = new ListNode(null);
	let cur = dummry;
	while(l1 && l2){
		if(l1.val < l2.val){
			cur.next = l1;
			l1 = l1.next;
		}else{
			cur.next = l2;
			l2 = l2.next;
		}
		cur = cur.next;
	}
	cur.next = l1 ? l1 : l2;
	return dummry.next;
}
```

## LRU缓存
```js
var LRUCache = function(capacity){
	this.catch = new Map();
	this.capacity = capacity;
}
LRUCache.prototype.put = function(key, value){
	// 如果存在则删除，不存在则继续
	if(this.catch.has(key)){
		this.catch.delete(key);
	}
	// 判断会不会超出
	// map只有size属性，没有length属性
	// map.keys().next().value，键的下一个的value值
	// 当恰好是不存在且容量不足
	if(this.capacity <= this.catch.size){
		this.catch.delete(this.catch.keys().next().value);
	}
	this.catch.set(key, value);
}
LRUCache.prototype.get = function(key){
	if(this.cache.has(key)){
		let value = this.catch.get(key);
		this.catch.detele(key);
		this.catch.set(key, value);
		return value;
	}
	return -1;
}

```