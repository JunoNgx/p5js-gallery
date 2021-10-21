// --== Core setup for canvas loop
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

/**
 * @typedef {{
 * x: number,
 * y: number
 * }} Vector
 */

class CreativeCanvas {
    
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    /** @type {Vector} */
    cursor;
    /** @type {VisionNode []} */
    nodes;
    /**
     * @type {{
     * s: number
     * l: number
     * }}
     * */
    wSize;

    /** @param {string} canvasId */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener("resize", e => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.canvas.style.width = this.canvas.width + 'px';
            this.canvas.style.height = this.canvas.height + 'px';
        });

        window.addEventListener("mousemove", (e) => {
            const canvasRect = this.canvas.getBoundingClientRect();
            this.cursor.x = Math.round(e.clientX - canvasRect.left);
            this.cursor.y = Math.round(e.clientY - canvasRect.top);
        });

        this.wSize = {
            l: (window.innerWidth >= window.innerHeight) ? window.innerWidth : window.innerHeight,
            s: (window.innerWidth <= window.innerHeight) ? window.innerWidth : window.innerHeight
        };

        this.nodes = [];
        this.nodes.push(new VisionNode(100, 200, 0.5));
    }

    draw() {
        let ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // ctx.rect(10, 20, 30, 40);
        // ctx.fillStyle = 'indianred';
        // ctx.fill();

        this.nodes.forEach(node => {
            node.draw(ctx);
        });
    }
}

class VisionNode {
    
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    size;

    /**
     * @param {number} _x
     * @param {number} _y
     * @param {number} _size
     */
    constructor(_x, _y, _size) {
        this.x = _x;
        this.y = _y;
        this.size = window.innerWidth
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {

    }
}


window.addEventListener('DOMContentLoaded', () => setup());

/** @type { CreativeCanvas } */
let creativeCanvas;

function setup() {
    creativeCanvas = new CreativeCanvas("backgroundCanvas");

    window.requestAnimationFrame(loop);
}

function draw() {
    creativeCanvas.draw();
}

/**
 * 
 * @param {CanvasRenderingContext2D} _ctx 
 * @param {number} _x 
 * @param {number} _y 
 * @param {number} _radius 
 * @param {number} _sides 
 * @param {number} _rotation 
 * @param {boolean} _isFilled 
 * @returns 
 */
function polygon(_ctx, _x, _y, _radius, _sides, _rotation, _isFilled) {

    if (_sides < 3) {
        console.error("Drawing polygon with less than 3 sides");
        return;
    }

    const a = (Math.PI * 2) / _sides;
    _ctx.beginPath();
    _ctx.moveTo(
        _x + _radius * Math.cos(_rotation),
        _y + _radius * Math.sin(_rotation)
    );
    for (let i = 1; i < _sides; i++) {
        _ctx.lineTo(
            _x + _radius * Math.cos(_rotation + a*i),
            _y + _radius * Math.sin(_rotation + a*i)
        );
    }
    if (_isFilled) _ctx.fill();
    else {
        _ctx.closePath();
        _ctx.stroke();
    }
}