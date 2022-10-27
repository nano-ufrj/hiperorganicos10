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

    const stepPerFrame = 200;
    const totalAgents = config.num_agents/10;
    
    p5.setColor = function(color){
        p5.color1 = p5.color(color);
    }

    p5.setup = function() {
        var parent = this.canvas.parentElement;
        p5.createCanvas(parent.offsetWidth, parent.offsetHeight);
        p5.pixelDensity(1);
        p5.clear();
        p5.strokeWeight(2);
        
        var textureArr = new Float32Array(0);
        
        config.wrap_around = false;
        physarum = new Physarum(p5.width, p5.height, p5.drawingContext, textureArr, 0, 0, config);
    }

    p5.draw = function() {
        p5.blendMode(p5.REMOVE);
        p5.fill(0, 0, 0, 20);
        p5.noStroke();
        p5.rect(0, 0, p5.width, p5.height);
        p5.blendMode(p5.BLEND);
        
        if(physarum.agents.length < totalAgents){
            regenerate();
        }

        for(var i = 0; i < physarum.agents.length; i++){
            var a = physarum.agents[i];
            var x = a.x;
            var y = a.y;
            if(!a.life)
                a.life = p5.random(20, 50);
            a.life--;
            //if(i == 0)
            //    console.log(a.life);
            if(x < 0 || x > p5.width || y < 0 || y > p5.height || a.life <= 0){
                a.x = p5.width;
                a.y = p5.height/2 + p5.random(-p5.height/4, p5.height/4);
                a.heading = p5.HALF_PI + p5.random(0, p5.PI);
                a.life = p5.random(20, 50);
            }
        }


        
        if (p5.mouseIsPressed) {
            for(var i = 0; i < 40; i++){
                const a = p5.random(physarum.agents);
                a.x = p5.mouseX;
                a.y = p5.mouseY;
                a.heading = p5.random(p5.TWO_PI);
            }
        }
        
        physarum.update();  
        physarum.draw();
    }

    function regenerate() {
        for (let i=0; i<totalAgents/stepPerFrame; ++i) {
            physarum.addAgent(
                p5.width,
                p5.height/2,
                p5.HALF_PI + p5.random(0, p5.PI),
                p5.color1
            );
        }
    }

    p5.windowResized = function() {
        var parent = this.canvas.parentElement;
        p5.resizeCanvas(parent.offsetWidth, parent.offsetHeight);
    }
}

export default sketch;