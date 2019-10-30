class ScrollView {
  _content
  wrapperWidth
  wrapperHeight
  scrollerWidth
  scrollerHeight
  maxScrollX
  maxScrollY
  startTime = 0
  start = {x: 0, y: 0, x1: 0, y1: 0}
  deceleration = 0.001 // 0.004 0.0006

  constructor(obj) {
    let {content, wrapperWidth, wrapperHeight, scrollerWidth, scrollerHeight} = obj

    this.wrapperWidth = wrapperWidth
    this.wrapperHeight = wrapperHeight
    this.scrollerWidth = scrollerWidth
    this.scrollerHeight = scrollerHeight
    this.maxScrollX = this.wrapperWidth - this.scrollerWidth
    this.maxScrollY = this.wrapperHeight - this.scrollerHeight

    this.setContent(content)
  }

  setContent(content){
    if (this._content === content) return

    if (content) {
      this._content = content
      this._addEvents()
    }
  }

  _addEvents(){
    this._content.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.scrollerWidth, this.scrollerHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true
    })
    this._content.on("pointerdown", this._onPointerDown, this)
    this._content.on("dragstart", this._onDragStart, this)
    this._content.on("dragend", this._onDragEnd, this)
    this._content.on("drag", this._onDrag, this)
  }

  _onPointerDown() {
    // console.log('pointerdown:', pointer, dragX, dragY)
    // this.scene.stMap.mapData.screen2map(dragX, dragY)
  }

  /**
   * @param dragX 鼠标拖动点相对于拖动对象(0,0)点的X坐标
   * @param dragY 鼠标拖动点相对于拖动对象(0,0)点的Y坐标
   * */
  _onDragStart(pointer, dragX, dragY) {
    // console.log('onDragStart:', dragX, dragY)
    this.startTime = new Date().getTime()
    this.start.x = this.start.x1 = this._content.parentContainer.x
    this.start.y = this.start.y1 = this._content.parentContainer.y
  }

  _onDragEnd(){
    // let duration = new Date().getTime() - this.startTime
    // let momentumX = momentum(this._content.parentContainer.x, this.start.x1, duration, this.maxScrollX, 0, this.deceleration)
    // let momentumY = momentum(this._content.parentContainer.y, this.start.y1, duration, this.maxScrollY, 0, this.deceleration)
    // let newX = momentumX.destination
    // let newY = momentumY.destination
    // let time = Math.max(momentumX.duration, momentumY.duration)
    // console.log('start xy:', this.startX, this.startY)
    // console.log('cur xy:', this.parentContainer.x, this.parentContainer.y)
    // console.log('end xy:', newX, newY)
    // console.log('time:', momentumX.duration, momentumY.duration, time)


    this.start.x = this.start.y = 0
    this.start.x1 = this.start.y1 = 0
  }

  /**
   * @param dragX 指针当前拖动游戏对象的x坐标
   * @param dragY 指针当前拖动游戏对象的y坐标
   * */
  _onDrag(pointer, dragX, dragY){
    // 开始x坐标 + 拖动点x轴偏移量
    let x = this.start.x + (dragX + Math.abs(this._content.x))
    let y = this.start.y + (dragY + Math.abs(this._content.y))
    x = x >= 0 ? 0 : x <= this.maxScrollX ? this.maxScrollX : x
    y = y >= 0 ? 0 : y <= this.maxScrollY ? this.maxScrollY : y

    console.log("dragX:", dragX)
    // Slow down if outside of the boundaries
    // if ( x > 0 || x < this.maxScrollX ) {
    //   x = this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
    // }
    // if ( newY > 0 || newY < this.maxScrollY ) {
    //   newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
    // }


    // console.log(x, y)
    this._content.parentContainer.x = x
    this._content.parentContainer.y = y

    let timestamp = new Date().getTime()
    if (timestamp - this.startTime > 300) {
      this.startTime = timestamp
      this.start.x1 = x
      this.start.y1 = y
    }
  }
}