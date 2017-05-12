if (!customElements.get('win-dow')) {
  if (!window.retroDir) window.retroDir = './';

  obtain([window.retroDir + 'menuItems.js'], function(menu) {
    console.log('loading windows');
    var dt = µ('#windows');
    dt.onmousemove = function(e) {
      if (dt.dragged) dt.dragged.drag(e);
    };

    dt.onmouseup = function(e) {
      if (dt.dragged) dt.dragged.release(e);
    };

    var newPos = { x:75, y:75 };

    class Window extends HTMLElement {
      constructor() {
        super();
      }

        //_this.tray.appendChild(title.cloneNode(true));

      resetContentHeight() {
        var _this = this;
        var winBox = _this.getBoundingClientRect();
        var menuH = _this.menuBar.getBoundingClientRect();
        var totHeight = menuH.bottom - winBox.top;
        _this.content.style.top = totHeight + 'px';
        totHeight += _this.foot.offsetHeight;
        _this.content.style.height = 'calc(100% - ' + (totHeight) + 'px)';
      };

      hide() {
        var _this = this;
        _this.focused = false;
        _this.className = 'inactive';

        //ttlBar.style.backgroundColor = '#777';
        _this.trayDot.className = 'inactive';
        _this.setAttribute('minimized', '');
        _this.hidden = true;
      }

      show() {
        this.removeAttribute('minimized');
        this.hidden = false;
      }

      set minimized(val) {
        if (val) this.hide();
        else this.show();
      }

      get minimized() {
        return (typeof this.getAttribute('minimized') === 'string');
      }

      onClose(cont) {}

      closeWindow() {
        var _this = this;
        µ('#winTray').removeChild(_this.tray);
        var origin = µ('eye-con[name=' + _this.name + ']')[0];
        var frameCont = µ('.frameContent', _this.content)[0];
        var cont = _this.content.removeChild(frameCont, _this.content);

        _this.onClose(cont);

        _this.parentElement.removeChild(_this);
      }

      save() {
        var _this = this;
        var node = _this.content.getElementsByClassName('frameContent')[0].cloneNode(true);
        var origin = µ('eye-con[name=' + _this.name + ']');
        var old = origin.content.getElementsByClassName('frameContent')[0];
        old.parentElement.insertBefore(node, old);
        old.parentElement.removeChild(old);
      };

      focus() {
        var _this = this;
        var wins = µ('win-dow');
        for (var i = 0; i < wins.length; i++) {
          if (wins[i] != _this) {
            wins[i].focused = false;
            wins[i].style.zIndex = parseInt(wins[i].style.zIndex) - 1;
            wins[i].className = 'inactive';
            wins[i].trayDot.className = 'inactive';
          }
        }

        _this.style.zIndex = wins.length - 1;
        _this.focused = true;

        //µ('.windowTitle', _this).style.backgroundColor = '#008';
        if (_this.minimized) _this.show();
        else {
          _this.className = 'active';
          _this.trayDot.className = 'active';
        }

      }

      attributeChangedCallback(attr, oldVal, newVal) {
        if (attr == 'name') {
          this.name = newVal;
          this.icon.src = 'data/desktop/' + this.name + '/icon.png';
          this.windowTitle.textContent = this.name.replace(/_/g, ' ');
        }
      }

      connectedCallback() {
        var _this = this;

        var updateCSSVar = (name, val)=> {
          _this.style.removeProperty(name);
          _this.style.setProperty(name, val);
        };

        _this.updatePosition = (newx, newy)=> {
          updateCSSVar('--xpos', newx + 'px');
          updateCSSVar('--ypos', newy + 'px');
        };

        _this.updatePosition(newPos.x, newPos.y);

        newPos.x = (newPos.x + 30) % 200;
        newPos.y = (newPos.y + 20) % 200;

        _this.name = µ('|>name', _this);
        if (!_this.name) _this.name = '';
        _this.textContent = '';

        _this.className = 'active';

        _this.root = this.attachShadow({ mode: 'open' });
        _this.root.innerHTML = '<style> @import "css/window.css"; img{width:0}</style>';

        var ttlBar = µ('+div', _this.root);
        ttlBar.className = 'windowTitle';

        this.icon = µ('+img', ttlBar);
        this.icon.src = 'data/desktop/' + _this.name + '/icon.png';

        this.windowTitle = µ('+div', ttlBar);
        this.windowTitle.className = 'winTitle';
        this.windowTitle.textContent = _this.name.replace(/_/g, ' ');

        this.min = µ('+div', ttlBar);
        this.min.className = 'winMin winButton';
        _this.closeBut = µ('+div', ttlBar);
        _this.closeBut.className = 'winClose winButton';

        //var div = µ('+div', this);
        //div.className = 'entryDivider';

        this.menuBar = µ('+div', _this.root);
        this.menuBar.className = 'winMenu';

        _this.content = µ('+div', _this.root);
        _this.content.className = 'winContent';

        this.foot = µ('+div', _this.root);
        this.foot.className = 'winFoot';

        this.resizeImg = µ('+img', this.foot);
        this.resizeImg.className = 'winResize';
        this.resizeImg.src = 'img/resize.png';

        _this.tray = µ('+div', µ('#winTray'));
        _this.tray.className = 'trayButton';
        _this.tray.appendChild(this.icon.cloneNode(true));
        _this.trayDot = µ('+div', _this.tray);
        _this.trayDot.className = 'active';

        _this.tray.onmousedown = function(e) {
          e.preventDefault();
          this.press = true;
        };

        _this.addEventListener('transitionend', ()=> {
          if (!_this.minimized) {
            _this.className = 'active';
            _this.trayDot.className = 'active';
          }
        });

        _this.tray.onmouseup = function(e) {
          if (_this.focused) _this.hide();
          else {
            _this.focus();//if (_this.hidden) _this.show();
          }
        };

        _this.onmousedown = function() {
          if (!_this.focused) _this.focus();
        };

        function startDrag(e) {
          e.preventDefault();
          _this.dragging = true;
          var rect = _this.getBoundingClientRect();
          _this.mouse = {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top),
          };
          dt.dragged = _this;
        }

        _this.menuBar.onmousedown = startDrag;

        ttlBar.onmousedown = function(e) {
          startDrag(e);
        };

        _this.changeSize = function(wid, hgt) {
          _this.style.width = wid + 'px';
          _this.style.maxWidth = wid + 'px';
          _this.style.height = hgt + 'px';
          _this.style.maxHeight = hgt + 'px';
        };

        _this.drag = function(e) {
          if (_this.dragging) {
            _this.updatePosition(e.clientX - _this.mouse.x, e.clientY - _this.mouse.y);
          } else if (_this.resizing) {
            _this.changeSize(e.clientX + _this.mouse.x, e.clientY + _this.mouse.y);
          }
        };

        _this.release = function(e) {
          _this.dragging = _this.resizing = false;
          dt.dragged = null;
        };

        _this.content.onmouseup = _this.release;

        _this.resizeImg.onmousedown = function(e) {
          _this.resizing = true;
          dt.dragged = _this;
          var rect = _this.getBoundingClientRect();
          _this.mouse = {
            x: (rect.right - e.clientX) - rect.left,
            y: (rect.bottom - e.clientY) - rect.top,
          };
        };

        _this.min.onmousedown = function(e) {
          e.preventDefault();
          e.stopPropagation();
          this.press = true;
        };

        _this.min.onmouseup = function(e) {
          if (this.press) _this.hide();
        };

        _this.closeBut.onmousedown = function(e) {
          e.preventDefault();
          e.stopPropagation();
          _this.closeBut.press = true;
        };

        _this.closeBut.onmouseup = ()=> {
          if (_this.closeBut.press) {
            _this.closeWindow();
          }
        };

        _this.closeBut.onmouseout = function() {
          this.press = false;
        };

        //setTimeout(_this.resetContentHeight.bind(_this), 100);
      };
    }

    //window.WinDow = document.registerElement('win-dow', winDow);

    customElements.define('win-dow', Window);

    exports.winDow = Window;
    provide(exports);
  });
} else {
  exports.winDow = customElements.get('win-dow');
}
