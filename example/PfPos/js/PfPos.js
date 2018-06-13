/*
 获取图形像素点的类，利用canvas来得到指定文字或图形的像素点信息，并输出图形像素点坐标的数组，及其它信息
 * */

var PfPos = {
	/*
	 * 设置并获取canvas图像象素信息
	 * options:
	 *         type：内容类型，分为'text'（文字）和'pic'（图形）
	 *         textBaseline：内容为文字（text）时，设置文字的垂直对齐方式（'top','middle','bottom'）,默认为top，例：textBaseline: 'top'
	 *         textAlign：内容为文字（text）时，设置文字的水平对齐方式（'left','center','right'）,默认为left，例：textAlign: 'left'
	 *         font：内容为文字（text）时，设置文字的样式，如字体，粗细，字号等，默认为'bold 14px arial'（粗一点比较好），例：'bold 280px arial'
	 *         content: 内容为文字（text）时，设置文字内容
	 *         
	 *         picSrc：内容为图形（pic）时，要绘制的图形路径，图片文件需是透明背景的png或gif
	 *         
	 *         width和height：创建canvas的尺寸，用这个canvas来承载要绘制文字或图形，然后生成像素点信息，默认为window.innerWidth和window.innerHeight
	 *         skewX和skewY：向canvas载入文字或图形时，x轴和y轴的偏移量，就是把图形放在这个canvas里的什么位置，默认为10，建议不要放在0,0点，获取像素点时可能会出现误差
	 *         loadEnd：传入一个方法，当数据生成好时，会调用这个方法把数据传出去
	 * */
	getImageData: function(options) {
		var canvas = document.createElement('canvas');
		canvas.id = "myCanvas";
		canvas.width = options.width || window.innerWidth;
		canvas.height = options.height || window.innerHeight;
		canvas.style.position = "absolute";
		document.body.appendChild(canvas);

		var ctx = canvas.getContext('2d');

		if(options.type == 'text') {
			var skewX = options.skewX || 10;
			var skewY = options.skewY || 10;
			ctx.textBaseline = options.textBaseline || 'top';
			ctx.textAlign = options.textAlign || 'left';
			ctx.font = options.font || 'bold 14px arial';
			ctx.fillText(options.content, skewX, skewY);
			var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
			ctx.clearRect(0, 0, width, height); //清除原始图形
			if(options.loadEnd) options.loadEnd(data);
		} else if(options.type == 'pic') {
			var img = new Image()
			img.src = options.picSrc;
			img.onload = function() {
				var skewX = options.skewX || 10;
				var skewY = options.skewY || 10;
				ctx.drawImage(img, skewX, skewY);
				var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				ctx.clearRect(0, 0, width, height); //清除原始图形
				options.loadEnd(data);
			}
		}
	},
	/*
	 * 获取图像数据里的关键点的坐标，根据getImageData生成的像素信息来生成关键点的坐标
	 * __gap：间隙大小，水平和垂直方向以固定间隙去读取像素信息，间隙越小，像素的密度越大，默认为10
	 * __data：用getImageData生成的数据数组
	 * __width和__height：getImageData里创建的canvas的尺寸，应与向getImageData传入的width和height的值相同
	 */
	getKeyPos: function(__gap, __data, __width, __height) {
		var imageData = __data;
		var gap = __gap || 10; //间隙大小，水平和垂直方向以固定间隙去读取像素信息
		var pos = [];
		var x = 0;
		var y = 0;
		var index = 0;

		//数组中每四个元素代表一个象素rbga信息
		for(var i = 0; i < imageData.length; i += (4 * gap)) {
			//如果一个象素点的透明度不为0，则记录下来当作关键点
			if(imageData[i + 3] == 255) {
				pos.push({
					x: x + gap,
					y: y
				});
			}
			index = Math.floor(i / 4);
			x = index % __width;
			y = Math.floor(index / __width);
			if(x >= __width - gap) {
				i += gap * 4 * __width;
			}
		}

		return pos;
	},

	/*
	 * 获取用getKeyPos生成的像素组的左上角位置及宽高
	 * __pos：用getKeyPos生成的像素数组
	 * 返回的minX和minY是左上角坐标，maxX和maxY是图形的宽高
	 * */
	getTrans: function(__pos) {
		var minX = 99999;
		var minY = 99999;
		var maxX = 0;
		var maxY = 0;

		for(var i = 0; i < __pos.length; i++) {
			var temp = __pos[i];
			if(temp.x < minX) {
				minX = temp.x;
			}
			if(temp.y < minY) {
				minY = temp.y;
			}
			if(temp.x > maxX) {
				maxX = temp.x;
			}
			if(temp.y > maxY) {
				maxY = temp.y;
			}
		}

		var obj = {
			minX: minX,
			minY: minY,
			maxX: maxX - minX,
			maxY: maxY - minY
		};

		return obj;
	}
};