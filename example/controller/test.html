<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
		<title>图片缩放旋转test</title>
		<link type="text/css" rel="stylesheet" href="css/index.css" />
		<script src="lib/jquery-2.1.1.min.js"></script>
		<script src="lib/pixi.min.js"></script>
		<script src="lib/TweenMax.min.js"></script>
		<script src="lib/vconsole.min.js"></script>


		<script>
			(function(doc, win) {
				var docEl = doc.documentElement,
					resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
					recalc = function() {
						var clientWidth = docEl.clientWidth;
						if(!clientWidth) return;
						if(clientWidth >= 640) {
							docEl.style.fontSize = '100px';
						} else {
							docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
						}
					};

				if(!doc.addEventListener) return;
				win.addEventListener(resizeEvt, recalc, false);
				doc.addEventListener('DOMContentLoaded', recalc, false);
			})(document, window);
		</script>

	</head>

	<body>
		<div id="pixiStage">
		</div>
	</body>

</html>
<script>
	var vConsole = new VConsole();
</script>

<script src="js/common.js"></script>
<script src="js/Loading.js"></script>
<script src="js/Controller.js"></script>

<script>
	$('#pixiStage').show();

	wid = window.innerWidth;
	hei = window.innerHeight;
	//初始化pixi
	var app;
	var stage;
	var loading;
	var controller;

	app = new PIXI.autoDetectRenderer(640, 640 / (wid / hei), {
		transparent: true,
		antialias: true
	});

	document.getElementById('pixiStage').appendChild(app.view);
	app.view.id = 'myCanvas';
	stage = new PIXI.Container();

	loadingIn(); //正经加载进

	animate();

	//正经加载
	function loadingIn() {
		var loading_file = ['images/pic.png'];
		loading_file.push('images/controller/controller.json');
		console.log(loading_file);
		var loadingArr = [loading_file];

		loading = new Loading(null, {
			loadFileArr: loadingArr,
			progress: progress,
			complete: complete,
			easing: 1
		});
		loading.start();
	}

	function progress(__pro) {
		console.log(__pro);
	}

	function complete() {
		console.log('加载完成');
		loading = null;

		begin();
	}

	function begin() {
		controller=new Controller();
		controller.init();
		controller.addEvent(controller.KILL_ME,killPic);
		
		var mc = new PIXI.Sprite.fromImage('images/pic.png');
		stage.addChild(mc);
		mc.interactive = true;
		mc.on('touchstart',function(){
			stage.addChild(controller);
			controller.start({
				target: mc,
				drag: true,
				zoom: true,
				rotate: true,
				close: true
			});
		});
	}
	
	function killPic(){
		alert('删除了图片');
		controller.killEvent(controller.KILL_ME,killPic);
	}

	//渲染
	function animate() {
		requestAnimationFrame(animate);
		if(loading) {
			loading.update();
		}
		app.render(stage);
	}
</script>