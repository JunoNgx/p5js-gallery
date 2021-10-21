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

class CreativeCanvas {
    
    /** @type {Element} */
    static canvas;
    /** @type {CanvasRenderingContext2D} */
    static ctx;

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
    }

    draw() {
        let ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.rect(10, 20, 30, 40);
        ctx.fillStyle = 'indianred';
        ctx.fill();
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