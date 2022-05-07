import InputBase from './InputBase';

/**
 * Label 组件
 *
 * @example
 * var container = new Tiny.Container();
 * var label = new Tiny.ui.Label({
 *   text: 'tiny.js',
 *   fill: '0xFF8C00',
 *   fontSize: 30,
 * });
 * container.addChild(label);
 *
 * @class
 * @extends Tiny.ui.InputBase
 * @memberof Tiny.ui
 * @version 0.1.0
 */
class Label extends InputBase {
  /**
   *
   * @param {object} options
   * @param {number} [options.width] - 宽，不传则根据文字长短自动宽度，且不会根据宽度自动断行
   * @param {number} [options.height] - 高，不传则根据文字长短自动高度，且不会根据高度裁切文字
   * @param {Tiny.Text|string} [options.text] - 文本，默认空字符串
   * @param {Tiny.textStyle} [options.*] - 文本样式(http://tinyjs.net/#/docs/api)
   */
  constructor(options) {
    super();
    this.defaultSetting = {
      text: '',
      width: 0,
      height: 0,
    };

    this.settings = Object.assign({}, this.defaultSetting, options || {});

    this.__render();
  }

  __render() {
    const {
      text,
      width,
      height,
      // 排除用户自定义截断，导致样式不正确
      wordWrap, // eslint-disable-line
      breakWords, // eslint-disable-line
      wordWrapWidth, // eslint-disable-line
      ...others // eslint-disable-line
    } = this.settings;

    const opt = {
      wordWrap: width && true || false, //eslint-disable-line
      breakWords: width && true || false, //eslint-disable-line
      wordWrapWidth: width,
      ...others,
    };
    this.text = new Tiny.Text(text, opt);

    //绘制遮罩，超出指定高度时裁剪label
    if (height && width) {
      const mask = new Tiny.Graphics();
      mask.lineStyle(0);
      mask.beginFill(0xFFFFFF);
      mask.drawRect(0, 0, width, height);
      mask.endFill();
      this.mask = mask;
    }
    this.addChild(this.text);
  }
}

export default Label;
