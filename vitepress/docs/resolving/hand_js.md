# 排序
## 归并排序
- 判断
- 拆分，取中间值，两个数组
- 递归回溯：合并（调用函数）排序（调用自己）
- 排序
  - 两个参数
  - 以长度为判断进入循环
    - 判断大小
      - 头部弹出
  - 可能存在其他长度的
    - 头部弹出即可，本来就是有序的

## 快排
- 三个参数，数组，左，右
- 判断
- 基准值
- 指针赋值
- 进入循环 i < j
  - 相反的符号找到第一个小于基准值的元素
  - j--
  - i++
  - 交换
- 基准值归位[left, i] = [i, left]
- 递归调用两边：i - 1 i + 1
- 返回arr

## 区别
- 归并是先分区再排序，稳定，非原地
- 快排是先排再合并，不稳定，原地
  
## 冒泡
- len - 1
  - len - i - 1
    - 大于则交换

## 选择
- 找到最小的放前面
- len - 1
  - i + 1 len
    - 找到了，交换

# 经典手写题
## 分割URL参数
- https://www.example.com/search?query=JavaScript&sort=desc&page=2
- 问号后面分割一波
- 判断一下
- 再用&号分割一波
- query=JavaScript&sort=desc&page=2
- 直接forEach遍历一波
  - = 号分割一波
  - 解码 decodeURIComponent()

## 合并对象
- hasOwnProperty

## 数组去重
- filter
  - indexOf
- 双重循环
  - for
  - flag = 0
    - for 
      - flag = 1
      - break
    - flag = 0
    - push（）
- 哈希表
  - hash.has()

## 回溯
- 绝大多数都是组合问题
### 组合问题
- 不出现重复数字和字符的集合 / 给定数组必须排序，便于下面的剪枝 
- 同一个数字可以被无限选取 -> 递归 i / 有重复数字但只能选择一次，必须排序便于去重
  - 传入startIndex
  - 控制终止条件，长度 和 return
  - n - i + 1 >= k - path.length剩下的要多于要的 i + sun <= n 剪枝
  - 去重 i > startIndex && candidates[i] === candidates[i - 1] 则 continue
  - 递归 i + 1 / i

- 集合不会相互影响
  - array.split('')使得字符串变数组
  - String.join('')使得数组变字符串
  - 直接startIndex + 1
  - 回溯 pop()

- 分割回文串
  - 终止条件，切到底
  - 切割前判断
  - string.slice(startIndex, i + 1)

- 复原ip
  - 先切再判断条件符不符合

- 递增子序列 / 可能出现重复元素
  - 无法进行排序去重
  - 在终止条件后添加uest = []
  - 对其选择之后，给定判断是否使用过（为true），continue
  - 对其继续的赋值为true

## 全排列问题
- 无重复数字
  - 不需要参数
  - 需要树层去重
    - 在外进行当以uset，需要判断后进行赋值为true
    - 需要进行回溯

- 有重复数字
  - 给定数组，都先要进行排序
  - 增加条件 i > 0 && nums[i - 1] === nums[i] && !uset[i - 1] 最先的位置之后，相等，uset表示用过


# 动态规划
## 01背包问题-装大小的问题
- 含义
- 初始化 0 
- 物品只能拿一次，则进行先遍历物品再遍历背包
- 倒叙遍历背包，不会重复计算（物品只能用一次）
- 装或者不装
  - dp[j] = Math.max(dp[j], value[i] + dp[j - weight[i]])

## 01背包问题-方法数的问题
- 初始化首项值为1，其余为0
- 遍历：
  - 物品->背包
  - 背包反向遍历，因为物品只能用一次
  - 能不能合并
    - dp[j] += dp[j - nums[i]]

## 完全背包问题
- 遍历：
  - 背包直接正向遍历，统计的是可重复数
  - 物品->背包 组合数
  - 背包->物品 排列数


## object常见方法
- Object.keys(obj): 返回一个包含对象自身可枚举属性名称的数组。
- Object.values(obj): 返回一个包含对象自身可枚举属性值的数组。
- Object.entries(obj): 返回一个包含对象自身可枚举属性键值对的数组。
- Object.hasOwnProperty(prop): 判断对象是否具有指定的属性（不包括原型链上的属性）。
- Object.is(obj1, obj2): 比较两个对象是否相等。
- Object.create(proto, propertiesObject): 使用指定的原型对象创建一个新对象。
- Object.defineProperty(obj, prop, descriptor): 定义对象的新属性或修改现有属性的特性。
```js
let obj = {
    a:1,
    b:2
}
console.log(Object.xxx(obj))
['a', 'b']
[1, 2]
[['a', 1], ['b', 2]]
```






