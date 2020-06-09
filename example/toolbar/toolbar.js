;(function () {
  function TouchEvent(el, option) {

    this.element = typeof el == 'string' ? document.querySelector(el) : el;

    this.element.addEventListener("touchstart", this.start.bind(this), false);
    this.element.addEventListener("touchmove", this.move.bind(this), false);
    this.element.addEventListener("touchend", this.end.bind(this), false);
    this.element.addEventListener("touchcancel", this.cancel.bind(this), false);

    this.pinchStartLen = null;
    this.isDoubleTap = false;

    var noop = function () { };

    this.touchStart = option.touchStart || noop;
    this.touchMove = option.touchMove || noop;
    this.touchEnd = option.touchEnd || noop;
    this.touchCancel = option.touchCancel || noop;

    this.delta = null;
    this.last = null;
    this.now = null;
    this.tapTimeout = null;
    this.touchTimeout = null;
    this.longTapTimeout = null;
    this.swipeTimeout = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.preTapPosition = {x: null, y: null};
  };

  TouchEvent.prototype = {
    start: function (evt) {
      if (!evt.touches) return;
      this.now = Date.now();
      this.x1 = evt.touches[0].pageX;
      this.y1 = evt.touches[0].pageY;
      this.delta = this.now - (this.last || this.now);
      this.touchStart(evt);
      if (this.preTapPosition.x !== null) {
        this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
      }
      this.preTapPosition.x = this.x1;
      this.preTapPosition.y = this.y1;
      this.last = this.now;
    },
    move: function (evt) {
      if (!evt.touches) return;
      var len = evt.touches.length,
        currentX = evt.touches[0].pageX,
        currentY = evt.touches[0].pageY;
      this.isDoubleTap = false;
      if (len > 1) {

      } else {
        if (this.x2 !== null) {
          evt.deltaX = currentX - this.x2;
          evt.deltaY = currentY - this.y2;
        } else {
          evt.deltaX = 0;
          evt.deltaY = 0;
        }
      }

      this.touchMove(evt);

      this.x2 = currentX;
      this.y2 = currentY;
      if (evt.touches.length > 1) {
        evt.preventDefault();
      }
    },
    end: function (evt) {
      if (!evt.changedTouches) return;
      this.touchEnd(evt);

      this.pinchStartLen = null;
      this.x1 = this.x2 = this.y1 = this.y2 = null;
    },
    cancel: function (evt) {
      clearTimeout(this.touchTimeout);
      clearTimeout(this.tapTimeout);
      clearTimeout(this.swipeTimeout);
      this.touchCancel(evt);
    },
  };

  var style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'toolbar-style';
  style.innerHTML = '.toolbar {\n' +
    '        background: #fff;\n' +
    '        position: fixed;\n' +
    '        top: 0;\n' +
    '        left: 0;\n' +
    '        z-index: 200;\n' +
    '      }\n' +
    '      .toolbar ul {\n' +
    '        display: flex;\n' +
    '        margin: 0;\n' +
    '        padding: 0;\n' +
    '        box-shadow: 0 0 5px #888;\n' +
    '      }\n' +
    '      .toolbar li {\n' +
    '        cursor: pointer;\n' +
    '        margin: 10px 0;\n' +
    '        padding: 0 10px;\n' +
    '        border-right: 1px solid gray;\n' +
    '        list-style: none;\n' +
    '      }\n' +
    '      .toolbar li:last-child {\n' +
    '        border-right: 0;\n' +
    '      }';
  document.getElementsByTagName('head').item(0).appendChild(style);

  var toolbarEle = parseDom('<div id="toolbar" class="toolbar">\n' +
    '      <ul>\n' +
    '        <li><a href="javascript:window.history.back();">后退</a></li>\n' +
    '        <li><a href="javascript:window.history.forward();">前进</a></li>\n' +
    '        <li><a href="javascript:window.location.reload();">刷新</a></li>\n' +
    '        <li><a href="javascript:void(0);">调试</a></li>\n' +
    '      </ul>\n' +
    '    </div>')[0];
  document.body.append(toolbarEle)

  var windowWidth = document.documentElement.clientWidth;
  toolbarEle.style.width = windowWidth + 'px';

  new TouchEvent(toolbarEle, {
    touchStart: function () {
      var touchEvent = event.changedTouches[0]
      var startX = toolbarEle.style.left.slice(0, -2) || 0
      var startY = toolbarEle.style.top.slice(0, -2) || 0
      toolbarEle.offset = {x: touchEvent.pageX - startX, y: touchEvent.pageY - startY}
      // console.log("touchstart offset:", JSON.stringify(toolbarEle.offset));
    },
    touchMove: function (event) {
      // console.log('touchMove:', event)
      var touchEvent = event.changedTouches[0]
      // console.log(touchEvent.pageX, touchEvent.pageY)
      toolbarEle.style.left = touchEvent.pageX - toolbarEle.offset.x + "px";
      toolbarEle.style.top = touchEvent.pageY - toolbarEle.offset.y + "px";
    },
    touchEnd: function () {
      toolbarEle.offset = null;
    }
  });

  function parseDom(str) {
    var ele = document.createElement("div");
    ele.innerHTML = str
    return ele.childNodes;
  }
})();