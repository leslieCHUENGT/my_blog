
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
// 左左左
var inorderTraversal = function(root, res = []) {
    // 中序遍历不同于上面的，需要先最左边的子树的节点再进行遍历
    const stack = [];// 定义空栈
    let cur = root;
    while(stack.length || cur){ // 栈会空，但是可以通过cur还可以指向来判断是否停止循环
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
```js
var inorderTraversal = function(root) {
    const res = [];
    const stk = [];
    while (root || stk.length) {
        // 把一边上的所有的左孩子都入栈
        while (root) {
            stk.push(root);
            root = root.left;
        }
        // 中序遍历，左中右
        root = stk.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};
```

### 后

```js
// 后序遍历的迭代法，基本与前序遍历的一样
// 左右孩子入栈的顺序不同，最后记得翻转
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
    //二叉树的层序遍历，用队列来完成的，循环条件是队列的长度即可，空则跳出。
    //层序遍历，则需要每一层的节点，则需要添加for循环来存放节点，每一次存放节点的同时
    //需要把左右孩子也入列，res存储结果即可
    let res = [], queue = [];

    if(root === null) {
        return res;
    }
    queue.push(root);
    // 不是回溯，所以path要在循环里定义
    // 因为结果要求[[],[]],所以在while循环中，嵌套for循环，方便把每一层都存放在数组里面，
    //此时每遍历一个节点就可以把他的左右孩子放入队列中，方便后续的遍历
    while(queue.length) {
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

- 遍历的过程中去翻转每一个节点的左右孩子就可以达到整体翻转的效果。
- 注意只要把每一个节点的左右孩子翻转一下，就可以达到整体翻转的效果
- 注意递归的单层逻辑要对节点进行操作的时候，判断的返回值的必须是null，否则无法处理
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

// 这段代码的if-else出现错误
// if (!left && !right) {
//     return true;
// } else if ((!left && right) || (left && !right)) {
//     return false;
// } else if (left.val === right.val) {
//     return true;
// } else if (left.val !== right.val) {
//     return false;
// }


// 完美逻辑：
// 比较有无单一为null
// 比较两个为null
// 比较值是否相同
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
        return 1 + Math.min(leftDepth,rightDepth)
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
        // 后序遍历，直接向上累加了
        return 1 + leftNum + rightNum;
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
## 左叶子之和

```javascript
var sumOfLeftLeaves = function(root) {
    // 采用后序遍历，需要通过递归函数的返回值来累加左叶子数值和
    // 后序遍历的同时会经过每一个节点，然后判断是否存在左叶子
    // 进行累加即可
    // 1. 确定递归函数参数和返回值：累加需要和为返回值
    const nodesSum = function(node) {
        // 2. 确定终止条件，最后的节点为空，则返回数值0
        if(node === null) {
            return 0;
        }
        // 求得左右子树左叶子的和
        let leftValue = nodesSum(node.left);
        let rightValue = nodesSum(node.right);
        // 3. 单层递归逻辑
        // 求得当前的子树是否有左叶子
        let midValue = 0;
        if(node.left && node.left.left === null && node.left.right === null) {
            midValue = node.left.val;
        }
        // 把每个子树和当前子树的左叶子累加
        let sum = midValue + leftValue + rightValue;
        return sum;
    }
    return nodesSum(root);
};

```
## 找树左下角的值

**递归**
```js
// 二叉树的题目，都是去利用遍历顺序去加入一下技巧去处理的
// 需要找到树左下角的值：在树的最后一行找到最左边的值。
// 可以发现找到最后一行，不需要要求遍历顺序，需要去处理去标记
// 哪一行是最后一行，于是乎，参数需要多一个
// 来比较什么时候是最后一层
var findBottomLeftValue = function(root) {
    //首先考虑递归遍历 前序遍历 找到最大深度的叶子节点即可
    let maxPath = 0, resNode = null;
    // 1. 确定递归函数的函数参数
    const dfsTree = function(node, curPath) {
        // 2. 确定递归函数终止条件
        if(!node) return;
        // 并且左子树优先递归，在同一层上只会统计一次resNode的值
        if(node.left === null && node.right === null) {
            if(curPath > maxPath) {
                maxPath = curPath;
                resNode = node.val;
            }
            return;
        }
        // 左节点优先递归，在同一高度下，只记录一次value
        dfsTree(node.left, curPath + 1);
        dfsTree(node.right, curPath + 1);
    }
    // 高度默认为1
    dfsTree(root,1);
    return resNode;
};
```
**层序遍历**

```javascript
var findBottomLeftValue = function(root) {
    //考虑层序遍历 记录最后一行的第一个节点
    let queue = [];
    if(root === null) { 
        return null;
    }
    queue.push(root);
    let resNode;
    while(queue.length) {
        // 必须缓存
        let length = queue.length;
        for(let i = 0; i < length; i++) {
            let node = queue.shift();
            if(i === 0) {
                resNode = node.val;
            }
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
    }
    return resNode;
};
```

## 路径总和

```js
// 本题求是否满足条件，则返回值是boolean
// 需要判断targetSum,则需要它作为参数。
// 无关遍历顺序，找叶子节点即可。
// 终止条件： 
// 判断返回值
// 都不满足需要返回false
var hasPathSum = function(root, targetSum) {
    if(!root) return false;
    // 确定参数:剩余和保留下来
    // 返回值就是boolean类型
    const pathSum = (node, cur) => {
        // 判断条件
        if(!node) return false;
        // 叶子节点
        if(!node.left && !node.right){
            return cur === node.val;
        }
        cur -= node.val;
        let left = pathSum(node.left, cur);
        let right = pathSum(node.right, cur);
        return left || right;// 只要一个为true即可
    }
    return pathSum(root,targetSum)

};
```

## 路径总和II

```js
var binaryTreePaths = function(root) {
    let res = [];
    // 确定参数和返回值:需要把路径传递下去，那么需要两个参数
    // 叶子节点需要进行记录,空节点则返回空
    const getAllPath = (root,cur) =>{
        if(!root) return;
        // 叶子结点
        if(!root.left && !root.right){
            cur += root.val;
            res.push(cur);
        }
        cur += root.val + "->"
        getAllPath(root.left,cur);
        getAllPath(root.right,cur);
    }
    getAllPath(root,'')
    return res;
};

```

## 从中序与后序遍历序列构造二叉树

```js
// indexof 获取下标 slice()裁剪 : 0,n裁剪0到n，参数如果为n,那么裁剪n以前的。
// 确定参数和返回值
// 构造二叉树，返回值是新的节点
const buildTree = (inorder, postorder) => {
  // 终止条件
  if (!inorder.length) return null;

  const rootValue = postorder.pop();
  const rootIndex = inorder.indexOf(rootValue);
  const root = new TreeNode(rootValue);

  root.right = buildTree(inorder.slice(rootIndex + 1), postorder.slice(rootIndex)); // 创建右节点
  root.left = buildTree(inorder.slice(0, rootIndex), postorder.slice(0, rootIndex)); // 创建左节点

  return root;
};
```
## 从前序与中序遍历序列构造二叉树
```js
var buildTree = function(preorder, inorder) {
  if (!preorder.length) return null;
  const rootVal = preorder.shift(); // 从前序遍历的数组中获取中间节点的值， 即数组第一个值
  const index = inorder.indexOf(rootVal); // 获取中间节点在中序遍历中的下标
  const root = new TreeNode(rootVal); // 创建中间节点
  root.left = buildTree(preorder.slice(0, index), inorder.slice(0, index)); // 创建左节点
  root.right = buildTree(preorder.slice(index), inorder.slice(index + 1)); // 创建右节点
  return root;
};
```

**前序和后序不能唯一确定一棵二叉树！，因为没有中序遍历无法确定左右部分，也就是无法分割。**
## 最大二叉树

```js
// 确定参数：对分下来的数组进行切割，派分
// 确定返回值，创建新的节点，那么就是返回 root
function constructMaximumBinaryTree(nums) {
  if (nums.length === 0) {
    return null;
  }
  // 找到最大值及其索引
  let maxVal = nums[0];
  let maxIndex = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > maxVal) {
      maxVal = nums[i];
      maxIndex = i;
    }
  }
  // 创建根节点
  const root = new TreeNode(maxVal);
  // 构建左子树
  root.left = constructMaximumBinaryTree(nums.slice(0, maxIndex));
  // 构建右子树
  root.right = constructMaximumBinaryTree(nums.slice(maxIndex + 1));
  return root;
}

```
## 合并二叉树

```js
// 自身解答存在的问题
// 1.最后返回的是根节点，所以要在遍历后返回节点
// 2.
var mergeTrees = function(root1, root2) {
        // 确定终止条件 
        // 如果root1为null，返回root2
        // 如果root2为null，返回root1
        // 都不符合则返回和
        if (!root1)
            return root2
        if (!root2)
            return root1;
        // 进行和操作
        root1.val += root2.val;
        // 构造新的子树
        root1.left = preOrder(root1.left, root2.left);
        root1.right = preOrder(root1.right, root2.right);
};
```

```js
var mergeTrees = function(root1, root2) {
    // 确定终止条件 
    if (!root1)
        return root2
    if (!root2)
        return root1;
    // 进行和操作
    root1.val += root2.val;
    // 构造新的子树
    root1.left = mergeTrees(root1.left, root2.left);
    root1.right = mergeTrees(root1.right, root2.right);
    // 返回新的root节点
    return root1;
};
```
##  二叉搜索树中的搜索

```javascript
// 二叉树中的搜索，返回值要求是返回符合条件的节点
// 因为是搜索二叉树，是有序的，左小右大
// 所以if语句判断，进入分支，一旦找到了就不会进入其他分支
// 确定参数、返回值
var searchBST = function (root, val) {
    // 终止条件，当找到是叶子节点或者找到了，那就返回节点即可
    if (!root || root.val === val) {
        return root;//此处返回了root，后续的左右递归后可以不考虑再返回root
    }
    // 对于搜索二叉树的查找，必定可以进行剪枝
    if (root.val > val)// 实际上进入该分支完成了两件事，查找，返回，此处的返回相当于后序遍历返回节点
        return searchBST(root.left, val);
    if (root.val < val)
        return searchBST(root.right, val);
};
```

## 验证搜索二叉树

```js
// 验证搜索二叉树确定参数与返回值
// 参数：root，上下限，返回值：boolean类型
// 遇到叶子节点，返回true即可
// 遇到不在区间的返回false
// 进行递归，左子树递归存在的是上限，右子树存在的是下限
// 我们要比较的是 左子树所有节点小于中间节点，右子树所有节点大于中间节点。
var isValidBST = function(root) {
    let pre = null;
    const inOrder = (node) => {
        // 终止条件,能到叶子节点那么就是 ture
        if(node === null) return true;
        let left = inOrder(node.left);
        // 中序比较
        if(pre !== null && pre.val >= node.val) {
            return false;
        }
        pre = node;
        let right = inOrder(node.right);
        return right && left;
    }
    return inOrder(root);
};
```
## 二叉搜索树的最小绝对差

```js
// 由题意可知，只要根据前后指针来判断差值的大小即可
// 确定参数和返回值：只需要定义一个res来存储最大值即可，不需要返回值
// 中序遍历下，是一个有序数组。
var getMinimumDifference = function(root) {
    let res = Infinity;
    let preNode = null;// 前指针的初始值设置为null
    const inorder = (node)=>{
        //终止条件
        if(!node)return;
        inorder(node.left);
        // 确保第一次进入该分支时，不会报错
        if(preNode){
            res = Math.min(res, node.val - preNode.val)
        }
        preNode = node;
        inorder(node.right)
    }
    inorder(root);
    return res;
};
```

## 二叉搜索树中的众数

```js
var findMode = function(root) {
    let base = -Infinity, count = 0, maxCount = 0;
    let answer = [];
    // 主要是学会判断众数的逻辑判断
    // 变量定义和参数：参数是传进来的节点的val值，进入分支
    // base 设置为前一个的val值，所有第一个分支直接判断等于与否即可
    // 否则就count为1，base设置为x的值
    // 判断count与maxCount的大小即可
    const update = (x) => {
        if (x === base) {
            ++count;
        } else {
            count = 1;
            base = x;
        }
        if (count === maxCount) {
            answer.push(base);
        }
        if (count > maxCount) {
            maxCount = count;
            answer = [base];
        }
    }

    const dfs = (o) => {
        if (!o) {
            return;
        }
        dfs(o.left);
        update(o.val);
        dfs(o.right);
    }

    dfs(root);
    return answer;
};
```

## 二叉搜索树的最近公共祖先

```js
// 找到最近的公共祖先，换而言之就是找到第一个root满足在p q区间之间即可
// 由于是二叉搜索树，我们可以考虑只有出现在[p, q]里的root.val那么就是满足条件了
var lowestCommonAncestor = function(root, p, q) {
    // 使用递归的方法
    // 1. 使用给定的递归函数lowestCommonAncestor
    // 2. 确定递归终止条件
    // 二叉搜索树的中序遍历是有序的，但是此题并没有考虑使用，直接判断给定的区间来寻找
    // 终止条件：遇到null则return
    if(root === null) {
        return null;
    }
    // 对于不在区间的进行定向查询
    if(root.val > p.val && root.val > q.val) {
        return lowestCommonAncestor(root.left,p,q);
    }
    if(root.val < p.val && root.val < q.val) {
        return lowestCommonAncestor(root.right,p,q);
    }
    // 当在p,q区间里，那么就可以直接返回了，所以上面的都是return
    return root;
};
```

## 二叉搜索树的插入操作

```js
// 插入操作，实际上只要找到符合条件可以插入的位置就可以
// 如何寻找呢？由题意可知道，我们只要在该二叉搜索树中不断缩小区间
// 直到return root为null
// 那么可以在该节点创建新的node节点
// 确定参数和返回值：返回值是返回新的节点
var insertIntoBST = function(root, val) {
      const setInOrder = (root, val) => {
        // 缩小区间找到空节点
        // 返回插入的新的root
        if (root === null) {
            let node = new TreeNode(val);
            return node;
        }
        // 剪枝，快速查找
        if (root.val > val)
            root.left = setInOrder(root.left, val);
        else if (root.val < val)
            root.right = setInOrder(root.right, val);
        // 相当于后序遍历的返回根节点
        return root;
    }
    return setInOrder(root, val);
};
```

## 删除二叉搜索树中的节点

### 方法一——情况四直接手动操作

```js
// 删除二叉搜索树的一个节点，有以下几种情况：1.找不到2.是叶子节点3.左孩子在右孩子不在4.左孩子不在右孩子在5.左右孩子都不在
// 参数与返回值：返回值，新的节点
var deleteNode = function(root, key) {
    // 找不到，遇到空节点，返回null节点。
    if (root === null) return null;
    // 找到了
    if (root.val === key) {
        // 叶子节点
        if (root.left === null && root.right === null) return null;
        // 左为空
        if (root.left === null) return root.right;
        // 右为空
        if (root.right === null) return root.left;
        // 左右都有
        let curNode = root.right;
        while (curNode.left !== null) {
            curNode = curNode.left;
        }
        curNode.left = root.left;
        return root.right;
    }
    // 增加判断语句进行《剪枝》快速进入相应的子树进行裁剪
    if (root.val > key) root.left = deleteNode(root.left, key);
    if (root.val < key) root.right = deleteNode(root.right, key);
    // 最后递归返回根节点
    return root;
};
```

### 方法二——递归处理情况四

```javascript
var deleteNode = function(root, key) {
    if (!root) return null;
    if (key > root.val) {
        root.right = deleteNode(root.right, key);
        return root;
    } else if (key < root.val) {
        root.left = deleteNode(root.left, key);
        return root;
    } else {
        // 场景1: 该节点是叶节点
        if (!root.left && !root.right) {
            return null
        }
        // 场景2: 有一个孩子节点不存在
        if (root.left && !root.right) {
            return root.left;
        } else if (root.right && !root.left) {
            return root.right;
        }
        // 场景3: 左右节点都存在
        const rightNode = root.right;
        // 获取最小值节点
        const minNode = getMinNode(rightNode);
        // 将待删除节点的值替换为最小值节点值
        root.val = minNode.val;
        // 删除最小值节点
        root.right = deleteNode(root.right, minNode.val);
        return root;
    }
};
function getMinNode(root) {
    while (root.left) {
        root = root.left;
    }
    return root;
}
```
## 修建二叉树
```javascript
// 思考：root.val不在区间里，那么放弃左子树或者右子树
// 然后再返回裁剪的右子树或者左子树
var trimBST = function(root, low, high) {
    if (!root) {
        return null;
    }
    // 前序遍历进行裁剪
    if (root.val < low) {
        // 左子树都不符合，返回裁剪的右子树，为什么不是直接返回右节点
        // 实际上是因为我们要对右节点的树也要进行排查
        return trimBST(root.right, low, high);
    } else if (root.val > high) {
        // 右子树都不符合，返回裁剪的左子树
        return trimBST(root.left, low, high);
    } 
    // 重新指向返回裁剪后的子树
    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);
    // 递归返回根节点
    return root;
};
```

## 将有序数组转换为二叉搜索树

**Math.floor**保证是向下保留为整数
```js
// 有序数组转换为搜索二叉树，则中间节点就是根节点
// 所以参数：arr，左边界，右边界；返回值就是新的节点
// 本质就是寻找分割点，分割点作为当前节点，然后递归左区间和右区间。
var sortedArrayToBST = function (nums) {
    // 确定参数和返回值
    // 参数：传进来的数组，左右边界
    const buildTree = (Arr, left, right) => {
        // 终止条件
        // 当左边界大于右边界的时候，返回null即可
        if (left > right)
            return null;
        // 计算切割点mid的位置大小
        let mid = Math.floor(left + (right - left) / 2);
        // 建立新的节点
        let root = new TreeNode(Arr[mid]);
        // 遍历左右区间
        root.left = buildTree(Arr, left, mid - 1);
        root.right = buildTree(Arr, mid + 1, right);
        // 返回root节点
        return root;
    }
    return buildTree(nums, 0, nums.length - 1);
};
```

## 把二叉搜索树转换为累加树
```js
// 确定参数和返回值，终止条件（return什么是由返回值决定的）
// 单层逻辑：中序遍历，需要在函数外保存一个变量
// 从树中可以看出累加的顺序是右中左，所以我们需要反中序遍历这个二叉树，然后顺序累加就可以了。
var convertBST = function(root) {
    // 设置pre的初始值
    let pre = 0;
    const ReverseInOrder = (cur) => {
        // 终止条件
        if(!cur) return;
        // 右中左
        ReverseInOrder(cur.right);
        cur.val += pre;
        pre = cur.val;
        ReverseInOrder(cur.left);
    }
    ReverseInOrder(root);
    return root;
};
```

