// function thousandSeparator(n){
//     //num -> string -> list
//     let nStrList = n.toString().split('-');
//     let carry = null, last = null;
//     if (nStrList.length > 1) { 
//         nStrList = nStrList[1];
//         carry = '-';
//     }
//     nStrList = nStrList.toString().split('.');
//     console.log(nStrList);
//     if (nStrList.length > 1) {
//         last = nStrList[1];
//         nStrList = nStrList[0].toString().split('');
//         console.log(last);
//     }
//     const ans = [];
//     let count = 0;
//     while (nStrList.length > 0) {
//         //每隔三个加一个 . 
//         if (count === 3) {
//             ans.unshift(',');
//             //加完点重置count
//             count = 0;
//         } 
//         count++;
//         //每次插入and的头部
//         ans.unshift(nStrList.pop());
//     }
//     carry = carry ?? '';
//     if (last) {
//         last = '.' + last;
//     } else {
//         last = ''
//     }
//     return carry + ans.join('') + last;
// };
function thousandSeparator(n) {
    let nStr = n.toString();
    let [integerPart, decimalPart = ''] = nStr.split('.');
    if (integerPart[0] === '-') {
        integerPart = integerPart.slice(1);
    }
    let formattedIntegerPart = '';

    for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
      if (count === 3) {
        formattedIntegerPart = ',' + formattedIntegerPart;
        count = 0;
      }
      formattedIntegerPart = integerPart[i] + formattedIntegerPart;
    }
    return (n < 0 ? '-' : '') + formattedIntegerPart + (decimalPart ? '.' + decimalPart : '');
}
  
console.log(thousandSeparator(123456.1)); 
