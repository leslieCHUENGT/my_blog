//node的模块化commonjs
console.log('webpack 运行了............')
module.exports = {
    // 当前入口
    entry: './main.js',
    output: {
        filename:'./bundle.js'
    }
}