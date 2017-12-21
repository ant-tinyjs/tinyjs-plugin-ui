# tinyjs-plugin-ui

> Tiny.js UI plugin

## 查看demo

http://tinyjs.net/#/plugins/tinyjs-plugin-ui/demo

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-ui --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://gw.alipayobjects.com/as/g/tiny-plugins/tinyjs-plugin-ui/0.0.2/index.js
  - https://gw.alipayobjects.com/as/g/tiny-plugins/tinyjs-plugin-ui/0.0.2/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="https://gw.alipayobjects.com/as/g/tiny/tiny/1.1.5/tiny.js"></script>
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

注意：
<ul>
<li>由于安全策略，ui.DOM 的渲染模式只支持 canvas，如果要用，需要将固定设置启动参数 `renderType` 为 `Tiny.RENDERER_TYPE.CANVAS`</li>
<li>由于浏览器渲染机制问题，在Safari下，<a href="http://tinyjs.net/#/plugins/tinyjs-plugin-tiling/docs">tinyjs-plugin-tiling</a>插件中的 `TilingSprite` 类会影响到 ui.DOM 的背景，可以通过添加顺序来规避（即后添加 `TilingSprite` 实例化显示对象），可以看看 demo 下的 "DOM & TilingSprite" 例子。</li>
</ul>

```
// 写一段 HTML
var html =
  '<div style="font-size:40px;color:#fff;">' +
  ' I<em> am </em><span style="color:gold;text-shadow:0 0 2px red;">Tiny.js</span><br/>你好，<b style="color:gold;text-shadow:1px 5px 5px orangered;">中国</b>' +
  '</div>';
var dom;
try {
  // 用上面的那段 HTML 生成 DOM 显示对象
  dom = new Tiny.ui.DOM({
   html: html,
  });
}catch(e){
  // 不支持的设备会报错，此时降级使用普通文本或使用图片
  dom = new Tiny.Text('Tiny.js\n你好，中国');
}
var container = new Tiny.Container();
// 将实例化的 dom 直接添加到显示容器中
container.addChild(dom);
```

## 依赖
- `Tiny.js`: [Link](http://tinyjs.net/#/docs/api)

## API文档

http://tinyjs.net/#/plugins/tinyjs-plugin-ui/docs
