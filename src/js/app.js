/* Bootstrap */
import '../scss/app.scss';
import 'bootstrap';
import './scrollspy';
import p5 from "p5"
import sketchHero from './sketch-hero/sketch';

/* Demo JS */
import './demo.js';

new p5(sketchHero, 'hero');