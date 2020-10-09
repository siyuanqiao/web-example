//var _w=Math.min(1400,window.innerWidth);
//var _h=Math.min(1375,window.innerHeight);
var _h=_w=200;
var r=Math.pow(_w*_w+_h+_h,1/2);

var canvas, ctx,pattern,canvasBack,ctxBack;

var pageNum = 16;
var x=0,y=0;
var bgPic = new Image();
var bgPic1 = new Image();
document.body.onload = game;
function game(){
    init();
    bgPic.onload = function(){
    gameloop();
    }
}

function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = _w;
    canvas.height =_h;

    canvasBack = document.getElementById('canvasBack');
    ctxBack=canvasBack.getContext('2d');
    canvasBack.width=1400;
    canvasBack.height = 1375;



    bgPic.src='img/bg1.jpg';


}
function gameloop(){
    window.requestAnimationFrame(gameloop);
        x+=1;
        //console.log(x);
        ctxBack.drawImage(bgPic,x,y);
        pattern = ctx.createPattern(canvasBack, 'no-repeat');
        ctx.fillStyle = pattern;
        drawPage();

//    drawBg()
}
function trans(){
    ctx.fillStyle = "rgb(250,0,0)";
    ctx.save();
    ctx.translate(50,50);
    ctx.rotate(-Math.PI/8);
    ctx.translate(-50,-50);
    ctx.fillRect(50,50,100,200);


    ctx.fillStyle="rgb(0,255,0)";
    ctx.translate(50,50);
    ctx.rotate(-Math.PI/6);
    ctx.translate(-50,-50);
    ctx.fillRect(50,50,100,200);

    ctx.restore();
    ctx.fillStyle = "rgb(0,0,250)";
    ctx.fillRect(50,50,5,5);

}
function drawBg(){
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

function drawPage(){

    for(var i=0;i<pageNum/2;i++){
        ctx.beginPath();
        ctx.translate(0.5*_w,0.5*_h);
        ctx.rotate((720/pageNum)*Math.PI/180);
        ctx.translate(-0.5*_w,-0.5*_h);
        ctx.closePath();
        ctx.sector(0.5*_w,0.5*_h,r,(Math.PI*2/pageNum)*0,(Math.PI*2/pageNum)*(0+1)).fill();
    }
    /*for(var i=0;i<pageNum/2;i++){
        ctx.translate(0.5*_w,0.5*_h);
        ctx.rotate((720/pageNum)*Math.PI/180);
        ctx.translate(-0.5*_w,-0.5*_h);

        for(var j=0;j<2;j++){
            ctx.translate(0.5*_w,0.5*_h);
            ctx.scale(-1, 1);
            ctx.translate(-0.5*_w,-0.5*_h);

            ctx.sector(0.5*_w,0.5*_h,r,(Math.PI*2/pageNum)*0,(Math.PI*2/pageNum)*(0+1)).fill();
        }

    }*/
}
CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
    this.save();//保存当前环境的状态
    this.translate(x, y);//translate() 方法重新映射画布上的 (0,0) 位置。
    this.beginPath();//beginPath() 方法开始一条路径，或重置当前的路径。
    this.arc(0,0,radius,sDeg, eDeg);//arc() 方法创建弧/曲线（用于创建圆或部分圆）。
    this.save();
    this.rotate(eDeg);//旋转当前绘图
    this.moveTo(radius,0);//把路径移动到画布中的指定点，不创建线条
    this.lineTo(0,0);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
    this.restore();//返回之前保存过的路径状态和属性
    this.rotate(sDeg);
    this.lineTo(radius,0);
    this.closePath();//创建从当前点回到起始点的路径
    this.restore();
    return this;
};
