function PlaneMesh(__texture, __row, __col) {
	PIXI.mesh.Plane.call(this, __texture, __row, __col);

	var self = this;
	var dotArr = [];

	var moveEnd = true;

	init();

	function init() {
		//console.log(self.width, self.height);
		for(var i = 0; i < __col; i++) {
			for(var j = 0; j < __row; j++) {
				/*var dot = creatBall();
				container.addChild(dot);*/
				var dot = {
					x: 0,
					y: 0
				};
				dot.x = j * (self.width / (__row - 1));
				dot.y = i * (self.height / (__col - 1));
				dotArr.push(dot);
				//dot.alpha = 1;
			}
		}
		//self.dotArr = dotArr;
		setVer();
	}

	this.getBB = function() {
		console.log(dotArr);
	}

	//扭曲进入到一个点
	this.transformIn = function(__obj) {
		var plane = self;
		//目标坐标-this的坐标=真目标坐标
		var targetX = __obj.targetX - self.x;
		var targetY = __obj.targetY - self.y;
		var ease = __obj.ease;
		var baseTime = __obj.baseTime || 800; //用来计算每个点运动delay的时间
		var completeFun = __obj.onComplete;
		var moveTime = __obj.moveTime || 1.0; //每个点运动所用的时间

		//var dotArr = self.dotArr;
		var row = self.verticesX;
		var col = self.verticesY;

		for(var i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			var dist = getDistance({
				x: temp.x,
				y: temp.y
			}, {
				x: targetX,
				y: targetY
			});

			//console.log(dist);

			TweenMax.to(temp, moveTime, {
				x: targetX,
				y: targetY,
				delay: dist * (1 / baseTime),
				//ease: Back.easeIn,
				ease: ease,
				onUpdate: function() {
					setVer();
				},
				onComplete: function() {
					myComplete();
				}
			});
		}

		var n = 0;

		function myComplete() {
			n++;
			if(n >= dotArr.length) {
				if(completeFun) {
					completeFun();
				}
			}
		}
	}

	//扭曲从一点出来
	this.transformOut = function(__obj) {
		var plane = self;
		//起点坐标-this的坐标=真目标坐标
		var initX = __obj.initX - self.x;
		var initY = __obj.initY - self.y;
		var ease = __obj.ease;
		var baseTime = __obj.baseTime || 800; //用来计算每个点运动delay的时间
		var completeFun = __obj.onComplete;
		var moveTime = __obj.moveTime || 1.0; //每个点运动所用的时间

		//var dotArr = self.dotArr;
		var row = self.verticesX;
		var col = self.verticesY;

		var i = 0;
		for(i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			temp.targetX = temp.x;
			temp.targetY = temp.y;

			temp.x = initX;
			temp.y = initY;
		}

		for(i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			var dist = getDistance({
				x: temp.x,
				y: temp.y
			}, {
				x: temp.targetX,
				y: temp.targetY
			});

			//根据每个点和初始点的距离，计算出delay时间，越近的delay时间越长
			var __delay = 1.3 - dist * (1 / baseTime);

			TweenMax.to(temp, moveTime, {
				x: temp.targetX,
				y: temp.targetY,
				delay: __delay,
				ease: ease,
				onUpdate: function() {
					setVer();
				},
				onComplete: function() {
					myComplete();
				}
			});
		}

		var n = 0;

		function myComplete() {
			n++;
			if(n >= dotArr.length) {
				if(completeFun) {
					completeFun();
				}
			}
		}
	}

	//滋滋效果，还没开发完
	this.zizi = function() {
		var row = self.verticesX;
		var col = self.verticesY;

		var way = 1;
		var loop = 2;
		var skew = 50;

		var i = 0;
		for(i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			temp.initX = temp.x;
			temp.initY = temp.y;
		}

		zi_move();

		function zi_move() {
			var num = 0;
			for(i = 0; i < row; i++) {
				for(var j = 0; j < col; j++) {
					var temp = dotArr[num];
					if(i % 2 == 0) {
						TweenMax.to(temp, 0.5, {
							x: temp.initX + skew * way,
							onUpdate: function() {
								setVer();
							},
							onComplete: function() {
								myComplete();
							}
						});
					} else {
						TweenMax.to(temp, 0.5, {
							x: temp.initX + skew * -way,
							onUpdate: function() {
								setVer();
							},
							onComplete: function() {
								myComplete();
							}
						});
					}
					num++;
				}
			}
		}

		var n = 0;

		function myComplete() {
			n++;
			if(n >= dotArr.length) {
				n = 0;
				if(way == -1) loop--;
				if(loop == 0) return;
				way *= -1;
				zi_move();
			}
		}
	}

	//滋滋效果进入
	this.ziziIn = function(__obj) {
		var row = self.verticesX;
		var col = self.verticesY;

		var count = 0;
		var speed = __obj.speed; //扭曲归正的速度
		var distance = __obj.distance; //初始扭曲的程度
		var completeFun = __obj.onComplete;

		var alpha_speed = speed / distance;
		self.alpha = 0;

		var i = 0;
		for(i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			temp.initX = temp.x;
			temp.initY = temp.y;
		}

		function zi_move() {
			count += 0.1;
			distance -= speed;
			self.alpha += alpha_speed;
			if(distance <= 0) {
				distance = 0;
				moveEnd = true;
				resetDot();
				if(completeFun) {
					completeFun();
				}
			}
			var num = 0;
			for(i = 0; i < row; i++) {
				for(var j = 0; j < col; j++) {
					var temp = dotArr[num];
					var tempX = Math.sin((i * 0.8) + count) * distance + temp.initX;
					temp.x += (tempX - temp.x) * 0.2;
					num++;
				}
			}
			setVer();
		}

		function resetDot() {
			for(var i = 0; i < dotArr.length; i++) {
				var temp = dotArr[i];
				//temp.x = temp.initX;
				TweenMax.to(temp, 0.2, {
					x: temp.initX,
					onUpdate: function() {
						setVer();
					}
				});
			}
		}

		moveEnd = false;
		animate(zi_move);

	}

	//旋涡进到一点
	this.spireIn = function(__obj) {
		var plane = self;
		//起点坐标-this的坐标=真目标坐标
		var targetX = __obj.targetX - self.x;
		var targetY = __obj.targetY - self.y;

		var baseTime = __obj.baseTime || 800; //用来计算每个点运动delay的时间，会影响转起来的速度
		var delayTime = __obj.delayTime || 400; //用来计算每个点每一步的delay递减值
		var angleSpeed = __obj.angleSpeed || 8; //每个点每一步转的角度的递减值
		var distSpeed = __obj.distSpeed || 1; //每个点每一步转的半径的递减值

		//var dotArr = self.dotArr;
		var row = self.verticesX;
		var col = self.verticesY;

		for(var i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			temp.dist = getDistance({
				x: temp.x,
				y: temp.y
			}, {
				x: targetX,
				y: targetY
			});

			temp.angle = Cangle({
				x: temp.x,
				y: temp.y
			}, {
				x: targetX,
				y: targetY
			});

			temp.delay = temp.dist * (1 / baseTime);

			if(temp.x < targetX) {
				temp.__skew = 180;
			} else {
				temp.__skew = 0;
			}
		}

		function myMove() {
			for(var i = 0; i < dotArr.length; i++) {
				var temp = dotArr[i];
				temp.delay -= 1 / delayTime;
				if(temp.delay <= 0) {
					temp.angle += angleSpeed;
					var __angle = (temp.angle - temp.__skew) * Math.PI / 180;
					temp.x = targetX + Math.cos(__angle) * temp.dist;
					temp.y = targetY + Math.sin(__angle) * temp.dist;
					temp.dist -= distSpeed;
					if(temp.dist <= 0) {
						//moveEnd = true;
						isMoveEnd();
						temp.dist = 0;
					}
				}
			}
			setVer();
		}

		function isMoveEnd() {
			var __end = true;
			for(var i = 0; i < dotArr.length; i++) {
				var temp = dotArr[i];
				if(temp.dist != 0) {
					__end = false;
				}
			}

			if(__end == true) {
				moveEnd = true;
			}
		}

		moveEnd = false;
		animate(myMove);
	}

	function animate(__fn) {
		if(moveEnd) return;
		requestAnimationFrame(function() {
			animate(__fn);
		});
		if(__fn) __fn();
	}

	function update() {

	}

	function setVer() {
		var mc = self;
		//var dotArr = self.dotArr;
		var num = 0;

		for(var i = 0; i < dotArr.length; i++) {
			var temp = dotArr[i];
			mc.vertices[num] = temp.x;
			num++;
			mc.vertices[num] = temp.y;
			num++;
		}
	}

	//计算两点间距离
	function getDistance(p1, p2) {
		var a = p2.x - p1.x;
		var b = p2.y - p1.y;
		var n = Math.sqrt(a * a + b * b);
		return n;
	}

	//计算两点的角度
	function Cangle(start, end) {
		var diff_x = end.x - start.x,
			diff_y = end.y - start.y;
		//返回角度,不是弧度
		return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
	}

	function creatBall() {
		var g = new PIXI.Graphics();
		g.beginFill(0xff0022);
		g.drawCircle(0, 0, 10);
		g.endFill();
		return g;
	}
}

PlaneMesh.prototype = new PIXI.mesh.Plane();
PlaneMesh.prototype.constructor = PlaneMesh;