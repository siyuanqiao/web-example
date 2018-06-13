# controller
pixi的图片控制器

/*
 * demo地址: http://www.blueteapot.cn/demo/controller/test.php
 *
 *这个是手机版的，整成移动模式看吧，哪天心情好给改成pc版的，说明文件更新好几遍了，总改，今天不想再改了。
 */

用法：
var pic=new PIXI.Sprite.fromImage('xxx.jpg'); //创建一个对象

var ctrl=new Controller(); //创建控制器对象
ctrl.init(); //初始化控制器对象

//开始绑定对象,指定控制器控制它
/*
 *  target:要绑定的图片对象，类型：PIXI.Sprite
 * 	drag:是否可以拖动移动，默认为true
 * 	zoom:是否可以缩放，默认为false
 * 	rotate:是否可以旋转，默认为false
 * 	close:是否放上删除按钮，点了这个按钮图片和框框一起干掉，默认为true
 * 	transH和transV先无视，暂时没用
 */
ctrl.start({
	target:pic,
	drag:true,
	zoom:true,
	rotate:true,
	close:true
});

/*
 * 事件部分
 */

/*
 * 点击删除按钮后推送的事件
 */
Controller.KILL_ME

/*
 * 控制器的侦听事件的函数
 */
Controller.addEvent(eventName,callback);

/*
 * 控制器的解绑事件的函数
 */
Controller.killEvent(eventName);

/*
 * 板栗
 */

ctrl.addEvent(ctrl.KILL_ME,killPic);

function killPic(){

	alert('删除了图片');
	
	ctrl.killEvent(ctrl.KILL_ME);
	
}
