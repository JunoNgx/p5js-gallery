const G = {
    VERTEX_CHOICES: [3, 4, 5, 64],
    RADIUS_MIN: 0.02,
    RADIUS_MAX: 0.1,
    CORE_RADIUS: 0.3,
};
/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;
// /** @type { number } */
// let time;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * vertexCount: number,
 * radius: number
 * }} Shape
 **/
/** @type { Shape [] } */
let shapes;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);
    // time = 0;

    shapes = [];
    for (let i = 0; i < 50; i++) {
        shapes.push({
            pos: createVector(
                random(windowWidth * 0, windowWidth * 1),
                random(windowHeight * 0, windowHeight * 1),
            ),
            vertexCount: random(G.VERTEX_CHOICES),
            radius: size.l * random(G.RADIUS_MIN, G.RADIUS_MAX)
        })
    }

    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function draw() {
    background(224);

    // fill(47);
    // stroke(47);
    // circle(mid.x, mid.y, 36);

    fill(47);
    noStroke();
    for (let i = 0; i < 32; i++) {
        circle(
            mid.x + (size.s * G.CORE_RADIUS) * cos(Math.PI / 16 * i),
            mid.y + (size.s * G.CORE_RADIUS) * sin(Math.PI / 16 * i),
            size.s * 0.02
        );
    }

    noFill();
    strokeWeight(2);
    stroke(47);
    shapes.forEach(s => {
        // push();
        // translate(s.pos.x, s.pos.y);
        // rotate(PI/2)
        // polygon(s.pos.x, s.pos.y, s.radius, s.vertexCount);
        // pop();

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

    // time++;
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