const G = {
    SPAWN_COOLDOWN_MIN: 20,
    SPAWN_COOLDOWN_MAX: 60,
    REST_MIN: 30,
    REST_MAX: 90,
    INVADER_SPEED: 0.003,
    DEFENDER_LERP_AMT: 0.3,
    DEFENDER_SIZE_DEFAULT: 0.03,
    DEFENDER_SIZE_ENLARGED: 0.07,
    BULLET_SPEED: 0.07,
    BULLET_LENGTH: 0.05,
    BULLET_WEIGHT: 0.02,
    MUZZLE_OFFSET: 0.001,
    COLLISION_DIST: 0.05,
    EXPLOSION_SIZE_FINAL_MIN: 0.1,
    EXPLOSION_SIZE_FINAL_MAX: 0.3,
    EXPLOSION_WEIGHT_INIT: 0.1,
    EXPLOSION_WEIGHT_CHANGE: -0.09,
    EXPLOSION_FRAGMENT_SIZE: 0.1
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
    IDLE: 1,
    MOVING: 2,
    FIRING: 3,
    RESTING: 4,
}

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * destPos: import("p5").Vector,
 * state: DState,
 * restCooldown: number,
 * size: number
 * }} Defender
 */
/** @type { Defender [] } */
let defenders;

/** 
 * @typedef {{
 * pos: import("p5").Vector, 
 * hasBeenMarked: boolean, 
 * isDestroyed: boolean 
 * }} Invader
 * */
/** @type { Invader [] } */
let invaders;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * isDestroyed: boolean
 * }} Bullet
 * */
/** @type { Bullet [] } */
let bullets;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * size: number,
 * sizeFinal: number
 * weight: number
 * }} Explosion
 */
/** @type { Explosion [] } */
let explosions;

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
        size: size.s * G.DEFENDER_SIZE_DEFAULT,
        state: DState.RESTING
    });
    defenders.push({
        pos: createVector(windowWidth * 2/3, windowHeight * 3/4),
        destPos: createVector(0, 0),
        restCooldown: random(G.REST_MIN, G.REST_MAX),
        size: size.s * G.DEFENDER_SIZE_DEFAULT,
        state: DState.RESTING
    });
    invaders = [];
    bullets = [];
    explosions = [];

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

        d.size = lerp(d.size, size.s * G.DEFENDER_SIZE_DEFAULT, 0.5);

        switch (d.state) {
            case DState.IDLE:
                const hasFoundTarget = seekTarget(d, invaders);
                if (hasFoundTarget) d.state = DState.MOVING;
                break;

            case DState.MOVING:
                d.pos.x = lerp(d.pos.x, d.destPos.x, G.DEFENDER_LERP_AMT);
                d.pos.y = lerp(d.pos.y, d.destPos.y, G.DEFENDER_LERP_AMT);
                if (d.pos.dist(d.destPos) < 0.1 ) {
                    // d.pos.x = d.destPos.x;
                    d.state = DState.FIRING;
                }
                break;

            case DState.FIRING:
                fireShot(d);
                d.size = size.s * G.DEFENDER_SIZE_ENLARGED;
                d.restCooldown = random(G.REST_MIN, G.REST_MAX)
                d.state = DState.RESTING;
                break;

            case DState.RESTING:
                d.restCooldown--;
                if (d.restCooldown <= 0) {
                    d.state = DState.IDLE;
                }
                break;
        }

        // circle(d.pos.x, d.pos.y, 12);
        drawDefender(d);
    });

    invaders = invaders.filter((i) => {
        i.pos.y += size.s * G.INVADER_SPEED;
        drawInvader(i);

        return i.pos.y < windowHeight * 1.1 && !i.isDestroyed;
    });

    bullets = bullets.filter((b) => {
        b.pos.y -= size.s * G.BULLET_SPEED;

        invaders.forEach(i => {
            if (b.pos.dist(i.pos) < size.s * G.COLLISION_DIST) {
                i.isDestroyed = true;
                b.isDestroyed = true;
                explode(i.pos.x, i.pos.y);
            }
        });

        drawBullet(b);

        return b.pos.y > 0 && !b.isDestroyed;
    });

    explosions = explosions.filter((e) => {
        e.size = lerp(e.size, e.sizeFinal, 0.3);
        e.weight = easeInQuart(
            e.size,
            size.l * G.EXPLOSION_WEIGHT_INIT,
            size.l * G.EXPLOSION_WEIGHT_CHANGE,
            e.sizeFinal
        )
        drawExplosion(e);

        return e.sizeFinal - e.size > 2;
    });
    
    // DEBUG
    // noStroke();
    // fill('#fff');
    // text(bullets.length, 50, 50);
}

// ======== Invaders

function spawnInvader() {
    const posX = random(windowWidth * 0.1, windowWidth * 0.9);
    const posY = random(windowHeight * -0.1, windowHeight * 0.0);
    invaders.push({
        pos: createVector(posX, posY),
        hasBeenMarked: false,
        isDestroyed: false
    });
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
 * 
 * @param {Bullet} b 
 */
function drawBullet(b) {
    const bSize = size.s * G.BULLET_LENGTH/2;

    noFill();
    stroke('#007de3');
    strokeWeight(size.s * G.BULLET_WEIGHT);
    line( b.pos.x, b.pos.y + bSize,
        b.pos.x, b.pos.y - bSize);

    // circle(b.pos.x, b.pos.y, 12)
}

/**
 * 
 * @param {Explosion} e 
 */
function drawExplosion(e) {
    noFill();
    rectMode(RADIUS);
    stroke("#f9ff8f");
    strokeWeight(e.weight);
    rect(e.pos.x, e.pos.y, e.size, e.size);

    for (let i = 0; i < 4; i++) {
        rect(
            e.pos.x + e.size * 1.5 * Math.cos(Math.PI/2 * i),
            e.pos.y + e.size * 1.5 * Math.sin(Math.PI/2 * i),
            size.s*G.EXPLOSION_FRAGMENT_SIZE/e.size,
            size.s*G.EXPLOSION_FRAGMENT_SIZE/e.size,
        )
    }
}

// ======== Defenders

/**
 * 
 * @param {Defender} d 
 */
function drawDefender(d) {
    noStroke();
    fill("#ddd");
    const top = {x: d.pos.x, y: d.pos.y - d.size};
    const bL = {x: d.pos.x - d.size, y: d.pos.y + d.size/2};
    const bR = {x: d.pos.x + d.size, y: d.pos.y + d.size/2};
    triangle(top.x, top.y, bL.x, bL.y, bR.x, bR.y);

    // // DEBUG
    // fill("#fff");
    // text(d.state, d.pos.x, d.pos.y - 20);
}

/**
 * 
 * @param {Defender} d 
 */
function fireShot(d) {
    bullets.push({
        pos: createVector(d.pos.x, d.pos.y + size.s * G.MUZZLE_OFFSET),
        isDestroyed: false
    })
}

/**
 * 
 * @param {number} _x 
 * @param {number} _y 
 */
function explode(_x, _y) {
    explosions.push({
        pos: createVector(_x, _y),
        size: 1,
        sizeFinal: size.s * random(G.EXPLOSION_SIZE_FINAL_MIN, G.EXPLOSION_SIZE_FINAL_MAX),
        weight: size.s * G.EXPLOSION_WEIGHT_INIT
    })
}

// ======== Misc

/**
 * Set a random suitable Invader as a target for the Defender
 * @param { Defender } d 
 * @param { Invader [] } invaders
 * @returns { boolean } hasFoundTarget
 */
function seekTarget(d, invaders) {

    let potentialTargets = invaders.filter(i => {
        return windowHeight * 0.05 < i.pos.y
            && i.pos.y < windowHeight * 0.8
            && !i.hasBeenMarked
    });

    if (potentialTargets.length === 0) return false;

    /** @type {Invader} */
    let target = potentialTargets[0];
    potentialTargets.forEach(t => {
        if (t.pos.y > target.pos.y) target = t;
    });

    target.hasBeenMarked = true;
    d.destPos = createVector(
        target.pos.x,
        random(
            target.pos.y + size.s * 0.15,
            windowHeight * 0.95
        )
    );

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

/**
 * 
 * @param {number} t 
 * @param {number} b 
 * @param {number} c 
 * @param {number} d 
 * @returns 
 */
function easeInQuart (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
}