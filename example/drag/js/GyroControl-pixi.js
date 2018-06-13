/*原生的通过陀螺仪让目标进行移动*/

function GyroControl_pixi(__target) {
	var obj = new Object;
	obj.target = __target;

	var stageWidth = window.innerWidth;
	var stageHeight = window.innerHeight;

	//背景图的宽和高
	var bgWidth = 0;
	var bgHeight = 0;

	//可移动的空间
	var mayMoveWidth = 0;
	var mayMoveHeight = 0;

	//可移动的角度空间，值越高活动的范围就越小，移动的就越慢。如果只左右动的话，就把上下设成0。只上下动的话就把左右设成0
	obj.mayHX = [300, 300]; //左、右
	obj.maySX = [300, 300]; //上、下

	//范围控制
	obj.fwArr = [
		[100, -100],
		[62, -35]
	]; //[左，右][上，下]的可移动的范围，就是上下左右的移动边界

	var isBegin = false;
	var _top, preTop, _left, preLeft;

	setTimeout(function() {
		initData();
	}, 100);

	function initData() {
		bgWidth = Number($("#main_bg img:first-child").width());
		bgHeight = Number($("#main_bg img:first-child").height());

		mayMoveWidth = (window.innerWidth - bgWidth) * 0.5;
		mayMoveHeight = (window.innerHeight - bgHeight) * 0.5;

		preTop = obj.target.x;
		preLeft = obj.target.y;

		GangG();
	}

	function GangG() {
		var bg_tx, bg_ty, bg_y_val, bg_start_x, bg_min_y, bg_max_y;

		validSample = false;
		firstSample = null;
		friction = 0.0; // 陀螺仪运动的摩擦力/振动阻尼。 可设置的数值: 0.0 ~ 0.99 或 auto; 数值越高，阻尼越明显，但这样运动也会延迟得更多。
		degRad = Math.PI / 180;

		gyro = {
			hlookat: 0,
			vlookat: 0,
			camroll: 0,
			touchfriction: 0.87
		}; //touchfriction 触摸屏操控模式下每次缩放的场景形变程度

		window.addEventListener("deviceorientation", handleDeviceOrientation);

		//$(window).on('deviceorientation',handleDeviceOrientation);

		hOffset = window.orientation;
		vOffset = 0;
		hLookAt = 0;
		vLookAt = 0;
		camRoll = 0;
		vElasticSpeed = 0;

		isCamRoll = false; // isCamRoll 根据设备翻转对全景浏览器的摄影机翻转或调平。

		//  view hlookat=0.0 水平视角 -180 至 180 之间

		//  vlookat=0.0 垂曲视角 -90 至 90 之间

		//  camroll=0.0 镜头扭转视角

		function handleDeviceOrientation(event) {
			//					if(stop_gyro_flag || tfboys_room_flag || page_tfboys_stars_flag) return false;
			// Process event.alpha, event.beta and event.gamma
			var deviceOrientation = window.orientation,
				orientation = rotateEuler({
					yaw: event["alpha"] * degRad,
					pitch: event["beta"] * degRad,
					roll: event["gamma"] * degRad
				}),
				yaw = wrapAngle(orientation.yaw / degRad),
				pitch = orientation.pitch / degRad,
				altYaw = yaw,
				factor,
				hLookAtNow = gyro.hlookat,
				vLookAtNow = gyro.vlookat,
				camRollNow = gyro.camroll,
				hSpeed = hLookAtNow - hLookAt,
				vSpeed = vLookAtNow - vLookAt;

			// Ignore all sample untill we get a sample that is different from the first sample
			if(!validSample) {
				if(firstSample == null)
					firstSample = orientation;
				else {
					if(orientation.yaw != firstSample.yaw || orientation.pitch != firstSample.pitch || orientation.roll != firstSample.roll) {
						firstSample = null;
						validSample = true;
						//if(isVRelative) vOffset = -pitch;
					}
				}

				return;
			}

			// Roll / level the viewer camera according to the device roll.
			if(isCamRoll) {
				camRoll = wrapAngle(180 + Number(deviceOrientation) - orientation.roll / degRad);
			}

			// Fix gimbal lock
			if(Math.abs(pitch) > 70) {
				altYaw = event.alpha;

				switch(deviceOrientation) {
					case 0:
						if(pitch > 0)
							altYaw += 180;
						break;
					case 90:
						altYaw += 90;
						break;
					case -90:
						altYaw += -90;
						break;

					case 180:
						if(pitch < 0)
							altYaw += 180;
						break;
				}

				altYaw = wrapAngle(altYaw);
				if(Math.abs(altYaw - yaw) > 180)
					altYaw += (altYaw < yaw) ? 360 : -360;

				factor = Math.min(1, (Math.abs(pitch) - 70) / 10);
				yaw = yaw * (1 - factor) + altYaw * factor;

				camRoll *= (1 - factor);
			}

			// Track view change since last orientation event
			// ie: user has manually panned, or krpano has altered lookat
			hOffset += hSpeed;
			vOffset += vSpeed;

			// Clamp vOffset
			if(Math.abs(pitch + vOffset) > 90)
				vOffset = (pitch + vOffset > 0) ? (90 - pitch) : (-90 - pitch);

			hLookAt = wrapAngle(-yaw - 180 + hOffset);
			vLookAt = Math.max(Math.min((pitch + vOffset), 90), -90);

			// Dampen lookat
			if(Math.abs(hLookAt - hLookAtNow) > 180)
				hLookAtNow += (hLookAt > hLookAtNow) ? 360 : -360;

			hLookAt = (1 - friction) * hLookAt + friction * hLookAtNow;
			vLookAt = (1 - friction) * vLookAt + friction * vLookAtNow;

			if(Math.abs(camRoll - camRollNow) > 180)
				camRollNow += (camRoll > camRollNow) ? 360 : -360;
			camRoll = (1 - friction) * camRoll + friction * camRollNow;

			gyro.hlookat = wrapAngle(hLookAt);
			gyro.vlookat = vLookAt;
			gyro.camroll = wrapAngle(camRoll);

			var x_offset = getOffsetValue(gyro.hlookat);

			//场景控制----------------------------------

			//主场景没准备好的时候，不执行搜寻

			var y_beta = 90 - Math.round(gyro.vlookat);

			bg_y_val = y_beta - 90;

			_left = Math.floor(-Math.round(x_offset) * mayMoveWidth / obj.mayHX[0] + preLeft);

			_top = Math.floor(-(bg_y_val) * mayMoveHeight / obj.maySX[0] + preTop);

			//场景控制结束-----------------------

			if(vOffset != 0 && vElasticity > 0) {
				if(vSpeed == 0) {
					if(vElasticity == 1) {
						vOffset = 0;
						vElasticSpeed = 0;
					} else {
						vElasticSpeed = 1 - ((1 - vElasticSpeed) * gyro.touchfriction);
						vOffset *= 1 - (Math.pow(vElasticity, 2) * vElasticSpeed); // use Math.pow to be able to use saner values

						if(Math.abs(vOffset) < 0.1) {
							vOffset = 0;
							vElasticSpeed = 0;
						}
					}
				} else
					vElasticSpeed = 0;
			}
		}
	}

	obj.update = function() {
		if(_left != undefined) {
			obj.target.x = _left;
		}
		if(_top != undefined) {
			obj.target.y = _top;
		}
	}

	function rotateEuler(euler) {
		var heading, bank, attitude,
			ch = Math.cos(euler.yaw),
			sh = Math.sin(euler.yaw),
			ca = Math.cos(euler.pitch),
			sa = Math.sin(euler.pitch),
			cb = Math.cos(euler.roll),
			sb = Math.sin(euler.roll),

			matrix = [
				sh * sb - ch * sa * cb, -ch * ca, ch * sa * sb + sh * cb,
				ca * cb, -sa, -ca * sb,
				sh * sa * cb + ch * sb, sh * ca, -sh * sa * sb + ch * cb
			]; // Note: Includes 90 degree rotation around z axis

		/* [m00 m01 m02] 0 1 2
		 * [m10 m11 m12] 3 4 5
		 * [m20 m21 m22] 6 7 8 */

		if(matrix[3] > 0.9999) {
			// Deal with singularity at north pole
			heading = Math.atan2(matrix[2], matrix[8]);
			attitude = Math.PI / 2;
			bank = 0;
		} else if(matrix[3] < -0.9999) {
			// Deal with singularity at south pole
			heading = Math.atan2(matrix[2], matrix[8]);
			attitude = -Math.PI / 2;
			bank = 0;
		} else {
			heading = Math.atan2(-matrix[6], matrix[0]);
			bank = Math.atan2(-matrix[5], matrix[4]);
			attitude = Math.asin(matrix[3]);
		}

		return {
			yaw: heading,
			pitch: attitude,
			roll: bank
		};
	}

	// utility functions

	function wrapAngle(value) {
		value = value % 360;
		return(value <= 180) ? value : value - 360;
	} // wrap a value between -180 and 180

	function getOffsetValue(current_val) {
		var offsetVlaue = 0;
		if(current_val > -180) {
			offsetVlaue = -current_val;
		} else {
			offsetVlaue = -360 - current_val;
		}
		return offsetVlaue;
	}

	return obj;
}