/* Bootstrap */
import '../scss/app.scss';
import 'bootstrap';

/* Autoscroll */
import './scrollspy';

/* p5js */
import p5 from "p5"
import sketchHero from './sketches/sketch-hero';
import sketchTransition from './sketches/sketch-transition';
import sketchPlant from './sketches/sketch-plant';

/* programação data */
import programacaoData from './schedule.json';

/* Demo JS */
import './demo.js';


/**
* Start sketches
*/
const p5Hero = new p5(sketchHero, 'hero');

const p5ProgramacaoTransition = new p5(sketchTransition, 'programacaoTransition');
p5ProgramacaoTransition.setColor("#E6227D");

const p5ProgramacaoPlant = new p5(sketchPlant, "programacaoPlant");

const p5HiperorganicosTransition = new p5(sketchTransition, 'hiperorganicosTransition');
p5HiperorganicosTransition.setColor("#81BA27");

/**
 * Programação
 */
const simposioEl = document.getElementById("simposio");
const openlabEl = document.getElementById("openlab");

function addSchedule(container, schedule, counter, showFinishTime){
    const div = document.createElement("div");
    div.className = "accordion-item";

    var title = schedule.startTime;
    if(showFinishTime)
        title += "/" + schedule.endTime;
    title += " - " + schedule.name;

    var participantes = "";
    schedule.participants.forEach(participant => {
        participantes += `<li>${participant}</li>`;
    });

    var moderation = "";
    if(schedule.moderation){
        moderation = `<p><strong>Moderação:</strong></p>
                      <ul>${schedule.moderation}</ul>`
    }

    var link = "";
    var cta = "";
    var buttonLabel = "";
    var buttonClass = "";
    if(schedule.link){
        link = schedule.link;
        cta = `"Participe também pelo YouTube: [url]${schedule.link}[/url]"`;
        buttonLabel = "Assistir";
        buttonClass = "buttonYT";
    }else if(schedule.join){
        link = schedule.join;
        cta = `"Inscreva-se pelo link: [url]${schedule.join}[/url]"`;
        buttonLabel = "Inscrever-se";
        buttonClass = "buttonJoin";
    }    

    div.innerHTML = `<h2 class="accordion-header" id="panel-heading${counter}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panel-collapse${counter}" aria-expanded="false" aria-controls="panel-collapse${counter}">
                            ${title}
                        </button>
                    </h2>
                    <div id="panel-collapse${counter}" class="accordion-collapse collapse" aria-labelledby="panel-heading${counter}">
                        <div class="accordion-body">
                            <p><strong>Participantes:</strong></p>
                            <ul>${participantes}</ul>
                            ${moderation}
                            <button class="buttonCta ${buttonClass}" type="button" onclick=" window.open('${link}','_blank')">
                                <span class="icon"></span>
                                ${buttonLabel}
                            </button>
                        </div>
                    </div>`;
    container.appendChild(div);
}

var counter = 1;
programacaoData.simposio.forEach(schedule => {
    addSchedule(simposioEl, schedule, counter, false);
    counter++;
});

programacaoData.openlab.forEach(schedule => {
    addSchedule(openlabEl, schedule, counter, true);
    counter++;
});


/**
* Stop sketches when not visible
*/
const monitorVisibility = [p5Hero, p5ProgramacaoTransition, p5HiperorganicosTransition, p5ProgramacaoPlant];
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