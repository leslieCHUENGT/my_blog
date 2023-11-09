# 链表
## 反转链表
```javascript
// 迭代法
const resverseList = (head) => {
    // 两个节点都没，那么没必要反转
    if(!head || !head.next) return head;
    // 拿出尾结点的最后指向（null）
    let pre = null;
    let cur = head;
    while(cur !== null){
        const next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}
// 递归法
const resverse = (head) => {
    if(!head || !head.next) return head;
    // 递归处理剩余的节点
    const tail = resverse(head.next);
    head.next.next = head;
    head.next = null;// 反转之后head指向就是null
    return tail;
}
```
## 两数相加
- 思路总结
  - 虚拟头结点：返回时可以使用到、每次进行赋值的时候都是.next时赋值
  - 由于我们通过while(p1 || p2)进行操作，可以化简后续的判断l1/l2存在的问题，但是缺陷是每次取值和获取.next时，必须先判断是否存在该内容
```js
const addTwoNumber = (l1, l2) => {
    // 创造虚拟头结点
    const dummy = new ListNode(0);
    let cur = dummy;// 最后返回dummy.next即可
    // 不改变原来链表的状态，赋值一下
    let p1 = l1, p2 = l2;
    // 利用进位来进行保存计算下一位的值
    let carry = 0;
    while(p1 || p2) {
        // 想拿到val值必须先判断存在不存在
        const val1 = p1 ? p1.val : 0;
        const val2 = p2 ? p2.val : 0;
        // 求和,千万不可以丢了carry
        let sum = val1 + val2 + carry;
        // 求进位的值
        carry = Math.floor(sum / 10);
        // 获取当前节点的值
        sum %= 10;
        cur.next = new ListNode(sum);
        cur = cur.next;
        // 指针后移（需要判断是否存在）
        p1 && p1 = p1.next;
        p2 && p2 = p2.next;
    }
    if(carry > 0) cur.next = new ListNode(carry);
    return dummy.next;
}
```
## 合并有序链表
```javascript
const merge = (l1, l2) => {
    let dummy = new ListNode(0);
    let cur = dummy;
    while(l1 && l2){
        if(l1.val < l2.val){
            cur.next = l1;
            l1 = l1.next;
        }else {
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    cur.next = l1 ? l2 : l1;
    return dummy.next;
}
```
## 环形链表
```javascript
function detectCycle(head) {
    // 成环至少也得两个
    if(!head || !head.next) return null;
    // 先判断有没有环，确定相遇点，同速率找环点
    let slow = head, fast = head, flag = false;
    while(fast.next && fast.next.next){
        slow = slow.next;
        fast = fast.next;
        if(slow === fast){
            flag = true;
            break;
        }
    }
    if(!flag) return null;
    slow = head;
    while(slow !== fast){
        slow = slow.next;
        fast = fast.next;
    }
    return slow;
}
```
## 回文链表
```js
function isPalindrome(head){
    // 拿到中间节点
    let mid = getMiddleNode(head);
    let left = head;
    let right = reverse(mid);
    while(right){
        if(right.val !== left.val){
            return false;
        }
        left = left.next;
        right = right.next;
    }
}
function getMiddleNode(head){
    // 回文链表可统一，则获取在中间
    let slow, fast;
    slow = fast = head;
    while(fast && fast.next){
        fast = fast.next.next;
        slow = slow.next;
    }
    return slow;
}
function reverse(head){
    if(!head || !head.next) return head;
    const tail = reverse(head.next);
    head.next.next = head;
    head.next = null;
    return tail;
}
```
## 链表排序
```javascript
function sortList(head){
    if(!head || !head.next) return head;
    let midNode = getMiddleNode(head);
    let rightNode = midNode.next;
    midNode.next = null;
    return mergeTwoList(sortList(head), sortList(rightNode));
}

```
## LRU缓存
```js
class LRUCache(){
    constructor(size){
        this.catch = new Map();
        this.capacity = size;
    }
    put(key, val){
        // 放之前看看存在不，存在就删了
        if(this.catch.has(key)){
            this.catch.delete(key);
        }
        // 校验空间够不够
        if(this.capacity <= this.catch.size){
            this.catch.delete(this.catch.keys().next().value)
        }
        this.catch.set(key, value);
    }
    get(key){
        if(this.cache.has(key)){
            let value = this.catch.get(key);
            this.catch.detele(key);
            this.catch.set(key, value);
            return value;
        }
        return -1;
    }
}
```
# 组合
```js

```







