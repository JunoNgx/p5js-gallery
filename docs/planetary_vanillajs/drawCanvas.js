/** @type { HTMLCanvasElement } */
// @ts-expect-error
let canvas = document.getElementById("drawCanvas");
/** @type { CanvasRenderingContext2D } */
// @ts-expect-error
let ctx = canvas.getContext("2d");
const FPS = 60;
const INTERVAL = 1000/FPS;

let lastTime = (new Date()).getTime();

function loop() {
    let currentTime = (new Date()).getTime();
    let deltaTime = currentTime - lastTime;
    if (deltaTime > INTERVAL) {
        // update(deltaTime);
        draw();
        lastTime = currentTime - (deltaTime % INTERVAL)
    }
    window.requestAnimationFrame(loop);
}

window.onload = setup;

const G = {
    CORE_RADIUS: 32,
    MIN_AMT_OF_PLANETS: 2,
    MAX_AMT_OF_PLANETS: 7,
}

/**
 * @typedef {{
 * x: number,
 * y: number
 * }} Vector
 */

/**
 * @typedef {{
 * size: number,
 * rotation: number,
 * rotationSpd: number
 * }} Planet
 */
/** @type { Planet [] } */
let planets;

/** @type { Vector } */
let cursor;

/** @type { number } */
let rotation;


function setup() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    planets = [];
    // const noOfPlanets = Math.floor(Math.random())
    //     * (G.MAX_AMT_OF_PLANETS - G.MIN_AMT_OF_PLANETS)
    //     + G.MIN_AMT_OF_PLANETS;
    const noOfPlanets = Math.floor(randomWithRange(G.MIN_AMT_OF_PLANETS,
        G.MAX_AMT_OF_PLANETS));
    for (let i = 0; i < noOfPlanets; i++) {
        planets.push({
            size: randomWithRange(24, 48),
            rotation: Math.random() * Math.PI * 2,
            rotationSpd: randomWithRange(-0.1, 0.1)
        });
    }

    cursor = vec(0, 0);
    canvas.addEventListener("mousemove", (e) => {
        const canvasRect = canvas.getBoundingClientRect();
        cursor.x = Math.round(e.clientX - canvasRect.left);
        cursor.y = Math.round(e.clientY - canvasRect.top);
        // console.log(cursor);
    });
    rotation = 0;

    window.requestAnimationFrame(loop);
}

function draw() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height) 

    rotation += 0.01;

    // Draw the core
    /** @type { Vector[] } */
    let core = [];
    for (let i = 0; i < 4; i++) {
        core[i] = vec(
            cursor.x + G.CORE_RADIUS * Math.cos(rotation + Math.PI/2 * i),
            cursor.y + G.CORE_RADIUS * Math.sin(rotation + Math.PI/2 * i),
        );
    }

    ctx.strokeStyle = "#887";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(core[0].x, core[0].y);
    ctx.lineTo(core[1].x, core[1].y);
    ctx.lineTo(core[2].x, core[2].y);
    ctx.lineTo(core[3].x, core[3].y);
    ctx.closePath();
    ctx.stroke();
    // ctx.beginPath();
    // ctx.fillStyle = "#ff0000";
    // ctx.rect(0, 0, canvas.width, canvas.height);
    // // ctx.lineWidth = 10;
    // ctx.strokeStyle = "#00ff00";
    // ctx.stroke();
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function randomWithRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Create a simplistic 2D vector
 * @param {number} _x 
 * @param {number} _y 
 * @returns {Vector}
 */
 function vec(_x, _y) {
    return { x: _x, y: _y };
}