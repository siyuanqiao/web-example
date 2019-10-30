class Game extends PIXI.Application {

  constructor(config) {
    super(config)
  }

  start() {
    super.start()
    document.body.appendChild(this.view);

    var scrollContainer=new PIXI.Container()
    this.stage.addChild(scrollContainer);

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
  }
}