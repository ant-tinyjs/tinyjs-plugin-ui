/**
 * 多个显示对象排成一行
 *
 * @description
 *
 * <pre>
 *  1. 显示对象是任何继承 Tiny.DisplayObject 的实例，比如：sprite， text，container，graphics
 *  2. 可设置每个显示对象的左右间距，默认为 0
 *  3. 可设置上下对齐方式
 *  4. 若某个元素发生变化，请再调用一次 layout 函数
 *  5. 请务必不要设置显示对象的 anchor 或者 pivot
 * </pre>
 *
 * @example
 * var line = new Tiny.ui.InlineItems({
 *   items: [
 *      {displayObj: sprite1},
 *      {displayObj: text1, leftMargin: 15},
 *      {displayObj: text2, leftMargin: 5},
 *      {displayObj: sprite2, leftMargin: 20},
 *   ],
 *   itemsAlign: 'middle'
 * });
 *
 * @class
 * @extends Tiny.Container
 * @memberof Tiny.ui
 * @version 0.6.0
 */

class InlineItems extends Tiny.Container {
  /**
   * @constructor
   * @param {Object} options 入参
   * @param {Array} options.items - 显示对象列表
   * @param {Tiny.DisplayObject} options.items.displayObj - 显示对象
   * @param {Number} [options.items.leftMargin=0] - 显示对象左侧 margin
   * @param {Number} [options.items.rightMargin=0] - 显示对象右侧 margin
   * @param {top|middle|bottom} [options.itemsAlign='middle'] -对齐方式
   */
  constructor(options) {
    super();

    options = options || {};

    /**
     * 上下对齐方式
     *
     * @private
     */
    this.itemsAlign = options.itemsAlign || 'middle';

    /**
     * 显示对象列表
     *
     * @private
     */
    this.items = [];
    this.spliceItems(0, 0, options.items);
  }

  /**
   * 行高 = height 最大的一个 item 的高度
   *
   * @private
   */
  get maxHeight() {
    let height = 0;
    this.items.forEach((item) => {
      if (item.displayObj.height > height) {
        height = item.displayObj.height;
      }
    });
    return height;
  }
  /**
   * 更新布局
   * @public
   * @method Tiny.ui.InlineItems#layout
   */
  layout() {
    const maxHeight = this.maxHeight;
    this.items.reduce((preX, curItem) => {
      const displayObj = curItem.displayObj;
      let y = 0;
      let x = preX + (Number(curItem.leftMargin) || 0);

      switch (this.itemsAlign) {
        case 'top':
          break;
        case 'bottom':
          y = maxHeight - displayObj.height;
          break;
        default:
          y = (maxHeight - displayObj.height) / 2;
          break;
      }
      displayObj.setPosition(x, y);
      return x + displayObj.width + (Number(curItem.rightMargin) || 0);
    }, 0);
  }

  /**
   * 删除item(删除后会自动调用 layout 函数重新布局)
   *
   * @public
   * @method Tiny.ui.InlineItems#deleteItem
   *
   * @param {Tiny.DisplayObject} displayObj - 显示对象
   */
  deleteItem(displayObj) {
    const index = this.items.findIndex(item => {
      return item.displayObj === displayObj;
    });
    if (index !== -1) {
      this.items.splice(index, 1);
      this.removeChild(displayObj);
      this.layout();
    }
  }

  /**
   * 在指定位置插入和删除items (插入或删除后会自动调用 layout 函数重新布局)
   *
   * @public
   * @method Tiny.ui.InlineItems#spliceItems
   *
   * @param {Number} index - index
   * @param {Number} deleteCount - 删除个数
   * @param {Array} items - 插入列表
   * @param {Tiny.DisplayObject} items.displayObj - 显示对象
   * @param {Number} [items.leftMargin=0] - 显示对象左侧 margin
   * @param {Number} [items.rightMargin=0] - 显示对象右侧 margin
   */
  spliceItems(index, deleteCount, items) {
    const _items = (items || []).filter(item => {
      const displayObj = item.displayObj;
      if (displayObj instanceof Tiny.DisplayObject) {
        this.addChild(displayObj);
        return true;
      } else {
        return false;
      }
    });
    const deleteItems = this.items.splice(index, deleteCount, ..._items);
    deleteItems.forEach((item) => {
      this.removeChild(item.displayObj);
    });
    this.layout();
  }
}

export default InlineItems;
