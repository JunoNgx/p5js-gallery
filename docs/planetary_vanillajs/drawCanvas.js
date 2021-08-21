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

/**
 * @typedef {{
 * x: number,
 * y: number
 * }} Vector
 */

/**
 * @typedef {{
 * radius: number,
 * speed: number
 * }} Planet
 */
/** @type { Planet [] } */
let planets;

/** @type { Vector } */
let cursor;


function setup() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log(canvas.width);

    planets = [];

    cursor = vec(0, 0);
    canvas.addEventListener("mousemove", (e) => {
        const canvasRect = canvas.getBoundingClientRect();
        cursor.x = Math.round(e.clientX - canvasRect.left);
        cursor.y = Math.round(e.clientY - canvasRect.top);
        // console.log(cursor);
    });

    window.requestAnimationFrame(loop);
}

function draw() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ctx.beginPath();
    // ctx.fillStyle = "#ff0000";
    // ctx.rect(0, 0, canvas.width, canvas.height);
    // // ctx.lineWidth = 10;
    // ctx.strokeStyle = "#00ff00";
    // ctx.stroke();
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
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