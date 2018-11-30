import InputBase from './InputBase';
import Label from './Label';
import Button from './Button';
import NinePatch from './NinePatch';

/**
 * Alert 组件
 *
 * @example
 * var tinyAlert = new Tiny.ui.Alert(mainContainer, buttonText);
 * tinyAlert.alert('123', function() {
 *    // your code here
 * });
 *
 * @class
 * @extends Tiny.ui.InputBase
 * @memberof Tiny.ui
 * @version 0.1.0
 */

class Alert extends InputBase {
  /**
   * @param {Tiny.Application} app - Tiny.Application的实例
   * @param {string} buttonText - 弹框的按钮文案，不传则为’关闭‘
   */
  constructor(app, buttonText) {
    super();

    this.stage = app && app.stage || null; //eslint-disable-line
    this.buttonText = buttonText || '关闭';

    //constant
    this.DPI = Tiny.config.dpi;
    this.PADDING = 40 * this.DPI;
    this.CONTENT_FONTSIZE = 16 * this.DPI;
    this.BTN_FONTSIZE = 14 * this.DPI;
    this.MIN_HEIGHT = 50 * this.DPI;
    this.MAX_WIDTH = Tiny.WIN_SIZE.width * 0.8;
  }

  render(text) {
    this.removeChildren(0, this.children.length);
    //渲染label
    this.label = this.drawLabel(text);

    //渲染矩形框
    this.roundRect = this.drawRoundRect();

    //渲染按钮
    this.btn = this.drawButton();

    this.updatePosition();
  };

  drawLabel(text) {
    const label = new Label({
      text,
      fill: '0x333333',
      fontSize: this.CONTENT_FONTSIZE,
      width: this.MAX_WIDTH - this.PADDING,
    });
    this.addChild(label);

    return label;
  };

  drawRoundRect() {
    const { height } = this.getLocalBounds();
    const finalHeight = height > this.MIN_HEIGHT && height + this.PADDING || this.MIN_HEIGHT + this.PADDING; //eslint-disable-line
    const baseTexture = Tiny.BaseTexture.from(this.setting.roundRectBase64_white);
    const texture = new Tiny.Texture(baseTexture);
    const sprite = new NinePatch(
      texture,
      this.MAX_WIDTH,
      finalHeight,
      [10, 10, 1, 1]
    );
    Tiny.BaseTexture.removeFromCache(baseTexture);
    this.addChild(sprite);

    return sprite;
  };

  drawButton() {
    const btn = new Button({
      text: this.buttonText,
      textStyle: {
        fill: '0x108EE9',
        fontSize: this.BTN_FONTSIZE,
      },
      active: {
        opacity: 0.5,
        callback: () => {
          this.stage && this.stage.removeChild(this);
          this.callback && this.callback();
        },
      },
    });

    this.addChild(btn);

    return btn;
  };

  updatePosition() {
    const { width, height } = this.roundRect;
    const win = Tiny.WIN_SIZE;
    this.btn.setPosition(this.MAX_WIDTH - this.btn.width, height - this.btn.height);
    this.label.setPosition(this.MAX_WIDTH / 2 - this.label.width / 2, height / 2 - this.label.height / 2 - 5 * this.DPI);
    this.setChildIndex(this.label, 1);
    this.setPosition(win.width / 2 - width / 2, win.height / 2 - height / 2);
  };

  /**
   * 弹出框的弹出方法，调用后才能弹出。
   * 调用时可以弹出不同的文案，同时执行不同的回调函数
   *
   * @param {string} text - 弹出的文案
   * @param {function} callback - 点击弹出框按钮时的回调函数
   */
  alert(text, callback) {
    if (this.stage) {
      this.stage.removeChild(this);
      this.render(text);
      this.stage.addChild(this);
      this.callback = callback;
    }
  }
}

export default Alert;
