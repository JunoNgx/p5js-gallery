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

/**
 * @typedef {{
 * x: number,
 * y: number
 * }} Vector
 */

/**
 * @typedef {{
 * pos: Vector,
 * base: number,
 * height: number,
 * angle: number,
 * speed: number,
 * color: string,
 * }} Parallelogram
 * */
/** @type { Parallelogram [] } */
let shapes;

/** 
 * @typedef {{
 * cooldown: number,
 * pos: Vector,
 * interval: number,
 * base: number,
 * height: number,
 * speed: number,
 * color: string,
 * isDown: boolean,
 * }} Spawner
 * */
/** @type { Spawner [] } */
let spawners;

function setup() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth/2;

    window.requestAnimationFrame(loop);
    shapes = [];
    spawners = [
        {
            pos: vec(canvas.width * 0.3, canvas.height * -0.5),
            cooldown: 0,
            interval: 150,
            base: canvas.width * 0.14,
            height: canvas.height * 0.35,
            speed: canvas.height * 0.003,
            isDown: true,
            color: '#cbebb9'
        },
        {
            pos: vec(canvas.width * -0.032, canvas.height * 1.2),
            cooldown: 0,
            interval: 120,
            base: canvas.width * 0.29,
            height: canvas.height * 0.47,
            speed: canvas.height * 0.005,
            isDown: false,
            color: '#ffc0cb'
        },
        {
            pos: vec(canvas.width * 0.86, canvas.height * -0.8),
            cooldown: 0,
            interval: 420,
            base: canvas.width * 0.18,
            height: canvas.height * 0.64,
            speed: canvas.height * 0.002,
            isDown: true,
            color: '#fffacd'
        },
        {
            pos: vec(canvas.width * 0.4, canvas.height * 1.5),
            cooldown: 0,
            interval: 60,
            base: canvas.width * 0.27,
            height: canvas.height * 0.17,
            speed: canvas.height * 0.004,
            isDown: false,
            color: '#a6e5f5'
        },
    ];
}

function draw() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    spawners.forEach(s => {
        s.cooldown--;
        if (s.cooldown <= 0) {
            shapes.push(paral(
                //@ts-expect-error
                vec(s.pos.x, s.pos.y),
                s.base,
                s.height,
                s.speed,
                s.isDown,
                s.color
            ));
            s.cooldown = s.interval;
        }
    });

    shapes.forEach((s) => {
        s.pos.y += s.speed * Math.sin(s.angle);
        s.pos.x += s.speed * Math.cos(s.angle);

        const tl = vec(s.pos.x, s.pos.y);
        const tr = vec(s.pos.x + s.base, s.pos.y);
        const bl = vec(s.pos.x - s.height*Math.tan(s.angle-Math.PI/2), s.pos.y + s.height);
        const br = vec(bl.x + s.base, s.pos.y + s.height);

        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fill();
    });
    
    shapes = shapes.filter(s =>
        canvas.height * -1.0 < s.pos.y
        && s.pos.y < canvas.height * 2.0
    );
    
    const fontSize = canvas.width * 0.15;
    ctx.font = fontSize + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText("Juno Nguyen", canvas.width/2, canvas.height/2);
}

/**
 * Create a parallelogram data object
 * @param {import("p5").Vector} _pos 
 * @param {number} _base 
 * @param {number} _height 
 * @param {number} _speed 
 * @param {boolean} _isDown 
 * @param {string} _color 
 * @returns {Parallelogram}
 */
function paral(_pos, _base, _height, _speed, _isDown, _color) {
    return {
        pos: _pos,
        base: _base,
        height: _height,
        speed: _speed,
        angle: _isDown ? Math.PI/1.5 : Math.PI/1.5 + Math.PI,
        color: _color
    };
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