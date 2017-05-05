if (!customElements.get('eye-con')) {
  obtain([window.retroDir + 'windows.js', 'µ/utilities.js'], function(win, utils) {
    console.log('loading Eyecon');
    µ('#desktop').nextPosition = { x:20, y:20 };
    µ('#desktop').fileVertically = true;
    var hgt = 80;
    var wid = 90;

    class Eyecon extends HTMLElement {
      constructor() {
        super();

        var _this = this;
        this.name = µ('|>name', this);
        this.type = µ('|>type', this);

        var parent = _this.parentElement;
        var pos = parent.nextPosition;
        var vert = parent.fileVertically;

        if (pos) {
          _this.style.left = pos.x + 'px';
          _this.style.top = pos.y + 'px';
          if (vert) {
            pos.y += hgt;
            if (pos.y > _this.parentElement.offsetHeight - hgt) {
              pos.y = 20;
              pos.x += wid;
            }
          } else {
            pos.x += wid;
            if (pos.x > _this.parentElement.offsetWidth - wid) {
              pos.x = 20;
              pos.y += hgt;
            }
          }
        } else {
          _this.style.display = 'none';
        }

        _this.root = this.attachShadow({ mode: 'open' });
        _this.root.innerHTML = '<style> @import "css/eyeCons.css"; </style>';

        _this.content = null;
        utils.ajax(window.location.href + 'data/desktop/' + _this.name + '/contents.html', function(xml) {
          _this.content = µ('body', xml)[0];
        });

        var icon = µ('+img', _this.root);
        icon.src = 'data/desktop/' + _this.name + '/icon.png';

        var title = µ('+div', _this.root);
        title.className = 'iconTitle';
        title.textContent = _this.name.replace('_', ' ');
        if (_this.type != 'folder') title.textContent += '.' + _this.type;
      }

      select() {
        var _this = this;
        var selected = µ('.iconSelect', this.parentElement)[0];
        if (selected) {
          selected.parentElement.selected = null;
          selected.className = '';
        }

        _this.className = 'iconSelect';
        _this.parentElement.selected = this;
      };

      openWindow() {
        var _this = this;
        _this.window = µ('win-dow[name=' + _this.name + ']')[0];
        if (_this.window == null) {
          _this.window = µ('+win-dow');
          _this.window.setAttribute('name', _this.name);
          var time = new Date();

          //_this.window = temp.cloneNode(true);
          µ('#windows').appendChild(_this.window);

          var node = _this.content.firstElementChild.cloneNode(true);
          _this.window.content.appendChild(node);
          get('data/desktop/' + _this.name + '/winActs.js').then((req)=> {
            var intro = '()=>{var imports = {window: "' + _this.name + '"}; ';
            objs[ind] = eval(intro + req.responseText + '};')();
          });
        }

        _this.window.focus();
      };

      connectedCallback() {
        var _this = this;
        _this.onmousedown = (e)=> {
          e.preventDefault();
          _this.press = true;
        };

        _this.onmouseup = (e)=> {
          if (_this.press) {
            if (_this.clickedOnce) _this.openWindow();
            else {
              _this.clickedOnce = true;
              _this.select();
              setTimeout(function() {_this.clickedOnce = false;}, 300);
            }
          }
        };
      }
    }

    //document.registerElement('eye-con', eyeCon);

    customElements.define('eye-con', Eyecon);

    exports.eyecon = Eyecon;
    provide(exports);
  });
} else {
  exports.eyecon = window.Eyecon;
}
