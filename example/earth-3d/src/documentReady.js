/**
 * Created by weibin.zeng on 16/8/8.
 */
(function(win){

    /*
    * 浏览器加载页面的顺序：
    * 1、 解析HTML结构
    * 2、 加载外部脚本和样式表文件
    * 3、 解析并执行脚本代码
    * 4、 构造HTML DOM模型==ready()
    * 5、 加载图片等组件
    * 6、 页面加载完毕==onload()
    * ready事件是在DOM模型构造完毕时触发
    * load事件是在页面加载完毕后触发
    * */
    win.documentReady=(function(){

        var funcs=[];

        var ready=false;

        function handler(event){
            if(ready)return;

            //如果发生onreadystatechange事件，但其状态不是complete的话，那么文档尚未准备好
            if(event.type==="onreadystatechange" && document.readyState!=="complete")
                return;

            //运行所有注册函数
            //注意每次都要计算funcs.length
            //以防这些函数的调用可能会导致注册更多地函数
            for(var i=0;i<funcs.length;i++){
                funcs[i].call(document);
            }

            //事件处理函数完整执行，切换ready状态，并移除所有函数
            if(document.addEventListener){
                document.removeEventListener("DOMContentLoaded",arguments.callee,false);
            }
            if(document.attachEvent){
                document.detachEvent("onreadystatechange",arguments.callee);
            }

            ready=true;
            funcs=null;
        }

        if(document.addEventListener){
            //DOMContentLoaded事件，firefox、chrome、opera、safari、ie9+都可以使用addEventListener(‘DOMContentLoaded',fn,false)进行事件绑定
            //第三个参数设置为 false，这样监听事件时只会监听冒泡阶段发生的事件.
            document.addEventListener("DOMContentLoaded",handler,false);

            document.addEventListener("readystatechange",handler,false);//IE9+
        }else{
            document.attachEvent("onreadystatechange",handler);
        }

        return function(fn){
            if(ready)
                fn.call(document);
            else
                funcs.push(fn);
        }
    }());

}(window));
