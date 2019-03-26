/*
* DOM添加类
* @param {HTMLElement} element - DOM元素
* @param {string} value - 类名
* */
export function addClass (element, value) {
  // eslint-disable-next-line
  var rspace = /\s+/,
    classNames,
    i,
    cl,
    setClass
  if (element.nodeType === 1) {
    if (value && typeof value === 'string') {
      classNames = value.split(rspace)
      if (!element.className && classNames.length === 1) {
        element.className = value
      } else {
        setClass = ' ' + element.className + ' '
        for (i = 0, cl = classNames.length; i < cl; i++) {
          if (!~setClass.indexOf(' ' + classNames[i] + ' ')) {
            setClass += classNames[i] + ' '
          }
        }
        element.className = setClass.trim()
      }
    }
  }
  return element
}

/*
* DOM删除类
* */
export function removeClass (elem, value) {
  var rspace = /\s+/
  var rclass = /[\n\t\r]/g
  var classNames,
    className,
    c,
    cl

  if (elem.nodeType === 1 && elem.className) {
    if ((value && typeof value === 'string') || value === undefined) {
      classNames = (value || '').split(rspace)

      if (value) {
        className = (' ' + elem.className + ' ').replace(rclass, ' ')
        for (c = 0, cl = classNames.length; c < cl; c++) {
          className = className.replace(' ' + classNames[c] + ' ', ' ')
        }
        elem.className = className.trim()
      } else {
        elem.className = ''
      }
    }
  }

  return elem
}

/*
* 判断DOM是否有某个类名
* */
export function hasClass (element, selector) {
  var rclass = /[\n\t\r]/g
  var className = ' ' + selector + ' '
  if ((' ' + element.className + ' ').replace(rclass, ' ').indexOf(className) > -1) {
    return true
  }
  return false
}

/*
* DOM添加/删除类的切换操作
* */
export function toggleClass (elem, value) {
  var rspace = /\s+/
  // toggle individual class names
  // eslint-disable-next-line
  var className,
    i = 0,
    classNames = value.split(rspace),
    fn

  while ((className = classNames[i++])) {
    fn = hasClass(elem, className) ? removeClass : addClass
    fn(elem, className)
  }
  return elem
}
