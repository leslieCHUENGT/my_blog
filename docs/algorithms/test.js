// // 新建树节点类
// function TreeNode(val, left, right) {
//     this.val = (val === undefined) ? 0 : val;
//     this.left = (left === undefined) ? null : left;
//     this.right = (right === undefined) ? null : right;
// }
// function buildTree(val_list) {
//     // 数组为空
//     if (!val_list || val_list.length === 0) {
//         return;
//     }
//     // 根节点
//     var root = new TreeNode(val_list.shift());

//     var nodeQueue = [root];
//     // 对root节点进行操作，更新node
//     while (val_list.length > 0) {
//         var node = nodeQueue.shift();
//         // n = node.level + 1;	// 获取父节点的层级，子节点在该层级上+1
//         // 构建：左孩子节点
//         if (val_list.length === 0) {
//             break;
//         }
//         var leftVal = val_list.shift();
//         if (leftVal != null) {
//             node.left = new TreeNode(leftVal);
//             nodeQueue.push(node.left);
//         }
//         // 构建：右孩子节点
//         if (val_list.length === 0) {
//             break;
//         }
//         var rightVal = val_list.shift();
//         if (rightVal != null) {
//             node.right = new TreeNode(rightVal);
//             nodeQueue.push(node.right);
//         }
//     }
//     return root;
// }


// let arr = [1,2,3,4,5,6,7,8,9]
// let root = buildTree(arr)

// // console.log(root)
// let val = 5


// var inorderTraversal = function(root, res = []) {
//     // 中序遍历不同于上面的，需要先最左边的子树的节点再进行遍历
//     const stack = [];// 定义空栈
//     let cur = root;
//     while (stack.length || cur) {
//         console.log(stack.length,cur,res)
//         if(cur){
//             stack.push(cur);
//             cur = cur.left;
//         }else {
//             cur = stack.pop();
//             console.log(cur.val)
//             res.push(cur.val);
//             cur = cur.right;
//         }
//     }
//     return res;
// }

// inorderTraversal(root)


class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

const arrayToLinkedList = (arr) => {
  if (!arr.length) return null;

  let head = new ListNode(arr[0]);
  let curr = head;

  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }

  return head;
};

const arr = [1, 2, 3, 4];
const head = arrayToLinkedList(arr);

var swapPairs = function(head) {
  let ret = new ListNode(0, head), temp = ret;
  while (temp.next && temp.next.next) {
    let cur = temp.next.next, pre = temp.next;
    pre.next = cur.next;
    cur.next = pre;
    console.log(temp.next?.val) 
    temp.next = cur;
    console.log(temp.next?.val) 
    temp = pre;
    // console.log(temp.next?.val,'///')   
    console.log(temp.next === cur)
      
    // console.log(pre.val,cur.val,'????')
    // console.log(temp.next === cur)
    // console.log(temp.val,temp?.next?.val);
  }
  return ret.next;
};

swapPairs(head)












