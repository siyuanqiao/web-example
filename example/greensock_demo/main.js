$(function(){
    var boxHTML=$('#boxHTML'),
        htmlDot=$("#htmlDOT"),
        tl=new TimelineLite({paused:true,onComplte:function(){
                console.log('animation complte');
            }});

    tl.to(boxHTML,.7,{x:"100%",y:"100%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{left:"50%",top:"50%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{x:"-50%",y:"-50%",ease:Power2.easeInOut})
        .addPause()
        .to(htmlDot,.7,{left:"0%",top:"0%"})
        .addPause()
        .to(boxHTML,.7,{rotation:90,transformOrigin:"100% 100%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{xPercent:-100,rotation:0,ease:Power2.easeInOut})
        .addPause()
        .to(htmlDot,.7,{left:"50%",top:"50%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{rotation:720,transformOrigin:"50% 50%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{rotationX:-180,transformOrigin:"0% 50%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{rotationX:-360,transformOrigin:"0% 50%",ease:Power2.easeInOut})
        .addPause()
        .to(boxHTML,.7,{x:"-50%",transformOrigin:"50% 50%",ease:Power2.easeInOut})
        .addPause()


    $("#btnNext").click(function(){
        tl.play();
    });
    $("#btnPrev").click(function(){
        tl.reverse();
    });
});