/*原生的鼠标拖动缓动*/

function DragControl_pixi(__target, __hit) {
	var obj = new Object;
	obj.target = __target;
	obj.hit = __hit || document;

	obj.easeSpeed = 0.05; //缓动系数
	obj.limitX = false; //是否开启横向的范围限制
	obj.limitY = false; //是否开启竖向的范围限制
	//横向范围
	obj.rangeX = [
		0,
		window.innerWidth
	];
	//竖向范围
	obj.rangeY = [
		0,
		window.innerHeight
	]

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var mouseX = 0;
	var mouseY = 0;
	var mouseXOnMouseDown = 0;
	var mouseYOnMouseDown = 0;
	var targetX = 0;
	var targetY = 0;
	var targetXOnMouseDown = 0;
	var targetYOnMouseDown = 0;

	var isBegin = false;

	if(obj.hit == document) {
		obj.hit.addEventListener('mousedown', onMouseDown, false);
		obj.hit.addEventListener('touchstart', onMouseDownTouch, false);
	} else {
		obj.hit.interactive = true;
		obj.hit.on('mousedown', onMouseDown);
		obj.hit.on('touchstart', onMouseDownTouch);
	}

	function onMouseDown(event) {
		isBegin = true;

		targetX = obj.target.x;
		targetY = obj.target.y;

		if(obj.hit == document) {
			mouseXOnMouseDown = event.clientX - windowHalfX;
			mouseYOnMouseDown = event.clientY - windowHalfY;
		} else {
			var newPosition = event.data.getLocalPosition(this.parent);
			mouseXOnMouseDown = newPosition.x - windowHalfX;
			mouseYOnMouseDown = newPosition.y - windowHalfY;
		}
		targetXOnMouseDown = targetX;
		targetYOnMouseDown = targetY;

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('mouseleave', onMouseUp, false);
	}

	function onMouseMove(event) {
		mouseX = event.clientX - windowHalfX;
		targetX = targetXOnMouseDown + (mouseX - mouseXOnMouseDown) * 1;

		mouseY = event.clientY - windowHalfY;
		targetY = targetYOnMouseDown + (mouseY - mouseYOnMouseDown) * 1;

	}

	function onMouseUp(event) {
		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mouseup', onMouseUp, false);
		document.removeEventListener('mouseleave', onMouseUp, false);
	}

	function onMouseDownTouch(event) {
		isBegin = true;

		targetX = obj.target.x;
		targetY = obj.target.y;

		if(obj.hit == document) {
			mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
			mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
		}else{
			var newPosition = event.data.getLocalPosition(this.parent);
			mouseXOnMouseDown = newPosition.x - windowHalfX;
			mouseYOnMouseDown = newPosition.y - windowHalfY;
		}
		
		targetXOnMouseDown = targetX;
		targetYOnMouseDown = targetY;

		document.addEventListener('touchmove', onMouseMoveTouch, false);
		document.addEventListener('touchend', onMouseUpTouch, false);
		document.addEventListener('touchcancel', onMouseUpTouch, false);
	}

	function onMouseMoveTouch(event) {
		mouseX = event.touches[0].pageX - windowHalfX;
		targetX = targetXOnMouseDown + (mouseX - mouseXOnMouseDown) * 1;

		mouseY = event.touches[0].pageY - windowHalfY;
		targetY = targetYOnMouseDown + (mouseY - mouseYOnMouseDown) * 1;
	}

	function onMouseUpTouch(event) {
		document.removeEventListener('touchmove', onMouseMoveTouch, false);
		document.removeEventListener('touchend', onMouseUpTouch, false);
		document.removeEventListener('touchcancel', onMouseUpTouch, false);
	}

	obj.update = function() {
		if(isBegin == false) return;
		var __x = obj.target.x + (targetX - obj.target.x) * obj.easeSpeed;
		var __y = obj.target.y + (targetY - obj.target.y) * obj.easeSpeed;

		//如果开启横向范围限制
		if(obj.limitX) {
			if(__x < obj.rangeX[0]) {
				__x = obj.rangeX[0];
			}
			if(__x > obj.rangeX[1] - obj.target.width) {
				__x = obj.rangeX[1] - obj.target.width;
			}
		}
		//如果开启竖向范围限制
		if(obj.limitY) {
			if(__y < obj.rangeY[0]) {
				__y = obj.rangeY[0];
			}
			if(__y > obj.rangeY[1] - obj.target.height) {
				__y = obj.rangeY[1] - obj.target.height;
			}
		}

		obj.target.x = __x;
		obj.target.y = __y;
	}

	return obj;
}