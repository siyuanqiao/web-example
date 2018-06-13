var VideoPlayer = function(params) {
    var setting={
        el:null,
        url:null,
        volume:1,
        mute:false
    }

    setting=Object.assign(setting,params);

    this._dom = $(params.el);
    this._video = this._dom.find("video")[0];

    if(setting.url)this._video.src = setting.url;
    if(setting.volume!=1)this._video.volume=setting.volume;
    if(setting.mute)this._video.mute=setting.mute;

    this._skin = new Skin(this._dom,this._video);
    this._skin.init();
};

var Skin = function(_dom , _video) {
    var scope = this;

    this._onState = null;
    this._onMute=false;

    //视频div层
    this._dom = _dom;
    //视频对象
    this._video = _video;

    //提示层
    this._playerTips=null;
    this._playing=null;
    this._waiting=null;
    this._replaying=null;

    //控制层
    this._playerControls=null;
    this._switchBtn=null;
    this._timeCurrent=null;
    this._timeDuration=null;
    this._processBar=null;
    this._processBuffer=null;
    this._processLine=null;
    this._muteBtn=null;

    this.init=function(){

        this._dom.mouseover(function(event){
            scope._playerControls.show();
        }).mouseout(function(event){
            if(scope._onState==null || scope._onState=='pause' || scope._onState=='ended'){

            }else{
                scope._playerControls.hide();
            }
        });

        this._playerTips=this._dom.find(".player-tips").click(function(e) {
            e.stopPropagation(); //不再派发事件
            if(scope._onState=='ended'){
                scope.toPlay();
                scope._replaying.hide();
            }else{
                scope.togglePlay();
            }
        });
        this._playing=this._dom.find('.playing');
        this._waiting=this._dom.find('.waiting');
        this._replaying=this._dom.find('.replaying');

        this._playerControls=this._dom.find('.player-controls');
        //播放和暂停按钮
        this._switchBtn=this._dom.find('.switch').click(function(e){
            e.stopPropagation(); //不再派发事件
            if(scope._onState=='ended'){
                scope.toPlay();
                scope._replaying.hide();
            }else{
                scope.togglePlay();
            }
        });
        this._timeCurrent=this._dom.find('.time-current').text(formatTime(0));
        this._timeDuration=this._dom.find('.time-duration').text(formatTime(0));
        this._processBar=this._dom.find('.process-bar').click(function(e){
            var offsetX=e.offsetX,barWidth=$(e.currentTarget).width();
            var n=(offsetX/barWidth);
            var d=_video.duration;
            var ct=n*d;
            console.log(offsetX,barWidth,n,ct,d);
            scope.seek(ct);
        });
        this._processBuffer=this._dom.find('.process-buffer');
        this._processLine=this._dom.find('.process-line');
        //静音按钮
        this._muteBtn=this._dom.find(".mute").click(function(e){
            e.stopPropagation();
            scope.onMute=!scope.onMute;
        });

        addVideoEvents(_video);
    }

    function addVideoEvents(_v) {
        //当音频/视频处于加载过程中时，会依次发生以下事件：
        _v.addEventListener("loadstart", function() {//客户端开始请求数据
            console.log('1、loadstart、客户端开始请求数据');
        }, false);
        _v.addEventListener("durationchange", function() {//资源长度改变
            console.log('2、durationchange、资源长度改变');
            scope._timeDuration.text(formatTime(_v.duration));
        }, false);
        _v.addEventListener("loadedmetadata", function() {
            console.log('3、loadedmetadata、');
        }, false);
        _v.addEventListener("loadeddata", function() {
            console.log('4、loadeddata、');
        }, false);
        _v.addEventListener("progress", function() {
            var log='5、progress、';
            if(_v.readyState == 4){
                var n=Math.round(_v.buffered.end(0) / _v.duration * 100);
                log+='正在缓冲：' + n + '%';
                scope.setProcess(n);
            }
            console.log(log);
        }, false);
        _v.addEventListener("canplay", function() {
            console.log('6、canplay、缓冲已足够开始时。-----每次卡住，再缓冲成功都会调用此方法');
            scope.hideWaiting();
        }, false);
        _v.addEventListener("canplaythrough", function() { //可以播放，歌曲全部加载完毕
            console.log('7、canplaythrough、');
        }, false);


        _v.addEventListener("waiting", function() {
            console.log('onwaiting,当媒介已停止播放但打算继续播放时（比如当媒介暂停已缓冲更多数据）运行脚本');
            scope.onState='waiting';
        }, false);
        _v.addEventListener("play", function() {}, false);
        _v.addEventListener("playing", function() {
            console.log('playing,当媒介已开始播放时运行的脚本。-----加载提示影藏');
            scope.onState='playing';
        }, false);
        _v.addEventListener("pause", function() {
            console.log('pause,当媒介被用户或程序暂停时运行的脚本。-----视频播放结束也会调用此方法');
            scope.onState='pause';
        }, false);
        _v.addEventListener("ended", function() {
            console.log('ended,当媒介已到达结尾（可发送类似“感谢观看”之类的消息）。');
            scope.onState='ended';
            scope.seek(0);
        }, false);


        _v.addEventListener("suspend", function() {}, false); //延迟下载
        _v.addEventListener("abort", function() {}, false); //客户端主动终止下载（不是因为错误引起）
        _v.addEventListener("stalled", function() {}, false); //网速失速
        _v.addEventListener("seeking", function() {}, false);
        _v.addEventListener("seeked", function() {}, false);

        _v.addEventListener("ratechange", function() {}, false); //播放速率改变
        _v.addEventListener("volumechange", function() {}, false); //音量改变
        _v.addEventListener("timeupdate", function() {
            scope.updateBar();
        }, false);

        _v.addEventListener("error", videoError, false);
    }

    function videoError() {
        var err = {};
        err.code = scope._video.error.code;
        err.error = ""
        switch (err.code) {
            case 1:
                err.error = "播放过程中用户终止";
                break;
            case 2:
                err.error = "播放过程中网络错误";
                break;
            case 3:
                err.error = "播放过程中解码错误";
                break;
            case 4:
                err.error = "播放过程中URL无效"
        }
        console.log(JSON.stringify(err));
        scope.showWarning();
    }

};
Skin.prototype = {
    set onMute(value){
      this._onMute=value;

      if(value)
          this._video.muted=true;
      else
          this._video.muted=false;

      this._muteBtn.toggleClass('mute-off mute-on');
    },
    get onMute(){
        return this._onMute;
    },
    set onState(value){
        this._onState=value;

        if(value=='waiting'){
            this.showWaiting();
        }else if(value=='playing'){
            this._switchBtn.removeClass('play pause').addClass('pause');
        }else if(value=='pause'){
            this._switchBtn.removeClass('play pause').addClass('play');
        }else if(value=='ended'){
            this.showEnded();
            this._playerControls.show();
        }
    },
    showPause: function() {},
    hidePause: function() {},
    showProcessBar: function() {},
    hideProcessBar: function() {},
    updateBar: function() {
        var length = parseInt(this._video.duration),
            ct = parseInt(this._video.currentTime),
            n =  ct / length *100;

        this._processLine.css({width: n+"%"});

        this._timeCurrent.text(formatTime(ct));
    },
    setProcess: function(n) {
        this._processBuffer.css('width',n+'%');
    },
    seek: function(e) {
        this._video.currentTime = e
    },
    toPlay: function() {
        this._video.play();

        this._playing.hide();
    },
    toPause: function() {
        this._video.pause();

        this._playing.show();
    },
    showWaiting: function() {
        this._waiting.show();
    },
    hideWaiting: function() {
        this._waiting.hide();
    },
    showWarning: function() {

    },
    togglePlay:function(){
        if(this._video.paused){
            this.toPlay();
        }else{
            this.toPause();
            //如果当前在加载则影藏加载，显示出播放按钮
            this.hideWaiting();
        }
    },
    showEnded:function(){
        this._replaying.show();
    }
};

//小于10前面加0
var t=function(num){
    if(num<10){
        return '0'+num.toString();
    }
    return num;
}

//秒转换成时分秒
var formatTime=function(time){
    var hours='',minutes='',seconds='';
    if(time>0){
        seconds=t(parseInt(time%60));
        if(time>=60){
            minutes=t(parseInt(time/60%60))+':';
            if(time>=3600){
                hours=t(parseInt(time/3600%24))+':';
            }
        }else{
            minutes='00:'
        }
    }else{
        seconds='00:00';
    }
    return hours+minutes+seconds;
}