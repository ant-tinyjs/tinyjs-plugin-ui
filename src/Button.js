import InputBase from './InputBase';
import throttle from 'lodash/throttle';

/**
 * Button 组件
 *
 * @example
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
   * @param {object} options
   * @param {string} [options.width] - 宽，不传使用背景图片的宽
   * @param {string} [options.height] - 高，不传使用背景图片的高
   * @param {Tiny.Sprite|Tiny.Graphics|string} [options.background] - 背景图片，不传即透明背景
   * @param {object} [options.active]
   * @param {Tiny.Sprite|string} [options.active.background] - 点击后的背景图片
   * @param {number} [options.active.opacity] - 点击后设置透明效果
   * @param {number|object} [options.active.scale] - 点击后设置缩放效果
   * @param {function} [options.active.callback] - 点击后的回调
   * @param {Tiny.Text|string} [options.text] - 文本
   * @param {Tiny.textStyle} [options.textStyle] - 文本样式
   * @param {number} [options.textPosition=5] - 文本位置
   * @param {boolean} [options.improveScrollExperience] - 是否支持滚动优化，在搭配 Scroller 插件使用时，设置为 true 的话可以优化滚动时触发点击的体验
   */
  constructor(options) {
    super();

    Object.assign(this.setting, options);

    const active = this.setting.active;
    let text = this.setting.text || '';
    let background = this.setting.background;
    const activeBackground = active.background;
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

    this.text = text;
    this.background = background;
    this.buttonMode = true;

    if (
      background instanceof Tiny.Graphics ||
      background.texture.baseTexture.hasLoaded
    ) {
      this.updatePosition();
    } else {
      background.texture.on('update', () => {
        this.updatePosition();
        this.emit('rendered');
      });
    }

    this.bindEvent(active, activeBackgroundTexture);
  }

  bindEvent(active, activeBackgroundTexture) {
    const { improveScrollExperience } = this.setting;
    const background = this.background;
    const backgroundTexture = background.texture;
    const thisOpacity = this.getOpacity();
    const thisScaleX = this.getScale().x;
    const thisScaleY = this.getScale().y;
    const leaveHandler = () => {
      if (activeBackgroundTexture) {
        background.texture = backgroundTexture;
      }
      if (active.opacity) {
        this.setOpacity(thisOpacity);
      }
      if (active.scale) {
        this.setScale(thisScaleX, thisScaleY);
      }
    };

    this.on('pointerdown', (e) => {
      if (activeBackgroundTexture) {
        background.texture = activeBackgroundTexture;
      }
      if (active.opacity) {
        this.setOpacity(active.opacity);
      }
      if (active.scale) {
        let scale = active.scale;

        if (Tiny.isNumber(scale)) {
          scale = {
            scaleX: scale,
            scaleY: scale,
          };
        }
        this.setScale(scale.scaleX, scale.scaleY);
      }
    });
    this.on('pointerup', leaveHandler);
    this.on('pointermove', function(e) {});
    this.on('pointerupoutside', leaveHandler);

    if (improveScrollExperience) {
      let initialX = null;
      let initialY = null;
      let lastX = null;
      let lastY = null;
      let blockEvent = null;
      const maxDistance = 20;
      const reset = () => {
        lastX = null;
        lastY = null;
        initialX = null;
        initialY = null;
        blockEvent = null;
      };
      const startup = (e) => {
        const { x, y } = e.data.global;

        initialX = lastX = x;
        initialY = lastY = y;
        blockEvent = false;
      };
      const relay = throttle((e) => {
        const { x, y } = e.data.global;
        const disFromInitial = Math.sqrt((initialX - x) * (initialX - x) + (initialY - y) * (initialY - y));
        const disFromLast = Math.sqrt((lastX - x) * (lastX - x) + (lastY - y) * (lastY - y));

        lastX = x;
        lastY = y;

        if ((disFromInitial > maxDistance) || (disFromLast > maxDistance)) {
          blockEvent = true;
        }
      }, 30);
      const release = (callback) => {
        if (blockEvent === false) callback();
        reset();
      };

      this.on('pointerdown', startup);
      this.on('pointermove', relay);
      this.on('pointerupoutside', reset);
      this.on('pointerup', (e) => {
        e.data.originalEvent.preventDefault();
        release(() => {
          if (Tiny.isFunction(active.callback)) {
            active.callback(e);
          }
        });
      });
    } else {
      const clickHandler = throttle((e) => {
        e.data.originalEvent.preventDefault();

        if (Tiny.isFunction(active.callback)) {
          active.callback(e);
        }
      }, 500, { trailing: false });

      this.on('pointerup', clickHandler);
    }
  }

  /**
   * 更新文本位置
   *
   * @param {number} textPosition - 文本位置，不传沿用初始化时的值
   */
  updatePosition(textPosition) {
    let x, y;
    const width = ~~this.setting.width;
    const height = ~~this.setting.height;
    const textPos = textPosition || this.setting.textPosition;

    if (!(this.background instanceof Tiny.Graphics)) {
      this.background.width = width || this.background.texture.width;
      this.background.height = height || this.background.texture.height;
    }

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
