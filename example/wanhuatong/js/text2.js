var _w=window.innerWidth;var _h=window.innerHeight;
var renderer = PIXI.autoDetectRenderer(_w,_h);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

var page = new PIXI.ParticleContainer(16,{
    position:true,
    rotation:true
});
stage.addChild(page);
stage.interactive = true;
var arc = new PIXI.Graphics();
var dude = PIXI.Sprite.fromImage('img/bg1.jpg');
arc.beginFill('0x808080');
arc.drawRect(50, 250, 120, 120);
arc.endFill();
stage.addChild(arc);
//var pageBox = [];
//
//var totalPage = renderer instanceof PIXI.WebGLRenderer?16:100;
//console.log(totalPage);
//
//for(var i =0;i<totalPage;i++){
//
//
//}
animate();

function animate() {

    renderer.render(stage);
    requestAnimationFrame( animate );
}
