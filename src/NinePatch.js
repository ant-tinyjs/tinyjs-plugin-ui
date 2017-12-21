import UIBase from './UIBase';

/**
 * 九宫格
 *
 * @description
 *
 * <pre>
 * -----------—
 * | 1 | 2 | 3 |
 * -------------
 * | 4 | 5 | 6 |
 * -------------
 * | 7 | 8 | 9 |
 * -------------
 * scale9Grid=[a, b, c, d] 表示：
 * - a：区域1 的宽度值
 * - b：区域1 的高度值
 * - c：区域2 的宽度值，取值范围是 [宽度 < 源图片宽 ? 源图片宽 - 宽度 : 1, 源图片宽 - a]
 * - d：区域4 的高度值，取值范围是 [高度 < 源图片高 ? 源图片高 - 高度 : 1, 源图片高 - b]
 * </pre>
 *
 * @example
 *
 * var np = new Tiny.ui.NinePatch(
 *  Tiny.Texture.fromImage('https://gw.alipayobjects.com/zos/rmsportal/ipdnmCVbXeVBPprGCYlW.png'),
 *  200,
 *  300,
 *  [30, 30, 100, 100]
 * );
 * np.setPosition(10, 10);
 *
 * @class
 * @extends Tiny.ui.UIBase
 * @memberof Tiny.ui
 * @version 0.1.0
 */
class NinePatch extends UIBase {
  /**
   * @constructor
   * @param {Tiny.Texture}      texture     - 九宫格纹理
   * @param {number}            width       - 宽度
   * @param {number}            height      - 高度
   * @param {Array<Number>}     scale9Grid  - 九宫格定义
   */
  constructor(texture, width, height, scale9Grid = [0, 0, 0, 0]) {
    super();

    /**
     * @default 0
     * @private
     */
    this._loaded = 0;

    /**
     * 存储九宫格纹理
     *
     * @private
     */
    this._textures = [];

    /**
     * 存储九宫格 Sprite 对象
     *
     * @private
     */
    this._gridSprites = [];

    /**
     * 真实宽度
     *
     * @private
     */
    this._width = width;

    /**
     * 真实高度
     *
     * @private
     */
    this._height = height;

    const w1 = scale9Grid[0];
    const h1 = scale9Grid[1];
    const w2 = scale9Grid[2];
    const h2 = scale9Grid[3];
    let w3;
    let h3;

    texture.on('update', () => {
      const w = texture.width;
      const h = texture.height;
      this._width = this._width || w;
      this._height = this._height || h;
      w3 = w - w1 - w2;
      h3 = h - h1 - h2;

      const wArr = [w1, w2, w3];
      const xArr = [0, w1, w1 + w2];
      const hArr = [h1, h2, h3];
      const yArr = [0, h1, h1 + h2];
      const rectFrames = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          rectFrames.push(new Tiny.Rectangle(xArr[col], yArr[row], wArr[col], hArr[row]));
        }
      }

      const orig = new Tiny.Rectangle(0, 0, w, h);
      const trim = null;

      this._loaded = 0;

      for (let i = 0; i < 9; i++) {
        const frame = rectFrames[i];
        const t = new Tiny.Texture(
          texture,
          frame,
          orig,
          trim,
          0
        );
        const child = new Tiny.Sprite(t);

        this._textures.push(t);
        this._gridSprites.push(child);
        child.x = frame.x;
        child.y = frame.y;
        child.width = frame.width;
        child.height = frame.height;
        this.addChild(child);
        this._loaded++;
      }

      this._update();
      this.emit('rendered');
    });
  }

  /**
   * 获取宽度
   *
   * @member {number}
   */
  get width() {
    return this._width;
  }

  /**
   * 获取高度
   *
   * @member {number}
   */
  get height() {
    return this._height;
  }

  /**
   * 更改尺寸
   *
   * @param {number} width 宽度
   * @param {number} height 高度
   */
  resize(width, height) {
    width && (this._width = width);
    height && (this._height = height);
    this._update();
  }

  /**
   * 更新
   *
   * @private
   */
  _update() {
    if (this._loaded !== 9) return;

    let child;
    const gs = this._gridSprites;
    const children = this.children;
    const width = this._width;
    const height = this._height;

    // 九宫格位置2 顶部中间 top middle
    child = gs[1];
    child.setPosition(children[0].width, 0);
    child.width = width - child.x - children[2].width;

    // 九宫格位置3 顶部右上角
    child = gs[2];
    child.setPosition(width - child.width, 0);

    // 九宫格位置4 中间左侧
    child = gs[3];
    child.setPosition(0, children[0].height);
    child.height = height - child.y - children[6].height;

    // 九宫格位置5 正中间
    child = gs[4];
    child.setPosition(children[1].x, children[3].y);
    child.height = children[3].height;
    child.width = children[1].width;

    // 九宫格位置6 中间右侧
    child = gs[5];
    child.setPosition(width - child.width, children[3].y);
    child.height = children[3].height;

    // 九宫格位置7 底部左侧
    child = gs[6];
    child.setPosition(0, height - child.height);

    // 九宫格位置8 底部中间
    child = gs[7];
    child.setPosition(children[1].x, height - child.height);
    child.width = children[1].width;

    // 九宫格位置9 底部右侧
    child = gs[8];
    child.setPosition(width - child.width, height - child.height);
  }
}

export default NinePatch;
