const G = {
    VERTEX_CHOICES: [3, 4, 5, 64],
    SHAPE_RADIUS_MIN: 0.01,
    SHAPE_RADIUS_MAX: 0.07,
    SHAPE_OFFSET_VARIANCE: 0.1,
    LINE_OFFSET_VARIANCE: 0.2,
    LINE_LENGTH_MIN: 0.3,
    LINE_LENGTH_MAX: 0.8,
    CORE_RADIUS: 0.3,
    AMT_OF_SHAPES: 32,
    AMT_OF_LINES: 12
};
/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * vertexCount: number,
 * radius: number
 * }} Shape
 **/
/** @type { Shape [] } */
let shapes;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * length: number
 * }} Line
 */
/** @type { Line [] } */
let lines;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);

    shapes = [];
    for (let i = 0; i < G.AMT_OF_SHAPES; i++) {

        const posX = mid.x + (size.s * G.CORE_RADIUS) * cos(Math.PI*2/G.AMT_OF_SHAPES * i)
            + size.s * random(-G.SHAPE_OFFSET_VARIANCE, G.SHAPE_OFFSET_VARIANCE);
        const posY = mid.y + (size.s * G.CORE_RADIUS) * sin(Math.PI*2/G.AMT_OF_SHAPES * i)
            + size.s * random(-G.SHAPE_OFFSET_VARIANCE, G.SHAPE_OFFSET_VARIANCE);
        
        shapes.push({
            pos: createVector(
                posX,
                posY
            ),
            vertexCount: random(G.VERTEX_CHOICES),
            radius: size.s * random(G.SHAPE_RADIUS_MIN, G.SHAPE_RADIUS_MAX)
        })
    }

    lines = [];
    for (let i = 0; i < G.AMT_OF_LINES; i++) {
        const posX = mid.x + size.s
            * random(-G.LINE_OFFSET_VARIANCE, G.LINE_OFFSET_VARIANCE);
        const posY = mid.y + size.s
            * random(-G.LINE_OFFSET_VARIANCE, G.LINE_OFFSET_VARIANCE);

        lines.push({
            pos: createVector(posX, posY),
            length: random(G.LINE_LENGTH_MIN, G.LINE_LENGTH_MAX)
        });
    }

    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function draw() {
    background(224);

    fill(47);
    noStroke();
    for (let i = 0; i < 32; i++) {
        circle(
            mid.x + (size.s * G.CORE_RADIUS) * cos(Math.PI/16 * i),
            mid.y + (size.s * G.CORE_RADIUS) * sin(Math.PI/16 * i),
            size.s * 0.01
        );
    }

    stroke(47);
    strokeWeight(4);
    lines.forEach(l => {
        line(
            l.pos.x + l.length/2 * size.s * Math.cos(-PI/4),
            l.pos.y + l.length/2 * size.s * Math.sin(-PI/4),
            l.pos.x + l.length/2 * size.s * Math.cos(-PI/4 + PI),
            l.pos.y + l.length/2 * size.s * Math.sin(-PI/4 + PI),
        );
    });

    noFill();
    strokeWeight(2);
    stroke(47);
    shapes.forEach(s => {

        switch (s.vertexCount) {
            case 3:
                const triLeft = createVector(
                    s.pos.x + s.radius * cos(-PI*5/6),
                    s.pos.y + s.radius * sin(-PI*5/6),
                );
                const triRight = createVector(
                    s.pos.x + s.radius * cos(-PI/6),
                    s.pos.y + s.radius * sin(-PI/6)
                );
                const triBottom = createVector(
                    s.pos.x + s.radius * cos(PI/2),
                    s.pos.y + s.radius * sin(PI/2)
                );
                triangle(triLeft.x, triLeft.y, triRight.x, triRight.y, triBottom.x, triBottom.y);
                break;

            case 4:
                rectMode(RADIUS)
                rect(s.pos.x, s.pos.y, s.radius, s.radius);
                break;

            case 64:
                polygon(s.pos.x, s.pos.y, s.radius, s.vertexCount);
                break;
        }
    });
}

/**
 * Acquired from p5js reference examples
 * https://p5js.org/examples/form-regular-polygon.html
 * @param {number} x 
 * @param {number} y 
 * @param {number} radius 
 * @param {number} npoints 
 */
function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}  