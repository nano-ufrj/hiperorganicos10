/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1701846

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://instagram.com/vamoss
http://github.com/vamoss
******************/

// p5js version is based on https://johanneshoff.com/physarum/
// original implementation src code credit to Sage Jensen
//latter addapted by Chaski on https://editor.p5js.org/chaski/sketches/M2deZHzm8

import config from './config?plant'
import Physarum from './physarum'

function sketch(p5) {

    var physarum;
    const totalAgents = config.num_agents/2;

    var mouseCounter = 0;
    var randomCounter = 0;

    const stepPerFrame = 200;
    const color1 = "#000000";

    var img, graph;

    p5.preload = function(){
        img = p5.loadImage("images/content/costela.png");
    }

    p5.setup = function() {
        var parent = this.canvas.parentElement;

        const DETAIL = 1.5;
        const SIZE = p5.min(parent.offsetWidth, parent.offsetHeight) * 2;
        p5.createCanvas(SIZE, SIZE);
        p5.pixelDensity(1);
        p5.strokeWeight(1);

        //p5.drawingContext.scale(0.5, 0.5);
        p5.canvas.style.width = (SIZE / 2) + "px";
        p5.canvas.style.height = (SIZE / 2) + "px";

        const SCALE = SIZE / 1080;
        img.resize(img.width * SCALE, img.height * SCALE);

        //create texture
        graph = p5.createGraphics(img.width, img.height);
        graph.image(img, 0, 0);
        
        //convert pixels to float array
        graph.loadPixels();
        var textureArr = new Float32Array(graph.width * graph.height);
        
        for(var y = 0; y < graph.height; y++){
            for(var x = 0; x < graph.width; x++){
                const index = x + y * graph.width;
                textureArr[index] = graph.pixels[index * 4];
            }
        }

        config.speed = 2;
        
        physarum = new Physarum(p5.width, p5.height, p5.drawingContext, textureArr, graph.width, graph.height, config);
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
        
        if (p5.mouseIsPressed && p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
            for(var i = 0; i < 40; i++){
                var a = physarum.agents[mouseCounter%physarum.agents.length];
                a.x = p5.mouseX;
                a.y = p5.mouseY;
                a.heading = p5.random(p5.TWO_PI);
                mouseCounter++;
            }
        }

        if(p5.frameCount%10==0){
            const randomAgent = p5.random(physarum.agents);
            randomAgent.x = p5.random(p5.width);
            randomAgent.y = p5.random(p5.height);
        }
        
        physarum.update();  
        physarum.draw();
    }

    function regenerate() {
        for (let i=0; i<totalAgents/stepPerFrame; ++i) {
            physarum.addAgent(
                p5.width * 0.5,
                p5.height * 0.5,
                p5.random(p5.TWO_PI),
                color1
            );
        }
    }
}

export default sketch;