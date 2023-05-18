# 讲一讲css布局
- 首先就是弹性布局，容器比较常用的属性就是
  - 主轴的确定；换不换行；主轴上的对齐的方式：用得最多的就是space-between
  - 交叉轴的对齐的方式
- 其次就是网格布局，因为现在大多数的浏览器可以兼容了。所以稍微用过它
  - 它的布局属性可以分为两类：
  - 第一个就是声明为行内元素还是块级元素
  - 第二个就是项目的属性：比较常用的就是列宽，行高，比例关系，间距，还有主轴交叉轴等
- 然后就是浮动布局（Float Layout）、定位布局（Positioning Layout）
- 最经典的三栏布局形式，左右宽度固定，中间宽度自适应
  - **实现这个布局最简单的方式肯定是flex布局，设置middle为flex为1即可**
  - **其次就是设置左右浮动为一左一右就可以**
  - 再者就是利用浮动均为左或者右，设置margin的负值和距离来实现
  - 绝对定位也肯定可以实现，设置三个盒子的距离属性就可以了
  - 网格布局也可以实现，grid现在绝大多数浏览器已经可以兼容了，可以着手使用了。
- 两栏布局，左边一栏宽度固定，右边一栏宽度自适应
  - 利用浮动轻松解决
    - 左盒子设置为向左浮动，右盒子设置`margin`值就可以，宽度设置为auto（默认为auto，撑满整个父元素）,不设置也行，默认就是，或者设置为`overflow: hidden;`触发了BFC，BFC不会和浮动元素重叠，是独立的渲染区域，单独的图层
    - flex布局，利用flex为1的属性
    - 绝对定位也可以



- 绝对定位和固定定位会完全脱离文档流
  - 相对于其最近的已定位祖先元素进行定位
  - 相对于视口进行定位
- 浮动布局也会脱离文档流


# 浮动的特性
- 浮动元素具有行内块元素的特点
  - 它们的特点是可以像行内元素一样**并排排列**，但又可以像块级元素一样**设置宽度、高度、边距、内边距和边框等属性。**


# 清除浮动有哪些方式？
- 浮动元素会脱离标准文档流，不占据空间，但是并不代表是最后绘制，绘制和在html中的位置有关，另外和z-index属性有关
- 正因为会脱离文档流，就无法撑起父元素，造成高度坍塌
- 无论是哪种方法都是为了创建新的BFC
  - 添加额外的标签，属性设置clear为both
  - 父级添加overflow属性，设置为hidden或者auto，设置高度肯定可以，但是违背了初衷
  - 建立伪类选择器清除浮动，会用到clear属性，一般添加：after就行

# 伪元素和伪类的区别和作用？
- 不会在文档的源代码中找到它们
- 伪元素就是前后插入额外的元素或者样式，它的本质就是在已有的元素添加别的
- 伪类是通过在元素选择器上加入伪类来改变元素状态的比如hover、first-child
- :before 和 :after 这两个伪元素，是在CSS2.1里新出现的。起初，伪元素的前缀使用的是单冒号语法，但随着Web的进化，在CSS3的规范里，**伪元素**的语法被修改成使用**双冒号**，成为::before、::after。
# BFC
- 我对BFC的理解就是会形成一个独立的渲染区域，和外部元素相互隔离开
- 怎么创建BFC容器
  - 左右浮动
  - overflow的auto、hidden等属性
  - display:inline-block 实现行内块元素的特性，但是不会脱离文档流
  - 弹性布局、网格布局、定位布局

# css常见选择器
- id选择器，`#` 100
- 类选择器即为标签的class属性， `.` 10 
- 伪类选择器，`li:last-child` 10 
- 属性选择器，[title]、[title~=hello]、input[type="text"] 10 
- 标签选择器，所有的HTML标记名都可以作为标签选择器 `div p h1 span ` 1
- 伪元素选择器，`li:after` 1
- 并集选择器，`span,div, .content ` 0
- 后代选择器，`ul a` 0
- 子选择器，只会查找儿子，不会查找孙子`#box > p` 0 
- 兄弟选择器，匹配第一个，紧接第二个`h1 + p` 查找某一个指定元素的后面的所有兄弟结点。`h1 ~ p` 0 
- 通配符选择器， `*` 0

# css继承性和不可继承性
- 可继承的  
  - 文字的属性：粗细啊、大小啊、风格啊
  - 文本的属性：颜色啊、间距啥的
  - 元素可见性：`visibility`
  - 光标属性
- 不可继承
  - 定位属性：float、clear、position、top、right、bottom、left、
  - display 布局
  - 宽高等属性

# 讲一讲display属性
- none，DOM树上依然会存在，在渲染过程中，布局树上就不存在这个节点了
- block，块级元素类型
- inline，行内元素类型
- inline-block，行内块级元素类型
- table，作为块级表格元素显示
- inherit，继承

# 讲一讲display：table
- 一般实现表格都是用table(tr、td)标签来布局，这样语义化更好，对SEO友好
- 没有使用table标签就可能会用这个属性
- 优点就是可以实现等高布局，可以让每个子元素的高度一样；可以实现响应式布局

# 隐藏元素有哪些方法
- display：none，DOM树上依然会存在，在渲染过程中，布局树上就不存在这个节点了
- visibility: hidden，DOM树上依然会存在，在渲染过程中，布局树上存在这个节点，所以会占据空间和相应的位置，看不见但是摸不着，不会响应点击事件
- opacity: 0，透明度为0，DOM树、布局树上存在这个节点，浏览器处理这个属性，是将透明度为0，看不见但是可以摸着，可以响应点击事件。
- 设置宽高为0，移出视图外，裁剪，都是和visibility: hidden差不多的流程。

# 从继承角度讲一讲display:none与visibility:hidden的区别
- display：none是非继承属性，子孙节点修改了属性也无法显示
- visibility：hidden是继承属性，子孙节点可以通过设置visibility：visible来显示

# 标准盒子模型和IE盒子模型
- 这两种盒子模型，在网页布局中主要就是计算布局时会有不同
- 标准盒模型的wh属性只包括了content
- IE盒模型就还包含了内外边距的值

# 讲一讲css3的新特性
- 比较常用的新增的选择器：
  - 属性选择器；伪类、伪元素选择器；子选择器、兄弟选择器；通用选择器
- 比较常用的属性：
  - 圆角、变形transform、过渡transition、动画animation、媒体查询、渐变

# 什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x, @2x这种图片？媒体查询？
- 物理像素也就是分辨率，物理像素点是屏幕的最小颗粒
- 开发过程中，移动端开发1px可能等于1/2/3个物理像素
- 二倍屏/三倍屏，更多物理像素点压缩到一块屏幕里，分辨率高，越清晰
- 这样也就产生了像素密度比的概念，**一个逻辑像素等于2/3的物理像素**
- 其值为1/2/3

- 二倍屏/三倍屏的原因，50*50px的图片会对应100*100的物理像素来展示这张图片
- 相当于放大了两倍
- CSS 媒体查询来判断不同的像素密度，从而选择不同像素的图片

# 讲一讲css优化和提高性能的方法
- 加载方面
  - 利用打包工具压缩css文件
  - 尽量减少@import引入，这是等页面加载完后才开始引入
  - link标签就属于是同时加载的
- 渲染性能方面
  - 尽量减少页面重排、重绘。
  - 尽量减少浮动和定位，不然会使浏览器渲染进程合成更多图层、同时他们会脱离文档流，会影响其他图层的渲染

# 用过什么css预处理器？讲一讲
- 用过stylus
- 本质上预处理是css的超集，扩充了css语言，比如变量、mixin、函数
  - 变量$main-color = #007acc，可以在前面加$符号
  - Mixin是一种可以重复使用的代码块
  - 使用匿名函数来动态计算
- 作用域基本和js一样
- 模块化，做了一些性能优化

# 如何实现单行／多行文本溢出的省略样式？
- 处理单行文本溢出
  - overflow:hidden 超出隐藏
  - white-space:nowrap 不换行
  - text-overflow:ellipsis 裁剪标记省略号
- 处理多行文本溢出
  - 基于高度截断
    - 就是通过伪元素.demo::after给定content为...,前提是选择器要设置overflow：hidden，并且是绝对定位。
  - 基于行数截断
    - 因为基于弹性盒子布局可以设置显示的行数
    - 所以用display设置为-webkit-box来设置成弹性盒子布局
    - 因为这是css3的属性，防止有些浏览器不支持那就要加-webkit
    - 设置行数，overflow：hidden，text-overflow：ellipsis即可

# 讲一讲css工程化
- 我了解的主要就是webpack处理
- 我在vue项目里用了stylus来写css
- 处理这个css预编译器的流程大概是stylus-loader编译.styl文件
- 再经过css-loader来处理css的一些特性（import）、更主要的作用就是打包成js模块，方便后续添加到html上
- 再用style-loader将css代码注入到html页面中，就是添加到style标签里
- 当然还有一些Plugin可以处理css压缩的问题

# 讲一讲移动端适配
- 首先就是css3的新特性，媒体查询，选择不同精度的图片，以保证图片不会失真；
- 尺寸自适应：rem em vw vh等

# flex布局最常用的属性
- flex-direction设置主轴的方向
- justify-content设置主轴上的子元素排列方式
  - 从头开始：flex-start；从尾开始：flex-end
  - 中间对齐就是center
  - 还有就是最常用的space-between
    - 中间设置flex为1，就实现了三栏布局
- flex-wrap设置要不要换行
  - 默认情况是不换行，但这里也不会任由元素直接溢出容器，会涉及到**元素的弹性伸缩**
- align-items设置交叉轴上的子元素排列方式
  - 起点对齐、终点对齐和中点对齐
- align-content设置多根轴线的对齐方式
  - 属性和设置主轴的子元素排列方式一样
- order属性，数值越小，排名越靠前
- 还有flex属性，用得最多的就是flex：1
  - 这是个伸缩属性，包含了好几个属性默认值都为0，此时如果有剩余空间，则会自动填充周围的空间
  - 当有flex：2和flex：1在一起的时候，就按设置的比例来伸缩

# 讲一讲margin重叠问题
- 指的是两个或者多个块级元素之间的margin合并成一个margin了
- 为什么会产生这个问题，我好奇的去问chatGPT，他向我解释是因为css规范所定义的
- 在生成布局树的时候，计算的时候应该是会叠加计算
- 只发生在垂直方向上
- 怎么解决？
  - 发生在兄弟间
    - 底部盒子设置为行内块盒子就可以：display：inline-block
    - 因为浮动也可以使元素为行内块盒子，设置float
    - 直接用padding和border来设置就行了
    - 插入空元素
  - 发生在父子间
    - overflow: hidden
    - border:1px solid transparent
    - 子元素加入浮动属性或定位或display: inline-block
  - 无论发生在兄弟还是父子间，都是通过
    - 变成行内块级元素：display：inline-block或者overflow：hidden或者设置浮动，还有position：absolute或者fixed，实际上就是创建了BFC
    - 设置padding或者border

# 讲一讲元素的层叠顺序
- 层叠顺序和渲染进程中形成分层树有关
- 稍微了解了一下z-index和css层级的关系
  - 最底下的就是背景和边框
  - 然后就是负的z-index
  - 然后就是盒子的嵌套的关系，盒子默认是z-index为0
  - 然后是z-index为正数

# z-index和position:fixed的关系
- position:fixed只是脱离了文档流，看起来堆叠顺序高
- z-index依然会影响这个属性


# 讲一讲position的属性有哪
- absolute
  - 答案是浏览器会递归查找该元素的所有父元素，如果找到一个设置了position:relative/absolute/fixed的元素，就以该元素为基准定位，如果没找到，就以浏览器边界定位。
- relative，相对元素自身的位置
- fixed，在视口指定位置
- sticky
  - 指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。
  - 否则其行为与相对定位相同。
  - 粘性布局的本质是在 position:relative 与 position:fixed 定位之间切换。
- status，正常文档流
- inherit，继承父属性的position

# display、float、position的关系
- "position:absolute"和"position:fixed"优先级最高，有它存在的时候，浮动不起作用

# 画三角形和扇形和自适应的正方形
- 基于这个边框border属性实际是三角形
```css
  border: 100px solid;
  border-color: orange blue red green;
```
- 向下的三角形
- transparent 设置为透明，默认为黑色
```css
	width: 0;    
	height: 0;    
	border-top: 50px solid red;    
	border-right: 50px solid transparent;    
	border-left: 50px solid transparent;
```
- 向下的扇形
- 所有都为透明border: 100px solid transparent;
- 只在top上设置颜色：border-top-color: red;
- 设置弧度：border-radius:100px
```css
  width: 0;
  heigt: 0;
  border: 100px solid transparent;
  border-radius: 100px;
  border-top-color: red;
```
- 自适应的正方形
```css
	width: 50%; /* 设置宽度为父元素的50% */
	padding-bottom: 50%; /* 设置内边距为父元素宽度的50%，使其成为一个正方形 */
  /* padding-top: 50%; */ /* 均可 */
	background-color: red; /* 设置背景颜色 */
```
# 0.5px怎么实现
- 为什么会考虑这个，因为一个逻辑像素等于好几个物理像素
- 这会0.5px的线在两倍屏里就会放大为1px
- 
- 直接使用transform的scaleY属性，设置为0.5就可以
- 采用meta viewport的方法，设置scale的值就行，画1px就是0.5px的效果。只针对于移动端，才能看到效果
- SVG来指定子像素坐标
- 那么canvas也可以设置坐标来绘制

# 解决1px问题
- 为什么会考虑这个，因为一个逻辑像素等于好几个物理像素
- 1px在两倍屏里就放大了两倍，变粗了
- 实际上就是怎么画出0.5px的线

# 讲一件css3动画有哪些
- 在vue项目里，简单使用了一下，transition with .4s，过渡动画
- transition是过度属性，设置过度动画
- animation是动画属性，不需要触发事件，设定好时间之后可以执行
- transform 转变动画
  - 位移translate
  - 缩放scale：scaleY、scaleX
  - 旋转rotate
  - 倾斜skew

# 对requestAnimationframe的理解

# rem vh、vw
- rem 就是根据根元素font-size来适配的
- vue项目里用了用lib-flexible来进行适配
- 如果不设置那正常来说就是1rem=16px
- 设置了的话就会自动适配，根据宽度，分成10份

- lib-flexible会自动在html的head中添加一个meta name="viewport"的标签，
- 同时会自动设置html的font-size为屏幕宽度除以10，也就是1rem等于html根节点的font-size。
- 假如设计稿的宽度是750px，此时1rem应该等于75px。

- 根据窗口的宽高来分成100分，就是vw vh


# 讲一讲元素水平垂直居中的方法
- 利用定位和设置margin为auto就行，因为子元素四个定位属性都设置为0，虚拟占位就撑满了整个父元素
- 利用定位和margin设置为负值，把子盒子拉到中间去就行，但是需要知道子盒子宽高
  - top和left设置50%
  - margin-left:-50px; margin-top:-50px;
- 当不知道子盒子宽高的时候，就可以用translate(-50%,-50%)位移50%就行
- 弹性布局
- 网格布局
  - justify-content: center;
  - align-items: center;







