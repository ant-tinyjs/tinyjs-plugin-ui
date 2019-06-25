/**
 * ImageNumber 组件
 *
 * @description
 * 可以通过传入图片来拼接出数字
 *
 * @example
 * // 使用 Tiny.loaders.Loader 将相关资源加载后
 * var numberObj = {};
 *
 * for (var i = 0; i < 10; i++) {
 *   numberObj[i] = Tiny.TextureCache['https://gw.alipayobjects.com/os/lib/alipay/tiny-resources/1.0.2/dist/images/snumber/s' + i + '.png'];
 * }
 *
 * var number = new Tiny.ui.ImageNumber(numberObj);
 * var numberUI = number.create('1234567890');
 *
 * numberUI.setPositionY(120);
 * this.addChild(numberUI);
 *
 * @example
 * // 当然，我们推荐使用 tileset，更方便，更安心
 * var loader = new Tiny.loaders.Loader();
 * loader
 *  .add(['res/tileset-number.json'])
 *  .load(function() {
 *    var numberObj = {};
 *
 *    for (var i = 0; i < 10; i++) {
 *      numberObj[i] = Tiny.TextureCache['tileset-number-' + i + '.png'];
 *    }
 *
 *    var number = new Tiny.ui.ImageNumber(numberObj);
 *    var numberUI = number.create('31415926');
 *  });
 *
 * @class
 * @memberof Tiny.ui
 */
class ImageNumber {
  /**
   *
   * @param {object} matchup - 字符和 Texture 的对应关系对象
   */
  constructor(matchup) {
    this.matchup = matchup;
  }

  /**
   * 创建 ImageNumber 的 UI 对象
   *
   * @param {string} string - 字符
   * @param {Tiny.Container} container - 可选，包裹的容器
   */
  create(string = '', container = new Tiny.Container()) {
    const arr = string.split('');
    const matchup = this.matchup;
    let totalWidth = 0;

    arr.forEach(item => {
      const texture = matchup[item];

      if (texture) {
        const sprite = new Tiny.Sprite(matchup[item]);
        let { width } = texture;

        sprite.setPositionX(totalWidth);
        totalWidth += width;
        container.addChild(sprite);
      }
    });

    this.container = container;

    return container;
  }

  /**
   * 更新字符
   *
   * @example
   * var number = new Tiny.ui.ImageNumber({...});
   * var numberUI = number.create('1234567890');
   *
   * number.update('666');
   *
   * var numberUI2 = number.create('31415926');
   * number.update('999', numberUI2);
   *
   * @param {string} string - 更新的字符
   * @param {Tiny.Container} container - 可选，不传会使用 create 创建的 Container 对象
   */
  update(string = '', container) {
    if (!container) {
      if (this.container) {
        container = this.container;
      } else {
        container = new Tiny.Container();
      }
    }
    container.removeChildren();
    this.create.call(this, string, container); //eslint-disable-line

    return container;
  }
}

export default ImageNumber;
