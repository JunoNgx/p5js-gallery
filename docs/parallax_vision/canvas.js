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
    /** @type {Vector} */
    static draggedCursor;
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
        VisionCanvas.draggedCursor = {x: 0, y: 0};
        window.addEventListener("mousemove", (e) => {
            const canvasRect = this.canvas.getBoundingClientRect();
            VisionCanvas.cursor.x = Math.round(e.clientX - canvasRect.left);
            VisionCanvas.cursor.y = Math.round(e.clientY - canvasRect.top);
        });

        VisionCanvas.wSize = {
            l: (window.innerWidth >= window.innerHeight) ? window.innerWidth : window.innerHeight,
            s: (window.innerWidth <= window.innerHeight) ? window.innerWidth : window.innerHeight
        };

        const colourList = [
            "lightCoral",
            "gold",
            "springGreen",
            "cyan",
            "deepSkyBlue"
        ];

        this.nodes = [];
        // Top left
        const regularSizeMin = 0.03;
        const regularSizeMax = 0.1;
        this.nodes.push(new VisionNode(
            randomWithRange(this.canvas.width * 0.1, this.canvas.width * 0.3),
            randomWithRange(this.canvas.height * 0.1, this.canvas.height * 0.4),
            randomWithRange(VisionCanvas.wSize.l * regularSizeMin, VisionCanvas.wSize.l * regularSizeMax),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
        // Bottom left
        this.nodes.push(new VisionNode(
            randomWithRange(this.canvas.width * 0.1, this.canvas.width * 0.3),
            randomWithRange(this.canvas.height * 0.6, this.canvas.height * 0.9),
            randomWithRange(VisionCanvas.wSize.l * regularSizeMin, VisionCanvas.wSize.l * regularSizeMax),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
        // Mid right top
        this.nodes.push(new VisionNode(
            randomWithRange(this.canvas.width * 0.4, this.canvas.width * 0.7),
            randomWithRange(this.canvas.height * 0.2, this.canvas.height * 0.6),
            randomWithRange(VisionCanvas.wSize.l * regularSizeMin, VisionCanvas.wSize.l * regularSizeMax),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
        this.nodes.push(new VisionNode(
            randomWithRange(this.canvas.width * 0.6, this.canvas.width * 0.9),
            randomWithRange(this.canvas.height * 0.7, this.canvas.height * 0.9),
            randomWithRange(VisionCanvas.wSize.l * 0.04, VisionCanvas.wSize.l * 0.12),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
    }

    draw() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        VisionCanvas.draggedCursor.x = lerp(VisionCanvas.draggedCursor.x, VisionCanvas.cursor.x, 0.5);
        VisionCanvas.draggedCursor.y = lerp(VisionCanvas.draggedCursor.y, VisionCanvas.cursor.y, 0.5);

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
    /** @type {string} */
    colour;

    /**
     * @param {number} _x
     * @param {number} _y
     * @param {number} _size
     * @param {string} _colour
     */
    constructor(_x, _y, _size, _colour) {
        this.x = _x;
        this.y = _y;
        this.size = _size;
        this.colour = _colour;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {

        const angleToCursor = Math.atan2(VisionCanvas.draggedCursor.y - this.y, VisionCanvas.draggedCursor.x - this.x);
        const distToCursor = dist(
            VisionCanvas.draggedCursor.x, VisionCanvas.draggedCursor.y,
            this.x, this.y);
        const backDist = distToCursor * 0.15;
        const frontDist = distToCursor * 0.3;
        const frontPos = {
            x: this.x + frontDist * Math.cos(angleToCursor),
            y: this.y + frontDist * Math.sin(angleToCursor)
        }        
        const backPos = {
            x: this.x - backDist * Math.cos(angleToCursor),
            y: this.y - backDist * Math.sin(angleToCursor)
        }

        ctx.fillStyle = '#DDD';
        polygon(ctx, backPos.x, backPos.y, this.size + distToCursor * 0.08, 3, Math.PI/2, true);

        ctx.strokeStyle = this.colour;
        ctx.lineWidth = VisionCanvas.wSize.s * 0.01;
        polygon(ctx, frontPos.x, frontPos.y, this.size/2 + distToCursor * 0.04, 3, Math.PI/2, false);
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
 * @param {number} start 
 * @param {number} end 
 * @param {number} amt 
 * @returns 
 */
 function lerp (start, end, amt){
    return (1-amt)*start+amt*end
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