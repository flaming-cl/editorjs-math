/**
 * Build styles
 */
const katex = require("katex");
require('./index.css');
require("katex/dist/katex.css");

/**
 * Math Block for the Editor.js.
 * Render Tex syntax/plain text to pretty math equations
 *
 * @author flaming-cl
 * @license The MIT License (MIT)
 */

/**
 * @typedef {Object} MathData
 * @description Tool's input and output data format
 * @property {String} text — Math's content. Can include HTML tags: <a><b><i>
 */
class Math {
  /**
   * Default placeholder for Math Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: MathData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-Math'
    };
    this.onKeyUp = this.onKeyUp.bind(this);

    this._placeholder = config.placeholder ? config.placeholder : Math.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();

    this.config = {
      fleqn: true,
      output: 'html',
      delimiter: '$$',
      throwOnError: true,
      displayMode: true,
    };

    this.data = data;
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    const { textContent } = this._element;

    this.renderKatex();

    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }

  /**
   * Change block editing state - rendering Katex or being editable
   */
  onClick(e) {
    if (!this.textNode || !this.katexNode || e.target === this.textNode) return;

    this.textNode.hidden = !(this.textNode.hidden);

    const inputError = this.katexNode.innerText.indexOf('ParseError') > -1;
    if (this.textNode.hidden == true && inputError) {
      katex.render(this.textBeforeError, this.katexNode, this.config);
    }
  }

  /**
   * switch the block to editable mode
   */
  enableEditing() {
    if (this.textNode) {
      return this.textNode.hidden = false;
    }

    this.textNode = document.createElement('input');
    this.textNode.contentEditable = true;
    this.textNode.value = this.data.text;
    this.textNode.hidden = true;
    this.textNode.className = 'text-node';
    this._element.appendChild(this.textNode);
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    const div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = true;
    div.dataset.placeholder = this._placeholder;
    this.katexNode = document.createElement('div');
    this.katexNode.id = 'katex-node';
    this.katexNode.contentEditable = false;
    div.appendChild(this.katexNode);

    div.addEventListener('keyup', this.onKeyUp);
    return div;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    this.renderKatex();
    this.enableEditing();
    this._element.addEventListener('click', (e) => this.onClick(e));
    return this._element;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   */
  renderKatex() {
    this.data.text = this.textNode ? this.textNode.value : this.data.text;
    this.textToKatex();
  }

  /**
   * parsing the current text to Tex syntax if it has not been transformed
   */
  textToKatex() {
    if (!this.data.text) {
      this.data.text = 'equation:';
    }

    if (!this.katexNode) return;

    if (this._element.innerText.indexOf('ParseError') < 0) {
      this.textBeforeError = this._element.innerText;
    }

    try {
      katex.render(this.data.text, this.katexNode, this.config);
    } catch (e) {
      const errorMsg = 'Invalid Equation. ' + e.toString();
      this.katexNode.innerText = errorMsg;
    }
  }

  /**
   * content inside Math is unchangeable.
   * @param {MathData} data
   * @public
   */
  merge(data) {
    this.data = this.data;
  }

  /**
   * Validate Math block data:
   * - check for emptiness
   *
   * @param {MathData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * content inside Math is unchangeable
   * @param {HTMLDivElement} toolsContent - Math tools rendered view
   * @returns {MathData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: this.data.text
    };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Math can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert Math to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Math, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
        svg: true
      }
    };
  }

  /**
   * Get current Tools`s data
   * @returns {MathData} Current data
   * @private
   */
  get data() {
    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {MathData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this.katexNode.innerHTML = this._data.text || '';
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: [ 'P' ]
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: require('./math-icon.svg').default,
      title: 'Math'
    };
  }
}

module.exports = Math;
