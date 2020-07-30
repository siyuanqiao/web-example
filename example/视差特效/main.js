var view,
    stage,
    renderer,
    gameScene,
    stageWidth,
    stageHeight,
    stats;

var winWidth,
    winHeight;

window.onload=function(){

    winWidth=document.documentElement.clientWidth||document.body.clientWidth;
    winHeight=document.documentElement.clientHeight||document.body.clientHeight;

    initPIXI();
}

function initPIXI()
{
    /*
    * 缩放适配方案
    * 1、宽高比例不变
    * 2、canvas width=640，高度等比例设置（winWidth/winHeight=640/x)
    * 3、canvas css(width=winWidth,height=winHeight)
    * */

    var width=640;//设计图的宽度

    // stageWidth=width;
    // stageHeight=(width*winHeight)/winWidth;
    stageWidth=winWidth;
    stageHeight=winHeight;

    view=document.getElementById('pixi_view');
    view.style.width=winWidth+'px';
    view.style.height=winHeight+'px';

    renderer = new PIXI.Application({
        width:stageWidth,
        height:stageHeight,
        view:view,
        // backgroundColor:0xff0000,
        transparent: true //透明背景
    });

    stage = new PIXI.Container();

    renderer.stage.addChild(stage);

    var g1=getGraphics(400,200,0xffcccc,0.5);
    g1.distancex=80;
    g1.distancey=80;
    stage.addChild(g1);

    var g2=getGraphics(300,150,0xff9999,0.5);
    stage.addChild(g2);
    g2.distancex=40;
    g2.distancey=40;

    var g3=getGraphics(200,100,0xff6666,0.5);
    stage.addChild(g3);
    g3.distancex=20;
    g3.distancey=20;

    stage.interactive=true;
    stage.on('pointermove',mousemove);

    function mousemove(event){
        //console.log(event.data.global.x,event.data.global.y);
        var _mouseX=event.data.global.x;
        var _mouseY=event.data.global.y;
        var _centerX=stageWidth/2;
        var _centerY=stageHeight/2;
        var _biliX=(_mouseX-_centerX)/_centerX;
        var _biliY=(_mouseY-_centerY)/_centerY;
        moveEle(_biliX,_biliY);
    }

    var arr=[g1,g2,g3];
    function moveEle(_biliX,_biliY){
        for(var i=0,len=arr.length;i<len;i++){
            var g1=arr[i];
            g1.x=g1.initX+(g1['distancex']*_biliX);
            g1.y=g1.initY+(g1['distancey']*_biliY);
        }
    }

    var os='';
    if(navigator.userAgent.indexOf('iPhone')>-1){
        os = 'ios';
    }else{
        os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
    }

    if (window.DeviceOrientationEvent) {
        //deviceOrientation：封装了方向传感器数据的事件，可以获取手机静止状态下的方向数据（设备的物理方向信息）。
        window.addEventListener("deviceorientation", orientationHandler, false);
    } else {
        alert("not support deviceorientation event");
    }

    function orientationHandler(event) {
        var _z=event.alpha;//表示设备沿z轴上的旋转角度，范围为0~360。(z轴垂直于平面)
        var _x = event.beta;//表示设备在x轴上的旋转角度，范围为-180~180。它描述的是设备由前向后旋转的情况。
        var _y = event.gamma;//表示设备在y轴上的旋转角度，范围为-90~90。它描述的是设备由左向右旋转的情况。
        moveEle((_y/90),(_x/180));
        document.getElementById("a").innerHTML = 'z:'+_z.toFixed(1);
        document.getElementById("b").innerHTML = 'x:'+_x.toFixed(1);
        document.getElementById("c").innerHTML = 'y:'+(_y/90).toFixed(5);
    }

    initScene1();
    animate();

}
function initScene1()
{


}
function getGraphics(width,height,color,alpha){
    var graphics = new PIXI.Graphics();
    graphics.beginFill(color, alpha);
    graphics.drawRect(0, 0, width, height);
    graphics.initX=(stageWidth-graphics.width)/2;
    graphics.initY=(stageHeight-graphics.height)/2;
    graphics.x=graphics.initX;
    graphics.y=graphics.initY;
    return graphics;
}

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(stage);
    if(stats)stats.update();
    if(gameScene)gameScene.update();
};

