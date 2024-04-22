// const array1 = [5, 12, 8, 130, 44];
// Array.prototype.myFind = function(fn, array = this){
//     // console.log(array)
//     for (let i = 0; i < array.length; i++) {

//         if (fn(array[i], i, array)) {
            
//             return array[i];
//         }

//     }
//     return undefined;
// }
// const found = array1.myFind((element) => element > 10);

// // console.log(found);
// // Expected output: 12

// const sulotion = (n) => {
//     if(n <= 3) return n;
//     let pre = 2;
//     let cur = 0;
//     for(let i = 4; i <= n; i++) {
//         cur = pre + helpers(i - 1);
//         pre = cur;
//     }
//     return cur;

// }
// const helpers = (n) => {
//     let res = 1;
//     for(let i = 2; i <= n; i++) {
//         res *= i
//     }
//     return res;
// }
// console.log(sulotion(4));// 2 * 3 + 2 * 1
// console.log(sulotion(5));// 2 * 3 * 4 + 2 * 3 + 2 * 1
// console.log(sulotion(6));// 32 + 24 * 5
// 定义链表节点
class ListNode {
    constructor(val) {
      this.val = val;
      this.next = null;
    }
  }
  
  // 创建链表的函数，接受一个数组作为参数
  function createLinkedList(arr) {
    if (arr.length === 0) {
      return null;
    }
  
    let head = new ListNode(arr[0]); // 创建头节点
    let cur = head; // cur指向当前节点
  
    // 将数组中的元素逐个添加到链表中
    for (let i = 1; i < arr.length; i++) {
      cur.next = new ListNode(arr[i]); // 创建新节点，并将当前节点的next指针指向它
      cur = cur.next; // 移动到新节点
    }
  
    return head; // 返回链表头节点
  }
  
  // 打印链表的函数
  function printLinkedList(head) {
    let cur = head;
    let result = "";
    while (cur !== null) {
      result += cur.val + " -> ";
      cur = cur.next;
    }
    result += "null";
    console.log(result);
  }
  
  // 使用示例
var arrar = [1, 2];
var NodeList = createLinkedList(arrar);
  printLinkedList(head);
  

var reorderList = function(head) {
    // 构造双向链表
    let p = head;
    if (p === null) return p;
    p.prev = null;
    while (p.next) {
        p.next.prev = p;
        p = p.next;
    }
    // 定义head pointer和pigu(屁股) pointer
    let hp = head;
    let pp = p;
    while (true) {
        if (pp === hp) { // 偶数结点情况终结判断
            hp.next = null;
            console.log(111);
            break;
        }
        const nexthp = hp.next;
        hp.next = pp;
        hp = nexthp; // 正链表前进
        if (pp === hp) { // 奇数结点情况终结判断
            pp.next = null;
            console.log(222);
            break;
        }
        pp.next = hp;
        pp = pp.prev; // 反链表前进
    }
};


reorderList(Nodelist)
// console.log(Nodelist);