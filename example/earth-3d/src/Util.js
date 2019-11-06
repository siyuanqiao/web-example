/**
 * Created by weibin.zeng on 16/8/29.
 */


var Util=Util||{};


var Tool = {
    addClass: function (element, className) {
        var regClassName = new RegExp('(^| )' + className + '( |$)');
        //( /\s+/ 匹配任何空白符，包括\n,\r,\f,\t,\v等（换行、回车、空格、tab等）})
        if (!regClassName.test(element.className)) {
            element.className = element.className.split(/\s+/).concat(className).join(' ');
        }
    },
    removeClass: function (element, className) {
        var regClassName = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
        element.className = element.className.replace(regClassName, '');
    },
    hasClass:function (element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },
    toggleClass:function (element,className){
        if(this.hasClass(element,className)){
            this.removeClass(element, className);
        }else{
            this.addClass(element, className);
        }
    }
}