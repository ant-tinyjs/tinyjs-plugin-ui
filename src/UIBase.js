import UISettings from './UISettings';

/**
 * UI 组件的基础类
 *
 * @class
 * @extends Tiny.Container
 * @memberof Tiny.ui
 */
class UIBase extends Tiny.Container {
  /**
   *
   * @param {number}  width   - UI 组件的宽度
   * @param {number}  height  - UI 组件的高度
   */
  constructor(width, height) {
    super();

    this.setting = new UISettings();
    this.children = [];
    this.parent = null;
    this.stage = null;
    this.initialized = false;
    this.dragInitialized = false;
    this.dropInitialized = false;
    this.dirty = true;
    this.pixelPerfect = true;

    this.setting.width = width || 0;
    this.setting.height = height || 0;
  }
}

export default UIBase;
