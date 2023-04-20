# 前言
- 动态规划中每一个状态一定是由上一个状态推导出来的，这一点就区分于贪心，贪心没有状态推导，而是从局部直接选最优的。

## 动规五部曲

- 确定dp数组（dp table）以及下标的含义
- 确定递推公式
- dp数组如何初始化
- 确定遍历顺序
- 打印dp数组

# 使用最小花费爬楼梯

```js
// 确定dp数组的含义：爬到i阶梯的最小花费是dp[i]
// 确定递推公式：因为爬到i阶，只有两种可能的方式爬
// 来自i-1或者i-2阶，则dp[i]=Math.min(dp[i-1]+cost[i-1],dp[i-2]+cost[i-2])
// dp数组如何初始化：因为可以选择0或者1阶开始爬楼梯，dp[0]=dp[1]=0
// 该dp数组是一维的，遍历顺序是从前往后的。
// 需要稍微注意的就是dp数组初始化时的长度问题，当是第i的dp[i]怎么样
// 定义时，需要记得是length+1
var minCostClimbingStairs = function(cost) {
    const len = cost.length;
    // 定义dp
    const dp = Array(len + 1);
    // 初始化
    dp[0] = dp[1] = 0;
    for(let i = 2;i <= len;i++){
        dp[i] = Math.min(dp[i-1]+cost[i-1],dp[i-2]+cost[i-2]);
    }
    return dp[len];
};
```
# 不同路径

```js
// 确定dp数组的含义：到达第ixj阶有dp[i][j]种方法
// 确定递推公式：达到ixj只有两种可能，就是来自上方或者左方:dp[i][j] = dp[i-1][j] +dp[i][j-1]
// 定义dp的长度问题：dp[m-1][n-1]个方法符合所求得含义
// 初始化：第0行都是1
var uniquePaths = function(m, n) {
    let dp = new Array(m).fill().map(()=>Array(n).fill());
    //初始化
    for(let i = 0;i < m;i++){
        dp[i][0] = 1;
    }
    for(let j = 0;j < n;j++){
        dp[0][j] = 1;
    }
    //遍历
    for(let i = 1;i < m;i++){
        for(let j = 1;j < n;j++){
            dp[i][j] = dp[i-1][j] +dp[i][j-1]
        }
    }
    return dp[m-1][n-1];
};
```
# 不同路径II

```javascript
var uniquePathsWithObstacles = function(obstacleGrid) {
    const m = obstacleGrid.length
    const n = obstacleGrid[0].length
    const dp = Array(m).fill().map(item => Array(n).fill(0))

    for (let i = 0; i < m && obstacleGrid[i][0] === 0; ++i) {
        dp[i][0] = 1
    }

    for (let i = 0; i < n && obstacleGrid[0][i] === 0; ++i) {
        dp[0][i] = 1
    }

    for (let i = 1; i < m; ++i) {
        for (let j = 1; j < n; ++j) {
            dp[i][j] = obstacleGrid[i][j] === 1 ? 0 : dp[i - 1][j] + dp[i][j - 1]
        }
    }

    return dp[m - 1][n - 1]
};

// 版本二：内存优化，直接以原数组为dp数组
var uniquePathsWithObstacles = function(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (obstacleGrid[i][j] === 0) {
                // 不是障碍物
                if (i === 0) {
                    // 取左边的值
                    obstacleGrid[i][j] = obstacleGrid[i][j - 1] ?? 1;
                } else if (j === 0) {
                    // 取上边的值
                    obstacleGrid[i][j] = obstacleGrid[i - 1]?.[j] ?? 1;
                } else {
                    // 取左边和上边的和
                    obstacleGrid[i][j] = obstacleGrid[i - 1][j] + obstacleGrid[i][j - 1];
                }
            } else {
                // 如果是障碍物，则路径为0
                obstacleGrid[i][j] = 0;
            }
        }
    }
    return obstacleGrid[m - 1][n - 1];
};
```

# 整数拆分

```javascript
// 确定dp数组的含义:i的整数拆分的最大乘积是dp[i]
// 确定定义时dp的长度，dp[len-1]个方法？2->dp[1]???所以初始化的时候需要加一
// 递推公式：dp[i]=Math.max(dp[i],j*(i-j),dp[i-j]*j),拆分更大的数
var integerBreak = function(n) {
    let dp = new Array(n+1).fill(0);
    //初始化
    dp[0] = 0,dp[1] = 0,dp[2] = 1;
    //遍历
    for(let i = 3;i <= n;i++){
        for(let j = 1;j <= i/2;j++){
            dp[i] = Math.max(dp[i],j*(i-j),dp[i-j]*j)
        }
    }
    return dp[n];
};
//加上dp[i]的原因？我们会尝试不同的j值进行拆分，在一个j值拆分的时候，
//根据上面介绍的两种情况取最大，那么如果我们换下一个j的时候，

```
# 不同的二叉搜索树

```js
// 确定dp数组的含义：i个节点构成不同的搜索二叉树dp[i]种
// 思路：第一层循环确定i个节点构成的dp[i]种，第二层循环把根节点拿出来，
// 左右子树的种树相乘即可，为什么是dp[i]+=，因为第二层循环每次都把dp[i]去累加
// 递推公式：dp[i] = dp[i] + dp[j-1]*dp[i-j]
// 初始化：因为是方法所以dp[0]和dp[1]都是1种
const numTrees =(n) => {
    let dp =new Array(n+1).fill(0);
    dp[0]=1,dp[1]=1;
    for(let i=2;i<=n;i++){
        for(let j=1;j<=i;j++){
            dp[i]+=dp[j-1]*dp[i-j];
        }
    }
    return dp[n];
};

```


# 01背包问题

```js
// wight:物品的重量 value：物品的价值 size：背包的容量
// 分析一下递推公式: 因为是通过一维数组来迭代：每次更新在装与不装的情况决定
// 递推公式： dp[j] = Math.max(dp[j],value[i] + dp[j - wight[i]])
function testWeightBagProblem(wight, value, size) { 
    const len = wight.length;
    // 定义dp数组
    const dp = Array(size + 1).fill(0);
    for(let i = 0;i < len;i++){// 01背包问题，先遍历物品。
        for(let j = size;j >= wight[i];j--){
            // 倒叙遍历，不会影响前一次物品遍历的基本数据，
            // for循环的条件就是背包的剩余容量要大于本次物品的重量
            dp[j] = Math.max(dp[j],value[i] + dp[j - wight[i]]);
        }
    }
    return dp[size];
}

```
# 分割等和子集

```js

```







