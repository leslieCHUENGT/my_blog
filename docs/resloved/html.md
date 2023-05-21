# 场景题
## input框保留小数
- 流程 
- input属性 type id
- DOM编程getElementById
- 进行监听addEventListener('input',~)
- 拿到value，通过parseFloat(value).toFixd(2)
- typeof x === NaN
```html
<input type="number" id="myInput">
<script>
    let input = document.getElementById('myInput');
    input.addEventListener('input', function(){
        let value = input.value;
        let currentValue = parseFloat(value).toFixed(2);
        input.value = currentValue;
    })
</script>

```

# 怎么引入js、css文件
- script标签src引入
- link标签，要指定rel(relation关系)`stylesheet`,和type为`text/css`
- 渲染的时候要通过stylesheet来构造布局树

# href和src的区别，什么时候使用
- 当执行src标签的时候，**会暂停其他资源的下载**，直到加载编译执行，所以如果引入js文件，会放在底部
- script，嵌入外部资源
  - 引入视频图片音频
  - 还有js文件
- href，定义锚点，超链接、css样式表
  - a标签、link标签会使用href
  -  <a href="https://www.example.com">Link text</a>
  -  <a href="#section2">Go to Section 2</a> 跳转到同页面的某个位置
  -  <link rel="stylesheet" type="text/css" href="styles.css">

# script标签中defer和async的区别
- 他们的共同点就是放到异步加载执行，但是是略有不同
- 当执行到script标签带有defer时
  - 会开始并行加载，和后续文档执行时它会同时加载，但是不马上执行，等到文档解析完了，才会执行，这样就可以保证执行的顺序
- 当执行到script标签带有async时
  - 会开始并行加载执行，和后续文档执行时会同时加载和执行，这样就没法保证顺序了

# 常用的meta标签
- 我记得比较清的是适配移动端的viewport，可以调整视口的大小和比例
- description描述
- keyword关键词

- 指定文档编码UTF-8
# H5
## 语义化标签
- 用的比较多的就是
- header footer section aside nav
## 功能
- 拖拽 draggable="true"
- canvas
- SVG

#  img的srcset属性
- <img src="image-128.png" srcset="image-256.png 2x" />
- srcset属性用于设置不同屏幕密度下，img 会自动加载不同的图片。
- 






