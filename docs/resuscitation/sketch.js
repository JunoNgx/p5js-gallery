const G = {
    ANIM_TIME: 180,
    SQUARE_SIZE: 0.05,
    SQUARE_MOV_RADIUS: 0.35,
    SQUARE_WEIGHT: 8,
    HEART_RADIUS: 0.10,
    HEART_ALPHA_INIT: 55,
    HEART_ALPHA_CHANGE: 200,
    BEAT_RADIUS_INIT: 0.30,
    BEAT_RADIUS_CHANGE: 0.17,
    BEAT_WEIGHT_INIT: 0.03,
    BEAT_WEIGHT_CHANGE: 0.08,
    RADIAL_POSITION_MARK: Math.PI*2,
    SPLASH_WEIGHT: 0.05,
    SPLASH_SPEED: 0.1
};

/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;
/** @type { number } */
let time;

/** @typedef { {radialPos: number} } Square */
/** @type { Square [] } */
let squares;

/** @typedef { {radius: number, isRunning: boolean} } Splash*/
/** @type { Splash } */
let splash;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);

    squares = [
        {radialPos: -Math.PI/2},
        {radialPos: -Math.PI/2 + Math.PI * 2/3},
        {radialPos: -Math.PI/2 + Math.PI * 4/3},
    ];

    splash = {radius: size.l * 10, isRunning: false};

    time = 0;

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(47);
    time++;
    if (time > G.ANIM_TIME) {
        time = 0;
    }
    const progress = time/G.ANIM_TIME;
    const heartAnimMark = 0.7;

    // Drawing the splash
    if (time > (G.ANIM_TIME * heartAnimMark) && !splash.isRunning) {
        splash.radius = 0;
        splash.isRunning = true;
    }
    if (splash.isRunning) {
        if (splash.radius < size.l * 5) {
            splash.radius += size.s * G.SPLASH_SPEED;
        } else {
            splash.isRunning = false;
        }
    }

    noFill();
    stroke("#CD5C5C");
    strokeWeight(size.s * G.SPLASH_WEIGHT);
    arc(mid.x, mid.y, splash.radius, splash.radius, 0, Math.PI*2);
    
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
    let bw = 2;
    // if (progress <= heartAnimMark) {
    //     bw = easeInElastic(
    //         time,
    //         size.s * G.BEAT_WEIGHT_INIT,
    //         size.s * G.BEAT_WEIGHT_CHANGE,
    //         G.ANIM_TIME * heartAnimMark
    //     );
    // } else {
    //     bw = easeOutExpo(
    //         time - (G.ANIM_TIME * heartAnimMark),
    //         size.s * (G.BEAT_WEIGHT_INIT + G.BEAT_WEIGHT_CHANGE),
    //         -size.s * G.BEAT_WEIGHT_CHANGE,
    //         G.ANIM_TIME * (1-heartAnimMark)
    //     );
    // }
    noFill();
    stroke('#ddd');
    strokeWeight(bw);
    arc(mid.x, mid.y, br, br, 0, PI*2);

    // Draw the squares
    // const squareRadialPosition = PI*2*progress;
    /** @type { number } */
    let squareRadialPosition;
    squareRadialPosition = easeLinear(
        time,
        0,
        G.RADIAL_POSITION_MARK,
        G.ANIM_TIME
    );

    strokeWeight(G.SQUARE_WEIGHT);
    const squareAngle = progress * Math.PI * 8;
    squares.forEach(s => {
        const squarePos = createVector(
            mid.x + size.s * G.SQUARE_MOV_RADIUS*Math.cos(squareRadialPosition + s.radialPos),
            mid.y + size.s * G.SQUARE_MOV_RADIUS*Math.sin(squareRadialPosition + s.radialPos),
        );
        let points = [];
        beginShape();
        for (let i = 0; i < 4; i++) {
            points[i] = createVector(
                squarePos.x + size.s * G.SQUARE_SIZE*Math.cos(squareAngle + i*Math.PI/2),
                squarePos.y + size.s * G.SQUARE_SIZE*Math.sin(squareAngle + i*Math.PI/2)
            )
            vertex(points[i].x, points[i].y);
        }
        endShape();
        // endShape(CLOSE); // This is the correct way to draw a full square
    });
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

//@ts-ignore
function easeInOutQuad (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

//@ts-ignore
function easeLinear (t, b, c, d) {
    return c * t / d + b;
}

//@ts-ignore
function easeInOutSine (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}