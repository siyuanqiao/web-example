var _w = _h = window.innerHeight;
var     renderer = PIXI.autoDetectRenderer(_w, _h, { antialias: true });


if(_h>=window.innerWidth){
    document.getElementById('wrap').style.marginLeft = -window.innerHeight/2+'px'
}else{
    document.getElementById('wrap').style.marginLeft = -window.innerWidth/2+'px'
}

document.getElementById('wrap').appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;
var pageX=0.47,pageY=0.47;
document.addEventListener('mousemove',function(event){
    pageX = event.pageX/window.innerWidth/2;
    pageY = event.pageY/window.innerHeight/2;
//    console.log(pageX+","+pageY)
})
var curX =0.47,curY =0.47;
document.addEventListener('touchmove',function(e){
    e=e||window.event;
    curX=(!!e.changedTouches? e.changedTouches[0].pageX: e.pageX)/1280  ;
    curY=(!!e.changedTouches? e.changedTouches[0].pageY: e.pageY)/window.innerHeight/2;
})
//stage.mousemove = stage.touchmove = function(data)
//{
//    var mousePosition = data.getLocalPosition(stage);
//    console.log(mousePosition.x);
//}

var pos={
    X:['1','1','1',(Math.tan(Math.PI/8)+1)/2,'0.5',1-(Math.tan(Math.PI/8)+1)/2,'0','0','0','0','0',1-(Math.tan(Math.PI/8)+1)/2,'0.5',(Math.tan(Math.PI/8)+1)/2,'1','1','1'],
    Y:['0.5',(Math.tan(Math.PI/8)+1)/2,'1','1','1','1','1',(Math.tan(Math.PI/8)+1)/2,'0.5',1-(Math.tan(Math.PI/8)+1)/2,'0','0','0','0','0',1-(Math.tan(Math.PI/8)+1)/2,'0.5']
}
var pic=['img/bg1.jpg','img/bg2.jpg','img/bg3.jpg']

var img=pic[0];


var light1 = PIXI.Sprite.fromImage(img);
var light2 = PIXI.Sprite.fromImage(img);
var light3 = PIXI.Sprite.fromImage(img);
var light4 = PIXI.Sprite.fromImage(img);
var light5 = PIXI.Sprite.fromImage(img);
var light6 = PIXI.Sprite.fromImage(img);
var light7 = PIXI.Sprite.fromImage(img);
var light8 = PIXI.Sprite.fromImage(img);
var lightB1 = PIXI.Sprite.fromImage(img);
var lightB2 = PIXI.Sprite.fromImage(img);
var lightB3 = PIXI.Sprite.fromImage(img);
var lightB4 = PIXI.Sprite.fromImage(img);
var lightB5 = PIXI.Sprite.fromImage(img);
var lightB6 = PIXI.Sprite.fromImage(img);
var lightB7 = PIXI.Sprite.fromImage(img);
var lightB8 = PIXI.Sprite.fromImage(img);
var thing1 = new PIXI.Graphics();
var thing2 = new PIXI.Graphics();
var thing3 = new PIXI.Graphics();
var thing4 = new PIXI.Graphics();
var thing5 = new PIXI.Graphics();
var thing6 = new PIXI.Graphics();
var thing7 = new PIXI.Graphics();
var thing8 = new PIXI.Graphics();
var thingB1 = new PIXI.Graphics();
var thingB2 = new PIXI.Graphics();
var thingB3 = new PIXI.Graphics();
var thingB4 = new PIXI.Graphics();
var thingB5 = new PIXI.Graphics();
var thingB6 = new PIXI.Graphics();
var thingB7 = new PIXI.Graphics();
var thingB8 = new PIXI.Graphics();


var count = 0;
var lightBox=[];
var lightBBox=[];

function light(lightNum,thingNum,index){
    lightNum = PIXI.Sprite.fromImage('img/bg2.jpg');
    lightNum.position.x = renderer.width / 2;
    lightNum.position.y = renderer.height / 2;
    lightNum.anchor.x = 0.5;
    lightNum.anchor.y = 0.5;
    stage.addChild(lightNum);
    lightBox.push(lightNum)
    
    stage.addChild(thingNum);
    thingNum.lineStyle(0);
    thingNum.beginFill(0x8bc5ff, 0.4);
    thingNum.moveTo(0.5*_w, 0.5*_h );
    thingNum.lineTo(pos.X[(index-1)*2] *_w, pos.Y[(index-1)*2]*_h);
    thingNum.lineTo(pos.X[index*2-1] *_w, pos.Y[index*2-1]*_h);
    thingNum.endFill();
    lightNum.rotation = (Math.PI/4)*(index-1) +count;
    lightNum.mask = thingNum;

}

function lightB(lightNum,thingNum,index){
    lightNum = PIXI.Sprite.fromImage('img/bg2.jpg');
    lightNum.position.x = renderer.width / 2;
    lightNum.position.y = renderer.height / 2;
    lightNum.anchor.x = 0.5;
    lightNum.anchor.y = 0.5;
    stage.addChild(lightNum);
    lightBBox.push(lightNum);

    stage.addChild(thingNum);
    thingNum.lineStyle(0);
    thingNum.beginFill(0x8bc5ff, 0.4);
    thingNum.moveTo(0.5*_w, 0.5*_h );
    thingNum.lineTo(pos.X[(index-1)*2+1] *_w, pos.Y[(index-1)*2+1]*_h);
    thingNum.lineTo(pos.X[index*2] *_w, pos.Y[index*2]*_h);
    thingNum.endFill();
    lightNum.rotation = (Math.PI*5/4)+(Math.PI/4)*(index-1);

    lightNum.scale.x = -1;
    lightNum.mask = thingNum;

}

light(light1,thing1,1);
light(light2,thing2,2);
light(light3,thing3,3);
light(light4,thing4,4);
light(light5,thing5,5);
light(light6,thing6,6);
light(light7,thing7,7);
light(light8,thing8,8);

lightB(lightB1,thingB1,1);
lightB(lightB2,thingB2,2);
lightB(lightB3,thingB3,3);
lightB(lightB4,thingB4,4);
lightB(lightB5,thingB5,5);
lightB(lightB6,thingB6,6);
lightB(lightB7,thingB7,7);
lightB(lightB8,thingB8,8);
animate();


var flag = -1;

var flag1 = -1;
function IsPC()
{
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");

    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {

            flag1 = 1; break;
        }
    }
    return flag1;
}

IsPC();


function animate()
{
    if(flag1>0){
        animateSJ();
    }else{
        animatePC();
    }

    renderer.render(stage);
    requestAnimationFrame(animate);
}

function animateSJ(){
    if(curX+count>0.02&&curX+count<0.47&&curY+count>0.02&&curY+count<0.47){
        for(var i=0;i<lightBox.length;i++){
            lightBox[i].anchor.x =curX+count;
            lightBox[i].anchor.y =curY+count;
            lightBBox[i].anchor.x =curX+count;
            lightBBox[i].anchor.y =curY+count;
        }
    }
    if((curX+count) <= 0.02||(curY+count) <= 0.02){
        flag = 1;
    }else if((curX+count) >= 0.47||(curY+count) >= 0.47){
        flag = -1;
    }
    count +=flag*0.00035;
}
function animatePC(){
    if(pageX+count>0.02&&pageX+count<0.47&&pageY+count>0.02&&pageY+count<0.47){
        for(var i=0;i<lightBox.length;i++){
            lightBox[i].anchor.x =pageX+count;
            lightBox[i].anchor.y =pageY+count;
            lightBBox[i].anchor.x =pageX+count;
            lightBBox[i].anchor.y =pageY+count;
        }
    }
    if((pageX+count) <= 0.02||(pageY+count) <= 0.02){
        flag = 1;
    }else if((pageX+count) >= 0.47||(pageY+count) >= 0.47){
        flag = -1;
    }
    count +=flag*0.00005;

}
