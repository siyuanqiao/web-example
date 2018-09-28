# 视频播放器

## HTML
```
<div class="video-player" id="video_wrap">
    <div class="video-wrap">
        <video id="video" width="100%" preload="auto" poster="" src=""
               webkit-playsinline="true"
               x-webkit-airplay="true"
               x5-video-player-type="h5"
               playsinline>
        </video>
    </div>
    <div class="player-tips">
        <div class="playing"></div>
        <div class="waiting"><img src="img/waiting.png" alt=""></div>
        <div class="warning"></div>
        <div class="replaying"></div>
    </div>
    <div class="player-controls">
        <div class="controls-left">
            <button class="switch play">&nbsp;</button>&nbsp;
            <span class="time-current" style="">00:00</span>
        </div>
        <div class="controls-right">
            <span class="time-duration">00:00</span>&nbsp;
            <button class="mute mute-off">&nbsp;</button>
        </div>
        <div class="process-bar">
            <div class="process-bg"></div>
            <div class="process-buffer"></div>
            <div class="process-line"></div>
        </div>
    </div>
</div>
```

## JS

```js
/**
* @options
* @param {String} el - 视频元素id
* @param {String} url - 视频地址
* @param {Number} volume - 音量
* @param {Boolean} autoplay - 是否自动播放视频
* @param {Boolean} loop - 是否循环播放视频
* @param {Boolean} mute - 是否静音播放视频
*/
var options = {
	el: "#video_wrap",
	url: 'movie.mp4',////videos.akqa.com/work/nike/nba-connected-jersey/film.mp4
	autoplay: true,
	loop: false,
	volume: 1
}
var vp=new VideoPlayer(options);
```

