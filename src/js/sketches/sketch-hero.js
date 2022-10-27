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


import config from './config?hero'
import Physarum from './physarum'

function sketch(p5) {

    var physarum;
    var img1;
    var imageWidth, imageHeight;

    var fade = 0;

    const totalAgents = config.num_agents/5;

    const stepPerFrame = 200;
    const colors = ["#E6227D", "#392778", "#33519E", "#81BA27"];

    p5.preload = function(){
        img1 = p5.loadImage("images/content/logo.png");
    }

    p5.setup = function() {
        var parent = this.canvas.parentElement;
        p5.createCanvas(parent.offsetWidth, parent.offsetHeight);
        p5.pixelDensity(1);
        p5.background(0);
        p5.strokeWeight(2);

        calcImageSize();
        
        physarum = new Physarum(p5.width, p5.height, p5.drawingContext, new Float32Array(0), 0, 0, config);

        function changeSensorDistance(){
            if(config.sensor_distance == 6){
                config.sensor_distance = 15;
                setTimeout(changeSensorDistance, 3000);
            }else{
                config.sensor_distance = 6;
                setTimeout(changeSensorDistance, 600);
            }
        }
        changeSensorDistance();
    }


    p5.draw = function() {
        p5.blendMode(p5.REMOVE);
        p5.fill(0, 0, 0, 20);
        p5.noStroke();
        p5.rect(0, 0, p5.width, p5.height);
        p5.blendMode(p5.BLEND);
        
        if(p5.frameCount < 200){
            regenerate();
        }
        
        if (p5.mouseIsPressed) {
            for(var i = 0; i < 40; i++){
                physarum.addAgent(p5.mouseX, p5.mouseY, p5.random(p5.TWO_PI), p5.random(colors));
            }
        }
        
        physarum.update();  
        physarum.draw();
        
        if(p5.frameCount>30){
            fade += 5;
            p5.tint(255, p5.min(fade, 255));
            p5.image(img1, (p5.width-imageWidth)/2, (p5.height-imageHeight)/2, imageWidth, imageHeight);
        }
    }

    function regenerate() {

        const radius = p5.min(p5.width, p5.height) * 0.15;
        
        //circular
        for (let i=0; i<totalAgents/stepPerFrame; ++i) {
            const angle = p5.random(p5.TWO_PI);
            physarum.addAgent(
                p5.width * 0.5 + p5.cos(angle) * radius,
                p5.height * 0.5 + p5.sin(angle) * radius,
                angle + p5.HALF_PI,
                p5.random(colors)
            );
        }

        //grow
        for (let i=0; i<totalAgents/stepPerFrame; ++i) {
            const angle = p5.random(p5.TWO_PI);
            physarum.addAgent(
                p5.width * 0.5 + p5.cos(angle) * radius,
                p5.height * 0.5 + p5.sin(angle) * radius,
                angle,
                p5.random(colors)
            );
        }
    }

    function calcImageSize(){
        if(img1.width > p5.width - 100){
            imageWidth = p5.width - 100;
            imageHeight = img1.height * imageWidth / img1.width;
        }else{
            imageWidth = img1.width;
            imageHeight = img1.height;
        }
    }

    p5.windowResized = function() {
        var parent = this.canvas.parentElement;
        p5.resizeCanvas(parent.offsetWidth, parent.offsetHeight);
        calcImageSize();
    }
}

export default sketch;