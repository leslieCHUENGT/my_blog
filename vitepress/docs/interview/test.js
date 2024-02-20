const array1 = [5, 12, 8, 130, 44];
Array.prototype.myFind = function(fn, array = this){
    // console.log(array)
    for (let i = 0; i < array.length; i++) {

        if (fn(array[i], i, array)) {
            
            return array[i];
        }

    }
    return undefined;
}
const found = array1.myFind((element) => element > 10);

// console.log(found);
// Expected output: 12

const sulotion = (n) => {
    if(n <= 3) return n;
    let pre = 2;
    let cur = 0;
    for(let i = 4; i <= n; i++) {
        cur = pre + helpers(i - 1);
        pre = cur;
    }
    return cur;

}
const helpers = (n) => {
    let res = 1;
    for(let i = 2; i <= n; i++) {
        res *= i
    }
    return res;
}
console.log(sulotion(4));// 2 * 3 + 2 * 1
console.log(sulotion(5));// 2 * 3 * 4 + 2 * 3 + 2 * 1
console.log(sulotion(6));// 32 + 24 * 5