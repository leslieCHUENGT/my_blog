function majortyElement(nums){
	const map = new Map();
	for(let i = 0;i < nums.length;i++){
		if(map.has(nums[i])){
			map.set(nums[i], map.get(nums[i]) + 1);
		}else{
			map.set(nums[i], 1);
		}
	}
	let res = -1;
	for(let [key, value] of map){
		if( value > nums.length / 2){
			res = key;
		}
	}
	return res;
}

// console.log(majortyElement([1,1,1,1,1,3,3,4]))


const coinChange = (coins, amount) => {
    if(!amount) return 0;
    let dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for(let i =0; i < coins.length; i++) {
        for(let j = coins[i]; j <= amount; j++) {
            dp[j] = Math.min(dp[j - coins[i]] + 1, dp[j]);
            console.log(dp);
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

let coins = [1, 2, 5], amount = 11;

coinChange(coins, amount)