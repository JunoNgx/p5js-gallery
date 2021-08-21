const G = {
    SPAWN_COOLDOWN_MIN: 20,
    SPAWN_COOLDOWN_MAX: 60,
    REST_MIN: 30,
    REST_MAX: 90,
    INVADER_SPEED: 0.001
};
/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;
/** @type { number } */
let time; 

/** @typedef { number } DefenderState */
/** @enum { DefenderState } */
const DState = {
    SEEKING: 1,
    MOVING: 2,
    FIRING: 3,
    RESTING: 4,
    IDLE: 5
}

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * destPos: import("p5").Vector,
 * state: DState,
 * restCooldown: number
 * }} Defender
 */
/** @type { Defender [] } */
let defenders;

/** @typedef {{ pos: import("p5").Vector, hasBeenMarked: boolean }} Invader */
/** @type { Invader [] } */
let invaders;

/** @type {number} */
let spawnCooldown;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);
    time = 0;

    defenders = [];
    defenders.push({
        pos: createVector(windowWidth * 1/3, windowHeight * 3/4),
        destPos: createVector(0, 0),
        restCooldown: random(G.REST_MIN, G.REST_MAX),
        state: DState.RESTING
    });
    defenders.push({
        pos: createVector(windowWidth * 2/3, windowHeight * 3/4),
        destPos: createVector(0, 0),
        restCooldown: random(G.REST_MIN, G.REST_MAX),
        state: DState.RESTING
    });
    invaders = [];
    spawnCooldown = random(G.SPAWN_COOLDOWN_MIN, G.SPAWN_COOLDOWN_MAX);

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(47);

    time++;

    spawnCooldown--;
    if (spawnCooldown <= 0) {
        spawnInvader();
        spawnCooldown = random(G.SPAWN_COOLDOWN_MIN, G.SPAWN_COOLDOWN_MAX);
    }

    defenders.forEach((d) => {
        switch (d.state) {
            case DState.MOVING:

                break;
            case DState.SEEKING:

                break;
            case DState.FIRING:

                break;
            case DState.RESTING:
                d.restCooldown--;
                if (d.restCooldown <= 0) {
                    d.state = DState.IDLE;
                }
                break;
            case DState.IDLE:
                const hasFoundTarget = seekTarget(d, invaders);
                if (hasFoundTarget) d.state = DState.MOVING;
                break;
        }

        // circle(d.pos.x, d.pos.y, 12);
        drawDefender(d);
    });

    invaders.forEach((i) => {
        i.pos.y += size.s * G.INVADER_SPEED;

        drawInvader(i);
    });
    
    noStroke();
    fill('#fff');
    text(invaders.length, 50, 50);
}

function spawnInvader() {
    const posX = random(windowWidth * 0.1, windowWidth * 0.9);
    const posY = random(windowHeight * -0.1, windowHeight * 0.0);
    invaders.push({
        pos: createVector(posX, posY),
        hasBeenMarked: false
    });
}

/**
 * 
 * @param {Defender} d 
 */
function drawDefender(d) {
    noFill();
    strokeWeight(2);
    stroke('#ddd');
    const iSize = size.s * 0.03;
    const top = {x: d.pos.x, y: d.pos.y - iSize};
    const bL = {x: d.pos.x - iSize, y: d.pos.y + iSize/2};
    const bR = {x: d.pos.x + iSize, y: d.pos.y + iSize/2};
    triangle(top.x, top.y, bL.x, bL.y, bR.x, bR.y);

    fill("#fff");
    text(d.state, d.pos.x, d.pos.y - 20);
}

/**
 * 
 * @param {Invader} i 
 */
function drawInvader(i) {
    fill("#CD5C5C");
    noStroke();
    const dSize = size.s * 0.03;
    const top = {x: i.pos.x, y: i.pos.y + dSize};
    const bL = {x: i.pos.x - dSize, y: i.pos.y - dSize/2};
    const bR = {x: i.pos.x + dSize, y: i.pos.y - dSize/2};
    triangle(top.x, top.y, bL.x, bL.y, bR.x, bR.y);
}

/**
 * Set a random suitable Invader as a target for the Defender
 * @param { Defender } d 
 * @param { Invader [] } invaders
 * @returns { boolean } hasFoundTarget
 */
function seekTarget(d, invaders) {

    if (invaders.length === 0) return false;
    else if (invaders.length === 1 && invaders[0].hasBeenMarked) return false;

    /** @type {Invader} */
    let target = random(invaders);
    while (target.hasBeenMarked || target.pos.y > windowHeight * 0.6) {
        target = random(invaders);
    } 
    target.hasBeenMarked = true;
    d.destPos = createVector(target.pos.x, target.pos.y);

    return true;
}

/**
 * 
 * @param {Invader} i 
 * @returns {boolean}
 */
function isOnScreen(i) {
    return 0 < i.pos.y && i.pos.y < windowHeight;
}