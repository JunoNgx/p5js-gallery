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

// function update(deltaTime) {

// }

window.onload = setup;



function setup() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth/2;

    window.requestAnimationFrame(loop);
    
}

function draw() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height)

}

/**
 * 
 * @param {number} _x 
 * @param {number} _y 
 * @returns {Vector}
 */
function vec(_x, _y) {
    return { x: _x, y: _y };
}