if (!window.MenuItem) {
  console.log('loading menuItems');
  class MenuItem extends HTMLElement{
    constructor() {
      super();

      var _this = this;

      this.attachShadow({ mode: 'open' });
      _this.shadowRoot.innerHTML = '<style> @import "css/windowMenus.css"; </style>';

      _this.item = µ('+div', _this.shadowRoot);
      _this.item.className = 'menuItem';

      _this.entries = µ('+div', _this.shadowRoot);
      _this.entries.className = 'menuDropdown';
    }

    closeMenu() {
      this.entries.style.display = 'none';
      this.item.className = 'menuItem';
      this.opened = false;
    };

    openMenu() {
      this.entries.style.display = 'block';
      this.item.className = 'menuItem open';
      this.opened = true;
    };

    addTitle(ttl) {
      var _this = this;
      _this.item.textContent = ttl;
      _this.setAttribute('name', ttl);
    };

    addOption(name, callback) {
      var _this = this;
      var temp = µ('+div', _this.entries);
      temp.className = 'menuEntry';
      temp.textContent = name;
      if (typeof callback == 'function') {
        temp.onmousedown = function(e) {
          this.press = true;
        };

        temp.onmouseup = function(e) {
          if (this.press) {
            callback();
            _this.closeMenu();
            this.press = false;
          }
        };

        temp.onmouseout = function() {
          if (this.press) this.press = false;
        };
      } else {
        temp.className = 'menuEntry fade';
      }

      return temp;
    };

    addDivider() {
      var div = µ('+div', _this.entries);
      div.className = 'entryDivider';
    };

    connectedCallback() {
      var _this = this;

      _this.item.onmousedown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.press = true;
      };

      _this.item.onmouseup = function() {
        if (this.press && !_this.opened) _this.openMenu();
        else if (this.press) _this.closeMenu();
      };

      _this.onmouseout = function(e) {
        if (_this.opened) {
          if (e.toElement.className.includes('menuEntry') ||
           e.toElement.className == 'entryDivider') return;
          else if (e.toElement.tagName == 'MENU-ITEM') {
            var next = e.toElement;
            _this.closeMenu();
            next.openMenu();
          } //else _this.close();
        }
      };
    };
  }

  //window.MenuItem = document.registerElement('menu-item', menuItem);

  customElements.define('menu-item', MenuItem);
  window.MenuItem = true;
}

exports.menuItem = window.MenuItem;
