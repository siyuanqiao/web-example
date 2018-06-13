/*
 * pixi的图片控制器
 */
function Controller(texture, obj) {
	PIXI.Sprite.call(this, texture, obj);

	var self = this;
	self._isSceneIn = false;
	self.dic = new Array();
	self.KILL_ME = 'kill_me'; //删除目标和本框架事件

	var targetMc;
	var isDrag = true;
	var isZoom = false;
	var isRotate = false;
	var isTransH = false;
	var isTransV = false;
	var isCloseBtn = true;

	var dragBtn;
	var zoomBtn;
	var translateBtnH;
	var translateBtnV;
	var closeBtn;
	var rotateBtn;
	var kuang;
	var ctrlBox;

	var thisX = 0;
	var thisY = 0;
	var mouseX = 0;
	var mouseY = 0;

	var canZoom = false;
	var canRotate = false;
	var canMove = false;

	//初始化
	this.init = function() {
		ctrlBox = new PIXI.Container();

		dragBtn = new PIXI.Sprite.fromFrame('drag.png');
		dragBtn.anchor.set(0.5);

		zoomBtn = new PIXI.Sprite.fromFrame('zoom.png');
		zoomBtn.anchor.set(0.5);
		zoomBtn.interactive = true;

		translateBtnH = new PIXI.Sprite.fromFrame('translate.png');
		translateBtnH.anchor.set(0.5);
		translateBtnH.interactive = true;

		translateBtnV = new PIXI.Sprite.fromFrame('translate.png');
		translateBtnV.anchor.set(0.5);
		translateBtnV.interactive = true;

		rotateBtn = new PIXI.Sprite.fromFrame('rotate.png');
		rotateBtn.anchor.set(0.5);
		rotateBtn.interactive = true;

		closeBtn = new PIXI.Sprite.fromFrame('close.png');
		closeBtn.anchor.set(0.5);
		closeBtn.interactive = true;

		kuang = new PIXI.Graphics();

		closeBtn.on('pointerdown', self.killAll);

		zoomBtn.on('pointerdown', onZoomStart)
			.on('pointermove', onZoomMove)
			.on('pointerup', onZoomEnd)
			.on('pointerupoutside', onZoomEnd);

		rotateBtn.on('pointerdown', onRotateStart)
			.on('pointermove', onRotateMove)
			.on('pointerup', onRotateEnd)
			.on('pointerupoutside', onRotateEnd);

		kuang.interactive = true;
		kuang.on('pointerdown', onDragStart)
			.on('pointermove', onDragMove)
			.on('pointerup', onDragEnd)
			.on('pointerupoutside', onDragEnd);
	}

	/*
	 * 开始绑定一个对象
	 * obj参数：
	 * 	target:要绑定的图片对象，类型：PIXI.Sprite
	 * 	drag:是否可以拖动移动，默认为true
	 * 	zoom:是否可以缩放，默认为false
	 * 	rotate:是否可以旋转，默认为false
	 * 	close:是否放上删除按钮，点了这个按钮图片和框框一起干掉，默认为true
	 * 	transH和transV先无视，暂时没用
	 */
	this.start = function(obj) {
		targetMc = obj.target;
		isDrag = obj.drag;
		isZoom = obj.zoom;
		isRotate = obj.rotate;
		isTransH = obj.transH;
		isTransV = obj.transV;
		isCloseBtn = obj.close;
		
		console.log(isDrag);

		self._isSceneIn = true;

		if(targetMc.anchor) {
			if(targetMc.anchor.x != 0.5 || targetMc.anchor.y != 0.5) {
				var __x = targetMc.x;
				var __y = targetMc.y;
				targetMc.anchor.set(0.5);
				targetMc.x = __x + targetMc.width / 2;
				targetMc.y = __y + targetMc.height / 2;
			}
		}

		//添加外框
		kuang.lineStyle(2, 0xff0000, 1);
		kuang.beginFill(0xFF700B, 0);
		kuang.drawRect(-targetMc.width / 2, -targetMc.height / 2, targetMc.width, targetMc.height);
		self.addChild(kuang);
		self.x = targetMc.x;
		self.y = targetMc.y;
		self.rotation = targetMc.rotation;

		//添加控制按钮容器
		self.addChild(ctrlBox);

		//添加缩放按钮
		if(isZoom) {
			ctrlBox.addChild(zoomBtn);
			zoomBtn.x = -kuang.width / 2;
			zoomBtn.y = -kuang.height / 2;
		}

		//添加拖动控制按钮
		if(isDrag) {
			ctrlBox.addChild(dragBtn);
			dragBtn.x = 0;
			dragBtn.y = 0;
		}else{
			kuang.interactive = false;
		}

		//添加旋转按钮
		if(isRotate) {
			ctrlBox.addChild(rotateBtn);
			rotateBtn.x = kuang.width / 2;
			rotateBtn.y = kuang.height / 2;
		}

		//添加横切按钮
		if(isTransH) {
			ctrlBox.addChild(translateBtnH);
			translateBtnH.x = 0;
			translateBtnH.y = -kuang.height / 2;
		}

		//添加竖切按钮
		if(isTransV) {
			ctrlBox.addChild(translateBtnV);
			translateBtnV.x = -kuang.width / 2;
			translateBtnV.y = 0;
			translateBtnV.rotation = 90 * Math.PI / 180;
		}

		//添加删除按钮
		if(isCloseBtn) {
			ctrlBox.addChild(closeBtn);
			closeBtn.x = kuang.width / 2;
			closeBtn.y = -kuang.height / 2;
		}
	}

	//图片拖动部分
	function onDragStart(event) {
		var data = event.data;
		var newPosition = data.getLocalPosition(self.parent);
		thisX = newPosition.x - self.x;
		thisY = newPosition.y - self.y;
		mouseX = thisX;
		mouseY = thisY;
		canMove = true;
		ctrlHide();
	}

	function onDragMove(event) {
		if(!canMove) return;
		var data = event.data;
		var newPosition = data.getLocalPosition(self.parent);
		mouseX = newPosition.x;
		mouseY = newPosition.y;

		var xx = mouseX - thisX;
		var yy = mouseY - thisY;

		self.x = xx;
		self.y = yy;

		targetMc.x = self.x;
		targetMc.y = self.y;
	}

	function onDragEnd() {
		canMove = false;
		ctrlShow();
	}

	//图片旋转部分
	function onRotateStart(event) {
		var data = event.data;
		var newPosition = data.getLocalPosition(self.parent);
		thisX = newPosition.x - self.x;
		thisY = newPosition.y - self.y;
		mouseX = thisX;
		mouseY = thisY;
		canRotate = true;

		ctrlHide();
	}

	function onRotateMove(event) {
		if(!canRotate) return;
		var data = event.data;
		var newPosition = data.getLocalPosition(self.parent);
		thisX = newPosition.x;
		thisY = newPosition.y;

		var xx = mouseX - thisX;
		var yy = mouseY - thisY;

		if(yy > 0) {
			targetMc.rotation -= 2 * Math.PI / 180;
		} else if(yy < 0) {
			targetMc.rotation += 2 * Math.PI / 180;
		}

		resetKuang();

		self.rotation = targetMc.rotation;

		mouseX = thisX;
		mouseY = thisY;
	}

	function onRotateEnd() {
		canRotate = false;

		ctrlShow();
	}

	//图片放大缩小部分
	function onZoomStart(event) {
		var data = event.data;
		var newPosition = data.getLocalPosition(self.parent);
		thisX = newPosition.x - self.x;
		thisY = newPosition.y - self.y;
		mouseX = thisX;
		mouseY = thisY;
		canZoom = true;

		ctrlHide();
	}

	function onZoomMove(event) {
		if(!canZoom) return;
		var data = event.data;
		var newPosition = data.getLocalPosition(self.parent);
		thisX = newPosition.x;
		thisY = newPosition.y;

		var xx = mouseX - thisX;
		var yy = mouseY - thisY;

		var scale = 0;
		scale = targetMc.scale.x;
		if(xx < 0) {
			scale -= 0.05;
		} else if(xx > 0) {
			scale += 0.05;
		}
		if(scale < 0.1) scale = 0.1;
		targetMc.scale.set(scale);
		resetKuang();

		mouseX = thisX;
		mouseY = thisY;
	}

	function onZoomEnd() {
		canZoom = false;

		ctrlShow();
	}

	function ctrlHide() {
		ctrlBox.alpha = 0;
	}

	function ctrlShow() {
		zoomBtn.x = -kuang.width / 2;
		zoomBtn.y = -kuang.height / 2;

		rotateBtn.x = kuang.width / 2;
		rotateBtn.y = kuang.height / 2;

		closeBtn.x = kuang.width / 2;
		closeBtn.y = -kuang.height / 2;

		translateBtnH.x = 0;
		translateBtnH.y = -kuang.height / 2;

		translateBtnV.x = -kuang.width / 2;
		translateBtnV.y = 0;

		ctrlBox.alpha = 1;
	}

	function resetKuang() {
		kuang.clear();
		kuang.lineStyle(2, 0xff0000, 1);
		kuang.beginFill(0xFF700B, 0);
		kuang.drawRect(-targetMc.width / 2, -targetMc.height / 2, targetMc.width, targetMc.height);
	}

	this.killAll = function() {
		targetMc.parent.removeChild(targetMc);
		self.closeMe();
		dispatchEvent(self.KILL_ME);
	}

	this.closeMe = function() {
		var parentMc = self.parent;
		self.removeChild(rotateBtn);
		self.removeChild(closeBtn);
		kuang.clear();
		self.removeChild(kuang);
		targetMc = null;

		parentMc.removeChild(self);
		self._isSceneIn = false;
	}

	this.addEvent = function(eventName, callback) {
		self.dic[eventName] = callback;
	}

	this.killEvent = function(eventName) {
		if(self.dic[eventName]) {
			delete self.dic[eventName];
		}
	}

	function dispatchEvent(eventName) {
		if(self.dic[eventName]) {
			self.dic[eventName]();
		}
	}

	this.update = function() {

	}
}

Controller.constructor = Controller;
Controller.prototype = Object.create(PIXI.Sprite.prototype);