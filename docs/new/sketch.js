const G = {
    ANIM_TIME: 180,
    SQUARE_SIZE: 0.05,
    SQUARE_MOV_RADIUS: 0.3,
    HEART_RADIUS: 0.12,
    HEART_ALPHA_INIT: 100,
    HEART_ALPHA_CHANGE: 155,
    BEAT_RADIUS_INIT: 0.32,
    BEAT_RADIUS_CHANGE: 0.1
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
    const heartAnimMark = 0.7;
    
    // Drawing the heart/triangle
    let ta = G.HEART_ALPHA_INIT;
    if (progress <= heartAnimMark) {
        ta = easeInElastic(
            time,
            G.HEART_ALPHA_INIT,
            G.HEART_ALPHA_CHANGE,
            G.ANIM_TIME * heartAnimMark
        );
    } else {
        ta = easeOutExpo (
            time - (G.ANIM_TIME * heartAnimMark),
            G.HEART_ALPHA_INIT + G.HEART_ALPHA_CHANGE,
            -G.HEART_ALPHA_CHANGE,
            G.ANIM_TIME * (1 - heartAnimMark)
        )
    }
    noStroke();
    // fill("#CD5C5C");
    fill(205, 92, 92, ta);
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
    let br;
    if (progress <= heartAnimMark) {
        br = easeInElastic(
            time,
            size.s * G.BEAT_RADIUS_INIT,
            size.s * G.BEAT_RADIUS_CHANGE,
            G.ANIM_TIME * heartAnimMark
        );
    } else {
        br = easeOutExpo(
            time - (G.ANIM_TIME * heartAnimMark),
            size.s * (G.BEAT_RADIUS_INIT + G.BEAT_RADIUS_CHANGE),
            -size.s * G.BEAT_RADIUS_CHANGE,
            G.ANIM_TIME * (1-heartAnimMark)
        );
    }
    noFill();
    stroke('#ddd');
    strokeWeight(2);
    arc(mid.x, mid.y, br, br, 0, PI*2);

    // Draw the squares
    sq1.angle += 0.1;
    const squareAngle = PI*2*progress;
    const sq1pos = createVector(
        mid.x + size.s * G.SQUARE_MOV_RADIUS*Math.cos(squareAngle),
        mid.y + size.s * G.SQUARE_MOV_RADIUS*Math.sin(squareAngle),
    );
    let sq1ps = [];
    for (let i = 0; i < 4; i++) {
        sq1ps[i] = createVector(
            // sq1pos.x + size.s * G.SQUARE_SIZE*Math.cos(i*(sq1.angle + Math.PI/2)),
            // sq1pos.y + size.s * G.SQUARE_SIZE*Math.sin(i*(sq1.angle + Math.PI/2))
            sq1pos.x + size.s * G.SQUARE_SIZE*Math.cos(sq1.angle + i*Math.PI/2),
            sq1pos.y + size.s * G.SQUARE_SIZE*Math.sin(sq1.angle + i*Math.PI/2)
        )
    }
    quad(
        sq1ps[0].x, sq1ps[0].y,
        sq1ps[1].x, sq1ps[1].y,
        sq1ps[2].x, sq1ps[2].y,
        sq1ps[3].x, sq1ps[3].y,
    )
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

/**
 * 
 * @param {number} t Time
 * @param {number} b Initial value
 * @param {number} c Change in value
 * @param {number} d Duration
 * @returns 
 */
function easeInElastic (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}

// @ts-ignore
function easeOutExpo (t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
}