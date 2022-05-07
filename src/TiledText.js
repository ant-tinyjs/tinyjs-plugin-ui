/**
 * TiledText 组件
 *
 * @description
 * 使用一个离屏 Canvas 绘制所有的相同样式、单行的文字，相对来说更省内存，对小程序的文本更友好
 *
 * @example
 * const tiledText = new Tiny.ui.TiledText(container, {
 *   fontSize: 32,
 *   fontFamily: 'Arial',
 *   fill: '#ffffff',
 * });
 *
 * const txt = tiledText.create('你好，世界');
 * const txt2 = tiledText.create('你好，人类');
 *
 * container.addChild(txt, txt2);
 *
 * @example
 * // 文字的更新
 * txt.updateText(`当前时间：${new Date().getTime()}`);
 *
 * @class
 * @memberof Tiny.ui
 */
class TiledText {
  /**
   *
   * @param {Tiny.Container} container
   * @param {object|Tiny.TextStyle} [style]
   * @param {HTMLCanvasElement} [canvas]
   * @param {number} [num=30] - 默认行数，可认为是单个 TiledText 示例允许创建的最大值
   */
  constructor(container, style, canvas, num = 30) {
    this.texts = Array.apply(null, Array(num)).map(() => ' ');
    this.container = container;

    this.length = num;
    this.count = 0;
    this.sprites = [];

    this.textInstance = new Tiny.Text(this.texts.join('\n'), style, canvas);
    this.textInstance.setPositionX(Tiny.WIN_SIZE.width);
    this.textInstance.renderable = false;

    container.addChild(this.textInstance);
  }

  /**
   * 创建 TiledText 的 UI 对象
   *
   * @param {string} text
   * @return {Tiny.Sprite}
   */
  create(text) {
    const { count, length } = this;

    if (count > length) {
      throw new RangeError(`你创建的个数已超过预设值：${length}`);
    }

    this.count++;
    this.texts[count] = text;

    const texture = this._generateTexture(text, count);
    const sprite = new Tiny.Sprite(texture);

    this.sprites.push(sprite);
    this._update();

    sprite.textIndex = count;
    sprite.updateText = (text) => {
      this._updateText(text, sprite);
      this._update();
    };

    return sprite;
  }

  _update() {
    this.sprites.forEach(sprite => {
      sprite.texture.updateUvs();
    });
  }

  _generateTexture(text, count) {
    const { length, textInstance } = this;

    textInstance.text = this.texts.join('\n');

    const { baseTexture } = textInstance.texture;
    const { width, height } = textInstance;
    const lineHeight = height / length;
    const y = lineHeight * count;
    const texture = new Tiny.Texture(baseTexture, new Tiny.Rectangle(0, y, width, lineHeight));

    return texture;
  }

  _updateText(text, sprite) {
    const { textIndex } = sprite;

    this.texts[textIndex] = text;

    const newTexture = this._generateTexture(text, textIndex);

    sprite.texture = newTexture;
  }
}

export default TiledText;
