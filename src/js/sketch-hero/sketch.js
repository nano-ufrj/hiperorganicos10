/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1698402

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://instagram.com/vamoss
http://github.com/vamoss
******************/

// p5js version is based on https://johanneshoff.com/physarum/
// original implementation src code credit to Sage Jensen
//latter addapted by Chaski on https://editor.p5js.org/chaski/sketches/M2deZHzm8


import config from './config'
import Physarum from './physarum'

function sketch(p5) {

    var physarum;
    var graph;
    var img1;
    var img2;

    var exporFrameSequence = false;

    var fade = 0;

    const stepPerFrame = 200;
    const colors = ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"];

    p5.preload = function(){
        img1 = p5.loadImage("images/content/logo-no-circle-white-transparent.png");
        img2 = p5.loadImage("images/content/logo-text-white-transparent.png");
    }

    p5.setup = function() {
        p5.createCanvas(900, 900);
        p5.pixelDensity(1);
        p5.background(0);
        p5.strokeWeight(2);
        
        if(exporFrameSequence){
            p5.frameRate(4);
        }
        
        //create texture
        graph = p5.createGraphics(img1.width, img1.height);
        graph.image(img1, 0, 0);
        
        //convert pixels to float array
        graph.loadPixels();
        var textureArr = new Float32Array(graph.width * graph.height);
        
        for(var y = 0; y < graph.height; y++){
            for(var x = 0; x < graph.width; x++){
                const index = x + y * graph.width;
                textureArr[index] = graph.pixels[index * 4];
            }
        }
        
        physarum = new Physarum(p5.width, p5.height, p5.drawingContext, textureArr, graph.width, graph.height);
        console.log(physarum);
    }


    p5.draw = function() {
        //*
        p5.fill(0, 10);
        p5.noStroke();
        p5.rect(0, 0, p5.width, p5.height);
        /**/
        
        if(p5.frameCount < 200){
            regenerate();
        }
        
        if (p5.mouseIsPressed) {
            for(var i = 0; i < 40; i++){
                physarum.addAgent(p5.mouseX, p5.mouseY, p5.random(p5.TWO_PI));
            }
        }
        
        physarum.update();  
        physarum.draw();
        
        if(p5.frameCount>30){
            fade += 5;
            p5.tint(255, p5.min(fade, 255));
            p5.image(img2, (p5.width-img2.width)/2, (p5.height-img2.height)/2);
        }
        
        if(exporFrameSequence){
            p5.saveCanvas('hiper'+String(p5.frameCount).padStart(4, '0'), 'png');
        }
    }

    function regenerate() {

        const radius = p5.min(p5.width, p5.height) * 0.15;
        
        //circular
        for (let i=0; i<config.num_agents/stepPerFrame; ++i) {
            const angle = p5.random(p5.TWO_PI);
            physarum.addAgent(
                p5.width * 0.5 + p5.cos(angle) * radius,
                p5.height * 0.5 + p5.sin(angle) * radius,
                angle + p5.HALF_PI,
                p5.random(colors)
            );
        }

        //grow
        for (let i=0; i<config.num_agents/stepPerFrame; ++i) {
            const angle = p5.random(p5.TWO_PI);
            physarum.addAgent(
                p5.width * 0.5 + p5.cos(angle) * radius,
                p5.height * 0.5 + p5.sin(angle) * radius,
                angle,
                p5.random(colors)
            );
        }
    }

    p5.keyPressed = function(){
        if(p5.key == 's'){
            p5.saveCanvas();
        }else if(p5.key == '1'){
            config.sensor_distance = 30;
        }else if(p5.key == '2'){
            config.sensor_distance = 6;
        }
    }
}

export default sketch;