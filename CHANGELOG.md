## 0.7.2

`2021-04-14`

### Fixed
- 修复 NinePatch 使用 tileset 纹理错位的问题

## 0.7.1

`2020-12-25`

### Fixed
- 修复 loader 后 Button 的 `textPosition` 无效的 bug


## 0.7.0

`2020-12-22`

### Added
- Button 组件添加 `improveScrollExperience` 参数，在搭配 Scroller 插件时，可以优化滚动时触发点击的体验

## 0.6.0

`2020-11-02`

### Added
- 新增 `InlineItems`，可以在一行布局多个显示对象

## 0.5.0

`2020-07-03`

### Added
- 新增 `tiledText`，对于相同样式、单行文本可以更省内存

## 0.4.1

`2020-01-13`

### Fixed
- 修复 `NinePatch` 设置 `overlapPadding` 为 0 时无效的问题

## 0.4.0

`2019-12-24`

- TinyX 环境更改全局挂载对象为 $global，不再使用 my

## 0.3.0

`2019-06-25`
- 可以使用 `ui.ImageNumber` 创建图片数字或文字，适用于自定义样式的文字

## 0.2.2

`2019-05-30`
- `ui.DOM` 支持设置 svg 的 `defs`，可以用于装载自定义字体

## 0.2.1

`2019-01-28`
- 在设置启动参数 `viewTouched` 时 `Button` 的 click 与 tap 事件的重复调用

## 0.2.0

`2018-11-30`
- 构建方式从 webpack@1.* 换成 rollup

## 0.1.5

`2018-04-16`

- 修复 `NinePatch` 升级后导致使用透明图片出现细线问题。

## 0.1.3 - 0.1.4

`2018-04-16`

- 升级 `NinePatch` ，修复lint问题

## 0.1.2

`2018-04-12`

- 替换 `Tiny.ticker.shared.countDown` 为 `Tiny.ticker.CountDown`

## 0.1.1

`2017-12-22`

- 修复 `Alert` 组件多次调用的渲染问题

## 0.1.0

`2017-12-21`

- 增加 `Alert`、`Label`、`Toast`、`NinePatch` 组件

## 0.0.2

`2017-12-12`

