import UIBase from './UIBase';

/**
 * DOM 组件
 *
 * @description
 * 注意：
 * <ul>
 * <li>由于安全策略，ui.DOM 的渲染模式只支持 canvas，如果要用，需要将固定设置启动参数 renderType 为 Tiny.RENDERER_TYPE.CANVAS</li>
 * <li>由于浏览器渲染机制问题，在Safari下，<a href="http://tinyjs.net/#/plugins/tinyjs-plugin-tiling/docs">tinyjs-plugin-tiling</a>插件中的 TilingSprite 类会影响到 ui.DOM 的背景，可以通过添加顺序来规避（即后添加 TilingSprite 实例化显示对象）。</li>
 * </ul>
 *
 * @example
 *
 * // 写一段 HTML
 * var html =
 *  '<div style="font-size:40px;color:#fff;">' +
 *  ' I<em> am </em><span style="color:gold;text-shadow:0 0 2px red;">Tiny.js</span><br/>你好，<b style="color:gold;text-shadow:1px 5px 5px orangered;">中国</b>' +
 *  '</div>';
 * // 用上面的那段 HTML 生成 DOM 显示对象
 * var dom = new Tiny.ui.DOM({
 *  html: html,
 * });
 * var container = new Tiny.Container();
 * // 将实例化的 dom 直接添加到显示容器中
 * container.addChild(dom);
 *
 * @class
 * @extends Tiny.ui.UIBase
 * @memberof Tiny.ui
 */
class DOM extends UIBase {
  /**
   *
   * @param {object}  options
   * @param {string}  options.width   - 宽
   * @param {string}  options.height  - 高
   * @param {string}  options.html    - HTML 文本片段
   */
  constructor(options) {
    super();

    Object.assign(this.setting, options);

    const html = this.setting.html;
    this.sprite = null;
    this._parseHTML(html);
  }

  /**
   * 更新 html
   *
   * @param {string} html - HTML 片段
   */
  updateHTML(html) {
    this._parseHTML(html, true);
  }

  _parseHTML(html, isUpdate) {
    const self = this;
    const htmlHeightWidth = getHTMLWH(html);
    let width = ~~this.setting.width || htmlHeightWidth.width;
    let height = ~~this.setting.height || htmlHeightWidth.height;
    const data = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
      </foreignObject>
    </svg>
    `;
    const svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    const reader = new FileReader();
    reader.onload = function () {
      const texture = Tiny.Texture.fromImage(this.result);
      if (isUpdate) {
        self.sprite.texture = texture;
      } else {
        self.sprite = new Tiny.Sprite(texture);
        self.addChild(self.sprite);
      }
      self.sprite.texture.on('update', function () {
        self.emit('rendered');
      });
    };
    reader.readAsDataURL(svg);
  }
}

/**
 * 获取字符格式 HTML 的宽高
 *
 * @param {string}  html
 * @private
 * @return {object}
 */
function getHTMLWH(html) {
  const temp = document.createElement('template');
  const span = document.createElement('span');
  temp.innerHTML = html;
  document.body.appendChild(span);
  if (temp.content) {
    span.appendChild(temp.content, span.lastElementChild);
  } else {
    span.insertAdjacentHTML('beforeend', html);
  }
  span.style.position = 'absolute';
  span.style.zIndex = '-1';
  span.style.display = 'block';
  const whArray = getDomWH(span);
  const result = {
    width: whArray[0],
    height: whArray[1],
  };
  span.parentNode.removeChild(span);
  return result;
}

/**
 *
 * @param {HTMLElement}  elem
 * @private
 * @return {array}
 */
function getDomWH(elem) {
  let d;
  let dims = [elem.offsetWidth, elem.offsetHeight];

  if (!dims[0]) {
    d = elem.style;
    if (d.display === 'none') {
      d.display = 'block';
      dims = [elem.offsetWidth, elem.offsetHeight];
      d.display = 'none';
    } else if (d.display === '') {
      d.display = 'block';
      dims = [elem.offsetWidth, elem.offsetHeight];
      d.display = '';
    }
  }
  return dims;
}

export default DOM;
