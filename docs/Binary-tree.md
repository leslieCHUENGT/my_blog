# 二叉树的遍历顺序

## 迭代法

### 前

```js
var preorderTraversal = function(root) {
    // 迭代法完成二叉树的前序遍历
    // 使用栈来完成，因为栈是先进后出，所以入栈的顺序是中右左
    // 树节点可能为0，需要判断一下,返回一个空数组即可。
    // 递归的实现就是：每一次递归调用都会把函数的局部变量、参数值和返回地址等压入调用栈中，
    // 然后递归返回的时候，从栈顶弹出上一次递归的各项参数，
    // 所以这就是递归为什么可以返回上一层位置的原因。
    let res = [];
    if(!root)return res;
    // 把根节点root直接push入栈，方便不影响后续在循环里的逻辑
    const stack = [root];
    let cur = null;// cur来处理当前节点的值
    // 进入while循环
    while(stack.length){// 循环条件是当stack为空则结束
        cur = stack.pop();// 如果是root出栈，则stack为null了
        res.push(cur.val);
        cur.right && stack.push(cur.right);// 需要右节点是否为空
        cur.left && stack.push(cur.left);
    }
    return res;
};
// 不可以使用队列来完成二叉树的遍历，无法模拟递归的过程,栈可以保证一个子树全部遍历完再遍历另一个子树
// var preorderTraversal = (root) =>{
//     let res = [];
//     if(!root)return res;
//     const queue = [root];
//     let cur = null;// 避免在循环里重复定义
//     while(queue.length){
//         cur = queue.shift();
//         res.push(cur.val);
//         cur.left && queue.push(cur.left);
//         cur.right && queue.push(cur.right);
//     }
//     return res;
// }

```
### 中

```js
var inorderTraversal = function(root, res = []) {
    // 中序遍历不同于上面的，需要先最左边的子树的节点再进行遍历
    const stack = [];// 定义空栈
    let cur = root;
    while(stack.length || cur){
        if(cur){
            stack.push(cur);
            cur = cur.left;
        }else {
            cur = stack.pop();
            res.push(cur.val);
            cur = cur.right;
        }
    }
    return res;
}
```
### 后

```js
var postorderTraversal = function(root, res = []) {
    if (!root) return res;
    const stack = [root];
    let cur = null;
    while(stack.length){
        cur = stack.pop();
        res.push(cur.val);
        cur.left && stack.push(cur.left);
        cur.right && stack.push(cur.right);
    } 
    return res.reverse();
};
```
## 层序遍历

```javascript
var levelOrder = function(root) {
    //二叉树的层序遍历
    let res = [], queue = [];
    queue.push(root);
    if(root === null) {
        return res;
    }
    // 因为结果要求[[],[]],所以在while循环中，嵌套for循环，方便把每一层都存放在数组里面，
    //此时每遍历一个节点就可以把他的左右孩子放入队列中，方便后续的遍历
    while(queue.length ) {
        // 记录当前层级节点数
        let length = queue.length;
        //存放每一层的节点 
        let curLevel = [];
        for(let i = 0;i < length; i++) {
            let node = queue.shift();
            curLevel.push(node.val);
            // 存放当前层下一层的节点
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
        //把每一层的结果放到结果数组
        res.push(curLevel);
    }
    return res;
};
```
## 翻转二叉树

遍历的过程中去翻转每一个节点的左右孩子就可以达到整体翻转的效果。
注意只要把每一个节点的左右孩子翻转一下，就可以达到整体翻转的效果
这道题目使用前序遍历和后序遍历都可以，唯独中序遍历不方便，因为中序遍历会把某些节点的左右孩子翻转了两次！
那么层序遍历可以不可以呢？依然可以的！只要把每一个节点的左右孩子翻转一下的遍历方式都是可以的
```js
var invertTree = function (root) {
    if(!root)return root;
    let leftNode = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(leftNode);
    return root;
}
```
## 对称二叉树

```javascript
// XXXXXXXXXXXXXXXX

// var isSymmetric = function(root) {
//     // 检查root
//     if(root.length === 1)return ture;
//     // 检查其是否轴对称，则返回值就是boolean类型的
//     const dfs = (root) =>{
//         // 终止条件
//         if(!root)return true;
//         if(root.left === null && root.right !== null 
//             || root.left !== null && root.right === null) 
//             return false;
//         if(root.right.val !== root.left.val) return false
//         dfs(root.left);
//         dfs(root.right);
//     }
// };

var isSymmetric = function(root) {
    // 因为是判断左右是否对称，所以参数需要两个
    if(root.length === 1)return ture;
    const compareNode = (left,right) => {
        // 2. 确定终止条件 空的情况
        if(left === null && right !== null || left !== null && right === null) {
            return false;
        } else if(left === null && right === null) {
            return true;
        } else if(left.val !== right.val) {
            return false;
        }

        return compareNode(left.left,right.right) && compareNode(left.right,right.left);
    }
    return compareNode(root.left,root.right);
};
```

## 求二叉树的最大深度

```js
var maxDepth = function(root) {
    // 使用递归的方法 递归三部曲
    // 1. 确定递归函数的参数和返回值
    // 返回值：最大深度,参数：root
    const getdepth = function(node) {
        // 2. 确定终止条件
        // 空节点就返回 0
        if(node === null) {
            return 0;
        }
        // 3. 确定单层逻辑
        // 求最大深度思考使用什么遍历顺序最方便呢？
        // 后序遍历是通过到叶子节点开始的
        // 因此可以用后序遍历来记录、累加左右子树的高度
        let leftdepth = getdepth(node.left);
        let rightdepth = getdepth(node.right);
        // 每一次进行遍历，无论是左子树还是右子树，他的高度都要加一
        let depth = 1 + Math.max(leftdepth, rightdepth);
        return depth;
    }
    return getdepth(root);
}
```

## 最小深度

```javascript
// 确定参数和返回值：root，最小深度
// 求最小深度，就是找到叶子节点到root的距离
var minDepth = function(root) {
    const getMinDepth = (node)=>{
        if(!node) return 0;
        let leftDepth = getMinDepth(node.left);
        let rightDepth = getMinDepth(node.right);
        // 对比求最大深度的不同，因为min会使只有一个节点的子树的最小高度为0，那么此时需要我们手动
        // 使得有一个子树的最小深度是1
        if(node.left === null && node.right !==null) return 1+rightDepth;
        if(node.left !== null && node.right === null) return 1+leftDepth;
        return 1+Math.min(leftDepth,rightDepth)
    };
    return getMinDepth(root);
};
```

## 完全二叉树的节点数

```javascript
var countNodes = function(root) {
    const getNodeSum = (node)=>{
        //终止
        if(node === null)return 0;
        //单层
        let leftNum = getNodeSum(node.left);
        let rightNum = getNodeSum(node.right);
        return 1+leftNum+rightNum;
    };
    return getNodeSum(root);
};
```
## 平衡二叉树

```javascript
var isBalanced = function(root) {
    // 判断是否是平衡二叉树，确定返回值：1.需要返回左右子树的最大高度2.当出现不符合条件的返回-1
    // 思考求最大深度那个题目，递归求得左右子树的高度，返回1 + 其中的最大深度
    // 基本思路围绕展开
    // 如果高度差会大于1的话，返回-1，则在求左右子树的高度的时候，判断是否-1，则可以直接判断是否符合条件了。
    const getDepth = (node) => {
        // 空节点则return 0
        if(!node) return 0;

        let leftDepth = getDepth(node.left);
        // 已经不符合条件，返回-1
        if(leftDepth === -1) return -1;
        let rightDepth = getDepth(node.right);
        if(rightDepth === -1) return -1;
        
        if(Math.abs(leftDepth - rightDepth) > 1){
            return -1;
        }else{
            return 1 + Math.max(leftDepth,rightDepth);
        }
    }
    return !(getDepth(root) === -1)
};
```
## 二叉树的所有路径

```javascript
// 求二叉树的路径，不需要返回值。
var binaryTreePaths = function(root) {
   //递归遍历+递归三部曲
   let res = [];
   //1. 确定递归函数 函数参数
   const getPath = function(node,curPath) {
        //2. 确定终止条件，到叶子节点把结果存储；遇到空节点则直接返回。
        if(!root) return;
        if(node.left === null && node.right === null) {
           curPath += node.val;
           res.push(curPath);
           return;
        }
        //3. 确定单层递归逻辑
        curPath += node.val + '->';
        getPath(node.left, curPath);
        getPath(node.right, curPath);
   }
   getPath(root, '');
   return res;
};
```


