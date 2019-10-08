class Game extends PIXI.Application {

  constructor(config) {
    super(config)
  }

  start() {
    super.start()
    document.body.appendChild(this.view);

    var react = new PIXI.Graphics()
    react.beginFill(0xff0000)
    react.drawRect(0,0,100,100)
    react.endFill()
    this.stage.addChild(react)
  }
}