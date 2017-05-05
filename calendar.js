//6 hours

//include([], function() {

if (!customElements.get('cal-endar')) {
  console.log('load Calendar');
  class Event extends HTMLElement{
    constructor() {
      super();

      var _this = this;

      _this.desc = _this.textContent;
      _this.textContent = '';

      var startString = µ('|>startTime', _this);

      //if (startString.length <= 11) startString += 'T00:00:00-05:00';
      var endString = µ('|>endTime', _this);

      _this.startTime = new Date(startString);
      _this.endTime = new Date(endString);
      _this.subject = µ('|>subject', _this);
      _this.where = µ('|>where', _this);

      this.attachShadow({ mode: 'open' });

      _this.shadowRoot.innerHTML = '<style> @import "css/programs/calendar.css";</style>';

      this.controls = µ('+div', _this.shadowRoot);
      this.controls.className = 'evControls';

      this.back = µ('+div', controls);
      this.back.className = 'button evButton';
      this.back.textContent = '< Back';

      var content = µ('+div', _this.shadowRoot);
      content.className = 'evContent inset';

      var subj = µ('+div', content);
      subj.className = 'evSubject';
      subj.textContent = _this.subject;

      var evTime = µ('+div', content);
      evTime.className = 'evTime';

      var fromDate = µ('+div', evTime);
      fromDate.className = 'evDateTime';
      fromDate.textContent = _this.startTime.toLocaleDateString('en-US');

      var fromTime = µ('+div', evTime);
      fromTime.className = 'evDateTime';
      fromTime.textContent = _this.startTime.toLocaleTimeString('en-US');

      var toText = µ('+span', evTime);
      toText.textContent = 'to';

      var toTime = µ('+div', evTime);
      toTime.className = 'evDateTime';
      toTime.textContent = _this.endTime.toLocaleTimeString('en-US');

      var toDate = µ('+div', evTime);
      toDate.className = 'evDateTime';
      toDate.textContent = _this.endTime.toLocaleDateString('en-US');

      var evDetails = µ('+div', content);
      evDetails.className = 'evDetails';

      var detailText = µ('+div', evDetails);
      detailText.textContent = 'Event Details';

      µ('+div', evDetails).className = 'entryDivider';

      var evWhere = µ('+div', evDetails);
      evWhere.className = 'evWhere';

      var whereText = µ('+span', evWhere);
      whereText.className = 'detailLabel';
      whereText.textContent = 'Where';

      var whereBox = µ('+div', evWhere);
      whereBox.className = 'evTextBox';
      if (_this.where) whereBox.textContent = _this.where;

      var evDesc = µ('+div', evDetails);
      evDesc.className = 'evDesc';

      var descText = µ('+span', evDesc);
      descText.className = 'detailLabel';
      descText.textContent = 'Description';

      var descBox = µ('+div', evDesc);
      descBox.className = 'evTextBox descBox';
      if (_this.desc) descBox.textContent = _this.desc;
    }

    connectedCallback() {
      var _this = this;

      _this.back.onclick = function() {
        _this.style.visibility = 'hidden';
      };

    };
  }

  //var Event = document.registerElement('ev-ent', evEnt);

  //var Event = evEnt.prototype.constructor;
  customElements.define('ev-ent', Event);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  class Calendar extends HTMLElement{

    constructor() {
      super();

      var _this = this;

      this.attachShadow({ mode: 'open' });
      _this.shadowRoot.innerHTML = '<style> @import "css/programs/calendar.css";</style>';

      var sDate = µ('|>date', _this).split('/');

      var frame = µ('+table', _this.shadowRoot);
      frame.className = 'calFrame';

      _this.frame = frame;

      _this.events = [].slice.call(µ('ev-ent'));

      if (µ('|>src', _this)) {
        window.get(µ('|>src', _this))
        .then((result)=> {
          let res = JSON.parse(result.responseText);

          //console.log(res.items[0].summary);
          res.items.forEach(function(item, ind, arr) {
            console.log(item);
            let evnt = new Event();
            evnt.setAttribute('startTime', (item.start.dateTime) ? item.start.dateTime : item.start.date);
            evnt.setAttribute('endTime', (item.end.dateTime) ? item.end.dateTime : item.end.date);
            if (item.location) evnt.setAttribute('where', item.location);
            evnt.setAttribute('subject', item.summary);
            _this.insertBefore(evnt, _this.firstElementChild);
          });

          _this.events = [].slice.call(_this.getElementsByTagName('ev-ent'));

          _this.fillDays(_this.currentMonth);

        });
      }

      _this.days = [];

      var header = µ('+tr', frame);
      header.className = 'inset';
      for (var j = 0; j < 7; j++) {
        var hd = µ('+th', header);
        hd.textContent = dayNames[j];
        hd.className = 'calDays';
      }

      for (var i = 0; i < 5; i++) {
        var line = µ('+tr', frame);
        for (var j = 0; j < 7; j++) {
          var day = µ('+td', line);
          _this.days[j + i * 7] = day;
          day.number = µ('+div', day);
          day.number.className = 'calDate';
          day.events = µ('+div', day);
          day.events.className = 'dayVents';
        }
      }

      _this.currentMonth = new Date(parseInt(sDate[2]), parseInt(sDate[0]) - 1, 1);
      _this.today = new Date();
    }

    getCurrentMonth() {
      return monthNames[this.currentMonth.getMonth()];
    };

    getMonthAndYear() {
      return monthNames[this.currentMonth.getMonth()] + ' ' + this.currentMonth.getFullYear();
    };

    nextMonth() {
      console.log('next');
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.fillDays(this.currentMonth);
    };

    prevMonth() {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.fillDays(this.currentMonth);
    };

    setMonth(num) {
      this.currentMonth.setMonth(num);
      this.fillDays(this.currentMonth);
    };

    fillDays(date) {
      var _this = this;

      //for (var i = 0; i < days.length; i++) {
      this.days.forEach(function(cur, ind, arr) {
        //console.log(cur);
        //cur.number.textContent = '';
        var tempDate = new Date(date.getFullYear(), date.getMonth(), ind - date.getDay() + 1);
        if (tempDate.getDate() == 1) {
          cur.number.textContent = monthNames[tempDate.getMonth()].substring(0, 3) + ' '
           + tempDate.getDate();
        } else cur.number.textContent = tempDate.getDate();
        cur.date = new Date(tempDate);
        if (cur.date.getMonth() != date.getMonth()) {
          cur.number.className = 'calDate';
        } else cur.number.className = 'calDate curMon';
        if (cur.date.toDateString() == _this.today.toDateString()) {
          cur.id = 'today';
        } else cur.id = '';

        cur.events.textContent = '';
        cur.events.onclick = null;

        _this.events.forEach(function(curEv, indEv, arrEv) {
          console.log(curEv.startTime.getTime() + ' is the time since 1970 to ' + curEv.startTime.toLocaleDateString('en-US'));
          if (cur.date.getTime() + 24 * 60 * 60 * 1000 > curEv.startTime.getTime() && curEv.endTime.getTime() >= cur.date.getTime()) {
            var ev = curEv;
            let timeStr = '';
            if (curEv.startTime.getTime() > cur.date.getTime()) {
              timeStr = ev.startTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit' }) + '- ';
            }

            var evnt = µ('+div', cur.events);
            evnt.textContent = timeStr + ev.subject;
            evnt.onclick = function(e) {
              console.log(curEv);
              curEv.style.visibility = 'visible';
            };
          }
        });
      });
    };

    attributeChangedCallback(attr, oldVal, newVal) {
      var _this = this;
      if (attr = 'src' && µ('|>src', _this)) {
        window.get(µ('|>src', _this))
        .then((result)=> {
          let res = JSON.parse(result.responseText);

          //console.log(res.items[0].summary);
          res.items.forEach(function(item, ind, arr) {
            console.log(item);
            let evnt = new Event();
            evnt.setAttribute('startTime', (item.start.dateTime) ? item.start.dateTime : item.start.date);
            evnt.setAttribute('endTime', (item.end.dateTime) ? item.end.dateTime : item.end.date);
            if (item.location) evnt.setAttribute('where', item.location);
            evnt.setAttribute('subject', item.summary);
            _this.insertBefore(evnt, _this.firstElementChild);
          });

          _this.events = [].slice.call(_this.getElementsByTagName('ev-ent'));

          _this.fillDays(_this.currentMonth);

        });
      }
    }

    connectedCallback() {
      var _this = this;

      _this.setMonth(_this.today.getMonth());

    }
  }

  //window.Calendar = document.registerElement('cal-endar', calEndar);

  customElements.define('cal-endar', Calendar);
  exports.Calendar = Calendar;
  exports.Event = Event;
} else {
  exports.Calendar = customElements.get('cal-endar');
  exports.Event = customElements.get('ev-ent');
}
