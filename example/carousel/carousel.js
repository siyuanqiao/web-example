// eslint-disable-next-line
import {addClass,removeClass,toggleClass,hasClass} from "../../util/class"

export function Carousel (element, options) {
  // 分页按钮 父div
  this.indicators = element.querySelector('.carousel-indicators')
  this.options = Object.assign(Carousel.DEFAULTS, options, element.dataset)
  // 是否暂停{true | false}
  this.paused = null
  // 是否在滚动{true | false}
  this.sliding = null
  this.interval = null

  this.element = element
  this.items = element.querySelectorAll('.item')
  this.pagings = element.querySelectorAll('[data-slide],[data-slide-to]')
  this.pagings.forEach((value) => {
    value.addEventListener('click', this.clickHandler.bind(this))
  })
  this.active = element.querySelector('.item.active')

  // mouseenter 当鼠标指针进入（穿过）元素时，暂停滚动：
  // mouseleave 当鼠标指针离开元素时，继续滚动：
  if (this.options.pause === 'hover' && !('ontouchstart' in document.documentElement)) {
    this.element.addEventListener('mouseenter', this.pause.bind(this))
    this.element.addEventListener('mouseleave', this.cycle.bind(this))
  }
}

Carousel.TRANSITION_DURATION = 600

Carousel.DEFAULTS = {
  interval: 2000,
  pause: 'hover',
  transition: true
}

// 自动 下一页轮询滚动
Carousel.prototype.cycle = function (e) {
  e || (this.paused = false)

  this.interval && clearInterval(this.interval)

  this.options.interval && !this.paused && (this.interval = setInterval(this.next.bind(this), this.options.interval))

  return this
}

Carousel.prototype.getItemIndex = function (item) {
  item = item || this.active
  let index = null
  let i = 0
  let len = this.items.length
  for (i; i < len; i++) {
    if (this.items[i] === item) {
      index = i
      break
    }
  }
  return index
}

Carousel.prototype.getItemForDirection = function (direction, activeEle) {
  // 获取活动元素的下标
  var activeIndex = this.getItemIndex(activeEle)

  if (direction === 'prev' && activeIndex === 0) {
    return this.items[this.items.length - 1]
  } else if (direction === 'next' && activeIndex === (this.items.length - 1)) {
    return this.items[0]
  } else {
    var delta = direction === 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.items.length
    return this.items[itemIndex]
  }
}

Carousel.prototype.to = function (pos) {
  var activeIndex = this.getItemIndex()

  if ((pos > this.items.length || pos < 1) || this.sliding || activeIndex === pos) return

  return this.slide(pos > activeIndex ? 'next' : 'prev', this.items[pos - 1])
}

Carousel.prototype.pause = function (e) {
  e || (this.paused = true)

  this.interval = clearInterval(this.interval)
  return this
}

Carousel.prototype.next = function () {
  if (this.sliding) return
  return this.slide('next')
}

Carousel.prototype.prev = function () {
  if (this.sliding) return
  return this.slide('prev')
}

Carousel.prototype.slide = function (type, nextEle) {
  var activeEle = this.element.querySelector('.item.active')
  nextEle = nextEle || this.getItemForDirection(type, activeEle)
  var isCycling = this.interval
  var direction = type === 'next' ? 'left' : 'right'

  if (hasClass(nextEle, 'active')) return (this.sliding = false)

  this.sliding = true

  isCycling && this.pause()

  // 更改分页按钮的激活状态
  if (this.indicators.children.length) {
    let activePagingItem = this.indicators.querySelector('.active')
    if (activePagingItem) removeClass(activePagingItem, 'active')

    let currentPagingItem = this.indicators.children[this.getItemIndex(nextEle)]
    if (currentPagingItem) addClass(currentPagingItem, 'active')
  }

  if (this.options.transition) {
    addClass(nextEle, type)
    // eslint-disable-next-line
    nextEle.offsetWidth // force reflow
    addClass(activeEle, direction)
    addClass(nextEle, direction)

    setTimeout(() => {
      removeClass(nextEle, [type, direction].join(' '))
      addClass(nextEle, 'active')

      removeClass(activeEle, ['active', direction].join(' '))

      this.sliding = false
    }, Carousel.TRANSITION_DURATION)
  } else {
    removeClass(activeEle, 'active')
    addClass(nextEle, 'active')

    this.sliding = false
  }

  isCycling && this.cycle()

  return this
}

Carousel.prototype.clickHandler = function (e) {
  let currentTarget = e.currentTarget
  let dataset = currentTarget.dataset
  if (dataset.slide) {
    // 上一页 或者 下一页
    this[dataset.slide]()
  } else if (dataset.slideTo) {
    // 跳转到指定的下标
    this.to(dataset.slideTo)
  }
  e.preventDefault()
}
