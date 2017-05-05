if (!window.MenuItem) {
  var menuItem = inheritFrom(HTMLElement, function() {
    this.createdCallback = function() {
      var _this = this;

      _this.item = µ('+div', _this);
      _this.item.className = 'menuItem';

      _this.entries = µ('+div', _this);
      _this.entries.className = 'menuDropdown';

      _this.close = function() {
        _this.entries.style.display = 'none';
        _this.item.className = 'menuItem';
        _this.opened = false;
      };

      _this.open = function() {
        _this.entries.style.display = 'block';
        _this.item.className = 'menuItem open';
        _this.opened = true;
      };

      _this.item.onmousedown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.press = true;
      };

      _this.item.onmouseup = function() {
        if (this.press && !_this.opened) _this.open();
        else if (this.press) _this.close();
      };

      _this.onmouseout = function(e) {
        if (_this.opened) {
          if (~e.toElement.className.indexOf('menuEntry') ||
           e.toElement.className == 'entryDivider') return;
          else if (e.toElement.className == 'menuItem') {
            var next = e.toElement.parentElement;
            _this.close();
            next.open();
          } //else _this.close();
        }
      };

      this.addTitle = function(ttl) {
        _this.item.textContent = ttl;
        _this.setAttribute('name', ttl);
      };

      this.addOption = function(name, callback) {
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
              _this.close();
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

      this.addDivider = function() {
        var div = µ('+div', _this.entries);
        div.className = 'entryDivider';
      };
    };

    this.attachedCallback = function() {

    };
  });

  window.MenuItem = document.registerElement('menu-item', menuItem);

  //customElements.define('menu-item', menuItem.prototype.constructor);
  window.MenuItem = true;
}

exports.menuItem = window.MenuItem;
