/**
 * Created by weibin.zeng on 16/8/23.
 */


var game=game||{};

//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

documentReady(function(){

    game.stageWidth=document.documentElement.clientWidth||document.body.clientWidth;
    game.stageHeight=document.documentElement.clientHeight||document.body.clientHeight;

    $.ajax({
        url:"data/data.json",
        type:"GET",
        dataType:"json",
        success:function(data){
            initThree(data.data);
        },
        error:function(err){
            console.log("error:"+err);
        }
    });
});

var cameraPosition={x:0,y:0};
var cameraRotation={x:0,y:0};

function initThree(cityData){
    var canvas,
        renderer,
        scene,
        camera,
        controls;

    canvas=document.createElement("canvas");
    document.body.appendChild(canvas);

    renderer=new THREE.WebGLRenderer({
        canvas:canvas
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( game.stageWidth, game.stageHeight );
    renderer.setClearColor(0x000000);

    scene=new THREE.Scene();

    camera=new THREE.PerspectiveCamera(75,game.stageWidth/game.stageHeight,1,10000);
    camera.position.z = 150;
    camera.position.y = 0;
    camera.lookAt(0,0,0);

    var group = new THREE.Group();
    scene.add( group );

    var geoFloor = new THREE.BoxGeometry( 2000, 1, 2000 );
    var matFloor = new THREE.MeshPhongMaterial({
        color:0xcccccc
    });
    var mshFloor = new THREE.Mesh( geoFloor, matFloor );
    scene.add( mshFloor );
    mshFloor.position.set(0,-30,0);

    var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.set(-50,0,0);



    function createLight( color ) {

        var pointLight = new THREE.PointLight( color, 1, 200 );
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 1;
        pointLight.shadow.camera.far = 200;
        // pointLight.shadowCameraVisible = true;
        pointLight.shadow.bias = 0.01;

        var geometry = new THREE.SphereGeometry( 0.3, 12, 6 );
        var material = new THREE.MeshBasicMaterial( { color: color } );
        var sphere = new THREE.Mesh( geometry, material );
        pointLight.add( sphere );

        return pointLight

    }

    var pointLight = createLight( 0xffffff );
    scene.add( pointLight );
    pointLight.position.set(0,100,0);

    // var light = new THREE.DirectionalLight( 0xaabbff, 1 );
    // light.position.x = 100;
    // light.position.y = 250;
    // light.position.z = -200;
    // scene.add( light );

    var lastAngleX=0;
    var lastAngleY=0;
    var angleX=0;
    var angleY=0;
    var startX=0;
    var startY=0;

    // earth
    var loader = new THREE.TextureLoader();
    loader.load( 'img/earth.jpg', function ( texture ) {


        //添加背景效果
        var imagePrefix = "img/nebula-",
            directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"],
            imageSuffix = ".jpg",
            imageURLs = [];
        for (var i = 0; i < 6; i++)imageURLs.push( imagePrefix + directions[i] + imageSuffix );

        //var textureCube = THREE.ImageUtils.loadTextureCube( imageURLs );
        var textureCube = new THREE.CubeTextureLoader().load(imageURLs);
        textureCube.format=THREE.RGBFormat;
        textureCube.mapping=THREE.CubeReflectionMapping;

        var cubeShader = THREE.ShaderLib[ "cube" ];
        cubeShader.uniforms[ "tCube" ].value = textureCube;

        var cubeMaterial = new THREE.ShaderMaterial( {
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        } );

        var skyGeometry = new THREE.BoxGeometry( 44, 44, 44 );
        var skyBox = new THREE.Mesh( skyGeometry, cubeMaterial );
        // group.add( skyBox );

        var materials = [];

        for (var i = 0; i < 6; ++i) {
            materials.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imageURLs[i]),
                side:THREE.BackSide,
                overdraw: true
            }));
        }
        var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200),
            new THREE.MeshFaceMaterial(materials));
        group.add(cube)

        controls = new THREE.OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // only add this if there is no animation loop and no damping
        controls.dynamicDampingFactor = 0.2;
        controls.noZoom = false;

        //添加地球
        var geometry = new THREE.SphereGeometry( 20, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
        var mesh = new THREE.Mesh( geometry, material );
        group.add( mesh );
        mesh.rotation.y = angTorad(270);//把地球经度转向本初子午线的位置




        //添加地球发光效果
        /*var customMaterialAtmosphere = new THREE.ShaderMaterial(
            {
                uniforms:
                {
                    "c":   { type: "f", value: 0.5 },
                    "p":   { type: "f", value: 4.0 }
                },
                vertexShader:   document.getElementById( 'vertexShaderAtmosphere'   ).textContent,
                fragmentShader: document.getElementById( 'fragmentShaderAtmosphere' ).textContent
            }
        );
        var mesh = new THREE.Mesh( geometry.clone(), customMaterialAtmosphere );
        mesh.transparent=true;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.2;
        // atmosphere should provide light from behind the sphere, so only render the back side
        mesh.material.side = THREE.BackSide;
        scene.add(mesh);*/

        //添加数据视图
        for(var i=0;i<cityData.length;i++){
            createp(cityData[i]["city"]);

            var lat=cityData[i]["lat"];//纬度
            var lon=cityData[i]["lon"];//经度

            var sprite=new THREE.Group();

            var line=createLine();
            //纬度控制x轴旋转
            line.rotation.x=-(lat*Math.PI/180);

            var circle=createCircle();
            circle.position.z=21;
            line.add(circle);

            var text=createText(cityData[i]["city"]);
            text.scale.x=6;
            text.scale.y=2;
            text.position.z=25;
            line.add(text);

            //经度控制父容器的y轴旋转
            //此处解决 控制line的y轴旋转出错未知问题？？？
            sprite.rotation.y=lon*Math.PI/180;
            sprite.add(line);

            group.add(sprite);

        }

        //添加canvas 事件
        // canvas.addEventListener( 'mousedown', onMouseDown, false );
        //
        // canvas.addEventListener( 'touchstart', touchstart, false );
        // canvas.addEventListener( 'touchend', touchend, false );
        // canvas.addEventListener( 'touchmove', touchmove, false );

        function onMouseDown( event ) {
            startX=event.clientX;
            startY=event.clientY;

            if(camera.position.z==50){
                new TWEEN.Tween( camera.position ).to( {z:75}, 500 ).easing( TWEEN.Easing.Cubic.Out).start();
            }

            canvas.addEventListener( 'mousemove', onMouseMove, false );
            canvas.addEventListener( 'mouseup', onMouseUp, false );
        }

        function onMouseMove( event ) {

            event.preventDefault();

            var dx=(event.clientX-startX),
                dy=(event.clientY-startY);
            rotationObject3D(dx,dy);
        }

        function onMouseUp(  event  ) {
            lastAngleX=angleX;
            lastAngleY=angleY;
            canvas.removeEventListener( 'mousemove', onMouseMove, false );
            canvas.removeEventListener( 'mouseup', onMouseUp, false );
        }

        function touchstart(event) {
            startX=event.touches[ 0 ].pageX;
            startY=event.touches[ 0 ].pageY;

            if(camera.position.z==50){
                new TWEEN.Tween( camera.position ).to( {z:75}, 500 ).easing( TWEEN.Easing.Cubic.Out).start();
            }
        }

        function touchmove(event) {
            event.preventDefault();
            event.stopPropagation();

            var dx=(event.touches[ 0 ].pageX-startX),
                dy=(event.touches[ 0 ].pageY-startY);
            rotationObject3D(dx,dy);
        }
        function touchend(event) {
            lastAngleX=angleX;
            lastAngleY=angleY;
        }
        function rotationObject3D(dx,dy){
            angleX=lastAngleX-dx;
            group.rotation.y = -angTorad(angleX);

            angleY=lastAngleY+dy;
            if(angleY>=90)angleY=90;
            if(angleY<=-90)angleY=-90;
            group.rotation.x = angTorad(angleY);
        }

    } );


    var _submenu=document.getElementsByClassName("submenu")[0];
    function angTorad(ang){
        return ang*Math.PI/180;
    }
    function createp(city){
        var li=document.createElement("li");
        li.innerHTML=city;
        li.addEventListener("mousedown",liOnDown,false);
        li.addEventListener("touchstart",liOnDown,false);
        function liOnDown(){
            var lat=cityData[$(this).index()]["lat"];
            var lon=cityData[$(this).index()]["lon"];

            lastAngleX=lon;
            lastAngleY=lat;

            new TWEEN.Tween( group.rotation ).to( {
                x:(lat*Math.PI/180),
                y: -(lon*Math.PI/180)}, 500 )
                .easing( TWEEN.Easing.Cubic.Out).start();

            new TWEEN.Tween( camera.position ).to( {
                z:50}, 500 )
                .easing( TWEEN.Easing.Cubic.Out).start();
        }

        _submenu.appendChild(li);
    }
    function createLine(){
        var geometry=new THREE.Geometry();
        var vertex=new THREE.Vector3(0,0,20);
        var vertex2=new THREE.Vector3(0,0,25);
        geometry.vertices.push(vertex,vertex2);
        var lineMaterial= new THREE.LineBasicMaterial( { color: 0xffffff,transparent:true,opacity:0.5});
        var line = new THREE.Line( geometry, lineMaterial );
        return line;
    }
    function createCircle(image){
        var loader = new THREE.TextureLoader();
        var groundGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        var mesh = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({map:loader.load('img/bg.png'),transparent: true,opacity:0.6}));
        return mesh;
    }
    var bo=true;
    function createText(text){


        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var textWidth=parseInt(context.measureText(text).width);
        var fontSize=32;
        canvas.width=(textWidth+fontSize)*2;
        canvas.height=fontSize*1.2;
        context.fillStyle="#fff";
        context.font=fontSize+"px Arial";
        context.fillText(text,0,fontSize);

        var texture = new THREE.Texture( undefined, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
        texture.image=canvas;
        texture.needsUpdate=true;

        var mat=new THREE.SpriteMaterial({map:texture,color: 0xffffff,fog: true});
        var sprite=new THREE.Sprite(mat);
        return sprite;
    }
    var getPixelRatio = function(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    };


    function animate() {

        requestAnimationFrame( animate );

        if(controls)controls.update(); // required if there is damping or if autoRotate = true

        TWEEN.update();

        renderer.render( scene, camera );


    }
    animate();
}