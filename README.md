# tinyjs-plugin-ui

> Tiny.js UI plugin

## 查看demo

`demo/index.html`

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-ui --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-ui/0.0.1/index.js
  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-ui/0.0.1/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="https://gw.alipayobjects.com/as/g/tiny/tiny/1.1.4/tiny.js"></script>
```
``` js
var ui = require('tinyjs-plugin-ui');
// 或者
// import ui from 'tinyjs-plugin-ui';

var container = new Tiny.Container();
var btn = new ui.Button({
  text: 'Hello, Tiny.js',
  height: 100,
  width: 200,
  textPosition: 5,
  textStyle: {
    fill: 'white',
  },
  active: {
    scale: Tiny.scale(1.2, 1.1),
    callback: function () {
      console.log('you tap btn1');
    }
  }
});
container.addChild(btn);
```

##### 2. 使用 Tiny.ui.DOM

```
// 写一段 HTML
var html =
  '<div style="font-size:40px;color:#fff;">' +
  ' I<em> am </em><span style="color:gold;text-shadow:0 0 2px red;">Tiny.js</span><br/>你好，<b style="color:gold;text-shadow:1px 5px 5px orangered;">中国</b>' +
  '</div>';
// 用上面的那段 HTML 生成 DOM 显示对象
var dom = new Tiny.ui.DOM({
 html: html,
});
var container = new Tiny.Container();
// 将实例化的 dom 直接添加到显示容器中
container.addChild(dom);
```

## 依赖
- `Tiny.js`: [Link](http://tinyjs.net/#/docs/api)
