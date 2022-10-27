/* Bootstrap */
import '../scss/app.scss';
import 'bootstrap';

/* Autoscroll */
import './scrollspy';

/* p5js */
import p5 from "p5"
import sketchHero from './sketches/sketch-hero';
import sketchTransition from './sketches/sketch-transition';

/* Demo JS */
import './demo.js';
import sketch from './sketches/sketch-hero';


/**
* Start sketches
*/
const p5Hero = new p5(sketchHero, 'hero');

const p5ProgramacaoTransition = new p5(sketchTransition, 'programacaoTransition');
p5ProgramacaoTransition.setColor("#000000");

const p5HiperorganicosTransition = new p5(sketchTransition, 'hiperorganicosTransition');
p5HiperorganicosTransition.setColor("#E32A8C");


//const p5Programacao = new p5(sketchHero, 'programacao');


/**
* Stop sketches when not visible
*/
const monitorVisibility = [p5Hero, p5ProgramacaoTransition, p5HiperorganicosTransition];
const scrollEl = document.getElementsByClassName("horizontal-group")[0];

function isVisible(el) {
    var rect = el.getBoundingClientRect();
    return (rect.left <= window.innerWidth) && (rect.right >= 0);
}
function checkSketch(sketch){
    if(!sketch.canvas || !isVisible(sketch.canvas)){
        sketch.noLoop();
    }else{
        sketch.loop();
    }
}
function checkVisibility(){
    monitorVisibility.forEach(p5Sketch => checkSketch(p5Sketch));
}
scrollEl.addEventListener('scroll', (event) => {
    checkVisibility();
});
window.onload = function() {
    monitorVisibility.forEach(p5Sketch => {
        //wait until sketch canvas is created to check visibility
        //when sketches load images, it can take some time
        function checkThis(sketch){
            if(!sketch.canvas){
                window.setTimeout(() => checkThis(sketch), 100);
            }else{
                checkSketch(sketch);
            }
        }
        checkThis(p5Sketch);
    });
};