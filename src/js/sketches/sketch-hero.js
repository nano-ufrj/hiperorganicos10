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
    const totalAgents = p5.windowWidth < 800 ? config.num_agents/10 : config.num_agents/5;

    var mouseCounter = 0;
    const stepPerFrame = 200;
    const colors = ["#E6227D", "#392778", "#33519E", "#81BA27"];

    p5.setup = function() {
        var parent = this.canvas.parentElement;
        p5.createCanvas(parent.offsetWidth, parent.offsetHeight);
        p5.pixelDensity(1);
        p5.background(0);
        p5.strokeWeight(p5.windowWidth < 800 ? 1 : 2);
        
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
                var a = physarum.agents[mouseCounter%physarum.agents.length];
                a.x = p5.mouseX;
                a.y = p5.mouseY;
                a.heading = p5.random(p5.TWO_PI);
                mouseCounter++;
            }
        }
        
        physarum.update();  
        physarum.draw();
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

    p5.windowResized = function() {
        var parent = this.canvas.parentElement;
        p5.resizeCanvas(parent.offsetWidth, parent.offsetHeight);
    }
}

export default sketch;