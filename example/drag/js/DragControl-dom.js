/*原生的鼠标拖动缓动*/

function DragControl_dom(__target, __hit) {
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

	obj.hit.addEventListener('mousedown', onMouseDown, false);
	obj.hit.addEventListener('touchstart', onMouseDownTouch, false);

	function onMouseDown(event) {
		isBegin = true;

		targetX = obj.target.offsetLeft;
		targetY = obj.target.offsetTop;

		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetXOnMouseDown = targetX;

		mouseYOnMouseDown = event.clientY - windowHalfY;
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
	
	
	
	function onMouseDownTouch(event){
		isBegin = true;

		targetX = obj.target.offsetLeft;
		targetY = obj.target.offsetTop;

		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetXOnMouseDown = targetX;

		mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
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
		var __x = obj.target.offsetLeft + (targetX - obj.target.offsetLeft) * obj.easeSpeed;
		var __y = obj.target.offsetTop + (targetY - obj.target.offsetTop) * obj.easeSpeed;

		//如果开启横向范围限制
		if(obj.limitX) {
			if(__x < obj.rangeX[0]) {
				__x = obj.rangeX[0];
			}
			if(__x > obj.rangeX[1] - obj.target.offsetWidth) {
				__x = obj.rangeX[1] - obj.target.offsetWidth;
			}
		}
		//如果开启竖向范围限制
		if(obj.limitY) {
			if(__y < obj.rangeY[0]) {
				__y = obj.rangeY[0];
			}
			if(__y > obj.rangeY[1] - obj.target.offsetHeight) {
				__y = obj.rangeY[1] - obj.target.offsetHeight;
			}
		}

		obj.target.style.left = __x + 'px';
		obj.target.style.top = __y + 'px';
	}

	return obj;
}