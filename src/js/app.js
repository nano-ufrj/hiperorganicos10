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
import { atcb_action, atcb_init } from 'add-to-calendar-button';

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

function addSchedule(container, schedule, counter){
    console.log(schedule);
    const div = document.createElement("div");
    div.className = "accordion-item";

    var participantes = "";
    schedule.participants.forEach(participant => {
        participantes += `<li>${participant}</li>`;
    });

    var moderation = "";
    if(schedule.moderation){
        moderation = `<p><strong>Moderação:</strong></p>
                      <ul>${schedule.moderation}</ul>`
    }

    div.innerHTML = `<h2 class="accordion-header" id="panel-heading${counter}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panel-collapse${counter}" aria-expanded="false" aria-controls="panel-collapse${counter}">
                            ${schedule.startTime + " - " + schedule.name}
                        </button>
                    </h2>
                    <div id="panel-collapse${counter}" class="accordion-collapse collapse" aria-labelledby="panel-heading${counter}">
                        <div class="accordion-body">
                            <p><strong>Participantes:</strong></p>
                            <ul>${participantes}</ul>
                            ${moderation}
                            <div class="atcb">
                            {
                                "name": "HIPER10 - ${schedule.name}",
                                "description": "Participe também pelo YouTube: [url]${schedule.link}[/url]",
                                "startDate": "${schedule.date}",
                                "endDate": "${schedule.date}",
                                "startTime": "${schedule.startTime}",
                                "endTime": "${schedule.endTime}",
                                "location": "R. Aloísio Teixeira, 564 - Cidade Universitária da Universidade Federal do Rio de Janeiro, Rio de Janeiro - RJ, 21941-850",
                                "label": "Adicionar na agenda",
                                "options":[
                                    "Apple",
                                    "Google",
                                    "iCal",
                                    "Microsoft365",
                                    "MicrosoftTeams",
                                    "Outlook.com",
                                    "Yahoo"
                                ],
                                "timeZone":"America/Sao_Paulo",
                                "trigger":"click",
                                "inline":true,
                                "listStyle":"modal",
                                "iCalFileName":"Reminder-Event"
                            }
                            </div>
                            <button class="buttonYT" type="button" onclick=" window.open('${schedule.link}','_blank')">
                                <span class="yt-icon"><?xml version="1.0" encoding="UTF-8"?>
                                    <svg version="1.1" viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path fill="white" d="m171.45 107.34c-39.02 3.0664-68.512 34.793-70.41 73.887-1.5664 32.211-3.0352 69.273-3.0352 94.859 0 25.879 1.5039 63.504 3.0898 95.965 1.8828 38.594 30.699 70.109 69.176 73.664 42.59 3.9297 104.21 7.8906 179.73 7.8906 75.324 0 136.82-3.9375 179.4-7.8594 38.625-3.5586 67.5-35.281 69.355-74.023 1.6406-34.18 3.2422-73.289 3.2422-95.637 0-22.105-1.5664-60.617-3.1875-94.531-1.875-39.246-31.414-71.168-70.582-74.238-41.922-3.2852-102.39-6.5117-178.23-6.5117-76.035 0-136.62 3.2422-178.55 6.5352zm128.16 93.945 129.92 74.801-129.92 74.805z" fill-rule="evenodd"/></g></svg></span>
                                    Assistir
                                </div>
                            </button>
                        </div>
                    </div>`;
    container.appendChild(div);
}

var counter = 1;
programacaoData.simposio.forEach(schedule => {
    addSchedule(simposioEl, schedule, counter);
    counter++;
});

programacaoData.openlab.forEach(schedule => {
    addSchedule(openlabEl, schedule, counter);
    counter++;
});

window.addEventListener('DOMContentLoaded', (event) => {
    atcb_init();
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