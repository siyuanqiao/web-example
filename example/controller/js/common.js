/*(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=640){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/
//<!---------------------------------------- 移动端版本兼容 end---------------------------------------------------------------------->

//<!----------------------------------------------判断横竖屏,isH为true时为横屏时提示(默认)，为false时为竖屏时提示------------------------->
setVH(true);
var isH;
function setVH(__isH){
	if(__isH==null){
		isH=true;
	}else{
		isH=__isH;
	}
	
	var hDiv;
	
	if(isH==true){//横屏时提示把屏竖过来
		hDiv = document.createElement('div');
		hDiv.id='landscape';
		hDiv.className='horizontal';
		document.body.appendChild(hDiv);
	}else{
		hDiv = document.createElement('div');
		hDiv.id='landscape';
		hDiv.className='vertical';
		document.body.appendChild(hDiv);
	}
}

//判断横屏
var initFlag = true;
var landscape = false;
function orien() {
	if(isH==true){//横屏时提示把屏竖过来
		if (window.orientation == 90 || window.orientation == -90) {
            if(initFlag) {
                initFlag = false;
                landscape = true;
            }
            $("#landscape").show();
        } else {
            $("#landscape").hide();
            if(landscape) {
                location.href = 'index.html?r='+Math.random();
            }else{
                if(initFlag) {
                    initFlag = false;
//                  LInit(1000/35, "main", gameWidth, gameHeight, main); //璁惧畾娓告垙閫熷害锛屽睆骞曞ぇ灏忥紝鍥炶皟鍑芥暟.
                }
            }
        }
	}else{//竖屏时提示把屏横过来
		if (window.orientation == 0 || window.orientation == 180) {
            if(initFlag) {
                initFlag = false;
                landscape = true;
            }
            $("#landscape").show();
        } else {
            $("#landscape").hide();
            if(landscape) {
                location.href = 'index.html?r='+Math.random();
            }else{
                if(initFlag) {
                    initFlag = false;
                }
            }
        }
	}
};

orien();
$(window).on("orientationchange", orien);
///---------------------------------------------------------------------判断横竖屏 end----------------------------------------------->

//<!---------------------------------------------------------------------判断打开设备----------------------------------------------->
//new WxMoment.OrientationTip();//如果是pc端打开的，则会自动显示二维码，并且能判断横竖屏

//判断是用什么设备打开的
var isAndroid = navigator.userAgent.toLowerCase().match(/android/i) == "android";
var isSafari = (/iPhone/i.test(navigator.platform) || /iPod/i.test(navigator.platform) || /iPad/i.test(navigator.userAgent)) && !!navigator.appVersion.match(/(?:Version\/)([\w\._]+)/);

//musicWX是判断是否是用微信打开的
var ua = navigator.userAgent, musicWX = /MicroMessenger/i.test(ua), ios =  /iPad|iPhone|iPod/.test(navigator.platform) || ua.indexOf('iphone') >= 0;
var QB;
var WeiXin=false;
if ( ua.indexOf('mttcustomua') > -1 || ua.indexOf('mqqbrowser') > -1 ) {
	QB = true;
};
if ( ua.indexOf('micromessenger') > -1 ) {
	WeiXin = true;
};


//判断如果是pc端打开的，则执行一些自定义操作
function IsPC()  
{  
   var userAgentInfo = navigator.userAgent;  
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
   var flag = true;  
   for (var v = 0; v < Agents.length; v++) {  
	   if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
   }  
   return flag;  
}  
var ispc=IsPC();
if(ispc==true){
	//$('#wrapper').hide();
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}