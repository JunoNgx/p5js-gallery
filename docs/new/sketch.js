const G = {
    ANIM_TIME: 180,
    SQUARE_SIZE: 0.05,
    SQUARE_MOV_RADIUS: 0.2,
    HEART_RADIUS: 0.12,
    BEAT_RADIUS_INIT: 0.35,
    BEAT_RADIUS_FINAL: 0.42
};

/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;
/** @type { number } */
let time;

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
    time = 0;

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(47);
    time++;
    if (time > G.ANIM_TIME) time = 0;
    const progress = time/G.ANIM_TIME;

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
    
    // Draw the beat
    let br
    br = size.s * G.BEAT_RADIUS_INIT
        + size.s * (G.BEAT_RADIUS_FINAL - G.BEAT_RADIUS_INIT)
        * easeOutExpo(progress);
    noFill();
    stroke('dddddd');
    strokeWeight(2);
    arc(mid.x, mid.y, br, br, 0, PI*2);
}

/**
 * @param {number} x 
 * @returns {number}
 */
function easeOutExpo(x) {

    // easeOutExpo
    return x === 1 ? 1 : 1 - pow(2, -10 * x);

    // easeOutQuad
    // return 1 - pow(1 - x, 4);

    // easeOutCubic
    // return 1 - pow(1 - x, 3);
}