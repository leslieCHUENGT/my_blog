# 组合

```js
// 确定参数和返回值：
// 参数：startIndex 就是防止出现重复的组合。无返回值
var combine = function(n, k) {
    let result = []
    let path = []
    const combineHelper = (startIndex) => {
        // 结合题意，确定终止条件。
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        // for循环内，i 初始值设置为startIndex，防止出现重复的组合
        // 剪枝操作：n-i+1是代表还能去的数的个数，k-path.length代表需要的个数
        for (let i = startIndex;n - i + 1 >=  k - path.length; ++i) {
            path.push(i);
            combineHelper(i + 1);
            path.pop();// 不要忘记回溯了。
        }
    }
    combineHelper(1);
    return result;
};
```


**如果把 path + "->"作为函数参数就是可以的，因为并有没有改变path的数值，执行完递归函数之后，path依然是之前的数值（相当于回溯了）**

因为回溯的本质是**穷举**，穷举所有可能，然后选出我们想要的答案，如果想让回溯法高效一些，可以加一些剪枝的操作，但也改不了回溯法就是穷举的本质。

- 回溯函数模板返回值以及参数
- 回溯函数终止条件
- 回溯搜索的遍历过程

# 组合总和II

```javascript
// 确定参数和返回值：参数为startIndex,无返回值
var combinationSum3 = function(k, n) {
    // 根据题意，定义变量。
    let res = [];
    let path = [];// 存储满足条件的单个结果，记得回溯
    let sum = 0;// 存储和，需要记得回溯
    const dfs = (index)=>{
        // 确定终止条件，对sum和path都有要求
        
        if(path.length === k){
            if(sum === n){
                res.push([...path]);
                return;
            }
        }
        // for循环,可以剪枝。能用的最大的数是9 
        // 有sum则可剪枝
        for(let i = index;9 - i + 1 >= k - path.length && (sum + i) <= n;i++){
            sum += i;path.push(i);
            dfs(i+1);
            sum -=i;path.pop();
        }
    }
    dfs(1);
    return res;
};
```

# 电话号码的组合

```js
// 确定参数和返回值：参数startIndex,无返回值
// 通过定义数组来映射所需的字符串
// 判断终止条件：按了几下
// for循环里，遍历第一个字符串的单个字符，遍历第二个...
// 将驻足转化为字符串：可以用.join('')方法
var letterCombinations = function(digits) {
    const k = digits.length;
    if(!k)return [];
    // 映射
    const map = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
    if(k === 1)return map[digits].split('')
    const res = [],path = [];

    function backtracking(startIndex) {
        if(path.length === k){
            res.push(path.join(""));
            return;
        }
        for(const s of map[digits[startIndex]]){           
            path.push(s);
            backtracking(startIndex + 1);
            path.pop();
        }
    }
    backtracking(0);
    return res;
};
```

# 组合总和

```javascript
// 要从给定的数组里面拿出子元素，需要给数排序
// 确定参数和返回值：参数是startIndex
// 终止条件：只对sum有要求
// 同一个数字可以被无限制选取，则递归参数不用加一即可，相当于是同一个的可以被选取多次
var combinationSum = function(candidates, target) {
    const len =  candidates.length; 
    const res = [], path = [];
    let sum = 0;
    candidates.sort((a,b)=>a-b); // 排序
    backtracking(0);
    return res;
    function backtracking(startIndex) {
        if (sum === target) {
            res.push(Array.from(path));
            return;
        }
        for(let i = startIndex; i < len && sum + candidates[i] <= target; i++ ) {
            const n = candidates[i];
            path.push(n); sum += n;
            backtracking(i);
            path.pop();sum -= n;
        }
    }
};
```

# 组合总和II
```js
var combinationSum2 = function(candidates, target) {
    const res = []; path = [], len = candidates.length;
    let sum = 0;
    candidates.sort((a,b)=>a-b);
    backtracking(0);
    return res;
    function backtracking(startIdex) {
        if (sum === target) {
            res.push(Array.from(path));
            return;
        }
        for(let i = startIdex; i < len && sum + candidates[i] <= target; i++) {
            const n = candidates[i];
            if(i > startIdex && candidates[i] === candidates[i-1]){// j>i表示的是 同一层的不同分支
              //若当前元素和前一个元素相等
              //则本次循环结束，防止出现重复组合
              continue;
            }
            //如果当前元素值大于目标值-总和的值
            //由于数组已排序，那么该元素之后的元素必定不满足条件
            //直接终止当前层的递归
            path.push(n);sum += n;
            backtracking(i + 1);
            path.pop();sum -= n;
        }
    }
};
```






