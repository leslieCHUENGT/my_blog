# css选择器
- 行内样式（标签）和外部样式（link或者import引入），内联样式（div style）
- 小红书，进制256，相差1，那么实际换算下来相差256
- 下面是排序
  - ！import 优先级第一
  - 内联样式  1000
  - id 100
  - 类 伪类 属性选择器[class='foo'] 10 
    - div[class='foo'] 10 + 1
  - 标签选择器 div 伪元素选择器 ::first-line 1
  - 关系选择器（* > +）和通配符 0
  - 继承的样式没有权值
# 可继承性
- 字体系列属性
  - 大小、粗细、风格
- 文本系列属性
  - 颜色、行高、间距
- 元素可见性
  - visibility 
- 光标属性

# display
- none
- block
- inline
- inline-block
- table
- inherit
- flex
- grid

# display的block、inline和inline-block的区别
- block
  - 可设置宽高、内外边距
  - div、p、h、ul、li
- inline
  - a、span
  - 不能设置宽高、上下内边距
- inline-block
  - input、img

# 隐藏元素有哪些方法
- display：none，DOM树上依然会存在，在渲染过程中，布局树上就不存在这个节点了
- visibility（可见性）: hidden，DOM树上依然会存在，在渲染过程中，布局树上存在这个节点，所以会占据空间和相应的位置，看不见但是摸不着，**不会响应点击事件**
- opacity（透明度）: DOM树、布局树上存在这个节点，浏览器处理这个属性，是将透明度为0，看不见但是可以摸着，可以**响应点击事件。**
- 设置宽高为0，移出视图外，裁剪(clip)，缩放（transform：scale()），都是和visibility: hidden差不多

# display:none和visibility：hidden的区别
- 渲染树
- 继承属性
  - display：none,不可继承，修改了子孙属性页无法改变，层级问题
  - visibility： hidden，可继承，修改了，可以显示
- 重绘重排

# 标准盒模型和IE盒模型
- 标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：
- 标准盒模型的width和height属性的范围只包含了content，
- IE盒模型的width和height属性的范围包含了border、padding和content。
  - 边框和内边距

# li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决
- 实际上就是inline元素间的换行字符被识别为空格
- 解决办法
  - 写在一行
  - 设置font-size为0

# 预处理器
- 将css赋予动态类型的特性，支持变量，函数
- 嵌套代码的能力，通过嵌套来反映不同 css 属性之间的层级关系 ；
- 支持定义 css 变量；
- 提供计算函数；
- 允许对代码片段进行 extend 和 mixin；
- 支持循环语句的使用；
- 支持将 CSS 文件模块化，实现复用。

# 品字布局
- 需要已知宽高
- 第一个盒子设置margin： 0 auto
  - 上下边距为0，左右方向上的外边距为自动
- 第二个盒子设置：float:left margin-left:50%
  - 占据右下角
- 第三个盒子设置：float：left margin-left:-200px
  - 拖拉到原来位置的200px处
- 注意将float:left换成display:inline-block也可以

# 圣杯布局
- 使用flex：1实现
- 使用float:left和float：right来实现，如果父盒子不给宽高，记得进行浮动的清除
- 使用float：left实现
  - 首先将父盒子设置为padding-left和padding-right设置两边盒子的距离，此时子盒子的百分比是根据这个来算的
  - 再将三个子盒子.container div设置为相对定位和浮动向左，相对定位是为了后续的移动
  - 三个盒子的排列：中 左 右
  - 中间盒子width:100%
  - 左盒子设置margin-left:-100%把左盒子拉到中间盒子的起始，设置left:-200px即把它拉到头部
  - 右盒子设置margin-left:-250px，此时是消除padding的作用，把它拉向中间盒子，设置left:250px,平齐即可


# 浮动布局
- 优点
    - 文字环绕
    - 行块盒子性质
- 和display:inline-block的区别
  - 方向可以设置
  - 不会出现空白间隙的问题
- 清除浮动（脱离文档流，无法撑起父元素）
  - 额外标签添加clear:both
  - 父元素overflow:hidden/auto
  - 伪元素
```css
.clear::after{
    content:'';
    display: block; 
    clear:both;
}
```
- clear属性只有**块级元素**才有效的，而::after等伪元素默认都是**内联水平**这就是借助伪元素清除浮动影响时需要**设置display属性值**的原因。

# BFC？如何创建BFC?解决了什么问题？
- BFC，块格式化上下文，独立的渲染环境
- 创造BFC的方法
  - 根元素body
  - 元素设置float浮动的方向
  - 元素设置定位position为绝对定位、固定定位
  - 元素设置布局display为flex、block、inline-block、table、grid
- 解决的问题
  - 高度坍塌
  - margin重叠问题

# 讲一讲position的属性有哪
- absolute
  - 浏览器会递归查找该元素的所有父元素，如果找到一个设置了position:relative/absolute/fixed的元素，就以该元素为基准定位，如果没找到，就以浏览器边界定位。
- relative，相对元素自身的位置
- fixed，在视口指定位置
- sticky
  - 指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。
  - 否则其行为与相对定位相同。
  - 粘性布局的本质是在 position:relative 与 position:fixed 定位之间切换。
- status，正常文档流
- inherit，继承父属性的position

# display、float、position的关系
- "position:absolute"和"position:fixed"优先级最高，有它存在的时候，浮动不起作用,'display'的值也需要调整

# IE盒模型和标准盒模型
- IE盒子模型的content的大小会受到padding、border的影响
- 标准盒子模型的content不会受影响，会根据padding、border**扩大**自身的大小


# 说一下盒子模型，什么是怪异盒子模型，如果盒子内部元素设置了 margin 属性，怎么让盒子不出现滚动条
- 给父盒子设置`overflow: hidden`,进行裁剪，可能会影响布局
- 使用`padding`来代替`margin`

# Chrome浏览器最低只能显示12px的字体大小，怎么在不改变整体字体大小的情况下让单独某个区域的字体显示为10px的效果

```css
  .small-font {
    transform: scale(0.83); /* 缩放比例为 12/10 ≈ 0.83 */
    transform-origin: top left; /* 设置缩放的基准点为左上角 */
  }
```



