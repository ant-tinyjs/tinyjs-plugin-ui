import InputBase from './InputBase';
import Label from './Label';
import NinePatch from './NinePatch';

/**
 * Toast 组件
 *
 * @example
 * var toast = new Tiny.ui.Toast(mainContainer, 3000);
 * toast.show('123');
 *
 * @class
 * @extends Tiny.ui.InputBase
 * @memberof Tiny.ui
 * @version 0.1.0
 */

class Toast extends InputBase {
  /**
   * @param {Tiny.Application} app - Tiny.Application的实例
   * @param {Number} [autoHideTime=2000] - 自动隐藏时间，单位为毫秒，不传默认为2000ms
   */
  constructor(app, autoHideTime) {
    super();

    this.stage = app && app.stage || null; //eslint-disable-line
    this.autoHideTime = autoHideTime || 2000;

    //constant
    this.DPI = Tiny.config.dpi;
    this.PADDING = 20 * this.DPI;
    this.CONTENT_FONTSIZE = 16 * this.DPI;
    this.MIN_HEIGHT = 20 * this.DPI;
    this.MAX_WIDTH = Tiny.WIN_SIZE.width * 0.4;
    this.MIN_WIDTH = Tiny.WIN_SIZE.width * 0.3;

    this.bindEvent();
  }

  bindEvent() {
    this.on('pointerdown', (e) => {
      this.stage && this.stage.removeChild(this);
    });
  };

  render(text) {
    this.removeChildren(0, this.children.length);
    //渲染label
    this.label = this.drawLabel(text);

    //渲染矩形框
    this.roundRect = this.drawRoundRect();

    this.updatePosition();
  };

  drawLabel(text) {
    const label = new Label({
      text,
      fill: '0xffffff',
      fontSize: this.CONTENT_FONTSIZE,
      width: this.MAX_WIDTH,
    });
    this.addChild(label);

    return label;
  };

  drawRoundRect() {
    const { width, height } = this.getLocalBounds();
    const finalHeight = height > this.MIN_HEIGHT && height + this.PADDING || this.MIN_HEIGHT + this.PADDING; //eslint-disable-line
    let finalWidth = this.PADDING;
    if (width > this.MAX_WIDTH) {
      finalWidth += this.MAX_WIDTH;
    } else if (width < this.MIN_WIDTH) {
      finalWidth += this.MIN_WIDTH;
    } else {
      finalWidth += width;
    }

    const sprite = new NinePatch(
      Tiny.Sprite.fromImage(this.setting.roundRectBase64_black75).texture,
      finalWidth,
      finalHeight,
      [10, 10, 1, 1],
      0
    );
    this.addChild(sprite);

    return sprite;
  };

  updatePosition() {
    const { width, height } = this.roundRect;
    const win = Tiny.WIN_SIZE;
    this.label.setPosition(width / 2 - this.label.width / 2, height / 2 - this.label.height / 2);
    this.setChildIndex(this.label, 1);
    this.setPosition(win.width / 2 - width / 2, win.height / 2 - height / 2);
  };

  /**
   * 弹出框的弹出方法，调用后才能弹出。
   * 调用时可以弹出不同的文案，同时执行不同的回调函数
   *
   * @param {string} text - 弹出的文案
   */
  show(text) {
    if (this.stage) {
      this.stage.removeChild(this);
      this.render(text);
      this.stage.addChild(this);

      const cd = new Tiny.ticker.CountDown({
        duration: this.autoHideTime,
        times: 1,
      });
      cd.on('complete', (t) => {
        this.stage.children.length && this.stage.removeChild(this);
        cd.destroy();
      });
      cd.start();
    }
  }
}

export default Toast;
