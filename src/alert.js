import InputBase from './InputBase';
import Label from './Label';
import Button from './Button';

/**
 * Alert 组件
 *
 * @example
 *
 * var tinyAlert = new Tiny.ui.Alert(mainContainer, buttonText);
 * tinyAlert.alert('123', function() {
 *    your code here
 * });
 *
 * @class
 * @extends Tiny.ui.InputBase
 * @memberof Tiny.ui
 */

class Alert extends InputBase {
  /**
   * @param {Tiny.Container}      parentLayer              - Application的主容器，相当于舞台的根容器
   * @param {string}              buttonText               - 弹框的按钮文案，不传则为’关闭‘
   */
  constructor(parentLayer, buttonText) {
    super();

    this.parentLayer = parentLayer;
    this.buttonText = buttonText;

    //constant
    this.DPI = window.devicePixelRatio;
    this.PADDING = 40 * this.DPI;
    this.CONTENT_FONTSIZE = 16 * this.DPI;
    this.BTN_FONTSIZE = 14 * this.DPI;
    this.MIN_HEIGHT = 50 * this.DPI;
    this.MAX_WIDTH = Tiny.WIN_SIZE.width * 0.8;
  }

  render = (text) => {
    this.removeChildren(0, this.children.length);
    //渲染label
    this.label = this.drawLabel(text);

    //渲染矩形框
    this.roundRect = this.drawRoundRect();

    //渲染按钮
    this.btn = this.drawButton();

    this.updatePosition();
  };

  drawLabel = (text) => {
    const label = new Label({
      text,
      fill: '0x000000',
      fontSize: this.CONTENT_FONTSIZE,
      width: this.MAX_WIDTH - this.PADDING
    });
    this.addChild(label);

    return label;
  };

  drawRoundRect = () => {
    const fixedPadding = 15 * this.DPI;
    const {height} = this.getLocalBounds();
    const graphics = new Tiny.Graphics();
    const finalHeight =  height > this.MIN_HEIGHT && height + this.PADDING || this.MIN_HEIGHT + this.PADDING;
    graphics.lineStyle(0);
    graphics.beginFill('0xffffff');
    graphics.drawRoundedRect(0, 0, this.MAX_WIDTH, finalHeight);
    graphics.endFill();
    this.addChild(graphics);

    return graphics;
  };

  drawButton = () => {
    const btn = new Button({
      text: this.buttonText || '关闭',
      textStyle: {
        fill: '0x108EE9',
        fontSize: this.BTN_FONTSIZE
      },
      active: {
        opacity: .5,
        callback: () => {
          this.parent.removeChild(this);
          this.callback && this.callback();
        }
      }
    });

    this.addChild(btn);

    return btn;
  };

  updatePosition = () => {
    const {width, height} = this.roundRect.getLocalBounds();
    const win = Tiny.WIN_SIZE;
    this.btn.setPosition(this.MAX_WIDTH - this.btn.width, height - this.btn.height);
    this.label.setPosition(this.MAX_WIDTH / 2 - this.label.width / 2, height / 2 - this.label.height / 2 - 5 * this.DPI);
    this.setChildIndex(this.label, 1);
    this.setPosition(win.width / 2 - width / 2, win.height / 2 - height / 2)
  };

  /**
   * 弹出框的弹出方法，调用后才能弹出。
   * 调用时可以弹出不同的文案，同时执行不同的回调函数
   *
   * @param {string}         parentLayer           - Application的主容器，相当于舞台的根容器
   * @param {function}       callback              - 点击弹出框按钮时的回调函数
   */
  alert = (text, callback) => {
    if(this.parentLayer) {
      this.render(text);
      this.parentLayer.removeChild(this);
      this.parentLayer.addChild(this);
      this.callback = callback;
    }
  }
}

export default Alert;
