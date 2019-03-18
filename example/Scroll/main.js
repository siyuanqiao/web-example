(function(){
  var renderer,stage,view;
  var stageWidth=640,stageHeight;

  var winWidth=document.documentElement.clientWidth||document.body.clientWidth;
  var winHeight=document.documentElement.clientHeight||document.body.clientHeight;
  stageHeight=(stageWidth*winHeight)/winWidth;

  renderer = new PIXI.Application({
    width:stageWidth,
    height:stageHeight,
  });

  stage = new PIXI.Container();
  renderer.stage.addChild(stage);

  view=renderer.view;
  view.style.width=winWidth+'px';
  view.style.height=winHeight+'px';
  document.body.appendChild(view);

  var scrollContainer=new PIXI.Container()
  stage.addChild(scrollContainer);

  let i = 0,
      len = 30,
      width = 0;
  for(i;i<len;i++){
    var g1 = new PIXI.Graphics()
    g1.beginFill(0xffffff*Math.random())
    g1.drawRect(0,0,100,300)
    g1.endFill()
    g1.x = i * 100
    scrollContainer.addChild(g1)
    width += 100
  }

  var scroll = new Scroll(scrollContainer)
  scroll.children = {
    width:width
  }
}())
