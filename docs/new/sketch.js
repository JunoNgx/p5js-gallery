const G = {
    ANIM_TIME: 180,
    SQUARE_SIZE: 0.05,
    SQUARE_MOV_RADIUS: 0.2,
    HEART_RADIUS: 0.15,
};

/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * angle: number
 * }} Square
 * */
/** @type { Square } */
let sq1;
/** @type { Square } */
let sq2;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);

    sq1 = {
        pos: createVector(mid.x + size.s * 0.2, mid.y),
        angle: 0
    };
    sq1 = {
        pos: createVector(mid.x - size.s * 0.2, mid.y),
        angle: 0
    };

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(47);

    // Drawing the heart/triangle
    noStroke();
    fill("#CD5C5C");
    const triLeft = createVector(
        mid.x + (size.s * G.HEART_RADIUS) * cos(-PI*5/6),
        mid.y + (size.s * G.HEART_RADIUS) * sin(-PI*5/6)
    );
    const triRight = createVector(
        mid.x + (size.s * G.HEART_RADIUS) * cos(-PI/6),
        mid.y + (size.s * G.HEART_RADIUS) * sin(-PI/6)
    );
    const triBottom = createVector(
        mid.x + (size.s * G.HEART_RADIUS) * cos(PI/2),
        mid.y + (size.s * G.HEART_RADIUS) * sin(PI/2)
    );
    triangle(triLeft.x, triLeft.y, triRight.x, triRight.y, triBottom.x, triBottom.y);
    
    fill('#fff');
    circle(mid.x, mid.y, 12);
}

/**
 * @param {number} x 
 * @returns {number}
 */
function easeFunc(x) {

    // easeOutExpo
    return x === 1 ? 1 : 1 - pow(2, -10 * x);

    // easeOutQuad
    // return 1 - pow(1 - x, 4);

    // easeOutCubic
    // return 1 - pow(1 - x, 3);
}