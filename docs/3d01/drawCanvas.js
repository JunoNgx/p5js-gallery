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
 * }} Vector2D
 */

/**
 * @typedef {{
 * x: number,
 * y: number,
 * z: number
 * }} Vector3D
 */

/**
 * @typedef {{
 * pos: Vector3D,
 * radius: number,
 * rotation: Vector3D
 * }} Tetrahedron
 */

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
 * @param {number} _z 
 * @param {number} _radius 
 */
function tetrahedron(_x, _y, _z, _radius) {
    return {
        pos: vec3(_x, _y, _z),
        radius: _radius,
        rotation: vec3(0, 0, 0)
    }
}

/**
 * 
 * @param {Tetrahedron} t 
 */
function drawTetrahedron(t) {
    /** @type {Vector3D} */
    let top = vec3(
        t.pos.x + t.radius * Math.cos(Math.PI + t.rotation.z),
        t.pos.y + t.radius * Math.sin(Math.PI + t.rotation.z),
        t.pos.z + 
    );
    let botA;
    let botB;
    let botC;
}

/**
 * 
 * @param {number} _x 
 * @param {number} _y 
 * @returns {Vector2D}
 */
function vec2(_x, _y) {
    return { x: _x, y: _y };
}

/**
 * 
 * @param {number} _x 
 * @param {number} _y 
 * @param {number} _z 
 * @returns {Vector3D}
 */
 function vec3(_x, _y, _z) {
    return { x: _x, y: _y, z: _z };
}