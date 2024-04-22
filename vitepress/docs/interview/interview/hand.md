# 版本号排序
```javascript
const versions = ["1.2.1", "1.0.2", "1.3.2", "1.1", "1.2", "1", "1.10.0"]; 
// 升序排序 
versions.sort(compareVersion);

const compareVersion = (version1, version2) => {
    // 此时传入的是字符串
    const arr1 = version1.split('.');
    const arr2 = version2.split('.');
    // 取最长的长度进行比较
    const len = Math.max(arr1.length, arr2.length);
    for(let i = 0; i < len; i++){
        // 提取，注意长度边界问题
        const num1 = i > arr1.length ? 0 : parseInt(arr1[i]);
        const num2 = i > arr2.length ? 0 : parseInt(arr2[i]);
        if(num1 < num2){
            return -1;
        }else if(num1 > num2){
            return 1;
        }
    }
    // 等于的情况，不改变。
    return 0;
}

```


