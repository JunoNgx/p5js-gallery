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

class VisionCanvas {
    
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    /** @type {Vector} */
    static cursor;
    /** @type {VisionNode []} */
    nodes;
    /**
     * @type {{
     * s: number
     * l: number
     * }}
     * */
    static wSize;

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

        VisionCanvas.cursor = {x: 0, y: 0};
        window.addEventListener("mousemove", (e) => {
            const canvasRect = this.canvas.getBoundingClientRect();
            VisionCanvas.cursor.x = Math.round(e.clientX - canvasRect.left);
            VisionCanvas.cursor.y = Math.round(e.clientY - canvasRect.top);
        });

        VisionCanvas.wSize = {
            l: (window.innerWidth >= window.innerHeight) ? window.innerWidth : window.innerHeight,
            s: (window.innerWidth <= window.innerHeight) ? window.innerWidth : window.innerHeight
        };

        this.nodes = [];
        for (let i = 0; i < randomWithRange(3, 7); i++) {
            // this.nodes.push(new VisionNode(this.canvas.width * 0.5, this.canvas.height * 0.5, VisionCanvas.wSize.l * 0.1));
            this.nodes.push(new VisionNode(
                randomWithRange(this.canvas.width * 0.2, this.canvas.width * 0.8),
                randomWithRange(this.canvas.height * 0.2, this.canvas.height * 0.8),
                VisionCanvas.wSize.l * 0.1
            ));
        }
        console.log(this.nodes);
    }

    draw() {
        let ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
    // /** @type {number} */
    // angleToCursor;

    /**
     * @param {number} _x
     * @param {number} _y
     * @param {number} _size
     */
    constructor(_x, _y, _size) {
        this.x = _x;
        this.y = _y;
        this.size = _size;
        // this.angleToCursor = 0;

        // window.addEventListener("mousemove", e => {
        //     this.angleToCursor = Math.atan2(VisionCanvas.cursor.y - this.y, VisionCanvas.cursor.x - this.x);
        // });
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {

        const angleToCursor = Math.atan2(VisionCanvas.cursor.y - this.y, VisionCanvas.cursor.x - this.x);
        const distToCursor = dist(
            VisionCanvas.cursor.x, VisionCanvas.cursor.y,
            this.x, this.y);
        // const distThreshold = VisionCanvas.wSize.s * 0.2;
        // const backDist = (distToCursor > distThreshold) ? VisionCanvas.wSize.s * 0.2 : distThreshold * 0.2;
        // const frontDist = (distToCursor > distThreshold) ? VisionCanvas.wSize.s * 0.2 : distThreshold * 0.2;       
        const backDist = distToCursor * 0.1;
        const frontDist = distToCursor * 0.1;
        const frontPos = {
            x: this.x + frontDist * Math.cos(angleToCursor),
            y: this.y + frontDist * Math.sin(angleToCursor)
        }        
        const backPos = {
            x: this.x - backDist * Math.cos(angleToCursor),
            y: this.y - backDist * Math.sin(angleToCursor)
        }

        console.log(distToCursor);

        ctx.fillStyle = '#DDD';
        // ctx.fill();
        // ctx.lineWidth = 0;
        polygon(ctx, backPos.x, backPos.y, this.size + distToCursor * 0.2, 3, Math.PI/2, true);

        // ctx.fillStyle = 'indianred'
        // ctx.fill();
        ctx.strokeStyle = "indianred";
        ctx.lineWidth = VisionCanvas.wSize.s * 0.01;
        polygon(ctx, frontPos.x, frontPos.y, this.size/2 + distToCursor * 0.2, 3, Math.PI/2, false);

        ctx.fillStyle = '#000';
        ctx.fillText(angleToCursor.toString(), this.x, this.y);

        ctx.fillRect(this.x, this.y, 10, 10);
    }
}


window.addEventListener('DOMContentLoaded', () => setup());

/** @type { VisionCanvas } */
let visionCanvas;

function setup() {
    visionCanvas = new VisionCanvas("backgroundCanvas");

    window.requestAnimationFrame(loop);
}

function draw() {
    visionCanvas.draw();
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

/**
 * Find distance between two points
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 */
function dist(x1, y1, x2, y2) {
    return Math.sqrt( (x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
 function randomWithRange(min, max) {
    return Math.random() * (max - min) + min;
}