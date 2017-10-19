import UIBase from './UIBase';

/**
 * Input 类型对象的基础类
 *
 * @class
 * @extends Tiny.ui.UIBase
 * @memberof Tiny.ui
 */
class InputBase extends UIBase {
  constructor() {
    super();

    this.interactive = true;

    // touchdown
    this.on('pointerdown', function (e) {
    });

    // touchup
    this.on('pointerup', function (e) {
    });

    // touchmove
    this.on('pointermove', function (e) {
    });

    // touchcancel
    this.on('pointerupoutside', function (e) {
    });
  }
}

export default InputBase;
