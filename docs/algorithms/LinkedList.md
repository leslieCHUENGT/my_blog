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
