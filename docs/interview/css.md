# 说说你对盒子模型的理解?
- 一个盒子由四个部分组成：`content`、`padding`、`border`、`margin`
- `content`，即`实际内容`，显示文本和图像
- `boreder`，即`边框`，围绕元素内容的内边距的一条或多条线，由粗细、样式、颜色三部分组成
- `padding`，即`内边距`，清除内容周围的区域，内边距是`透明的`，`取值不能为负`，受盒子的background属性影响
- `margin`，即`外边距`，在元素外`创建额外的空白`，空白通常指不能放其他元素的区域
## W3C 标准盒子模型
-   盒子总宽度 = width + `padding + border + margin`
-   盒子总高度 = height + `padding + border + margin`

也就是，`width/height` 只是内容高度，不包含 `padding` 和 `border`值

所以上面问题中，设置`width`为200px，但由于存在`padding`，但实际上盒子的宽度有240px
## IE 怪异盒子模型
-   盒子总宽度 = width + `margin`;
-   盒子总高度 = height + `margin`;

也就是，`width/height` 包含了 `padding`和 `border`值
CSS 中的 box-sizing 属性定义了引擎应该如何计算一个元素的总宽度和总高度

语法：

```js
box-sizing: content-box|border-box|inherit:
```
-   `content-box` 默认值，元素的 width/height 不包含padding，border，与标准盒子模型表现一致
-   `border-box `元素的 width/height 包含 padding，border，与怪异盒子模型表现一致
-   `inherit` 指定 box-sizing 属性的值，应该从父元素继承

# 说说em/px/rem/vh/vw区别?
传统的项目开发中，我们只会用到`px、%、em`这几个单位，它可以适用于大部分的项目开发，且拥有比较良好的兼容性
从`CSS3`开始，浏览器对计量单位的支持又提升到了另外一个境界，新增了`rem、vh、vw、vm`等一些新的计量单位
利用这些新的单位开发出`比较良好的响应式页面`，适应多种`不同分辨率的终端`，包括`移动设备`等
## px
- px，表示像素，所谓像素就是呈现在我们显示器上的`一个个小点`，`每个像素点都是大小等同的`，所以像素为计量单位被分在了绝对长度单位中
- 有些人会把px认为是相对长度，原因在于在`移动端中存在设备像素比`，px实际显示的大小是不确定的
    - 以一台具有`2x设备像素比`的手机为例，如果我们使用CSS样式设置一个元素的`宽度为100px`，那么在该设备上，这个元素实际上会被渲染为`200物理像素的宽度`。同样的，如果我们在一台`3x设备像素比`的手机上显示相同的元素，则该元素将呈现为`300物理像素的宽度`。
- 这里之所以认为px为绝对单位，`在于px的大小和元素的其他属性无关`
- 在移动设备上，像素密度比（Device Pixel Ratio）是指物理像素和逻辑像素之间的比例。而逻辑像素指的是 CSS 像素，物理像素指的是屏幕上实际的像素。
例如，如果一台设备的物理分辨率为 750px * 1334px，而逻辑分辨率为 375px * 667px，那么该设备的像素密度比就是 2。这意味着在这台设备上，一个 CSS 像素由 2 个物理像素组成。
CSS 像素是 Web 开发中的一种抽象概念，它是相对于设备独立像素（Device Independent Pixel，简称 DP 或 DIP）而言的。DP 是一个基准值，是指屏幕上每英寸有多少像素点。例如，一个 DP 等于 160 个物理像素，这意味着在像素密度比为 1 的设备上，一个 CSS 像素由 1 个物理像素组成。
在 CSS 中，通常使用 px 作为单位来指定长度或大小，而像素密度比则会影响元素的真实大小。例如，在一个像素密度比为 2 的设备上，一个宽度为 100px 的元素将会占用实际宽度为 200px 的物理像素。
需要注意的是，不同的设备和浏览器可能有不同的像素密度比。因此，为了确保应用程序在不同设备上具有相似的外观，我们需要使用一些技术来处理像素密度比的问题，例如使用响应式设计、媒体查询等技术来适配不同的设备和分辨率。
## em
`em是相对长度单位`。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸（`1em = 16px`）

为了简化 `font-size` 的换算，我们需要在`css`中的 `body` 选择器中声明`font-size`= `62.5%`，这就使 em 值变为 `16px*62.5% = 10px`

这样 `12px = 1.2em`, `10px = 1em`, 也就是说只需要将你的原来的`px` 数值除以 10，然后换上 `em`作为单位就行了

特点：
-   em 的值并不是固定的
-   `em 会继承父级元素的字体大小`
-   em 是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸
-   任意浏览器的`默认字体高都是 16px`

## rem
rem，相对单位，相对的只是`HTML根元素``font-size`的值

同理，如果想要简化`font-size`的转化，我们可以在根元素`html`中加入`font-size: 62.5%`

```js
html {font-size: 62.5%;  } /*  公式16px*62.5%=10px  */ 
```

这样页面中1rem=10px、1.2rem=12px、1.4rem=14px、1.6rem=16px;使得视觉、使用、书写都得到了极大的帮助

特点：

-   rem单位可谓集相对大小和绝对大小的优点于一身
-   和em不同的是rem总是`相对于根元素`，而不像em一样使用`级联的方式`来计算尺寸

## vw vh
vw ，就是`根据窗口的宽度`，`分成100等份`，`100vw就表示满宽`，50vw就表示一半宽。（v`w 始终是针对窗口的宽`），同理，`vh`则为窗口的高度

这里的窗口分成几种情况：

-   `在桌面端，指的是浏览器的可视区域`
-   `移动端指的就是布局视口`

像`vw`、`vh`，比较容易混淆的一个单位是`%`，不过百分比宽泛的讲是`相对于父元素`：

## 三、总结
**px**：绝对单位，页面按精确像素展示
**em**：相对单位，基准点为父节点字体的大小，如果自身定义了`font-size`按自身来计算，整个页面内`1em`不是一个固定的值
**rem**：相对单位，可理解为`root em`, 相对根节点`html`的字体大小来计算
**vh、vw**：主要用于页面视口大小布局，在页面布局上更加方便简单

# 1px问题

# css中，有哪些方式可以隐藏页面元素？区别?
通过`css`实现隐藏元素方法有如下：

- `display:none`
- `visibility:hidden`
- `opacity:0`
- `设置height、width模型属性为0`
- `position:absolute`
- `clip-path`

## display:none
- 将元素设置为display:none后，元素在页面上将`彻底消失`
- 元素本身占有的空间就会被其他元素占有，也就是说它会`导致浏览器的重排和重绘`
- 消失后，自身绑定的事件不会触发，也不会有过渡效果

特点：`元素不可见，不占据空间，无法响应点击事件、导致浏览器的重排和重绘`

## visibility:hidden
- `特点：元素不可见，占据页面空间，无法响应点击事件、不会触发重排，但是会触发重绘`

## opacity:0
`opacity`属性表示元素的透明度，将元素的透明度设置为0后，在我们用户眼中，元素也是隐藏的

`不会引发重排，一般情况下也会引发重绘`

> 如果利用` animation 动画，对 opacity 做变化`（animation会默认触发GPU加速），`则只会触发 GPU 层面的 composite，不会触发重绘`

```js
.transparent {
    opacity:0;
}
```
- 由于其仍然是存在于页面上的，所以他自身的的事件仍然是可以触发的，但被他遮挡的元素是不能触发其事件的
- 需要注意的是：其子元素不能设置opacity来达到显示的效果

- `特点：改变元素透明度，元素不可见，占据页面空间，可以响应点击事件、不会引发重排，一般情况下也会引发重绘`

## 设置height、width属性为0
- `特点：元素不可见，不占据页面空间，无法响应点击事件、导致浏览器的重排和重绘`

## position:absolute

将元素移出可视区域
```js
.hide {
   position: absolute;
   top: -9999px;
   left: -9999px;
}
```

特点：`元素不可见，不影响页面布局`

## clip-path

```js
.hide {
  clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px);
}
```

特点：`元素不可见，占据页面空间，无法响应点击事件`

### 小结

最常用的还是`display:none`和`visibility:hidden`，其他的方式只能认为是奇招，它们的真正用途并不是用于隐藏元素，所以并不推荐使用它们

## 区别

关于`display: none`、`visibility: hidden`、`opacity: 0`的区别，如下表所示：

|             | display: none | visibility: hidden | opacity: 0 |
| ----------- | ------------- | ------------------ | ---------- |
| 页面中         | 不存在           | 存在                 | 存在         |
| 重排          | 会             | 不会                 | 不会         |
| 重绘          | 会             | 会                  | 不一定        |
| 自身绑定事件      | 不触发           | 不触发                | 可触发        |
| transition  | 不支持           | 支持                 | 支持         |
| 子元素可复原      | 不能            | 能                  | 不能         |
| 被遮挡的元素可触发事件 | 能             | 能                  | 不能


# BFC

# 元素水平垂直居中的方法有哪些？如果元素不定宽高呢？

1.  使用 Flexbox 布局：将父元素设置为 display: flex; 并使用 justify-content 和 align-items 属性来分别使子元素水平和垂直居中。
2.  使用绝对定位和 transform 属性：将父元素设置为相对定位，子元素设置为绝对定位，并将 top、bottom、left 和 right 属性设为 0，然后使用 transform 属性来使子元素水平和垂直居中。
3.  使用绝对定位和 margin 属性：将父元素设置为相对定位，子元素设置为绝对定位，并将 top、bottom、left 和 right 属性设为 0，然后使用 margin 属性来自动计算居中位置。
4.  使用表格布局：将父元素设置为 display: table;，并将子元素设置为 display: table-cell;，然后使用 vertical-align 和 text-align 属性来使子元素水平和垂直居中。
5.  使用 CSS Grid 布局：将父元素设置为 display: grid; 并使用 justify-items 和 align-items 属性来分别使子元素水平和垂直居中。
6.  使用 JavaScript：通过计算父元素和子元素的宽度和高度以及位置，动态地设置子元素的居中位置。

6.  使用 JavaScript：

```js
HTML:
<div id="parent">
  <div id="child">居中内容</div>
</div>

CSS:
#parent {
  position: relative;
  width: 100%;
  height: 100%;
}

#child {
  position: absolute;
  width: 200px;
  height: 100px;
}

JavaScript:
const parent = document.getElementById('parent');
const child = document.getElementById('child');

const parentWidth = parent.offsetWidth;
const parentHeight = parent.offsetHeight;
const childWidth = child.offsetWidth;
const childHeight = child.offsetHeight;

child.style.left = `${(parentWidth - childWidth) / 2}px`;
child.style.top = `${(parentHeight - childHeight) / 2}px`;
```






