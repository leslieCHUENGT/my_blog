function slution(arr) {
    // 排序，方便后续去重
    arr.sort((a, b) => a - b);
    let res = [];
    let path = [];
    let len = arr.length;
    let uset = [];
    // 定义递归方式
    function dfs() {
        // 终止条件
        if (path.length === len) {
            res.push([...path]);
        }
        for (let i = 0; i < len; i++) {
            if (uset[i] === true) continue;
            path.push(arr[i]);
            uset[i] = true;
            dfs();
            path.pop();
            uset[i] = false;
         }
    }
    dfs();
    return res;
}

console.log(slution([1,2,3]))