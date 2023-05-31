# 单行文本溢出省略
```css
.single-line {
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}
```
# 多行文本溢出
```css
.multi-line {
  display: -webkit-box; /* 伸缩盒模型布局 */
  -webkit-box-orient: vertical;/* 伸缩盒子元素的排列方向为垂直方向 */
  -webkit-line-clamp: 3; /* 显示行数 */
  max-height: 60px; /* 容器最大高度 */
  overflow: hidden; /* 隐藏超出部分 */
  position: relative; /* 让 ::after 相对于父元素定位 */
}
.multi-line::after {
  content: "..."; /* 显示省略号 */
  position: absolute; /* 相对于父元素定位 */
  bottom: 0;
  right: 0;
  padding-left: 10px; /* 留出省略号的宽度 */
  background-color: #fff; /* 遮盖被截断的文字 */
}
```
# 订阅发布
```js
class EventEmitter {
  constructor() {
    // 存储事件及其对应的回调函数
    this.events = new Map();
  }

  // 绑定事件和回调函数
  on(event, callback) {
    // 获取事件的回调函数列表
    let callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则创建一个新的回调函数列表
    if (!callbacks) {
      callbacks = [];
      this.events.set(event, callbacks);
    }

    // 将回调函数添加到回调函数列表中
    callbacks.push(callback);
  }

  // 触发事件，执行回调函数
  emit(event, ...args) {
    // 获取事件的回调函数列表
    const callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则不执行任何操作
    if (!callbacks) {
      return;
    }

    // 执行回调函数列表中的所有回调函数，并传入参数
    callbacks.forEach((callback) => {
      callback.apply(this, args);
    });
  }

  // 绑定事件和回调函数，只执行一次
  once(event, callback) {
    // 定义一个新的回调函数，它会在执行一次后被自动移除
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(event, wrapper);
    };

    // 将新的回调函数添加到回调函数列表中，并且确保不会重复执行
    this.on(event, wrapper);
  }

  // 移除事件的所有回调函数，或指定的回调函数
  off(event, callback) {
    // 获取事件的回调函数列表
    const callbacks = this.events.get(event);

    // 如果回调函数列表不存在，则不执行任何操作
    if (!callbacks) {
      return;
    }

    // 如果没有指定回调函数，则移除事件的所有回调函数
    if (!callback) {
      this.events.delete(event);
      return;
    }

    // 移除指定的回调函数
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }
}

```
















