# 总结
- 01背包问题：物品只能装一次
  - 重量数组、价值数组、容量
  - dp的含义：容量为i的背包可以装下最大的价值为dp[i]（i -> i -> len + 1）
  - 初始化：没装的前提下，装下的价值为0
  - 遍历顺序：先遍历物品，一次一次遍历，不重复
  - dp数组为一维，那么需要倒叙遍历，不重复，满足条件是**背包容量大于单个物品的重量**
  - dp公式：dp[j] = Math.max(dp[j], value[i] + dp[j - wight[i]])**(装与不装)**
- 完全背包问题：物品可以无限装
  - 如果求**组合数**就是外层for循环遍历物品，内层for遍历背包
  - 如果求**排列数**就是外层for遍历背包，内层for循环遍历物品
  - 零钱兑换：零钱无限，求方案的组合数
    - 方案数的初始化：dp[0] = 1
    - 本题是求凑出来的方案个数，且每个**方案个数**是为组合数
  - 组合总和：求排列数
    - 先背包再物品
    - 必须等**i > weight[j]**才更新
  - 卡玛网爬楼梯：求排列数
  - 零钱兑换：求最少的硬币个数
    - **本题求钱币最小个数**，那么钱币有顺序和没有顺序都可以，都不影响钱币的最小个数。
    - 完全背包问题，还是要装，先遍历物品更好看一点
    - dp公式：dp[j] = Math.min(dp[j - coin[i]] + 1, dp[j])
  - 完全平方数：组合数
    - 注意外层循环我们可以用i * i <= n来界定
- 打家劫舍
  - 到第i个房获取到的**最多钱为dp[i]**
  - 初始化前两个
  - 抢与不抢的问题
- 最长公共子序列
  - 比较两个序列的元素相等的问题
    - -> 用len + 1的长度定义，初始化为0，比较A[i - 1]与B[j - 1]
  - 派生
    - -> dp含义：**长度为i,j**的两个子串的最长公共子序列的长度为dp[i][j]
    - -> 两种情况：相等时dp[i][j] = dp[i - 1][j - 1] + 1;不相等时dp[i][j] = Math.max(,)
  - 非派生
    - -> dp含义：**以A[i],B[j]为结尾**的子数组最大长度为dp[i][j]
    - -> 一种情况：相等时dp[i][j] = dp[i - 1][j - 1] + 1;及时更新即可
  - 单个数组比大小的问题
    - 非派生
      - dp含义：**以子序列以nums[i]结尾**的数组，最长连续递增序列的长度为dp[i]，dp[i + 1] = dp[i]+ 1
    - 派生
      - dp含义：**以子序列以nums[i]结尾**的数组，最长连续递增序列的长度为dp[i]
      - 因为是派生比较大小，一个循环无法确定（无法跳着比较），必须进行两个循环
      - 循环是恰着区间进行的：i = 1, i < len / j = 0, j < i
      - dp公式：dp[i] = Math.max(dp[i], dp[j] + 1)
    - 求和最大
      - 贪心求解即可，遇到单次统计的结果小于0的，我就进行重置就可以
- 回文子串问题
  - dp递推公式是要求dp[i + 1][j - 1]来界定dp[i][j]的，所以我们的顺序从后往前
  - 遍历顺序
    - i = len - 1, i >= 0, i--
    - j = i, j < len, j++
    - （连续）当s[i] === s[j],有三种情况：相差为0、相差为1，相差大于1
  - 派生问题
    - 确定dp数组的含义：区间i,j中dp[i][j]即为最长回文子序列的长度，默认给0
    - 求数目：
      - s[i] === s[j],相差为0，dp[i][j] = 1;相差大于1，dp[i][j] = dp[i + 1][j - 1] + 2
      - s[i] !== s[j],dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
  - 非派生问题
    - dp数组的含义：在区间**i,j**的子串是否是回文串是由dp[i][j]决定的,初始化dp数组：默认是false
    - s[i] === s[j]
      - 相差为小于1，dp[i][j] = true
      - 相差为大于1，取决于dp[i + 1][j - 1]再dp[i][j] = true
      - 内循环更新子串
- 股票问题
  - 买卖一次
    - 贪心算法：遍历一次，找到最小的low，进行买，对比res
    - 动态规划：
      - hold：确定dp数组的含义：第i天最低价是dp[i - 1]，初始化最大，后续会进行比较
      - unhold：确定dp数组的含义：第i天获取利润最高价是dp[i - 1]，初始化为0，后续比较
      - hold[0]需要去进行初始化，否则更新不了
  - 买卖多次
    - 贪心算法：每一次都进行比价，有利润就存下来

# 前言
- 动态规划中每一个状态一定是由上一个状态推导出来的，这一点就区分于贪心，贪心没有状态推导，而是从局部直接选最优的。



# 动规五部曲

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
            // 倒叙遍历，不会影响前一次物品遍历的基本数据
            // for循环的条件就是背包的剩余容量要大于本次物品的重量
            dp[j] = Math.max(dp[j],value[i] + dp[j - wight[i]]);
        }
    }
    return dp[size];
}

```
# 分割等和子集

```js
// 为什么是01背包问题？给定数组从中拿出元素，容量确定，是否可以装。
// 本质是什么呢？就是当前的物品是否装，会直接影响下一次的装与不装或者说装不装的下

var canPartition = function(nums) {
    const sum = nums.reduce((p,v)=>p+v);// 求和
    const len = nums.length;
    if(sum & 1)return false;// sum & 1 尾运算来判断是否是奇数
    // 确定背包容量：sum+1 -> 012345
    const dp = Array(sum/2 + 1).fill(0);
    for(let i = 0;i < len;i++){
        for(let j = sum/2;j >= nums[i];j--){
            dp[j] = Math.max(dp[j],dp[j - nums[i]] + nums[i])
            if(dp[j] === sum)return true;
        }
    }
    return false;
};
```

# 最后一块石头的重量

```js
var lastStoneWeightII = function (stones) {
    const sum = stones.reduce((p,v)=>p+v);
    const dpLen = Math.floor(sum/2);//js默认会处理成小数，需要用.floor来处理
    const dp = Array(1+dpLen).fill(0);

    for(let i =0;i < stones.length;i++){
        for(let j = dpLen;j >= stones[i];j--){
            dp[j] = Math.max(dp[j],dp[j - stones[i]] + stones[i])
        }
    }
    return sum - dp[dpLen] * 2;
};
```
# 目标和

```javascript
// 确定dp数组的含义：有dp[i]种方法使得目标和成立
// 递推公式：涉及方法的递推直接累加就完事dp[j] += dp[j - nums[i]]
// 初始化:dp[0] = 1,否则后序遍历dp数组的所有元素都是0
// 遍历顺序：经典01背包找最多方法的问题，先遍历物品，0 -> nums.length,再遍历背包 size -> j-nums[i] => 0
const findTargetSumWays = (nums, target) => {
    const sum = nums.reduce((p,v)=>p+v);
    // 判断基本条件
    if(Math.abs(target) > sum)return 0;
    if((target + sum) % 2)return 0;
    const halfSum = (target + sum) / 2;

    let dp = Array(halfSum + 1).fill(0);
    dp[0] = 1;

    for(let i = 0;i < nums.length;i++){
        for(let j = halfSum;j >= nums[i];j--){
            dp[j] += dp[j - nums[i]];
        }
    }
    return dp[halfSum];
};
```

# 一和零(最长子集问题)


```js
// 实质就是01背包装的最大个数（价值）问题
const findMaxForm = (strs, m, n) => {
    const dp = Array.from(Array(m+1), () => Array(n+1).fill(0));
    let numOfZeros, numOfOnes;
    // 物品
    for(let str of strs) {
        numOfZeros = 0;
        numOfOnes = 0;    
        for(let c of str) {
            if (c === '0') {
                numOfZeros++;
            } else {
                numOfOnes++;
            }
        }   
            // 背包
            for(let i = m; i >= numOfZeros; i--) {
                for(let j = n; j >= numOfOnes; j--) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - numOfZeros][j - numOfOnes] + 1);
                }
            }
    }
    return dp[m][n];
};
```

# 完全背包

```js
// 先遍历物品，再遍历背包容量
function test_completePack1() {
    let weight = [1, 3, 5]
    let value = [15, 20, 30]
    let bagWeight = 4 
    let dp = new Array(bagWeight + 1).fill(0)

    for(let i = 0; i <= weight.length; i++) {
        for(let j = weight[i]; j <= bagWeight; j++) {
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
        }
    }

    console.log(dp)
}

// 先遍历背包容量，再遍历物品
function test_completePack2() {
    let weight = [1, 3, 5]
    let value = [15, 20, 30]
    let bagWeight = 4 
    let dp = new Array(bagWeight + 1).fill(0)

    for(let j = 0; j <= bagWeight; j++) {
        for(let i = 0; i < weight.length; i++) {
            if (j >= weight[i]) {
                dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
            }
        }
    }

    console.log(2, dp);
}
```


# 零钱兑换

```javascript
const change = (amount, coins) => {
    let dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for(let i =0; i < coins.length; i++) {
        for(let j = coins[i]; j <= amount; j++) {
            dp[j] += dp[j - coins[i]];
        }
    }
    return dp[amount];
}

```

# 最长回文子串
```js
const longestPalindrome = (s) => {
    const len = s.length;
    let res = '';// 记录结果
    // 确定dp数组的含义：在区间i,j的是否是回文串是由dp[i][j]来决定的
    // dp数组的初始化，默认给false，后续需要进行更新时根据它来判断
    let dp = new Array(len).fill().map(() => Array(len).fill(false));
    // 确定遍历顺序，dp[i][j]需要前面的dp[i + 1][j - 1],我们采取后序遍历
    for(let i = len - 1; i >= 0; i--){
        for(let j = i; j < len; j++){
            if(s[i] === s[j]){
                // 当i,j相等或者相差为1时
                if(j - i <= 1){
                    dp[i][j] = true;
                }else if(dp[i + 1][j - 1]){// 当相差大于1
                    dp[i][j] = true;
                }
            }
            // 判断是否需要进行更新子串
            // 当dp[i][j]为true且子串的下标相差大于res的长度，是时候更新了
            // 考虑到区间i,j问题，那么我们进行内循环内进行更新即可
            if(dp[i][j] && j - i + 1 > res.length){
                res = s.slice(i, j + 1);
            }
        }
    }
    return res;
}

```
# 统计字符串里回文子串的数目
```js
// 和求最长回文子串的思路一模一样
// 我们将不进行更新，我们直接用变量来进行保存
// 是true则加1
```
# 最长回文子序列（派生）
```js
const longestPalindromeSubseq = (s) => {
    const len = s.length;
    // 确定dp数组的含义：区间i,j即为最长回文子序列的长度
    // 初始化为0，后续比较的是长度
    const dp = new Array(len).fill().map(() => Array(len).fill(0));
    // 确定递推的公式，两种情况：s[i] === s[j] 时，那么dp[i][j] = dp[i + 1][j - 1] + 2 
    // 或者是 i === j,我们把dp[i][j] = 1
    // 不满足条件时，dp[i][j] = Math(dp[i + 1][j], dp[i][j - 1])
    for(let i = len - 1; i >= 0; i--){
        for(let j = i; j < len; i++){
            if(s[i] === s[j]){
                if(i === j){
                    dp[i][j] = 1;
                }else{
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                }
            }else{
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[0][len - 1];
}

```
# 最长公共子序列
- 派生子序列的问题
- 不是回文，不需要判断s[i]、 s[j],遍历顺序不需要讲究（len - 1, i）
```js
const longestCommonSubsequence = (text1, text2) => {
    const [len1, len2] = [text1.length, text2.length];
    // 确定dp数组的含义：长度为i,j的两个子串的最长公共子序列长度为dp[i][j]
    // 初始化为0,后续会需要进行比较，为了使得dp的含义明显（两个比较）
    const dp = new Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    for(let i = 1; i <= len1; i++){
        for(let j = 1; j <= len2; j++){
            if(text1[i - 1] === text2[j - 1]){
                dp[i][j] = dp[i - 1][j - 1] + 1;
            }else{
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[len1][len2];
}
```
# 最长重复子数组
- 要求**顺序**
- 是需要比较两个
- 递推公式：当满足两个元素相等时dp[i][j] = dp[i - 1][j - 1] + 1
- 我们的来源只有上面的，然后更新res即可
```js
const lengthOfLIS = (nums) => {

}

```







