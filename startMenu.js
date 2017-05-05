if(!window.StartMenu){
  var start = µ('#start');
  var icon = µ('#startIcon');
  var menu = µ('#startMenu');
  var loDial = µ('#logOutDialog');
  var contact = µ('#contact');

  start.open = function() {
    start.opened = true;
    icon.className = 'pressed';
    menu.style.visibility = 'visible';
  };

  start.close = function() {
    start.opened = false;
    icon.className = '';
    menu.style.visibility = 'hidden';
  };

  icon.onclick = function(e) {
    e.stopPropagation();
    if (!start.opened) start.open();
    else start.close();
  };

  menu.onclick = function(e) {
    //loDial.style.visibility = 'visible';
  };

  µ('#loYes').onclick = function() {
    loDial.style.visibility = 'hidden';
    login.logout();
  };

  µ('#loNo').onclick = function() {
    loDial.style.visibility = 'hidden';
  };

  window.StartMenu = true;
}

exports.startMenu = window.StartMenu;
