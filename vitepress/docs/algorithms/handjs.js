class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

function arrayToLinkedList(arr) {
  if (!Array.isArray(arr)) {
    console.log("Input is not an array.");
    return null;
  }

  if (arr.length === 0) {
    console.log("Array is empty.");
    return null;
  }

  let head = new Node(arr[0]);
  let currentNode = head;

  for (let i = 1; i < arr.length; i++) {
    const newNode = new Node(arr[i]);
    currentNode.next = newNode;
    currentNode = newNode;
  }

  return head;
}
var addTwoNumbers = function (l1, l2) { 
    // 创建虚拟头结点
    const dummy = new Node(0);
    let cur = dummy;

    let carry = 0;
    while (l1 || l2) {
        const value1 = l1 ? l1.value : 0;
        const value2 = l2 ? l2.value : 0;
        // 相加
        let sum = value1 + value2 + carry;
        carry = Math.floor(sum / 10);
        sum %= 10;
        cur.next = new Node(sum);
        cur = cur.next;
        if (l1) l1 = l1.next;
        if (l2) l2 = l2.next;
    }
    if (carry) {
        cur.next = new Node(carry);
    }
    return dummy.next;
}




