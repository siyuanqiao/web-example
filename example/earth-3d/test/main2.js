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

    camera=new THREE.PerspectiveCamera(45,game.stageWidth/game.stageHeight,0.5,1000);
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0,0,1));

    controls = new THREE.OrbitControls( camera ,renderer.domElement);
    //controls.addEventListener( 'change', render ); // only add this if there is no animation loop and no damping
    controls.dynamicDampingFactor = 0.8;
    controls.noZoom = true;

    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    var group = new THREE.Group();
    scene.add( group );





    // earth
    var loader = new THREE.TextureLoader();
    loader.load( 'img/earth_atmos_2048.jpg', function ( texture ) {

        (function(){
            //return;
            var geometry = new THREE.SphereGeometry( 0.5, 20, 20 );

            var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
            var mesh = new THREE.Mesh( geometry, material );
            group.add( mesh );
            mesh.rotation.y=230*Math.PI/180;



        }());

        (function(){
            var geometry=new THREE.BoxGeometry(1,1,1);
            var material=new THREE.MeshBasicMaterial({color:0x00ff00,opacity:0.2});
            material.transparent=true;
            var cube=new THREE.Mesh(geometry,material);
            group.add(cube);
        }());

        var image=new Image();
        image.src="img/bg.png";
        image.onload=function(){

            var geometry=new THREE.Geometry();
            var vertex=new THREE.Vector3(0,0,1);
            geometry.vertices.push(vertex);

            var vertex2=new THREE.Vector3(0,0,2);
            //vertex2.multiplyScalar(100);
            geometry.vertices.push(vertex2);

            var lineMaterial= new THREE.LineBasicMaterial( { color: 0xffffff});
            //定义是否这种材料是透明的。
            lineMaterial.transparent=true;
            lineMaterial.opacity=1;

            var line = new THREE.Line( geometry, lineMaterial );
            group.add( line );


            var temp=new THREE.Object3D();

            var texture = new THREE.Texture( undefined, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
            var canvas = document.createElement('canvas');
            canvas.width=100;
            canvas.height=100;
            //获取该canvas的2D绘图环境
            var context = canvas.getContext('2d');
            context.clearRect(0,0,canvas.width,canvas.height)
            //绘制文本
            context.fillStyle="#ffffff";
            context.font="20px Arial";
            context.drawImage(image,0,0);

            texture.image=canvas;
            texture.needsUpdate=true;

            var material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: true } );
            var sprite = new THREE.Sprite( material );

            //sprite.position.set(0.75,-0.75,1);
            sprite.position.set(0,0,0);

            temp.add(sprite);

            temp.position.set(0,0,1);

            group.add( temp );

        }


        function textToImage(text) {
            var canvas = document.createElement('canvas');
            canvas.width=100;
            canvas.height=30;
            //获取该canvas的2D绘图环境
            var context = canvas.getContext('2d');
            context.clearRect(0,0,canvas.width,canvas.height)
            //绘制文本
            context.fillText(text,0,20);

            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        }


        function loadFont() {
            var loader = new THREE.FontLoader();
            loader.load( 'fonts/helvetiker_regular.typeface.json', function ( response ) {


                var text = "three.js",
                    height = 1,
                    size = 1;

                var material = new THREE.MeshFaceMaterial( [
                    new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
                    new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
                ] );

                var textGeo=new THREE.TextGeometry(text, {
                    font: response,
                    size: size,
                    height: height
                });
                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();

                var triangleAreaHeuristics = 0.1 * ( height * size );

                for ( var i = 0; i < textGeo.faces.length; i ++ ) {

                    var face = textGeo.faces[ i ];

                    if ( face.materialIndex == 1 ) {

                        for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                            face.vertexNormals[ j ].z = 0;
                            face.vertexNormals[ j ].normalize();
                        }
                    }
                }

                var mesh = new THREE.Mesh(textGeo, material);
                mesh.position.x=25;
                scene.add(mesh);

            } );

        }
        //loadFont();


        //var material = new THREE.SpriteMaterial( { map: "hello word", color: 0xffffff, fog: true } );
        //var sprite = new THREE.Sprite( material );
        //scene.add( sprite );
        //loadtexture(0);

    } );


    var textures=[{url:"img/txt1.png",x:-14,y:22,z:-22,l_x:39-90,l_y:116,l_z:-120},
        {url:"img/txt2.png",x:9,y:22,z:22,l_x:39-10,l_y:116,l_z:120},
        {url:"img/txt3.png",x:24,y:15,z:-18,l_x:200,l_y:116,l_z:-120}];
    //var textures=[{url:"img/txt3.png",x:24,y:15,z:-18,l_x:200,l_y:116,l_z:-120}];

    //{url:"img/t2.png",x:-15,y:15,z:-22}]
    //77.02 38.54

    function loadtexture(index){
        var map=new THREE.TextureLoader();
        map.load(textures[index]["url"],function(texture){
            var material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: true } );
            var sprite = new THREE.Sprite( material );
            scene.add( sprite );

            sprite.position.set(textures[index]["x"],textures[index]["y"],textures[index]["z"]);
            //sprite.position.set(39-90,116,-120);
            sprite.scale.x=6;
            sprite.scale.y=5;


            //北京天安门广场的经纬度（东经：116°23′17〃，北纬：39°54′27〃

            var geometry = new THREE.Geometry();

            //var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            //var vertex = new THREE.Vector3(39-90,116,-120);
            var vertex = new THREE.Vector3(textures[index]["l_x"],textures[index]["l_y"],textures[index]["l_z"]);
            vertex.normalize();
            vertex.multiplyScalar(20);

            geometry.vertices.push( vertex );

            var vertex2 = vertex.clone();
            vertex2.multiplyScalar( 1.5 );

            geometry.vertices.push( vertex2 );

            var ma= new THREE.LineBasicMaterial( { color: 0xffffff});
            //定义是否这种材料是透明的。
            ma.transparent=true;
            ma.opacity=1;


            var line = new THREE.Line( geometry, ma );
            scene.add( line );


            if(index++<textures.length-1)
                loadtexture(index);
        });
    }


    function animate() {

        requestAnimationFrame( animate );

        controls.update(); // required if there is damping or if autoRotate = true


        renderer.render( scene, camera );

    }
    animate();
}
