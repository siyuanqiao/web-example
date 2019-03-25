var ease = {
  quadratic: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function (k) {
      return k * (2 - k);
    }
  },
  circular: {
    style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
    fn: function (k) {
      return Math.sqrt(1 - (--k * k));
    }
  },
  back: {
    style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fn: function (k) {
      var b = 4;
      return (k = k - 1) * k * ((b + 1) * k + b) + 1;
    }
  },
  bounce: {
    style: '',
    fn: function (k) {
      if ((k /= 1) < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
      }
    }
  },
  elastic: {
    style: '',
    fn: function (k) {
      var f = 0.22,
          e = 0.4;

      if (k === 0) { return 0; }
      if (k == 1) { return 1; }

      return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
    }
  }
}

var egret = {
  TouchEvent: {
    TOUCH_START: 'touchstart',
    TOUCH_MOVE: 'touchmove',
    TOUCH_END: 'touchend'
  }
}

class Scroll {

  ele;
  children;

  bounce = false;
  stageWidth = 640;
  stageHeight = 0;

  touchBeginEvent = null;
  onTouchMove = false;
  isAnimating = false

  constructor($ele) {
    this.ele = $ele;
    this.ele.interactive = true;
    this.ele.buttonMode = true;
    this.ele.on(egret.TouchEvent.TOUCH_START, this.onTouchBeginContainerHandler, this);
  }

  onTouchBeginContainerHandler(event) {

    //egret.Ticker.getInstance().unregister(this._onTicker,this);

    if (this.onTouchMove) return;

    var data = event.data

    this.touchBeginEvent = {
      offsetX: this.ele.x - data.global.x,
      offsetY: this.ele.y - data.global.y,
      startX: data.global.x,
      startY: data.global.y,
      startTimer: new Date().getTime()
    }

    this.ele.on(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveeleHandler, this);
    this.ele.on(egret.TouchEvent.TOUCH_END, this.onTouchEndeleHandler, this);

  }

  onTouchMoveeleHandler(event) {
    if (this.onTouchMove) return;
    var data = event.data
    this.ele.x = data.global.x + this.touchBeginEvent.offsetX;

    var timestamp = new Date().getTime();

    //每300ms会重置一次当前位置以及开始时间，这个就是为什么我们在抓住不放很久突然丢开仍然有长距离移动的原因，这个比较精妙哦！
    /* REPLACE START: _move */
    // console.log(timestamp - this.touchBeginEvent.startTimer)
    if (timestamp - this.touchBeginEvent.startTimer > 300) {
      this.touchBeginEvent.startTimer = timestamp;
      this.touchBeginEvent.startX = this.ele.x;
      this.touchBeginEvent.startY = this.ele.y;
    }
    /* REPLACE END: _move */
  }

  onTouchEndeleHandler(event) {
    this.onTouchMove = false;
    this.ele.off(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveeleHandler, this);
    this.ele.off(egret.TouchEvent.TOUCH_END, this.onTouchEndeleHandler, this);
    // this.ele.off(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndeleHandler, this);

    var data = event.data
    // start - end 的时间差
    let millisecond = new Date().getTime() - this.touchBeginEvent.startTimer;

    var momentum = this._momentum(data.global.x, this.touchBeginEvent.startX, millisecond,640 - this.children.width,640)
    // console.log(momentum)
    var newX = this.ele.x+momentum.destination;
    var newY = momentum.destination;
    // console.log(this.ele.x,newX)
    // console.log(this.ele.y,newY)
    var duration = momentum.duration;
    var easing = ease.quadratic.fn;
    this._animate(newX, newY, duration, easing)
  }

  /**
   *  current：当前鼠标位置
   *  start：touchStart时候记录的Y（可能是X）的开始位置，但是在touchmove时候可能被重写
   *  time： touchstart到手指离开时候经历的时间，同样可能被touchmove重写
   *  lowerMargin：y可移动的最大距离，这个一般为计算得出 this.wrapperHeight - this.scrollerHeight
   *  wrapperSize：如果有边界距离的话就是可拖动，不然碰到0的时候便停止
   * */
  _momentum (current, start, time, lowerMargin, wrapperSize, deceleration) {
    // 当前位置与初始位置的差值
    var distance = current - start,
        // 根据差值求出平均速度
        speed = Math.abs(distance) / time,
        // 目的地
        destination,
        // 持续时间
        duration;
    // 加速度的初始化
    deceleration = deceleration === undefined ? 0.0006 : deceleration;

    // 位移公式
    // x=Vot+1/2at^2 Vt是末速度,Vo是初速度,a是加速度,t为时间,X是位移距离 x=Vot+1/2at^2 Vt=Vo+at V^2-Vo^2=2ax
    destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
    duration = speed / deceleration;

    if ( destination < lowerMargin ) {
      // 从左往右动
      destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
      // destination = lowerMargin
      distance = Math.abs(destination - current);
      duration = distance / speed;
    } else if ( destination > 0 ) {
      // 从右往左动
      destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
      // destination = 0;
      distance = Math.abs(current) + destination;
      duration = distance / speed;
    }

    return {
      destination: Math.round(destination),
      duration: duration
    };
  }

  _animate(destX, destY, duration, easingFn) {
    var that = this,
        startX = this.ele.x,
        startY = this.ele.y,
        startTime = new Date().getTime(),
        destTime = startTime + duration;

    function animate() {
      var now = new Date().getTime(),
          newX, newY,
          easing;

      if (now >= destTime) {
        that.isAnimating = false;
        // that._translate(destX, destY);

        that.ele.x = destX
        // that.ele.y = destY

        return;
      }

      now = (now - startTime) / duration;
      easing = easingFn(now);
      newX = (destX - startX) * easing + startX;
      newY = (destY - startY) * easing + startY;
      that.ele.x = newX
      // that.ele.y = newY

      if (that.isAnimating) {
        requestAnimationFrame(animate);
      }
    }

    this.isAnimating = true;
    animate();
  }


}