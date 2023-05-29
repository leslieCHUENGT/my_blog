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
            return
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
# 分割回文子串

```js
// 判断是否是回文串，三个参数：s left right
const isPalindrome = (s, l, r) => {
    for (let i = l, j = r; i < j; i++, j--) {
        if(s[i] !== s[j]) return false;
    }
    return true;
}
// 确定参数和返回值：参数为startIndex
// 整体思路相当于组合问题稍作整理做成切割问题
var partition = function(s) {
    const result = [],path = [];
    let len = s.length;
    const dfs = (startIndex) => {
        // 终止条件，当切割板到最后一个，即是该分支下已经判读完了，
        // 即当startIndex等于子串长度时,return
        if(startIndex === len){
            result.push([...path]);
            return;
        } 
        for(let i = startIndex;i < len;i++){
            // 每一次切，怎么切呢?起始位置就是startIndex,结束位置自然是i
            // 不符合是回文串，则continue
            if(!isPalindrome(s,startIndex,i))continue;
            path.push(s.slice(startIndex,i+1));// 注意切割时，末位置记得加1
            dfs(i+1); // 不允许重复使用，则i+1
            path.pop();// 回溯
        }
    };
    dfs(0);
    return result;
};
```

# 复原IP地址

```js
// 同是组合问题转成切割问题
// .join('.')方法是将数组元素用.分割成字符串
var restoreIpAddresses = function(s) {
    const res = [],path = [];

    function dfs(startIndex){
        //终止条件，需要用到startIndex=s.length来比较什么时候退出
        //此时比较的是 path.length=4
        const len = path.length;
        if(len>4)return;
        if(len === 4 && startIndex=== s.length){
            res.push(path.join("."));
            return;
        }
        for(let j = startIndex;j < s.length;j++){
            const str = s.slice(startIndex,j+1);// 切割时注意是j+1
            if(str.length>3||+str>255)break; // 只能是百位数以内并且不可以大于255
            if(str.length>1&&str[0]==="0")break;// 当是十位或者百位数的时候，首位不可以是'0'
            path.push(str);
            dfs(j+1);
            path.pop()
        }
    }

    dfs(0);
    return res;
};

```

# 子集

```javascript
// 确定参数和返回值
// 判断终止条件没有条件限制
var subsets = function(nums) {
    let res= [],path = [];
        nums = nums.sort((a, b) => {
        return a - b
    })// 排序是为了后序可以去重，这里可排可不排
    const dfs = (startIndex) =>{
        res.push([...path]);// 刚好空数组被push
        for(let i = startIndex;i < nums.length;i++){
            path.push(nums[i]);
            dfs(i+1);
            path.pop();
        }
    }
    dfs(0);
    return res;
};
```
# 子集II

```javascript
var subsetsWithDup = function(nums) {
    let result = []
    let path = []
    let sortNums = nums.sort((a, b) => {
        return a - b
    })
    function backtracing(startIndex, sortNums) {
        result.push([...path])
        for(let i = startIndex; i < nums.length; i++) {
            if(i > startIndex && nums[i] === nums[i - 1]) {
                continue
            }
            path.push(nums[i])
            backtracing(i + 1, sortNums)
            path.pop()
        }
    }
    backtracing(0, sortNums)
    return result
};
```

# 递增子序列

```javascript
// 求递增子序列问题，因为是求得是递增的子集，所以不可以排序！
// 不可以排序，所以一般的去重法失效了
// 要选择另一种去重的方法 uset
var findSubsequences = function(nums) {
    let result = []
    let path = []
    function backtracing(startIndex) {
        // 终止条件：至少有两个元素
        if(path.length > 1) {
            result.push([...path])
        }
        // 在每次循环之前定义一个uset来帮助去重，目地是使得每个分支去重
        let uset = []
        for(let i = startIndex; i < nums.length; i++) {
            // 当满足加入path的元素不是满足可以成为递增子序列时
            if((path.length > 0 && nums[i] < path[path.length - 1])) {
                continue;
            }
            // 当使用过了
            // 为什么不选择使用uset[i]的方式，因为我们要标记的是相同元素，i都是不同的
            if(uset[nums[i] + 100]) continue;
            uset[nums[i] + 100] = true
            path.push(nums[i])
            backtracing(i + 1)
            path.pop()
        }
    }
    backtracing(0)
    return result
};
```
# 全排列

```js
// 全排列问题：此题不包含重复数字，求全排列
// 组合问题可以通过排序再比较前后来去重
// 全排列去重是定义一个全局变量used来记录nums中的元素有没有重复使用
// 并且要记得回溯uset
var permute = function(nums) {
    const res = [], path = [],used = [];
    const len = nums.length;
    function backtracking() {
        // 终止条件
        if(path.length === len) {
            res.push([...path]);
            return;
        }
        // 全排列问题i的初始值为0开始，不需要startIndex
        for (let i = 0; i < len; i++ ) {
            if(used[i]) continue; // 判断路径是是否用过该元素
            path.push(nums[i]);
            used[i] = true; // 同一支
            backtracking();
            path.pop();
            used[i] = false;
        }
    }
    backtracking();
    return res;
};
```

# 全排列II

```js
// 全排列问题：可有重复数字的序列，则需要两个去重细节
// 1.为一个path上的是否重复使用同一个下标下的元素
// 2.因为有重复数字，所以需要判断同一个数层是否用过
// i > 0 && nums[i] === nums[i - 1] && !used[i - 1] 组合问题是需要加第三个条件的
var permuteUnique = function (nums) {
    nums.sort((a, b) => {
        return a - b
    })
    let result = []
    let path = []
    let used = []
    function backtracing() {
        // used[i - 1] == true，说明同一树枝nums[i - 1]使用过
        // used[i - 1] == false，说明同一树层nums[i - 1]使用过
        // 如果同一树层nums[i - 1]使用过则直接跳过
        if (path.length === nums.length) {
            result.push([...path])
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                continue;
            }
            if (!used[i]) {
                used[i] = true; path.push(nums[i]);
                backtracing();
                path.pop();used[i] = false;
            }
        }
    }
    backtracing()
    return result
};
```








