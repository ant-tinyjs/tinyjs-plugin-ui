import InputBase from './InputBase';
import Label from './Label';
import Button from './Button';
import NinePatch from './NinePatch';

/**
 * Toast 组件
 *
 * @example
 *
 * var toast = new Tiny.ui.Toast(mainContainer, 3000);
 * toast.show('123');
 *
 * @class
 * @extends Tiny.ui.InputBase
 * @memberof Tiny.ui
 */

class Toast extends InputBase {
  /**
   * @param {Tiny.Container}      mainContainer            - Application的主容器，相当于舞台的根容器
   * @param {Number}              autoHideTime             - 自动隐藏时间，单位为毫秒，不传默认为2000ms
   */
  constructor(mainContainer, autoHideTime) {
    super();

    this.mainContainer = mainContainer;
    this.autoHideTime = autoHideTime || 2000;

    //constant
    this.DPI = window.devicePixelRatio;
    this.PADDING = 20 * this.DPI;
    this.CONTENT_FONTSIZE = 16 * this.DPI;
    this.MIN_HEIGHT = 25 * this.DPI;
    this.MAX_WIDTH = Tiny.WIN_SIZE.width * 0.4;
    this.MIN_WIDTH = Tiny.WIN_SIZE.width * 0.3;

    this.bindEvent();
  }

  bindEvent = () => {
    this.on('pointerdown', e => {
      this.mainContainer.removeChild(this);
    });
  };

  render = (text) => {
    this.removeChildren(0, this.children.length);
    //渲染label
    this.label = this.drawLabel(text);

    //渲染矩形框
    this.roundRect = this.drawRoundRect();

    this.updatePosition();
  };

  drawLabel = (text) => {
    const label = new Label({
      text,
      fill: '0xffffff',
      fontSize: this.CONTENT_FONTSIZE,
      width: this.MAX_WIDTH
    });
    this.addChild(label);

    return label;
  };

  drawRoundRect = () => {
    const {width, height} = this.getLocalBounds();
    const finalHeight =  height > this.MIN_HEIGHT && height + this.PADDING || this.MIN_HEIGHT + this.PADDING;
    let finalWidth = this.PADDING;
    console.log(width, this.MAX_WIDTH, this.MIN_WIDTH);
    if(width > this.MAX_WIDTH) {
      finalWidth += this.MAX_WIDTH;
    } else if(width < this.MIN_WIDTH) {
      finalWidth += this.MIN_WIDTH;
    } else {
      finalWidth += width;
    }

    const sprite = new NinePatch(
      Tiny.Sprite.fromImage(this.setting.roundRectBase64_black75).texture,
      finalWidth,
      finalHeight,
      [10, 10, 1, 1]
    );
    this.addChild(sprite);

    return sprite;
  };

  updatePosition = () => {
    const {width, height} = this.getLocalBounds();
    const win = Tiny.WIN_SIZE;
    this.label.setPosition(width / 2 - this.label.width / 2, height / 2 - this.label.height / 2);
    this.setChildIndex(this.label, 1);
    this.setPosition(win.width / 2 - width / 2, win.height / 2 - height / 2)
  };

  /**
   * 弹出框的弹出方法，调用后才能弹出。
   * 调用时可以弹出不同的文案，同时执行不同的回调函数
   *
   * @param {string}         text           - 弹出的文案
   */
  show = (text) => {
    if(this.mainContainer) {
      this.mainContainer.removeChild(this);
      this.render(text);
      this.mainContainer.addChild(this);

      Tiny.ticker.shared.countDown({
        duration: this.autoHideTime,
        times: 1,
        complete: () => {
          this.mainContainer.children.length && this.mainContainer.removeChild(this);
        }
      });
    }
  }
}

export default Toast;
