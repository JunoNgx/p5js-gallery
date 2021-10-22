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
    // /**
    //  * @type {{
    //  * s: number
    //  * l: number
    //  * }}
    //  * */
    // static wSize;

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
            // VisionCanvas.wSize = {
            //     l: (window.innerWidth >= window.innerHeight) ? window.innerWidth : window.innerHeight,
            //     s: (window.innerWidth <= window.innerHeight) ? window.innerWidth : window.innerHeight
            // };
        });

        // VisionCanvas.wSize = {
        //     l: (window.innerWidth >= window.innerHeight) ? window.innerWidth : window.innerHeight,
        //     s: (window.innerWidth <= window.innerHeight) ? window.innerWidth : window.innerHeight
        // };

        VisionCanvas.cursor = {x: 0, y: 0};
        VisionCanvas.draggedCursor = {x: 0, y: 0};
        window.addEventListener("mousemove", (e) => {
            const canvasRect = this.canvas.getBoundingClientRect();
            VisionCanvas.cursor.x = Math.round(e.clientX - canvasRect.left);
            VisionCanvas.cursor.y = Math.round(e.clientY - canvasRect.top);
        });

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
            randomWithRange(0.1, 0.3),
            randomWithRange(0.1, 0.4),
            randomWithRange(regularSizeMin, regularSizeMax),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
        // Bottom left
        this.nodes.push(new VisionNode(
            randomWithRange(0.1, 0.3),
            randomWithRange(0.6, 0.9),
            randomWithRange(regularSizeMin, regularSizeMax),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
        // Mid right top
        this.nodes.push(new VisionNode(
            randomWithRange(0.4, 0.7),
            randomWithRange(0.2, 0.6),
            randomWithRange(regularSizeMin, regularSizeMax),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
        this.nodes.push(new VisionNode(
            randomWithRange(0.6, 0.9),
            randomWithRange(0.7, 0.9),
            randomWithRange(0.04, 0.12),
            colourList[Math.floor(Math.random() * colourList.length)]
        ));
    }

    draw() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        VisionCanvas.draggedCursor.x = lerp(VisionCanvas.draggedCursor.x, VisionCanvas.cursor.x, 0.5);
        VisionCanvas.draggedCursor.y = lerp(VisionCanvas.draggedCursor.y, VisionCanvas.cursor.y, 0.5);

        // This is necessary to ensure that all the front nodes are always on top of the back nodes
        this.nodes.forEach(node => {
            node.drawBack(ctx);
        });
        
        this.nodes.forEach(node => {
            node.drawFront(ctx);
        })
        
    }
}

class VisionNode {
    
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    sizeRate;
    /** @type {string} */
    colour;

    /**
     * @param {number} _x
     * @param {number} _y
     * @param {number} _sizeRate
     * @param {string} _colour
     */
    constructor(_x, _y, _sizeRate, _colour) {
        this.x = _x;
        this.y = _y;
        this.sizeRate = _sizeRate;
        this.colour = _colour;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    drawBack(ctx) {
        const angleToCursor = Math.atan2(
            VisionCanvas.draggedCursor.y - (window.innerHeight * this.y),
            VisionCanvas.draggedCursor.x - (window.innerWidth * this.x)
        );
        const distToCursor = dist(
            VisionCanvas.draggedCursor.x, VisionCanvas.draggedCursor.y,
            window.innerWidth * this.x,
            window.innerHeight * this.y
        );

        const backDist = distToCursor * 0.15;
        const backPos = {
            x: this.x * window.innerWidth - backDist * Math.cos(angleToCursor),
            y: this.y * window.innerHeight - backDist * Math.sin(angleToCursor)
        }

        ctx.fillStyle = '#DDD';
        polygon(
            ctx, backPos.x, backPos.y,
            (window.innerWidth * this.sizeRate) + distToCursor * 0.1,
            3, Math.PI/2, true
        );
    }

    /** @param {CanvasRenderingContext2D} ctx */
    drawFront(ctx) {
        const angleToCursor = Math.atan2(
            VisionCanvas.draggedCursor.y - (window.innerHeight * this.y),
            VisionCanvas.draggedCursor.x - (window.innerWidth * this.x)
        );
        const distToCursor = dist(
            VisionCanvas.draggedCursor.x, VisionCanvas.draggedCursor.y,
            window.innerWidth * this.x,
            window.innerHeight * this.y
        );

        const frontDist = distToCursor * 0.4;
        const frontPos = {
            x: this.x * window.innerWidth + frontDist * Math.cos(angleToCursor),
            y: this.y * window.innerHeight + frontDist * Math.sin(angleToCursor)
        }        

        ctx.strokeStyle = this.colour;
        ctx.lineWidth = window.innerWidth * 0.002 + distToCursor * 0.02;
        polygon(ctx, frontPos.x, frontPos.y,
            (window.innerWidth * this.sizeRate) * 0.5 + distToCursor * 0.1,
            3, Math.PI/2, false);
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