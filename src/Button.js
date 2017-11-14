import InputBase from './InputBase';

/**
 * Button 组件
 *
 * @example
 *
 * var container = new Tiny.Container();
 * var btn = new Tiny.ui.Button({
 *   background: 'https://zos.alipayobjects.com/rmsportal/YJlpCuekebvKNap.png',
 *   active: {
 *     background: 'https://zos.alipayobjects.com/rmsportal/YlmEZzXVdAYauZFEjmrlaevYsBBHqQcx.png',
 *     scale: Tiny.scale(1.2, 1.2), // 或 scale: 1.2
 *     callback: function () {
 *       console.log('you tap btn');
 *     }
 *   }
 * });
 * container.addChild(btn);
 *
 * @class
 * @extends Tiny.ui.InputBase
 * @memberof Tiny.ui
 */
class Button extends InputBase {
  /**
   *
   * @param {object}              options
   * @param {string}              options.width               - 宽，不传使用背景图片的宽
   * @param {string}              options.height              - 高，不传使用背景图片的高
   * @param {Tiny.Sprite|string}  options.background          - 背景图片，不传即透明背景
   * @param {object}              options.active
   * @param {Tiny.Sprite|string}  options.active.background   - 点击后的背景图片
   * @param {number}              options.active.opacity      - 点击后设置透明效果
   * @param {number|object}       options.active.scale        - 点击后设置缩放效果
   * @param {function}            options.active.callback     - 点击后的回调
   * @param {Tiny.Text|string}    options.text                - 文本
   * @param {Tiny.textStyle}      options.textStyle           - 文本样式
   * @param {number}              options.textPosition=5      - 文本位置
   */
  constructor(options) {
    super();

    Object.assign(this.setting, options);

    const self = this;
    const active = this.setting.active;
    let text = this.setting.text || '';
    let background = this.setting.background;
    let activeBackground = active.background;
    let backgroundTexture;
    let thisOpacity;
    let thisScaleX;
    let thisScaleY;
    let activeBackgroundTexture;


    if (Tiny.isUndefined(background)) {
      background = this.setting.blankBase64;
    }

    if (Tiny.isString(background)) {
      const baseTexture = Tiny.BaseTexture.from(background);
      const texture = new Tiny.Texture(baseTexture);
      background = new Tiny.Sprite(texture);
      Tiny.BaseTexture.removeFromCache(baseTexture);
    }

    backgroundTexture = background.texture;
    thisOpacity = this.getOpacity();
    thisScaleX = this.getScale().x;
    thisScaleY = this.getScale().y;

    if (Tiny.isString(activeBackground)) {
      const baseTexture = Tiny.BaseTexture.from(activeBackground);
      activeBackgroundTexture = new Tiny.Texture(baseTexture);
      Tiny.BaseTexture.removeFromCache(baseTexture);
    }

    this.addChild(background);

    if (Tiny.isString(text)) {
      text = new Tiny.Text(text, this.setting.textStyle);
    }
    this.addChild(text);

    background.texture.on('update', () => {
      this.updatePosition();
      self.emit('rendered');
    });

    this.text = text;
    this.background = background;
    this.buttonMode = true;

    let leaveHandler = function () {
      if (activeBackgroundTexture) {
        background.texture = backgroundTexture;
      }
      if (active.opacity) {
        self.setOpacity(thisOpacity);
      }
      if (active.scale) {
        self.setScale(thisScaleX, thisScaleY);
      }
    };
    let clickHandler = function (e) {
      if (Tiny.isFunction(active.callback)) {
        active.callback(e);
      }
    };
    // touchdown
    this.on('pointerdown', function (e) {
      if (activeBackgroundTexture) {
        background.texture = activeBackgroundTexture;
      }
      if (active.opacity) {
        self.setOpacity(active.opacity);
      }
      if (active.scale) {
        let scale = active.scale;
        if (Tiny.isNumber(scale)) {
          scale = {
            scaleX: scale,
            scaleY: scale,
          };
        }
        self.setScale(scale.scaleX, scale.scaleY);
      }
    });

    // touchup
    this.on('pointerup', leaveHandler);

    // touchmove
    this.on('pointermove', function (e) {
    });

    // touchcancel
    this.on('pointerupoutside', leaveHandler);

    this.on('click', clickHandler);
    this.on('tap', clickHandler);
  }

  /**
   * 更新文本位置
   *
   * @param {number} textPosition - 文本位置，不传沿用初始化时的值
   */
  updatePosition(textPosition) {
    let x, y;
    let width = ~~this.setting.width;
    let height = ~~this.setting.height;
    let textPos = textPosition || this.setting.textPosition;
    this.background.width = width || this.background.texture.width;
    this.background.height = height || this.background.texture.height;
    const offsetW = this.background.width - this.text.width;
    const offsetH = this.background.height - this.text.height;

    switch (textPos) {
      case 1:
        x = 0;
        y = 0;
        break;
      case 2:
        x = offsetW / 2;
        y = 0;
        break;
      case 3:
        x = offsetW;
        y = 0;
        break;
      case 4:
        x = 0;
        y = offsetH / 2;
        break;
      case 6:
        x = offsetW;
        y = offsetH / 2;
        break;
      case 7:
        x = 0;
        y = offsetH;
        break;
      case 8:
        x = offsetW / 2;
        y = offsetH;
        break;
      case 9:
        x = offsetW;
        y = offsetH;
        break;
      default:
        x = offsetW / 2;
        y = offsetH / 2;
    }
    this.text.setPosition(x, y);
    // console.log('position is updated.');
  }

  /**
   * 按钮的值（即文本）
   *
   * @example
   *
   * var button = new Tiny.ui.Button({
   *  text: 'Hello, Tiny.js'
   * });
   * console.log(button.value);
   * //=> Hello, Tiny.js
   *
   * button.value = '你好，Tiny.js'
   * console.log(button.value);
   * //=> 你好，Tiny.js
   *
   * @member {string}
   */
  get value() {
    return this.text.text;
  }

  set value(val) {
    if (this.text) {
      this.text.text = val;
      this.updatePosition();
    }
  }
}
export default Button;
